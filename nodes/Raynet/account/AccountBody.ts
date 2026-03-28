import type { IExecuteFunctions } from 'n8n-workflow';
import { processCommonField } from '../helpers';

export function buildAccountBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (operation === 'create') {
    body.name = ctx.getNodeParameter('name', 0);
    body.rating = ctx.getNodeParameter('rating', 0);
    body.state = ctx.getNodeParameter('state', 0);
    body.role = ctx.getNodeParameter('role', 0);
  }

  const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
  const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

  for (const [key, value] of Object.entries(additional)) {
    if (value === undefined || value === null || value === '') continue;
    if (processCommonField(body, key, value)) continue;

    if (key === 'addresses') {
      const items = (value as { address?: Array<Record<string, unknown>> })?.address;
      if (Array.isArray(items) && items.length > 0) {
        body.addresses = items.map((item) => {
          const address: Record<string, unknown> = {};
          const contactInfo: Record<string, unknown> = {};
          for (const f of ['name', 'street', 'city', 'province', 'zipCode', 'country']) {
            if (item[f]) address[f] = item[f];
          }
          if (item.lat != null) address.lat = item.lat;
          if (item.lng != null) address.lng = item.lng;
          for (const f of ['email', 'email2', 'tel1', 'tel1Type', 'tel2', 'tel2Type', 'fax', 'www', 'otherContact']) {
            if (item[f]) contactInfo[f] = item[f];
          }
          const entry: Record<string, unknown> = { address, contactInfo };
          if (item.territory != null) entry.territory = item.territory;
          return entry;
        });
      }
      continue;
    }

    body[key] = value;
  }

  return body;
}
