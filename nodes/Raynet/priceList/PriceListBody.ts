import type { IExecuteFunctions } from 'n8n-workflow';
import { processCommonField } from '../helpers';

const DATE_FIELDS = new Set(['validFrom', 'validTill']);

export function buildPriceListBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.name = ctx.getNodeParameter('name', i) as string;
        body.code = ctx.getNodeParameter('code', i) as string;
        body.currency = ctx.getNodeParameter('currency', i) as number;
        body.validFrom = (ctx.getNodeParameter('validFrom', i) as string).substring(0, 10);
    }

    const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
    const additional = ctx.getNodeParameter(paramName, i, {}) as Record<string, unknown>;

    for (const [key, value] of Object.entries(additional)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        if (processCommonField(body, key, value)) {
            continue;
        }
        if (DATE_FIELDS.has(key) && typeof value === 'string') {
            body[key] = value.substring(0, 10);
            continue;
        }
        body[key] = value;
    }

    return body;
}
