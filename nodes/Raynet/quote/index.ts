import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildAddQuoteItemBody, buildModifyQuoteItemBody, buildQuoteBody } from './QuoteBody';

export { getQuoteProperties } from './QuoteProperties';
export { quoteLoadOptions } from './QuoteLoadOptions';

export const quoteConfig: EntityConfig = {
    listPath: '/offer/',
    singlePath: '/offer/',
    idParam: 'quoteId',
    buildBody: buildQuoteBody,
    itemIdParam: 'itemId',
    buildAddItemBody: buildAddQuoteItemBody,
    buildModifyItemBody: buildModifyQuoteItemBody,
    getManyExtraQs(ctx: IExecuteFunctions) {
        const qs: Record<string, string | number | boolean | undefined> = {};
        const status = ctx.getNodeParameter('offerStatus', 0, '') as string;
        if (status) {
            qs.offerStatus = status;
        }
        const productCategory = ctx.getNodeParameter('productCategoryCustom', 0, 0) as number;
        if (productCategory) {
            qs['productCategory[CUSTOM]'] = productCategory;
        }
        const productLine = ctx.getNodeParameter('productLineCustom', 0, 0) as number;
        if (productLine) {
            qs['productLine[CUSTOM]'] = productLine;
        }
        return qs;
    },
};
