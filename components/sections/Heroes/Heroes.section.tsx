import type { SectionDefinition, RawSection } from "@/lib/sections/config";
import type { HeroesSection } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { HEROES_BY_ID } from "@/lib/contentful/graphql/queries/heroes/heroesQueries";
import { HERO_SLIDE_BY_ID } from "@/lib/contentful/graphql/queries/heroSlide/heroSlideQueries";
import { Heroes } from "./index";
import { adaptHeroes } from "./Heroes.adapter";

type HeroesSkeletonResponse = {
  heroes?: {
    sys: { id: string };
    internalName?: string;
    slidesCollection?: {
      items?: Array<{ sys: { id: string } } | null> | null;
    } | null;
  } | null;
};

type HeroSlideByIdResponse = {
  heroSlide?: RawSection | null;
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
      // Phase 1: Fetch Heroes skeleton (just slide IDs)
      const { data: skeletonData } =
        await client.rawRequest<HeroesSkeletonResponse>(HEROES_BY_ID, {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        });

      const skeleton = skeletonData?.heroes;
      if (!skeleton) return null;

      const slideStubs =
        skeleton.slidesCollection?.items?.filter(Boolean) ?? [];

      // Phase 2: Hydrate each slide by ID in parallel
      const slides = await Promise.all(
        slideStubs.map(async (stub) => {
          try {
            const { data } =
              await client.rawRequest<HeroSlideByIdResponse>(
                HERO_SLIDE_BY_ID,
                {
                  id: stub!.sys.id,
                  locale: options.locale,
                  preview: options.preview ?? false,
                }
              );
            return data?.heroSlide ?? null;
          } catch {
            console.error(`Failed to hydrate HeroSlide (${stub!.sys.id})`);
            return null;
          }
        })
      );

      // Return assembled raw section
      return {
        __typename: "Heroes",
        sys: skeleton.sys,
        internalName: skeleton.internalName,
        slidesCollection: {
          items: slides.filter(Boolean),
        },
      } as unknown as RawSection;
    } catch (error) {
      console.error(`Failed to hydrate Heroes (${id}):`, error);
      return null;
    }
  },

  adapt: adaptHeroes,

  render: (section) => <Heroes section={section as HeroesSection} />,
};
