import type { HeroesSection } from "@/lib/sections/types";
import { HeroDefault } from "./HeroDefault";

type HeroesProps = {
  section: HeroesSection;
};

export function Heroes({ section }: HeroesProps) {
  return <HeroDefault section={section} />;
}
