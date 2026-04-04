import type { RawSection } from "@/lib/sections/config";
import type { HeroesSection, HeroSlide, CtaEntry, ImageAsset, RichTextDocument } from "@/lib/sections/types";

export function adaptHeroes(section: RawSection): HeroesSection {
  const slidesRaw =
    (section.slidesCollection as { items?: Array<Record<string, unknown>> })
      ?.items ?? [];

  const slides: HeroSlide[] = slidesRaw
    .filter(Boolean)
    .map((slide) => ({
      sys: slide.sys as { id: string },
      heading: (slide.heading as string) ?? null,
      description: (slide.description as RichTextDocument) ?? null,
      backgroundImage: (slide.backgroundImage as ImageAsset) ?? null,
      cta: (slide.cta as CtaEntry) ?? null,
    }));

  return {
    id: section.sys.id,
    type: "heroes",
    slides,
  };
}
