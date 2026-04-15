import type { SectionDefinition } from "./config";
import { heroesSection } from "./definitions/heroes";
import { stockTickerSection } from "./definitions/stockTicker";
import { cardsSection } from "./definitions/cards";
import { newsAndStoriesSection } from "./definitions/newsAndStories";
import { newsReleasesListingSection } from "./definitions/newsReleasesListing";

/**
 * Central section registry.
 *
 * To add a new section:
 *   1. Create components/sections/YourSection/ with the component
 *   2. Create lib/sections/definitions/yourSection.tsx with hydrate + render
 *   3. Import and add the section definition here
 */
export const sectionRegistry: SectionDefinition[] = [
  heroesSection,
  stockTickerSection,
  cardsSection,
  newsAndStoriesSection,
  newsReleasesListingSection,
];
