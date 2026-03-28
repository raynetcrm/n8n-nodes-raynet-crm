import type { EntityConfig } from '../helpers';
import { buildProjectBody, buildAddParticipantBody } from './ProjectBody';

export { getProjectProperties } from './ProjectProperties';
export { projectLoadOptions } from './ProjectLoadOptions';

export const projectConfig: EntityConfig = {
    listPath: '/project/',
    singlePath: '/project/',
    idParam: 'projectId',
    buildBody: buildProjectBody,
    participantPath: 'participants',
    participantIdParam: 'participantId',
    buildAddParticipantBody,
};
