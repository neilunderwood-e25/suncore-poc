"use client";

import type { Document } from "@contentful/rich-text-types";
import type { HeroSlide } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { RichTextRenderer } from "@/components/common/RichText/RichText";
import { SlideBackground } from "./SlideBackground";

type DesktopHeroProps = {
  slides: HeroSlide[];
  activeIndex: number;
  progress: number;
  isPaused: boolean;
  goToSlide: (index: number) => void;
  togglePause: () => void;
};

export function DesktopHero({
  slides,
  activeIndex,
  progress,
  isPaused,
  goToSlide,
  togglePause,
}: DesktopHeroProps) {
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-transparent" />

      {/* Top dark gradient */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-50 bg-gradient-to-b from-black/90 to-transparent" />

      {/* Bottom dark gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Content card */}
      <div
        className="absolute left-0 z-10 w-full px-6 xl:px-8"
        style={{ top: 100 }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-[520px] bg-midnight p-8 lg:p-10 xl:max-w-[672px] xl:p-[56px] xl:-ml-5">
            {activeSlide?.heading && (
              <h1 className="text-[28px] font-bold leading-snug text-white lg:text-[32px] xl:text-[40px]">
                {activeSlide.heading}
              </h1>
            )}

            {activeSlide?.description && (
              <RichTextRenderer
                document={activeSlide.description.json as Document}
                links={activeSlide.description.links}
                className="mt-4 text-base leading-relaxed text-white xl:text-[18px] font-semibold"
              />
            )}

            {activeSlide?.cta && (
              <div className="mt-6">
                <Cta cta={activeSlide.cta} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav — progress bars + titles */}
      {slides.length > 1 && (
        <div className="absolute bottom-[40px] left-0 right-0 z-20">
          <div className="mx-auto flex w-full max-w-7xl items-start gap-6 px-6 lg:gap-8 xl:gap-[32px]">
            {slides.map((slide, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={slide.sys.id}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className="group relative flex-1 cursor-pointer border-none bg-transparent pb-6 pt-4 text-left"
                >
                  {/* Pause/Play above active progress bar */}
                  {isActive && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePause();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          togglePause();
                        }
                      }}
                      className="absolute -top-4 -left-2 text-white/70 transition-colors hover:text-white"
                      aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                    >
                      {isPaused ? (
                        <svg className="h-[24px] w-[24px]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="h-[24px] w-[24px]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      )}
                    </span>
                  )}

                  {/* Progress bar */}
                  <div className="mb-3 h-0.5 w-full overflow-hidden bg-white/30">
                    <div
                      className="h-full transition-all ease-linear"
                      style={{
                        width: isActive ? `${progress}%` : i < activeIndex ? "100%" : "0%",
                        backgroundColor: isActive ? "#f0a525ff" : "rgba(255,255,255,0.6)",
                        transitionDuration: isActive ? "50ms" : "300ms",
                      }}
                    />
                  </div>

                  {/* Slide title */}
                  <span
                    className={`block text-base font-semibold transition-colors lg:text-lg xl:text-[22px] ${
                      isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                    }`}
                  >
                    {slide.heading}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
