import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

export const quoteLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  getOfferCategories: createPicklistLoader('/offerCategory/'),
  getOfferStatuses: createPicklistLoader('/offerStatus/'),
};
