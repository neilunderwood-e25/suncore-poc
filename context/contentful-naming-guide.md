# Contentful Naming Guide

Consistent naming makes the CMS readable for both editors and developers. Follow these conventions across all content types, entries, and fields.

---

## 1. Content Type Naming

| Convention | Example | Anti-pattern |
|---|---|---|
| **Singular noun** for individual items | `Card`, `Image`, `Video` | ~~`Cards`~~, ~~`Images`~~ |
| **Singular noun** for sections too | `Heroes`, `Cards`, `StockTicker` | OK as-is (section = container) |
| **camelCase** for content type IDs | `heroSlide`, `stockItem`, `flexiblePage` | ~~`hero-slide`~~, ~~`HeroSlide`~~ |
| **Title Case** for display names | `Hero Slide`, `Stock Ticker` | ~~`hero slide`~~, ~~`heroSlide`~~ |

### Content Type Categories

| Category | Purpose | Examples |
|---|---|---|
| **Pages** | URL-routable containers | `flexiblePage` |
| **Sections** | Top-level page building blocks | `heroes`, `cards`, `stockTicker` |
| **Components** | Reusable pieces within sections | `heroSlide`, `card`, `stockItem` |
| **Primitives** | Shared atomic content types | `image`, `video`, `cta` |

---

## 2. Internal Name Convention

Every content type has an `internalName` field (non-localized, required). This is what editors see in the entry list.

### Pattern: `[Context]: [Description]`

| Content Type | Internal Name Example |
|---|---|
| Flexible Page | `Homepage` |
| Heroes | `Hero: Homepage` |
| Hero Slide | `Slide: Investor Day` |
| Cards (section) | `Cards: Did You Know` |
| Card | `Card: Investments ~91%` |
| Stock Ticker | `Stock Ticker: Homepage` |
| Stock Item | `Stock: TSX:SU` |
| CTA | `CTA: Listen to the webcast` |
| Image | `Image: Investor Day Background` |
| Video | `Video: Homepage Hero Loop` |

### Rules

- **Always prefix with the type** when context helps: `Hero:`, `Slide:`, `Card:`, `CTA:`, `Image:`, `Video:`
- **Pages don't need a prefix** — the page title is enough: `Homepage`, `About Us`
- **Include the key differentiator** — for a Card, mention the stat or topic: `Card: Investments ~91%`
- **Keep it under 60 characters** — it needs to fit in the Contentful entry list

---

## 3. Field Naming

### Standard Fields (present on most content types)

| Field ID | Name | Type | Purpose |
|---|---|---|---|
| `internalName` | Internal Name | Symbol | Editor-facing label, always first field |
| `frontEndComponent` | Front End Component | Symbol | Variant selector for section dispatch |
| `heading` | Heading | Symbol (localized) | Primary heading text |
| `subtitle` | Subtitle | Symbol (localized) | Secondary label above heading |
| `description` | Description | RichText (localized) | Body content |
| `cta` | CTA | Entry link → `cta` | Call-to-action button |

### Field ID Convention

| Convention | Example | Anti-pattern |
|---|---|---|
| **camelCase** | `internalName`, `frontEndComponent` | ~~`internal_name`~~, ~~`InternalName`~~ |
| **Descriptive** — name after what it holds | `backgroundImage`, `posterImage` | ~~`image1`~~, ~~`bg`~~ |
| **Plural for arrays** | `slides`, `cards`, `stocks` | ~~`slide`~~, ~~`cardList`~~ |
| **No abbreviations** | `description`, `externalLink` | ~~`desc`~~, ~~`extLink`~~ |

### Link Fields

| Pattern | When to use | Example |
|---|---|---|
| `cta` | Single CTA button | `cta → Entry (cta)` |
| `ctas` | Multiple CTA buttons | `ctas → Entry[] (cta)` |
| `internalLink` | Link to a page | `internalLink → Entry (flexiblePage)` |
| `externalLink` | External URL | `externalLink → Symbol` |
| `icon` | Icon image reference | `icon → Entry (image)` |
| `background` | Background media (Image or Video) | `background → Entry (image, video)` |

### Media Fields

| Pattern | When to use | Example |
|---|---|---|
| `desktop` | Desktop asset variant | `desktop → Asset (image/video)` |
| `mobile` | Mobile asset variant | `mobile → Asset (image/video)` |
| `posterImage` | Video thumbnail | `posterImage → Asset (image)` |
| `altText` | Accessibility text | `altText → Symbol (localized)` |

---

## 4. Front End Component Values

Kebab-case, descriptive of the UI variant:

