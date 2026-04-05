import { CARDS_FRAGMENT } from "../../fragments/cards/cardsFragment";

export const CARDS_BY_ID = /* GraphQL */ `
  ${CARDS_FRAGMENT}

  query CardsById($id: String!, $locale: String!, $preview: Boolean) {
    cards(id: $id, locale: $locale, preview: $preview) {
      ...CardsFields
    }
  }
`;
