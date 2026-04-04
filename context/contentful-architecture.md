# Contentful + FlexiblePage Architecture

## Overview

This project is a **Contentful-powered Next.js 16 (App Router)** site. Pages are composed of modular **sections** managed in Contentful and rendered dynamically via a registry-based component system.

---

## High-Level Data Flow

```
URL Request
  → App Router (/app/[locale]/[[...slug]]/page.tsx)
  → resolveTemplate() determines template type
  → TEMPLATE_RENDERERS[type]() fetches + renders page
  → Contentful GraphQL: fetch page shell (section IDs + __typenames)
  → enrichPageData(): fetch full data for each section individually
  → FlexiblePageTemplate renders PageSchema + SectionsRenderer
  → SectionsRenderer maps each section.__typename → sectionRegistry[typename]
  → Section component dispatches to variant via frontEndComponent field
  → Final HTML rendered
```

---

## 1. Routing Layer

### App Router Structure

```
app/
├── layout.tsx                        # Root layout
├── [locale]/
│   ├── layout.tsx                    # Locale layout (header, footer, promo bar)
│   ├── [[...slug]]/
│   │   └── page.tsx                  # Catch-all FlexiblePage route
│   ├── search/[[...q]]/page.tsx      # Search page
│   └── ...
```

### Route Resolution

**File:** `lib/routing/routingResolver.ts`

`resolveTemplate(slugSegments)` maps URL patterns to template types:

| URL Pattern | Template Type |
|---|---|
| `/en/` | `FLEXIBLE` (slug = "/") |
| `/en/features/pdf-signing` | `FLEXIBLE` (slug = "features/pdf-signing") |
| `/en/blog/...` | `BLOG` |
| `/en/customer-stories/...` | `CUSTOMER_STORIES` |
| `/en/ask/...` | `ASK` |

Most pages resolve to `TemplateType.FLEXIBLE`, which triggers the FlexiblePage pipeline.

---

## 2. FlexiblePage Content Model

### Contentful Type

**File:** `lib/contentful/domain/flexiblePage/flexiblePage.type.ts`

```typescript
type FlexiblePage = {
  sys: { id: string };
  slug: string;
  pageTitle?: string | null;
  sectionsCollection: {
    items: Section[];
  } | null;

  // SEO
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgImage?: { sys?: { id: string } } | null;
  seoSchemaMarkup?: Record<string, unknown> | Record<string, unknown>[] | null;
  seoNoIndex?: boolean | null;

  // JS injection hooks
  jsInjectorHead?: string | null;
  jsInjectorBodyStart?: string | null;
  jsInjectorBodyEnd?: string | null;

  // Taxonomy
  contentfulMetadata?: PageContentfulMetadata | null;
};
```

A FlexiblePage is essentially a **slug + ordered list of sections + SEO metadata**.

---

## 3. Two-Phase Data Fetching

**File:** `lib/contentful/domain/flexiblePage/flexiblePage.service.ts`

Contentful GraphQL has query complexity limits. To work around this, section data is fetched in two phases:

### Phase 1: Page Shell

**Query:** `lib/contentful/graphql/queries/flexiblePage/flexiblePageQueries.ts`

Fetches the FlexiblePage with only **section metadata** (no full content):

```graphql
{
  flexiblePageCollection(where: { slug: $slug }) {
    items {
      slug
      sectionsCollection {
        items {
          sys { id }
          __typename
          ... on Heroes { frontEndComponent }
          ... on Cards { frontEndComponent }
          # Only IDs, typenames, and variant selectors
        }
      }
    }
  }
}
```

### Phase 2: Section Enrichment

`enrichPageData()` iterates each section and calls the appropriate fetcher by `__typename`:

| __typename | Fetcher |
|---|---|
| `Heroes` | `getHeroById()` |
| `Cards` | `getCardsWithHyperlinkById()` |
| `Cta` | `getCtaEntryById()` |
| `RichTextContainer` | `getRichTextContainerById()` |
| `Testimonials` | `getTestimonialsById()` |
| `Features` | `getFeaturesById()` |
| `TrustBlock` | `getTrustBlockById()` |
| `Accordion` | `getAccordionById()` |
| `Banners` | `getBannersById()` |
| `MetricsAndFacts` | `getMetricsAndFactsById()` |
| ... | ~25 section types total |

Each fetcher makes its own GraphQL query to get the full section data with all nested references resolved.

---

## 4. Section Registry & Rendering

### SectionsRenderer

**File:** `lib/sections/renderer.tsx`

Iterates through enriched sections and resolves each to a React component:

```typescript
validSections.map((section) => {
  const Component = sectionRegistry[section.__typename];
  return Component ? (
    <Component
      section={section}
      pageTaxonomyConcepts={pageTaxonomyConcepts}
      taxonomies={taxonomies}
    />
  ) : null;
});
```

### Section Registry

**File:** `lib/registry/registry.tsx`

Maps Contentful `__typename` → React component:

