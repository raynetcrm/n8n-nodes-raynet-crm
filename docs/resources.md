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

## Common behaviour

- **Picklist fields** (owner, category, classifications, security level, etc.) are populated dynamically from your Raynet instance at runtime.
- **Tags** accept a comma-separated string and are converted to an array before sending to the API.
- **Birthday / Anniversary** accepts a full datetime input but only the date part (`YYYY-MM-DD`) is sent to the API.
- **Continue on fail** is respected: if enabled, errors are captured per item and execution continues.
