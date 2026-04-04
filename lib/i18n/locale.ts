export type ResolvedLocale = {
  locale: string;
  slugSegments: string[];
};

export const resolveLocaleFromSlug = (
  slugSegments: string[] | undefined,
  locales: string[],
  defaultLocale: string
): ResolvedLocale => {
  const segments = slugSegments ?? [];
  const availableLocales = locales.includes(defaultLocale)
    ? locales
    : [defaultLocale, ...locales];
  const [first, ...rest] = segments;

  if (first && availableLocales.includes(first) && first !== defaultLocale) {
    return { locale: first, slugSegments: rest };
  }

  return { locale: defaultLocale, slugSegments: segments };
};

export const buildPathForLocale = (
  locale: string,
  slugSegments: string[],
  defaultLocale: string
) => {
  const prefix = locale === defaultLocale ? [] : [locale];
  const segments = [...prefix, ...slugSegments];
  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
};
