import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TutorStack } from "@/components/home/tutor-stack";

export function TutorsSection() {
  return (
    <Section id="tutors" className="overflow-hidden bg-ivory py-[17vh]">
      <TutorStack
        heading={
          <Reveal>
            <SectionHeading
              className="mb-9"
              eyebrow="Featured educators"
              title={
                <>
                  Meet a few of <Highlight>the people.</Highlight>
                </>
              }
              description="A small sample of the independent educators families are booking right now. [Sample profiles.]"
            />
          </Reveal>
        }
      />
    </Section>
  );
}
