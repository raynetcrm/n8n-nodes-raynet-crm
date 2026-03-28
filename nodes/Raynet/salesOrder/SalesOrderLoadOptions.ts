import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const salesOrderLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getSalesOrderCategories: createPicklistLoader('/salesOrderCategory/'),
    getSalesOrderStatuses: createPicklistLoader('/salesOrderStatus/'),
};
