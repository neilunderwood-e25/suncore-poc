# Contentful + FlexiblePage Architecture

## Overview

This project is a **Contentful-powered Next.js 16 (App Router)** site. Pages are composed of modular **sections** managed in Contentful and rendered dynamically via a registry-based component system with a **skeleton + hydrate** data fetching pattern.

---

## High-Level Data Flow

```
URL Request
  → App Router (/app/[locale]/[[...slug]]/page.tsx)
  → getFlexiblePageBySlug() fetches page skeleton from Contentful
  → Skeleton query returns section stubs (__typename + sys.id only)
  → hydrateSections() dispatches each stub to the registry
  → Each section's hydrate() fetches its own full data in parallel
  → hydrate() returns typed Section data directly (no adapter layer)
  → SectionsRenderer maps section.type → registry render()
  → Section component dispatches to variant via frontEndComponent field
  → Final HTML rendered
```

---

## 1. Routing Layer

### App Router Structure

```
app/
├── layout.tsx                        # Root layout (Noto Sans font)
├── globals.css                       # Suncor design tokens + Tailwind theme
├── [locale]/
│   ├── layout.tsx                    # Locale layout (next-intl provider)
│   └── [[...slug]]/
│       └── page.tsx                  # Catch-all FlexiblePage route
├── api/
│   ├── preview/route.ts             # Draft preview mode
│   └── exit-preview/route.ts        # Disable preview
└── not-found.tsx
```

### Route Resolution

The catch-all route resolves URL segments to a Contentful slug:

| URL Pattern | Resolved Slug |
|---|---|
| `/en/` | `home` (from CONTENTFUL_HOME_SLUG env) |
| `/en/about` | `about` |
| `/en/features/overview` | `features/overview` |

---

## 2. FlexiblePage Content Model

### Contentful Content Type: `flexiblePage`

Fields: `internalName`, `slug`, `pageTitle`, `sections` (Array of Entry links), SEO fields.

```typescript
type FlexiblePage = {
  sys: { id: string };
  slug: string;
  pageTitle?: string | null;
  sections: Section[];
};
```

A FlexiblePage is a **slug + ordered list of sections + SEO metadata**.

---

## 3. Two-Phase Data Fetching (Skeleton + Hydrate)

**File:** `lib/contentful/pages.ts`

Contentful GraphQL has a query complexity limit of 11,000. To stay under this, section data is fetched in two phases:

### Phase 1: Page Skeleton

**Query:** `lib/contentful/graphql/queries/flexiblePage/flexiblePageQueries.ts`

Fetches the FlexiblePage with only section stubs (no content):

```graphql
query FlexiblePageBySlug($slug: String!, $locale: String!, $preview: Boolean) {
  flexiblePageCollection(where: { slug: $slug }, limit: 1) {
    items {
      sys { id }
      slug
      pageTitle
      sectionsCollection(limit: 20) {
        items {
          __typename
          sys { id }
        }
      }
    }
  }
}
```

### Phase 2: Section Hydration

`hydrateSections()` iterates each stub and calls the matching section's `hydrate()` function from the registry **in parallel**:

```typescript
const results = await Promise.all(
  stubs.map(async (stub) => {
    const config = sectionRegistry.find(s => s.contentfulTypename === stub.__typename);
    if (!config) return { id: stub.sys.id, type: "unknown", raw: stub };
    return config.hydrate(stub.sys.id, options);
  })
);
```

Each `hydrate()` function makes its own GraphQL query and returns a **fully typed Section** directly. There is no adapter layer.

### Per-Section Sub-Hydration

Some sections have nested hydration. For example, Heroes fetches a skeleton of slide IDs, then hydrates each slide in parallel:

```
Heroes hydrate(id)
  → Heroes skeleton query (slide IDs only)
  → Promise.all([
      heroSlide(id: slide1)  → full slide data
      heroSlide(id: slide2)  → full slide data
      heroSlide(id: slide3)  → full slide data
    ])
  → returns typed HeroesSection
```

---

## 4. Section Registry & Rendering

### Section Definition

**File:** `lib/sections/config.ts`

