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

## Price List

API path: `/api/v2/priceList/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock — **no** Invalidate / Renew Validity, no tags

### Required (Create)

| Field | Type | Notes |
|---|---|---|
| Name | string | |
| Code | string | Unique code |
| Currency | options | Loaded from Raynet |
| Open From (`validFrom`) | dateTime | Sent as `YYYY-MM-DD` |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Category | Loaded from Raynet |
| Valid To (`validTill`) | Sent as `YYYY-MM-DD` |
| Note (`description`) | |

### Update-only

Name, Code, Currency, Open From

### Get Many — filters

Name, Code, Open From, Valid To, Owner ID, ID, Created/Updated/LastModified At.
Extra: Primary (`YES` / `NO`), Currency (exact match).

---

## Lead

API path: `/api/v2/lead/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock — **no** Invalidate / Renew Validity, no tags

### Required (Create)

| Field | Type | Values |
|---|---|---|
| Topic | string | |
| Priority | options | Critical (`CRITICAL`) / Default (`DEFAULT`) / Minor (`MINOR`) |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Owner, Security Level, Category, Contact Source | Loaded from Raynet |
| Lead Phase | Status in the lead pipeline (loaded from Raynet) |
| Territory | Loaded from Raynet |
| Company Name, First Name, Last Name, Title Before/After | Name / company fields |
| ID no. (`regNumber`) | Registration number |
| Email, Phone, Website | Contact info |
| Address | Street, city, ZIP, province, country code |
| Tags, Note (`notice`) | |

### Update-only

Topic, Priority

### Get Many — filters

Topic, Company Name, Last Name, Priority, Lead Phase ID, Owner ID, Contact Source ID, Lead Date, ID, Created/Updated/LastModified At.
Extra: Status (Active `B_ACTIVE` / Done `D_DONE` / Cancelled `G_STORNO`).

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

## Folder

API path: `/api/v2/dms/folder/`

Operations: Create, Delete only

### Required (Create)

| Field | Type |
|---|---|
| Name | string |

### Optional (Create)

| Field | Notes |
|---|---|
| Parent Folder ID (`parent`) | ID of the parent folder; find in Raynet CRM URL `?en=Folder&ei={id}` |
| Security Level | Loaded from Raynet |
| Category | Document category, loaded from Raynet |

### Delete options

| Field | Notes |
|---|---|
| Folder ID | Required |
| Cascade Delete | If enabled, deletes all contents recursively (`DELETE /dms/folder/{id}/cascade`) |

---

## Document

API path: `/api/v2/dms/document/`

Operations: Create, Update, Get, Delete, Lock, Unlock, Invalidate, Renew Validity — **no** Get Many

### Required (Create)

| Field | Notes |
|---|---|
| Content Type (`infoType`) | `link` or `file` |
| Folder ID (`folder`) | Find in Raynet CRM URL: `?view=ListView&en=Folder&ei={id}` |
| Link URL + Link Name | Required when `infoType = link` |
| File UUID + File Name | Required when `infoType = file` — UUID from prior `/fileUpload` call |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Status | `A_DRAFT` / `E_WIN` / `G_STORNO` |
| Security Level | Loaded from Raynet |
| Template | Boolean |
| Valid From / Valid Until | Sent as `YYYY-MM-DD` |

### Update-only fields

Folder ID, Link (collection: link URL + link name), File (collection: UUID, file name, content type, file size)

---

## Invoice

API path: `/api/v2/invoiceLight/`

Operations: Create, Update, Get, Get Many, Delete, Lock, Unlock — **no** Invalidate / Renew Validity

### Required (Create)

| Field | Type | Notes |
|---|---|---|
| Code | string | Unique invoice code |
| Account ID (`company`) | number | |
| Currency | options | Loaded from Raynet |
| Due Date (`dueDate`) | dateTime | Sent as `YYYY-MM-DD` |
| Issue Date (`issueDate`) | dateTime | Sent as `YYYY-MM-DD` |
| Invoice Type (`invoiceType`) | options | `NORMAL` / `PROFORMA` / `CREDIT_NOTE` |
| Invoice State (`invoiceState`) | options | `UNPAID` / `PARTIALLY_PAID` / `PAID` / `CANCELLED` |
| Payment Type | options | Loaded from Raynet |
| Taxable Supply Date | dateTime | Sent as `YYYY-MM-DD` |
| Tax Payer | options | `YES` / `NO` |
| Customer Name (`billingName`) | string | |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Customer Address (`billingAddress`) | Street, city, ZIP, province, country code |
| Title, Variable / Specific / Constant Symbol | Invoice header fields |
| Exchange Rate (`currencyExchangeRate`) | |
| Payment Date | Sent as `YYYY-MM-DD` |
| Security Level, Owner, Category | Loaded from Raynet |
| Deal ID (`businessCase`), Sales Order ID | Related record IDs |
| Note for Receiver, Internal Note, Reason for Correction | Text fields |
| Customer ID / Tax / VAT ID no. | `billingRegNumber`, `billingTaxNumber`, `billingTaxNumber2` |
| Vendor fields | Name, reg numbers, address, email, phone, website, bank details |
| Financial totals | `discount`, `discountPercent`, `baseAmount`, `totalAmount`, `taxAmount`, `roundingBalance` |
| Flags | `reverseTax` (boolean), `proformaTaxMove` (boolean) |
| Link to Other Invoice (`normalInvoice`) | For corrective / advance invoices |
| Decimal Precision | |
| Tags | Comma-separated |
| Items | Array: name, unitPrice, taxRate, amount, unitLabel, discountPercent, totalPrice, sequenceNumber, id (update: positive=modify, negative=delete, empty=create) |
| Payments | Array: date, amount, id (same id semantics as Items) |

### Update-only fields

Code, Account ID, Currency, Due Date, Issue Date, Invoice Type, Invoice State, Payment Type, Taxable Supply Date, Tax Payer, Customer Name

### Get Many — filters

Title, Code, Owner ID, Deal ID, Issue Date, Invoice Type, Taxable Supply Date, Due Date, Payment Date, Variable Symbol, Specific Symbol, Constant Symbol, ID, Created/Updated/LastModified At.

---

## Product

API path: `/api/v2/product/`

Operations: Create, Update, Get, Get Many, Delete, Invalidate, Renew Validity — **no** Lock / Unlock, no tags

### Required (Create)

| Field | Type |
|---|---|
| Code | string — unique product code |
| Name | string |

### Optional (Create & Update)

| Field | Notes |
|---|---|
| Unit | Unit of measure |
| Description | Free text |
| VAT Rate (%) | Tax rate |
| Category | Loaded from Raynet |
| Product Line | Loaded from Raynet |
| Cost | Internal cost |
| Standard Price | List price |
| Tags | Comma-separated |

### Get Many — filters

Name, Code, Category ID, Product Line ID, ID, Created/Updated/LastModified At.

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
