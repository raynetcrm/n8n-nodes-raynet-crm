import type { EntityConfig } from '../helpers';
import { buildMassEmailBody } from './MassEmailBody';

export const massEmailLoadOptions = {};
export { getMassEmailProperties } from './MassEmailProperties';
export const massEmailConfig: EntityConfig = {
    listPath: '/massEmail/',
    singlePath: '/massEmail/',
    idParam: 'massEmailId',
    buildBody: buildMassEmailBody,
};
