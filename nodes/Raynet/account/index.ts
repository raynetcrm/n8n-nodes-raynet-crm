import type { EntityConfig } from '../helpers';
import { buildAccountBody } from './AccountBody';

export { getAccountProperties } from './AccountProperties';
export { accountLoadOptions } from './AccountLoadOptions';

export const accountConfig: EntityConfig = {
  listPath: '/company/',
  singlePath: '/company/',
  idParam: 'accountId',
  buildBody: buildAccountBody,
};
