/**
 * Raynet CRM v2 – n8n custom node.
 * Thin router: delegates to entity-specific configs for body building / loadOptions.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  IDataObject,
} from 'n8n-workflow';

import { raynetRequest, getListParams, loadOwners, loadSecurityLevels } from './helpers';
import type { EntityConfig } from './helpers';

import { getAccountProperties, accountLoadOptions, accountConfig } from './AccountDescription';
import { getPersonProperties, personLoadOptions, personConfig } from './PersonDescription';

// ---------------------------------------------------------------------------
// Resources & entity registry
// ---------------------------------------------------------------------------

const RESOURCE_OPTIONS = [
  { name: 'Account', value: 'account', description: 'Contact – account (company or individual)' },
  { name: 'Person',  value: 'person',  description: 'Contact – person (individual contact)' },
];

const ENTITY_MAP: Record<string, EntityConfig> = {
  account: accountConfig,
  person:  personConfig,
};

const allLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  getOwners: loadOwners,
  getSecurityLevels: loadSecurityLevels,
  ...accountLoadOptions,
  ...personLoadOptions,
};

// ---------------------------------------------------------------------------
// Node class
// ---------------------------------------------------------------------------

export class Raynet implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Raynet CRM',
    name: 'raynet',
    icon: 'file:raynetCrm.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
    description: 'Consume Raynet CRM v2 API (accounts, contacts, …)',
    defaultVersion: 1,
    defaults: { name: 'Raynet CRM' },
    credentials: [{ name: 'raynetApi', required: true }],
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        default: 'account',
        options: RESOURCE_OPTIONS,
      },
      ...getAccountProperties(),
      ...getPersonProperties(),
    ],
  };

  methods = {
    loadOptions: allLoadOptions,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource  = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const items     = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const cfg = ENTITY_MAP[resource];
    if (!cfg) throw new Error(`Resource "${resource}" is not implemented.`);

    // ----- Get Many -----
    if (operation === 'getMany') {
      const qs = getListParams.call(this);
      if (cfg.getManyExtraQs) Object.assign(qs, cfg.getManyExtraQs(this));

      const res = await raynetRequest.call(this, 'GET', cfg.listPath, undefined, qs) as {
        data?: unknown[];
      };
      for (let i = 0; i < (res?.data ?? []).length; i++) {
        returnData.push({ json: (res.data as IDataObject[])[i], pairedItem: { item: i } });
      }
      return [returnData];
    }

    // ----- Single-item operations -----
    const iterations = operation === 'create' ? 1 : items.length;

    const postActions: Record<string, string> = {
      lock: 'lock', unlock: 'unlock', invalidate: 'invalid', renewValidity: 'valid',
    };

    for (let i = 0; i < iterations; i++) {
      try {
        if (operation === 'create') {
          const body = cfg.buildBody(this, 'create');
          const res = await raynetRequest.call(this, 'PUT', cfg.listPath, body) as { success?: boolean; data?: { id: number } };
          returnData.push({ json: { id: res?.data?.id, success: res?.success } as IDataObject, pairedItem: { item: i } });

        } else if (operation === 'update') {
          const id = this.getNodeParameter(cfg.idParam, i) as number;
          const body = cfg.buildBody(this, 'update');
          await raynetRequest.call(this, 'POST', `${cfg.singlePath}${id}/`, body);
          returnData.push({ json: { id, success: true } as IDataObject, pairedItem: { item: i } });

        } else if (operation === 'get') {
          const id = this.getNodeParameter(cfg.idParam, i) as number;
          const res = await raynetRequest.call(this, 'GET', `${cfg.singlePath}${id}/`) as { data?: unknown };
          returnData.push({ json: (res?.data as IDataObject) ?? {}, pairedItem: { item: i } });

        } else if (operation === 'delete') {
          const id = this.getNodeParameter(cfg.idParam, i) as number;
          await raynetRequest.call(this, 'DELETE', `${cfg.singlePath}${id}/`);
          returnData.push({ json: { id, success: true } as IDataObject, pairedItem: { item: i } });

        } else if (postActions[operation]) {
          const id = this.getNodeParameter(cfg.idParam, i) as number;
          await raynetRequest.call(this, 'POST', `${cfg.singlePath}${id}/${postActions[operation]}`);
          returnData.push({ json: { id, success: true } as IDataObject, pairedItem: { item: i } });

        } else if (operation === 'addTag') {
          const id  = this.getNodeParameter(cfg.idParam, i) as number;
          const tag = this.getNodeParameter('tag', i) as string;
          await raynetRequest.call(this, 'PUT', `${cfg.singlePath}${id}/tag`, { tag });
          returnData.push({ json: { id, tag, success: true } as IDataObject, pairedItem: { item: i } });

        } else if (operation === 'deleteTag') {
          const id  = this.getNodeParameter(cfg.idParam, i) as number;
          const tag = this.getNodeParameter('tag', i) as string;
          await raynetRequest.call(this, 'DELETE', `${cfg.singlePath}${id}/tag`, { tag });
          returnData.push({ json: { id, tag, success: true } as IDataObject, pairedItem: { item: i } });
        }
      } catch (err) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (err as Error).message } as IDataObject, pairedItem: { item: i } });
        } else {
          throw err;
        }
      }
    }

    return [returnData];
  }
}
