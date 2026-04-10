import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

export function buildMassEmailBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.title = ctx.getNodeParameter('title', 0) as string;
        body.source = ctx.getNodeParameter('source', 0) as string;
        body.externalId = ctx.getNodeParameter('externalId', 0) as string;
    }

    const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
    const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

    for (const [key, value] of Object.entries(additional)) {
        if (value === undefined || value === null || value === '') continue;
        if (processCommonField(body, key, value)) continue;

        if (key === 'stats') {
            const stats = flattenFixedCollection(value, 'statsEntry', false);
            if (stats) body.stats = stats;
            continue;
        }

        body[key] = value;
    }

    return body;
}
