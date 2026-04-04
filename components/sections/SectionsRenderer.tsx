import type { Section } from "@/lib/sections/types";
import { sectionRegistry } from "./registry";

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
        const config = sectionRegistry.find((s) => s.type === section.type);
        if (!config) return null;
        return (
          <div key={section.id}>{config.render(section)}</div>
        );
      })}
    </div>
  );
};
