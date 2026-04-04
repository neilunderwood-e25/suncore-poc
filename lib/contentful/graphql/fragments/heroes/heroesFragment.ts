import { COMMON_IMAGE_FRAGMENT } from "../image/imageFragment";
import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const HEROES_FRAGMENT = /* GraphQL */ `
  fragment HeroesFields on Heroes {
    sys { id }
    internalName
    heading
    subheading
    body {
      json
    }
    image {
      ...CommonImageFragment
    }
    ctasCollection(limit: 5) {
      items {
        ...CtaFields
      }
    }
    backgroundImage {
      url
      width
      height
    }
    palette
  }
  ${COMMON_IMAGE_FRAGMENT}
  ${CTA_FRAGMENT}
`;
