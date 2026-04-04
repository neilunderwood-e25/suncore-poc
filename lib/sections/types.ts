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

export type RichTextDocument = {
  json: unknown;
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

export type HeroesSection = BaseSection & {
  type: "heroes";
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

/* ------------------------------------------------------------------ */
/*  Union — extend this as you add new section types                   */
/* ------------------------------------------------------------------ */

export type Section = HeroesSection | UnknownSection;
