import type { HeroesSection } from "@/lib/sections/types";
import { HeroCarousel } from "./HomepageHero";

type HeroesProps = {
  section: HeroesSection;
};

export function Heroes({ section }: HeroesProps) {
  const frontEndComponent = section.frontEndComponent;

  if (frontEndComponent === "homepage-hero") {
    return <HeroCarousel slides={section.slides} />;
  }

  // default — render a simple static hero (first slide only)
  const slide = section.slides[0];
  if (!slide) return null;

  const bgUrl = slide.background?.__typename === "Image"
    ? slide.background.desktop?.url
    : null;

  return (
    <section
      className="relative flex min-h-[400px] items-center bg-darkest-grey bg-cover bg-center"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        {slide.heading && (
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {slide.heading}
          </h1>
        )}
      </div>
    </section>
  );
}
