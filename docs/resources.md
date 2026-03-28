# Resources & Operations

Full reference for all resources and operations implemented in the Raynet CRM node.

---

## Account (company / individual)

API endpoint: `GET|PUT|POST|DELETE /api/v2/company/`

| Operation        | Description |
|------------------|-------------|
| **Create**       | Create a new account with addresses and optional fields |
| **Update**       | Update any field on an existing account |
| **Get**          | Retrieve full account detail by ID |
| **Get Many**     | List accounts with sorting, pagination, full-text search, and field filters |
| **Delete**       | Delete an account record |
| **Lock**         | Lock an account to prevent further changes |
| **Unlock**       | Unlock a previously locked account |
| **Invalidate**   | Mark an account as invalid |
| **Renew Validity** | Restore a previously invalidated account |
| **Add Tag**      | Add a tag to an account |
| **Remove Tag**   | Remove a tag from an account |

### Required fields (Create)

| Field | Type | Description |
|-------|------|-------------|
| Name | string | Account name |
| Rating | options (A / B / C) | Account rating |
| Status | options | Potential / Actual / Deferred / Unattractive |
| Relationship | options | Subscriber / Partner / Supplier / Rival |

### Optional fields (Create & Update)

| Field | Description |
|-------|-------------|
| This is an individual | Boolean flag for individual accounts |
| First / Last name | Name of the individual |
| Title before / after | Titles around the name |
| Salutation | Salutation text |
| Security Level | Loaded from your Raynet instance |
| Owner | User who owns the account (loaded from Raynet) |
| Note | Free-text note |
| Category | Loaded from Raynet |
| Contact Source | Loaded from Raynet |
| Employees Number | Loaded from Raynet |
| Legal Form | Loaded from Raynet |
| Payment Terms | Loaded from Raynet |
| Turnover | Loaded from Raynet |
| Industry | Loaded from Raynet |
| Classification 1 / 2 / 3 | Loaded from Raynet |
| ID no. | Registration number |
| Tax ID no. | Tax identification number |
| VAT ID no. | VAT identification number |
| VAT Payer | Yes / No |
| Bank account | Bank account number |
| Databox | Databox ID |
| Reference number (Court) | Court reference |
| Birthday / Anniversary | Date picker |
| Addresses | Multiple addresses, each with street, city, ZIP, country, territory, and full contact info (email, phone 1/2, fax, www) |
| Tags | Comma-separated list of tags |

### Get Many — filters

Supports any account field as a filter. Available operators: Equals, Not equals, Like, Like (case insensitive), In, Greater than, Greater or equal, Less than, Less or equal, Equals or null, Not equals or null.

---

## Deal (business case)

API endpoint: `GET|PUT|POST|DELETE /api/v2/businessCase/`

| Operation        | Description |
|------------------|-------------|
| **Create**       | Create a new deal linked to an account |
| **Update**       | Update any field on an existing deal |
| **Get**          | Retrieve full deal detail by ID |
| **Get Many**     | List deals with sorting, pagination, full-text search, field filters, and status / product filters |
| **Delete**       | Delete a deal record |
| **Lock**         | Lock a deal to prevent further changes |
| **Unlock**       | Unlock a previously locked deal |
| **Invalidate**   | Mark a deal as invalid |
| **Renew Validity** | Restore a previously invalidated deal |
| **Add Tag**      | Add a tag to a deal |
| **Remove Tag**   | Remove a tag from a deal |
| **Add Item**     | Add a product / service line item to a deal |
| **Modify Item**  | Update a line item in a deal |
| **Delete Item**  | Remove a line item from a deal |

### Required fields (Create)

| Field | Type | Description |
|-------|------|-------------|
| Name | string | Deal subject / title |
| Account ID | number | ID of the account this deal belongs to |

### Optional fields (Create & Update)

| Field | Description |
|-------|-------------|
| Owner | User responsible for the deal (loaded from Raynet) |
| Security Level | Access control level (loaded from Raynet) |
| Contact Person ID | ID of a related person (contact) |
| Project ID | ID of a related project |
| Final Price | Total deal value |
| Estimated Costs | Estimated cost figure |
| Probability (%) | Win probability, 0–100 |
| Open From | Date the deal was opened (validFrom) |
| Note | Free-text description |
| Currency | Deal currency (loaded from Raynet) |
| Exchange Rate | Rate for conversion to CRM default currency |
| Contact Source | How the deal was sourced (loaded from Raynet) |
| Category | Deal category (loaded from Raynet) |
| Phase | Business case phase / stage (loaded from Raynet) |
| Classification 1 / 2 / 3 | Three-level classification (loaded from Raynet) |
| Tags | Comma-separated list of tags |

### Update-only fields

| Field | Description |
|-------|-------------|
| Name | Deal name (not required in update) |
| Account ID | Re-link to a different account |
| Closed Date | Date the deal was closed (validTill) |

