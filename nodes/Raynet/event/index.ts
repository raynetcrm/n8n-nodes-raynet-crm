import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'event',
    idParam: 'eventId',
    descriptionLabel: 'Event Info',
};

export const eventLoadOptions = activityLoadOptions;
export const getEventProperties = () => getActivityProperties(DEF);
export const eventConfig: EntityConfig = {
    listPath: '/event/',
    singlePath: '/event/',
    idParam: 'eventId',
    buildBody: buildActivityBody(DEF),
};
