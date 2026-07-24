import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";

interface TimelineStepProps {
  step: Step;
  /** When true the thumbnail sits on the right (source's alternating layout). */
  reversed: boolean;
}

/** One row of the timeline: large background numeral, thumbnail, and copy. */
export function TimelineStep({ step, reversed }: TimelineStepProps) {
  return (
    <div className="group relative grid grid-cols-2 items-center gap-[70px] py-[11vh] max-[820px]:grid-cols-1 max-[820px]:gap-7 max-[820px]:py-[8vh] max-[820px]:pl-[52px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(120px,17vw,260px)] font-medium leading-none text-[rgba(46,58,115,0.07)] max-[820px]:left-[22px] max-[820px]:text-[110px]"
      >
        {step.number}
      </span>

      <div
        className={cn(
          "relative z-[1] aspect-[4/5] max-h-[56vh] w-full overflow-hidden rounded-[12px] bg-ivory shadow-[0_34px_70px_-30px_rgba(24,24,24,0.4)] max-[820px]:aspect-[16/10] max-[820px]:max-h-none",
          reversed && "order-2 max-[820px]:order-none",
        )}
      >
        <Image
          src={step.image.src}
          alt={step.image.alt}
          fill
          sizes="(max-width: 820px) 100vw, (max-width: 1040px) 50vw, 485px"
          className="object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.05]"
        />
      </div>

      <div className="relative z-[1]">
        <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-gold">
          {step.chapter}
        </div>
        <h3 className="mb-[14px] font-serif text-[clamp(32px,3.6vw,56px)] font-medium leading-[1.02] tracking-[-0.015em]">
          {step.title}
        </h3>
        <p className="max-w-[38ch] text-[17px] leading-[1.7] text-muted">
          {step.description}
        </p>
      </div>
    </div>
  );
}
