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

const CONTACT_INFO_VALUES: INodeProperties[] = [
    { displayName: 'Email', name: 'email', type: 'string', default: '' },
    { displayName: 'Email 2', name: 'email2', type: 'string', default: '' },
    { displayName: 'Phone 1', name: 'tel1', type: 'string', default: '' },
    {
        displayName: 'Phone 1 Type',
        name: 'tel1Type',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getTelTypes' },
    },
    { displayName: 'Phone 2', name: 'tel2', type: 'string', default: '' },
    {
        displayName: 'Phone 2 Type',
        name: 'tel2Type',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getTelTypes' },
    },
    { displayName: 'WWW', name: 'www', type: 'string', default: '' },
    { displayName: 'Fax', name: 'fax', type: 'string', default: '' },
    { displayName: 'Other Contact', name: 'otherContact', type: 'string', default: '' },
];

const CONTACT_INFO_FIELD: INodeProperties = {
    displayName: 'Contact Info',
    name: 'contactInfo',
    type: 'fixedCollection',
    default: {},
    options: [{ displayName: 'Contact Info', name: 'contactInfoValues', values: CONTACT_INFO_VALUES }],
};

const SOCIAL_NETWORKS_FIELD: INodeProperties = {
    displayName: 'Social Networks',
    name: 'socialNetworkContact',
    type: 'fixedCollection',
    default: {},
    options: [
        {
            displayName: 'Social Network',
            name: 'socialValues',
            values: [
                { displayName: 'Facebook', name: 'facebook', type: 'string', default: '' },
                { displayName: 'Twitter/X', name: 'twitter', type: 'string', default: '' },
                { displayName: 'Instagram', name: 'instagram', type: 'string', default: '' },
                { displayName: 'YouTube', name: 'youtube', type: 'string', default: '' },
                { displayName: 'Pinterest', name: 'pinterest', type: 'string', default: '' },
                { displayName: 'Google+', name: 'googleplus', type: 'string', default: '' },
            ],
        },
    ],
};


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
    { displayName: 'Tax ID', name: 'taxNumber', type: 'string', default: '' },
    { displayName: 'VAT ID', name: 'taxNumber2', type: 'string', default: '' },
    { displayName: 'Data box', name: 'databox', type: 'string', default: '' },

    CONTACT_INFO_FIELD,
    SOCIAL_NETWORKS_FIELD,
    {
        displayName: 'Address',
        name: 'address',
        type: 'fixedCollection',
        default: {},
        options: [
                    { displayName: 'Street', name: 'street', type: 'string', default: '' },
                    { displayName: 'City', name: 'city', type: 'string', default: '' },
                    { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
                    { displayName: 'Province', name: 'province', type: 'string', default: '' },
                    { displayName: 'Country Code', name: 'countryCode', type: 'string', default: '' },
        ],
    },
    { displayName: 'Lead Date', name: 'leadDate', type: 'dateTime', default: '' },
    { displayName: 'Individual Person', name: 'leadPerson', type: 'boolean', default: false },
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
            required: true  ,
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
                                { name: 'Lead Phase ID', value: 'leadPhase' },
                                { name: 'Owner ID', value: 'owner' },
                                { name: 'Contact Source ID', value: 'contactSource' },
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
