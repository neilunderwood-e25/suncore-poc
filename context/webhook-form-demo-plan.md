# Webhook + Form Demo Plan

## Goal

Demonstrate Contentful webhook automation (PoC items 9.2 and 9.3) with a working end-to-end flow:

```
Contact Form → Next.js API Route → Contentful Management API (create entry) → Webhook fires → Slack notification
```

This covers:
- **9.2**: Webhook fires when content is published
- **9.3**: Automation model (webhooks, event filtering, retry logic)
- **Bonus**: Shows a real integration pattern the BFF team would use

---

## Architecture

```
┌─────────────────────────┐
│   Contact Form (UI)     │  components/sections/ContactForm/
│   Name, Email, Message  │
│   Subject dropdown      │
└──────────┬──────────────┘
           │ POST /api/forms/contact
           ▼
┌─────────────────────────┐
│  Next.js API Route      │  app/api/forms/contact/route.ts
│  - Validate input       │
│  - Create entry via     │
│    Contentful Mgmt API  │
│  - Return success/error │
└──────────┬──────────────┘
           │ Entry.create event
           ▼
┌─────────────────────────┐
│  Contentful Webhook     │  Configured in Contentful UI
│  Trigger: Entry.create  │  Settings > Webhooks
│  Filter: formSubmission │
│  Target: /api/webhooks/ │
│    contentful            │
└──────────┬──────────────┘
           │ POST with entry payload
           ▼
┌─────────────────────────┐
│  Webhook Receiver       │  app/api/webhooks/contentful/route.ts
│  - Validate secret      │
│  - Parse payload        │
│  - Send Slack message   │
│    via Composio MCP     │
│    (or Slack Incoming   │
│     Webhook URL)        │
└─────────────────────────┘
```

---

## What to Build

### 1. Contentful Content Type: `formSubmission`

| Field ID | Name | Type | Localized | Required | Notes |
|---|---|---|---|---|---|
| `internalName` | Internal Name | Symbol | No | Yes | Auto-generated: `Form: {name} - {date}` |
| `name` | Name | Symbol | No | Yes | Submitter's name |
| `email` | Email | Symbol | No | Yes | Submitter's email |
| `subject` | Subject | Symbol | No | No | Dropdown: General Inquiry, Media, Careers, Feedback |
| `message` | Message | Text (long) | No | Yes | Message body |
| `submittedAt` | Submitted At | Date & Time | No | No | ISO timestamp of submission |

**Content Type Description:** Form submission entry created automatically via API when a visitor submits the contact form.

**Internal Name Convention:** `Form: John Smith - 2026-04-06`

### 2. API Route: `/api/forms/contact`

**File:** `app/api/forms/contact/route.ts`

- Accepts POST with JSON body: `{ name, email, subject, message }`
- Basic validation (required fields, email format)
- Creates a **draft** entry in Contentful via Management API
  - Uses `contentful-management` npm package
  - Entry is NOT published (stays draft) — this is intentional for demo item 4.2
- Returns `{ success: true, entryId }` or `{ error: "..." }`
- Rate limiting: none needed for demo

**Environment variables needed:**
- `CONTENTFUL_MANAGEMENT_TOKEN` — CMA token (different from CDA token)
- `CONTENTFUL_SPACE_ID` — already exists
- `CONTENTFUL_ENVIRONMENT` — already exists (default: "master")

### 3. API Route: `/api/webhooks/contentful`

**File:** `app/api/webhooks/contentful/route.ts`

- Accepts POST from Contentful webhook
- Validates `x-contentful-webhook-secret` header
- Parses the entry payload
- Sends a formatted message to Slack channel
  - Option A: Via Slack Incoming Webhook URL (simple HTTP POST)
  - Option B: Via Composio MCP Slack integration
- Logs the webhook event
- Returns 200 OK

**Environment variables needed:**
- `CONTENTFUL_WEBHOOK_SECRET` — shared secret for validation
- `SLACK_WEBHOOK_URL` — Slack incoming webhook URL (Option A)

### 4. Contact Form Component

**File:** `components/sections/ContactForm/index.tsx`

This is a **standalone page component**, not a section in the FlexiblePage system. It lives on a dedicated route.

**Option A — Dedicated page route:**
- `app/[locale]/contact/page.tsx` — hardcoded route, not CMS-driven
- Simple form with fields matching the content type
- Client component with form state and submission handling
- Loading/success/error states
- Basic HTML validation (required, email type)

**Option B — Section in FlexiblePage:**
- Register as a section type so editors can add it to any page
- More complex but shows the composable pattern
- Would need a Contentful `contactForm` section content type (even if it has no fields)

**Recommendation: Option A** for demo simplicity. The form itself is not the point — the webhook flow is.

**Form fields:**
- Name (text input, required)
- Email (email input, required)
- Subject (select dropdown: General Inquiry, Media, Careers, Feedback)
- Message (textarea, required)
- Submit button (uses existing CTA styling — `bg-midnight` primary button style)

