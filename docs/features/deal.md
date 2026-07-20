---
doc_id: features-deal
version: 1
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Deal — Capabilities

## Purpose and Product Scope

**User outcomes:** Automate deal creation from inbound leads, quotes, or external pipelines. Track deal progress through phases. Manage deal items (products/services) programmatically.

**Behavior:** Manages business case / deal records in Raynet CRM. Supports full CRUD, lifecycle management, and tagging. Deals are linked to an Account (required) and optionally to a Person and a Project. Deal items can be added, updated, and removed individually.

**Business constraints:**
- Name and Account ID are required to create a deal.
- Locked deals cannot be modified until unlocked.
- Invalidated deals can be restored with Renew Validity.
- Tags are additive — Add Tag and Remove Tag operate on individual tags.
- When adding an item, either a product ID, product code, or item name must be provided.

| Capability | User Value | Key Domain Entities |
|---|---|---|
| Create | Add a new deal linked to an account | Deal, Account |
| Update | Modify any field on an existing deal | Deal |
| Get | Retrieve full deal detail for downstream processing | Deal |
| Get Many | List, search, filter, and paginate deals | Deal |
| Delete | Remove a deal record | Deal |
| Lock | Prevent further changes to a deal | Deal |
| Unlock | Re-enable editing on a locked deal | Deal |
| Invalidate | Mark a deal as invalid | Deal |
| Renew Validity | Restore a previously invalidated deal | Deal |
| Add Tag | Label a deal with a tag | Deal, Tag |
| Remove Tag | Remove a tag from a deal | Deal, Tag |
| Add Item | Add a product or service line item to a deal | Deal, Item |
| Modify Item | Update a line item in a deal | Deal, Item |
| Delete Item | Remove a line item from a deal | Deal, Item |

---

## Related Docs

- [user-features.md](user-features.md) — overview and setup
- [../resources.md](../resources.md) — full field reference
