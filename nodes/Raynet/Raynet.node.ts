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

// ---------------------------------------------------------------------------
// Resources & entity registry
// ---------------------------------------------------------------------------

const RESOURCE_OPTIONS = [
    { name: 'Account', value: 'account', description: 'Contact – account (company or individual)' },
    { name: 'Deal', value: 'deal', description: 'Business case / deal' },
    { name: 'Person', value: 'person', description: 'Contact – person (individual contact)' },
    { name: 'Quote', value: 'quote', description: 'Quote (offer)' },
];

const ENTITY_MAP: Record<string, EntityConfig> = {
    account: accountConfig,
    deal: dealConfig,
    person: personConfig,
    quote: quoteConfig,
};

const allLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getUsers: loadOwners,
    getSecurityLevels: loadSecurityLevels,
    ...accountLoadOptions,
    ...personLoadOptions,
    ...dealLoadOptions,
    ...quoteLoadOptions,
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
                        body = config.buildBody(this, 'create');
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
                        await raynetRequest.call(this, 'DELETE', `${config.singlePath}${id}/`);
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
