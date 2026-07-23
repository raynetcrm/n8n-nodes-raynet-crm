import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Name', value: 'name' },
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

const ADDRESS_FIELDS: INodeProperties[] = [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Street', name: 'street', type: 'string', default: '' },
    { displayName: 'City', name: 'city', type: 'string', default: '' },
    { displayName: 'Region', name: 'province', type: 'string', default: '' },
    { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
    { displayName: 'Country', name: 'countryCode', type: 'number', default: 0, description: 'Country code from standard ISO-3166-1 alpha-2, i.e. CZ.' },
];

// ---------------------------------------------------------------------------
// Shared optional fields
// ---------------------------------------------------------------------------

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    {
        displayName: 'Owner Name or ID',
        name: 'owner',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getUsers' },
    },
    {
        displayName: 'Security Level Name or ID',
        name: 'securityLevel',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    { displayName: 'Contact Person ID', name: 'person', type: 'number', default: 0 },
    { displayName: 'Quote ID', name: 'offer', type: 'number', default: 0, description: 'ID of the quote this order is linked to' },
    { displayName: 'Final Price', name: 'totalAmount', type: 'number', default: 0 },
    { displayName: 'Estimated Costs', name: 'estimatedValue', type: 'number', default: 0 },
    { displayName: 'Open From', name: 'validFrom', type: 'dateTime', default: '', description: 'Date of creation / opening' },
    { displayName: 'Open Till', name: 'validTill', type: 'dateTime', default: '', description: 'Date of closing' },
    { displayName: 'Valid To', name: 'expirationDate', type: 'dateTime', default: '', description: 'End of order validity' },
    { displayName: 'Deliver Before', name: 'requestDeliveryDate', type: 'dateTime', default: '', description: 'Requested delivery date' },
    { displayName: 'Note', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
    {
        displayName: 'Category Name or ID',
        name: 'category',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSalesOrderCategories' },
    },
    {
        displayName: 'Status Name or ID',
        name: 'salesOrderStatus',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSalesOrderStatuses' },
    },
    {
        displayName: 'Delivery Address',
        name: 'deliveryAddress',
        type: 'collection',
        options: ADDRESS_FIELDS,
        default: {},
    },
    {
        displayName: 'Billing Address',
        name: 'invoiceAddress',
        type: 'collection',
        options: ADDRESS_FIELDS,
        default: {},
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
    { displayName: 'Deal ID', name: 'businessCase', type: 'number', default: 0 },
    ...SHARED_OPTIONAL_FIELDS,
];

// ---------------------------------------------------------------------------
// Shared item fields
// ---------------------------------------------------------------------------

const ADD_ITEM_FIELDS: INodeProperties[] = [
    { displayName: 'Product ID', name: 'product', type: 'number', default: 0 },
    { displayName: 'Product Code', name: 'productCode', type: 'string', default: '' },
    { displayName: 'Price List ID', name: 'priceList', type: 'number', default: 0 },
    { displayName: 'Price List Item ID', name: 'priceListItem', type: 'number', default: 0 },
    { displayName: 'Selling Price', name: 'price', type: 'number', default: 0 },
    { displayName: 'Tax (%)', name: 'taxRate', type: 'number', default: 0 },
    { displayName: 'Quantity', name: 'count', type: 'number', default: 0 },
    { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
    { displayName: 'Cost per Piece', name: 'cost', type: 'number', default: 0 },
    { displayName: 'Unit', name: 'unit', type: 'string', default: '' },
    { displayName: 'Note', name: 'description', type: 'string', default: '' },
];

const MODIFY_ITEM_FIELDS: INodeProperties[] = [
    { displayName: 'Price List Item ID', name: 'priceListItem', type: 'number', default: 0 },
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Selling Price', name: 'price', type: 'number', default: 0 },
    { displayName: 'Tax (%)', name: 'taxRate', type: 'number', default: 0 },
    { displayName: 'Quantity', name: 'count', type: 'number', default: 0 },
    { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
    { displayName: 'Cost per Piece', name: 'cost', type: 'number', default: 0 },
    { displayName: 'Unit', name: 'unit', type: 'string', default: '' },
    { displayName: 'Note', name: 'description', type: 'string', default: '' },
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'salesOrder');

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
            displayOptions: { show: { resource: ['salesOrder'] } },
            options: [
                { name: 'Add Item', value: 'addItem', description: 'Add an item to a sales order', action: 'Add item to a sales order' },
                { name: 'Add Tag', value: 'addTag', description: 'Add a tag to a sales order', action: 'Add tag to a sales order' },
                { name: 'Create', value: 'create', description: 'Create a new sales order', action: 'Create a sales order' },
                { name: 'Delete', value: 'delete', description: 'Delete a sales order', action: 'Delete a sales order' },
                { name: 'Delete Item', value: 'deleteItem', description: 'Remove an item from a sales order', action: 'Delete item from a sales order' },
                { name: 'Get', value: 'get', description: 'Get a sales order by ID', action: 'Get a sales order' },
                { name: 'Get Many', value: 'getMany', description: 'List sales orders with filters', action: 'Get a list of sales orders' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a sales order as invalid', action: 'Invalidate a sales order' },
                { name: 'Lock', value: 'lock', description: 'Lock a sales order to prevent changes', action: 'Lock a sales order' },
                { name: 'Modify Item', value: 'modifyItem', description: 'Update an item in a sales order', action: 'Modify item in a sales order' },
                { name: 'Remove Tag', value: 'deleteTag', description: 'Remove a tag from a sales order', action: 'Remove tag from a sales order' },
                { name: 'Renew Validity', value: 'renewValidity', description: 'Renew validity of an invalidated sales order', action: 'Renew validity of a sales order' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked sales order', action: 'Unlock a sales order' },
                { name: 'Update', value: 'update', description: 'Update an existing sales order', action: 'Update a sales order' },
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
            description: 'Subject / name of the sales order',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Account ID',
            name: 'company',
            type: 'number',
            required: true,
            default: 0,
            description: 'ID of the account the order is created for',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Deal ID',
            name: 'businessCase',
            type: 'number',
            required: true,
            default: 0,
            description: 'ID of the deal connected to the order',
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
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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
                                { name: 'Account ID', value: 'company' },
                                { name: 'Code', value: 'code' },
                                { name: 'Contact Person ID', value: 'person' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'Deal ID', value: 'businessCase' },
                                { name: 'Deliver Before', value: 'requestDeliveryDate' },
                                { name: 'ID', value: 'id' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                                { name: 'Name', value: 'name' },
                                { name: 'Open From', value: 'validFrom' },
                                { name: 'Open Till', value: 'validTill' },
                                { name: 'Owner ID', value: 'owner' },
                                { name: 'Status (SalesOrderStatus) ID', value: 'salesOrderStatus' },
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
                                { name: 'Valid To', value: 'expirationDate' },
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
            description: 'Filter by sales order status',
            options: [{ name: '(Any)', value: '' }, ...STATUS_OPTIONS],
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Product Category ID',
            name: 'productCategory[CUSTOM]',
            type: 'number',
            default: 0,
            description: 'Filter by product category ID',
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Contains Product with ID',
            name: 'containsProduct[CUSTOM]',
            type: 'number',
            default: 0,
            description: 'Filter by whether the sales order contains products with the specified ID',
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Product Line ID',
            name: 'productLine[CUSTOM]',
            type: 'number',
            default: 0,
            description: 'Filter by product line ID',
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
        {
            displayName: 'Tags',
            name: 'tags',
            type: 'string',
            default: '',
            description: 'Comma-separated list of tags to filter by',
            displayOptions: op(OperationType.GET_MANY),
        },
    ];
}

function getDeleteProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
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

function getAddItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.ADD_ITEM),
        },
        {
            displayName: 'Item Name',
            name: 'name',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.ADD_ITEM),
        },
        {
            displayName: 'Item Fields',
            name: 'itemFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.ADD_ITEM),
            options: ADD_ITEM_FIELDS,
        },
    ];
}

function getModifyItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.MODIFY_ITEM),
        },
        {
            displayName: 'Item ID',
            name: 'itemId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.MODIFY_ITEM),
        },
        {
            displayName: 'Fields to Update',
            name: 'modifyItemFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.MODIFY_ITEM),
            options: MODIFY_ITEM_FIELDS,
        },
    ];
}

function getDeleteItemProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Sales Order ID',
            name: 'salesOrderId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE_ITEM),
        },
        {
            displayName: 'Item ID',
            name: 'itemId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE_ITEM),
        },
    ];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function getSalesOrderProperties(): INodeProperties[] {
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
