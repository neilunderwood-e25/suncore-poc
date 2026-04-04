import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const HERO_SLIDE_FRAGMENT = /* GraphQL */ `
  fragment HeroSlideFields on HeroSlide {
    sys { id }
    heading
    description {
      json
    }
    backgroundImage {
      url
      width
      height
    }
    cta {
      ...CtaFields
    }
  }
  ${CTA_FRAGMENT}
`;
