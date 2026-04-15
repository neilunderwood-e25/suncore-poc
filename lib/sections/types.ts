/* ------------------------------------------------------------------ */
/*  Shared primitives — used across multiple section types            */
/* ------------------------------------------------------------------ */

export type SeoEntry = {
  sys: { id: string };
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgImage?: ImageAsset | null;
  seoNoIndex?: boolean | null;
  seoNoFollow?: boolean | null;
  seoCanonicalUrl?: string | null;
  seoSchemaMarkup?: unknown | null;
};

export type ImageAsset = {
  url: string | null;
  width?: number | null;
  height?: number | null;
};

export type ImageEntry = {
  sys: { id: string };
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  desktop?: ImageAsset | null;
  mobile?: ImageAsset | null;
};

export type VideoAsset = {
  url: string | null;
  contentType?: string | null;
};

export type VideoEntry = {
  sys: { id: string };
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  desktop?: VideoAsset | null;
  mobile?: VideoAsset | null;
  posterImage?: ImageAsset | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
};

export type CtaEntry = {
  sys: { id: string };
  label?: string | null;
  type?: string | null;
  size?: string | null;
  arrowEnable?: boolean | null;
  linkBehavior?: string | null;
  newTab?: boolean | null;
  externalLink?: string | null;
  internalLink?: { __typename: string; slug?: string | null } | null;
  downloadableAsset?: { url?: string | null } | null;
};

export type RichTextAsset = {
  sys: { id: string };
  url?: string | null;
  title?: string | null;
  description?: string | null;
  contentType?: string | null;
  width?: number | null;
  height?: number | null;
};

export type RichTextLinks = {
  assets?: {
    block?: Array<RichTextAsset | null>;
  };
  entries?: {
    block?: Array<{ __typename: string; sys: { id: string }; [key: string]: unknown } | null>;
    inline?: Array<{ __typename: string; sys: { id: string }; [key: string]: unknown } | null>;
    hyperlink?: Array<{ __typename: string; sys: { id: string }; [key: string]: unknown } | null>;
  };
};

export type RichTextDocument = {
  json: unknown;
  links?: RichTextLinks | null;
};

/* ------------------------------------------------------------------ */
/*  Base section                                                       */
/* ------------------------------------------------------------------ */

export type BaseSection = {
  id: string;
  type: string;
};

/* ------------------------------------------------------------------ */
/*  Section types — add new section types here as they are created     */
/* ------------------------------------------------------------------ */

export type HeroSlideBackground =
  | (ImageEntry & { __typename: "Image" })
  | (VideoEntry & { __typename: "Video" });

export type HeroSlide = {
  sys: { id: string };
  heading?: string | null;
  description?: RichTextDocument | null;
  background?: HeroSlideBackground | null;
  cta?: CtaEntry | null;
};

export type HeroesSection = BaseSection & {
  type: "heroes";
  frontEndComponent?: string | null;
  slides: HeroSlide[];
};

export type StockItem = {
  sys: { id: string };
  exchange?: string | null;
  apiSymbol?: string | null;
  manualPrice?: number | null;
  manualChange?: number | null;
};

export type StockTickerSection = BaseSection & {
  type: "stockTicker";
  companyName?: string | null;
  stocks: StockItem[];
  delayDisclaimer?: string | null;
  cta?: CtaEntry | null;
  liveQuotes?: Record<string, { price: number; change: number }>;
};

export type CardEntry = {
  sys: { id: string };
  category?: string | null;
  icon?: ImageEntry | null;
  stat?: string | null;
  description?: RichTextDocument | null;
  externalLink?: string | null;
  internalLink?: { slug?: string | null } | null;
};

export type CardsSection = BaseSection & {
  type: "cards";
  frontEndComponent?: string | null;
  subtitle?: string | null;
  heading?: string | null;
  cards: CardEntry[];
  cta?: CtaEntry | null;
};

/* ------------------------------------------------------------------ */
/*  News Article types                                                 */
/* ------------------------------------------------------------------ */

export type NewsArticleCard = {
  sys: { id: string };
  title?: string | null;
  slug?: string | null;
  publishDate?: string | null;
  category?: string | null;
  thumbnail?: ImageEntry | null;
};

export type NewsArticleFull = NewsArticleCard & {
  heroImage?: ImageEntry | null;
  body?: RichTextDocument | null;
  seo?: SeoEntry | null;
};

export type NewsAndStoriesSection = BaseSection & {
  type: "newsAndStories";
  frontEndComponent?: string | null;
  heading?: string | null;
  subtitle?: string | null;
  articles: NewsArticleCard[];
  cta?: CtaEntry | null;
};

/* ------------------------------------------------------------------ */
/*  News Release types                                                 */
/* ------------------------------------------------------------------ */

export type NewsRelease = {
  sys: { id: string };
  title?: string | null;
  releaseDate?: string | null;
  pdfDocument?: {
    url: string | null;
    title?: string | null;
    fileName?: string | null;
    size?: number | null;
    contentType?: string | null;
  } | null;
  externalUrl?: string | null;
  pageCount?: number | null;
};

export type NewsReleasesListingSection = BaseSection & {
  type: "newsReleasesListing";
  heading?: string | null;
  releases: NewsRelease[];
};

export type UnknownSection = BaseSection & {
  type: "unknown";
  raw: unknown;
};

/* ------------------------------------------------------------------ */
/*  Union — extend this as you add new section types                   */
/* ------------------------------------------------------------------ */

export type Section =
  | HeroesSection
  | StockTickerSection
  | CardsSection
  | NewsAndStoriesSection
  | NewsReleasesListingSection
  | UnknownSection;
