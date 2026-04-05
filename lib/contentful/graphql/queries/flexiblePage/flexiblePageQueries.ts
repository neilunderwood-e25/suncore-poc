/**
 * Skeleton query — fetches only __typename + sys.id for each section.
 * Full section data is hydrated per-section in parallel via the registry.
 */
export const FLEXIBLE_PAGE_BY_SLUG = /* GraphQL */ `
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
            ... on Entry {
              sys { id }
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
