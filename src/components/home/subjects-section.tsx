import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Marquee } from "@/components/common/marquee";
import { SubjectTile } from "@/components/home/subject-tile";
import { SUBJECT_MARQUEE, SUBJECTS } from "@/data/subjects";

/** Every tile links to the educators section, matching the source's handlers. */
const SUBJECTS_TARGET = "#tutors";

/** Grid placement per tile, mirroring the source's responsive column spans. */
const INTRO_SPAN = "col-span-12 max-[900px]:col-span-2 max-[520px]:col-span-1";
const PHOTO_SPAN = "col-span-4 row-span-2 max-[900px]:col-span-1 max-[520px]:col-span-1";

export function SubjectsSection() {
  return (
    <Section
      id="subjects2"
      container={false}
      className="relative overflow-hidden bg-ivory pb-[20vh] pt-[18vh]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[12vh] z-0 -translate-x-1/2 whitespace-nowrap font-serif text-[min(16vw,240px)] font-extrabold leading-none tracking-[-0.04em] text-[rgba(46,58,115,0.05)]"
      >
        SUBJECTS
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <SectionHeading
            align="center"
            className="mb-[76px]"
            eyebrow="Explore subjects"
            title={
              <>
                Everything they might want <Highlight>to learn.</Highlight>
              </>
            }
            description="Academic and creative, for children and adults — each taught by an independent educator we have vetted."
          />
        </Reveal>
      </Container>

      <Reveal className="relative z-[1] mb-[8vh]">
        <Marquee items={SUBJECT_MARQUEE} />
      </Reveal>

      <Container className="relative z-[1]">
        <div className="grid auto-rows-[200px] grid-flow-row-dense grid-cols-12 gap-4 max-[900px]:auto-rows-[180px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          <Reveal className={INTRO_SPAN}>
            <SubjectTile
              variant="block"
              category="Six ways to begin"
              title="Find the right educator for every kind of learning."
              cta="Browse all"
              href={SUBJECTS_TARGET}
            />
          </Reveal>

          {SUBJECTS.map((subject, index) => (
            <Reveal
              key={subject.id}
              delay={(index + 1) as RevealDelay}
              className={PHOTO_SPAN}
            >
              <SubjectTile
                variant="photo"
                category={subject.category}
                title={subject.title}
                description={subject.description}
                image={subject.image}
                cta="Explore"
                href={subject.href ?? SUBJECTS_TARGET}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
