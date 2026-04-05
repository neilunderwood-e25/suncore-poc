"use client";

import type { Document } from "@contentful/rich-text-types";
import type { HeroSlide } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { RichTextRenderer } from "@/components/common/RichText/RichText";
import { SlideBackground } from "./SlideBackground";

type MobileHeroProps = {
  slides: HeroSlide[];
  activeIndex: number;
  isPaused: boolean;
  goToSlide: (index: number) => void;
  togglePause: () => void;
};

export function MobileHero({
  slides,
  activeIndex,
  isPaused,
  goToSlide,
  togglePause,
}: MobileHeroProps) {
  const activeSlide = slides[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-darkest-grey"
      style={{ height: "calc(100vh - 9.25rem)", minHeight: 500 }}
    >
      {/* Background media */}
      {slides.map((slide, i) => (
        <SlideBackground
          key={slide.sys.id}
          background={slide.background}
          active={i === activeIndex}
          paused={isPaused}
        />
      ))}

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content card — bottom-aligned */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-4 pb-[100px]">
        <div className="bg-midnight/90 p-6 backdrop-blur-sm">
          {activeSlide?.heading && (
            <h1 className="text-xl font-bold leading-tight text-white">
              {activeSlide.heading}
            </h1>
          )}

          {activeSlide?.description && (
            <RichTextRenderer
              document={activeSlide.description.json as Document}
              links={activeSlide.description.links}
              className="mt-3 text-sm leading-relaxed text-zinc-300"
            />
          )}

          {activeSlide?.cta && (
            <div className="mt-4">
              <Cta cta={activeSlide.cta} />
            </div>
          )}
        </div>

        {/* Dots + pause — below the card */}
        {slides.length > 1 && (
          <div className="relative mt-[32px] flex items-center px-2">
            {/* Dot indicators — centered */}
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.sys.id}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={`h-3 w-3 rounded-full border-none transition-colors ${
                    i === activeIndex ? "bg-gold" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Pause/play */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePause();
              }}
              className="relative z-10 ml-auto shrink-0 p-2 text-white/70 transition-colors hover:text-white"
              aria-label={isPaused ? "Play carousel" : "Pause carousel"}
            >
              {isPaused ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
