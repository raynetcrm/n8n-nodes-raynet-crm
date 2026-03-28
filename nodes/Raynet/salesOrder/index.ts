import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildAddSalesOrderItemBody, buildModifySalesOrderItemBody, buildSalesOrderBody } from './SalesOrderBody';

export { getSalesOrderProperties } from './SalesOrderProperties';
export { salesOrderLoadOptions } from './SalesOrderLoadOptions';

export const salesOrderConfig: EntityConfig = {
    listPath: '/salesOrder/',
    singlePath: '/salesOrder/',
    idParam: 'salesOrderId',
    buildBody: buildSalesOrderBody,
    itemIdParam: 'itemId',
    buildAddItemBody: buildAddSalesOrderItemBody,
    buildModifyItemBody: buildModifySalesOrderItemBody,
    getManyExtraQs(ctx: IExecuteFunctions) {
        const qs: Record<string, string | number | boolean | undefined> = {};
        const status = ctx.getNodeParameter('salesOrderStatus', 0, '') as string;
        if (status) {
            qs.salesOrderStatus = status;
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
