import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

import { SupportTopicGrid } from "./support-topic-grid";

/** "Browse topics": the section heading above the searchable topic grid. */
export function SupportTopics() {
  return (
    <Section className="bg-ivory py-24">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="Browse topics"
          title={
            <>
              Find your <Highlight>answer</Highlight> faster.
            </>
          }
          description="Pick a category to jump into the most common questions from families and educators."
        />
      </Reveal>

      <SupportTopicGrid />
    </Section>
  );
}
