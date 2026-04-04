import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const HEROES_FRAGMENT = /* GraphQL */ `
  fragment HeroesFields on Heroes {
    sys { id }
    internalName
    slidesCollection(limit: 10) {
      items {
        sys { id }
        heading
        description
        backgroundImage {
          url
          width
          height
        }
        cta {
          ...CtaFields
        }
      }
    }
    palette
  }
  ${CTA_FRAGMENT}
`;
