import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode, type RenderMode } from "@/lib/contentful/settings";
import {
  NEWS_ARTICLE_BY_SLUG,
  LATEST_NEWS_ARTICLES,
  ALL_NEWS_ARTICLE_SLUGS,
} from "@/lib/contentful/graphql/queries/newsArticle/newsArticleQueries";
import type {
  NewsArticleFull,
  NewsArticleCard,
} from "@/lib/sections/types";

/* ------------------------------------------------------------------ */
/*  Response types                                                     */
/* ------------------------------------------------------------------ */

type NewsArticleBySlugResponse = {
  newsArticleCollection?: {
    items?: Array<NewsArticleFull | null> | null;
  } | null;
};

type LatestNewsArticlesResponse = {
  newsArticleCollection?: {
    items?: Array<NewsArticleCard | null> | null;
  } | null;
};

type AllNewsArticleSlugsResponse = {
  newsArticleCollection?: {
    items?: Array<{ slug?: string | null }> | null;
  } | null;
};

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

type FetchOptions = {
  locale: string;
  preview?: boolean;
  revalidate?: number | false;
  mode?: RenderMode;
};

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

/** Fetch a full article by slug (for the detail page). */
export const getNewsArticleBySlug = async (
  slug: string,
  options: FetchOptions
): Promise<NewsArticleFull | null> => {
  const client = getContentfulClient({
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode ?? renderMode,
  });

  try {
    const data = await client.request<NewsArticleBySlugResponse>(
      NEWS_ARTICLE_BY_SLUG,
      {
        slug,
        locale: options.locale,
        preview: options.preview ?? false,
      }
    );

    return data.newsArticleCollection?.items?.[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch NewsArticle with slug "${slug}":`, error);
    return null;
  }
};

/** Fetch the latest N articles (for the "latest" display mode). */
export const getLatestNewsArticles = async (
  limit: number,
  options: FetchOptions
): Promise<NewsArticleCard[]> => {
  const client = getContentfulClient({
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode ?? renderMode,
  });

  try {
    const data = await client.request<LatestNewsArticlesResponse>(
      LATEST_NEWS_ARTICLES,
      {
        locale: options.locale,
        preview: options.preview ?? false,
        limit,
      }
    );

    return (
      data.newsArticleCollection?.items?.filter(
        (item): item is NewsArticleCard => item !== null
      ) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch latest news articles:", error);
    return [];
  }
};

/** Fetch all article slugs (for generateStaticParams). */
export const getAllNewsArticleSlugs = async (
  locale: string,
  options: { preview?: boolean; revalidate?: number | false; mode?: RenderMode } = {}
): Promise<string[]> => {
  const client = getContentfulClient({
    preview: options.preview,
    revalidate: options.revalidate,
    mode: options.mode ?? renderMode,
  });

  try {
    const data = await client.request<AllNewsArticleSlugsResponse>(
      ALL_NEWS_ARTICLE_SLUGS,
      {
        locale,
        preview: options.preview ?? false,
      }
    );

    return (
      data.newsArticleCollection?.items
        ?.map((item) => item?.slug)
        .filter((slug): slug is string => Boolean(slug)) ?? []
    );
  } catch (error) {
    console.error(`Failed to fetch news article slugs for locale "${locale}":`, error);
    return [];
  }
};
