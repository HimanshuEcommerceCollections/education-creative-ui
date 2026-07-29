import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

import { ApplyForm } from "./apply-form";
import { ShieldCheckIcon } from "./become-icons";

/** The application block: a short framing aside beside the form card. */
export function ApplySection() {
  return (
    <Section id="apply" className="bg-ivory py-[15vh]">
      <div className="grid grid-cols-[0.9fr_1.1fr] items-start gap-14 max-[920px]:grid-cols-1 max-[920px]:gap-9">
        <div>
          <Reveal>
            <SectionHeading
              className="mb-7"
              eyebrow="Apply"
              title={
                <>
                  Tell us about <Highlight>your teaching.</Highlight>
                </>
              }
              description="A short application to get started. It only takes a few minutes."
            />
          </Reveal>

          <Reveal delay={2}>
            <p className="flex items-start gap-[14px] rounded-[12px] border border-l-[3px] border-line border-l-gold bg-white px-6 py-5 text-[14px] leading-[1.6] text-ink">
              <ShieldCheckIcon className="mt-px h-[22px] w-[22px] flex-none text-slate" />
              <span>
                Every educator&rsquo;s credentials are reviewed before their profile is listed.
              </span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <ApplyForm />
        </Reveal>
      </div>
    </Section>
  );
}
