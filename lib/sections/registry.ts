import type { SectionDefinition } from "./config";
import { heroesSection } from "./definitions/heroes";

/**
 * Central section registry.
 *
 * To add a new section:
 *   1. Create components/sections/YourSection/ with component, .section.tsx, and client component
 *   2. Import and add the section definition here
 */
export const sectionRegistry: SectionDefinition[] = [
  heroesSection,
];
