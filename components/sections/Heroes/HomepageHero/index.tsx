"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Document } from "@contentful/rich-text-types";
import type { HeroSlide, HeroSlideBackground } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

function SlideBackground({
  background,
  active,
  paused,
}: {
  background?: HeroSlideBackground | null;
  active: boolean;
  paused: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active && !paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [active, paused]);

  if (!background) return null;

  const baseClass = "absolute inset-0 transition-opacity duration-700 ease-in-out";

  if (background.__typename === "Video") {
    const src = background.desktop?.url;
    return (
      <div className={baseClass} style={{ opacity: active ? 1 : 0 }}>
        {active && src && (
          <video
            ref={videoRef}
            src={src}
            autoPlay={!paused}
            loop
            muted
            playsInline
            poster={background.posterImage?.url ?? undefined}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    );
  }

  // Image background
  const url = background.desktop?.url;
  return (
    <div
      className={baseClass}
      style={{
        opacity: active ? 1 : 0,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden={!active}
    />
  );
}

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

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const progressStep = 50;
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

      {/* ============================================================ */}
      {/*  DESKTOP content card — absolute top:146px (hidden < 1024px) */}
      {/* ============================================================ */}
      <div
        className="absolute left-0 z-10 hidden w-full px-6 lg:block lg:px-8"
        style={{ top: 146 }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-[672px] bg-midnight p-8 lg:p-[56px] lg:-ml-6">
            {activeSlide?.heading && (
              <h1 className="text-[40px] font-bold leading-tight text-white">
                {activeSlide.heading}
              </h1>
            )}

            {activeSlide?.description && (
              <RichTextRenderer
                document={activeSlide.description.json as Document}
                links={activeSlide.description.links}
                className="mt-4 text-base leading-relaxed text-zinc-300"
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

      {/* ============================================================ */}
      {/*  MOBILE content card — bottom-aligned (hidden >= 1024px)      */}
      {/* ============================================================ */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-4 pb-[100px] lg:hidden">
        {/* Card */}
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
            {/* Dot indicators — absolute centered */}
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.sys.id}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={`h-3 w-3 rounded-full border-none transition-colors ${
                    i === activeIndex
                      ? "bg-gold"
                      : "bg-white/50"
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
                setIsPaused((prev) => !prev);
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

      {/* ============================================================ */}
      {/*  DESKTOP bottom nav — progress bars + titles (hidden < 1024px) */}
      {/* ============================================================ */}
      {slides.length > 1 && (
        <div className="absolute bottom-[40px] left-0 right-0 z-20 hidden lg:block">
          <div className="mx-auto flex max-w-7xl gap-[32px] items-start px-6 lg:px-8">
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
                        setIsPaused(!isPaused);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setIsPaused(!isPaused);
                        }
                      }}
                      className="absolute -top-6 left-0 text-white/70 transition-colors hover:text-white"
                      aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                    >
                      {isPaused ? (
                        <svg className="h-[34px] w-[30px]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="h-[34px] w-[30px]" fill="currentColor" viewBox="0 0 24 24">
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
                    className={`block text-[22px] font-bold transition-colors ${
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
