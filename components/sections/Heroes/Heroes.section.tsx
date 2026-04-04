import type { SectionDefinition } from "@/lib/sections/config";
import type { HeroesSection } from "@/lib/sections/types";
import { Heroes } from "./index";
import { adaptHeroes } from "./Heroes.adapter";

export const heroesSection: SectionDefinition = {
  contentfulTypename: "Heroes",
  type: "heroes",
  adapt: adaptHeroes,
  render: (section) => <Heroes section={section as HeroesSection} />,
};
