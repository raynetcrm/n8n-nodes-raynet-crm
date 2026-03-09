/**
 * Shared helpers for Raynet CRM node.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';

// ---------------------------------------------------------------------------
// Auth & request
// ---------------------------------------------------------------------------

export function getBaseUrl(credentials: { server?: string }): string {
  const base = credentials?.server?.trim()
    ? credentials.server.replace(/\/$/, '')
    : 'https://app.raynet.cz';
  return `${base}/api/v2`;
}

export function getAuthHeaders(
  credentials: { username?: string; apiKey?: string; instanceName?: string },
): Record<string, string> {
  const basic = Buffer.from(`${credentials.username ?? ''}:${credentials.apiKey ?? ''}`).toString('base64');
  return {
    Authorization: `Basic ${basic}`,
    'X-Instance-Name': credentials.instanceName ?? '',
    'Content-Type': 'application/json',
  };
}

export async function raynetRequest(
  this: IExecuteFunctions,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: object,
  qs?: Record<string, string | number | boolean | undefined>,
): Promise<unknown> {
  const credentials = await this.getCredentials('raynetApi');
  const url = `${getBaseUrl(credentials as { server?: string })}${path}`;
  const headers = getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string });

  const options: {
    url: string;
    method: typeof method;
    headers: Record<string, string>;
    body?: object;
    qs?: Record<string, string | number | boolean>;
    json: boolean;
  } = { url, method, headers, json: true };

  if (body && method !== 'GET') options.body = body;

  if (qs) {
    const cleaned: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(qs)) {
      if (v !== undefined && v !== '') cleaned[k] = v as string | number | boolean;
    }
    if (Object.keys(cleaned).length > 0) options.qs = cleaned;
  }

  const res = await this.helpers.httpRequest(options);
  return typeof res === 'object' && res !== null ? res : {};
}

// ---------------------------------------------------------------------------
// Shared picklist loaders
// ---------------------------------------------------------------------------

export async function loadPicklist(
  this: ILoadOptionsFunctions,
  path: string,
): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('raynetApi');
  const res = await this.helpers.httpRequest({
    url: `${getBaseUrl(credentials as { server?: string })}${path}`,
    headers: getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string }),
    json: true,
  }) as { data?: Array<{ id: number; code01?: string; value?: string; name?: string }> };
  return (res?.data ?? []).map((p) => ({
    name: (p.code01 ?? p.value ?? p.name) ?? `ID ${p.id}`,
    value: p.id,
  }));
}

export async function loadOwners(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('raynetApi');
  const res = await this.helpers.httpRequest({
    url: `${getBaseUrl(credentials as { server?: string })}/person/`,
    headers: getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string }),
    json: true,
    qs: { 'userAccount-id[NE]': '', limit: 100, sortColumn: 'lastName', sortDirection: 'ASC' },
  }) as { data?: Array<{ id: number; firstName?: string; lastName?: string; fullName?: string }> };
  return (res?.data ?? []).map((p) => ({
    name: (p.fullName ?? [p.firstName, p.lastName].filter(Boolean).join(' ')) || `ID ${p.id}`,
    value: p.id,
  }));
}

// ---------------------------------------------------------------------------
// Body-building utilities
// ---------------------------------------------------------------------------

/** Flattens a single-group fixedCollection into a plain object. */
export function flattenFixedCollection(
  value: unknown,
  groupName: string,
  skipZero = false,
): Record<string, unknown> | undefined {
  const group = (value as Record<string, Record<string, unknown>>)?.[groupName];
  if (!group || typeof group !== 'object') return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(group)) {
    if (v === undefined || v === null || v === '') continue;
    if (skipZero && v === 0) continue;
    out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Handles fields shared across entities: tags (CSV → array) and birthday (trim to date).
 * Returns true if the key was handled so the caller can skip it.
 */
export function processCommonField(
  body: Record<string, unknown>,
  key: string,
  value: unknown,
): boolean {
  if (key === 'tags' && typeof value === 'string') {
    body.tags = value.split(',').map((s) => s.trim()).filter(Boolean);
    return true;
  }
  if (key === 'birthday' && typeof value === 'string' && value) {
    body.birthday = value.substring(0, 10);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Get Many: shared query-string builder
// ---------------------------------------------------------------------------

export function getListParams(
  this: IExecuteFunctions,
): Record<string, string | number | boolean | undefined> {
  const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
  const limit = returnAll ? 1000 : (this.getNodeParameter('limit', 0) as number);

  const qs: Record<string, string | number | boolean | undefined> = {
    limit,
    offset: this.getNodeParameter('offset', 0) as number,
    sortColumn: this.getNodeParameter('sortColumn', 0) as string,
    sortDirection: this.getNodeParameter('sortDirection', 0) as string,
  };

  const fulltext = this.getNodeParameter('fulltext', 0) as string;
  if (fulltext) qs.fulltext = fulltext;

  const view = this.getNodeParameter('view', 0) as string;
  if (view) qs.view = view;

  const rawFilters = this.getNodeParameter('filters.filter', 0, []) as
    | Array<{ field?: string; operator?: string; value?: string }>
    | { field?: string; operator?: string; value?: string };

  const filters = Array.isArray(rawFilters)
    ? rawFilters
    : rawFilters?.field ? [rawFilters] : [];

  for (const f of filters) {
    if (!f.field) continue;
    const key = f.operator === 'EQ' || !f.operator ? f.field : `${f.field}[${f.operator}]`;
    qs[key] = f.value ?? '';
  }

  return qs;
}

// ---------------------------------------------------------------------------
// Entity config type used by the router
// ---------------------------------------------------------------------------

export interface EntityConfig {
  listPath: string;
  singlePath: string;
  idParam: string;
  buildBody: (ctx: IExecuteFunctions, op: 'create' | 'update') => Record<string, unknown>;
  getManyExtraQs?: (ctx: IExecuteFunctions) => Record<string, string | number | boolean | undefined>;
}
