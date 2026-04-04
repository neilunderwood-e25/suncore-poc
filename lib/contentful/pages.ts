import { getContentfulClient } from "./client";
import {
  FLEXIBLE_PAGE_BY_SLUG,
  FLEXIBLE_PAGE_SLUGS,
} from "./graphql/queries/flexiblePage/flexiblePageQueries";
import { renderMode, type RenderMode } from "./settings";
import { sectionRegistry } from "@/components/sections/registry";
import type { RawSection, HydrateOptions } from "@/lib/sections/config";

export const HOME_SLUG = process.env.CONTENTFUL_HOME_SLUG ?? "home";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Skeleton stub returned by the page query (just typename + id). */
type SectionStub = {
  __typename: string;
  sys: { id: string };
};

/** Fully hydrated section (raw Contentful data). */
export type FlexiblePageSection = RawSection;

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
        items?: Array<SectionStub | null> | null;
      } | null;
    }>;
  };
};

type FlexiblePageSlugsResponse = {
  flexiblePageCollection?: {
    items?: Array<{ slug?: string | null }>;
  };
};

type FetchOptions = {
  locale: string;
  preview?: boolean;
  revalidate?: number | false;
  mode?: RenderMode;
};

/* ------------------------------------------------------------------ */
/*  Hydration — fetch full data for each section stub in parallel      */
/* ------------------------------------------------------------------ */

async function hydrateSections(
  stubs: SectionStub[],
  options: HydrateOptions
): Promise<FlexiblePageSection[]> {
  const results = await Promise.all(
    stubs.map(async (stub) => {
      const config = sectionRegistry.find(
        (s) => s.contentfulTypename === stub.__typename
      );

      if (!config) {
        // Unknown section type — pass the stub through as-is
        return stub as FlexiblePageSection;
      }

      const hydrated = await config.hydrate(stub.sys.id, options);
      if (!hydrated) return null;

      return {
        ...hydrated,
        __typename: stub.__typename,
      } as FlexiblePageSection;
    })
  );

  return results.filter((s): s is FlexiblePageSection => s !== null);
}

/* ------------------------------------------------------------------ */
/*  Page fetching                                                      */
/* ------------------------------------------------------------------ */

export const getFlexiblePageBySlug = async (
  slug: string,
  options: FetchOptions
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

  const stubs = (page.sectionsCollection?.items ?? []).filter(
    (s): s is SectionStub => s !== null
  );

  // Hydrate all sections in parallel
  const sections = await hydrateSections(stubs, {
    locale: options.locale,
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode,
  });

  return {
    sys: page.sys,
    slug: page.slug,
    pageTitle: page.pageTitle ?? null,
    sections,
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
