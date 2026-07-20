/**
 * Raynet CRM v2 – n8n custom node.
 * Thin router: delegates to entity-specific configs for body building / loadOptions.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, ILoadOptionsFunctions, INodePropertyOptions, IDataObject } from 'n8n-workflow';

import { raynetRequest, getListParams, loadOwners, loadSecurityLevels, stringToOperationType, EntityConfig, OperationType } from './helpers';

import { getAccountProperties, accountLoadOptions, accountConfig } from './account';
import { getPersonProperties, personLoadOptions, personConfig } from './person';
import { getDealProperties, dealLoadOptions, dealConfig } from './deal';
import { getQuoteProperties, quoteLoadOptions, quoteConfig } from './quote';
import { getSalesOrderProperties, salesOrderLoadOptions, salesOrderConfig } from './salesOrder';
import { getProjectProperties, projectLoadOptions, projectConfig } from './project';
import { getLeadProperties, leadLoadOptions, leadConfig } from './lead';
import { getPriceListProperties, priceListLoadOptions, priceListConfig } from './priceList';
import { getProductProperties, productLoadOptions, productConfig } from './product';
import { getInvoiceProperties, invoiceLoadOptions, invoiceConfig } from './invoice';
import { getDocumentProperties, documentLoadOptions, documentConfig } from './document';
import { getFolderProperties, folderLoadOptions, folderConfig } from './folder';
import { getTaskProperties, taskLoadOptions, taskConfig } from './task';
import { getCallProperties, callLoadOptions, callConfig } from './call';
import { getMeetingProperties, meetingLoadOptions, meetingConfig } from './meeting';
import { getEmailProperties, emailLoadOptions, emailConfig } from './email';
import { getEventProperties, eventLoadOptions, eventConfig } from './event';
import { getLetterProperties, letterLoadOptions, letterConfig } from './letter';
import { getMassEmailProperties, massEmailLoadOptions, massEmailConfig } from './massEmail';

// ---------------------------------------------------------------------------
// Resources & entity registry
// ---------------------------------------------------------------------------

const RESOURCE_OPTIONS = [
    { name: 'Account', value: 'account', description: 'Contact – account (company or individual)' },
    { name: 'Deal', value: 'deal', description: 'Business case / deal' },
    { name: 'Contact', value: 'person', description: 'Contact – person (individual contact)' },
    { name: 'Quote', value: 'quote', description: 'Quote (offer)' },
    { name: 'Lead', value: 'lead', description: 'Lead' },
    { name: 'Price List', value: 'priceList', description: 'Price list' },
    { name: 'Product', value: 'product', description: 'Product' },
    { name: 'Project', value: 'project', description: 'Project' },
    { name: 'Document', value: 'document', description: 'Document (DMS)' },
    { name: 'Folder', value: 'folder', description: 'DMS folder' },
    { name: 'Invoice', value: 'invoice', description: 'Invoice' },
    { name: 'Sales Order', value: 'salesOrder', description: 'Sales order' },
    { name: 'Task', value: 'task', description: 'Task' },
    { name: 'Call', value: 'call', description: 'Phone call' },
    { name: 'Meeting', value: 'meeting', description: 'Meeting' },
    { name: 'Email', value: 'email', description: 'Email activity' },
    { name: 'Event', value: 'event', description: 'Event' },
    { name: 'Letter', value: 'letter', description: 'Letter' },
    { name: 'Mass Email', value: 'massEmail', description: 'Mass email campaign' },
];

const ENTITY_MAP: Record<string, EntityConfig> = {
    account: accountConfig,
    deal: dealConfig,
    person: personConfig,
    quote: quoteConfig,
    lead: leadConfig,
    priceList: priceListConfig,
    product: productConfig,
    invoice: invoiceConfig,
    document: documentConfig,
    folder: folderConfig,
    project: projectConfig,
    salesOrder: salesOrderConfig,
    task: taskConfig,
    call: callConfig,
    meeting: meetingConfig,
    email: emailConfig,
    event: eventConfig,
    letter: letterConfig,
    massEmail: massEmailConfig,
};

const allLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getUsers: loadOwners,
    getSecurityLevels: loadSecurityLevels,
    ...accountLoadOptions,
    ...personLoadOptions,
    ...dealLoadOptions,
    ...quoteLoadOptions,
    ...leadLoadOptions,
    ...priceListLoadOptions,
    ...projectLoadOptions,
    ...salesOrderLoadOptions,
    ...productLoadOptions,
    ...invoiceLoadOptions,
    ...documentLoadOptions,
    ...folderLoadOptions,
    ...taskLoadOptions,
    ...callLoadOptions,
    ...meetingLoadOptions,
    ...emailLoadOptions,
    ...eventLoadOptions,
    ...letterLoadOptions,
    ...massEmailLoadOptions,
};

// ---------------------------------------------------------------------------
// Node class
// ---------------------------------------------------------------------------

export class Raynet implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Raynet CRM',
        name: 'raynet',
        icon: 'file:raynetCrm.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
        description: 'Consume Raynet CRM v2 API (accounts, contacts, …)',
        defaultVersion: 1,
        defaults: { name: 'Raynet CRM' },
        credentials: [{ name: 'raynetApi', required: true }],
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                default: 'account',
                options: RESOURCE_OPTIONS,
            },
            ...getAccountProperties(),
            ...getDealProperties(),
            ...getPersonProperties(),
            ...getQuoteProperties(),
            ...getLeadProperties(),
            ...getPriceListProperties(),
            ...getProjectProperties(),
            ...getSalesOrderProperties(),
            ...getProductProperties(),
            ...getInvoiceProperties(),
            ...getDocumentProperties(),
            ...getFolderProperties(),
            ...getTaskProperties(),
            ...getCallProperties(),
            ...getMeetingProperties(),
            ...getEmailProperties(),
            ...getEventProperties(),
            ...getLetterProperties(),
            ...getMassEmailProperties(),
        ],
        usableAsTool: true,
    };

    methods = {
        loadOptions: allLoadOptions,
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = stringToOperationType(this.getNodeParameter('operation', 0)) as OperationType;
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const config = ENTITY_MAP[resource];
        if (!config) {
            throw new Error(`Resource "${resource}" is not implemented.`);
        }

        // ----- Get Many -----
        if (operation === OperationType.GET_MANY) {
            const qs = getListParams.call(this);
            if (config.getManyExtraQs) {
                Object.assign(qs, config.getManyExtraQs(this));
            }

            const res = (await raynetRequest.call(this, 'GET', config.listPath, undefined, qs)) as {
                data?: unknown[];
            };
            for (let i = 0; i < (res?.data ?? []).length; i++) {
                returnData.push({ json: (res.data as IDataObject[])[i], pairedItem: { item: i } });
            }
            return [returnData];
        }

        // ----- Single-item operations -----
        // GET and CREATE always run once regardless of input item count.
        // UPDATE, DELETE, tags, lifecycle, and item operations run once per input item
        // so expressions like {{ $json.id }} can be used to process a batch.
        const singleRunOps = new Set<OperationType>([OperationType.CREATE, OperationType.GET]);
        const iterations = singleRunOps.has(operation) ? 1 : items.length;

        const postActions: Record<string, string> = {
            [OperationType.LOCK]: 'lock',
            [OperationType.UNLOCK]: 'unlock',
            [OperationType.INVALIDATE]: 'invalid',
            [OperationType.RENEW_VALIDITY]: 'valid',
        };

        for (let i = 0; i < iterations; i++) {
            let id: number;
            let body: object | undefined;
            let tag: string;
            try {
                switch (operation) {
                    case OperationType.CREATE: {
                        // special case for file upload in document creation
                        // if (resource === 'document' && this.getNodeParameter('infoType', i) === 'file') {
                        //     const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                        //     const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                        //     if (!buffer) {
                        //         throw new Error(`No binary data found on item ${i} in property "${binaryPropertyName}"`);
                        //     }

                        //     const form = new FormData();
                        //     form.append('file', buffer);
                        //     // call /fileUpload endpoint to upload the file and get a UUID
                        //     const response = await raynetRequest.call(this, 'POST', '/fileUpload/', form, undefined, 'multipart/form-data') as { data?: { uuid: string, fileName: string, contentType: string, fileSize: number } };
                        //     body = {
                        //         ...config.buildBody(this, 'create'),
                        //         file: response.data,
                        //     }
                        // }
                        // else { // normal create
                            body = config.buildBody(this, 'create');
                        // }
                        const createRes = (await raynetRequest.call(this, 'PUT', config.listPath, body)) as {
                            success?: boolean;
                            data?: { id: number };
                        };
                        returnData.push({
                            json: { id: createRes?.data?.id, success: createRes?.success } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;
                    }

                    case OperationType.UPDATE:
                        id = this.getNodeParameter(config.idParam, i) as number;
                        body = config.buildBody(this, 'update');
                        await raynetRequest.call(this, 'POST', `${config.singlePath}${id}/`, body);
                        returnData.push({
                            json: { id, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;

                    case OperationType.GET: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const getRes = (await raynetRequest.call(this, 'GET', `${config.singlePath}${id}/`)) as { data?: unknown };
                        const raw = getRes?.data;
                        const record = Array.isArray(raw) ? ((raw[0] ?? {}) as IDataObject) : ((raw ?? {}) as IDataObject);
                        returnData.push({ json: record, pairedItem: { item: i } });
                        break;
                    }

                    case OperationType.DELETE:
                        id = this.getNodeParameter(config.idParam, i) as number;
                        await raynetRequest.call(this, 'DELETE', `${config.singlePath}${id}/${config.getDeleteSuffix?.(this, i) ?? ''}`);
                        returnData.push({
                            json: { id, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;

                    case OperationType.ADD_TAG:
                        id = this.getNodeParameter(config.idParam, i) as number;
                        tag = this.getNodeParameter('tag', i) as string;
                        await raynetRequest.call(this, 'PUT', `${config.singlePath}${id}/tag`, { tag });
                        returnData.push({
                            json: { id, tag, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;

                    case OperationType.DELETE_TAG:
                        id = this.getNodeParameter(config.idParam, i) as number;
                        tag = this.getNodeParameter('tag', i) as string;
                        await raynetRequest.call(this, 'DELETE', `${config.singlePath}${id}/tag`, { tag });
                        returnData.push({
                            json: { id, tag, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;

                    case OperationType.ADD_ITEM: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const addBody = config.buildAddItemBody!(this, i);
                        await raynetRequest.call(this, 'PUT', `${config.singlePath}${id}/item`, addBody);
                        returnData.push({
                            json: { dealId: id, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;
                    }

                    case OperationType.MODIFY_ITEM: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const itemId = this.getNodeParameter(config.itemIdParam!, i) as number;
                        const modifyBody = config.buildModifyItemBody!(this, i);
                        await raynetRequest.call(this, 'POST', `${config.singlePath}${id}/item/${itemId}/`, modifyBody);
                        returnData.push({
                            json: { dealId: id, itemId, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;
                    }

                    case OperationType.DELETE_ITEM: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const itemId = this.getNodeParameter(config.itemIdParam!, i) as number;
                        await raynetRequest.call(this, 'DELETE', `${config.singlePath}${id}/item/${itemId}/`);
                        returnData.push({
                            json: { dealId: id, itemId, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;
                    }

                    case OperationType.ADD_PARTICIPANT: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const addParticipantBody = config.buildAddParticipantBody!(this, i);
                        const addParticipantRes = (await raynetRequest.call(this, 'PUT', `${config.singlePath}${id}/${config.participantPath}`, addParticipantBody)) as { data?: unknown[] };
                        for (const record of addParticipantRes?.data ?? []) {
                            returnData.push({ json: record as IDataObject, pairedItem: { item: i } });
                        }
                        break;
                    }

                    case OperationType.DELETE_PARTICIPANT: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const participantId = this.getNodeParameter(config.participantIdParam!, i) as number;
                        await raynetRequest.call(this, 'DELETE', `${config.singlePath}${id}/${config.participantPath}/${participantId}/`);
                        returnData.push({
                            json: { projectId: id, participantId, success: true } as IDataObject,
                            pairedItem: { item: i },
                        });
                        break;
                    }

                    case OperationType.LIST_PARTICIPANTS: {
                        id = this.getNodeParameter(config.idParam, i) as number;
                        const listParticipantsRes = (await raynetRequest.call(this, 'GET', `${config.singlePath}${id}/${config.participantPath}/`)) as { data?: unknown[] };
                        for (const record of listParticipantsRes?.data ?? []) {
                            returnData.push({ json: record as IDataObject, pairedItem: { item: i } });
                        }
                        break;
                    }

                    default:
                        // Post-only actions (lock/unlock, invalidate/renew validity)
                        if (Object.keys(postActions).includes(operation)) {
                            const id = this.getNodeParameter(config.idParam, i) as number;
                            await raynetRequest.call(this, 'POST', `${config.singlePath}${id}/${postActions[operation]}`);
                            returnData.push({
                                json: { id, success: true } as IDataObject,
                                pairedItem: { item: i },
                            });
                        } else {
                            throw new Error(`Operation "${operation}" is not implemented for resource "${resource}".`);
                        }
                }
            } catch (err) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: (err as Error).message } as IDataObject,
                        pairedItem: { item: i },
                    });
                } else {
                    throw err;
                }
            }
        }
        return [returnData];
    }
}
