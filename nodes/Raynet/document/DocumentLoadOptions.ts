import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

// Document has no entity-specific picklists; securityLevel is registered globally.
export const documentLoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {};
