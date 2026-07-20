import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Name', value: 'name' },
    { name: 'Valid From', value: 'validFrom' },
    { name: 'Valid Till', value: 'validTill' },
    { name: 'Scheduled End', value: 'scheduledEnd' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' },
];

const STATUS_OPTIONS = [
    { name: 'Active', value: 'B_ACTIVE' },
    { name: 'Won', value: 'E_WIN' },
    { name: 'Lost', value: 'F_LOST' },
    { name: 'Cancelled', value: 'G_STORNO' },
];

// Shared optional fields used by both Create and Update
const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    {
        displayName: 'Owner',
        name: 'owner',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getOwners' },
    },
    {
        displayName: 'Security Level',
        name: 'securityLevel',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    { displayName: 'Contact Person ID', name: 'person', type: 'number', default: 0 },
    { displayName: 'Project ID', name: 'project', type: 'number', default: 0 },
    { displayName: 'Final Price', name: 'totalAmount', type: 'number', default: 0 },
    { displayName: 'Estimated Costs', name: 'estimatedValue', type: 'number', default: 0 },
    { displayName: 'Probability (%)', name: 'probability', type: 'number', default: 0 },
    { displayName: 'Open From', name: 'validFrom', type: 'dateTime', default: '' },
    { displayName: 'Note', name: 'description', type: 'string', default: '' },
    {
        displayName: 'Currency',
        name: 'currency',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCurrencies' },
    },
    { displayName: 'Exchange Rate', name: 'exchangeRate', type: 'number', default: 0 },
    {
        displayName: 'Contact Source',
        name: 'source',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getContactSources' },
    },
    {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getDealCategories' },
    },
    {
        displayName: 'Phase',
        name: 'businessCasePhase',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getDealPhases' },
    },
    {
        displayName: 'Classification 1',
        name: 'dealClassification1',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getDealClassifications1' },
    },
    {
        displayName: 'Classification 2',
        name: 'dealClassification2',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getDealClassifications2' },
    },
    {
        displayName: 'Classification 3',
        name: 'dealClassification3',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getDealClassifications3' },
    },
    {
        displayName: 'Lead ID',
        name: 'originLead',
        type: 'number',
        default: 0,
    },
    {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
    },
];

