"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src: string;
  className?: string;
  /** Poster image shown before/while the video loads. */
  poster?: string;
}

/**
 * Decorative background video. Autoplay is driven by the HTML attributes;
 * the effect enforces `muted` and nudges `play()` to cover browsers that
 * ignore the SSR-rendered attribute (mirrors the source scripts).
 */
export function HeroVideo({ src, className, poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {
      /* autoplay may be blocked; ignore */
    });
  }, []);

  return (
    <video
      ref={ref}
      className={cn("block h-full w-full object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