| Content Type | Value | Description |
|---|---|---|
| Heroes | `homepage-hero` | Full-bleed carousel with slides |
| Heroes | `default` | Simple static hero |
| Cards | `card-grid-slider` | Dark bg, stats grid, mobile carousel |
| Cards | `card-grid` | Colored bg, image + title cards |
| Cards | `default` | Simple white card grid |

### Rules

- **kebab-case** always: `card-grid-slider`, not `cardGridSlider`
- **Describe the layout**, not the content: `card-grid`, not `did-you-know`
- **`default`** is always the fallback — every section must handle it

---

## 5. Entry Naming in Practice

### Good Examples

```
Homepage                              ← Flexible Page
├── Hero: Homepage                    ← Heroes (frontEndComponent: homepage-hero)
│   ├── Slide: Investor Day           ← Hero Slide
│   │   ├── Image: Investor Day BG    ← Image (background)
│   │   └── CTA: Learn more           ← CTA
│   ├── Slide: Cavalry FC             ← Hero Slide
│   └── Slide: Q4 Results             ← Hero Slide
├── Stock Ticker: Homepage            ← Stock Ticker
│   ├── Stock: TSX:SU                 ← Stock Item
│   ├── Stock: NYSE:SU                ← Stock Item
│   └── CTA: Investors                ← CTA
└── Cards: Did You Know               ← Cards (frontEndComponent: card-grid-slider)
    ├── Card: Investments ~91%         ← Card
    ├── Card: Operations 5,212         ← Card
    ├── Card: People 30% Women         ← Card
    ├── Card: Operations ~20%          ← Card
    └── CTA: View all facts            ← CTA
```

### Bad Examples

```
hero1                                 ← What page? What variant?
test card                             ← No prefix, no differentiator
button                                ← Which button? Where is it used?
image_123                             ← Meaningless ID
My New Section                        ← No type prefix, vague
```

---

## 6. Localized vs Non-Localized Fields

| Localize | Don't Localize |
|---|---|
| `heading`, `subtitle`, `description` | `internalName`, `frontEndComponent` |
| `label` (CTA text) | `type`, `size`, `linkBehavior` |
| `altText`, `title`, `caption` | `externalLink`, `slug` |
| `companyName`, `delayDisclaimer` | `apiSymbol`, `exchange` |
| `stat`, `category` | `autoplay`, `loop`, `muted` |

**Rule of thumb:** If an editor would translate it, localize it. If it's structural/technical, don't.

---

## 7. SEO Fields

All on the `flexiblePage` content type, prefixed with `seo`:

| Field ID | Purpose |
|---|---|
| `seoTitle` | `<title>` tag |
| `seoDescription` | `<meta name="description">` |
| `seoOgImage` | Open Graph image |
| `seoNoIndex` | Block search indexing |
| `seoNoFollow` | Block link following |
| `seoCanonicalUrl` | Canonical URL override |
| `seoSchemaMarkup` | JSON-LD structured data |

---

## 8. Content Type Descriptions

Every content type should have a clear `description` in Contentful. This appears in the Content Model UI and helps editors understand what each type is for.

### Pattern

> [What it is] with [key fields/capabilities]

| Content Type | Description |
|---|---|
| `flexiblePage` | Main page container with slug-based routing, ordered sections collection, and SEO metadata |
| `heroes` | Hero carousel section with slides and variant dispatch via frontEndComponent |
| `heroSlide` | Individual slide for the Heroes carousel with background media, heading, description, and CTA |
| `cards` | Card grid section with heading, card collection, and CTA |
| `card` | Individual card with category, icon, stat, description, and optional link |
| `stockTicker` | Horizontal stock price bar with company name, live stock prices, delay disclaimer, and CTA |
| `stockItem` | Individual stock ticker entry with exchange label and API symbol for live price fetching |
| `cta` | Call-to-action button/link with three style variants and flexible link behavior |
| `image` | Responsive image with desktop/mobile variants and alt text |
| `video` | Responsive video with desktop/mobile variants, poster image, and playback controls |

---

## 9. Cleanup Checklist

Content types to **delete** (orphaned from earlier iterations):

| ID | Name | Reason |
|---|---|---|
| `6JtidV8WKA2GQIyOB6EA3S` | Hero Slide (old) | Replaced by `heroSlide` with clean ID |

Entries to audit:
- Old Hero Slide entries (`S2q8cAdJKQaXJSY5jtGhw`, `7BOLGU50ibR4CTtOoS5ckh`, `1jX4CoZmUnYK7IALbRoAWF`) — from the old content type, should be deleted
- Old CTA entries from early iterations — check if still referenced
