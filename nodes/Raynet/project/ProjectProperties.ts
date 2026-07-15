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
    { displayName: 'Contact Person ID', name: 'person', type: 'number', default: 0 },
    { displayName: 'Final Price', name: 'totalAmount', type: 'number', default: 0 },
    { displayName: 'Estimated Costs', name: 'estimatedValue', type: 'number', default: 0 },
    { displayName: 'Average Project Value', name: 'avgValue.totalAmount', type: 'number', default: 0 },
    { displayName: 'Minimum Project Value', name: 'minValue.totalAmount', type: 'number', default: 0 },
    { displayName: 'Maximum Project Value', name: 'maxValue.totalAmount', type: 'number', default: 0 },
    { displayName: 'Open From', name: 'validFrom', type: 'dateTime', default: '', description: 'Date of creation / opening' },
    { displayName: 'Closed', name: 'validTill', type: 'dateTime', default: '', description: 'Date of closing' },
    { displayName: 'Scheduled End', name: 'scheduledEnd', type: 'dateTime', default: '', description: 'Scheduled completion date' },
    { displayName: 'Note', name: 'description', type: 'string', typeOptions: { rows: 3 }, default: '' },
    {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getProjectCategories' },
    },
    {
        displayName: 'Status',
        name: 'projectStatus',
        type: 'options',
        default: '',
        typeOptions: { loadOptionsMethod: 'getProjectStatuses' },
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
    ...SHARED_OPTIONAL_FIELDS,
];

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, 'project');

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
            displayOptions: { show: { resource: ['project'] } },
            options: [
                { name: 'Create', value: 'create', description: 'Create a new project' },
                { name: 'Update', value: 'update', description: 'Update an existing project' },
                { name: 'Get', value: 'get', description: 'Get a project by ID' },
                { name: 'Get Many', value: 'getMany', description: 'List projects with filters' },
                { name: 'Delete', value: 'delete', description: 'Delete a project' },
                { name: 'Lock', value: 'lock', description: 'Lock a project to prevent changes' },
                { name: 'Unlock', value: 'unlock', description: 'Unlock a locked project' },
                { name: 'Invalidate', value: 'invalidate', description: 'Mark a project as invalid' },
                { name: 'Renew Validity', value: 'renewValidity', description: 'Renew validity of an invalidated project' },
                { name: 'Add Participant', value: 'addParticipant', description: 'Add a participant to a project' },
                { name: 'Delete Participant', value: 'deleteParticipant', description: 'Remove a participant from a project' },
                { name: 'List Participants', value: 'listParticipants', description: 'List participants of a project' },
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
            description: 'Subject / name of the project',
            displayOptions: op(OperationType.CREATE),
        },
        {
            displayName: 'Account ID',
            name: 'company',
            type: 'number',
            required: true,
            default: 0,
            description: 'ID of the account this project is created for',
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
            displayName: 'Project ID',
            name: 'projectId',
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
            displayName: 'Project ID',
            name: 'projectId',
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
                                { name: 'Account ID', value: 'company' },
                                { name: 'Contact Person ID', value: 'person' },
                                { name: 'Status ID', value: 'projectStatus' },
                                { name: 'Category ID', value: 'category' },
                                { name: 'Owner ID', value: 'owner' },
                                { name: 'Open From', value: 'validFrom' },
                                { name: 'Closed', value: 'validTill' },
                                { name: 'Scheduled End', value: 'scheduledEnd' },
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
            displayName: 'Project ID',
            name: 'projectId',
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
            displayName: 'Project ID',
            name: 'projectId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op([OperationType.LOCK, OperationType.UNLOCK, OperationType.INVALIDATE, OperationType.RENEW_VALIDITY]),
        },
    ];
}

function getAddParticipantProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Project ID',
            name: 'projectId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.ADD_PARTICIPANT),
        },
        {
            displayName: 'Participant Fields',
            name: 'participantFields',
            type: 'collection',
            placeholder: 'Add field',
            default: {},
            displayOptions: op(OperationType.ADD_PARTICIPANT),
            options: [
                { displayName: 'Account ID', name: 'company', type: 'number', default: 0, description: 'Either Account ID or Contact ID is required' },
                { displayName: 'Contact ID', name: 'person', type: 'number', default: 0, description: 'Either Account ID or Contact ID is required' },
                {
                    displayName: 'Participation Category ID',
                    name: 'category',
                    type: 'number',
                    default: 0,
                },
                { displayName: 'Note', name: 'note', type: 'string', default: '' },
            ],
        },
    ];
}

function getDeleteParticipantProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Project ID',
            name: 'projectId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE_PARTICIPANT),
        },
        {
            displayName: 'Participant ID',
            name: 'participantId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.DELETE_PARTICIPANT),
        },
    ];
}

function getListParticipantsProperties(): INodeProperties[] {
    return [
        {
            displayName: 'Project ID',
            name: 'projectId',
            type: 'number',
            required: true,
            default: 0,
            displayOptions: op(OperationType.LIST_PARTICIPANTS),
        },
    ];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function getProjectProperties(): INodeProperties[] {
    return [
        ...getOperationSelector(),
        ...getCreateProperties(),
        ...getUpdateProperties(),
        ...getGetProperties(),
        ...getGetManyProperties(),
        ...getDeleteProperties(),
        ...getLifecycleProperties(),
        ...getAddParticipantProperties(),
        ...getDeleteParticipantProperties(),
        ...getListParticipantsProperties(),
    ];
}
