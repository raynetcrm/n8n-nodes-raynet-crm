import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

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

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Unit', name: 'unit', type: 'string', default: '' },
    { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
    { displayName: 'VAT Rate (%)', name: 'taxRate', type: 'number', default: 0 },
    {
        displayName: 'Category Name or ID',
        name: 'category',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getProductCategories' },
    },
    {
        displayName: 'Product Line Name or ID',
        name: 'productLine',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        default: '',
        typeOptions: { loadOptionsMethod: 'getProductLines' },
    },
    { displayName: 'Cost', name: 'cost', type: 'number', default: 0 },
    { displayName: 'Standard Price', name: 'price', type: 'number', default: 0 },
    { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated list of tags to assign to the product' },
];

const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Code', name: 'code', type: 'string', default: '' },
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    ...SHARED_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'product');

function getOperationSelector(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'getMany',
            displayOptions: { show: { resource: ['product'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new product', action: 'Create a product' },
                { name: 'Delete', value: 'delete', description: 'Delete a product', action: 'Delete a product' },
                { name: 'Get', value: 'get', description: 'Get a product by ID', action: 'Get a product' },
                { name: 'Get Many', value: 'getMany', description: 'List products with filters', action: 'Get a list of products' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a product as invalid', action: 'Invalidate a product' },
                { name: 'Renew Validity', value: 'renewValidity', description: 'Restore a previously invalidated product', action: 'Renew validity of a product' },
                { name: 'Update', value: 'update', description: 'Update an existing product', action: 'Update a product' },
            ],
        },
    ];
}

function getCreateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Code',
            name: 'code',
            type: 'string',
            required: true,
            default: '',
            description: 'Unique product code',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            required: true,
            default: '',
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
            displayName: 'Product ID',
            name: 'productId',
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
            displayName: 'Product ID',
            name: 'productId',
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
                                { name: 'Category ID', value: 'category' },
                                { name: 'Code', value: 'code' },
                                { name: 'Created At', value: 'rowInfo.createdAt' },
                                { name: 'ID', value: 'id' },
                                { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
                                { name: 'Name', value: 'name' },
                                { name: 'Product Line ID', value: 'productLine' },
                                { name: 'Tags', value: 'tags' },
                                { name: 'Unit', value: 'unit'},
                                { name: 'Updated At', value: 'rowInfo.updatedAt' },
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
            displayName: 'Product ID',
            name: 'productId',
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
            displayName: 'Product ID',
            name: 'productId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.INVALIDATE, OperationType.RENEW_VALIDITY]),
        },
    ];
}

export function getProductProperties(): INodeProperties[] {
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
