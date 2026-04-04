import { HERO_SLIDE_FRAGMENT } from "../../fragments/heroSlide/heroSlideFragment";

export const HERO_SLIDE_BY_ID = /* GraphQL */ `
  ${HERO_SLIDE_FRAGMENT}

  query HeroSlideById($id: String!, $locale: String!, $preview: Boolean) {
    heroSlide(id: $id, locale: $locale, preview: $preview) {
      ...HeroSlideFields
    }
  }
`;
