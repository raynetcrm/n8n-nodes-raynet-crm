import type { IExecuteFunctions } from 'n8n-workflow';
import { processCommonField } from '../helpers';

export function buildProductBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.code = ctx.getNodeParameter('code', i) as string;
        body.name = ctx.getNodeParameter('name', i) as string;
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
        body[key] = value;
    }

    return body;
}
