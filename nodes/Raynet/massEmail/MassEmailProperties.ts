import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

const RESOURCE = 'massEmail';
const op = (ops: OperationType | OperationType[]) => showOptionsForOp(ops, RESOURCE);

const SOURCE_OPTIONS = [
    { name: 'Quanda', value: 'QUANDA' },
    { name: 'SmartEmailing', value: 'SMARTEMAILING' },
    { name: 'Mailchimp', value: 'MAILCHIMP' },
    { name: 'Mailgun', value: 'MAILGUN' },
    { name: 'Sendgrid', value: 'SENDGRID' },
    { name: 'Sparkpost', value: 'SPARKPOST' },
    { name: 'Ecomail', value: 'ECOMAIL' },
];

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Title', value: 'title' },
    { name: 'Campaign Name', value: 'campaignName' },
    { name: 'Source', value: 'source' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const sharedOptionalFields: INodeProperties[] = [
    { displayName: 'Date Sent', name: 'completed', type: 'dateTime', default: '' },
    { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
    { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated list of tags' },
    { displayName: 'Campaign Name', name: 'campaignName', type: 'string', default: '' },
    { displayName: 'External Overview URL', name: 'externalOverviewUrl', type: 'string', default: '' },
    { displayName: 'External Thumbnail URL', name: 'externalThumbnailUrl', type: 'string', default: '' },
    {
        displayName: 'Stats',
        name: 'stats',
        type: 'fixedCollection',
        default: {},
        options: [
            {
                displayName: 'Stats Entry',
                name: 'statsEntry',
                values: [
                    { displayName: 'Sent', name: 'sent', type: 'number', default: 0 },
                    { displayName: 'Clicked', name: 'clicked', type: 'number', default: 0 },
                    { displayName: 'Opened', name: 'opened', type: 'number', default: 0 },
                    { displayName: 'Unsubscribed', name: 'unsubscribed', type: 'number', default: 0 },
                ],
            },
        ],
    },
];

export const getMassEmailProperties = (): INodeProperties[] => [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'getMany',
        displayOptions: { show: { resource: [RESOURCE] } },
        options: [
            { name: 'Create', value: 'create', description: 'Create a mass email campaign record', action: 'Create a mass email campaign record' },
            { name: 'Delete', value: 'delete', description: 'Delete a mass email record', action: 'Delete a mass email record' },
            { name: 'Get', value: 'get', description: 'Get a mass email record by ID', action: 'Get a mass email record by ID' },
            { name: 'Get Many', value: 'getMany', description: 'List mass email records with filters', action: 'List mass email records with filters' },
            { name: 'Update', value: 'update', description: 'Update a mass email record', action: 'Update a mass email record' },
        ],
    },

    // Create — required
    { displayName: 'Title', name: 'title', type: 'string', required: true, default: '', displayOptions: op(OperationType.CREATE) },
    {
        displayName: 'Source',
        name: 'source',
        type: 'options',
        required: true,
        default: 'MAILCHIMP',
        options: SOURCE_OPTIONS,
        displayOptions: op(OperationType.CREATE),
    },
    { displayName: 'External ID', name: 'externalId', type: 'string', required: true, default: '', displayOptions: op(OperationType.CREATE) },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: op(OperationType.CREATE),
        options: sharedOptionalFields,
    },

    // Update
    { displayName: 'Mass Email ID', name: 'massEmailId', type: 'number', required: true, default: 0, displayOptions: op(OperationType.UPDATE) },
    {
        displayName: 'Update Fields',
        name: 'updateAdditionalFields',
        type: 'collection',
        placeholder: 'Add field',
        default: {},
        displayOptions: op(OperationType.UPDATE),
        options: [
            { displayName: 'Title', name: 'title', type: 'string', default: '' },
            { displayName: 'Source', name: 'source', type: 'options', default: '', options: SOURCE_OPTIONS },
            { displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
            ...sharedOptionalFields,
        ],
    },

    // Get
    { displayName: 'Mass Email ID', name: 'massEmailId', type: 'number', required: true, default: 0, displayOptions: op(OperationType.GET) },

    // Get Many
    { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, description: 'Whether to return all results or only up to a given limit', displayOptions: op(OperationType.GET_MANY) },
    { displayName: 'Limit', name: 'limit', type: 'number', default: 50, typeOptions: { minValue: 1 }, description: 'Max number of results to return', displayOptions: op(OperationType.GET_MANY) },
    { displayName: 'Offset', name: 'offset', type: 'number', default: 0, displayOptions: op(OperationType.GET_MANY) },
    {
        displayName: 'Sort Column',
        name: 'sortColumn',
        type: 'options',
        default: 'id',
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
                            { name: 'Campaign Name', value: 'campaignName' },
                            { name: 'Created At', value: 'rowInfo.createdAt' },
                            { name: 'Date Sent', value: 'completed' },
                            { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                            { name: 'Source', value: 'source' },
                            { name: 'Tags', value: 'tags' },
                            { name: 'Title', value: 'title' },
                            { name: 'Updated At', value: 'rowInfo.updatedAt' },
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
    { displayName: 'Mass Email ID', name: 'massEmailId', type: 'number', required: true, default: 0, displayOptions: op(OperationType.DELETE) },
];