Each section type exports a `SectionDefinition`:

```typescript
type SectionDefinition = {
  contentfulTypename: string;                          // e.g. "Heroes"
  type: Section["type"];                               // e.g. "heroes"
  hydrate: (id, options) => Promise<Section | null>;   // Fetch + return typed data
  render: (section) => ReactNode;                      // Render the component
};
```

### Section Registry

**File:** `lib/sections/registry.ts`

```typescript
import { heroesSection } from "./definitions/heroes";

export const sectionRegistry: SectionDefinition[] = [
  heroesSection,
  // Add new sections here
];
```

### SectionsRenderer

**File:** `lib/sections/SectionsRenderer.tsx`

Loops over typed `Section[]` and renders via the registry:

```typescript
sections.map((section) => {
  const config = sectionRegistry.find(s => s.type === section.type);
  if (!config) return null;
  return <div key={section.id}>{config.render(section)}</div>;
});
```

---

## 5. Dispatcher Pattern (frontEndComponent)

Section content types can have a `frontEndComponent` dropdown field that selects the UI variant. The section component acts as a **dispatcher** using if-statements.

### Example: Heroes Dispatcher

**File:** `components/sections/Heroes/index.tsx`

```typescript
export function Heroes({ section }: HeroesProps) {
  const frontEndComponent = section.frontEndComponent;

  if (frontEndComponent === "homepage-hero") {
    return <HeroCarousel slides={section.slides} />;
  }

  // default — simple static hero
  return <section>...</section>;
}
```

Each variant lives in its own subfolder under the section component:

```
components/sections/Heroes/
├── index.tsx              # Dispatcher
└── HomepageHero/          # "homepage-hero" variant
    └── index.tsx          # HeroCarousel client component

lib/sections/definitions/
└── heroes.tsx             # Section definition (hydrate + render wiring)
```

To add a new variant:
1. Create a new folder (e.g. `Heroes/BrandHero/`)
2. Add an if-statement in `Heroes/index.tsx`
3. Add the option to the Contentful dropdown

---

## 6. Content Types

### Current Contentful Content Types

| Content Type ID | Name | Description |
|---|---|---|
| `flexiblePage` | Flexible Page | Page container with slug, sections, SEO |
| `heroes` | Heroes | Hero section with frontEndComponent dispatch + slides |
| `heroSlide` | Hero Slide | Individual carousel slide (heading, description, background, CTA) |
| `image` | Image | Responsive image with desktop/mobile variants |
| `video` | Video | Responsive video with desktop/mobile variants, poster, autoplay/loop/muted |
| `cta` | CTA | Button/link with 3 styles (Primary, Secondary, Outline) |

### Section Types

**File:** `lib/sections/types.ts`

```typescript
type Section = HeroesSection | UnknownSection;
```

Key shared types: `ImageAsset`, `ImageEntry`, `VideoAsset`, `VideoEntry`, `CtaEntry`, `RichTextDocument`, `HeroSlide`, `HeroSlideBackground` (Image | Video union).

---

## 7. GraphQL Layer

**Location:** `lib/contentful/graphql/`

Fragments and queries are organized by content type, following the same pattern as the reference pandadoc project:

```
lib/contentful/graphql/
├── fragments/
│   ├── cta/ctaFragment.ts
│   ├── heroes/heroesFragment.ts          # Skeleton fragment (slide IDs only)
│   ├── heroSlide/heroSlideFragment.ts    # Full slide with background union
│   ├── image/imageFragment.ts            # CommonImageFragment + ImageAssetFragment
│   └── video/videoFragment.ts            # CommonVideoFragment + VideoAssetFragment
└── queries/
    ├── flexiblePage/flexiblePageQueries.ts   # Page skeleton + slugs
    ├── heroes/heroesQueries.ts               # HeroesById (skeleton)
    └── heroSlide/heroSlideQueries.ts         # HeroSlideById (full data)
```

### Fragment Composition

Fragments import shared dependencies:

```
HeroSlideFragment
├── CommonImageFragment (for background Image)
│   └── ImageAssetFragment
├── CommonVideoFragment (for background Video)
│   └── VideoAssetFragment
└── CtaFragment
```

