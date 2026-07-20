import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildPriceListBody } from './PriceListBody';

export { getPriceListProperties } from './PriceListProperties';
export { priceListLoadOptions } from './PriceListLoadOptions';

export const priceListConfig: EntityConfig = {
    listPath: '/priceList/',
    singlePath: '/priceList/',
    idParam: 'priceListId',
    buildBody: buildPriceListBody,
    getManyExtraQs(ctx: IExecuteFunctions) {
        const qs: Record<string, string | number | boolean | undefined> = {};
        const primary = ctx.getNodeParameter('primary', 0, '') as string;
        if (primary) {
            qs['primary'] = primary;
        }
        const currency = ctx.getNodeParameter('currencyFilter', 0, '') as string | number;
        if (currency) {
            qs['currency[EQ]'] = currency;
        }
        return qs;
    },
};
