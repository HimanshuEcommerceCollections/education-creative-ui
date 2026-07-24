import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Timeline } from "@/components/home/timeline";
import { Button } from "@/components/ui/button";

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

      <Reveal delay={1}>
        <div className="mt-16 flex justify-center">
          <Button href="/how-it-works" variant="secondary">
            See the full process
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
