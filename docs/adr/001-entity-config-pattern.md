# ADR-001: Entity Config Pattern

Status: Accepted

## Context

n8n community nodes typically put all resource logic directly inside the main node class. For a node with two resources (Account, Person) each having 11 operations, this would result in a single large file containing UI property definitions, request body builders, and dynamic option loaders for all entities mixed together.

As the number of supported Raynet CRM resources grows, this approach does not scale: the main node file becomes hard to navigate, entities cannot be worked on independently, and shared utilities end up duplicated or entangled with entity logic.

## Decision in one sentence

Each resource is encapsulated in a self-contained `EntityConfig` object exported from its own description file; `Raynet.node.ts` is a thin router that reads these configs and dispatches operations with no entity-specific logic of its own.

## Rules to enforce

- `Raynet.node.ts` must contain **no** entity-specific logic — it only reads `EntityConfig` properties and delegates.
- All entity UI definitions, body builders, and loadOptions methods live exclusively in `*Description.ts` files.
- `*Description.ts` files must **not** make direct HTTP calls — all HTTP goes through `helpers.ts`.
- `helpers.ts` must **not** import from description files (prevents circular dependencies).
- Adding a new resource means creating a new `*Description.ts` file and registering its config in `Raynet.node.ts` — no other files need to change.

## Consequences

**Positive:**
- Each resource file is independently readable and modifiable.
- Adding a new resource (e.g. Lead, Deal) requires only a new description file and a single line in the router.
- Shared utilities in `helpers.ts` remain decoupled from any specific entity.
- Consistent structure across all resources lowers onboarding cost.

**Negative:**
- Slightly more indirection than a flat single-file node — contributors need to understand the EntityConfig contract.
- n8n's `loadOptions` methods must be registered on the node class level, requiring the router to proxy them to the correct description file.

## Links

- [docs/system-overview.md](../system-overview.md) — component boundary map
- `nodes/Raynet/Raynet.node.ts` — router implementation
- `nodes/Raynet/AccountDescription.ts` — example EntityConfig
- `nodes/Raynet/helpers.ts` — shared utilities
