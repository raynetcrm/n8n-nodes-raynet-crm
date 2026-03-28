import type { IExecuteFunctions } from 'n8n-workflow';
import { processCommonField } from '../helpers';

export function buildDealBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (operation === 'create') {
    body.name = ctx.getNodeParameter('name', 0) as string;
    body.company = ctx.getNodeParameter('company', 0) as number;
  }

  const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
  const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

  for (const [key, value] of Object.entries(additional)) {
    if (value === undefined || value === null || value === '') continue;
    if (processCommonField(body, key, value)) continue;
    body[key] = value;
  }

  return body;
}

export function buildAddItemBody(ctx: IExecuteFunctions, i: number): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const fields = ctx.getNodeParameter('itemFields', i, {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue;
    body[key] = value;
  }
  return body;
}

export function buildModifyItemBody(ctx: IExecuteFunctions, i: number): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const fields = ctx.getNodeParameter('modifyItemFields', i, {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue;
    body[key] = value;
  }
  return body;
}
