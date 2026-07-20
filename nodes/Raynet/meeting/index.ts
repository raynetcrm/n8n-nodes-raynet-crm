import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'meeting',
    idParam: 'meetingId',
    descriptionLabel: 'Questions to Discuss',
    solutionLabel: 'Meeting Outcome',
};

export const meetingLoadOptions = activityLoadOptions;
export const getMeetingProperties = () => getActivityProperties(DEF);
export const meetingConfig: EntityConfig = {
    listPath: '/meeting/',
    singlePath: '/meeting/',
    idParam: 'meetingId',
    buildBody: buildActivityBody(DEF),
};
