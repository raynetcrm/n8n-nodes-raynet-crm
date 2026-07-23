/**
 * Shared factory for standard activity entities:
 * Task, Call, Meeting, Email, Event, Letter.
 */

import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, createPicklistLoader, processCommonField, showOptionsForOp } from '../helpers';

// ---------------------------------------------------------------------------
// Load options — shared by all standard activity entities
// ---------------------------------------------------------------------------

export const activityLoadOptions = {
    getActivityCategories: createPicklistLoader('/activityCategory/'),
};

// ---------------------------------------------------------------------------
// Entity definition
// ---------------------------------------------------------------------------

export interface ActivityDef {
    resource: string;
    idParam: string;
    descriptionLabel: string;
    /** If undefined, Solution field is omitted */
    solutionLabel?: string;
    /** Extra required create-time fields — Task: resolver, deadline */
    extraRequiredCreate?: INodeProperties[];
}

// ---------------------------------------------------------------------------
// Body builder factory
// ---------------------------------------------------------------------------

export function buildActivityBody(def: ActivityDef) {
    return function (ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
        const body: Record<string, unknown> = {};

        if (operation === 'create') {
            body.title = ctx.getNodeParameter('title', 0) as string;
            body.priority = ctx.getNodeParameter('priority', 0) as string;
            body.owner = ctx.getNodeParameter('owner', 0) as number;

            for (const prop of def.extraRequiredCreate ?? []) {
                const val = ctx.getNodeParameter(prop.name, 0);
                if (val !== undefined && val !== null && val !== '') {
                    body[prop.name] = val;
                }
            }
        }

        const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
        const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

        for (const [key, value] of Object.entries(additional)) {
            if (value === undefined || value === null || value === '') continue;
            if (processCommonField(body, key, value)) continue;
            body[key] = value;
        }

        return body;
    };
}

// ---------------------------------------------------------------------------
// Properties factory
// ---------------------------------------------------------------------------

const PRIORITY_OPTIONS = [
    { name: 'Critical', value: 'CRITICAL' },
    { name: 'Default', value: 'DEFAULT' },
    { name: 'Minor', value: 'MINOR' },
];

