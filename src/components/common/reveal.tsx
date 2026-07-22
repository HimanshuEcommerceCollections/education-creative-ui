"use client";

import type { ElementType, ReactNode } from "react";

import { useInView } from "@/hooks/use-in-view";
import { revealClassName, type RevealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";

export type { RevealDelay };

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: RevealDelay;
  /** Element to render (defaults to div); lets Reveal *be* the styled node. */
  as?: ElementType;
}

/**
 * Scroll-triggered fade-up reproducing the source `.reveal` behavior. Reduced
 * motion shows content instantly (see `motion-reduce:transition-none`).
 */
export function Reveal({ children, className, delay, as: Tag = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({
    rootMargin: "0px 0px -8% 0px",
  });

  return (
    <Tag ref={ref} className={cn(revealClassName(inView, delay), className)}>
      {children}
    </Tag>
  );
}
