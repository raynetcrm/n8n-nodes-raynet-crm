/**
 * Shared helpers for Raynet CRM node.
 */

import type { IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

// ---------------------------------------------------------------------------
// Auth & request
// ---------------------------------------------------------------------------

/**
 * Generates the base URL for the Raynet API based on the provided credentials.
 * @param credentials
 * @returns The base URL for the Raynet API
 */
export function getBaseUrl(credentials: { server?: string }): string {
  const base = credentials?.server?.trim() ? credentials.server.replace(/\/$/, '') : 'https://app.raynet.cz';
  return `${base}/api/v2`;
}

/**
 * Generates the authentication headers for the Raynet API based on the provided credentials.
 * @param credentials
 * @returns Generated headers including Authorization and X-Instance-Name
 */
export function getAuthHeaders(credentials: { username?: string; apiKey?: string; instanceName?: string }): Record<string, string> {
  const basic = Buffer.from(`${credentials.username ?? ''}:${credentials.apiKey ?? ''}`).toString('base64');
  return {
    Authorization: `Basic ${basic}`,
    'X-Instance-Name': credentials.instanceName ?? '',
    'Content-Type': 'application/json',
  };
}

/**
 * Generic http request to the Raynet API, using credentials from the node and returning the parsed JSON response. Automatically cleans query string parameters by removing undefined or empty values.
 * @param this Execution or load options context, used to get credentials and make the HTTP request
 * @param method The HTTP method to use
 * @param path The API endpoint path
 * @param body The request body
 * @param qs The query string parameters
 * @returns A promise resolving to the parsed JSON response
 */
export async function raynetRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: object,
  qs?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const credentials = await this.getCredentials('raynetApi');
  const url = `${getBaseUrl(credentials as { server?: string })}${path}`;

  const cleaned: Record<string, string | number | boolean> = {};
  if (qs) {
    for (const [k, v] of Object.entries(qs)) {
      if (v !== undefined && v !== '') cleaned[k] = v as string | number | boolean;
    }
  }

  const res = await this.helpers.httpRequest({
    url,
    method: method as IHttpRequestMethods,
    headers: getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string }),
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    qs: Object.keys(cleaned).length > 0 ? cleaned : undefined,
  });
  return typeof res === 'object' && res !== null ? res : {};
}

// ---------------------------------------------------------------------------
// Shared picklist loaders
// ---------------------------------------------------------------------------

/**
 * Loads a generic picklist from the given API path, mapping it to an array of INodePropertyOptions.
 * @param this Current ILoadOptionsFunctions context, used to get credentials and make the HTTP request
 * @param path The API endpoint for the picklist, e.g '/securityLevel/'
 * @returns A promise resolving to an array of INodePropertyOptions
 */
export async function loadPicklist(this: ILoadOptionsFunctions, path: string): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('raynetApi');
  const res = (await this.helpers.httpRequest({
    url: `${getBaseUrl(credentials as { server?: string })}${path}`,
    headers: getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string }),
  })) as { data?: Array<{ id: number; code01?: string; value?: string; name?: string }> };
  return (res?.data ?? []).map((p) => ({
    name: p.code01 ?? p.value ?? p.name ?? `ID ${p.id}`,
    value: p.id,
  }));
}

export async function loadSecurityLevels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return loadPicklist.call(this, '/securityLevel/');
}

/**
 * Loads all users from the Raynet API and maps them to INodePropertyOptions, which can be used in owner fields across multiple entities.
 * @returns A promise resolving to an array of INodePropertyOptions representing users
 */
export async function loadOwners(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('raynetApi');
  const res = (await this.helpers.httpRequest({
    url: `${getBaseUrl(credentials as { server?: string })}/person/`,
    headers: getAuthHeaders(credentials as { username?: string; apiKey?: string; instanceName?: string }),
    qs: { 'userAccount-id[NE]': '', limit: 100, sortColumn: 'lastName', sortDirection: 'ASC' },
  })) as { data?: Array<{ id: number; firstName?: string; lastName?: string; fullName?: string }> };
  return (res?.data ?? []).map((p) => ({
    name: (p.fullName ?? [p.firstName, p.lastName].filter(Boolean).join(' ')) || `ID ${p.id}`,
    value: p.id,
  }));
}

