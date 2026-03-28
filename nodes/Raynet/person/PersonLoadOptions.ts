import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

const PICKLIST_PATHS = {
    personCategories: '/personCategory/',
    personClassifications1: '/personClassification1/',
    personClassifications2: '/personClassification2/',
    personClassifications3: '/personClassification3/',
    languages: '/language/',
    maritalStatuses: '/maritalStatus/',
    telTypes: '/telType/',
} as const;

export const personLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getPersonCategories: createPicklistLoader(PICKLIST_PATHS.personCategories),
    getPersonClassifications1: createPicklistLoader(PICKLIST_PATHS.personClassifications1),
    getPersonClassifications2: createPicklistLoader(PICKLIST_PATHS.personClassifications2),
    getPersonClassifications3: createPicklistLoader(PICKLIST_PATHS.personClassifications3),
    getLanguages: createPicklistLoader(PICKLIST_PATHS.languages),
    getMaritalStatuses: createPicklistLoader(PICKLIST_PATHS.maritalStatuses),
    getTelTypes: createPicklistLoader(PICKLIST_PATHS.telTypes),
};
