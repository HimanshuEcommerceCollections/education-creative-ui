import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { WHAT_TO_EXPECT } from "@/data/contact";

import { EXPECT_ICONS } from "./contact-icons";

/** Three reassurance cards describing what happens after a message is sent. */
export function WhatToExpect() {
  return (
    <Section className="bg-ivory pb-[13vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          align="center"
          eyebrow="What to expect"
          title={
            <>
              A calm, human <Highlight>reply.</Highlight>
            </>
          }
          description="No bots, no pressure. Here is how a message to us usually goes."
        />
      </Reveal>

      <div className="grid grid-cols-3 gap-6 max-[820px]:grid-cols-1">
        {WHAT_TO_EXPECT.map((card, index) => {
          const Icon = EXPECT_ICONS[card.icon];
          return (
            <Reveal key={card.title} delay={(index + 1) as RevealDelay}>
              <div className="h-full rounded-[20px] border border-line bg-white p-8 transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-[6px] hover:shadow-[0_28px_56px_-34px_rgba(22,24,29,0.42)]">
                <div className="mb-[18px] flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--chip-a)] text-slate">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-[18.5px] font-semibold tracking-[-0.01em]">
                  {card.title}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-muted">{card.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
