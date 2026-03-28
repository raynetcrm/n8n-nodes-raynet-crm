---
doc_id: features-raynet-crm
version: 1
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Raynet CRM Node — Product Capabilities

## Purpose and Product Scope

The **Raynet CRM** n8n node lets users read and manage CRM data from inside any n8n workflow without writing custom API code. It exposes the two core Raynet CRM contact entities — **Accounts** and **Persons** — with full CRUD, lifecycle management, and tagging operations.

All picklist fields (categories, classifications, owners, security levels, phone types, etc.) are populated dynamically at runtime from the user's own Raynet instance, so dropdown options always reflect the actual CRM configuration.

---

## Scope of This Document

This document describes what the node currently supports from a user perspective: capabilities, setup, and constraints. It does not cover internal architecture (see [system-overview.md](../system-overview.md)) or low-level field schemas (see [resources.md](../resources.md)).

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

### Account (company / individual)

**User outcomes:** Automate account creation and updates from external sources (web forms, spreadsheets, other CRMs). Sync account lifecycle state. Tag and classify accounts programmatically.

**Behavior:** Manages company or individual accounts in Raynet CRM. Supports full CRUD plus lock/unlock, validity management, and tag operations.

**Business constraints:**
- Name, Rating, Status, and Relationship are required to create an account.
- Locked accounts cannot be modified until unlocked.
- Invalidated accounts can be restored with Renew Validity.
- Tags are additive — Add Tag and Remove Tag operate on individual tags, not the full tag set.

| Capability | User Value | Key Domain Entities |
|---|---|---|
| Create | Add a new company or individual to Raynet CRM | Account, Address |
| Update | Modify any field on an existing account | Account |
| Get | Retrieve full account detail for downstream processing | Account |
| Get Many | List, search, filter, and paginate accounts | Account |
| Delete | Remove an account record | Account |
| Lock | Prevent further changes to an account | Account |
| Unlock | Re-enable editing on a locked account | Account |
| Invalidate | Mark an account as no longer active | Account |
| Renew Validity | Restore a previously invalidated account | Account |
| Add Tag | Label an account with a tag | Account, Tag |
| Remove Tag | Remove a tag from an account | Account, Tag |

---

### Person (individual contact)

**User outcomes:** Automate contact creation from lead forms or imports. Keep person records in sync with external systems. Manage contact relationships to companies.

**Behavior:** Manages individual contact persons in Raynet CRM. Supports full CRUD plus lock/unlock, validity management, and tag operations. Persons can be linked to a company (Account) with a job title and address relationship.

**Business constraints:**
- Last Name is the only required field to create a person.
- A person can be linked to one company via the Relationship field.
- Locked persons cannot be modified until unlocked.
- Tags are additive — Add Tag and Remove Tag operate on individual tags.

| Capability | User Value | Key Domain Entities |
|---|---|---|
| Create | Add a new contact person to Raynet CRM | Person, ContactInfo, PrivateAddress |
| Update | Modify any field on an existing contact | Person |
| Get | Retrieve full contact detail for downstream processing | Person |
| Get Many | List, search, filter, and paginate contacts | Person |
| Delete | Remove a contact record | Person |
| Lock | Prevent further changes to a contact | Person |
| Unlock | Re-enable editing on a locked contact | Person |
| Invalidate | Mark a contact as no longer active | Person |
| Renew Validity | Restore a previously invalidated contact | Person |
| Add Tag | Label a contact with a tag | Person, Tag |
| Remove Tag | Remove a tag from a contact | Person, Tag |

---

## Common Behaviour

- **Dynamic picklists** — owner, category, classifications, security level, and similar fields are loaded from the user's Raynet instance at runtime; no hard-coded values.
- **Continue on fail** — when enabled, per-item errors are captured and execution continues rather than aborting the workflow.
- **Tags** — accept a comma-separated string and are split into an array before sending to the API.
- **Birthday / Anniversary** — accept a full datetime input but only the date portion (`YYYY-MM-DD`) is sent to the API.

---

## Related Docs

- [docs/resources.md](../resources.md) — full field reference for all operations and filters
- [docs/system-overview.md](../system-overview.md) — node architecture
- [docs/integrations/raynet-api.md](../integrations/raynet-api.md) — Raynet API integration contract
