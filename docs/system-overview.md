---
doc_id: system-overview-raynet-crm
version: 5
source_of_truth: true
---

# Raynet CRM Node — System Overview

## Purpose

Component boundaries, ownership, and dependency rules for `n8n-nodes-raynet-crm`. Authoritative architecture reference.

---

## Scope

Covers component relationships and dependency rules only. See:
- Capability behavior → [docs/features/user-features.md](features/user-features.md)
- Field-level detail → [docs/resources.md](resources.md)
- API runtime semantics → [docs/integrations/raynet-api.md](integrations/raynet-api.md)
- Design rationale → [docs/adr/README.md](adr/README.md)

---

## Domain Catalog

### Resource module pattern

Every resource lives under `nodes/Raynet/{resource}/` with 4 files:

| File | Role |
|---|---|
| `index.ts` | `EntityConfig` + re-exports — only file imported by `Raynet.node.ts` |
| `{Resource}Properties.ts` | `INodeProperties[]` — UI definitions |
| `{Resource}Body.ts` | Body builder function(s) — request payload |
| `{Resource}LoadOptions.ts` | Picklist loader functions — dynamic dropdowns |

### Resource registry

| Folder | EntityConfig | API base path |
|---|---|---|
| `account/` | `accountConfig` | `/company/` |
| `deal/` | `dealConfig` | `/businessCase/` |
| `quote/` | `quoteConfig` | `/offer/` |
| `person/` | `personConfig` | `/person/` |
| `salesOrder/` | `salesOrderConfig` | `/salesOrder/` |
| `lead/` | `leadConfig` | `/lead/` |
| `project/` | `projectConfig` | `/project/` |

### Other components

| Component | Role |
|---|---|
| **Raynet.node.ts** | Thin router — dispatches to `EntityConfig` per resource + operation |
| **helpers.ts** | `raynetRequest()`, `loadPicklist()`, `EntityConfig` interface, `OperationType` enum, shared body utilities |
| **RaynetApi.credentials.ts** | n8n credential type — fields, `IAuthenticateGeneric` auth, test endpoint |
| **n8n workflow runtime** | Hosts node; provides `IExecuteFunctions`, credentials, item context |
| **Raynet CRM v2 REST API** | External data source — accessed over HTTPS |

---

## Interaction Map

```
n8n workflow
    │
    ▼
Raynet.node.ts                     ← dispatches by resource + operation
    │
    ├── {resource}/index.ts         ← EntityConfig (account, deal, quote, person, salesOrder, project, lead)
    │       ├── {Resource}Properties.ts  → INodeProperties[]
    │       ├── {Resource}Body.ts        → request payload
    │       └── {Resource}LoadOptions.ts → picklist population
    │
    └── helpers.ts
            ├── raynetRequest()          → HTTP via httpRequestWithAuthentication
            ├── loadPicklist()           → picklist fetch
            └── flattenFixedCollection() → nested → flat payload
                    │
                    ▼
            Raynet CRM v2 REST API
            (app.raynet.cz / .sk / .com / eu.raynetcrm.com)
```

---

## Dependency Rules

### Allowed

- `Raynet.node.ts` → `{resource}/index.ts` (any), `helpers.ts`
- `{resource}/*.ts` → `helpers.ts`
- All source files → `n8n-workflow` types

### Forbidden

- `*Body.ts`, `*Properties.ts`, `*LoadOptions.ts` must not make direct HTTP calls — all HTTP goes through `helpers.ts`
- `helpers.ts` must not import from resource subfolders
- No entity-specific logic in `Raynet.node.ts` — the router only reads `EntityConfig` properties

---

## Development Setup

```bash
npm install       # install dependencies
npm run build     # compile TypeScript to dist/
npm run dev       # watch mode
npm run lint      # lint (eslint-plugin-n8n-nodes-base)
npm run format    # format with oxfmt
```

**Link to local n8n:**
```bash
npm link                          # in this project
npm link n8n-nodes-raynet         # in ~/.n8n
```

---

## When to Update

Update when: a new resource is added (resource registry + interaction map), the HTTP/credential layer changes (dependency rules), or a new external dependency is introduced.

Do **not** update for: field changes, new operations on existing resources, or bug fixes.
