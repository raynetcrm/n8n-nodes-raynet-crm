import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';
import { priceListLoadOptions } from '../priceList/PriceListLoadOptions';

export const invoiceLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getInvoiceCategories: createPicklistLoader('/invoiceCategory/'),
    getPaymentTypes: createPicklistLoader('/paymentType/'),
    getCurrencies: priceListLoadOptions.getCurrencies,
};
