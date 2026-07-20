# Documentation Governor Templates

Use these templates when creating or normalizing repository documentation.

## Standard Documentation File Structure

```text
<repo-root>/
├── README.md                        # docs entrypoint/index only
├── docs/
│   ├── system-overview.md           # canonical architecture/domain map
│   ├── specs/                       # protected specification inputs
│   │   └── *.md
│   ├── features/
│   │   └── user-features.md         # canonical current capability catalog
│   ├── adr/
│   │   ├── README.md                # ADR index
│   │   └── NNN-*.md                 # ADR records, zero-padded numbering
│   ├── integrations/
│   │   └── *.md                     # operational integration contracts
│   ├── runbooks/
│   │   ├── README.md                # runbook index and ownership
│   │   └── *.md                     # operational procedures and incident playbooks
│   ├── plans/                       # protected planning artifacts
│   │   └── *.md
│   └── implementation/
│       └── *.md                     # implementation status snapshots
```

## Protected Areas Policy

- `docs/specs/` may be read for context, but is not modified by documentation normalization unless the user explicitly asks for spec changes.
- `docs/plans/` is out of scope for documentation normalization and should remain untouched.
- Current-state documentation should not automatically index or normalize `docs/specs/` or `docs/plans/` unless the repository explicitly publishes them as canonical docs.

## Naming Conventions

- Use lowercase kebab-case for documentation filenames, except established root docs such as `README.md`.
- ADR files must be numbered with zero-padded prefixes such as `001-...md`.
- Integration and implementation docs belong under `docs/integrations/` and `docs/implementation/`.
- Runbooks belong under `docs/runbooks/`.

## Markdown Link Policy

- References to repository documentation files must use clickable Markdown links.
- Use correct relative links from the current document location.
- Prefer human-readable labels with the file path in the link target.

## Metadata Policy

- Frontmatter metadata such as `doc_id`, `version`, `source_of_truth`, `owner`, and `last_reviewed` is recommended when a repository uses document metadata.
- Do not force metadata into repositories that intentionally use a lighter established style, but keep the choice consistent within the active docs set.

## Canonical Ownership Map

| Area | Canonical doc type | Keep here | Keep out |
|---|---|---|---|
| Docs entrypoint | `README.md` (or docs index) | navigation, source-of-truth map, reading order | deep implementation detail |
| Product capabilities | feature catalog doc | current capability list and scope boundaries | low-level architecture rationale, roadmap |
| Specifications | `docs/specs/*.md` | intended or approved behavior, design input, affected docs, related ADRs | automatic current-state truth, execution plans |
| Domain/architecture map | system overview doc | boundaries, ownership, allowed dependency directions, high-level interaction map | queue/payload schemas, timeouts/limits, command flags, per-action runtime matrices |
| Architecture rationale | ADRs / decision records | decision, constraints, consequences | long implementation inventory |
| Operational integration contracts | integration docs | endpoints, modes, runtime semantics, config | full architecture map |
| Operations procedures | runbooks | incident diagnosis, step-by-step mitigation/recovery, escalation checkpoints | capability catalog, architecture rationale, low-level protocol specification |
| Plans | `docs/plans/*.md` | transient execution artifacts, task breakdown, working notes | canonical published documentation |
| Implementation status snapshots | implementation summary docs | current implementation inventory and verification | architectural decision rationale |

## 1) `README.md` Documentation Entrypoint

```markdown
# <Project> Documentation Index
## Purpose
## Canonical Sources
## Reading Order
## Change Rules
## Related Docs
```

## 2) `docs/features/user-features.md` Product Catalog

Writing style:
- product-owner language
- user value first
- business language before technical implementation detail

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: true
owner: <owner>
last_reviewed: YYYY-MM-DD
---

# <Product> Product Capabilities
## Purpose and Product Scope
## Scope of This Document
## Domain Capability Catalog
### <Domain>
User outcomes:
Behavior:
Business constraints:
| Capability | User Value | Key Domain Entities |
## Related Docs
```

## 3) `docs/system-overview.md` Architecture Map

Depth rules:
- Keep only "what talks to what and why".
- Keep operational detail in `docs/integrations/*.md`.
- Keep capability behavior detail in `docs/features/user-features.md`.
- Keep decisions and justifications in ADRs.
- Keep implementation evidence in `docs/implementation/*.md`.

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: true
---

# <Project> System Overview
## Purpose
## Canonical Rules
## Scope of This Document
## Domain Catalog
## Interaction Map (High-Level)
## Dependency Rules
### Allowed
### Forbidden
## When to Update This Document
## Related Docs
```

## 4) `docs/adr/README.md` ADR Index

ADR status model:
- `Accepted`
- `Superseded by ADR-NNN`
- `Deprecated`
- `Proposed` only if the repository intentionally keeps pre-acceptance ADRs in-tree
- `Rejected` only if the repository intentionally keeps rejected ADRs in-tree

```markdown
# Architecture Decision Records (ADR)
## Purpose
## Usage Notes
- Keep implementation inventory out of ADRs; use implementation snapshot docs for that material.
## ADR Index
| ADR | Title | Status | Summary |
## Related Docs
```

## 5) `docs/adr/NNN-*.md` ADR Record

```markdown
# ADR-NNN: <Title>
Status: Accepted
## Context
## Decision in one sentence
## Rules to enforce
## Consequences
## Links
```

## 6) `docs/integrations/*.md` Operational Contract

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: false
---

# <System A> -> <System B> Integration
## Purpose
## Scope of This Document
## Integration Modes
## Systems Involved and Interaction Mode
## Runtime Contract Details
## Core Components
## Operational Configuration and Limits
## Error Handling and Observability
## When to Update This Document
## Related Docs
```

## 7) `docs/implementation/*.md` Implementation Snapshot

Writing style:
- summarize implementation by subsystem or module group
- use representative anchors only when they materially help orientation
- do not enumerate many files per subsystem when one representative anchor is enough
- prefer fully qualified package or class names, or repository-root-relative paths

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: false
---

# <Topic> Implementation Snapshot
## Snapshot
## Scope of This Document
## Implemented Modules and Components
## Verification Evidence
## Known Constraints
## When to Update This Document
## Related Docs
```

Use implementation snapshots when the repository needs a separate home for implementation inventory and verification anchors. Small repositories may keep this material out entirely if architecture and development docs remain clean and high-level.
Keep these docs concise: prefer one representative anchor per subsystem or module group unless multiple anchors are necessary to explain a real boundary.

## 8) `docs/runbooks/*.md` Operational Procedure

Writing style:
- operationally actionable
- deterministic steps with expected outcomes
- avoid speculative or unimplemented remediation steps
- keep runbook set intentionally small and high value

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: false
---

# Runbook: <Scenario>
## Purpose
## Trigger Conditions
## Prerequisites
## Steps
## Recovery Validation
## Notes
## Related Docs
```

## 9) `docs/runbooks/README.md` Runbook Index

```markdown
---
doc_id: <id>
version: <n>
source_of_truth: true
owner: <owner>
last_reviewed: YYYY-MM-DD
---

# <Project> Runbooks
## Purpose
## Scope of This Document
## Runbook Index
| Runbook | Scenario | Primary Components |
## Related Docs
```
