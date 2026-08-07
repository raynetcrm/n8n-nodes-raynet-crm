import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

export function buildLeadBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.topic = ctx.getNodeParameter('topic', i) as string;
        body.priority = ctx.getNodeParameter('priority', i) as string;
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
        if (key === 'contactInfo') {
            const flat = flattenFixedCollection(value, 'contactInfoValues');
            if (flat) {
                body.contactInfo = flat;
            }
            continue;
        }
        if (key === 'address') {
            const flat = flattenFixedCollection(value, 'address', true);
            if (flat) {
                body.address = flat;
            }
            continue;
        }
        if (key === 'socialNetworkContact') {
            const flat = flattenFixedCollection(value, 'socialValues');
            if (flat) {
                body.socialNetworkContact = flat;
            }
            continue;
        }
        body[key] = value;
    }

    return body;
}
