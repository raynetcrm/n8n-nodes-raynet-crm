import type { IExecuteFunctions } from 'n8n-workflow';
import { processCommonField } from '../helpers';

const DATE_FIELDS = new Set(['validFrom', 'validTill', 'expirationDate', 'requestDeliveryDate']);

export function buildSalesOrderBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.name = ctx.getNodeParameter('name', i) as string;
        body.company = ctx.getNodeParameter('company', i) as number;
        body.businessCase = ctx.getNodeParameter('businessCase', i) as number;
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

export function buildAddSalesOrderItemBody(ctx: IExecuteFunctions, i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    const fields = ctx.getNodeParameter('itemFields', i, {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        body[key] = value;
    }
    return body;
}

export function buildModifySalesOrderItemBody(ctx: IExecuteFunctions, i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    const fields = ctx.getNodeParameter('modifyItemFields', i, {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        body[key] = value;
    }
    return body;
}
