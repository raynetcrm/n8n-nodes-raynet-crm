---
doc_id: integration-raynet-api
version: 1
source_of_truth: false
---

# n8n node → Raynet CRM v2 API Integration

## Purpose

This document describes the runtime contract between the `n8n-nodes-raynet-crm` node and the external Raynet CRM v2 REST API. It is the authoritative reference for authentication, endpoints, request/response format, and error handling at the integration boundary.

---

## Scope of This Document

This document covers the operational integration contract only. It does not cover:
- Node capability behavior → see [docs/features/user-features.md](../features/user-features.md)
- Node architecture → see [docs/system-overview.md](../system-overview.md)
- Full field reference → see [docs/resources.md](../resources.md)

---

## Integration Modes

| Mode | Protocol | Format |
|------|----------|--------|
| REST API calls | HTTPS | JSON request / JSON response |
| Dynamic picklist loading | HTTPS | JSON response (GET only) |

All communication is synchronous and request-response. There are no webhooks or streaming modes.

---

## Systems Involved and Interaction Mode

| System | Role |
|--------|------|
| n8n node (`helpers.ts`) | API client — constructs and sends requests, parses responses |
| Raynet CRM v2 REST API | API server — source of truth for all CRM data |

The node calls the API on behalf of the n8n workflow at execution time. Picklist endpoints are called during node configuration (loadOptions phase) to populate dropdowns.

---

## Runtime Contract Details

### Base URLs

| Server option | Base URL |
|---------------|----------|
| `app.raynet.cz` | `https://app.raynet.cz/api/v2` |
| `app.raynetcrm.sk` | `https://app.raynetcrm.sk/api/v2` |
| `app.raynetcrm.com` | `https://app.raynetcrm.com/api/v2` |
| `eu.raynetcrm.com` | `https://eu.raynetcrm.com/api/v2` |

### Authentication

Every request must include:

| Header | Value |
|--------|-------|
| `Authorization` | `Basic <Base64(username:apiKey)>` |
| `X-Instance-Name` | Instance slug (e.g. `demo`) |

Credentials are resolved from the n8n credential store at execution time — they are never stored in node code.

### Endpoints

| Resource | HTTP method | Path | Used for |
|----------|-------------|------|---------|
| Account | `POST` | `/company/` | Create |
| Account | `PUT` | `/company/{id}/` | Update |
| Account | `GET` | `/company/{id}/` | Get |
| Account | `GET` | `/company/` | Get Many (with query params) |
| Account | `DELETE` | `/company/{id}/` | Delete |
| Account | `POST` | `/company/{id}/lock` | Lock |
| Account | `DELETE` | `/company/{id}/lock` | Unlock |
| Account | `POST` | `/company/{id}/invalidate` | Invalidate |
| Account | `POST` | `/company/{id}/validityRenew` | Renew Validity |
| Account | `POST` | `/company/{id}/tag` | Add Tag |
| Account | `DELETE` | `/company/{id}/tag` | Remove Tag |
| Person | `POST` | `/person/` | Create |
| Person | `PUT` | `/person/{id}/` | Update |
| Person | `GET` | `/person/{id}/` | Get |
| Person | `GET` | `/person/` | Get Many (with query params) |
| Person | `DELETE` | `/person/{id}/` | Delete |
| Person | `POST` | `/person/{id}/lock` | Lock |
| Person | `DELETE` | `/person/{id}/lock` | Unlock |
| Person | `POST` | `/person/{id}/invalidate` | Invalidate |
| Person | `POST` | `/person/{id}/validityRenew` | Renew Validity |
| Person | `POST` | `/person/{id}/tag` | Add Tag |
| Person | `DELETE` | `/person/{id}/tag` | Remove Tag |
| Quote | `PUT` | `/offer/` | Create |
| Quote | `POST` | `/offer/{id}/` | Update |
| Quote | `GET` | `/offer/{id}/` | Get |
| Quote | `GET` | `/offer/` | Get Many (with query params) |
| Quote | `DELETE` | `/offer/{id}/` | Delete |
| Quote | `POST` | `/offer/{id}/lock` | Lock |
| Quote | `POST` | `/offer/{id}/unlock` | Unlock |
| Quote | `POST` | `/offer/{id}/invalid` | Invalidate |
| Quote | `POST` | `/offer/{id}/valid` | Renew Validity |
| Quote | `PUT` | `/offer/{id}/tag` | Add Tag |
| Quote | `DELETE` | `/offer/{id}/tag` | Remove Tag |
| Quote | `PUT` | `/offer/{id}/item` | Add Item |
| Quote | `POST` | `/offer/{id}/item/{itemId}/` | Modify Item |
| Quote | `DELETE` | `/offer/{id}/item/{itemId}/` | Delete Item |

### Dynamic Picklist Endpoints

Picklist values (owner, category, classifications, security level, etc.) are fetched from the user's own Raynet instance. These are GET calls to instance-specific endpoints (e.g. `/user/`, `/enumeration/`) and their exact paths and response shapes are defined by the Raynet API.

### Pagination

`Get Many` operations support:
- `offset` — number of records to skip (default 0)
- `limit` — maximum records to return per request

### Filters

`Get Many` accepts field-level filters as query parameters. Supported operators: `eq`, `ne`, `like`, `likei`, `in`, `gt`, `gte`, `lt`, `lte`, `eqOrNull`, `neOrNull`.

---

## Operational Configuration and Limits

- Rate limiting: follow Raynet CRM API terms; no retry logic is implemented in the node.
- Pagination: default page size is determined by the Raynet API; use `offset`/`limit` to page through large result sets.
- Request timeout: governed by n8n's default HTTP timeout.

---

## Error Handling and Observability

- API errors (4xx, 5xx) are surfaced as n8n node errors with the response body attached.
- **Continue on fail**: when enabled on the node, per-item errors are captured in the item output rather than aborting the workflow. Each failed item includes the error message.
- No automatic retry logic — transient failures require workflow-level retry handling.

---

## When to Update This Document

Update when:
- New Raynet API endpoints are added to the node
- Authentication mechanism changes
- Supported servers change
- Pagination or filter behaviour changes

---

## Related Docs

- [docs/features/user-features.md](../features/user-features.md)
- [docs/system-overview.md](../system-overview.md)
- [docs/resources.md](../resources.md)
- [Raynet CRM v2 API documentation (EN)](https://app.raynet.cz/api/doc/index-en.html)
