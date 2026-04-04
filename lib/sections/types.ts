export type SectionType =
  | "heroBanner"
  | "heroes"
  | "featureGrid"
  | "cardList"
  | "testimonial"
  | "unknown";

export type BaseSection = {
  id: string;
  type: SectionType;
};

export type HeroBannerSection = BaseSection & {
  type: "heroBanner";
  heading?: string | null;
  subheading?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
};

export type FeatureGridSection = BaseSection & {
  type: "featureGrid";
  heading?: string | null;
  items?: Array<{ title?: string | null; body?: string | null }>;
};

export type CardListSection = BaseSection & {
  type: "cardList";
  heading?: string | null;
  cards?: Array<{ title?: string | null; body?: string | null }>;
};

export type TestimonialSection = BaseSection & {
  type: "testimonial";
  quote?: string | null;
  author?: string | null;
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

export type RichTextDocument = {
  json: unknown;
};

export type HeroesSection = BaseSection & {
  type: "heroes";
  frontEndComponent?: string | null;
  heading?: string | null;
  subheading?: string | null;
  body?: RichTextDocument | null;
  image?: ImageEntry | null;
  ctas: CtaEntry[];
  backgroundImage?: ImageAsset | null;
  palette?: string | null;
};

export type UnknownSection = BaseSection & {
  type: "unknown";
  raw: unknown;
};

export type Section =
  | HeroBannerSection
  | HeroesSection
  | FeatureGridSection
  | CardListSection
  | TestimonialSection
  | UnknownSection;
