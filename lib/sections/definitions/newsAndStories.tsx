import type { SectionDefinition } from "@/lib/sections/config";
import type {
  NewsAndStoriesSection,
  NewsArticleCard,
  CtaEntry,
} from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { NEWS_AND_STORIES_BY_ID } from "@/lib/contentful/graphql/queries/newsAndStories/newsAndStoriesQueries";
import { getLatestNewsArticles } from "@/lib/contentful/domain/newsArticle/newsArticle.service";
import { NewsAndStories } from "@/components/sections/NewsAndStoriesSection/NewsAndStories";

type NewsAndStoriesResponse = {
  newsAndStories?: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    subtitle?: string | null;
    displayMode?: string | null;
    categoryFilter?: string | null;
    limit?: number | null;
    articlesCollection?: {
      items?: Array<NewsArticleCard | null> | null;
    } | null;
    cta?: CtaEntry | null;
  } | null;
};

export const newsAndStoriesSection: SectionDefinition = {
  contentfulTypename: "NewsAndStories",
  type: "newsAndStories",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      const { data } = await client.rawRequest<NewsAndStoriesResponse>(
        NEWS_AND_STORIES_BY_ID,
        {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );

      const section = data?.newsAndStories;
      if (!section) return null;

      let articles: NewsArticleCard[];

      if (section.displayMode === "latest") {
        // Dynamic mode — fetch latest articles
        articles = await getLatestNewsArticles(
          section.limit ?? 5,
          {
            locale: options.locale,
            preview: options.preview,
            revalidate: options.revalidate,
            mode: options.mode,
          }
        );
      } else {
        // Manual mode — use curated articles from the section
        articles = (section.articlesCollection?.items ?? []).filter(
          (a): a is NewsArticleCard => a !== null
        );
      }

      return {
        id: section.sys.id,
        type: "newsAndStories",
        frontEndComponent: section.frontEndComponent ?? null,
        heading: section.heading ?? null,
        subtitle: section.subtitle ?? null,
        articles,
        cta: section.cta ?? null,
      } satisfies NewsAndStoriesSection;
    } catch (error) {
      console.error(`Failed to hydrate NewsAndStories (${id}):`, error);
      return null;
    }
  },

  render: (section) => (
    <NewsAndStories section={section as NewsAndStoriesSection} />
  ),
};
