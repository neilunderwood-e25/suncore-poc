import type { CtaEntry } from "@/lib/sections/types";
import { resolveCtaHref } from "@/lib/sections/utils";

const CTA_BUTTON_STYLES: Record<string, string> = {
  "Primary Button":
    "bg-indigo-600 text-white hover:bg-indigo-700",
  "Secondary Button":
    "bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50",
  "Light Button":
    "bg-white/20 text-white border border-white/30 hover:bg-white/30",
  "Dark Button":
    "bg-zinc-900 text-white hover:bg-zinc-800",
  "Primary Text":
    "text-indigo-600 underline-offset-4 hover:underline",
  "Secondary Text":
    "text-zinc-600 underline-offset-4 hover:underline",
  "Light Text":
    "text-white underline-offset-4 hover:underline",
  "Dark Text":
    "text-zinc-900 underline-offset-4 hover:underline",
};

type CtaProps = {
  cta: CtaEntry;
  className?: string;
};

export function Cta({ cta, className }: CtaProps) {
  const style =
    CTA_BUTTON_STYLES[cta.type ?? "Primary Button"] ??
    CTA_BUTTON_STYLES["Primary Button"];
  const isTextLink = cta.type?.includes("Text");

  return (
    <a
      href={resolveCtaHref(cta)}
      target={cta.newTab ? "_blank" : undefined}
      rel={cta.newTab ? "noopener noreferrer" : undefined}
      download={cta.linkBehavior === "Downloadable" ? true : undefined}
      className={`inline-flex items-center gap-2 ${
        isTextLink
          ? "text-sm font-medium"
          : "rounded-lg px-6 py-3 text-sm font-semibold"
      } transition-colors ${style} ${className ?? ""}`}
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