const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Account ID', name: 'company', type: 'number', default: 0 },
    { displayName: 'Closed Date', name: 'validTill', type: 'dateTime', default: '' },
    ...SHARED_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'deal');

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
            displayOptions: { show: { resource: ['deal'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new deal' },
                { name: 'Update', value: 'update', description: 'Update an existing deal' },
                { name: 'Get', value: 'get', description: 'Get a deal by ID' },
                { name: 'Get Many', value: 'getMany', description: 'List deals with filters' },
                { name: 'Delete', value: 'delete', description: 'Delete a deal' },
                { name: 'Lock', value: 'lock', description: 'Lock a deal to prevent changes' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked deal' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a deal as invalid' },
                {
                    name: 'Renew Validity',
                    value: 'renewValidity',
                    description: 'Renew validity of an invalidated deal',
                },
                { name: 'Add Tag', value: 'addTag', description: 'Add a tag to a deal' },
                { name: 'Remove Tag', value: 'deleteTag', description: 'Remove a tag from a deal' },
                { name: 'Add Item', value: 'addItem', description: 'Add an item to a deal' },
                { name: 'Modify Item', value: 'modifyItem', description: 'Update an item in a deal' },
                { name: 'Delete Item', value: 'deleteItem', description: 'Remove an item from a deal' },
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
            displayOptions: op([OperationType.CREATE]),
        },
        {
            displayName: 'Account ID',
            name: 'company',
            type: 'number',
            required: true,
            default: 0,
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
            displayName: 'Deal ID',
            name: 'dealId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.UPDATE]),
        },
        {
            displayName: 'Fields to Update',
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
            displayName: 'Deal ID',
            name: 'dealId',
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
            description: 'Whether to return all results (max 1000)',
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
            typeOptions: { minValue: 1, maxValue: 1000 },
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
            default: 'name',
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
            displayName: 'Full-text Search',
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
                            default: 'name',
                            options: [
                                { name: 'Name', value: 'name' },
                                { name: 'Code' , value: 'code' },
                                { name: 'Account ID', value: 'company.id' },
                                { name: 'Valid From', value: 'validFrom' },
                                { name: 'Valid Till', value: 'validTill' },
                                { name: 'Scheduled End', value: 'scheduledEnd' },
                                { name: 'Phase ID', value: 'businessCasePhase' },
                                { name: 'Deal Type ID', value: 'businessCaseType' },
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
            name: 'status',
            type: 'options',
            default: '',
            description: 'Filter by deal status',
            options: [{ name: '(Any)', value: '' }, ...STATUS_OPTIONS],
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Product Category ID',
            name: 'productCategoryCustom',
            type: 'number',
            default: 0,
            description: 'Filter by product category ID',
            displayOptions: op([OperationType.GET_MANY]),
        },
        {
            displayName: 'Product Line ID',
            name: 'productLineCustom',
            type: 'number',
            default: 0,
            description: 'Filter by product line ID',
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
            displayName: 'Deal ID',
            name: 'dealId',
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
            displayName: 'Deal ID',
            name: 'dealId',
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
            displayName: 'Deal ID',
            name: 'dealId',
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
            displayName: 'Deal ID',
            name: 'dealId',
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

function getAddItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Deal ID',
            name: 'dealId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.ADD_ITEM]),
        },
        { 
            displayName: 'Name',
            name: 'name',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op([OperationType.ADD_ITEM]),
        },
        {
            displayName: 'Item Fields',
            name: 'itemFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op([OperationType.ADD_ITEM]),
            options: [
                { displayName: 'Product ID', name: 'product', type: 'number', default: 0 },
                { displayName: 'Product Code', name: 'productCode', type: 'string', default: '' },
                { displayName: 'Price List ID', name: 'priceList', type: 'number', default: 0 },
                { displayName: 'Selling Price', name: 'price', type: 'number', default: 0 },
                { displayName: 'Tax (%)', name: 'taxRate', type: 'number', default: 0 },
                { displayName: 'Quantity', name: 'count', type: 'number', default: 0 },
                { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
                { displayName: 'Cost per Piece', name: 'cost', type: 'number', default: 0 },
                { displayName: 'Unit', name: 'unit', type: 'string', default: '' },
                { displayName: 'Note', name: 'description', type: 'string', default: '' },
            ],
        },
    ];
}

function getModifyItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Deal ID',
            name: 'dealId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.MODIFY_ITEM]),
        },
        {
            displayName: 'Item ID',
            name: 'itemId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.MODIFY_ITEM]),
        },
        {
            displayName: 'Fields to Update',
            name: 'modifyItemFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op([OperationType.MODIFY_ITEM]),
            options: [
                { displayName: 'Name', name: 'name', type: 'string', default: '' },
                { displayName: 'Selling Price', name: 'price', type: 'number', default: 0 },
                { displayName: 'Tax (%)', name: 'taxRate', type: 'number', default: 0 },
                { displayName: 'Quantity', name: 'count', type: 'number', default: 0 },
                { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
                { displayName: 'Cost per Piece', name: 'cost', type: 'number', default: 0 },
                { displayName: 'Unit', name: 'unit', type: 'string', default: '' },
                { displayName: 'Note', name: 'description', type: 'string', default: '' },
            ],
        },
    ];
}

function getDeleteItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Deal ID',
            name: 'dealId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.DELETE_ITEM]),
        },
        {
            displayName: 'Item ID',
            name: 'itemId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.DELETE_ITEM]),
        },
    ];
}

// ---------------------------------------------------------------------------
// UI properties
// ---------------------------------------------------------------------------

export function getDealProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getGetManyProperties(),
        ...getDeleteProperties(),
        ...getLifecycleProperties(),
        ...getTagProperties(),
        ...getAddItemProperties(),
        ...getModifyItemProperties(),
        ...getDeleteItemProperties(),
    ];
}
