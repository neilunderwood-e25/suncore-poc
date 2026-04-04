export const HEROES_FRAGMENT_NAME = "HeroesFragment";

export const HEROES_FRAGMENT = /* GraphQL */ `
  fragment HeroesFragment on Heroes {
    internalName
    heading
    subheading
    body {
      json
    }
    image {
      ...ImageFragment
    }
    ctasCollection(limit: 5) {
      items {
        ...CtaFragment
      }
    }
    backgroundImage {
      url
      width
      height
    }
    palette
  }
`;
