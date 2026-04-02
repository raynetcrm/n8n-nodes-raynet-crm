import type { INodeProperties } from 'n8n-workflow';
import { OperationType, showOptionsForOp } from '../helpers';

const STATUS_OPTIONS = [
    { name: 'Draft', value: 'A_DRAFT' },
    { name: 'Completed', value: 'E_WIN' },
    { name: 'Cancelled', value: 'G_STORNO' },
];

const SHARED_OPTIONAL_FIELDS: INodeProperties[] = [
    {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: '',
        options: STATUS_OPTIONS,
    },
    {
        displayName: 'Security Level',
        name: 'securityLevel',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getSecurityLevels' },
    },
    { displayName: 'Template', name: 'template', type: 'boolean', default: false },
    { displayName: 'Valid From', name: 'validFrom', type: 'dateTime', default: '' },
    { displayName: 'Valid Until', name: 'validTill', type: 'dateTime', default: '' },
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'document');

function getOperationSelector(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'get',
            displayOptions: { show: { resource: ['document'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new document (link or file reference)' },
                { name: 'Update', value: 'update', description: 'Update an existing document' },
                { name: 'Get', value: 'get', description: 'Get a document by ID' },
                { name: 'Delete', value: 'delete', description: 'Delete a document' },
                { name: 'Lock', value: 'lock', description: 'Lock a document record' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a document record' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a document as invalid' },
                { name: 'Renew Validity', value: 'renewValidity', description: 'Restore a previously invalidated document' },
            ],
        },
    ];
}

function getCreateProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Content Type',
            name: 'infoType',
            type: 'options',
            required: true,
            default: 'link',
            options: [
                { name: 'Link', value: 'link', description: 'Store a URL as the document' },
                { name: 'File (UUID)', value: 'file', description: 'Reference a file already uploaded via the Raynet /fileUpload endpoint' },
            ],
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Folder ID',
            name: 'folder',
            type: 'number',
            required: true,
            default: 0,
            description: 'ID of the folder where the document will be stored. Find it in the Raynet CRM URL: ?view=ListView&en=Folder&ei={id}',
            displayOptions: op(OperationType.CREATE),
        },
        // Link fields — shown only when infoType = link
        {
            displayName: 'Link URL',
            name: 'linkUrl',
            type: 'string',
            required: true,
            default: '',
            displayOptions: { show: { resource: ['document'], operation: ['create'], infoType: ['link'] } },
        },
        {
            displayName: 'Link Name',
            name: 'linkName',
            type: 'string',
            required: true,
            default: '',
            displayOptions: { show: { resource: ['document'], operation: ['create'], infoType: ['link'] } },
        },
        // File fields — shown only when infoType = file
        {
            displayName: 'File UUID',
            name: 'fileUuid',
            type: 'string',
            required: true,
            default: '',
            description: 'UUID returned by the Raynet /fileUpload endpoint',
            displayOptions: { show: { resource: ['document'], operation: ['create'], infoType: ['file'] } },
        },
        {
            displayName: 'File Name',
            name: 'fileName',
            type: 'string',
            required: true,
            default: '',
            displayOptions: { show: { resource: ['document'], operation: ['create'], infoType: ['file'] } },
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
            displayName: 'Document ID',
            name: 'documentId',
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
                { displayName: 'Folder ID', name: 'folder', type: 'number', default: 0 },
                {
                    displayName: 'Link',
                    name: 'link',
                    type: 'fixedCollection',
                    default: {},
                    options: [
                        {
                            displayName: 'Link Info',
                            name: 'linkData',
                            values: [
                                { displayName: 'Link URL', name: 'link', type: 'string', default: '' },
                                { displayName: 'Link Name', name: 'linkName', type: 'string', default: '' },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'File',
                    name: 'file',
                    type: 'fixedCollection',
                    default: {},
                    options: [
                        {
                            displayName: 'File Info',
                            name: 'fileData',
                            values: [
                                { displayName: 'File UUID', name: 'uuid', type: 'string', default: '' },
                                { displayName: 'File Name', name: 'fileName', type: 'string', default: '' },
                                { displayName: 'Content Type', name: 'contentType', type: 'string', default: '' },
                                { displayName: 'File Size (bytes)', name: 'fileSize', type: 'number', default: 0 },
                            ],
                        },
                    ],
                },
                ...SHARED_OPTIONAL_FIELDS,
            ],
        },
    ];
}

function getGetProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Document ID',
            name: 'documentId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.GET),
        },
    ];
}

function getDeleteProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Document ID',
            name: 'documentId',
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
            displayName: 'Document ID',
            name: 'documentId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK, OperationType.INVALIDATE, OperationType.RENEW_VALIDITY]),
        },
    ];
}

export function getDocumentProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getDeleteProperties(),
        ...getLifecycleProperties(),
    ];
}
