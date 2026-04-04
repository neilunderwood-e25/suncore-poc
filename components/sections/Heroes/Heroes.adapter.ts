import type { RawSection } from "@/lib/sections/config";
import type {
  HeroesSection,
  CtaEntry,
  ImageEntry,
  ImageAsset,
  RichTextDocument,
} from "@/lib/sections/types";

export function adaptHeroes(section: RawSection): HeroesSection {
  const ctaItems: CtaEntry[] =
    (section.ctasCollection as { items?: CtaEntry[] })?.items?.filter(Boolean) ?? [];

  return {
    id: section.sys.id,
    type: "heroes",
    heading: (section.heading as string) ?? null,
    subheading: (section.subheading as string) ?? null,
    body: (section.body as RichTextDocument) ?? null,
    image: (section.image as ImageEntry) ?? null,
    ctas: ctaItems,
    backgroundImage: (section.backgroundImage as ImageAsset) ?? null,
    palette: (section.palette as string) ?? null,
  };
}
