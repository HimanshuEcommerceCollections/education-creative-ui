import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { REQUIREMENTS } from "@/data/requirements";

import { CheckIcon } from "./requirements-icons";

/** The essentials: a two-column checklist of what we ask for before a review. */
export function RequirementsChecklist() {
  return (
    <Section className="bg-ivory py-[11vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="The essentials"
          title={
            <>
              What you&rsquo;ll <Highlight>need</Highlight>
            </>
          }
          description={
            <>
              A short, honest checklist. Meeting these doesn&rsquo;t guarantee a spot &mdash;
              it&rsquo;s what lets us start a review and helps families understand who
              they&rsquo;re working with.
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
        {REQUIREMENTS.map((item, index) => (
          <Reveal key={item.title} delay={(index + 1) as RevealDelay}>
            <div className="group flex h-full items-start gap-[18px] rounded-[18px] border border-line bg-white px-7 py-[26px] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-1 hover:border-[rgba(46,58,115,0.28)] hover:shadow-[0_22px_46px_-26px_rgba(46,58,115,0.4)]">
              <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[12px] bg-[var(--chip-a)] text-slate transition-[background-color,color] duration-[400ms] group-hover:bg-slate group-hover:text-white">
                <CheckIcon className="h-[22px] w-[22px]" />
              </span>
              <div>
                <h3 className="mb-[6px] font-serif text-[18px] font-semibold leading-[1.25] tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-muted">{item.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
