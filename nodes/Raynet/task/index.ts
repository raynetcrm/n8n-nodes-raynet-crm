import type { INodeProperties } from 'n8n-workflow';
import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'task',
    idParam: 'taskId',
    descriptionLabel: 'Task Description',
    solutionLabel: 'Task Solution',
    extraRequiredCreate: [
        {
            displayName: 'Resolver',
            name: 'resolver',
            type: 'options',
            required: true,
            default: '',
            typeOptions: { loadOptionsMethod: 'getUsers' },
        } as INodeProperties,
        {
            displayName: 'Deadline',
            name: 'deadline',
            type: 'dateTime',
            required: true,
            default: '',
        } as INodeProperties,
    ],
};

export const taskLoadOptions = activityLoadOptions;
export const getTaskProperties = () => getActivityProperties(DEF);
export const taskConfig: EntityConfig = {
    listPath: '/task/',
    singlePath: '/task/',
    idParam: 'taskId',
    buildBody: buildActivityBody(DEF),
};
