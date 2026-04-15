import { NEWS_RELEASE_FRAGMENT } from "../../fragments/newsRelease/newsReleaseFragment";

/** Fetch the section config by ID. */
export const NEWS_RELEASES_LISTING_BY_ID = /* GraphQL */ `
  query NewsReleasesListingById($id: String!, $locale: String!, $preview: Boolean) {
    newsReleasesListing(id: $id, locale: $locale, preview: $preview) {
      sys { id }
      heading
      limit
    }
  }
`;

/** Fetch all news release entries. */
export const ALL_NEWS_RELEASES = /* GraphQL */ `
  ${NEWS_RELEASE_FRAGMENT}

  query AllNewsReleases(
    $locale: String!
    $preview: Boolean
    $limit: Int = 20
  ) {
    newsReleaseCollection(
      locale: $locale
      preview: $preview
      limit: $limit
      order: releaseDate_DESC
    ) {
      items {
        ...NewsReleaseFields
      }
    }
  }
`;
