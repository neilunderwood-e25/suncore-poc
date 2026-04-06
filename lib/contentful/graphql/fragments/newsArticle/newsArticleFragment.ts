import { COMMON_IMAGE_FRAGMENT } from "../image/imageFragment";

/** Lightweight card-level fragment for article lists / homepage section. */
export const NEWS_ARTICLE_CARD_FRAGMENT = /* GraphQL */ `
  fragment NewsArticleCardFields on NewsArticle {
    sys { id }
    title
    slug
    publishDate
    summary
    thumbnail {
      ...CommonImageFragment
    }
  }
  ${COMMON_IMAGE_FRAGMENT}
`;
