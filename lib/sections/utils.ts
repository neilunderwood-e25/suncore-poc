import type { CtaEntry } from "./types";

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
