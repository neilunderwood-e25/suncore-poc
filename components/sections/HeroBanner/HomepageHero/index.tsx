"use client";

import { useState, useEffect } from "react";
import type { HeroSlide } from "@/lib/sections/types";
import { useCarousel } from "./useCarousel";
import { DesktopHero } from "./DesktopHero";
import { MobileHero } from "./MobileHero";

type HeroCarouselProps = {
  slides: HeroSlide[];
  autoplayInterval?: number;
};

const BREAKPOINT = 1024;

export function HeroCarousel({
  slides,
  autoplayInterval = 6000,
}: HeroCarouselProps) {
  const [isMobile, setIsMobile] = useState(false);
  const carousel = useCarousel(slides.length, autoplayInterval);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!slides.length) return null;

  if (isMobile) {
    return (
      <MobileHero
        slides={slides}
        activeIndex={carousel.activeIndex}
        isPaused={carousel.isPaused}
        goToSlide={carousel.goToSlide}
        togglePause={carousel.togglePause}
      />
    );
  }

  return (
    <DesktopHero
      slides={slides}
      activeIndex={carousel.activeIndex}
      progress={carousel.progress}
      isPaused={carousel.isPaused}
      goToSlide={carousel.goToSlide}
      togglePause={carousel.togglePause}
    />
  );
}
