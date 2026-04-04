import type { Section, HeroesSection } from "@/lib/sections/types";

import { createSectionRegistry } from "@/lib/sections/registry";
import { Heroes } from "@/components/sections/Heroes";

const SectionRegistry = createSectionRegistry({
  heroes: ({ section }) => <Heroes section={section as HeroesSection} />,
});

type SectionsRendererProps = {
  sections: Section[];
};

export const SectionsRenderer = ({ sections }: SectionsRendererProps) => {
  if (!sections.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const Renderer = SectionRegistry[section.type];
        if (!Renderer) return null;
        return <Renderer key={section.id} section={section} />;
      })}
    </div>
  );
};
