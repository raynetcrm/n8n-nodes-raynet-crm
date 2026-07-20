import type { IExecuteFunctions } from 'n8n-workflow';

export function buildFolderBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
    if (operation === 'update') {
        return {};
    }

    const body: Record<string, unknown> = {};
    body.name = ctx.getNodeParameter('name', 0) as string;

    const additional = ctx.getNodeParameter('additionalFields', 0, {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(additional)) {
        if (value === undefined || value === null || value === '') continue;
        body[key] = value;
    }

    return body;
}
