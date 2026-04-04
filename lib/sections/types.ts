/* ------------------------------------------------------------------ */
/*  Shared primitives — used across multiple section types            */
/* ------------------------------------------------------------------ */

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

export type HeroSlide = {
  sys: { id: string };
  heading?: string | null;
  description?: string | null;
  backgroundImage?: ImageAsset | null;
  cta?: CtaEntry | null;
};

export type HeroesSection = BaseSection & {
  type: "heroes";
  slides: HeroSlide[];
  palette?: string | null;
};

export type UnknownSection = BaseSection & {
  type: "unknown";
  raw: unknown;
};

/* ------------------------------------------------------------------ */
/*  Union — extend this as you add new section types                   */
/* ------------------------------------------------------------------ */

export type Section = HeroesSection | UnknownSection;
