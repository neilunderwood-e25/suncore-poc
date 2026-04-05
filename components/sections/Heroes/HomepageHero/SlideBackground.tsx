"use client";

import { useRef, useEffect } from "react";
import type { HeroSlideBackground } from "@/lib/sections/types";

type SlideBackgroundProps = {
  background?: HeroSlideBackground | null;
  active: boolean;
  paused: boolean;
};

export function SlideBackground({ background, active, paused }: SlideBackgroundProps) {
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
