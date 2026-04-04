export const HEROES_FRAGMENT = /* GraphQL */ `
  fragment HeroesFields on Heroes {
    sys { id }
    internalName
    slidesCollection(limit: 10) {
      items {
        sys { id }
      }
    }
  }
`;
