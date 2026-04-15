/** Fetch a News Releases Table section by ID, including its rich text body and linked assets. */
export const NEWS_RELEASES_TABLE_BY_ID = /* GraphQL */ `
  query NewsReleasesTableById($id: String!, $locale: String!, $preview: Boolean) {
    newsReleasesTable(id: $id, locale: $locale, preview: $preview) {
      sys { id }
      title
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
            hyperlink {
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
            hyperlink {
              __typename
              sys { id }
            }
          }
        }
      }
    }
  }
`;
