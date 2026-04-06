import { NEWS_ARTICLE_FULL_FRAGMENT } from "../../fragments/newsArticle/newsArticleFullFragment";
import { NEWS_ARTICLE_CARD_FRAGMENT } from "../../fragments/newsArticle/newsArticleFragment";

/** Fetch a single article by slug (detail page). */
export const NEWS_ARTICLE_BY_SLUG = /* GraphQL */ `
  ${NEWS_ARTICLE_FULL_FRAGMENT}

  query NewsArticleBySlug($slug: String!, $locale: String!, $preview: Boolean) {
    newsArticleCollection(
      where: { slug: $slug }
      locale: $locale
      preview: $preview
      limit: 1
    ) {
      items {
        ...NewsArticleFullFields
      }
    }
  }
`;

/** Fetch the latest N articles, optionally filtered by category. */
export const LATEST_NEWS_ARTICLES = /* GraphQL */ `
  ${NEWS_ARTICLE_CARD_FRAGMENT}

  query LatestNewsArticles(
    $locale: String!
    $preview: Boolean
    $limit: Int = 6
  ) {
    newsArticleCollection(
      locale: $locale
      preview: $preview
      limit: $limit
      order: publishDate_DESC
    ) {
      items {
        ...NewsArticleCardFields
      }
    }
  }
`;

/** Fetch all article slugs for static generation. */
export const ALL_NEWS_ARTICLE_SLUGS = /* GraphQL */ `
  query AllNewsArticleSlugs($locale: String!, $preview: Boolean) {
    newsArticleCollection(locale: $locale, preview: $preview, limit: 200) {
      items {
        slug
      }
    }
  }
`;
