"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ChevronIcon } from "@/components/common/icons";
import { Reveal } from "@/components/common/reveal";
import { TutorCard } from "@/components/home/tutor-card";
import { TUTORS } from "@/data/tutors";
import type { EducatorRating } from "@/lib/educators/rating";
import { cn } from "@/lib/utils";
import type { StackDirection } from "@/types/tutor";

/** Matches the source's post-fly-out reorder delay. */
const ADVANCE_MS = 560;

interface LeavingState {
  index: number;
  direction: StackDirection;
}

function StackButton({
  direction,
  label,
  onClick,
}: {
  direction: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white transition-[background-color,border-color] duration-300 hover:border-[rgba(46,58,115,0.3)] hover:bg-sand"
    >
      <ChevronIcon
        direction={direction}
        className="h-[18px] w-[18px] fill-none stroke-ink stroke-[1.6]"
      />
    </button>
  );
}

interface TutorStackProps {
  heading: ReactNode;
  /**
   * Published ratings by educator slug (a tutor's `id`), resolved on the server
   * by the section above. Sparse on purpose: an id that isn't here has no
   * published reviews, and its card carries no rating badge.
   */
  ratings?: Record<string, EducatorRating>;
}

/**
 * Card-stack of featured educators. Owns the stack order and the transient
 * "leaving" card so the controls (left column) and cards (right column) stay
 * in sync; the static heading is passed in from the server section.
 */
export function TutorStack({ heading, ratings = {} }: TutorStackProps) {
  const count = TUTORS.length;
  const [order, setOrder] = useState<number[]>(() =>
    TUTORS.map((_, index) => index),
  );
  const [leaving, setLeaving] = useState<LeavingState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const advance = (direction: StackDirection) => {
    if (leaving) return;
    setLeaving({ index: order[0], direction });
    timeoutRef.current = window.setTimeout(() => {
      setOrder((prev) =>
        direction === "next"
          ? [...prev.slice(1), prev[0]]
          : [prev[prev.length - 1], ...prev.slice(0, -1)],
      );
      setLeaving(null);
      timeoutRef.current = null;
    }, ADVANCE_MS);
  };

  const frontIndex = order[0];

  return (
    <div className="grid grid-cols-2 items-center gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-[10px]">
      <div className="max-w-[460px] max-[900px]:max-w-none">
        {heading}

        <Reveal className="mt-[26px] flex items-center gap-[18px]">
          <StackButton
            direction="left"
            label="Previous educator"
            onClick={() => advance("prev")}
          />
          <StackButton
            direction="right"
            label="Next educator"
            onClick={() => advance("next")}
          />
          <div aria-hidden="true" className="flex gap-[7px]">
            {TUTORS.map((tutor, index) => (
              <span
                key={tutor.id}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-300",
                  index === frontIndex ? "scale-[1.3] bg-gold" : "bg-line",
                )}
              />
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-4">
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">
            Click a card to see the next educator
          </p>
        </Reveal>
      </div>

      <Reveal className="relative flex h-[480px] items-center justify-center max-[900px]:h-auto max-[900px]:py-5">
        <div className="relative h-[440px] w-[380px] max-[900px]:h-[420px] max-[900px]:w-[88vw] max-[900px]:max-w-[380px]">
          {TUTORS.map((tutor, index) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              rating={ratings[tutor.id]}
              position={order.indexOf(index)}
              isLeaving={leaving?.index === index}
              direction={leaving?.direction}
              count={count}
              onAdvance={() => advance("next")}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
