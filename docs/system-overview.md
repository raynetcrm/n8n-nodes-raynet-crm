---
doc_id: system-overview-raynet-crm
version: 1
source_of_truth: true
---

# Raynet CRM Node — System Overview

## Purpose

This document describes the component boundaries, ownership, and allowed dependency directions for the `n8n-nodes-raynet-crm` package. It is the authoritative reference for architecture.

---

## Scope of This Document

This document covers component relationships and dependency rules. It does not cover:
- Capability behavior detail → see [docs/features/user-features.md](features/user-features.md)
- Raynet API runtime semantics → see [docs/integrations/raynet-api.md](integrations/raynet-api.md)
- Field-level detail → see [docs/resources.md](resources.md)
- Design rationale → see [docs/adr/README.md](adr/README.md)

---

## Domain Catalog

| Component | Role |
|-----------|------|
| **n8n workflow runtime** | Hosts and executes the node; provides `IExecuteFunctions`, `ILoadOptionsFunctions`, item context, and credential resolution |
| **Raynet.node.ts** | Main node class registered with n8n; thin operation router; holds node metadata and dispatches to entity configs |
| **AccountDescription.ts** | `EntityConfig` for the Account resource — owns UI property definitions, body builder, and loadOptions methods |
| **PersonDescription.ts** | `EntityConfig` for the Person resource — same structure as AccountDescription |
| **helpers.ts** | Shared utilities: HTTP request wrapper, Basic Auth builder, `X-Instance-Name` header injection, picklist loader, body flattener |
| **RaynetApi.credentials.ts** | n8n credential type definition — declares the four credential fields and sets up Basic Auth test |
| **Raynet CRM v2 REST API** | External system — source of truth for all CRM data; accessed over HTTPS |

---

## Interaction Map

```
n8n workflow
    │
    ▼
Raynet.node.ts          ← dispatches by resource + operation
    │
    ├── AccountDescription.ts (EntityConfig)
    │       ├── properties[]       → n8n UI
    │       ├── buildBody()        → request payload
    │       └── loadOptions.*()    → picklist population
    │
    ├── PersonDescription.ts (EntityConfig)
    │       └── (same structure)
    │
    └── helpers.ts
            ├── raynetRequest()    → authenticated HTTP via n8n helpers
            ├── buildBasicAuth()   → Base64 username:apiKey
            ├── loadPicklist()     → shared picklist fetch
            └── flattenBody()      → nested → flat payload transform
                    │
                    ▼
            Raynet CRM v2 REST API
            (app.raynet.cz / .sk / .com / eu.raynetcrm.com)
```

---

## Dependency Rules

### Allowed

- `Raynet.node.ts` → `AccountDescription.ts`, `PersonDescription.ts`, `helpers.ts`
- `AccountDescription.ts`, `PersonDescription.ts` → `helpers.ts`
- All source files → `n8n-workflow` types (interfaces, enums)
- `helpers.ts` → n8n `IExecuteFunctions` / `ILoadOptionsFunctions` for HTTP and credential access

### Forbidden

- Description files (`*Description.ts`) must **not** make direct HTTP calls — all HTTP goes through `helpers.ts`
- `helpers.ts` must **not** import from description files (no circular dependency)
- No entity-specific logic in `Raynet.node.ts` — the router only reads `EntityConfig` properties

---

## Development Setup

**Prerequisites:** Node.js >= 18, npm

```bash
npm install          # install dependencies
npm run build        # compile TypeScript to dist/
npm run dev          # watch mode — rebuild on file change
npm run lint         # lint
npm run lint:fix     # lint with auto-fix
```

**Link to a local n8n installation:**
```bash
# In this project
npm link

# In your n8n directory (~/.n8n)
npm link n8n-nodes-raynet

# Start n8n with custom node
N8N_CUSTOM_EXTENSIONS="/path/to/n8n-nodes-raynet" npx n8n start
```

---

## When to Update This Document

Update this document when:
- A new resource (entity) is added — update the Domain Catalog and Interaction Map
- The helper/request layer is refactored — update dependency rules
- A new external system dependency is introduced

Do **not** update it for: field changes, new operations on existing resources, or bug fixes that don't change component boundaries.

---

## Related Docs

- [docs/features/user-features.md](features/user-features.md)
- [docs/integrations/raynet-api.md](integrations/raynet-api.md)
- [docs/resources.md](resources.md)
- [docs/adr/README.md](adr/README.md)
