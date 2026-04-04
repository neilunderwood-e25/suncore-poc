export const IMAGE_ASSET_FRAGMENT = /* GraphQL */ `
  fragment ImageAssetFragment on Asset {
    sys { id }
    url
    width
    height
  }
`;

export const COMMON_IMAGE_FRAGMENT = /* GraphQL */ `
  fragment CommonImageFragment on Image {
    __typename
    sys { id }
    title
    altText
    caption
    desktop {
      ...ImageAssetFragment
    }
    mobile {
      ...ImageAssetFragment
    }
  }
  ${IMAGE_ASSET_FRAGMENT}
`;
