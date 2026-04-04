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

export const HEROES_FRAGMENT = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${CTA_FRAGMENT}

  fragment HeroesFragment on Heroes {
    internalName
    frontEndComponent
    heading
    subheading
    body {
      json
    }
    image {
      ...ImageFragment
    }
    ctasCollection(limit: 5) {
      items {
        ...CtaFragment
      }
    }
    backgroundImage {
      url
      width
      height
    }
    palette
  }
`;
