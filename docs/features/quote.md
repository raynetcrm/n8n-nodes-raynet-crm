---
doc_id: features-quote
version: 1
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Quote — Capabilities

## Purpose and Product Scope

**User outcomes:** Create quotes tied to deals and accounts from automated workflows. Track quote lifecycle (active → won / lost / cancelled). Manage quote line items programmatically.

**Behavior:** Manages quote (offer) records in Raynet CRM. Supports full CRUD, lifecycle management, tagging, and item sub-operations. Quotes are linked to an Account (required) and a Deal (required).

**Business constraints:**
- Name, Account ID, and Deal ID are required to create a quote.
- Locked quotes cannot be modified until unlocked.
- Invalidated quotes can be restored with Renew Validity.
- Tags are additive — Add Tag and Remove Tag operate on individual tags.
- When adding an item, either a product ID, product code, or item name must be provided.

| Capability | User Value | Key Domain Entities |
|---|---|---|
| Create | Add a new quote linked to an account and deal | Quote, Account, Deal |
| Update | Modify any field on an existing quote | Quote |
| Get | Retrieve full quote detail for downstream processing | Quote |
| Get Many | List, search, filter, and paginate quotes | Quote |
| Delete | Remove a quote record | Quote |
| Lock | Prevent further changes to a quote | Quote |
| Unlock | Re-enable editing on a locked quote | Quote |
| Invalidate | Mark a quote as invalid | Quote |
| Renew Validity | Restore a previously invalidated quote | Quote |
| Add Tag | Label a quote with a tag | Quote, Tag |
| Remove Tag | Remove a tag from a quote | Quote, Tag |
| Add Item | Add a product or service line item to a quote | Quote, Item |
| Modify Item | Update a line item in a quote | Quote, Item |
| Delete Item | Remove a line item from a quote | Quote, Item |

---

## Related Docs

- [user-features.md](user-features.md) — overview and setup
- [../resources.md](../resources.md) — full field reference
