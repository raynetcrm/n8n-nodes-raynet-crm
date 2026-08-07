import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

export function buildPersonBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.lastName = ctx.getNodeParameter('lastName', i);
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
        if (key === 'privateAddress') {
            const flat = flattenFixedCollection(value, 'addressValues');
            if (flat) {
                body.privateAddress = flat;
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
        if (key === 'relationship') {
            const flat = flattenFixedCollection(value, 'relationshipValues', true);
            if (flat) {
                body.relationship = flat;
            }
            continue;
        }

        body[key] = value;
    }

    return body;
}