The `background` field uses inline fragments for the polymorphic union:

```graphql
background {
  __typename
  ... on Image { ...CommonImageFragment }
  ... on Video { ...CommonVideoFragment }
}
```

---

## 8. Common Components

**Location:** `components/common/`

Reusable components shared across all sections:

```
components/common/
├── Cta/
│   └── index.tsx              # CTA button (Primary, Secondary, Outline)
├── ResponsiveImage/
│   └── index.tsx              # <picture> with desktop/mobile sources
├── ResponsiveVideo/
│   └── index.tsx              # <video> with desktop/mobile sources, autoplay/loop/muted
└── RichText/
    └── RichText.tsx           # Contentful rich text renderer (all blocks, marks, embeds)
```

### CTA Styles

| Type | Style |
|---|---|
| Primary Button | `bg-midnight` dark blue fill, white text |
| Secondary Button | `bg-gold` yellow fill, dark text |
| Outline Button | Transparent with white border, inverts on hover |

### Rich Text Renderer

Uses `@contentful/rich-text-react-renderer` with support for:
- All MARKS (bold, italic, underline, code, super/subscript, strikethrough)
- All BLOCKS (headings, paragraphs, lists, blockquotes, tables, HR)
- Embedded entries (Image, CTA) and embedded assets (images, videos)
- Entry hyperlinks (resolves by slug)
- Newline → `<br>` conversion

---

## 9. Design Tokens

**File:** `app/globals.css`

Suncor design tokens defined as CSS custom properties in `:root`, mapped to Tailwind via `@theme inline`:

- **Brand colors:** midnight, gold, clover, sky, dusk, dusty-blue, moss, sand, slate, orange
- **Greys:** darkest-grey, dark-grey, light-grey, lightest-grey
- **Typography:** Noto Sans (300/400/600/700), fluid clamp() font sizes
- **Radius:** `--radius-default: 0.375rem`
- **Shadows:** depth-4 through depth-64

Usage: `bg-midnight`, `text-gold`, `border-clover-70`, `text-sm` (fluid), etc.

---

## 10. Internationalization

- **Locale routing:** All pages under `/app/[locale]/`
- **Contentful locales:** Dynamically fetched from Contentful API
- **next-intl:** Client-side i18n provider set in locale layout
- **Content:** Fetched in the requested locale, falls back to default locale

---

## 11. Rendering Modes

**File:** `lib/contentful/settings.ts`

| Mode | Behavior |
|---|---|
| `ssr` | No cache (`cache: "no-store"`) |
| `isr` | Revalidate on interval (`next: { revalidate: N }`) |
| `static` | Full cache (`cache: "force-cache"`) |

Configured via `CONTENTFUL_RENDER_MODE` env var.

---

## 12. Adding a New Section

To add a new section type (e.g. FeatureGrid):

1. **Contentful:** Create the content type, add it to FlexiblePage's sections validation
2. **Fragment:** Create `lib/contentful/graphql/fragments/featureGrid/featureGridFragment.ts`
3. **Query:** Create `lib/contentful/graphql/queries/featureGrid/featureGridQueries.ts`
4. **Type:** Add `FeatureGridSection` to `lib/sections/types.ts` and the `Section` union
5. **Component:** Create `components/sections/FeatureGrid/index.tsx` (dispatcher if it has variants)
6. **Definition:** Create `lib/sections/definitions/featureGrid.tsx` with `hydrate` + `render`
7. **Registry:** Add one import to `lib/sections/registry.ts`

The page skeleton query never changes. The hydrate function handles its own data fetching.

---

## 13. Project Structure