// ---------------------------------------------------------------------------
// Shared UI constants
// ---------------------------------------------------------------------------

/** Standard filter operators supported by all Raynet list endpoints. */
export const FILTER_OPERATORS = [
  { name: 'Equals', value: 'EQ' },
  { name: 'Not equals', value: 'NE' },
  { name: 'Like', value: 'LIKE' },
  { name: 'Like (case insensitive)', value: 'LIKE_NOCASE' },
  { name: 'In', value: 'IN' },
  { name: 'Greater than', value: 'GT' },
  { name: 'Greater or equal', value: 'GE' },
  { name: 'Less than', value: 'LT' },
  { name: 'Less or equal', value: 'LE' },
  { name: 'Equals or null', value: 'EQ_OR_NULL' },
  { name: 'Not equals or null', value: 'NE_OR_NULL' },
];

// ---------------------------------------------------------------------------
// Body-building utilities
// ---------------------------------------------------------------------------

/** Flattens a single-group fixedCollection into a plain object. */
export function flattenFixedCollection(value: unknown, groupName: string, skipZero = false): Record<string, unknown> | undefined {
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
export function processCommonField(body: Record<string, unknown>, key: string, value: unknown): boolean {
  if (key === 'tags' && typeof value === 'string') {
    body.tags = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
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

/**
 * Builds the query string for list endpoints based on common node parameters: pagination, sorting, full-text search, view, and filters. Used in the GET_MANY operation of all entities.
 */
export function getListParams(this: IExecuteFunctions): Record<string, string | number | boolean | undefined> {
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

  const filters = Array.isArray(rawFilters) ? rawFilters : rawFilters?.field ? [rawFilters] : [];

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

/** Configuration for a Raynet entity, defining its API endpoints and body-building logic. */
export interface EntityConfig {
  listPath: string;
  singlePath: string;
  idParam: string;
  buildBody: (ctx: IExecuteFunctions, op: 'create' | 'update') => Record<string, unknown>;
  getManyExtraQs?: (ctx: IExecuteFunctions) => Record<string, string | number | boolean | undefined>;
  /** Parameter name holding the sub-resource item ID (e.g. 'itemId') */
  itemIdParam?: string;
  /** Body builder for Add Item sub-operation */
  buildAddItemBody?: (ctx: IExecuteFunctions, i: number) => Record<string, unknown>;
  /** Body builder for Modify Item sub-operation */
  buildModifyItemBody?: (ctx: IExecuteFunctions, i: number) => Record<string, unknown>;
}


/**
 * Standard set of operations across all entities, plus some extra ones for specific entities (e.g. lock/unlock for companies and contacts).
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  GET_MANY = 'getMany',
  GET = 'get',
  DELETE = 'delete',
  ADD_TAG = 'addTag',
  DELETE_TAG = 'deleteTag',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  INVALIDATE = 'invalidate',
  RENEW_VALIDITY = 'renewValidity',
  ADD_ITEM = 'addItem',
  MODIFY_ITEM = 'modifyItem',
  DELETE_ITEM = 'deleteItem',
}

/**
 * Converts a string to an OperationType, throwing an error if it's not valid.
 * Useful for strings coming from node parameters that need to be mapped to the enum.
 * @param s The string to convert
 * @returns Either the corresponding OperationType or an error if the string is not a valid operation type
 */
export function stringToOperationType(s: string): OperationType {
  if (!Object.values(OperationType).includes(s as OperationType)) throw new Error(`Invalid operation type: ${s}`);
  return s as OperationType;
}

/**
 * Generates a function to load picklists for a specific API path, which can be used in the options of node parameters.
 * @param path The API endpoint for the picklist, e.g. '/securityLevel/'
 * @returns A function that can be used in the options of node parameters to load the picklist options from the API
 */
export function createPicklistLoader(path: string) {
  return function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    return loadPicklist.call(this, path);
  };
}

/** Converts operation types to display options for a given resource.
 *  @param operations Single operation or array of operations that the options should be shown for
 *  @param resource The resource for which to show options
 */
export function showOptionsForOp(operations: OperationType | OperationType[], resource: string) {
  return { show: { resource: [resource], operation: ([] as OperationType[]).concat(operations) } };
}
