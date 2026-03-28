import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

const PICKLIST_PATHS = {
  accountCategories: '/companyCategory/',
  contactSources: '/contactSource/',
  employeesNumbers: '/employeesNumber/',
  legalForms: '/legalForm/',
  paymentTerms: '/paymentTerm/',
  companyTurnovers: '/companyTurnover/',
  economyActivities: '/economyActivity/',
  companyClassifications1: '/companyClassification1/',
  companyClassifications2: '/companyClassification2/',
  companyClassifications3: '/companyClassification3/',
  territories: '/territory/',
} as const;

export const accountLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  getAccountCategories: createPicklistLoader(PICKLIST_PATHS.accountCategories),
  getContactSources: createPicklistLoader(PICKLIST_PATHS.contactSources),
  getEmployeesNumbers: createPicklistLoader(PICKLIST_PATHS.employeesNumbers),
  getLegalForms: createPicklistLoader(PICKLIST_PATHS.legalForms),
  getPaymentTerms: createPicklistLoader(PICKLIST_PATHS.paymentTerms),
  getCompanyTurnovers: createPicklistLoader(PICKLIST_PATHS.companyTurnovers),
  getEconomyActivities: createPicklistLoader(PICKLIST_PATHS.economyActivities),
  getCompanyClassifications1: createPicklistLoader(PICKLIST_PATHS.companyClassifications1),
  getCompanyClassifications2: createPicklistLoader(PICKLIST_PATHS.companyClassifications2),
  getCompanyClassifications3: createPicklistLoader(PICKLIST_PATHS.companyClassifications3),
  getTerritories: createPicklistLoader(PICKLIST_PATHS.territories),
};
