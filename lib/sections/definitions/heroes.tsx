import type { SectionDefinition } from "@/lib/sections/config";
import type { HeroesSection, HeroSlide } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { HEROES_BY_ID } from "@/lib/contentful/graphql/queries/heroes/heroesQueries";
import { HERO_SLIDE_BY_ID } from "@/lib/contentful/graphql/queries/heroSlide/heroSlideQueries";
import { Heroes } from "@/components/sections/Heroes";

type HeroesSkeletonResponse = {
  heroes?: {
    sys: { id: string };
    frontEndComponent?: string | null;
    slidesCollection?: {
      items?: Array<{ sys: { id: string } } | null> | null;
    } | null;
  } | null;
};

type HeroSlideResponse = {
  heroSlide?: HeroSlide | null;
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

      const slides = await Promise.all(
        slideStubs.map(async (stub) => {
          try {
            const { data } = await client.rawRequest<HeroSlideResponse>(
              HERO_SLIDE_BY_ID,
              {
                id: stub!.sys.id,
                locale: options.locale,
                preview: options.preview ?? false,
              }
            );
            return data?.heroSlide ?? null;
          } catch (err) {
            console.error(`Failed to hydrate HeroSlide (${stub!.sys.id}):`, err);
            return null;
          }
        })
      );

      return {
        id: skeleton.sys.id,
        type: "heroes",
        frontEndComponent: skeleton.frontEndComponent ?? null,
        slides: slides.filter((s): s is HeroSlide => s !== null),
      } satisfies HeroesSection;
    } catch (error) {
      console.error(`Failed to hydrate Heroes (${id}):`, error);
      return null;
    }
  },

  render: (section) => <Heroes section={section as HeroesSection} />,
};