```typescript
const sectionRegistry: SectionRegistry = {
  Heroes,              // Dispatcher → many variants
  Cards,               // Dispatcher → many variants
  RichTextContainer,   // Dispatcher → many variants
  CtaSections,
  HeroBanner,
  FeatureGrid,
  Card,
  Testimonial,
  Testimonials,
  MiniBanner,
  TrustBlock,
  Accordion,
  Features,
  Tabs,
  Lists,
  MetricsAndFacts,
  PricingRelatedBlocks: Pricing,
  Embedded,
  Banners,
  PostTypes,
  // ... 20+ entries
};
```

### Component Props Interface

```typescript
type SectionComponentProps = {
  section: Section;                           // Full section data
  pageTaxonomyConcepts?: TaxonomyConcept[];   // Page-level taxonomy
  taxonomies?: TaxonomyConcept[];             // Global taxonomy list
};
```

---

## 5. Dispatcher Pattern (frontEndComponent)

Many Contentful content types support multiple UI variants via the `frontEndComponent` field. The top-level section component acts as a **dispatcher**.

### Example: Heroes Dispatcher

**File:** `components/sections/Heroes/index.tsx`

```typescript
export default function HeroesSection({ section }) {
  const frontEndComponent = section.frontEndComponent;

  if (frontEndComponent === "HeroesCustomerStories") return <CustomerStories />;
  if (frontEndComponent === "HeroesStory")            return <Story />;
  if (frontEndComponent === "HeroesBrand")             return <Brand />;
  if (frontEndComponent === "HeroesMedia")             return <Media />;
  if (frontEndComponent === "HeroesVideo")             return <Video />;
  // ... 11+ variants
  return <Form />;  // fallback
}
```

### Example: Cards Dispatcher

**File:** `components/sections/Cards/index.tsx`

Maps `frontEndComponent` values like:
- `BLOGS_FEATURED` → `<FeaturedPosts />`
- `RELATED_BLOG_LIST` → `<RelatedBlogList />`
- `CARDS` → `<UICardsSection />`
- `CARDS_BRAND` → `<Brand />`
- `COVER_CARDS` → `<CoverCards />`
- 13+ total variants

### Example: RichTextContainer Dispatcher

**File:** `components/sections/RichTextContainer/index.tsx`

- `TYPOGRAPHY` → `<TypographySection />`
- `DISCLAIMER` → `<DisclaimerSection />`
- `LIST_CHECKED_COLUMN` → `<ListCheckedColumn />`
- `LIST_CHECKED_NO_COLUMN` → `<ListCheckedNoColumn />`

---

## 6. Section Types

**File:** `lib/sections/types.ts`

All sections extend `BaseSection`:

```typescript
type BaseSection = {
  __typename: string;
  sys: { id: string };
  frontEndComponent?: string | null;
  // ... common fields
};
```

Union type:

```typescript
type Section =
  | HeroBannerSection
  | BannersSection
  | FeatureGridSection
  | TestimonialSection
  | TestimonialsSection
  | FeaturesSection
  | VideoSection
  | CardsSection
  | HeroesSection
  | MetricsAndFactsSection
  | TrustBlockSection
  | PostTypesSection
  | CTASection
  | RichTextContainerSection
  | EmbeddedSection
  | BaseSection;
```

### Contentful Entry Typenames

**File:** `lib/contentful/config/ENUM.ts`

```typescript
enum ContentfulEntryTypename {
  ACCORDION = "Accordion",
  BANNERS = "Banners",
  CARDS = "Cards",
  CTA = "Cta",
  CTA_SECTIONS = "CtaSections",
  HEROES = "Heroes",
  HUBSPOT_FORM = "HubSpotForm",
  RICH_TEXT_CONTAINER = "RichTextContainer",
  IMAGE = "Image",
  MINI_BANNER = "MiniBanner",
  POST_TYPES = "PostTypes",
  TESTIMONIALS = "Testimonials",
  TRUST_BLOCK = "TrustBlock",
  VIDEO = "Video",
  MEDIA_BLOCK = "MediaBlock",
  FEATURES = "Features",
  LISTS = "Lists",
  METRICS_AND_FACTS = "MetricsAndFacts",
  TABS = "Tabs",
  PRICING_RELATED_BLOCKS = "PricingRelatedBlocks",
  EMBEDDED = "Embedded",
  // ~24 total types
}
```

---

## 7. Folder Structure

```
components/sections/
├── Accordion/
│   └── index.tsx
├── Banners/
│   └── index.tsx
├── Cards/                          # Dispatcher with 13+ variants
│   ├── index.tsx                   # Dispatcher
│   ├── Brand/
│   ├── BrandTabs/
│   ├── CoverCards/
│   ├── FeaturedPosts/
│   ├── ImageSlider/
│   ├── RelatedBlogList/
│   ├── RelatedCustomerStories/
│   └── UICardsSection/
├── Heroes/                         # Dispatcher with 11+ variants
│   ├── index.tsx                   # Dispatcher
│   ├── Brand/
│   ├── CustomerStories/
│   ├── Form/
│   ├── Hero/
│   ├── Media/
│   └── Video/
├── RichTextContainer/              # Dispatcher with 4 variants
│   ├── index.tsx                   # Dispatcher
│   ├── Disclaimer/
│   ├── ListCheckedColumn/
│   ├── ListCheckedNoColumn/
│   └── Typography/
├── Features/
├── MetricsAndFacts/
├── PostTypes/
├── Pricing/
├── Tabs/
├── Testimonials/
├── TrustBlock/
└── ...
```

