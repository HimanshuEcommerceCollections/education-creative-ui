"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** Stop observing after the first intersection (default true). */
  once?: boolean;
}

/**
 * Observes an element and reports when it enters the viewport. Shared by the
 * scroll-reveal wrapper and the animated stat counters.
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0, rootMargin = "0px", once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => setInView(true);

    // Deep-links and scroll restoration can land the viewport below elements
    // that then never intersect; reveal anything already in or above the
    // viewport on mount so it can't stay stuck hidden.
    if (element.getBoundingClientRect().top < window.innerHeight) {
      reveal();
      if (once) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            if (once) {
              observer.disconnect();
              break;
            }
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
