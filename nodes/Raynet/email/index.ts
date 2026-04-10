import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'email',
    idParam: 'emailId',
    descriptionLabel: 'Email Content',
};

export const emailLoadOptions = activityLoadOptions;
export const getEmailProperties = () => getActivityProperties(DEF);
export const emailConfig: EntityConfig = {
    listPath: '/email/',
    singlePath: '/email/',
    idParam: 'emailId',
    buildBody: buildActivityBody(DEF),
};
