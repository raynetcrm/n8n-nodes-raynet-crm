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
        displayName: 'Category',
        name: 'category',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getPriceListCategories' },
    },
    { displayName: 'Valid To', name: 'validTill', type: 'dateTime', default: '', description: 'End of price list validity — sent as YYYY-MM-DD' },
    { displayName: 'Note', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
];

const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Name', name: 'name', type: 'string', default: '' },
    { displayName: 'Code', name: 'code', type: 'string', default: '' },
    {
        displayName: 'Currency',
        name: 'currency',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getCurrencies' },
    },
    { displayName: 'Open From', name: 'validFrom', type: 'dateTime', default: '', description: 'Start of price list validity — sent as YYYY-MM-DD' },
    ...SHARED_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'priceList');

function getOperationSelector(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'getMany',
            displayOptions: { show: { resource: ['priceList'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new price list' },
                { name: 'Update', value: 'update', description: 'Update an existing price list' },
                { name: 'Get', value: 'get', description: 'Get a price list by ID' },
                { name: 'Get Many', value: 'getMany', description: 'List price lists with filters' },
                { name: 'Delete', value: 'delete', description: 'Delete a price list' },
                { name: 'Lock', value: 'lock', description: 'Lock a price list to prevent changes' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked price list' },
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
            displayName: 'Code',
            name: 'code',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Currency',
            name: 'currency',
            type: 'options',
            required: true,
            default: '',
            typeOptions: { loadOptionsMethod: 'getCurrencies' },
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Open From',
            name: 'validFrom',
            type: 'dateTime',
            required: true,
            default: '',
            description: 'Start of price list validity — sent as YYYY-MM-DD',
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
            displayName: 'Price List ID',
            name: 'priceListId',
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
            displayName: 'Price List ID',
            name: 'priceListId',
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
                            default: 'name',
                            options: [
                                { name: 'Name', value: 'name' },
                                { name: 'Code', value: 'code' },
                                { name: 'Open From', value: 'validFrom' },
                                { name: 'Valid To', value: 'validTill' },
                                { name: 'Owner ID', value: 'owner.id' },
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
            displayName: 'Primary',
            name: 'primary',
            type: 'options',
            default: '',
            description: 'Filter by whether this is the default price list',
            options: [
                { name: '(Any)', value: '' },
                { name: 'Yes', value: 'YES' },
                { name: 'No', value: 'NO' },
            ],
            displayOptions: op(OperationType.GET_MANY),
        },
        {
            displayName: 'Currency',
            name: 'currencyFilter',
            type: 'options',
            default: '',
            description: 'Filter by currency',
            typeOptions: { loadOptionsMethod: 'getCurrencies' },
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
            displayName: 'Price List ID',
            name: 'priceListId',
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
            displayName: 'Price List ID',
            name: 'priceListId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK]),
        },
    ];
}

export function getPriceListProperties(): INodeProperties[] {
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
