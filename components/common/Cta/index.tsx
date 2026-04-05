import type { CtaEntry } from "@/lib/sections/types";
import { resolveCtaHref } from "@/lib/sections/utils";

const CTA_STYLES: Record<string, string> = {
  "Primary Button":
    "bg-midnight text-white hover:bg-midnight-95",
  "Secondary Button":
    "bg-gold text-darkest-grey hover:bg-gold-95",
  "Outline Button":
    "bg-transparent text-white border border-white hover:bg-white hover:text-midnight",
};

type CtaProps = {
  cta: CtaEntry;
  className?: string;
};

export function Cta({ cta, className }: CtaProps) {
  const style =
    CTA_STYLES[cta.type ?? "Primary Button"] ??
    CTA_STYLES["Primary Button"];

  return (
    <a
      href={resolveCtaHref(cta)}
      target={cta.newTab ? "_blank" : undefined}
      rel={cta.newTab ? "noopener noreferrer" : undefined}
      download={cta.linkBehavior === "Downloadable" ? true : undefined}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${style} ${className ?? ""}`}
    >
      {cta.label}
      {cta.arrowEnable && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      )}
    </a>
  );
}
