import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildPersonBody } from './PersonBody';

export { getPersonProperties } from './PersonProperties';
export { personLoadOptions } from './PersonLoadOptions';

export const personConfig: EntityConfig = {
  listPath: '/person/',
  singlePath: '/person/',
  idParam: 'personId',
  buildBody: buildPersonBody,
  getManyExtraQs(ctx: IExecuteFunctions) {
    const qs: Record<string, string | number | boolean | undefined> = {};
    const relCompany = ctx.getNodeParameter('personRelationshipCustom', 0, 0) as number;
    if (relCompany) qs['personRelationship[CUSTOM]'] = relCompany;
    return qs;
  },
};
