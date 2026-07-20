import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildAddItemBody, buildDealBody, buildModifyItemBody } from './DealBody';

export { getDealProperties } from './DealProperties';
export { dealLoadOptions } from './DealLoadOptions';

export const dealConfig: EntityConfig = {
    listPath: '/businessCase/',
    singlePath: '/businessCase/',
    idParam: 'dealId',
    buildBody: buildDealBody,
    itemIdParam: 'itemId',
    buildAddItemBody,
    buildModifyItemBody,
    getManyExtraQs(ctx: IExecuteFunctions) {
        const qs: Record<string, string | number | boolean | undefined> = {};
        const status = ctx.getNodeParameter('status', 0, '') as string;
        if (status) {
            qs.status = status;
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
