---
doc_id: features-person
version: 1
source_of_truth: true
owner: n8n-nodes-raynet maintainer
last_reviewed: 2026-03-28
---

# Person — Capabilities

## Purpose and Product Scope

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

## Related Docs

- [user-features.md](user-features.md) — overview and setup
- [../resources.md](../resources.md) — full field reference
