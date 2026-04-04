import type { HeroesSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

type HeroDefaultProps = {
  section: HeroesSection;
};

const PALETTE_STYLES: Record<string, { bg: string; text: string; sub: string }> = {
  light: { bg: "bg-white", text: "text-zinc-900", sub: "text-zinc-600" },
  dark: { bg: "bg-zinc-900", text: "text-white", sub: "text-zinc-300" },
  brand: { bg: "bg-indigo-600", text: "text-white", sub: "text-indigo-100" },
};

export function HeroDefault({ section }: HeroDefaultProps) {
  const palette = PALETTE_STYLES[section.palette ?? "light"] ?? PALETTE_STYLES.light;
  const bgImageUrl = section.backgroundImage?.url;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl ${palette.bg}`}
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
                {section.ctas.map((cta) => (
                  <Cta key={cta.sys.id} cta={cta} />
                ))}
              </div>
            )}
          </div>

          {section.image && (
            <div className="flex justify-center">
              <ResponsiveImage
                image={section.image}
                className="max-w-full rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
