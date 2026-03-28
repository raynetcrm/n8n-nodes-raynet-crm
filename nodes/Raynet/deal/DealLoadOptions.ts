import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

const PICKLIST_PATHS = {
  dealCategories: '/businessCaseCategory/',
  dealPhases: '/businessCasePhase/',
  dealClassifications1: '/businessCaseClassification1/',
  dealClassifications2: '/businessCaseClassification2/',
  dealClassifications3: '/businessCaseClassification3/',
  currencies: '/currency/',
} as const;

export const dealLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  getDealCategories: createPicklistLoader(PICKLIST_PATHS.dealCategories),
  getDealPhases: createPicklistLoader(PICKLIST_PATHS.dealPhases),
  getDealClassifications1: createPicklistLoader(PICKLIST_PATHS.dealClassifications1),
  getDealClassifications2: createPicklistLoader(PICKLIST_PATHS.dealClassifications2),
  getDealClassifications3: createPicklistLoader(PICKLIST_PATHS.dealClassifications3),
  getCurrencies: createPicklistLoader(PICKLIST_PATHS.currencies),
};