### Get Many — filters

Supports field filters with operators (Equals, Not equals, Like, In, Greater than, etc.) on: Name, Account ID, Valid From, Valid Till, Scheduled End, Phase ID, Deal Type ID, ID, Created At, Updated At, Last Modified At.

Additional filter parameters:

| Parameter | Description |
|-----------|-------------|
| Status | Filter by deal status: Active, Won, Lost, Cancelled |
| Product Category ID | Filter by product category |
| Product Line ID | Filter by product line |

### Add Item — fields

| Field | Description |
|-------|-------------|
| Name | Item name (required if no product ID or code) |
| Product ID | Raynet product ID |
| Product Code | Product lookup by code |
| Price List ID | Limit product search to a specific price list |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

### Modify Item — fields

| Field | Description |
|-------|-------------|
| Price List Item ID | Required to identify the price list item |
| Name | Item name |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

---

## Quote (offer)

API endpoint: `GET|PUT|POST|DELETE /api/v2/offer/`

| Operation | Description |
|---|---|
| **Create** | Create a new quote linked to an account and deal |
| **Update** | Update any field on an existing quote |
| **Get** | Retrieve full quote detail by ID |
| **Get Many** | List quotes with sorting, pagination, full-text search, field filters, and status / product filters |
| **Delete** | Delete a quote record |
| **Lock** | Lock a quote to prevent further changes |
| **Unlock** | Unlock a previously locked quote |
| **Invalidate** | Mark a quote as invalid |
| **Renew Validity** | Restore a previously invalidated quote |
| **Add Tag** | Add a tag to a quote |
| **Remove Tag** | Remove a tag from a quote |
| **Add Item** | Add a product / service line item to a quote |
| **Modify Item** | Update a line item in a quote |
| **Delete Item** | Remove a line item from a quote |

### Required fields (Create)

| Field | Type | Description |
|---|---|---|
| Name | string | Quote subject / title |
| Account ID | number | ID of the account the quote is created for |
| Deal ID | number | ID of the deal this quote belongs to |

### Optional fields (Create & Update)

| Field | Description |
|---|---|
| Owner | User responsible for the quote (loaded from Raynet) |
| Security Level | Access control level (loaded from Raynet) |
| Contact Person ID | ID of a related person on the account side |
| Final Price | Total quote value (totalAmount) |
| Estimated Costs | Estimated cost figure (estimatedValue) |
| Open From | Date the quote was opened (validFrom) |
| Open Till | Date the quote was closed (validTill) |
| Valid To | Quote expiration date (expirationDate) |
| Note | Free-text description |
| Category | Quote category (loaded from Raynet) |
| Status | Quote status (loaded from Raynet) |
| Tags | Comma-separated list of tags |

### Update-only fields

| Field | Description |
|---|---|
| Name | Quote name (not required in update) |
| Account ID | Re-link to a different account |
| Deal ID | Re-link to a different deal |

### Get Many — filters

Supports field filters with operators (Equals, Not equals, Like, In, Greater than, etc.) on: Name, Account ID, Deal ID, Open From, Open Till, Valid To, ID, Created At, Updated At, Last Modified At.

Additional filter parameters:

| Parameter | Description |
|---|---|
| Status | Filter by quote status: Active, Won, Lost, Cancelled |
| Product Category ID | Filter by product category |
| Product Line ID | Filter by product line |

### Add Item — fields

| Field | Description |
|---|---|
| Name | Item name |
| Product ID | Raynet product ID |
| Product Code | Product lookup by code |
| Price List ID | Limit product search to a specific price list |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

### Modify Item — fields

| Field | Description |
|---|---|
| Price List Item ID | Required to identify the price list item |
| Name | Item name |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

---

## Person (individual contact)

API endpoint: `GET|PUT|POST|DELETE /api/v2/person/`

| Operation        | Description |
|------------------|-------------|
| **Create**       | Create a new contact person |
| **Update**       | Update any field on an existing contact person |
| **Get**          | Retrieve full person detail by ID |
| **Get Many**     | List persons with sorting, pagination, full-text search, field filters, and company relationship filter |
| **Delete**       | Delete a contact person |
| **Lock**         | Lock a contact to prevent changes |
| **Unlock**       | Unlock a locked contact |
| **Invalidate**   | Mark a contact as invalid |
| **Renew Validity** | Restore a previously invalidated contact |
| **Add Tag**      | Add a tag to a contact |
| **Remove Tag**   | Remove a tag from a contact |

### Required fields (Create)

| Field | Type | Description |
|-------|------|-------------|
| Last Name | string | Contact's last name |

### Optional fields (Create & Update)

