import { NEWS_ARTICLE_CARD_FRAGMENT } from "../newsArticle/newsArticleFragment";
import { CTA_FRAGMENT } from "../cta/ctaFragment";

/** Fragment for the NewsAndStories homepage section. */
export const NEWS_AND_STORIES_FRAGMENT = /* GraphQL */ `
  fragment NewsAndStoriesFields on NewsAndStories {
    sys { id }
    frontEndComponent
    heading
    subtitle
    displayMode
    categoryFilter
    limit
    articlesCollection(limit: 12) {
      items {
        ...NewsArticleCardFields
      }
    }
    cta {
      ...CtaFields
    }
  }
  ${NEWS_ARTICLE_CARD_FRAGMENT}
  ${CTA_FRAGMENT}
`;
