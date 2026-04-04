import type { SectionDefinition, RawSection } from "@/lib/sections/config";
import type { HeroesSection } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { HEROES_BY_ID } from "@/lib/contentful/graphql/queries/heroes/heroesQueries";
import { Heroes } from "./index";
import { adaptHeroes } from "./Heroes.adapter";

type HeroesByIdResponse = {
  heroes?: RawSection | null;
};

export const heroesSection: SectionDefinition = {
  contentfulTypename: "Heroes",
  type: "heroes",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      // Use rawRequest to handle partial errors (e.g. unresolvable links)
      // Contentful returns data alongside errors — we still want the data
      const { data } = await client.rawRequest<HeroesByIdResponse>(
        HEROES_BY_ID,
        {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );
      return data?.heroes ?? null;
    } catch (error) {
      console.error(`Failed to hydrate Heroes (${id}):`, error);
      return null;
    }
  },

  adapt: adaptHeroes,

  render: (section) => <Heroes section={section as HeroesSection} />,
};
