import { Section } from "@/components/common/section";
import { SubjectStatItem } from "@/components/subject/subject-stat-item";
import type { RevealDelay } from "@/lib/reveal";
import type { SubjectStat } from "@/types/subject-page";

export function SubjectStats({ stats }: { stats: SubjectStat[] }) {
  return (
    <Section className="py-[12vh]">
      <div className="grid max-w-[900px] grid-cols-3 border-t border-line max-[640px]:grid-cols-1">
        {stats.map((stat, index) => (
          <SubjectStatItem
            key={stat.id}
            stat={stat}
            delay={(index + 1) as RevealDelay}
          />
        ))}
      </div>
    </Section>
  );
}