const STATUS_OPTIONS = [
    { name: 'New', value: 'NEW' },
    { name: 'Scheduled', value: 'SCHEDULED' },
    { name: 'Completed', value: 'COMPLETED' },
    { name: 'Cancelled', value: 'CANCELLED' },
];

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Title', value: 'title' },
    { name: 'Scheduled From', value: 'scheduledFrom' },
    { name: 'Scheduled Till', value: 'scheduledTill' },
    { name: 'Date of Completion', value: 'completed' },
    { name: 'Category', value: 'category' },
    { name: 'Owner', value: 'owner' },
    { name: 'Status', value: 'status' },
    { name: 'Tags', value: 'tags' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

function sharedOptionalFields(def: ActivityDef): INodeProperties[] {
    const fields: INodeProperties[] = [
        {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            default: '',
            options: STATUS_OPTIONS,
            description: 'Must be COMPLETED or CANCELLED for the completion date to apply',
        },
        {
            displayName: 'Category Name or ID',
            name: 'category',
            type: 'options',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            default: '',
            typeOptions: { loadOptionsMethod: 'getActivityCategories' },
        },
        {
            displayName: 'Security Level Name or ID',
            name: 'securityLevel',
            type: 'options',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            default: '',
            typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
        },
        { displayName: 'Scheduled From', name: 'scheduledFrom', type: 'dateTime', default: '' },
        { displayName: 'Scheduled Till', name: 'scheduledTill', type: 'dateTime', default: '' },
        {
            displayName: 'Date of Completion',
            name: 'completed',
            type: 'dateTime',
            default: '',
            description: 'Requires Status set to COMPLETED or CANCELLED',
        },
        { displayName: def.descriptionLabel, name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
    ];

    if (def.solutionLabel) {
        fields.push({ displayName: def.solutionLabel, name: 'solution', type: 'string', typeOptions: { rows: 3 }, default: '' });
    }

    fields.push(
        { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated list of tags' },
        { displayName: 'Contact ID', name: 'person', type: 'number', default: 0 },
        { displayName: 'Account ID', name: 'company', type: 'number', default: 0 },
        { displayName: 'Deal ID', name: 'businessCase', type: 'number', default: 0 },
        { displayName: 'Quote ID', name: 'offer', type: 'number', default: 0 },
        { displayName: 'Sales Order ID', name: 'salesOrder', type: 'number', default: 0 },
        { displayName: 'Project ID', name: 'project', type: 'number', default: 0 },
        { displayName: 'Activity ID', name: 'activity', type: 'number', default: 0 },
    );

    return fields;
}

function idField(def: ActivityDef, ops: OperationType | OperationType[]): INodeProperties {
    const label = def.idParam.replace(/Id$/, ' ID').replace(/^./, (c) => c.toUpperCase());
    return {
        displayName: label,
        name: def.idParam,
        type: 'number',
        required: true,
        default: 0,
        displayOptions: showOptionsForOp(ops, def.resource),
    };
}

export function getActivityProperties(def: ActivityDef): INodeProperties[] {
    const op = (ops: OperationType | OperationType[]) => showOptionsForOp(ops, def.resource);

    return [
        // Operation selector
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'getMany',
            displayOptions: { show: { resource: [def.resource] } },
            options: [
                { name: 'Create', value: 'create', description: `Create a ${def.resource}`, action: `Create a ${def.resource}` },
                { name: 'Delete', value: 'delete', description: `Delete a ${def.resource}`, action: `Delete a ${def.resource}` },
                { name: 'Get', value: 'get', description: `Get a ${def.resource} by ID`, action: `Get a ${def.resource} by ID` },
                { name: 'Get Many', value: 'getMany', description: `List ${def.resource}s with filters`, action: `List ${def.resource}s with filters` },
                { name: 'Lock', value: 'lock', description: `Lock a ${def.resource} record`, action: `Lock a ${def.resource} record` },
                { name: 'Unlock', value: 'unlock', description: `Unlock a ${def.resource} record`, action: `Unlock a ${def.resource} record` },
                { name: 'Update', value: 'update', description: `Update a ${def.resource}`, action: `Update a ${def.resource}` },
            ],
        },

        // Create — required
        {
            displayName: 'Title',
            name: 'title',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Priority',
            name: 'priority',
            type: 'options',
            required: true,
            default: 'DEFAULT',
            options: PRIORITY_OPTIONS,
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Owner Name or ID',
            name: 'owner',
            type: 'options',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
            required: true,
            default: '',
            typeOptions: { loadOptionsMethod: 'getUsers' },
            displayOptions: op(OperationType.CREATE),
        },
        ...(def.extraRequiredCreate ?? []).map((p) => ({ ...p, displayOptions: op(OperationType.CREATE) })),
        {
            displayName: 'Additional Fields',
            name: 'additionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.CREATE),
            options: sharedOptionalFields(def),
        },

        // Update
        idField(def, OperationType.UPDATE),
        {
            displayName: 'Update Fields',
            name: 'updateAdditionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.UPDATE),
            options: [
                { displayName: 'Title', name: 'title', type: 'string', default: '' },
                { displayName: 'Priority', name: 'priority', type: 'options', default: '', options: PRIORITY_OPTIONS },
                ...sharedOptionalFields(def),
            ],
        },

        // Get
        idField(def, OperationType.GET),

        // Get Many
        {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            default: false,
            description: 'Whether to return all results or only up to a given limit',
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            description: 'Max number of results to return',
            default: 50,
            typeOptions: { minValue: 1 },
            displayOptions: op(OperationType.GET_MANY),
        },
        { displayName: 'Offset', name: 'offset', type: 'number', default: 0, displayOptions: op(OperationType.GET_MANY) },
        {
            displayName: 'Sort Column',
            name: 'sortColumn',
            type: 'options',
            default: 'scheduledFrom',
            options: SORT_COLUMNS,
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Sort Direction',
            name: 'sortDirection',
            type: 'options',
            default: 'ASC',
            options: [{ name: 'Ascending', value: 'ASC' }, { name: 'Descending', value: 'DESC' }],
            displayOptions: op(OperationType.GET_MANY),
        },
        { displayName: 'Full-Text Search', name: 'fulltext', type: 'string', default: '', displayOptions: op(OperationType.GET_MANY) },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            typeOptions: { multipleValues: true },
            placeholder: 'Add filter',
            default: {},
            displayOptions: op(OperationType.GET_MANY),
            options: [
                {
                    displayName: 'Filter',
                    name: 'filter',
                    values: [
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            default: 'title',
                            options: [
                                { name: 'ID', value: 'id' },
                                { name: 'Title', value: 'title' },
                                { name: 'Status', value: 'status' },
                                { name: 'Owner ID', value: 'owner-id' },
                                { name: 'Category ID', value: 'category-id' },
                                { name: 'Scheduled From', value: 'scheduledFrom' },
                                { name: 'Scheduled Till', value: 'scheduledTill' },
                                { name: 'Date of Completion', value: 'completed' },
                                ...(def.idParam === 'taskId' ? [{ name: 'Deadline', value: 'deadline' }] : []),
                                { name: 'Participant Contact ID', value: 'personFilter' },
                                { name: 'Related Account ID', value: 'companyContextFilter' },
                                { name: 'Related Lead ID', value: 'leadContextFilter' },
                                { name: 'Related Deal ID', value: 'businessCase' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                            ],
                        },
                        { displayName: 'Operator', name: 'operator', type: 'options', default: 'EQ', options: FILTER_OPERATORS },
                        { displayName: 'Value', name: 'value', type: 'string', default: '' },
                    ],
                },
            ],
        },
        { displayName: 'View', name: 'view', type: 'string', default: '', displayOptions: op(OperationType.GET_MANY) },

        // Delete
        idField(def, OperationType.DELETE),

        // Lock / Unlock
        idField(def, [OperationType.LOCK, OperationType.UNLOCK]),
    ];
}
