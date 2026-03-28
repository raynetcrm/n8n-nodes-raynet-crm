# Resources & Operations

Full field reference for all resources. All entities support the standard filter operators: Equals, Not equals, Like, Like (case insensitive), In, Greater than, Greater or equal, Less than, Less or equal, Equals or null, Not equals or null.

---

## Account

API path: `/api/v2/company/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Tag, Remove Tag

### Required (Create)

| Field | Type |
|---|---|
| Name | string |
| Rating | A / B / C |
| Status | Potential / Actual / Deferred / Unattractive |
| Relationship | Subscriber / Partner / Supplier / Rival |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| This is an individual | Boolean |
| First / Last name, Title before/after, Salutation | Name fields |
| Security Level, Owner, Category, Contact Source | Loaded from Raynet |
| Employees Number, Legal Form, Payment Terms, Turnover, Industry | Loaded from Raynet |
| Classification 1 / 2 / 3 | Loaded from Raynet |
| ID no., Tax ID no., VAT ID no., VAT Payer | Registration / tax |
| Bank account, Databox, Reference number (Court) | Financial / legal |
| Birthday / Anniversary | Truncated to `YYYY-MM-DD` |
| Addresses | Street, city, ZIP, country, territory, phone, email, fax, www |
| Tags | Comma-separated |
| Note | Free text |

### Get Many — filters

Any account field. Supports all standard filter operators.

---

## Deal

API path: `/api/v2/businessCase/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Tag, Remove Tag, Add Item, Modify Item, Delete Item

### Required (Create)

| Field | Type |
|---|---|
| Name | string |
| Account ID | number |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Contact Source, Category | Loaded from Raynet |
| Phase, Classification 1 / 2 / 3, Currency | Loaded from Raynet |
| Contact Person ID, Project ID | Related record IDs |
| Final Price, Estimated Costs, Probability (%) | Numbers |
| Open From (`validFrom`) | `YYYY-MM-DD` |
| Tags, Note | |

### Update-only

Name, Account ID, Closed Date (`validTill`), Scheduled End (`scheduledEnd`)

### Get Many — filters

Name, Account ID, Valid From, Valid Till, Scheduled End, Phase ID, Deal Type ID, ID, Created/Updated/LastModified At.
Extra: Status (Active / Won / Lost / Cancelled), Product Category ID, Product Line ID.

### Items

See [Shared item fields](#shared-item-fields-deal--quote--sales-order).

---

## Quote

API path: `/api/v2/offer/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Tag, Remove Tag, Add Item, Modify Item, Delete Item

### Required (Create)

| Field | Type |
|---|---|
| Name | string |
| Account ID | number |
| Deal ID | number |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Category, Status | Loaded from Raynet |
| Contact Person ID | Related record ID |
| Final Price (`totalAmount`), Estimated Costs (`estimatedValue`) | Numbers |
| Open From (`validFrom`), Open Till (`validTill`), Valid To (`expirationDate`) | `YYYY-MM-DD` |
| Tags, Note | |

### Update-only

Name, Account ID, Deal ID

### Get Many — filters

Name, Account ID, Deal ID, Open From, Open Till, Valid To, ID, Created/Updated/LastModified At.
Extra: Status (Active / Won / Lost / Cancelled), Product Category ID, Product Line ID.

### Items

See [Shared item fields](#shared-item-fields-deal--quote--sales-order).

---

## Person

API path: `/api/v2/person/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Tag, Remove Tag

### Required (Create)

| Field | Type |
|---|---|
| Last Name | string |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| First / Last name, Title before/after, Salutation | Name fields |
| Security Level, Owner, Category | Loaded from Raynet |
| Classification 1 / 2 / 3, Language, Marital Status | Loaded from Raynet |
| Gender | Male / Female |
| Birthday | Truncated to `YYYY-MM-DD` |
| Contact Info | Email ×2, phone ×2 (with type), fax, www, other |
| Private Address | Street, city, province, ZIP, country |
| Social Networks | Facebook, Twitter/X, Instagram, YouTube, Pinterest, Google+ |
| Relationship | Company ID, address ID, job title, note |
| Tags, Note, Key Person | |

### Get Many — filters

First/last name, company name, company ID, user ID, email, owner, category, classifications, tags, timestamps, Relationship Company ID.

---

## Project

API path: `/api/v2/project/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Participant, Delete Participant, List Participants

### Required (Create)

| Field | Type |
|---|---|
| Name | string |
| Account ID | number |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Category, Status | Loaded from Raynet |
| Contact Person ID | Related record ID |
| Final Price (`totalAmount`), Estimated Costs (`estimatedValue`) | Numbers |
| Average / Min / Max Project Value | `avgValue.totalAmount`, `minValue.totalAmount`, `maxValue.totalAmount` |
| Open From (`validFrom`), Closed (`validTill`), Scheduled End (`scheduledEnd`) | `YYYY-MM-DD` |
| Tags, Note | |

### Update-only

Name, Account ID

### Get Many — filters

Name, Account ID, Contact Person ID, Status ID, Open From, Closed, Scheduled End, ID, Created/Updated/LastModified At.

### Add Participant fields

| Field | Notes |
|---|---|
| Account ID | Either Account ID or Contact ID required |
| Contact ID | Either Account ID or Contact ID required |
| Participation Category ID | Optional |
| Note | Optional |

---

## Sales Order

API path: `/api/v2/salesOrder/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock, Invalidate, Renew Validity, Add Tag, Remove Tag, Add Item, Modify Item, Delete Item

### Required (Create)

| Field | Type |
|---|---|
| Name | string |
| Account ID | number |
| Deal ID | number |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Category, Status | Loaded from Raynet |
| Contact Person ID, Quote ID | Related record IDs |
| Final Price (`totalAmount`), Estimated Costs (`estimatedValue`) | Numbers |
| Open From (`validFrom`), Open Till (`validTill`), Valid To (`expirationDate`), Deliver Before (`requestDeliveryDate`) | `YYYY-MM-DD` |
| Tags, Note | |

### Update-only

Name, Account ID, Deal ID

### Get Many — filters

Name, Account ID, Deal ID, Open From, Open Till, Valid To, Deliver Before, Status ID, ID, Created/Updated/LastModified At.
Extra: Status (Active / Won / Lost / Cancelled), Product Category ID (`productCategory[CUSTOM]`), Product Line ID (`productLine[CUSTOM]`).

### Items

See [Shared item fields](#shared-item-fields-deal--quote--sales-order).

---

## Shared item fields (Deal / Quote / Sales Order)

### Add Item

| Field | Notes |
|---|---|
| Name | Required if no Product ID or code |
| Product ID | Raynet product ID |
| Product Code | Product lookup by code |
| Price List ID | Limit product search to a price list |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

### Modify Item

| Field | Notes |
|---|---|
| Price List Item ID | Required — identifies the line item |
| Name | |
| Selling Price, Tax (%), Quantity, Discount (%), Cost per Piece, Unit, Note | Same as Add Item |
