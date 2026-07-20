import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const projectLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getProjectStatuses: createPicklistLoader('/projectStatus/'),
    getProjectCategories: createPicklistLoader('/projectCategory/'),
};
