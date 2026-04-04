import type { FlexiblePageSection } from "@/lib/contentful/pages";
import type { Section, UnknownSection } from "@/lib/sections/types";
import type { RawSection } from "@/lib/sections/config";
import { sectionRegistry } from "@/components/sections/registry";

export const mapContentfulSections = (
  sections: FlexiblePageSection[]
): Section[] =>
  sections.map((section): Section => {
    const config = sectionRegistry.find(
      (s) => s.contentfulTypename === section.__typename
    );

    if (!config) {
      return {
        id: section.sys.id,
        type: "unknown",
        raw: section,
      } satisfies UnknownSection;
    }

    return config.adapt(section as unknown as RawSection);
  });
