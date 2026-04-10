import { COMMON_IMAGE_FRAGMENT } from "../image/imageFragment";
import { SEO_FRAGMENT } from "../seo/seoFragment";

/** Full fragment for the article detail page. */
export const NEWS_ARTICLE_FULL_FRAGMENT = /* GraphQL */ `
  fragment NewsArticleFullFields on NewsArticle {
    sys { id }
    title
    slug
    publishDate
    heroImage {
      ...CommonImageFragment
    }
    body {
      json
      links {
        assets {
          block {
            sys { id }
            url
            title
            description
            contentType
            width
            height
          }
        }
        entries {
          block {
            __typename
            sys { id }
          }
          inline {
            __typename
            sys { id }
          }
        }
      }
    }
    thumbnail {
      ...CommonImageFragment
    }
    category
    seo {
      ...SeoFields
    }
  }
  ${COMMON_IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
`;
