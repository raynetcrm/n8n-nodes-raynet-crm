import type { EntityConfig } from '../helpers';
import { buildInvoiceBody } from './InvoiceBody';

export { getInvoiceProperties } from './InvoiceProperties';
export { invoiceLoadOptions } from './InvoiceLoadOptions';

export const invoiceConfig: EntityConfig = {
    listPath: '/invoiceLight/',
    singlePath: '/invoiceLight/',
    idParam: 'invoiceId',
    buildBody: buildInvoiceBody,
};
