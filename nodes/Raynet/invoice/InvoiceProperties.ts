import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

const SORT_COLUMNS = [
    { name: 'ID', value: 'id' },
    { name: 'Title', value: 'title' },
    { name: 'Code', value: 'code' },
    { name: 'Issue Date', value: 'issueDate' },
    { name: 'Created At', value: 'rowInfo.createdAt' },
    { name: 'Updated At', value: 'rowInfo.updatedAt' },
    { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [
    { name: 'Ascending', value: 'ASC' },
    { name: 'Descending', value: 'DESC' },
];

const ADDRESS_SPEC: INodeProperties[] = [
    { displayName: 'Street', name: 'street', type: 'string', default: '' },
    { displayName: 'City', name: 'city', type: 'string', default: '' },
    { displayName: 'ZIP Code', name: 'zipCode', type: 'string', default: '' },
    { displayName: 'Province', name: 'province', type: 'string', default: '' },
    { displayName: 'Country Code', name: 'country', type: 'string', default: '', description: 'ISO 3166-1 alpha-2 country code, e.g. CZ, SK' },
];

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    { displayName: 'Title', name: 'title', type: 'string', default: '' },
    { displayName: 'Constant Symbol', name: 'constantSymbol', type: 'string', default: '' },
    { displayName: 'Specific Symbol', name: 'specificSymbol', type: 'string', default: '' },
    { displayName: 'Variable Symbol', name: 'variableSymbol', type: 'string', default: '' },
    { displayName: 'Exchange Rate', name: 'currencyExchangeRate', type: 'number', default: 0 },
    { displayName: 'Payment Date', name: 'paymentDate', type: 'dateTime', default: '' },
    {
        displayName: 'Security Level',
        name: 'securityLevel',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    { displayName: 'Deal ID', name: 'businessCase', type: 'number', default: 0 },
    { displayName: 'Sales Order ID', name: 'salesOrder', type: 'number', default: 0 },
    {
        displayName: 'Owner',
        name: 'owner',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getUsers' },
    },
    { displayName: 'Note for Receiver', name: 'note', type: 'string', typeOptions: { rows: 3 }, default: '' },
    { displayName: 'Internal Note', name: 'privateNote', type: 'string', typeOptions: { rows: 3 }, default: '' },
    { displayName: 'Reason for Correction', name: 'creditNoteReason', type: 'string', default: '' },
    { displayName: 'Customer ID no.', name: 'billingRegNumber', type: 'string', default: '' },
    { displayName: 'Customer Tax ID no.', name: 'billingTaxNumber', type: 'string', default: '' },
    { displayName: 'Customer VAT ID no.', name: 'billingTaxNumber2', type: 'string', default: '' },
    {
        displayName: 'Customer Address',
        name: 'billingAddress',
        type: 'fixedCollection',
        default: {},
        options: [{ displayName: 'Address', name: 'billingAddressData', values: ADDRESS_SPEC }],
    },
    { displayName: 'Vendor Name', name: 'vendorName', type: 'string', default: '' },
    { displayName: 'Vendor ID no.', name: 'vendorRegNumber', type: 'string', default: '' },
    { displayName: 'Vendor Tax ID no.', name: 'vendorTaxNumber', type: 'string', default: '' },
    { displayName: 'Vendor VAT ID no.', name: 'vendorTaxNumber2', type: 'string', default: '' },
    {
        displayName: 'Vendor Address',
        name: 'vendorAddress',
        type: 'fixedCollection',
        default: {},
        options: [{ displayName: 'Address', name: 'vendorAddressData', values: ADDRESS_SPEC }],
    },
    { displayName: 'Vendor Email', name: 'vendorEmail', type: 'string', default: '' },
    { displayName: 'Vendor Phone Number', name: 'vendorPhoneNumber', type: 'string', default: '' },
    { displayName: 'Vendor Website', name: 'vendorWebsite', type: 'string', default: '' },
    { displayName: 'Vendor Bank Account Number', name: 'vendorBankAccountNumber', type: 'string', default: '' },
    { displayName: 'Vendor IBAN', name: 'vendorBankIban', type: 'string', default: '' },
    { displayName: 'Vendor SWIFT', name: 'vendorBankSwift', type: 'string', default: '' },
    { displayName: 'Vendor Recorded in Register', name: 'vendorBusinessRegisterNote', type: 'string', default: '' },
    {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getInvoiceCategories' },
    },
    { displayName: 'Flag Carrying Over Tax Responsibility', name: 'reverseTax', type: 'boolean', default: false },
    { displayName: 'Advance Is a Tax Move', name: 'proformaTaxMove', type: 'boolean', default: false },
    { displayName: 'Link to Other Invoice (ID)', name: 'normalInvoice', type: 'number', default: 0, description: 'For corrective or advance invoices' },
    { displayName: 'Number of Decimal Places', name: 'decimalPrecision', type: 'number', default: 0 },
    { displayName: 'Rounded Balance', name: 'roundingBalance', type: 'number', default: 0 },
    { displayName: 'Discount (currency)', name: 'discount', type: 'number', default: 0 },
    { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
    { displayName: 'Total Without VAT', name: 'baseAmount', type: 'number', default: 0 },
    { displayName: 'Total With VAT', name: 'totalAmount', type: 'number', default: 0 },
    { displayName: 'VAT Amount', name: 'taxAmount', type: 'number', default: 0 },
    { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated list of tags' },
    {
        displayName: 'Items',
        name: 'items',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add item',
        default: {},
        options: [
            {
                displayName: 'Item',
                name: 'itemEntry',
                values: [
                    { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    { displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0 },
                    { displayName: 'Tax Rate (%)', name: 'taxRate', type: 'number', default: 0 },
                    { displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
                    { displayName: 'Unit', name: 'unitLabel', type: 'string', default: '' },
                    { displayName: 'Discount (%)', name: 'discountPercent', type: 'number', default: 0 },
                    { displayName: 'Total Price With VAT', name: 'totalPrice', type: 'number', default: 0 },
                    { displayName: 'Sequence Number', name: 'sequenceNumber', type: 'number', default: 0 },
                    { displayName: 'Item ID (Update only)', name: 'id', type: 'number', default: 0, description: 'Positive → modify, negative → delete, empty → create' },
                ],
            },
        ],
    },
    {
        displayName: 'Payments',
        name: 'payments',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add payment',
        default: {},
        options: [
            {
                displayName: 'Payment',
                name: 'paymentEntry',
                values: [
                    { displayName: 'Date', name: 'date', type: 'dateTime', default: '' },
                    { displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
                    { displayName: 'Payment ID (Update only)', name: 'id', type: 'number', default: 0, description: 'Positive → modify, negative → delete, empty → create' },
                ],
            },
        ],
    },
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'invoice');

function getOperationSelector(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'getMany',
            displayOptions: { show: { resource: ['invoice'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new invoice' },
                { name: 'Update', value: 'update', description: 'Update an existing invoice' },
                { name: 'Get', value: 'get', description: 'Get an invoice by ID' },
                { name: 'Get Many', value: 'getMany', description: 'List invoices with filters' },
                { name: 'Delete', value: 'delete', description: 'Delete an invoice' },
                { name: 'Lock', value: 'lock', description: 'Lock an invoice record' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock an invoice record' },
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
            description: 'Unique invoice code',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Account ID',
            name: 'company',
            type: 'number',
            required: true,
            default: 0,
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
            displayName: 'Due Date',
            name: 'dueDate',
            type: 'dateTime',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Issue Date',
            name: 'issueDate',
            type: 'dateTime',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Invoice Type',
            name: 'invoiceType',
            type: 'options',
            required: true,
            default: 'NORMAL',
            options: [
                { name: 'Normal', value: 'NORMAL' },
                { name: 'Advance (Proforma)', value: 'PROFORMA' },
                { name: 'Corrective (Credit Note)', value: 'CREDIT_NOTE' },
            ],
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Invoice State',
            name: 'invoiceState',
            type: 'options',
            required: true,
            default: 'UNPAID',
            options: [
                { name: 'Unpaid', value: 'UNPAID' },
                { name: 'Partially Paid', value: 'PARTIALLY_PAID' },
                { name: 'Paid', value: 'PAID' },
                { name: 'Cancelled', value: 'CANCELLED' },
            ],
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Payment Type',
            name: 'paymentType',
            type: 'options',
            required: true,
            default: '',
            typeOptions: { loadOptionsMethod: 'getPaymentTypes' },
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Taxable Supply Date',
            name: 'taxableSupplyDate',
            type: 'dateTime',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Tax Payer',
            name: 'taxPayer',
            type: 'options',
            required: true,
            default: 'YES',
            options: [
                { name: 'Yes', value: 'YES' },
                { name: 'No', value: 'NO' },
            ],
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Customer Name',
            name: 'billingName',
            type: 'string',
            required: true,
            default: '',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Customer Address',
            name: 'billingAddress',
            type: 'fixedCollection',
            default: {},
            displayOptions: op(OperationType.CREATE),
            options: [{ displayName: 'Address', name: 'billingAddressData', values: ADDRESS_SPEC }],
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
            displayName: 'Invoice ID',
            name: 'invoiceId',
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
            options: [
                { displayName: 'Code', name: 'code', type: 'string', default: '' },
                { displayName: 'Account ID', name: 'company', type: 'number', default: 0 },
                {
                    displayName: 'Currency',
                    name: 'currency',
                    type: 'options',
                    default: '',
                    typeOptions: { loadOptionsMethod: 'getCurrencies' },
                },
                { displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '' },
                { displayName: 'Issue Date', name: 'issueDate', type: 'dateTime', default: '' },
                {
                    displayName: 'Invoice Type',
                    name: 'invoiceType',
                    type: 'options',
                    default: '',
                    options: [
                        { name: 'Normal', value: 'NORMAL' },
                        { name: 'Advance (Proforma)', value: 'PROFORMA' },
                        { name: 'Corrective (Credit Note)', value: 'CREDIT_NOTE' },
                    ],
                },
                {
                    displayName: 'Invoice State',
                    name: 'invoiceState',
                    type: 'options',
                    default: '',
                    options: [
                        { name: 'Unpaid', value: 'UNPAID' },
                        { name: 'Partially Paid', value: 'PARTIALLY_PAID' },
                        { name: 'Paid', value: 'PAID' },
                        { name: 'Cancelled', value: 'CANCELLED' },
                    ],
                },
                {
                    displayName: 'Payment Type',
                    name: 'paymentType',
                    type: 'options',
                    default: '',
                    typeOptions: { loadOptionsMethod: 'getPaymentTypes' },
                },
                { displayName: 'Taxable Supply Date', name: 'taxableSupplyDate', type: 'dateTime', default: '' },
                {
                    displayName: 'Tax Payer',
                    name: 'taxPayer',
                    type: 'options',
                    default: '',
                    options: [
                        { name: 'Yes', value: 'YES' },
                        { name: 'No', value: 'NO' },
                    ],
                },
                { displayName: 'Customer Name', name: 'billingName', type: 'string', default: '' },
                ...SHARED_OPTIONAL_FIELDS,
            ],
        },
    ];
}

function getGetProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Invoice ID',
            name: 'invoiceId',
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
            default: 'issueDate',
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
                            default: 'title',
                            options: [
                                { name: 'Title', value: 'title' },
                                { name: 'Code', value: 'code' },
                                { name: 'Owner ID', value: 'owner' },
                                { name: 'Deal ID', value: 'businessCase' },
                                { name: 'Issue Date', value: 'issueDate' },
                                { name: 'Invoice Type', value: 'invoiceType' },
                                { name: 'Taxable Supply Date', value: 'taxableSupplyDate' },
                                { name: 'Due Date', value: 'dueDate' },
                                { name: 'Payment Date', value: 'paymentDate' },
                                { name: 'Variable Symbol', value: 'variableSymbol' },
                                { name: 'Specific Symbol', value: 'specificSymbol' },
                                { name: 'Constant Symbol', value: 'constantSymbol' },
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
            displayName: 'Invoice ID',
            name: 'invoiceId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE),
        },
    ];
}

function getLockProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Invoice ID',
            name: 'invoiceId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK]),
        },
    ];
}

export function getInvoiceProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getGetManyProperties(),
        ...getDeleteProperties(),
        ...getLockProperties(),
    ];
}
