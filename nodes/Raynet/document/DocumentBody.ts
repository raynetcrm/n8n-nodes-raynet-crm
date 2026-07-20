import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection } from '../helpers';

const DATE_FIELDS = new Set(['validFrom', 'validTill']);

export function buildDocumentBody(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (operation === 'create') {
        const infoType = ctx.getNodeParameter('infoType', 0) as string;
        body.infoType = infoType;
        body.folder = ctx.getNodeParameter('folder', 0) as number;

        if (infoType === 'link') {
            body.link = {
                link: ctx.getNodeParameter('linkUrl', 0) as string,
                linkName: ctx.getNodeParameter('linkName', 0) as string,
            };
        } else {
            // file — user provides UUID obtained from a prior /fileUpload call
            const fileUuid = ctx.getNodeParameter('fileUuid', 0) as string;
            const fileName = ctx.getNodeParameter('fileName', 0) as string;
            body.file = { uuid: fileUuid, fileName };
        }

        const additional = ctx.getNodeParameter('additionalFields', 0, {}) as Record<string, unknown>;
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
    const fields = ctx.getNodeParameter('updateAdditionalFields', 0, {}) as Record<string, unknown>;
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
