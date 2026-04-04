import { getContentfulClient } from "./client";
import {
  FLEXIBLE_PAGE_BY_SLUG,
  FLEXIBLE_PAGE_SLUGS,
} from "./graphql/queries/flexiblePage/flexiblePageQueries";
import { renderMode, type RenderMode } from "./settings";

export const HOME_SLUG = process.env.CONTENTFUL_HOME_SLUG ?? "home";

export type FlexiblePageSection = {
  __typename: string;
  sys: { id: string };
  heading?: string | null;
  subheading?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  [key: string]: unknown;
};

export type FlexiblePage = {
  sys: { id: string };
  slug: string;
  pageTitle?: string | null;
  sections: FlexiblePageSection[];
};

type FlexiblePageBySlugResponse = {
  flexiblePageCollection?: {
    items?: Array<{
      sys: { id: string };
      slug: string;
      pageTitle?: string | null;
      sectionsCollection?: {
        items?: Array<FlexiblePageSection | null> | null;
      } | null;
    }>;
  };
};

type FlexiblePageSlugsResponse = {
  flexiblePageCollection?: {
    items?: Array<{ slug?: string | null }>;
  };
};

export const getFlexiblePageBySlug = async (
  slug: string,
  options: {
    locale: string;
    preview?: boolean;
    revalidate?: number | false;
    mode?: RenderMode;
  }
) => {
  const client = getContentfulClient({
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode ?? renderMode,
  });

  const requestPage = async (requestedSlug: string) => {
    try {
      const data = await client.request<FlexiblePageBySlugResponse>(
        FLEXIBLE_PAGE_BY_SLUG,
        {
          slug: requestedSlug,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );

      return data.flexiblePageCollection?.items?.[0] ?? null;
    } catch (error) {
      console.error(`Failed to fetch page with slug "${requestedSlug}":`, error);
      return null;
    }
  };

  let page = await requestPage(slug);

  if (!page && slug.startsWith("/")) {
    page = await requestPage(slug.slice(1));
  } else if (!page && !slug.startsWith("/")) {
    page = await requestPage(`/${slug}`);
  }
  if (!page) {
    return null;
  }

  const rawSections = page.sectionsCollection?.items ?? [];
  return {
    sys: page.sys,
    slug: page.slug,
    pageTitle: page.pageTitle ?? null,
    sections: rawSections.filter(
      (section): section is FlexiblePageSection => Boolean(section)
    ),
  } satisfies FlexiblePage;
};

export const normalizeSlugForPath = (slug: string) =>
  slug.replace(/^\/+|\/+$/g, "");

export const getAllFlexiblePageSlugs = async (
  locale: string,
  options: { preview?: boolean; revalidate?: number | false; mode?: RenderMode } = {}
) => {
  const client = getContentfulClient({
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode ?? renderMode,
  });

  try {
    const data = await client.request<FlexiblePageSlugsResponse>(
      FLEXIBLE_PAGE_SLUGS,
      {
        locale,
        preview: options.preview ?? false,
      }
    );

    return (
      data.flexiblePageCollection?.items
        ?.map((item) => item.slug)
        .filter((slug): slug is string => Boolean(slug)) ?? []
    );
  } catch (error) {
    console.error(`Failed to fetch page slugs for locale "${locale}":`, error);
    return [];
  }
};