| Field | Description |
|-------|-------------|
| Title before / after | Titles around the name |
| First / Last name | Name of the contact |
| Salutation | Salutation text |
| Security Level | Loaded from your Raynet instance |
| Owner | User who owns the contact (loaded from Raynet) |
| Category | Loaded from Raynet |
| Classification 1 / 2 / 3 | Loaded from Raynet |
| Birthday | Date picker |
| Language | Loaded from Raynet |
| Marital Status | Loaded from Raynet |
| Gender | Male / Female |
| Contact Info | Email, email 2, phone 1/2 (with type), fax, www, other contact |
| Private Address | Street, city, province, ZIP, country |
| Social Networks | Facebook, Twitter/X, Instagram, YouTube, Pinterest, Google+ |
| Note | Free-text note |
| Relationship | Link to a company: company ID, address ID, job title, note |
| Tags | Comma-separated list of tags |
| Key Person | Boolean flag |

### Get Many — filters

Supports filtering by first/last name, company name, company ID, user ID, email, owner, category, classifications, tags, and creation/update timestamps. Also supports filtering by **Relationship Company ID** (contacts related to a specific company).

---

## Sales Order

API endpoint: `GET|PUT|POST|DELETE /api/v2/salesOrder/`

| Operation | Description |
|---|---|
| **Create** | Create a new sales order linked to an account and deal |
| **Update** | Update any field on an existing sales order |
| **Get** | Retrieve full sales order detail by ID |
| **Get Many** | List sales orders with sorting, pagination, full-text search, field filters, and status / product filters |
| **Delete** | Delete a sales order record |
| **Lock** | Lock a sales order to prevent further changes |
| **Unlock** | Unlock a previously locked sales order |
| **Invalidate** | Mark a sales order as invalid |
| **Renew Validity** | Restore a previously invalidated sales order |
| **Add Tag** | Add a tag to a sales order |
| **Remove Tag** | Remove a tag from a sales order |
| **Add Item** | Add a product / service line item to a sales order |
| **Modify Item** | Update a line item in a sales order |
| **Delete Item** | Remove a line item from a sales order |

### Required fields (Create)

| Field | Type | Description |
|---|---|---|
| Name | string | Subject / name of the sales order |
| Account ID | number | ID of the account the order is created for |
| Deal ID | number | ID of the deal connected to the order |

### Optional fields (Create & Update)

| Field | Description |
|---|---|
| Owner | User responsible for the order (loaded from Raynet) |
| Security Level | Access control level (loaded from Raynet) |
| Contact Person ID | ID of a related person (contact) |
| Quote ID | ID of the quote this order is linked to |
| Final Price | Total order value (totalAmount) |
| Estimated Costs | Estimated cost figure (estimatedValue) |
| Open From | Date the order was opened (validFrom) — sent as `YYYY-MM-DD` |
| Open Till | Date the order was closed (validTill) — sent as `YYYY-MM-DD` |
| Valid To | Order expiration date (expirationDate) — sent as `YYYY-MM-DD` |
| Deliver Before | Requested delivery date (requestDeliveryDate) — sent as `YYYY-MM-DD` |
| Note | Free-text description |
| Category | Order category (loaded from Raynet) |
| Status | Order status (loaded from Raynet) |
| Tags | Comma-separated list of tags |

### Update-only fields

| Field | Description |
|---|---|
| Name | Order name (not required in update) |
| Account ID | Re-link to a different account |
| Deal ID | Re-link to a different deal |

### Get Many — filters

Supports field filters with operators (Equals, Not equals, Like, In, Greater than, etc.) on: Name, Account ID, Deal ID, Open From, Open Till, Valid To, Deliver Before, Status ID, ID, Created At, Updated At, Last Modified At.

Additional filter parameters:

| Parameter | Description |
|---|---|
| Status | Filter by order status: Active, Won, Lost, Cancelled |
| Product Category ID | Filter by product category (`productCategory[CUSTOM]`) |
| Product Line ID | Filter by product line (`productLine[CUSTOM]`) |

### Add Item — fields

| Field | Description |
|---|---|
| Name | Item name |
| Product ID | Raynet product ID |
| Product Code | Product lookup by code |
| Price List ID | Limit product search to a specific price list |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

### Modify Item — fields

| Field | Description |
|---|---|
| Price List Item ID | Required to identify the price list item |
| Name | Item name |
| Selling Price | Price per unit |
| Tax (%) | Tax rate |
| Quantity | Number of units |
| Discount (%) | Discount percentage |
| Cost per Piece | Internal cost |
| Unit | Unit of measure |
| Note | Item description |

---

## Common behaviour

- **Picklist fields** (owner, category, classifications, security level, etc.) are populated dynamically from your Raynet instance at runtime.
- **Tags** accept a comma-separated string and are converted to an array before sending to the API.
- **Birthday / Anniversary** accepts a full datetime input but only the date part (`YYYY-MM-DD`) is sent to the API.
- **Continue on fail** is respected: if enabled, errors are captured per item and execution continues.
