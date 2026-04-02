import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildFolderBody } from './FolderBody';

export { getFolderProperties } from './FolderProperties';
export { folderLoadOptions } from './FolderLoadOptions';

export const folderConfig: EntityConfig = {
    listPath: '/dms/folder/',
    singlePath: '/dms/folder/',
    idParam: 'folderId',
    buildBody: buildFolderBody,
    getDeleteSuffix(ctx: IExecuteFunctions, i: number): string {
        return (ctx.getNodeParameter('cascade', i, false) as boolean) ? 'cascade' : '';
    },
};
