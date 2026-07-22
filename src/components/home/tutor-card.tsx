import type { CSSProperties, KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import type { StackDirection, Tutor } from "@/types/tutor";

interface TutorCardProps {
  tutor: Tutor;
  /** Position in the stack (0 = front). */
  position: number;
  isLeaving: boolean;
  direction?: StackDirection;
  /** Total number of cards (drives z-index). */
  count: number;
  onAdvance: () => void;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Stack transform per the source `layout()` / `advance()` maths. */
function cardStyle(
  position: number,
  isLeaving: boolean,
  direction: StackDirection | undefined,
  count: number,
): CSSProperties {
  if (isLeaving) {
    const flyRight = direction !== "prev";
    return {
      transform: `translate(${flyRight ? 520 : -520}px, -40px) rotate(${flyRight ? 18 : -18}deg)`,
      opacity: 0,
      zIndex: count,
    };
  }
  if (position === 0) {
    return { transform: "translate(0, 0) rotate(0deg)", opacity: 1, zIndex: count };
  }
  if (position < 4) {
    const offset = position * 16;
    return {
      transform: `translate(${offset}px, ${-offset * 0.5}px) rotate(${position * 1.2}deg)`,
      opacity: 1 - position * 0.18,
      zIndex: count - position,
    };
  }
  // Waiting off to the right, invisible, until it cycles back into view.
  return { transform: "translate(520px, -40px) rotate(18deg)", opacity: 0, zIndex: 0 };
}

export function TutorCard({
  tutor,
  position,
  isLeaving,
  direction,
  count,
  onAdvance,
}: TutorCardProps) {
  const isFront = position === 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onAdvance();
    }
  };

  return (
    <div
      style={cardStyle(position, isLeaving, direction, count)}
      onClick={isFront ? onAdvance : undefined}
      onKeyDown={isFront ? handleKeyDown : undefined}
      role={isFront ? "button" : undefined}
      tabIndex={isFront ? 0 : -1}
      aria-hidden={isFront ? undefined : true}
      className={cn(
        "absolute right-0 top-0 h-[440px] w-[380px] cursor-pointer overflow-hidden rounded-[20px] border border-line bg-sand text-left [box-shadow:0_30px_60px_-26px_rgba(24,24,24,0.24)] will-change-[transform,opacity] max-[900px]:h-[420px] max-[900px]:w-[88vw] max-[900px]:max-w-[380px]",
        isLeaving
          ? "[transition:transform_0.6s_cubic-bezier(0.4,0,0.2,1),opacity_0.6s_ease] motion-reduce:transition-none"
          : "[transition:transform_0.55s_cubic-bezier(0.16,0.7,0.2,1),opacity_0.5s_ease,box-shadow_0.5s_ease] motion-reduce:transition-none",
      )}
    >
      <div className="flex h-full flex-col px-8 py-[34px]">
        <div className="mb-[22px] flex items-center gap-[14px]">
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full font-serif text-[21px] font-bold text-white [background:linear-gradient(135deg,var(--color-slate),var(--color-slate-deep))] [box-shadow:0_10px_22px_-10px_rgba(46,58,115,0.5)]">
            {initialsOf(tutor.name)}
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded-[20px] bg-[rgba(46,58,115,0.09)] px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate">
              {tutor.subject}
            </span>
          </div>
          <span className="ml-auto whitespace-nowrap rounded-[20px] bg-gold px-[11px] py-[5px] text-[12.5px] font-bold tracking-[0.02em] text-white">
            ★ {tutor.rating}
          </span>
        </div>

        <h3 className="mb-[3px] font-serif text-[29px] font-semibold tracking-[-0.02em]">
          {tutor.name}
        </h3>
        <div className="text-[12.5px] tracking-[0.02em] text-muted">
          {tutor.experience}
        </div>
        <p className="mt-[18px] flex-1 border-t border-line pt-[18px] text-[14.5px] leading-[1.6] text-muted">
          {tutor.intro}
        </p>
        <span className="mt-[22px] inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
          View Profile →
        </span>
      </div>
    </div>
  );
}
