import type { HeroesSection, CtaEntry } from "@/lib/sections/types";
import { HeroDefault } from "./HeroDefault";

type HeroesProps = {
  section: HeroesSection;
};

const HERO_VARIANTS: Record<string, React.ComponentType<HeroesProps>> = {
  HeroDefault: HeroDefault,
  HeroBrand: HeroDefault,
  HeroMedia: HeroDefault,
  HeroVideo: HeroDefault,
  HeroForm: HeroDefault,
};

export function Heroes({ section }: HeroesProps) {
  const variant = section.frontEndComponent ?? "HeroDefault";
  const Component = HERO_VARIANTS[variant] ?? HeroDefault;
  return <Component section={section} />;
}

export function resolveCtaHref(cta: CtaEntry): string {
  if (cta.linkBehavior === "Downloadable" && cta.downloadableAsset?.url) {
    return cta.downloadableAsset.url;
  }
  if (cta.externalLink) {
    return cta.externalLink;
  }
  if (cta.internalLink?.slug) {
    return `/${cta.internalLink.slug}`;
  }
  return "#";
}
