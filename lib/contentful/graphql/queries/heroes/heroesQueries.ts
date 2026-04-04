import { HEROES_FRAGMENT } from "../../fragments/heroes/heroesFragment";

export const HEROES_BY_ID = /* GraphQL */ `
  ${HEROES_FRAGMENT}

  query HeroesById($id: String!, $locale: String!, $preview: Boolean) {
    heroes(id: $id, locale: $locale, preview: $preview) {
      ...HeroesFields
    }
  }
`;
