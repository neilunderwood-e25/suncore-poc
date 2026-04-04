import type { SectionDefinition } from "@/lib/sections/config";
import type { HeroesSection } from "@/lib/sections/types";
import { Heroes } from "./index";
import { HEROES_FRAGMENT, HEROES_FRAGMENT_NAME } from "./Heroes.fragment";
import { adaptHeroes } from "./Heroes.adapter";

export const heroesSection: SectionDefinition = {
  contentfulTypename: "Heroes",
  type: "heroes",
  fragment: HEROES_FRAGMENT,
  fragmentName: HEROES_FRAGMENT_NAME,
  adapt: adaptHeroes,
  render: (section) => <Heroes section={section as HeroesSection} />,
};
