import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TutorStack } from "@/components/home/tutor-stack";
import { loadEducatorRatings } from "@/lib/educators/directory";

/**
 * Async so the ratings on the featured cards are the API's, resolved on the
 * server. The stack itself stays a client island; this only hands it the numbers.
 */
export async function TutorsSection() {
  const ratings = await loadEducatorRatings();

  return (
    <Section id="tutors" className="overflow-hidden bg-ivory py-[17vh]">
      <TutorStack
        ratings={ratings}
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
