import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

export function buildLeadBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.topic = ctx.getNodeParameter('topic', 0) as string;
        body.priority = ctx.getNodeParameter('priority', 0) as string;
    }

    const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
    const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

    for (const [key, value] of Object.entries(additional)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        if (processCommonField(body, key, value)) {
            continue;
        }
        if (key === 'address') {
            const flat = flattenFixedCollection(value, 'addressData', true);
            if (flat) {
                body.address = flat;
            }
            continue;
        }
        body[key] = value;
    }

    return body;
}
