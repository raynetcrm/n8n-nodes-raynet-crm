import type { IExecuteFunctions } from 'n8n-workflow';
import type { EntityConfig } from '../helpers';
import { buildLeadBody } from './LeadBody';

export { getLeadProperties } from './LeadProperties';
export { leadLoadOptions } from './LeadLoadOptions';

export const leadConfig: EntityConfig = {
    listPath: '/lead/',
    singlePath: '/lead/',
    idParam: 'leadId',
    buildBody: buildLeadBody,
    getManyExtraQs(ctx: IExecuteFunctions) {
        const qs: Record<string, string | number | boolean | undefined> = {};
        const status = ctx.getNodeParameter('leadStatus', 0, '') as string;
        if (status) {
            qs['status'] = status;
        }
        return qs;
    },
};
