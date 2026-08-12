import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const RATING_OPTIONS = [
    { name: 'A', value: 'A' },
    { name: 'B', value: 'B' },
    { name: 'C', value: 'C' },
];
const STATE_OPTIONS = [
    { name: 'Potential', value: 'A_POTENTIAL' },
    { name: 'Actual', value: 'B_ACTUAL' },
    { name: 'Deferred', value: 'C_DEFERRED' },
    { name: 'Unattractive', value: 'D_UNATTRACTIVE' },
];
const ROLE_OPTIONS = [
    { name: 'Subscriber', value: 'A_SUBSCRIBER' },
    { name: 'Partner', value: 'B_PARTNER' },
    { name: 'Supplier', value: 'C_SUPPLIER' },
    { name: 'Rival', value: 'D_RIVAL' },
];
const TAX_PAYER_OPTIONS = [
    { name: 'Yes', value: 'YES' },
    { name: 'No', value: 'NO' },
];

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Name', value: 'name' },
    { name: 'ID No.', value: 'regNumber' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' },
];

// Shared address field list used in both Create and Update
const ADDRESS_VALUES: INodeProperties[] = [
    { displayName: 'Address Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Street', name: 'street', type: 'string', default: '' },
    { displayName: 'City', name: 'city', type: 'string', default: '' },
    { displayName: 'Province/Region', name: 'province', type: 'string', default: '' },
    { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
    { displayName: 'Country (Code)', name: 'country', type: 'string', default: 'CZ' },
    { displayName: 'Latitude', name: 'lat', type: 'number', default: 0 },
    { displayName: 'Longitude', name: 'lng', type: 'number', default: 0 },
    {
        displayName: 'Territory Name or ID',
        name: 'territory',
        type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getTerritories' },
    },
    { displayName: 'Email', name: 'email', type: 'string',
        placeholder: 'name@email.com', default: '' },
    { displayName: 'Email 2', name: 'email2', type: 'string', default: '' },
    { displayName: 'Phone 1', name: 'tel1', type: 'string', default: '' },
    { displayName: 'Phone 1 Type', name: 'tel1Type', type: 'string', default: '' },
    { displayName: 'Phone 2', name: 'tel2', type: 'string', default: '' },
    { displayName: 'Phone 2 Type', name: 'tel2Type', type: 'string', default: '' },
    { displayName: 'Fax', name: 'fax', type: 'string', default: '' },
    { displayName: 'WWW', name: 'www', type: 'string', default: '' },
    { displayName: 'Other Contact', name: 'otherContact', type: 'string', default: '' },
];

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
                {
                    displayName: 'Facebook',
                    name: 'facebook',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Google+',
                    name: 'googleplus',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Instagram',
                    name: 'instagram',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Pinterest',
                    name: 'pinterest',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Twitter/X',
                    name: 'twitter',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'YouTube',
                    name: 'youtube',
                    type: 'string',
                    default: '',
                },
            ],
        },
    ],
};

const ADDRESSES_FIELD: INodeProperties = {
    displayName: 'Addresses',
    name: 'addresses',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: {},
    options: [{ displayName: 'Address', name: 'address', values: ADDRESS_VALUES }],
};

