# n8n-nodes-raynet

This is an n8n community node. It lets you read and manage data in [Raynet CRM](https://raynet.cz/) from your n8n workflows.

Raynet CRM is a cloud CRM used to manage accounts, contacts, deals, quotes, and related sales activities. This node exposes nineteen Raynet entities — Accounts, Persons, Deals, Quotes, Sales Orders, Projects, Leads, Price Lists, Products, Invoices, Documents, Folders, Tasks, Calls, Meetings, Emails, Events, Letters, and Mass Emails — with full CRUD, lifecycle management, and tagging operations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## This file contains documentation on:

- [Installation](#installation)

- [Credentials](#credentials)

- [Compatibility](#compatibility)

- [Usage](#usage)

- [Resources](#resources)

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

**Via the n8n UI (recommended):**

1. Go to **Settings > Community Nodes**.
2. Click **Install** and enter `n8n-nodes-raynet`.
3. Confirm and restart n8n when prompted.

**Manual install on a self-hosted instance:**

```bash
# In your n8n data directory (~/.n8n)
npm install n8n-nodes-raynet
```

Then restart n8n. The **Raynet CRM** node will appear in the node palette.

## Credentials

The node authenticates with a **Raynet CRM API** credential. You'll need:

| Field | Description |
|-------|-------------|
| **Username (E-Mail)** | E-mail of the Raynet user the API key belongs to |
| **API Key** | Generated in your Raynet instance under **Settings > API Keys** |
| **Name of Instance** | The name of your CRM instance — e.g. `demo` from `https://app.raynet.cz/demo/` |
| **Server** | Your Raynet server: `https://app.raynet.cz`, `https://app.raynetcrm.sk`, `https://app.raynetcrm.com`, or `https://eu.raynetcrm.com` |

To create the credential in n8n:

1. In any Raynet CRM node, click the **Credential** dropdown and select **Create New**.
2. Fill in the four fields above.
3. Click **Save**. n8n tests the connection against your instance before saving.

## Compatibility

Requires n8n running with Node.js 18 or later. Created for Raynet CRM API v2.

## Usage

The node is organized by **Resource** (the Raynet entity, e.g. Account, Deal) and **Operation** (the action to perform, e.g. Create, Update, Get Many). Picklist fields such as owner, category, and security level are populated dynamically from your own Raynet instance at runtime.

### Example: Create an Account

1. Add a **Raynet CRM** node and select your credential.
2. Set **Resource** to `Account` and **Operation** to `Create`.
3. Fill in the required fields:
   - **Name**: `Example Corp`
   - **Rating**: `A`
   - **Status**: `Potential`
   - **Relationship**: `Partner`
4. Optionally, expand **Additional Fields** to set address, email, phone, or other details.
5. Execute the node. The output contains the newly created account, including its Raynet `id`, which you can reference in downstream nodes (e.g. to create a **Deal** linked to this account).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Raynet CRM v2 API documentation](https://app.raynet.cz/api/doc/index-en.html)
- [docs/](docs/) — extended internal documentation (architecture and ADRs, full field reference), only accessible on [GitHub](https://github.com/raynetcrm/n8n-nodes-raynet-crm)
