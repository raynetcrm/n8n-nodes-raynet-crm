---
doc_id: features-raynet-crm
version: 6
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Raynet CRM Node — Product Capabilities

## Purpose and Product Scope

The **Raynet CRM** n8n node lets users read and manage CRM data from inside any n8n workflow without writing custom API code. It exposes eight core Raynet CRM entities — **Accounts**, **Persons**, **Deals**, **Quotes**, **Sales Orders**, **Projects**, **Leads**, and **Price Lists** — with full CRUD, lifecycle management, tagging, and (for Deals, Quotes, and Sales Orders) item management operations. Projects additionally support participant management.

All picklist fields (categories, classifications, owners, security levels, phone types, etc.) are populated dynamically at runtime from the user's own Raynet instance, so dropdown options always reflect the actual CRM configuration.

---

## Scope of This Document

This document covers setup, common behaviour, and links to per-entity capability files. Entity details are in the per-entity files linked below. It does not cover internal architecture (see [system-overview.md](../system-overview.md)) or low-level field schemas (see [resources.md](../resources.md)).

---

## Setup

### Credentials

The node requires a **Raynet CRM API** credential:

| Field | Description |
|-------|-------------|
| **Username (e-mail)** | E-mail of the Raynet user to whom the API key belongs |
| **API Key** | Generated in Raynet CRM under **Settings > API Keys** |
| **Name of instance** | Your instance slug — e.g. `demo` from `https://app.raynet.cz/demo/` |
| **Server** | Your Raynet server: `app.raynet.cz`, `app.raynetcrm.sk`, `app.raynetcrm.com`, or `eu.raynetcrm.com` |

### Installation

**Via n8n community nodes UI** (recommended):
1. Go to **Settings > Community Nodes**.
2. Click **Install** and enter `n8n-nodes-raynet`.
3. Confirm and restart n8n.

**Manual install on a self-hosted instance:**
```bash
# In your n8n data directory (~/.n8n)
npm install n8n-nodes-raynet
```
Then restart n8n. The **Raynet CRM** node will appear in the node palette.

---

## Domain Capability Catalog

| Entity | Description | Doc |
|---|---|---|
| Account | Company or individual account | [account.md](account.md) |
| Deal | Business case / deal | [deal.md](deal.md) |
| Quote | Quote (offer) | [quote.md](quote.md) |
| Person | Individual contact | [person.md](person.md) |
| Sales Order | Sales order | [sales-order.md](sales-order.md) |
| Lead | Inbound lead | [lead.md](lead.md) |
| Price List | Product price list | [price-list.md](price-list.md) |
| Project | Project | [project.md](project.md) |

---

## Common Behaviour

- **Dynamic picklists** — owner, category, classifications, security level, and similar fields are loaded from the user's Raynet instance at runtime; no hard-coded values.
- **Continue on fail** — when enabled, per-item errors are captured and execution continues rather than aborting the workflow.
- **Tags** — accept a comma-separated string and are split into an array before sending to the API.
- **Birthday / Anniversary** — accept a full datetime input but only the date portion (`YYYY-MM-DD`) is sent to the API.
- **Date fields on Deals, Quotes, Sales Orders** — `validFrom`, `validTill`, `expirationDate`, `requestDeliveryDate` are also truncated to `YYYY-MM-DD` before sending.

---

## Related Docs

- [../resources.md](../resources.md) — full field reference for all operations and filters
- [../system-overview.md](../system-overview.md) — node architecture
- [../integrations/raynet-api.md](../integrations/raynet-api.md) — Raynet API integration contract
