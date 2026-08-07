import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection } from '../helpers';

const DATE_FIELDS = new Set(['validFrom', 'validTill']);

export function buildDocumentBody(ctx: IExecuteFunctions, operation: 'create' | 'update', i: number): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        const infoType = ctx.getNodeParameter('infoType', i) as string;
        body.infoType = infoType;
        body.folder = ctx.getNodeParameter('folder', i) as number;

        if (infoType === 'link') {
            body.link = {
                link: ctx.getNodeParameter('linkUrl', i) as string,
                linkName: ctx.getNodeParameter('linkName', i) as string,
            };
        } else {
            // file — user provides UUID obtained from a prior /fileUpload call
            const fileUuid = ctx.getNodeParameter('fileUuid', i) as string;
            const fileName = ctx.getNodeParameter('fileName', i) as string;
            body.file = { uuid: fileUuid, fileName };
        }

        const additional = ctx.getNodeParameter('additionalFields', i, {}) as Record<string, unknown>;
        for (const [key, value] of Object.entries(additional)) {
            if (value === undefined || value === null || value === '') continue;
            if (DATE_FIELDS.has(key) && typeof value === 'string') {
                body[key] = value.substring(0, 10);
                continue;
            }
            body[key] = value;
        }
        return body;
    }

    // update
    const fields = ctx.getNodeParameter('updateAdditionalFields', i, {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null || value === '') continue;
        if (DATE_FIELDS.has(key) && typeof value === 'string') {
            body[key] = value.substring(0, 10);
            continue;
        }
        if (key === 'link') {
            const flat = flattenFixedCollection(value, 'linkData', false);
            if (flat) body.link = flat;
            continue;
        }
        if (key === 'file') {
            const flat = flattenFixedCollection(value, 'fileData', false);
            if (flat) body.file = flat;
            continue;
        }
        body[key] = value;
    }
    return body;
}
