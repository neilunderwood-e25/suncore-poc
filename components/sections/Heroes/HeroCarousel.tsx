"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Document } from "@contentful/rich-text-types";
import type { HeroSlide } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

type HeroCarouselProps = {
  slides: HeroSlide[];
  autoplayInterval?: number;
};

export function HeroCarousel({
  slides,
  autoplayInterval = 6000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setProgress(0);
    },
    []
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % slides.length);
  }, [activeIndex, slides.length, goToSlide]);

  // Autoplay + progress
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const progressStep = 50; // ms
    const steps = autoplayInterval / progressStep;

    let currentStep = 0;

    progressRef.current = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
    }, progressStep);

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoplayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeIndex, isPaused, autoplayInterval, slides.length, nextSlide]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative w-full overflow-hidden bg-zinc-900" style={{ height: "85vh", minHeight: 500 }}>
      {/* Background images — all preloaded, only active one visible */}
      {slides.map((slide, i) => (
        <div
          key={slide.sys.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            backgroundImage: slide.backgroundImage?.url
              ? `url(${slide.backgroundImage.url})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content card */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div
            className="max-w-xl rounded-lg bg-zinc-800/85 p-8 backdrop-blur-sm lg:p-10"
          >
            {activeSlide?.heading && (
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {activeSlide.heading}
              </h1>
            )}

            {activeSlide?.description && (
              <RichTextRenderer
                document={activeSlide.description.json as Document}
                links={activeSlide.description.links}
                className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg"
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

      {/* Bottom bar — slide titles + progress */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="mx-auto flex max-w-7xl items-end px-6 lg:px-8">
            {slides.map((slide, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={slide.sys.id}
                  onClick={() => goToSlide(i)}
                  className="group relative flex-1 cursor-pointer border-none bg-transparent pb-6 pt-4 text-left"
                >
                  {/* Pause/Play button — positioned above the active slide's progress bar */}
                  {isActive && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPaused(!isPaused);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setIsPaused(!isPaused);
                        }
                      }}
                      className="absolute -top-6 right-0 flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
                      aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                    >
                      {isPaused ? (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
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
                        backgroundColor: isActive ? "#f59e0b" : "rgba(255,255,255,0.6)",
                        transitionDuration: isActive ? "50ms" : "300ms",
                      }}
                    />
                  </div>

                  {/* Slide title */}
                  <span
                    className={`block text-sm font-medium transition-colors sm:text-base ${
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
