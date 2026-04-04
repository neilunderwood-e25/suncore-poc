import type { HeroesSection } from "@/lib/sections/types";
import { HeroCarousel } from "./HeroCarousel";

type HeroesProps = {
  section: HeroesSection;
};

export function Heroes({ section }: HeroesProps) {
  return <HeroCarousel slides={section.slides} />;
}
