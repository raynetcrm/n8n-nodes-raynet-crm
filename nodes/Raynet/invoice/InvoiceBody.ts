import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

const DATE_FIELDS = new Set(['dueDate', 'issueDate', 'paymentDate', 'taxableSupplyDate']);

function cleanEntry(e: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(e)) {
        if (v === undefined || v === null || v === '') {
            continue;
        }
        if (k === 'id' && v === 0) {
            continue;
        }
        out[k] = v;
    }
    return out;
}

export function buildInvoiceBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        body.code = ctx.getNodeParameter('code', i) as string;
        body.company = ctx.getNodeParameter('company', i) as number;
        body.currency = ctx.getNodeParameter('currency', i) as number;
        body.dueDate = (ctx.getNodeParameter('dueDate', i) as string).substring(0, 10);
        body.issueDate = (ctx.getNodeParameter('issueDate', i) as string).substring(0, 10);
        body.invoiceType = ctx.getNodeParameter('invoiceType', i) as string;
        body.invoiceState = ctx.getNodeParameter('invoiceState', i) as string;
        body.paymentType = ctx.getNodeParameter('paymentType', i) as number;
        body.taxableSupplyDate = (ctx.getNodeParameter('taxableSupplyDate', i) as string).substring(0, 10);
        body.taxPayer = ctx.getNodeParameter('taxPayer', i) as string;
        body.billingName = ctx.getNodeParameter('billingName', i) as string;

        const billingAddr = flattenFixedCollection(ctx.getNodeParameter('billingAddress', i, {}) as unknown, 'billingAddressData', true);
        if (billingAddr) {
            body.billingAddress = billingAddr;
        }
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
        if (key === 'billingAddress') {
            const flat = flattenFixedCollection(value, 'billingAddressData', true);
            if (flat) body.billingAddress = flat;
            continue;
        }
        if (key === 'vendorAddress') {
            const flat = flattenFixedCollection(value, 'vendorAddressData', true);
            if (flat) body.vendorAddress = flat;
            continue;
        }
        if (key === 'items') {
            const entries = (value as { itemEntry?: Record<string, unknown>[] })?.itemEntry ?? [];
            if (entries.length) {
                body.items = entries.map(cleanEntry);
            }
            continue;
        }
        if (key === 'payments') {
            const entries = (value as { paymentEntry?: Record<string, unknown>[] })?.paymentEntry ?? [];
            if (entries.length) {
                body.payments = entries.map((e) => {
                    const entry = cleanEntry(e);
                    if (typeof entry.date === 'string') {
                        entry.date = entry.date.substring(0, 10);
                    }
                    return entry;
                });
            }
            continue;
        }
        body[key] = value;
    }

    return body;
}
