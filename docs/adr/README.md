# Architecture Decision Records (ADR)

## Purpose

This directory records significant architecture decisions made in the `n8n-nodes-raynet-crm` project. Each ADR captures the context, decision, and consequences at the time of the decision.

## Usage Notes

- ADR records are immutable once accepted. To change a decision, create a new ADR and mark the old one as `Superseded by ADR-NNN`.
- Keep implementation inventory out of ADRs — use [docs/system-overview.md](../system-overview.md) or [docs/resources.md](../resources.md) for that material.
- Number new ADRs with zero-padded prefixes: `002-...`, `003-...`, etc.

## ADR Index

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [ADR-001](001-entity-config-pattern.md) | Entity Config Pattern | Accepted | Each resource is encapsulated in an `EntityConfig` object; `Raynet.node.ts` is a thin router with no entity-specific logic |

## Related Docs

- [docs/system-overview.md](../system-overview.md)
- [README.md](../../README.md)
