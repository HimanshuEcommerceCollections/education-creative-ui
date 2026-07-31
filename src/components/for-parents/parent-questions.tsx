"use client";

import { useState } from "react";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { FaqQuestion } from "@/components/faq/faq-question";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/data/faq";
import { PARENT_FAQ_IDS } from "@/data/for-parents";

/**
 * The questions families ask first: the shared FAQ accordion fed a curated
 * slice of FAQ_ITEMS, so the copy stays single-sourced with the FAQ page.
 */
const PARENT_QUESTIONS = PARENT_FAQ_IDS.map((id) => {
  const item = FAQ_ITEMS.find((faqItem) => faqItem.id === id);
  if (!item) throw new Error(`PARENT_FAQ_IDS references unknown FAQ item "${id}"`);
  return item;
});

export function ParentQuestions() {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((open) => {
      const next = new Set(open);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <Section className="bg-sand py-[13vh]">
      <Reveal>
        <SectionHeading
          className="mb-[60px]"
          align="center"
          eyebrow="Parent Questions"
          title={
            <>
              The things families <Highlight>ask first.</Highlight>
            </>
          }
        />
      </Reveal>

      <div className="mx-auto max-w-[840px]">
        {PARENT_QUESTIONS.map((item, index) => (
          <Reveal key={item.id} delay={((index % 6) + 1) as RevealDelay}>
            <FaqQuestion
              item={item}
              open={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-[34px] text-center">
          <Button href="/faq" variant="outline">
            See all FAQs
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
