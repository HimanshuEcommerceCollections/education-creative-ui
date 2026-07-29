import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";

import { ShieldIcon } from "./become-icons";

/**
 * Pointer to the full requirements page: a dark photo band with a gold spine,
 * the parent-supervision footnote, and a single CTA.
 */
export function RequirementsBand() {
  return (
    <Section className="bg-sand py-[12vh]">
      <Reveal>
        <div className="relative grid grid-cols-[1fr_auto] items-center gap-10 overflow-hidden rounded-[22px] border border-line bg-[#1b2350] px-12 py-11 shadow-[0_30px_60px_-46px_rgba(24,24,24,0.3)] max-[820px]:grid-cols-1 max-[820px]:gap-[26px] max-[820px]:px-[30px] max-[820px]:py-[34px] before:absolute before:inset-y-0 before:left-0 before:z-[2] before:w-[5px] before:bg-[linear-gradient(180deg,var(--slate),var(--gold))] before:content-['']">
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(100deg,rgba(15,16,22,0.9)_0%,rgba(17,18,24,0.74)_46%,rgba(20,22,28,0.44)_100%)] after:content-['']"
          >
            <Image
              src="/assets/become-a-tutor/images/requirements-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-[1]">
            <h3 className="mb-3 font-serif text-[clamp(21px,2.4vw,27px)] font-semibold leading-[1.2] tracking-[-0.01em] text-white">
              Wondering <Highlight tone="gold">what we look for?</Highlight>
            </h3>
            <p className="max-w-[60ch] text-[14.5px] leading-[1.6] text-[rgba(244,241,234,0.88)]">
              See the full details on qualifications, references, and the review process before you
              apply &mdash; so you know exactly what to expect at each step.
            </p>

            <p className="mt-4 flex max-w-[34ch] items-start gap-[11px] text-[12.5px] leading-[1.5] text-[rgba(244,241,234,0.82)]">
              <ShieldIcon className="mt-[2px] h-4 w-4 flex-none text-gold" />
              <span>
                For learners under 18, a parent or guardian books and supervises every session.
              </span>
            </p>
          </div>

          <div className="relative z-[1] flex flex-col items-start gap-[10px] max-[820px]:items-stretch">
            <Button href="/requirements" variant="primary">
              See the full requirements
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