---

## 8. Rich Text Rendering

**File:** `components/common/RichText/RichText.tsx`

Contentful Rich Text fields are AST documents rendered via `documentToReactComponents()` with custom node handlers.

### Supported Embedded Entries in Rich Text

Rich text can embed full section components inline:

| Embedded __typename | Rendered As |
|---|---|
| `Cta` | `<Cta />` |
| `Image` | `<ImageBlock />` |
| `Video` | `<VideoComponent />` |
| `HubSpotForm` | `<HubSpotFormBlock />` |
| `Accordion` | `<AccordionSection />` |
| `Testimonials` | `<TestimonialsView />` |
| `Cards` | `<Cards />` |
| `Banners` | `<Banners />` |
| `TrustBlock` | `<TrustBlockClient />` |
| `RichTextContainer` | Recursive rendering |

### Entry Hyperlinks

Cross-page links resolve based on page type:
- Blog pages → `/blog/{slug}`
- Story pages → `/customer-stories/{slug}`
- Flexible pages → `/{slug}`

### Special Text Tokens

- `{{ Rate:G2 }}` → Renders G2 star rating component
- Newlines → `<br />` tags

---

## 9. Image Handling

**File:** `components/common/Image/Image.tsx`

Uses Contentful's Image API for responsive transforms:

```
baseUrl?w=1200&q=80&fm=webp    # WebP variant
baseUrl?w=960&q=80&fm=avif     # AVIF variant
```

Builds multi-format `srcset` with automatic size breakpoints.

---

## 10. Internationalization

- **Locale routing:** All pages under `/app/[locale]/`
- **Contentful locales:** Content fetched in the requested locale
- **next-intl:** Client-side i18n provider set in locale layout
- **Header/footer:** Selected per locale + pathname pattern

---

## 11. FlexiblePageTemplate

**File:** `components/templates/FlexiblePage/FlexiblePage.tsx`

Orchestrates the full page render:

```
FlexiblePageTemplate
├── PageSchema          # SEO: structured data, canonical URL, OG tags
├── ScriptManager       # JS injectors (head, body-start, body-end)
└── SectionsRenderer    # Maps sections → components via registry
```

---

## 12. Key File Reference

| Concern | File |
|---|---|
| Page route handler | `app/[locale]/[[...slug]]/page.tsx` |
| Locale layout | `app/[locale]/layout.tsx` |
| Route resolver | `lib/routing/routingResolver.ts` |
| Template renderers | `lib/templates/templateRenderers.tsx` |
| FlexiblePage template | `components/templates/FlexiblePage/FlexiblePage.tsx` |
| FlexiblePage type | `lib/contentful/domain/flexiblePage/flexiblePage.type.ts` |
| FlexiblePage service | `lib/contentful/domain/flexiblePage/flexiblePage.service.ts` |
| GraphQL queries | `lib/contentful/graphql/queries/flexiblePage/flexiblePageQueries.ts` |
| Section types | `lib/sections/types.ts` |
| Sections renderer | `lib/sections/renderer.tsx` |
| Section registry | `lib/registry/registry.tsx` |
| Contentful enums | `lib/contentful/config/ENUM.ts` |
| Contentful client | `lib/contentful/client/client.ts` |
| Rich text renderer | `components/common/RichText/RichText.tsx` |
| Image component | `components/common/Image/Image.tsx` |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│                  /app/[locale]/[[...slug]]               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  resolveTemplate()  │
              │  Route → Template   │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  TEMPLATE_RENDERERS │
              │  [FLEXIBLE]()       │
              └─────────┬───────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
   ┌──────────────┐        ┌──────────────────┐
   │ Phase 1:     │        │ Phase 2:         │
   │ GraphQL      │───────▶│ enrichPageData() │
   │ Page Shell   │        │ Per-section fetch │
   └──────────────┘        └────────┬─────────┘
                                    │
                                    ▼
                     ┌──────────────────────────┐
                     │  FlexiblePageTemplate     │
                     │  ├── PageSchema (SEO)     │
                     │  ├── ScriptManager (JS)   │
                     │  └── SectionsRenderer     │
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │    sectionRegistry        │
                     │  __typename → Component   │
                     └────────────┬──────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼              ▼
              ┌──────────┐ ┌──────────┐  ┌──────────┐
              │ Heroes   │ │  Cards   │  │   CTA    │
              │Dispatcher│ │Dispatcher│  │  Section │
              └────┬─────┘ └────┬─────┘  └──────────┘
                   │            │
          frontEndComponent  frontEndComponent
                   │            │
              ┌────┴────┐  ┌───┴────┐
              ▼         ▼  ▼        ▼
           Brand    Video  Brand  Featured
           Form     Media  Cover  BlogList
           Hero     ...    Slider  ...
```
