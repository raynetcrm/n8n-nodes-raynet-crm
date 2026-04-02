import type { INodeProperties } from 'n8n-workflow';
import { OperationType, showOptionsForOp } from '../helpers';

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'folder');

export function getFolderProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'create',
            displayOptions: { show: { resource: ['folder'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new DMS folder' },
                { name: 'Delete', value: 'delete', description: 'Delete a DMS folder' },
            ],
        },

        // Create
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
            options: [
                {
                    displayName: 'Parent Folder ID',
                    name: 'parent',
                    type: 'number',
                    default: 0,
                    description: 'Find in Raynet CRM URL: ?view=ListView&en=Folder&ei={id}',
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
                    typeOptions: { loadOptionsMethod: 'getDocumentCategories' },
                },
            ],
        },

        // Delete
        {
            displayName: 'Folder ID',
            name: 'folderId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE),
        },
        {
            displayName: 'Cascade Delete',
            name: 'cascade',
            type: 'boolean',
            default: false,
            description: 'Whether to delete all contents inside the folder recursively',
            displayOptions: op(OperationType.DELETE),
        },
    ];
}