**Form behavior:**
- Submit → show loading spinner
- Success → show "Thank you" message
- Error → show error message with retry

### 5. Contentful Webhook Configuration (Manual Step)

Done in Contentful UI: **Settings > Webhooks > Add Webhook**

| Setting | Value |
|---|---|
| Name | `Form Submission → Slack Notification` |
| URL | `https://{deployed-url}/api/webhooks/contentful` (or ngrok for local) |
| Triggers | `Entry.create` only |
| Filters | Content Type ID = `formSubmission` |
| Headers | `x-contentful-webhook-secret: {secret}` |

For local development, use [ngrok](https://ngrok.com) to expose localhost:
```bash
ngrok http 3000
# Copy the https URL and use it in the webhook config
```

### 6. Slack Channel Setup

**Option A — Slack Incoming Webhook (simplest):**
1. Go to api.slack.com/apps → Create app → Incoming Webhooks
2. Activate and add to a channel (e.g., `#suncor-demo-notifications`)
3. Copy the webhook URL → set as `SLACK_WEBHOOK_URL` env var
4. The webhook receiver just POSTs formatted JSON to this URL

**Option B — Composio MCP (already available):**
1. Connect Slack via Composio (link already generated)
2. Use `SLACK_SEND_MESSAGE` tool from the webhook receiver
3. More complex but demonstrates the MCP integration

**Recommendation: Option A** for reliability in a live demo. Incoming webhooks are fire-and-forget.

**Slack message format:**
```
📬 New Contact Form Submission

Name: John Smith
Email: john@example.com
Subject: General Inquiry
Message: I'd like to learn more about...

Submitted: 2026-04-06 at 14:30 UTC
View in Contentful: [link to entry]
```

---

## File Structure

```
app/
├── api/
│   ├── forms/
│   │   └── contact/
│   │       └── route.ts              # Form submission → Contentful entry
│   └── webhooks/
│       └── contentful/
│           └── route.ts              # Webhook receiver → Slack notification
└── [locale]/
    └── contact/
        └── page.tsx                  # Contact form page

components/
└── ContactForm/
    └── index.tsx                     # Contact form UI component

lib/
└── contentful/
    └── management.ts                 # Contentful Management API client (CMA)
```

---

## Dependencies

```bash
npm install contentful-management
```

No other new dependencies needed. Slack incoming webhooks are plain HTTP POST — no SDK required.

---

## Environment Variables

Add to `.env.local`:

```env
# Contentful Management API (for creating entries)
CONTENTFUL_MANAGEMENT_TOKEN=your-cma-token

# Webhook security
CONTENTFUL_WEBHOOK_SECRET=your-webhook-secret

# Slack notification
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

---

## Demo Script

### Setup (before demo)
1. Content type `formSubmission` exists in Contentful
2. Webhook configured in Contentful pointing to deployed URL
3. Slack channel ready, incoming webhook URL set
4. App deployed (or ngrok running for local)

### Live Demo (2-3 minutes)

1. **Show the form** — navigate to `/en-ca/contact`
   - "Here's a simple contact form on our site."

2. **Submit the form** — fill in name, email, subject, message
   - "When the visitor submits, it hits our Next.js API route which creates a draft entry in Contentful."

3. **Show Contentful** — switch to Contentful, show the new draft entry
   - "The entry appears immediately as a draft. It's not published — it won't show up on the public delivery API."

4. **Show the webhook log** — go to Settings > Webhooks > Activity Log
   - "Contentful fired a webhook on entry creation. You can see the payload, status code, and timing."

5. **Show Slack** — switch to the Slack channel
   - "The webhook hit our API route, which formatted and sent this notification to Slack. The team knows immediately."

6. **Explain the model:**
   - "This same webhook pattern works for any automation: search index sync, translation kickoff, cache invalidation, email notifications."
   - "Contentful handles retries automatically. The activity log shows every call for debugging."
   - "We used a serverless function (Next.js API route on Vercel) — no separate infrastructure needed."

---

## What This Demonstrates (mapped to PoC requirements)

| Requirement | How This Demo Covers It |
|---|---|
| **9.2** Webhook on publish | Webhook fires on `Entry.create` for `formSubmission`, sends Slack notification |
| **9.3** Automation model | Webhooks, event filtering (by content type), retry logic (Contentful native), serverless function (Next.js API route) |
| **4.2** Drafts not public | Form creates draft entries — not accessible via delivery API |
| **10.2** BFF querying content | Shows Contentful Management API usage alongside existing GraphQL delivery |
| **2.1** New content type | `formSubmission` is a new content type defined for this feature |

---

## Open Questions

1. **Which Slack workspace/channel?** — Need to decide where notifications go for the demo
2. **Deploy URL** — Webhook needs a publicly accessible URL. Vercel deploy or ngrok for local?
3. **Should the form be a section or standalone page?** — Recommended standalone for simplicity, but could be a section if we want to show composability
4. **Contentful Management Token** — Need to generate a CMA token (Personal Access Token in Contentful Settings > API Keys > Content Management Tokens)
