import { activityLoadOptions, buildActivityBody, getActivityProperties, ActivityDef } from '../activity/activityShared';
import type { EntityConfig } from '../helpers';

const DEF: ActivityDef = {
    resource: 'letter',
    idParam: 'letterId',
    descriptionLabel: 'Content of the Letter',
};

export const letterLoadOptions = activityLoadOptions;
export const getLetterProperties = () => getActivityProperties(DEF);
export const letterConfig: EntityConfig = {
    listPath: '/letter/',
    singlePath: '/letter/',
    idParam: 'letterId',
    buildBody: buildActivityBody(DEF),
};
