import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const priceListLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getPriceListCategories: createPicklistLoader('/priceListCategory/'),
    getCurrencies: createPicklistLoader('/currency/', true),
};
