> **Note:** For development environment access and credentials (`.env.local`), please contact **nadun.u@eight25media.com**.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Demo Guide

### 1. Contact Us Form - HubSpot Lead Capture

**URL:** `/en-ca/contact-us`

**What to show:**
- Fill out the form (First Name, Last Name, Email, Phone, Company, Job Title, Subject, Message)
- Submit — contact is created as a **lead** in HubSpot
- Submit the same email again — existing contact is **updated** (no duplicates)
- Slack notification is sent in parallel

**HubSpot dashboard:** https://app-na2.hubspot.com/contacts/245856868

**Key points:**
- Uses HubSpot OAuth with auto-refreshing tokens (no manual token rotation)
- Graceful fallback — if HubSpot is down, form still works (Slack still notified)
- Lifecycle stage set to `lead`

### 2. News Releases - Contentful-Managed PDF Listings

**URL:** `/en-ca/news-and-stories/news-releases`

**What to show:**
- Page displays all news releases sorted by date (latest first)
- Each item shows: date, title, type info (PDF size/pages or "External website")
- Clicking a title opens the **PDF in a new tab** or navigates to external URL
- Content is fully managed in Contentful — no code changes needed to add/remove releases

**Contentful content types:**
- `News Release` — title, release date, PDF document (asset), external URL, page count
- `News Releases Listing` — section component (heading, limit)

**How to add a new release in Contentful:**
1. Go to Contentful > Content > Add Entry > **News Release**
2. Fill in title and release date
3. Upload a PDF to the **PDF Document** field (or set an **External URL**)
4. Set **Page Count** for the "(PDF, X pages, Y KB)" label
5. Publish — it appears on the page automatically

### 3. News & Stories - Article Detail Pages

**URL:** `/en-ca/news-and-stories/{article-slug}`

**What to show:**
- Homepage news section pulls latest articles dynamically
- Clicking an article opens a full detail page with hero image, intro, rich text body
- Content managed entirely in Contentful (`News Article` content type)

### 4. Architecture Highlights

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + Tailwind CSS |
| CMS | Contentful (GraphQL API) |
| Lead capture | HubSpot (OAuth, auto-refresh) |
| Notifications | Slack (Bot API) |
| Rendering | SSR with ISR support |

**Section system:** FlexiblePages in Contentful contain sections (Heroes, Cards, Stock Ticker, News & Stories, News Releases Listing). Adding a new section to a page requires zero code — just link it in Contentful.

### 5. Environment Setup

For local development, contact **nadun.u@eight25media.com** for `.env.local` credentials.

Required env vars:
- `CONTENTFUL_*` — CMS access
- `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET`, `HUBSPOT_REFRESH_TOKEN` — Lead capture
- `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` — Notifications
