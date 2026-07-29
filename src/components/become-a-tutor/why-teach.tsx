import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TEACH_BENEFITS } from "@/data/become-a-tutor";

import { TEACH_BENEFIT_ICONS } from "./become-icons";

/**
 * Why teach with us: four benefit cards that reveal a slate-to-gold spine on
 * hover, over a soft ivory-to-sand wash.
 */
export function WhyTeach() {
  return (
    <Section className="bg-[linear-gradient(180deg,var(--ivory),#EFEDE7)] pb-[15vh] pt-[14vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="Why Teach With Us"
          title={
            <>
              Built around <Highlight>independent educators.</Highlight>
            </>
          }
          description="You stay in control of your teaching. We handle the parts that pull you away from it."
        />
      </Reveal>

      <div className="grid grid-cols-4 gap-[22px] max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
        {TEACH_BENEFITS.map((benefit, index) => {
          const Icon = TEACH_BENEFIT_ICONS[benefit.icon];
          return (
            <Reveal key={benefit.title} delay={(index + 1) as RevealDelay}>
              <div
                className={
                  "group relative h-full overflow-hidden rounded-[18px] border border-line bg-white px-[30px] pb-[34px] pt-8 " +
                  "shadow-[0_24px_50px_-40px_rgba(24,24,24,0.3)] transition-[transform,box-shadow,border-color] duration-500 ease-brand " +
                  "hover:-translate-y-2 hover:border-[rgba(210,162,65,0.4)] hover:shadow-[0_40px_72px_-34px_rgba(24,24,24,0.36)] " +
                  "before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-top before:scale-y-0 before:bg-[linear-gradient(180deg,var(--slate),var(--gold))] before:transition-transform before:duration-500 before:ease-brand before:content-[''] group-hover:before:scale-y-100"
                }
              >
                <span className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] border border-[rgba(46,58,115,0.14)] bg-[rgba(46,58,115,0.08)] text-slate transition-transform duration-500 ease-brand group-hover:-rotate-[4deg] group-hover:scale-[1.08]">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mb-[10px] font-serif text-[19px] font-semibold leading-[1.2] tracking-[-0.005em]">
                  {benefit.title}
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted">{benefit.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
