# Resource Module Templates

Use these conventions when creating a new CRM resource module for the Raynet n8n node.

---

## Standard Module File Structure

```
nodes/Raynet/
└── {resource}/                        ← lowercase singular (e.g. lead, deal, activity)
    ├── index.ts                       ← EntityConfig + re-exports (entry point)
    ├── {Resource}Properties.ts        ← INodeProperties[] — UI definitions
    ├── {Resource}Body.ts              ← buildBody function — request payload
    └── {Resource}LoadOptions.ts       ← loadOptions object — dynamic picklists
```

**Canonical example:** `nodes/Raynet/account/`

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Folder name | lowercase singular | `lead` |
| File prefix | PascalCase matching folder | `Lead` |
| ENTITY_MAP key | lowercase (matches folder) | `lead` |
| UI display name | Title case | `Lead` |
| Config export | `{resource}Config` | `leadConfig` |
| Properties export | `get{Resource}Properties` | `getLeadProperties` |
| Body builder export | `build{Resource}Body` | `buildLeadBody` |
| LoadOptions export | `{resource}LoadOptions` | `leadLoadOptions` |

---

## 1) `{Resource}Properties.ts`

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { FILTER_OPERATORS, OperationType, showOptionsForOp } from '../helpers';

const op = (operations: OperationType | OperationType[]) => showOptionsForOp(operations, '{resource}');

export function get{Resource}Properties(): INodeProperties[] {
  return [
    // Operation selector
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      noDataExpression: true,
      default: 'getMany',
      displayOptions: { show: { resource: ['{resource}'] } },
      options: [
        // List all supported operations
      ],
    },
    // ... field definitions per operation
  ];
}
```

**Rules:**
- Import only `INodeProperties` from `n8n-workflow` and the required helpers.
- Use the `op()` helper to set `displayOptions` — never hardcode resource names in `displayOptions`.
- No HTTP calls, no body building, no imports from sibling description files.

---

## 2) `{Resource}Body.ts`

```typescript
import type { IExecuteFunctions } from 'n8n-workflow';
import { flattenFixedCollection, processCommonField } from '../helpers';

export function build{Resource}Body(ctx: IExecuteFunctions, operation: 'create' | 'update'): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (operation === 'create') {
    // assign required create fields from ctx.getNodeParameter(...)
  }

  const paramName = operation === 'update' ? 'updateAdditionalFields' : 'additionalFields';
  const additional = ctx.getNodeParameter(paramName, 0, {}) as Record<string, unknown>;

  for (const [key, value] of Object.entries(additional)) {
    if (value === undefined || value === null || value === '') continue;
    if (processCommonField(body, key, value)) continue;
    // handle fixedCollection fields with flattenFixedCollection()
    body[key] = value;
  }

  return body;
}
```

**Rules:**
- Use `processCommonField` for `tags` (CSV→array) and `birthday` (trim to date).
- Use `flattenFixedCollection` for fixedCollection fields.
- No HTTP calls. No imports from other resource modules.

---

## 3) `{Resource}LoadOptions.ts`

```typescript
import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { createPicklistLoader } from '../helpers';

const PICKLIST_PATHS = {
  {resource}Categories: '/{resource}Category/',
  // ... add picklist endpoint paths
} as const;

export const {resource}LoadOptions: Record<string, (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>> = {
  get{Resource}Categories: createPicklistLoader(PICKLIST_PATHS.{resource}Categories),
  // ... one entry per picklist
};
```

**Rules:**
- Use `createPicklistLoader` from `helpers.ts` for all picklist loaders.
- Name each method `get{Entity}` to avoid collisions with loaders from other modules.
- No HTTP calls directly — all fetching goes through `createPicklistLoader` / `loadPicklist`.

---

## 4) `index.ts`

```typescript
import type { EntityConfig } from '../helpers';
import { build{Resource}Body } from './{Resource}Body';

export { get{Resource}Properties } from './{Resource}Properties';
export { {resource}LoadOptions } from './{Resource}LoadOptions';

export const {resource}Config: EntityConfig = {
  listPath: '/{apiPath}/',
  singlePath: '/{apiPath}/',
  idParam: '{resource}Id',
  buildBody: build{Resource}Body,
  // Optional: getManyExtraQs if the resource needs extra query params for Get Many
};
```

**Rules:**
- `idParam` must match the parameter name used in `{Resource}Properties.ts` for ID fields.
- `listPath` / `singlePath` must match the Raynet API v2 endpoint path.
- Re-export `get{Resource}Properties` and `{resource}LoadOptions` from this file — `Raynet.node.ts` imports from `index.ts` only.

---

## 5) Register in `Raynet.node.ts`

Add two lines in `Raynet.node.ts`:

**Import (at top):**
```typescript
import { get{Resource}Properties, {resource}LoadOptions, {resource}Config } from './{resource}';
```

**ENTITY_MAP (add entry):**
```typescript
const ENTITY_MAP: Record<string, EntityConfig> = {
  account: accountConfig,
  person: personConfig,
  {resource}: {resource}Config,   // ← add this
};
```

**allLoadOptions (spread):**
```typescript
const allLoadOptions = {
  getUsers: loadOwners,
  getSecurityLevels: loadSecurityLevels,
  ...accountLoadOptions,
  ...personLoadOptions,
  ...{resource}LoadOptions,        // ← add this
};
```

**RESOURCE_OPTIONS (add UI entry):**
```typescript
const RESOURCE_OPTIONS = [
  { name: 'Account', value: 'account', description: '...' },
  { name: 'Person', value: 'person', description: '...' },
  { name: '{Resource}', value: '{resource}', description: '...' },  // ← add this
];
```

**node properties (spread):**
```typescript
properties: [
  { displayName: 'Resource', ... },
  ...getAccountProperties(),
  ...getPersonProperties(),
  ...get{Resource}Properties(),   // ← add this
],
```

---

## 6) Lint and Format

After creating all files:

```bash
npm run lint:fix   # auto-fix and format via .prettierrc
npm run build      # verify TypeScript compiles clean
```

Prettier config at `nodes/Raynet/.prettierrc`:
- `printWidth: 160`
- `singleQuote: true`
- `trailingComma: 'es5'`
- `tabWidth: 2`

---

## Checklist

- [ ] `{resource}/` folder created
- [ ] `{Resource}Properties.ts` — `get{Resource}Properties()` exported
- [ ] `{Resource}Body.ts` — `build{Resource}Body()` exported
- [ ] `{Resource}LoadOptions.ts` — `{resource}LoadOptions` exported
- [ ] `index.ts` — `{resource}Config`, re-exports of properties and loadOptions
- [ ] `Raynet.node.ts` — import, ENTITY_MAP, allLoadOptions, RESOURCE_OPTIONS, properties spread updated
- [ ] `docs/features/user-features.md` — new domain section added
- [ ] `docs/resources.md` — full field reference added
- [ ] `docs/system-overview.md` — Domain Catalog and Interaction Map updated
- [ ] `npm run lint:fix` passes
- [ ] `npm run build` passes
