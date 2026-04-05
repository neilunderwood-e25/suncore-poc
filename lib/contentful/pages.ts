import { getContentfulClient } from "./client";
import {
  FLEXIBLE_PAGE_BY_SLUG,
  FLEXIBLE_PAGE_SLUGS,
} from "./graphql/queries/flexiblePage/flexiblePageQueries";
import { renderMode, type RenderMode } from "./settings";
import { sectionRegistry } from "@/components/sections/registry";
import type { HydrateOptions } from "@/lib/sections/config";
import type { Section, UnknownSection } from "@/lib/sections/types";

export const HOME_SLUG = process.env.CONTENTFUL_HOME_SLUG ?? "home";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SectionStub = {
  __typename: string;
  sys: { id: string };
};

export type FlexiblePage = {
  sys: { id: string };
  slug: string;
  pageTitle?: string | null;
  sections: Section[];
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
/*  Hydration — each section hydrates itself via the registry           */
/* ------------------------------------------------------------------ */

async function hydrateSections(
  stubs: SectionStub[],
  options: HydrateOptions
): Promise<Section[]> {
  const results = await Promise.all(
    stubs.map(async (stub) => {
      const config = sectionRegistry.find(
        (s) => s.contentfulTypename === stub.__typename
      );

      if (!config) {
        return {
          id: stub.sys.id,
          type: "unknown",
          raw: stub,
        } satisfies UnknownSection;
      }

      return config.hydrate(stub.sys.id, options);
    })
  );

  return results.filter((s): s is Section => s !== null);
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
