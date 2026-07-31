import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { PARENT_PILLARS } from "@/data/for-parents";

import { PARENT_ICONS } from "./for-parents-icons";

/**
 * Peace of mind: four promise cards that lift on hover, their icon chip
 * inverting to solid slate as it tips.
 */
export function ParentPillars() {
  return (
    <Section className="bg-ivory pb-[5vh] pt-[11vh]">
      <Reveal>
        <SectionHeading
          className="mb-[60px]"
          align="center"
          eyebrow="Peace of Mind"
          title={
            <>
              Built around <Highlight>your family’s</Highlight> trust.
            </>
          }
          description="Four things we hold to on every booking — no fine print, no surprises."
        />
      </Reveal>

      <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {PARENT_PILLARS.map((pillar, index) => {
          const Icon = PARENT_ICONS[pillar.icon];
          return (
            <Reveal key={pillar.title} delay={(index + 1) as RevealDelay}>
              <div className="group h-full rounded-[18px] border border-line bg-white px-6 py-7 shadow-[0_24px_50px_-40px_rgba(24,24,24,0.3)] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[6px] hover:border-[rgba(46,58,115,0.24)] hover:shadow-[0_34px_66px_-34px_rgba(46,58,115,0.4)]">
                <span className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[var(--chip-a)] text-slate transition-[transform,background-color,color] duration-[450ms] ease-brand group-hover:-rotate-[4deg] group-hover:scale-[1.08] group-hover:bg-slate group-hover:text-white">
                  <Icon className="h-[25px] w-[25px]" />
                </span>

                <h3 className="mb-[9px] font-serif text-[17.5px] font-semibold tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted">{pillar.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