```
app/
├── layout.tsx                              # Root layout (Noto Sans font)
├── globals.css                             # Suncor design tokens + Tailwind theme
├── [locale]/
│   ├── layout.tsx                          # Locale layout (next-intl)
│   └── [[...slug]]/page.tsx               # Catch-all FlexiblePage route
└── api/                                    # Preview mode endpoints

lib/
├── sections/                               # Section infrastructure
│   ├── config.ts                           # SectionDefinition type
│   ├── types.ts                            # All section + shared types
│   ├── registry.ts                         # Central registry
│   ├── SectionsRenderer.tsx                # Renders sections from registry
│   ├── utils.ts                            # Shared utilities (resolveCtaHref)
│   └── definitions/                        # Section definitions (hydrate + render wiring)
│       └── heroes.tsx
├── contentful/
│   ├── client.ts                           # GraphQL client factory
│   ├── pages.ts                            # Page fetching + hydration orchestration
│   ├── settings.ts                         # Render mode config
│   ├── locales.ts                          # Contentful locales API
│   └── graphql/
│       ├── fragments/                      # GraphQL fragments by content type
│       │   ├── cta/ctaFragment.ts
│       │   ├── heroes/heroesFragment.ts
│       │   ├── heroSlide/heroSlideFragment.ts
│       │   ├── image/imageFragment.ts
│       │   └── video/videoFragment.ts
│       └── queries/                        # GraphQL queries by content type
│           ├── flexiblePage/flexiblePageQueries.ts
│           ├── heroes/heroesQueries.ts
│           └── heroSlide/heroSlideQueries.ts
└── i18n/                                   # Internationalization

components/
├── sections/                               # Pure UI — section components only
│   └── Heroes/
│       ├── index.tsx                       # Dispatcher (reads frontEndComponent)
│       └── HomepageHero/
│           └── index.tsx                   # HeroCarousel client component
└── common/                                 # Reusable common components
    ├── Cta/index.tsx
    ├── ResponsiveImage/index.tsx
    ├── ResponsiveVideo/index.tsx
    └── RichText/RichText.tsx
```

---

## 14. Key File Reference

| Concern | File |
|---|---|
| Page route handler | `app/[locale]/[[...slug]]/page.tsx` |
| Root layout | `app/layout.tsx` |
| Design tokens | `app/globals.css` |
| Page fetching + hydration | `lib/contentful/pages.ts` |
| Section definition type | `lib/sections/config.ts` |
| Section types | `lib/sections/types.ts` |
| Section utilities | `lib/sections/utils.ts` |
| Section definitions | `lib/sections/definitions/` |
| Section registry | `lib/sections/registry.ts` |
| Sections renderer | `lib/sections/SectionsRenderer.tsx` |
| Contentful client | `lib/contentful/client.ts` |
| Render mode settings | `lib/contentful/settings.ts` |
| GraphQL fragments | `lib/contentful/graphql/fragments/` |
| GraphQL queries | `lib/contentful/graphql/queries/` |
| Rich text renderer | `components/common/RichText/RichText.tsx` |
| CTA component | `components/common/Cta/index.tsx` |
| Image component | `components/common/ResponsiveImage/index.tsx` |
| Video component | `components/common/ResponsiveVideo/index.tsx` |
| CSP + Next config | `next.config.ts` |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│                  /app/[locale]/[[...slug]]               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────────┐
              │  getFlexiblePageBySlug() │
              │  Phase 1: Skeleton query │
              │  (__typename + sys.id)   │
              └─────────┬───────────────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │  hydrateSections()       │
              │  Phase 2: Per-section    │
              │  hydrate() in parallel   │
              └─────────┬───────────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
    ┌────────────┐ ┌──────────┐ ┌──────────┐
    │  Heroes    │ │ Feature  │ │  Cards   │
    │  hydrate() │ │ Grid     │ │ hydrate()│
    └─────┬──────┘ │ hydrate()│ └──────────┘
          │        └──────────┘
          ▼
    ┌────────────────────────┐
    │ Heroes sub-hydration   │
    │ Skeleton → slide IDs   │
    │ → heroSlide(id) x N    │
    │   in parallel           │
    └────────────────────────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │  SectionsRenderer        │
              │  section.type → render() │
              └─────────┬───────────────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │  Heroes dispatcher       │
              │  frontEndComponent →     │
              │  ├── "homepage-hero"     │
              │  │   └── HeroCarousel   │
              │  └── "default"          │
              │      └── Static hero    │
              └─────────────────────────┘
```
