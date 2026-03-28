# n8n-nodes-raynet — Documentation Index

A community node package for [n8n](https://n8n.io) that integrates with [Raynet CRM v2](https://app.raynet.cz) REST API.

---

## Purpose

This index is the entry point for all documentation in this repository. Use the canonical sources table below to navigate to authoritative information about each area.

---

## Canonical Sources

| Topic | Canonical doc | Source of truth |
|-------|---------------|-----------------|
| Product capabilities, installation, credentials | [docs/features/user-features.md](docs/features/user-features.md) | Yes |
| Architecture and component boundaries | [docs/system-overview.md](docs/system-overview.md) | Yes |
| Raynet CRM API integration contract | [docs/integrations/raynet-api.md](docs/integrations/raynet-api.md) | No (mirrors API) |
| Full resource & field reference | [docs/resources.md](docs/resources.md) | Yes |
| Architecture decision records | [docs/adr/README.md](docs/adr/README.md) | Yes |
| External Raynet API docs | [Raynet CRM v2 API (EN)](https://app.raynet.cz/api/doc/index-en.html) | External |

---

## Reading Order

**New users** (installing the node):
1. [docs/features/user-features.md](docs/features/user-features.md) — what the node does and how to set it up
2. [docs/resources.md](docs/resources.md) — full field reference for all operations

**Developers** (contributing or extending):
1. [docs/system-overview.md](docs/system-overview.md) — architecture and component map
2. [docs/integrations/raynet-api.md](docs/integrations/raynet-api.md) — API runtime contract
3. [docs/adr/README.md](docs/adr/README.md) — rationale behind key design decisions

---

## Change Rules

- `docs/features/user-features.md` is the source of truth for what the node currently supports. Update it when adding or removing operations.
- `docs/system-overview.md` is the source of truth for component boundaries. Update it when the node architecture changes.
- `docs/resources.md` is the source of truth for field-level detail. Update it when fields, operations, or filters change.
- `docs/integrations/raynet-api.md` mirrors the external API contract. Update it when Raynet API behaviour or supported endpoints change.
- ADR records in `docs/adr/` are immutable once accepted. Add a new ADR to supersede an old one.

---

## Related Docs

- [docs/features/user-features.md](docs/features/user-features.md)
- [docs/system-overview.md](docs/system-overview.md)
- [docs/resources.md](docs/resources.md)
- [docs/integrations/raynet-api.md](docs/integrations/raynet-api.md)
- [docs/adr/README.md](docs/adr/README.md)
