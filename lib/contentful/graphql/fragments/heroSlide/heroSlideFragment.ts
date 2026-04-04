import { COMMON_IMAGE_FRAGMENT } from "../image/imageFragment";
import { COMMON_VIDEO_FRAGMENT } from "../video/videoFragment";
import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const HERO_SLIDE_FRAGMENT = /* GraphQL */ `
  fragment HeroSlideFields on HeroSlide {
    sys { id }
    heading
    description {
      json
    }
    background {
      __typename
      ... on Image { ...CommonImageFragment }
      ... on Video { ...CommonVideoFragment }
    }
    cta {
      ...CtaFields
    }
  }
  ${COMMON_IMAGE_FRAGMENT}
  ${COMMON_VIDEO_FRAGMENT}
  ${CTA_FRAGMENT}
`;
