import { HEROES_FRAGMENT } from "./fragments";

export const FLEXIBLE_PAGE_BY_SLUG = /* GraphQL */ `
  ${HEROES_FRAGMENT}

  query FlexiblePageBySlug($slug: String!, $locale: String!, $preview: Boolean) {
    flexiblePageCollection(
      where: { slug: $slug }
      limit: 1
      locale: $locale
      preview: $preview
    ) {
      items {
        sys {
          id
        }
        slug
        pageTitle
        sectionsCollection(limit: 20) {
          items {
            __typename
            sys {
              id
            }
            ... on Heroes {
              ...HeroesFragment
            }
          }
        }
      }
    }
  }
`;

// Note: Contentful GraphQL API has a maximum limit of 1000 items per query
// If you have more than 200 pages, consider implementing pagination
export const FLEXIBLE_PAGE_SLUGS = /* GraphQL */ `
  query FlexiblePageSlugs($locale: String!, $preview: Boolean) {
    flexiblePageCollection(locale: $locale, preview: $preview, limit: 200) {
      items {
        slug
      }
    }
  }
`;
