export const CTA_FRAGMENT = /* GraphQL */ `
  fragment CtaFields on Cta {
    sys { id }
    label
    type
    size
    arrowEnable
    linkBehavior
    newTab
    externalLink
    internalLink {
      __typename
      ... on FlexiblePage { slug }
    }
    downloadableAsset {
      url
    }
  }
`;
