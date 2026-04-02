import type { EntityConfig } from '../helpers';
import { buildProductBody } from './ProductBody';

export { getProductProperties } from './ProductProperties';
export { productLoadOptions } from './ProductLoadOptions';

export const productConfig: EntityConfig = {
    listPath: '/product/',
    singlePath: '/product/',
    idParam: 'productId',
    buildBody: buildProductBody,
};
