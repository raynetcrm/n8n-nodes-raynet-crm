import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const leadLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
    getLeadPhases: createPicklistLoader('/leadPhase/'),
    getLeadCategories: createPicklistLoader('/leadCategory/'),
    getContactSources: createPicklistLoader('/contactSource/'),
    getTerritories: createPicklistLoader('/territory/'),
};
