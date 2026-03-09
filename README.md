# n8n-nodes-raynet

A community node package for [n8n](https://n8n.io) that integrates with [Raynet CRM v2](https://app.raynet.cz) REST API.

---

## Contents

- [What it does](#what-it-does)
- [Implemented resources and operations](#implemented-resources-and-operations)
- [Credentials](#credentials)
- [Installation](#installation)
- [Development](#development)
- [Project structure](#project-structure)
- [API reference](#api-reference)

---

## What it does

The **Raynet CRM** node lets you read and manage your CRM data from inside any n8n workflow. It covers the two core contact entities — **Accounts** (companies or individuals) and **Persons** (individual contacts) — with full CRUD plus lifecycle and tagging operations.

All dropdown fields (categories, classifications, owners, phone types, etc.) are populated dynamically at runtime from your Raynet instance, so the options always reflect your actual CRM configuration.

---

## Implemented resources and operations

### Account (company / individual)

| Operation       | Description |
|-----------------|-------------|
| **Create**      | Create a new account with addresses and optional fields |
| **Update**      | Update any field on an existing account |
| **Get**         | Retrieve full account detail by ID |
| **Get Many**    | List accounts with sorting, pagination, full-text search, and field filters |
| **Delete**      | Delete an account record |
| **Lock**        | Lock an account to prevent further changes |
| **Unlock**      | Unlock a previously locked account |
| **Invalidate**  | Mark an account as invalid |
| **Renew Validity** | Restore a previously invalidated account |
| **Add Tag**     | Add a tag to an account |
| **Remove Tag**  | Remove a tag from an account |

**Optional fields available on Create/Update:** name, rating, status, relationship role, individual flag, first/last name, salutation, titles, security level, owner, note, category, contact source, employees number, legal form, payment terms, turnover, industry, classifications (1/2/3), ID no., tax ID, VAT ID, VAT payer, bank account, databox, court reference, birthday/anniversary, addresses (with full contact info per address), tags.

---

### Person (individual contact)

| Operation       | Description |
|-----------------|-------------|
| **Create**      | Create a new contact person |
| **Update**      | Update any field on an existing contact person |
| **Get**         | Retrieve full person detail by ID |
| **Get Many**    | List persons with sorting, pagination, full-text search, field filters, and company relationship filter |
| **Delete**      | Delete a contact person |
| **Lock**        | Lock a contact to prevent changes |
| **Unlock**      | Unlock a locked contact |
| **Invalidate**  | Mark a contact as invalid |
| **Renew Validity** | Restore a previously invalidated contact |
| **Add Tag**     | Add a tag to a contact |
| **Remove Tag**  | Remove a tag from a contact |

**Optional fields available on Create/Update:** title before/after, first name, last name, salutation, security level, owner, category, classifications (1/2/3), birthday, language, marital status, gender, contact info (email, phone 1/2, fax, www, other), private address, social networks (Facebook, Twitter/X, Instagram, YouTube, Pinterest, Google+), note, relationship to company (company ID, address ID, job title, note), tags, key person flag.

---

## Credentials

The node uses a dedicated **Raynet CRM API** credential with the following fields:

| Field | Description |
|-------|-------------|
| **Username (e-mail)** | E-mail of the user to whom the API key belongs |
| **API Key** | Generated in Raynet CRM under Settings > API Keys |
| **Name of instance** | Your instance slug (e.g. `demo` from `https://app.raynet.cz/demo/`) |
| **Server** | Your Raynet server — one of `app.raynet.cz`, `app.raynetcrm.sk`, `app.raynetcrm.com`, `eu.raynetcrm.com` |

Authentication is HTTP Basic Auth (`username:apiKey` Base64-encoded) plus the `X-Instance-Name` header.

---

## Installation

### In a self-hosted n8n instance

1. Navigate to your n8n data directory (the folder that contains `package.json` for your n8n instance, typically `~/.n8n`).
2. Install the package:
   ```bash
   npm install /path/to/n8n-nodes-raynet
   # or, once published to npm:
   npm install n8n-nodes-raynet
   ```
3. Restart n8n. The **Raynet CRM** node will appear in the node palette.

### Via n8n community nodes UI

1. Go to **Settings > Community Nodes**.
2. Click **Install** and enter `n8n-nodes-raynet`.
3. Confirm and restart n8n.

---

## Development

### Prerequisites

- Node.js >= 18
- npm

### Setup

```bash
# Install dependencies
npm install
```

### Build

Compiles TypeScript to `dist/`:

```bash
npm run build
```

### Watch mode (rebuild on file change)

```bash
npm run dev
```

### Lint

```bash
npm run lint

# Auto-fix
npm run lint:fix
```

### Link the node to a local n8n installation

After building, symlink the package into your local n8n so changes are reflected without reinstalling:

```bash
# In this project directory
npm link

# In your n8n directory (e.g. ~/.n8n)
npm link n8n-nodes-raynet
```

Then start n8n with custom nodes enabled:

```bash
N8N_CUSTOM_EXTENSIONS="/path/to/n8n-nodes-raynet" npx n8n start
```

Or set it in your n8n configuration file (`~/.n8n/config`):

```json
{
  "nodes": {
    "include": ["/path/to/n8n-nodes-raynet/dist"]
  }
}
```

---

## Project structure

```
n8n-rewrite/
├── credentials/
│   └── RaynetApi.credentials.ts   # Credential definition (username, API key, instance, server)
├── nodes/
│   └── Raynet/
│       ├── Raynet.node.ts         # Main node class – thin operation router
│       ├── AccountDescription.ts  # Account UI properties, body builder, loadOptions, entity config
│       ├── PersonDescription.ts   # Person UI properties, body builder, loadOptions, entity config
│       ├── helpers.ts             # Shared utilities: auth, HTTP request, picklist loader, body helpers
│       └── raynetCrm.svg          # Node icon
├── dist/                          # Compiled output (generated by npm run build)
├── package.json
└── README.md
```

### Architecture

The node follows a **resource + action** pattern with a thin router:

- **`Raynet.node.ts`** reads the `resource` and `operation` parameters and dispatches to a generic CRUD executor. It holds no entity-specific logic.
- **`AccountDescription.ts` / `PersonDescription.ts`** each export:
  - `getXxxProperties()` — the `INodeProperties[]` array that defines the UI for that resource.
  - `buildXxxBody()` — constructs the API request body from node parameters.
  - `xxxLoadOptions` — map of `loadOptionsMethod` names to async functions that fetch picklist options.
  - `xxxConfig` — an `EntityConfig` object (API paths, ID param name, body builder reference) consumed by the router.
- **`helpers.ts`** provides utilities shared across all entities: `raynetRequest`, `loadPicklist`, `loadOwners`, `flattenFixedCollection`, `processCommonField`, `getListParams`.

---

## API reference

- [Raynet CRM v2 API documentation (EN)](https://app.raynet.cz/api/doc/index-en.html)
- Supported Raynet servers: `app.raynet.cz` · `app.raynetcrm.sk` · `app.raynetcrm.com` · `eu.raynetcrm.com`
