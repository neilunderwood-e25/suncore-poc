import type { HeroesSection } from "@/lib/sections/types";
import { resolveCtaHref } from "@/lib/sections/utils";

type HeroDefaultProps = {
  section: HeroesSection;
};

const PALETTE_STYLES: Record<string, { bg: string; text: string; sub: string }> = {
  light: { bg: "bg-white", text: "text-zinc-900", sub: "text-zinc-600" },
  dark: { bg: "bg-zinc-900", text: "text-white", sub: "text-zinc-300" },
  brand: { bg: "bg-indigo-600", text: "text-white", sub: "text-indigo-100" },
};

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

export function HeroDefault({ section }: HeroDefaultProps) {
  const palette = PALETTE_STYLES[section.palette ?? "light"] ?? PALETTE_STYLES.light;
  const bgImageUrl = section.backgroundImage?.url;
  const image = section.image;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl ${palette.bg} ${!bgImageUrl ? "" : ""}`}
      style={
        bgImageUrl
          ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {bgImageUrl && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            {section.heading && (
              <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${bgImageUrl ? "text-white" : palette.text}`}>
                {section.heading}
              </h1>
            )}

            {section.subheading && (
              <p className={`mt-4 text-lg leading-relaxed ${bgImageUrl ? "text-white/80" : palette.sub}`}>
                {section.subheading}
              </p>
            )}

            {section.ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {section.ctas.map((cta) => {
                  const style = CTA_BUTTON_STYLES[cta.type ?? "Primary Button"] ?? CTA_BUTTON_STYLES["Primary Button"];
                  const isTextLink = cta.type?.includes("Text");
                  return (
                    <a
                      key={cta.sys.id}
                      href={resolveCtaHref(cta)}
                      target={cta.newTab ? "_blank" : undefined}
                      rel={cta.newTab ? "noopener noreferrer" : undefined}
                      download={cta.linkBehavior === "Downloadable" ? true : undefined}
                      className={`inline-flex items-center gap-2 ${
                        isTextLink ? "text-sm font-medium" : "rounded-lg px-6 py-3 text-sm font-semibold"
                      } transition-colors ${style}`}
                    >
                      {cta.label}
                      {cta.arrowEnable && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {image?.desktop?.url && (
            <div className="flex justify-center">
              <picture>
                {image.mobile?.url && (
                  <source media="(max-width: 767px)" srcSet={image.mobile.url} />
                )}
                <img
                  src={image.desktop.url}
                  alt={image.altText ?? ""}
                  width={image.desktop.width ?? undefined}
                  height={image.desktop.height ?? undefined}
                  className="max-w-full rounded-xl shadow-lg"
                />
              </picture>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
