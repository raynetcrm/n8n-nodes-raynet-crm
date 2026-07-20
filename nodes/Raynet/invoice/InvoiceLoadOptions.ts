import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const invoiceLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getInvoiceCategories: createPicklistLoader('/invoiceCategory/'),
    getPaymentTypes: createPicklistLoader('/paymentType/'),
};
