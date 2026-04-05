/* ------------------------------------------------------------------ */
/*  URL locale ↔ Contentful locale mapping                             */
/*                                                                     */
/*  URL slugs use lowercase region codes: en-ca, fr-ca                 */
/*  Contentful uses standard codes: en-US, fr-CA                       */
/* ------------------------------------------------------------------ */

export type LocaleConfig = {
  urlSlug: string;
  contentfulCode: string;
  displayName: string;
  htmlLang: string;
};

const LOCALE_MAP: LocaleConfig[] = [
  { urlSlug: "en-ca", contentfulCode: "en-US", displayName: "English", htmlLang: "en-CA" },
  { urlSlug: "fr-ca", contentfulCode: "fr-CA", displayName: "Français", htmlLang: "fr-CA" },
];

export const DEFAULT_URL_LOCALE = "en-ca";
export const URL_LOCALES = LOCALE_MAP.map((l) => l.urlSlug);

/** URL slug → Contentful locale code */
export function toContentfulLocale(urlSlug: string): string {
  return (
    LOCALE_MAP.find((l) => l.urlSlug === urlSlug.toLowerCase())?.contentfulCode ??
    LOCALE_MAP[0].contentfulCode
  );
}

/** Contentful locale code → URL slug */
export function toUrlLocale(contentfulCode: string): string {
  return (
    LOCALE_MAP.find((l) => l.contentfulCode === contentfulCode)?.urlSlug ??
    DEFAULT_URL_LOCALE
  );
}

/** Get all locale configs */
export function getLocaleConfigs(): LocaleConfig[] {
  return LOCALE_MAP;
}

/** Get config for a URL slug */
export function getLocaleConfig(urlSlug: string): LocaleConfig {
  return (
    LOCALE_MAP.find((l) => l.urlSlug === urlSlug.toLowerCase()) ?? LOCALE_MAP[0]
  );
}

/** Build a path for a given URL locale */
export function buildPathForLocale(
  urlLocale: string,
  slugSegments: string[]
): string {
  const segments = [urlLocale, ...slugSegments];
  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
}
