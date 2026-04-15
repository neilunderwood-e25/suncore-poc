import type { SectionDefinition } from "@/lib/sections/config";
import type { NewsReleasesTableSection } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { NEWS_RELEASES_TABLE_BY_ID } from "@/lib/contentful/graphql/queries/newsReleasesTable/newsReleasesTableQueries";
import { NewsReleasesTableSectionComponent } from "@/components/sections/NewsReleasesSection/NewsReleasesTableSection";

type TableResponse = {
  newsReleasesTable?: {
    sys: { id: string };
    title?: string | null;
    body?: {
      json: unknown;
      links?: unknown;
    } | null;
  } | null;
};

export const newsReleasesTableSection: SectionDefinition = {
  contentfulTypename: "NewsReleasesTable",
  type: "newsReleasesTable",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      const { data } = await client.rawRequest<TableResponse>(
        NEWS_RELEASES_TABLE_BY_ID,
        {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );

      const section = data?.newsReleasesTable;
      if (!section) return null;

      return {
        id: section.sys.id,
        type: "newsReleasesTable",
        title: section.title ?? null,
        body: section.body
          ? { json: section.body.json, links: section.body.links ?? null }
          : null,
      } satisfies NewsReleasesTableSection;
    } catch (error) {
      console.error(
        `Failed to hydrate NewsReleasesTable (${id}):`,
        error
      );
      return null;
    }
  },

  render: (section) => (
    <NewsReleasesTableSectionComponent
      section={section as NewsReleasesTableSection}
    />
  ),
};
