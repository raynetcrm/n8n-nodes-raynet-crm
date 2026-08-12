import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const GENDER_OPTIONS = [
    { name: 'Male', value: 'MALE' },
    { name: 'Female', value: 'FEMALE' },
];

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'First Name', value: 'firstName' },
    { name: 'Last Name', value: 'lastName' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' },
];

// Shared sub-collections
const CONTACT_INFO_VALUES: INodeProperties[] = [
    { displayName: 'Email', name: 'email', type: 'string',
																																											placeholder: 'name@email.com', default: '' },
    { displayName: 'Email 2', name: 'email2', type: 'string', default: '' },
    { displayName: 'Phone 1', name: 'tel1', type: 'string', default: '' },
    {
        displayName: 'Phone 1 Type Name or ID',
        name: 'tel1Type',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getTelTypes' },
    },
    { displayName: 'Phone 2', name: 'tel2', type: 'string', default: '' },
    {
        displayName: 'Phone 2 Type Name or ID',
        name: 'tel2Type',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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

const PRIVATE_ADDRESS_FIELD: INodeProperties = {
    displayName: 'Private Address',
    name: 'privateAddress',
    type: 'fixedCollection',
    default: {},
    options: [
        {
            displayName: 'Address',
            name: 'addressValues',
            values: [
                { displayName: 'Street', name: 'street', type: 'string', default: '' },
                { displayName: 'City', name: 'city', type: 'string', default: '' },
                { displayName: 'Province/Region', name: 'province', type: 'string', default: '' },
                { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
                { displayName: 'Country (Code)', name: 'country', type: 'string', default: '' },
            ],
        },
    ],
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

const RELATIONSHIP_FIELD: INodeProperties = {
    displayName: 'Relationship',
    name: 'relationship',
    type: 'fixedCollection',
    default: {},
    description: 'Link this person to a company',
    options: [
        {
            displayName: 'Relationship',
            name: 'relationshipValues',
            values: [
                { displayName: 'Company ID', name: 'company', type: 'number', default: 0 },
                { displayName: 'Company Address ID', name: 'companyAddress', type: 'number', default: 0 },
                { displayName: 'Job Title', name: 'type', type: 'string', default: '' },
                { displayName: 'Note', name: 'notice', type: 'string', default: '' },
            ],
        },
    ],
};

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Title Before', name: 'titleBefore', type: 'string', default: '' },
    { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
    { displayName: 'Title After', name: 'titleAfter', type: 'string', default: '' },
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
    {
        displayName: 'Category Name or ID',
        name: 'category',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPersonCategories' },
    },
    {
        displayName: 'Classification 1 Name or ID',
        name: 'personClassification1',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPersonClassifications1' },
    },
    {
        displayName: 'Classification 2 Name or ID',
        name: 'personClassification2',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPersonClassifications2' },
    },
    {
        displayName: 'Classification 3 Name or ID',
        name: 'personClassification3',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPersonClassifications3' },
    },
    { displayName: 'Birthday', name: 'birthday', type: 'dateTime', default: '' },
    {
        displayName: 'Language Name or ID',
        name: 'language',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getLanguages' },
    },
    {
        displayName: 'Marital Status Name or ID',
        name: 'maritalStatus',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getMaritalStatuses' },
    },
    { displayName: 'Gender', name: 'gender', type: 'options', default: '', options: GENDER_OPTIONS },
    CONTACT_INFO_FIELD,
    PRIVATE_ADDRESS_FIELD,
    SOCIAL_NETWORKS_FIELD,
    RELATIONSHIP_FIELD,
    { displayName: 'Note', name: 'notice', type: 'string', default: '' },
    {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
    },
    { displayName: 'Key Person', name: 'keyman', type: 'boolean', default: false },
    { displayName: 'Original Lead ID', name: 'originLead', type: 'number', default: 0, description: 'ID of the lead from which this contact was created' }
];

const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' }, ...SHARED_OPTIONAL_FIELDS];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'person');

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
            displayOptions: { show: { resource: ['person'] } },
            options: [
                { name: 'Add Tag', value: 'addTag', description: 'Add a tag to a contact', action: 'Add tag to a person' },
                { name: 'Create', value: 'create', description: 'Create a new contact person', action: 'Create a person' },
                { name: 'Delete', value: 'delete', description: 'Delete a contact person', action: 'Delete a person' },
                { name: 'Get', value: 'get', description: 'Get a contact person by ID', action: 'Get a person' },
                { name: 'Get Many', value: 'getMany', description: 'List contact persons with filters', action: 'Get a list of people' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a contact as invalid', action: 'Invalidate a person' },
                { name: 'Lock', value: 'lock', description: 'Lock a contact to prevent changes', action: 'Lock a person' },
                { name: 'Remove Tag', value: 'deleteTag', description: 'Remove a tag from a contact', action: 'Remove tag from a person' },
                {
                    name: 'Renew Validity',
                    value: 'renewValidity',
                    description: 'Renew validity of an invalidated contact',
                    action: 'Renew validity of a person',
                },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked contact', action: 'Unlock a person' },
                { name: 'Update', value: 'update', description: 'Update an existing contact person', action: 'Update a person' },
            ],
        },
    ];
}

function getCreateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op([OperationType.CREATE]),
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
            displayName: 'Contact ID',
            name: 'personId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.UPDATE]),
        },
        {
            displayName: 'Update Fields',
            name: 'updateAdditionalFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op([OperationType.UPDATE]),
            options: UPDATE_OPTIONAL_FIELDS,
        },
    ];
}

function getGetProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Contact ID',
            name: 'personId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.GET]),
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
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            description: 'Max number of results to return',
            default: 50,
            typeOptions: { minValue: 1 },
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Offset',
            name: 'offset',
            type: 'number',
            default: 0,
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Sort Column',
            name: 'sortColumn',
            type: 'options',
            default: 'lastName',
            options: SORT_COLUMNS,
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Sort Direction',
            name: 'sortDirection',
            type: 'options',
            default: 'ASC',
            options: SORT_DIRECTIONS,
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Full-Text Search',
            name: 'fulltext',
            type: 'string',
            default: '',
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            typeOptions: { multipleValues: true },
            placeholder: 'Add filter',
            default: {},
            displayOptions: op([OperationType.GET_MANY]),
            options: [
                {
                    displayName: 'Filter',
                    name: 'filter',
                    values: [
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            default: 'lastName',
                            options: [
                                { name: 'Category', value: 'category' },
                                { name: 'Classification 1', value: 'personClassification1' },
                                { name: 'Classification 2', value: 'personClassification2' },
                                { name: 'Classification 3', value: 'personClassification3' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'First Name', value: 'firstName' },
                                { name: 'ID', value: 'id' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                                { name: 'Last Name', value: 'lastName' },
                                { name: 'Owner', value: 'owner' },
                                { name: 'Primary Email', value: 'contactInfo.email' },
                                {
                                    name: 'Primary Relationship Company ID',
                                    value: 'primaryRelationship-company-id',
                                },
                                {
                                    name: 'Primary Relationship Company Name',
                                    value: 'primaryRelationship-company-name',
                                },
                                { name: 'Secondary Email', value: 'contactInfo.email2' },
                                { name: 'Tags', value: 'tags' },
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
                                { name: 'User ID', value: 'userAccount-id' },
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
            displayName: 'Relationship Company ID',
            name: 'personRelationship[CUSTOM]',
            type: 'number',
            default: 0,
            description: 'Filter by the ID of a related company',
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'View',
            name: 'view',
            type: 'string',
            default: '',
            description: "Pass 'rowInfo' to return only status metadata",
            displayOptions: op([OperationType.GET_MANY]),
        },
    ];
}

function getDeleteProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Contact ID',
            name: 'personId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.DELETE]),
        },
    ];
}

function getLifecycleProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Contact ID',
            name: 'personId',
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
            displayName: 'Contact ID',
            name: 'personId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.ADD_TAG]),
        },
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op([OperationType.ADD_TAG]),
        },
        {
            displayName: 'Contact ID',
            name: 'personId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.DELETE_TAG]),
        },
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op([OperationType.DELETE_TAG]),
        },
    ];
}

// ---------------------------------------------------------------------------
// UI properties
// ---------------------------------------------------------------------------

export function getPersonProperties(): INodeProperties[] {
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
