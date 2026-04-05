"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useCarousel(slideCount: number, autoplayInterval = 6000) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % slideCount);
  }, [activeIndex, slideCount, goToSlide]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

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
  }, [activeIndex, isPaused, autoplayInterval, slideCount, nextSlide]);

  return { activeIndex, progress, isPaused, goToSlide, togglePause };
}
