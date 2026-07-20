import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const productLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getProductCategories: createPicklistLoader('/productCategory/'),
    getProductLines: createPicklistLoader('/productLine/'),
};
