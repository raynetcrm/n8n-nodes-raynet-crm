/**
 * Account resource – UI properties, body builder, load options, entity config.
 */

import type { INodeProperties, IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { loadPicklist, flattenFixedCollection, processCommonField } from './helpers';
import type { EntityConfig } from './helpers';

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const RATING_OPTIONS    = [{ name: 'A', value: 'A' }, { name: 'B', value: 'B' }, { name: 'C', value: 'C' }];
const STATE_OPTIONS     = [
  { name: 'Potential',    value: 'A_POTENTIAL' },
  { name: 'Actual',       value: 'B_ACTUAL' },
  { name: 'Deferred',     value: 'C_DEFERRED' },
  { name: 'Unattractive', value: 'D_UNATTRACTIVE' },
];
const ROLE_OPTIONS      = [
  { name: 'Subscriber', value: 'A_SUBSCRIBER' },
  { name: 'Partner',    value: 'B_PARTNER' },
  { name: 'Supplier',   value: 'C_SUPPLIER' },
  { name: 'Rival',      value: 'D_RIVAL' },
];
const TAX_PAYER_OPTIONS = [{ name: 'Yes', value: 'YES' }, { name: 'No', value: 'NO' }];

const SORT_COLUMNS = [
  { name: 'ID',               value: 'id' },
  { name: 'Name',             value: 'name' },
  { name: 'ID no.',           value: 'regNumber' },
  { name: 'Created At',       value: 'rowInfo.createdAt' },
  { name: 'Updated At',       value: 'rowInfo.updatedAt' },
  { name: 'Last Modified At', value: 'rowInfo.lastModifiedAt' },
];

const SORT_DIRECTIONS = [{ name: 'Ascending', value: 'ASC' }, { name: 'Descending', value: 'DESC' }];

const FILTER_OPERATORS = [
  { name: 'Equals',                  value: 'EQ' },
  { name: 'Not equals',              value: 'NE' },
  { name: 'Like',                    value: 'LIKE' },
  { name: 'Like (case insensitive)', value: 'LIKE_NOCASE' },
  { name: 'In',                      value: 'IN' },
  { name: 'Greater than',            value: 'GT' },
  { name: 'Greater or equal',        value: 'GE' },
  { name: 'Less than',               value: 'LT' },
  { name: 'Less or equal',           value: 'LE' },
  { name: 'Equals or null',          value: 'EQ_OR_NULL' },
  { name: 'Not equals or null',      value: 'NE_OR_NULL' },
];

// Shared address field list used in both Create and Update
const ADDRESS_VALUES: INodeProperties[] = [
  { displayName: 'Address Name',    name: 'name',         type: 'string', default: '' },
  { displayName: 'Street',          name: 'street',       type: 'string', default: '' },
  { displayName: 'City',            name: 'city',         type: 'string', default: '' },
  { displayName: 'Province/Region', name: 'province',     type: 'string', default: '' },
  { displayName: 'ZIP Code',        name: 'zipCode',      type: 'string', default: '' },
  { displayName: 'Country (code)',  name: 'country',      type: 'string', default: 'CZ' },
  { displayName: 'Latitude',        name: 'lat',          type: 'number', default: 0 },
  { displayName: 'Longitude',       name: 'lng',          type: 'number', default: 0 },
  { displayName: 'Territory', name: 'territory', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getTerritories' } },
  { displayName: 'Email',           name: 'email',        type: 'string', default: '' },
  { displayName: 'Email 2',         name: 'email2',       type: 'string', default: '' },
  { displayName: 'Phone 1',         name: 'tel1',         type: 'string', default: '' },
  { displayName: 'Phone 1 Type',    name: 'tel1Type',     type: 'string', default: '' },
  { displayName: 'Phone 2',         name: 'tel2',         type: 'string', default: '' },
  { displayName: 'Phone 2 Type',    name: 'tel2Type',     type: 'string', default: '' },
  { displayName: 'Fax',             name: 'fax',          type: 'string', default: '' },
  { displayName: 'WWW',             name: 'www',          type: 'string', default: '' },
  { displayName: 'Other Contact',   name: 'otherContact', type: 'string', default: '' },
];

const ADDRESSES_FIELD: INodeProperties = {
  displayName: 'Addresses',
  name: 'addresses',
  type: 'fixedCollection',
  typeOptions: { multipleValues: true },
  default: {},
  options: [{ displayName: 'Address', name: 'address', values: ADDRESS_VALUES }],
};

// Shared optional fields for Create
const CREATE_OPTIONAL_FIELDS: INodeProperties[] = [
  { displayName: 'This is an individual',        name: 'person',       type: 'boolean', default: false },
  { displayName: 'Last name of individual',      name: 'lastName',     type: 'string',  default: '' },
  { displayName: 'First name of individual',     name: 'firstName',    type: 'string',  default: '' },
  { displayName: 'Title before name',            name: 'titleBefore',  type: 'string',  default: '' },
  { displayName: 'Title after name',             name: 'titleAfter',   type: 'string',  default: '' },
  { displayName: 'Salutation',                   name: 'salutation',   type: 'string',  default: '' },
  { displayName: 'Security Level',               name: 'securityLevel',type: 'number',  default: 0,  description: 'Security Level ID' },
  { displayName: 'Owner',       name: 'owner',       type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getOwners' } },
  { displayName: 'Note to account',              name: 'notice',       type: 'string',  default: '' },
  { displayName: 'Category',    name: 'category',    type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getAccountCategories' } },
  { displayName: 'Contact Source', name: 'contactSource', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getContactSources' } },
  { displayName: 'Employees Number', name: 'employeesNumber', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getEmployeesNumbers' } },
  { displayName: 'Legal Form',  name: 'legalForm',   type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getLegalForms' } },
  { displayName: 'Payment Terms', name: 'paymentTerm', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getPaymentTerms' } },
  { displayName: 'Turnover',    name: 'turnover',    type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getCompanyTurnovers' } },
  { displayName: 'Industry',    name: 'economyActivity', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getEconomyActivities' } },
  { displayName: 'Classification 1', name: 'companyClassification1', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getCompanyClassifications1' } },
  { displayName: 'Classification 2', name: 'companyClassification2', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getCompanyClassifications2' } },
  { displayName: 'Classification 3', name: 'companyClassification3', type: 'options', default: '', typeOptions: { loadOptionsMethod: 'getCompanyClassifications3' } },
  { displayName: 'ID no.',           name: 'regNumber',  type: 'string', default: '' },
  { displayName: 'Tax ID no.',       name: 'taxNumber',  type: 'string', default: '' },
  { displayName: 'VAT ID no.',       name: 'taxNumber2', type: 'string', default: '' },
  { displayName: 'VAT Payer',        name: 'taxPayer',   type: 'options', default: '', options: TAX_PAYER_OPTIONS },
  { displayName: 'Bank account',     name: 'bankAccount',type: 'string', default: '' },
  { displayName: 'Databox',          name: 'databox',    type: 'string', default: '' },
  { displayName: 'Reference number (Court)', name: 'court', type: 'string', default: '' },
  { displayName: 'Birthday/Anniversary', name: 'birthday', type: 'dateTime', default: '' },
  ADDRESSES_FIELD,
  { displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated list of tags' },
];

// Update has the same fields plus Name, Rating, Status, Relationship
const UPDATE_OPTIONAL_FIELDS: INodeProperties[] = [
  { displayName: 'Name',         name: 'name',   type: 'string',  default: '' },
  { displayName: 'Rating',       name: 'rating', type: 'options', default: '', options: RATING_OPTIONS },
  { displayName: 'Status',       name: 'state',  type: 'options', default: '', options: STATE_OPTIONS },
  { displayName: 'Relationship', name: 'role',   type: 'options', default: '', options: ROLE_OPTIONS },
  ...CREATE_OPTIONAL_FIELDS,
];

const op = (operations: string[]) => ({ show: { resource: ['account'], operation: operations } });

// ---------------------------------------------------------------------------
// UI properties
// ---------------------------------------------------------------------------

export function getAccountProperties(): INodeProperties[] {
  return [
    // Operation selector
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      default: 'getMany',
      displayOptions: { show: { resource: ['account'] } },
      options: [
        { name: 'Create',        value: 'create',        description: 'Create a new account' },
        { name: 'Update',        value: 'update',        description: 'Update an existing account' },
        { name: 'Get',           value: 'get',           description: 'Get an account by ID' },
        { name: 'Get Many',      value: 'getMany',       description: 'List accounts with filters' },
        { name: 'Delete',        value: 'delete',        description: 'Delete an account' },
        { name: 'Lock',          value: 'lock',          description: 'Lock an account to prevent changes' },
        { name: 'Unlock',        value: 'unlock',        description: 'Unlock a locked account' },
        { name: 'Invalidate',    value: 'invalidate',    description: 'Mark an account as invalid' },
        { name: 'Renew Validity',value: 'renewValidity', description: 'Renew validity of an invalidated account' },
        { name: 'Add Tag',       value: 'addTag',        description: 'Add a tag to an account' },
        { name: 'Remove Tag',    value: 'deleteTag',     description: 'Remove a tag from an account' },
      ],
    },

    // Create – required fields
    { displayName: 'Name',         name: 'name',   type: 'string',  required: true, default: '', displayOptions: op(['create']) },
    { displayName: 'Rating',       name: 'rating', type: 'options', required: true, default: 'A',           options: RATING_OPTIONS, displayOptions: op(['create']) },
    { displayName: 'Status',       name: 'state',  type: 'options', required: true, default: 'A_POTENTIAL', options: STATE_OPTIONS,  displayOptions: op(['create']) },
    { displayName: 'Relationship', name: 'role',   type: 'options', required: true, default: 'B_PARTNER',   options: ROLE_OPTIONS,   displayOptions: op(['create']) },

    // Create – optional fields
    {
      displayName: 'Additional Fields',
      name: 'additionalFields',
      type: 'collection',
      placeholder: 'Add field',
      default: {},
      displayOptions: op(['create']),
      options: CREATE_OPTIONAL_FIELDS,
    },

    // Update – required ID
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['update']) },

    // Update – optional fields
    {
      displayName: 'Fields to Update',
      name: 'updateAdditionalFields',
      type: 'collection',
      placeholder: 'Add field',
      default: {},
      displayOptions: op(['update']),
      options: UPDATE_OPTIONAL_FIELDS,
    },

    // Get
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['get']) },

    // Get Many
    { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, description: 'Whether to return all results (max 1000)', displayOptions: op(['getMany']) },
    { displayName: 'Limit',  name: 'limit',  type: 'number', default: 50,  typeOptions: { minValue: 1, maxValue: 1000 }, displayOptions: op(['getMany']) },
    { displayName: 'Offset', name: 'offset', type: 'number', default: 0,   displayOptions: op(['getMany']) },
    { displayName: 'Sort Column',    name: 'sortColumn',    type: 'options', default: 'name', options: SORT_COLUMNS,    displayOptions: op(['getMany']) },
    { displayName: 'Sort Direction', name: 'sortDirection', type: 'options', default: 'ASC',  options: SORT_DIRECTIONS, displayOptions: op(['getMany']) },
    { displayName: 'Full-text Search', name: 'fulltext', type: 'string', default: '', displayOptions: op(['getMany']) },
    {
      displayName: 'Filters',
      name: 'filters',
      type: 'fixedCollection',
      typeOptions: { multipleValues: true },
      placeholder: 'Add filter',
      default: {},
      displayOptions: op(['getMany']),
      options: [{
        displayName: 'Filter', name: 'filter',
        values: [
          { displayName: 'Field', name: 'field', type: 'options', default: 'name', options: [
            { name: 'Name',                  value: 'name' },
            { name: 'Last Name (individual)',value: 'lastName' },
            { name: 'Person (individual)',   value: 'person' },
            { name: 'ID no.',               value: 'regNumber' },
            { name: 'Tax ID',               value: 'taxNumber' },
            { name: 'VAT ID',               value: 'taxNumber2' },
            { name: 'Owner',                value: 'owner' },
            { name: 'Rating',               value: 'rating' },
            { name: 'Role',                 value: 'role' },
            { name: 'Status',               value: 'state' },
            { name: 'Category',             value: 'category' },
            { name: 'Industry',             value: 'economyActivity' },
            { name: 'Classification 1',     value: 'companyClassification1' },
            { name: 'Classification 2',     value: 'companyClassification2' },
            { name: 'Classification 3',     value: 'companyClassification3' },
            { name: 'Primary Email',        value: 'primaryAddress-contactInfo.email' },
            { name: 'Primary Email 2',      value: 'primaryAddress-contactInfo.email2' },
            { name: 'Tags',                 value: 'tags' },
            { name: 'ID',                   value: 'id' },
            { name: 'Created At',           value: 'rowInfo.createdAt' },
            { name: 'Updated At',           value: 'rowInfo.updatedAt' },
            { name: 'Last Modified At',     value: 'rowInfo.lastModifiedAt' },
            { name: 'Row Access',           value: 'rowInfo.rowAccess' },
          ]},
          { displayName: 'Operator', name: 'operator', type: 'options', default: 'EQ', options: FILTER_OPERATORS },
          { displayName: 'Value',    name: 'value',    type: 'string',  default: '' },
        ],
      }],
    },
    { displayName: 'View', name: 'view', type: 'string', default: '', description: "Pass 'rowInfo' to return only status metadata", displayOptions: op(['getMany']) },

    // Delete / Lock / Unlock / Invalidate / Renew Validity – just need an ID
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['delete']) },
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['lock', 'unlock', 'invalidate', 'renewValidity']) },

    // Add Tag
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['addTag']) },
    { displayName: 'Tag', name: 'tag', type: 'string', required: true, default: '', displayOptions: op(['addTag']) },

    // Remove Tag
    { displayName: 'Account ID', name: 'accountId', type: 'number', required: true, default: 0, displayOptions: op(['deleteTag']) },
    { displayName: 'Tag', name: 'tag', type: 'string', required: true, default: '', displayOptions: op(['deleteTag']) },
  ];
}

// ---------------------------------------------------------------------------
// Body builder
// ---------------------------------------------------------------------------

export function buildAccountBody(
  ctx: IExecuteFunctions,
  operation: 'create' | 'update',
): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (operation === 'create') {
    body.name   = ctx.getNodeParameter('name',   0);
    body.rating = ctx.getNodeParameter('rating', 0);
    body.state  = ctx.getNodeParameter('state',  0);
    body.role   = ctx.getNodeParameter('role',   0);
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

// ---------------------------------------------------------------------------
// LoadOptions map
// ---------------------------------------------------------------------------

const PICKLIST_PATHS = {
  accountCategories:    '/companyCategory/',
  contactSources:       '/contactSource/',
  employeesNumbers:     '/employeesNumber/',
  legalForms:           '/legalForm/',
  paymentTerms:         '/paymentTerm/',
  companyTurnovers:     '/companyTurnover/',
  economyActivities:    '/economyActivity/',
  companyClassifications1: '/companyClassification1/',
  companyClassifications2: '/companyClassification2/',
  companyClassifications3: '/companyClassification3/',
  territories:          '/territory/',
} as const;

export const accountLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  getAccountCategories    (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.accountCategories); },
  getContactSources       (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.contactSources); },
  getEmployeesNumbers     (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.employeesNumbers); },
  getLegalForms           (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.legalForms); },
  getPaymentTerms         (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.paymentTerms); },
  getCompanyTurnovers     (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.companyTurnovers); },
  getEconomyActivities    (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.economyActivities); },
  getCompanyClassifications1(this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.companyClassifications1); },
  getCompanyClassifications2(this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.companyClassifications2); },
  getCompanyClassifications3(this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.companyClassifications3); },
  getTerritories          (this: ILoadOptionsFunctions) { return loadPicklist.call(this, PICKLIST_PATHS.territories); },
};

// ---------------------------------------------------------------------------
// Entity config
// ---------------------------------------------------------------------------

export const accountConfig: EntityConfig = {
  listPath:   '/company/',
  singlePath: '/company/',
  idParam:    'accountId',
  buildBody:  buildAccountBody,
};
