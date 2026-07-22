import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { StatCounter } from "@/components/home/stat-counter";
import { STATS } from "@/data/stats";

export function TrustStatsSection() {
  return (
    <Section id="trust" className="bg-ivory py-[19vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="Why parents trust us"
          title={
            <>
              Trust, shown — <Highlight>not just said.</Highlight>
            </>
          }
          description="We earn trust with process, not promises — every educator is checked before they are listed, and families stay close to every session."
        />
      </Reveal>

      <div className="grid grid-cols-4 gap-6 border-t border-line max-[820px]:grid-cols-2 max-[520px]:grid-cols-1">
        {STATS.map((stat, index) => (
          <StatCounter
            key={stat.id}
            stat={stat}
            delay={(index + 1) as RevealDelay}
          />
        ))}
      </div>
    </Section>
  );
}
