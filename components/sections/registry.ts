import type { SectionDefinition } from "@/lib/sections/config";
import { heroesSection } from "./Heroes/Heroes.section";

/**
 * Central section registry.
 *
 * To add a new section:
 *   1. Create components/sections/YourSection/ with component, adapter, fragment, and .section.tsx
 *   2. Import and add the section definition here
 */
export const sectionRegistry: SectionDefinition[] = [
  heroesSection,
];
