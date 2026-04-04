export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    sys { id }
    title
    altText
    caption
    desktop {
      url
      width
      height
    }
    mobile {
      url
      width
      height
    }
  }
`;

export const CTA_FRAGMENT = /* GraphQL */ `
  fragment CtaFragment on Cta {
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

/** All shared fragments, included once at the top of every page query. */
export const SHARED_FRAGMENTS = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${CTA_FRAGMENT}
`;
