import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { CheckIcon } from "./booking-icons";

interface BookingStepProps {
  /** Displayed number. Passed in rather than counted so the numbering stays
   * stable when a conditional step (the in-home address) appears. */
  step: number;
  title: string;
  description?: ReactNode;
  /** Renders the filled marker and tick. */
  complete: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * One numbered card in the booking flow — the source's `.step` / `.stepHd`.
 *
 * The completion tick is announced, not just drawn: the source conveyed progress
 * purely through an SVG appearing and a background color changing, which is
 * invisible to a screen reader working down the form. Here the state rides on the
 * section's accessible name, so "Step 3, Preferred date and time, complete" comes
 * out of the same markup that draws the tick.
 */
export function BookingStep({
  step,
  title,
  description,
  complete,
  children,
  className,
}: BookingStepProps) {
  const headingId = `booking-step-${step}-title`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "mb-5 rounded-[20px] border border-line bg-white px-7 pb-[30px] pt-7 shadow-[0_24px_50px_-44px_rgba(24,24,24,0.3)] max-[560px]:px-5",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-[13px]">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full font-serif text-[14px] font-bold transition-colors duration-300",
            complete ? "bg-slate text-white" : "bg-[var(--chip-a)] text-slate",
          )}
        >
          {step}
        </span>

        <h2
          id={headingId}
          className="font-serif text-[18px] font-semibold tracking-[-0.01em]"
        >
          <span className="sr-only">Step {step}: </span>
          {title}
          {complete ? <span className="sr-only"> — complete</span> : null}
        </h2>

        <span
          aria-hidden="true"
          className={cn(
            "ml-auto text-slate transition-opacity duration-300",
            complete ? "opacity-100" : "opacity-0",
          )}
        >
          <CheckIcon className="h-5 w-5" />
        </span>
      </div>

      {description ? (
        <p className="mb-5 -mt-2 text-[13.5px] leading-[1.55] text-muted">{description}</p>
      ) : null}

      {children}
    </section>
  );
}
