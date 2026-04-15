import type { SectionDefinition } from "@/lib/sections/config";
import type {
  NewsReleasesListingSection,
  NewsRelease,
} from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import {
  NEWS_RELEASES_LISTING_BY_ID,
  ALL_NEWS_RELEASES,
} from "@/lib/contentful/graphql/queries/newsReleasesListing/newsReleasesListingQueries";
import { NewsReleasesSection } from "@/components/sections/NewsReleasesSection/NewsReleasesSection";

type ListingResponse = {
  newsReleasesListing?: {
    sys: { id: string };
    heading?: string | null;
    limit?: number | null;
  } | null;
};

type ReleasesResponse = {
  newsReleaseCollection?: {
    items?: Array<NewsRelease | null> | null;
  } | null;
};

export const newsReleasesListingSection: SectionDefinition = {
  contentfulTypename: "NewsReleasesListing",
  type: "newsReleasesListing",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      // Fetch section config
      const { data: configData } =
        await client.rawRequest<ListingResponse>(
          NEWS_RELEASES_LISTING_BY_ID,
          {
            id,
            locale: options.locale,
            preview: options.preview ?? false,
          }
        );

      const section = configData?.newsReleasesListing;
      if (!section) return null;

      // Fetch news release entries
      const releasesData =
        await client.request<ReleasesResponse>(ALL_NEWS_RELEASES, {
          locale: options.locale,
          preview: options.preview ?? false,
          limit: section.limit ?? 20,
        });

      const releases =
        releasesData.newsReleaseCollection?.items?.filter(
          (item): item is NewsRelease => item !== null
        ) ?? [];

      return {
        id: section.sys.id,
        type: "newsReleasesListing",
        heading: section.heading ?? null,
        releases,
      } satisfies NewsReleasesListingSection;
    } catch (error) {
      console.error(
        `Failed to hydrate NewsReleasesListing (${id}):`,
        error
      );
      return null;
    }
  },

  render: (section) => (
    <NewsReleasesSection
      section={section as NewsReleasesListingSection}
    />
  ),
};
