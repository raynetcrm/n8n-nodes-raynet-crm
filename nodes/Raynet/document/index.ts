import type { EntityConfig } from '../helpers';
import { buildDocumentBody } from './DocumentBody';

export { getDocumentProperties } from './DocumentProperties';
export { documentLoadOptions } from './DocumentLoadOptions';

export const documentConfig: EntityConfig = {
    listPath: '/dms/document/',
    singlePath: '/dms/document/',
    idParam: 'documentId',
    buildBody: buildDocumentBody,
};
