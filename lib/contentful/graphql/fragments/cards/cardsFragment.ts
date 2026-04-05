import { COMMON_IMAGE_FRAGMENT } from "../image/imageFragment";
import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const CARDS_FRAGMENT = /* GraphQL */ `
  fragment CardsFields on Cards {
    sys { id }
    internalName
    frontEndComponent
    heading
    cardsCollection(limit: 20) {
      items {
        sys { id }
        category
        icon {
          ...CommonImageFragment
        }
        stat
        description {
          json
        }
        externalLink
        internalLink {
          ... on FlexiblePage { slug }
        }
      }
    }
    cta {
      ...CtaFields
    }
  }
  ${COMMON_IMAGE_FRAGMENT}
  ${CTA_FRAGMENT}
`;
