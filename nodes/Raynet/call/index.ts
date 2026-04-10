import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'call',
    idParam: 'callId',
    descriptionLabel: 'Phone Call Description',
    solutionLabel: 'Phone Call Outcome',
};

export const callLoadOptions = activityLoadOptions;
export const getCallProperties = () => getActivityProperties(DEF);
export const callConfig: EntityConfig = {
    listPath: '/phoneCall/',
    singlePath: '/phoneCall/',
    idParam: 'callId',
    buildBody: buildActivityBody(DEF),
};
