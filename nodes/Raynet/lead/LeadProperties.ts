import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Code', value: 'code' },
    { name: 'Lead Date', value: 'leadDate' },
    { name: 'Priority', value: 'priority' },
    { name: 'Company Name', value: 'companyName' },
    { name: 'Last Name', value: 'lastName' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' },
];

const PRIORITY_OPTIONS = [
    { name: 'Critical', value: 'CRITICAL' },
    { name: 'Default', value: 'DEFAULT' },
    { name: 'Minor', value: 'MINOR' },
];

const STATUS_OPTIONS = [
    { name: 'Active', value: 'B_ACTIVE' },
    { name: 'Done', value: 'D_DONE' },
    { name: 'Cancelled', value: 'G_STORNO' },
];

// ---------------------------------------------------------------------------
// Shared optional fields
// ---------------------------------------------------------------------------

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    {
        displayName: 'Owner',
        name: 'owner',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getUsers' },
    },
    {
        displayName: 'Security Level',
        name: 'securityLevel',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    {
        displayName: 'Lead Phase',
        name: 'leadPhase',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getLeadPhases' },
    },
    {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getLeadCategories' },
    },
    {
        displayName: 'Contact Source',
        name: 'contactSource',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getContactSources' },
    },
    {
        displayName: 'Territory',
        name: 'territory',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getTerritories' },
    },
    { displayName: 'Company Name', name: 'companyName', type: 'string', default: '' },
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    { displayName: 'Title Before', name: 'titleBefore', type: 'string', default: '' },
    { displayName: 'Title After', name: 'titleAfter', type: 'string', default: '' },
    { displayName: 'ID no.', name: 'regNumber', type: 'string', default: '' },
    { displayName: 'Email', name: 'email1', type: 'string', default: '' },
    { displayName: 'Phone', name: 'phone1', type: 'string', default: '' },
    { displayName: 'Website', name: 'www', type: 'string', default: '' },
    {
        displayName: 'Address',
        name: 'address',
        type: 'fixedCollection',
        default: {},
        options: [
            {
                displayName: 'Address Data',
                name: 'addressData',
                values: [
                    { displayName: 'Street', name: 'street', type: 'string', default: '' },
                    { displayName: 'City', name: 'city', type: 'string', default: '' },
                    { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
                    { displayName: 'Province', name: 'province', type: 'string', default: '' },
                    { displayName: 'Country Code', name: 'countryCode', type: 'string', default: '' },
                ],
            },
        ],
    },
    {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
    },
    { displayName: 'Note', name: 'notice', type: 'string', typeOptions: { rows: 3 }, default: '' },
];

const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Topic', name: 'topic', type: 'string', default: '' },
    { displayName: 'Priority', name: 'priority', type: 'options', default: '', options: PRIORITY_OPTIONS },
    ...SHARED_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'lead');

// ---------------------------------------------------------------------------
// Per-operation property helpers
// ---------------------------------------------------------------------------

function getOperationSelector(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'getMany',
            displayOptions: { show: { resource: ['lead'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new lead' },
                { name: 'Update', value: 'update', description: 'Update an existing lead' },
                { name: 'Get', value: 'get', description: 'Get a lead by ID' },
                { name: 'Get Many', value: 'getMany', description: 'List leads with filters' },
                { name: 'Delete', value: 'delete', description: 'Delete a lead' },
                { name: 'Lock', value: 'lock', description: 'Lock a lead to prevent changes' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked lead' },
            ],
        },
    ];
}

function getCreateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Topic',
            name: 'topic',
            type: 'string',
            required: true,
            default: '',
            description: 'Subject / topic of the lead',
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
            displayName: 'Additional Fields',
            name: 'additionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.CREATE),
            options: SHARED_OPTIONAL_FIELDS,
        },
    ];
}

function getUpdateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Lead ID',
            name: 'leadId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.UPDATE),
        },
        {
            displayName: 'Fields to Update',
            name: 'updateAdditionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.UPDATE),
            options: UPDATE_OPTIONAL_FIELDS,
        },
    ];
}

function getGetProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Lead ID',
            name: 'leadId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.GET),
        },
    ];
}

function getGetManyProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            default: false,
            description: 'Whether to return all results (max 1000)',
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
            typeOptions: { minValue: 1, maxValue: 1000 },
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Offset',
            name: 'offset',
            type: 'number',
            default: 0,
            displayOptions: op(OperationType.GET_MANY),
        },
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
            options: SORT_DIRECTIONS,
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Full-text Search',
            name: 'fulltext',
            type: 'string',
            default: '',
            displayOptions: op(OperationType.GET_MANY),
        },
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
                            default: 'topic',
                            options: [
                                { name: 'Topic', value: 'topic' },
                                { name: 'Company Name', value: 'companyName' },
                                { name: 'Last Name', value: 'lastName' },
                                { name: 'Priority', value: 'priority' },
                                { name: 'Lead Phase ID', value: 'leadPhase.id' },
                                { name: 'Owner ID', value: 'owner.id' },
                                { name: 'Contact Source ID', value: 'contactSource.id' },
                                { name: 'Lead Date', value: 'leadDate' },
                                { name: 'ID', value: 'id' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                            ],
                        },
                        {
                            displayName: 'Operator',
                            name: 'operator',
                            type: 'options',
                            default: 'EQ',
                            options: FILTER_OPERATORS,
                        },
                        { displayName: 'Value', name: 'value', type: 'string', default: '' },
                    ],
                },
            ],
        },
        {
            displayName: 'Status',
            name: 'leadStatus',
            type: 'options',
            default: '',
            description: 'Filter by lead status',
            options: [{ name: '(Any)', value: '' }, ...STATUS_OPTIONS],
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'View',
            name: 'view',
            type: 'string',
            default: '',
            description: "Pass 'rowInfo' to return only status metadata",
            displayOptions: op(OperationType.GET_MANY),
        },
    ];
}

function getDeleteProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Lead ID',
            name: 'leadId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE),
        },
    ];
}

function getLifecycleProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Lead ID',
            name: 'leadId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK]),
        },
    ];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function getLeadProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getGetManyProperties(),
        ...getDeleteProperties(),
        ...getLifecycleProperties(),
    ];
}
