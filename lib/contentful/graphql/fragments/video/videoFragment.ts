export const VIDEO_ASSET_FRAGMENT = /* GraphQL */ `
  fragment VideoAssetFragment on Asset {
    sys { id }
    url
    contentType
  }
`;

export const COMMON_VIDEO_FRAGMENT = /* GraphQL */ `
  fragment CommonVideoFragment on Video {
    __typename
    sys { id }
    title
    altText
    caption
    desktop {
      ...VideoAssetFragment
    }
    mobile {
      ...VideoAssetFragment
    }
    posterImage {
      url
      width
      height
    }
    autoplay
    loop
    muted
  }
  ${VIDEO_ASSET_FRAGMENT}
`;
