import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Timeline } from "@/components/home/timeline";

export function HowItWorksSection() {
  return (
    <Section id="how" className="bg-sand py-[20vh]">
      <Reveal>
        <SectionHeading
          align="center"
          className="mb-[76px]"
          eyebrow="How it works"
          title={
            <>
              Three steps to <Highlight>the right teacher.</Highlight>
            </>
          }
        />
      </Reveal>

      <Timeline />
    </Section>
  );
}