// Shared optional fields for Create
const CREATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'This Is an Individual', name: 'person', type: 'boolean', default: false },
    { displayName: 'Last Name of Individual', name: 'lastName', type: 'string', default: '' },
    { displayName: 'First Name of Individual', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Title Before Name', name: 'titleBefore', type: 'string', default: '' },
    { displayName: 'Title After Name', name: 'titleAfter', type: 'string', default: '' },
    { displayName: 'Salutation', name: 'salutation', type: 'string', default: '' },
    {
        displayName: 'Security Level Name or ID',
        name: 'securityLevel',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    {
        displayName: 'Owner Name or ID',
        name: 'owner',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getUsers' },
    },
    { displayName: 'Note to Account', name: 'notice', type: 'string', default: '' },
    {
        displayName: 'Category Name or ID',
        name: 'category',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getAccountCategories' },
    },
    {
        displayName: 'Contact Source Name or ID',
        name: 'contactSource',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getContactSources' },
    },
    {
        displayName: 'Employees Number Name or ID',
        name: 'employeesNumber',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getEmployeesNumbers' },
    },
    {
        displayName: 'Legal Form Name or ID',
        name: 'legalForm',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getLegalForms' },
    },
    {
        displayName: 'Payment Terms Name or ID',
        name: 'paymentTerm',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPaymentTerms' },
    },
    {
        displayName: 'Turnover Name or ID',
        name: 'turnover',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCompanyTurnovers' },
    },
    {
        displayName: 'Industry Name or ID',
        name: 'economyActivity',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getEconomyActivities' },
    },
    {
        displayName: 'Classification 1 Name or ID',
        name: 'companyClassification1',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCompanyClassifications1' },
    },
    {
        displayName: 'Classification 2 Name or ID',
        name: 'companyClassification2',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCompanyClassifications2' },
    },
    {
        displayName: 'Classification 3 Name or ID',
        name: 'companyClassification3',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCompanyClassifications3' },
    },
    { displayName: 'ID No.', name: 'regNumber', type: 'string', default: '' },
    { displayName: 'Tax ID No.', name: 'taxNumber', type: 'string', default: '' },
    { displayName: 'VAT ID No.', name: 'taxNumber2', type: 'string', default: '' },
    {
        displayName: 'VAT Payer',
        name: 'taxPayer',
        type: 'options',
        default: '',
        options: TAX_PAYER_OPTIONS,
    },
    { displayName: 'Bank Account', name: 'bankAccount', type: 'string', default: '' },
    { displayName: 'Databox', name: 'databox', type: 'string', default: '' },
    { displayName: 'Reference Number (Court)', name: 'court', type: 'string', default: '' },
    { displayName: 'Birthday/Anniversary', name: 'birthday', type: 'dateTime', default: '' },
    ADDRESSES_FIELD,
    SOCIAL_NETWORKS_FIELD,
    {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
    },
    {
        displayName: 'Original Lead ID',
        name: 'originLead',
        type: 'number',
        default: 0,
        description: 'ID of the lead from which this account was created',
    }
];

// Update has the same fields plus Name, Rating, Status, Relationship
const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Rating', name: 'rating', type: 'options', default: '', options: RATING_OPTIONS },
    { displayName: 'Status', name: 'state', type: 'options', default: '', options: STATE_OPTIONS },
    {
        displayName: 'Relationship',
        name: 'role',
        type: 'options',
        default: '',
        options: ROLE_OPTIONS,
    },
    ...CREATE_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'account');

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
            displayOptions: { show: { resource: ['account'] } },
            options: [
                { name: 'Add Tag', value: 'addTag', description: 'Add a tag to an account', action: 'Add tag to an account' },
                { name: 'Create', value: 'create', description: 'Create a new account', action: 'Create an account' },
                { name: 'Delete', value: 'delete', description: 'Delete an account', action: 'Delete an account' },
                { name: 'Get', value: 'get', description: 'Get an account by ID', action: 'Get an account' },
                { name: 'Get Many', value: 'getMany', description: 'List accounts with filters', action: 'Get many accounts' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark an account as invalid', action: 'Invalidate an account' },
                { name: 'Lock', value: 'lock', description: 'Lock an account to prevent changes', action: 'Lock an account' },
                { name: 'Remove Tag', value: 'deleteTag', description: 'Remove a tag from an account', action: 'Remove tag from an account' },
                {
                    name: 'Renew Validity',
                    value: 'renewValidity',
                    description: 'Renew validity of an invalidated account',
                    action: 'Renew validity of an account',
                },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked account', action: 'Unlock an account' },
                { name: 'Update', value: 'update', description: 'Update an existing account', action: 'Update an account' },
            ],
        },
    ];
}

function getCreateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Rating',
            name: 'rating',
            type: 'options',
            required: true,
            default: 'A',
            options: RATING_OPTIONS,
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Status',
            name: 'state',
            type: 'options',
            required: true,
            default: 'A_POTENTIAL',
            options: STATE_OPTIONS,
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Relationship',
            name: 'role',
            type: 'options',
            required: true,
            default: 'B_PARTNER',
            options: ROLE_OPTIONS,
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Additional Fields',
            name: 'additionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.CREATE),
            options: CREATE_OPTIONAL_FIELDS,
        },
    ];
}

function getUpdateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.UPDATE),
        },
        {
            displayName: 'Update Fields',
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
            displayName: 'Account ID',
            name: 'accountId',
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
            default: 'name',
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
            displayName: 'Full-Text Search',
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
                            default: 'name',
                            options: [
                                { name: 'Category', value: 'category' },
                                { name: 'Classification 1', value: 'companyClassification1' },
                                { name: 'Classification 2', value: 'companyClassification2' },
                                { name: 'Classification 3', value: 'companyClassification3' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'ID', value: 'id' },
                                { name: 'ID No.', value: 'regNumber' },
                                { name: 'Industry', value: 'economyActivity' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                                { name: 'Last Name (Individual)', value: 'lastName' },
                                { name: 'Name', value: 'name' },
                                { name: 'Owner', value: 'owner' },
                                { name: 'Person (Individual)', value: 'person' },
                                { name: 'Primary Email', value: 'primaryAddress-contactInfo.email' },
                                { name: 'Primary Email 2', value: 'primaryAddress-contactInfo.email2' },
                                { name: 'Rating', value: 'rating' },
                                { name: 'Role', value: 'role' },
                                { name: 'Row Access', value: 'rowInfo.rowAccess' },
                                { name: 'Status', value: 'state' },
                                { name: 'Tags', value: 'tags' },
                                { name: 'Tax ID', value: 'taxNumber' },
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
                                { name: 'VAT ID', value: 'taxNumber2' },
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
            displayName: 'Account ID',
            name: 'accountId',
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
            displayName: 'Account ID',
            name: 'accountId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK, OperationType.INVALIDATE, OperationType.RENEW_VALIDITY]),
        },
    ];
}

function getTagProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.ADD_TAG),
        },
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.ADD_TAG),
        },
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE_TAG),
        },
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.DELETE_TAG),
        },
    ];
}

// ---------------------------------------------------------------------------
// UI properties
// ---------------------------------------------------------------------------

export function getAccountProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getGetManyProperties(),
        ...getDeleteProperties(),
        ...getLifecycleProperties(),
        ...getTagProperties(),
    ];
}
