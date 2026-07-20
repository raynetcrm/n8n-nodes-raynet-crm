---
doc_id: features-account
version: 1
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Account — Capabilities

## Purpose and Product Scope

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

## Related Docs

- [user-features.md](user-features.md) — overview and setup
- [../resources.md](../resources.md) — full field reference
