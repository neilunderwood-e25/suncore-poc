/** Fragment for news release items in listing pages. */
export const NEWS_RELEASE_FRAGMENT = /* GraphQL */ `
  fragment NewsReleaseFields on NewsRelease {
    sys { id }
    title
    releaseDate
    pdfDocument {
      url
      title
      fileName
      size
      contentType
    }
    externalUrl
    pageCount
  }
`;
