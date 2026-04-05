import type { SectionDefinition } from "@/lib/sections/config";
import type { CardsSection, CardEntry, CtaEntry } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { CARDS_BY_ID } from "@/lib/contentful/graphql/queries/cards/cardsQueries";
import { Cards } from "@/components/sections/CardSection";

type CardsResponse = {
  cards?: {
    sys: { id: string };
    frontEndComponent?: string | null;
    subtitle?: string | null;
    heading?: string | null;
    cardsCollection?: {
      items?: Array<CardEntry | null> | null;
    } | null;
    cta?: CtaEntry | null;
  } | null;
};

export const cardsSection: SectionDefinition = {
  contentfulTypename: "Cards",
  type: "cards",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      const { data } = await client.rawRequest<CardsResponse>(
        CARDS_BY_ID,
        {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );

      const section = data?.cards;
      if (!section) return null;

      const cards = (section.cardsCollection?.items ?? []).filter(
        (c): c is CardEntry => c !== null
      );

      return {
        id: section.sys.id,
        type: "cards",
        frontEndComponent: section.frontEndComponent ?? null,
        subtitle: section.subtitle ?? null,
        heading: section.heading ?? null,
        cards,
        cta: section.cta ?? null,
      } satisfies CardsSection;
    } catch (error) {
      console.error(`Failed to hydrate Cards (${id}):`, error);
      return null;
    }
  },

  render: (section) => <Cards section={section as CardsSection} />,
};
