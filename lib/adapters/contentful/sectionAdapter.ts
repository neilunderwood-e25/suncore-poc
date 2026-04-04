import type { FlexiblePageSection } from "@/lib/contentful/pages";
import type {
  Section,
  HeroesSection,
  ImageEntry,
  CtaEntry,
  ImageAsset,
  RichTextDocument,
} from "@/lib/sections/types";
import type { SectionAdapter } from "@/lib/adapters/types";

const CONTENTFUL_TYPE_MAP: Record<string, Section["type"]> = {
  HeroBanner: "heroBanner",
  Heroes: "heroes",
  FeatureGrid: "featureGrid",
  CardList: "cardList",
  Testimonial: "testimonial",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = Record<string, any>;

export const mapContentfulSections: SectionAdapter<FlexiblePageSection> = (
  sections
) =>
  sections.map((section): Section => {
    const raw = section as Raw;
    const type = CONTENTFUL_TYPE_MAP[section.__typename] ?? "unknown";

    if (type === "unknown") {
      return { id: section.sys.id, type, raw: section };
    }

    if (type === "heroBanner") {
      return {
        id: section.sys.id,
        type,
        heading: (raw.heading as string) ?? null,
        subheading: (raw.subheading as string) ?? null,
        primaryCtaLabel: (raw.primaryCtaLabel as string) ?? null,
        primaryCtaUrl: (raw.primaryCtaUrl as string) ?? null,
      };
    }

    if (type === "heroes") {
      const ctaItems: CtaEntry[] =
        (raw.ctasCollection?.items as CtaEntry[])?.filter(Boolean) ?? [];
      return {
        id: section.sys.id,
        type,
        frontEndComponent: (raw.frontEndComponent as string) ?? null,
        heading: (raw.heading as string) ?? null,
        subheading: (raw.subheading as string) ?? null,
        body: (raw.body as RichTextDocument) ?? null,
        image: (raw.image as ImageEntry) ?? null,
        ctas: ctaItems,
        backgroundImage: (raw.backgroundImage as ImageAsset) ?? null,
        palette: (raw.palette as string) ?? null,
      } satisfies HeroesSection;
    }

    return { id: section.sys.id, type } as Section;
  });
