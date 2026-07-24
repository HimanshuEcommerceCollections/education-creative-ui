import type { Metadata } from "next";

import { Highlight } from "@/components/common/highlight";
import { Marquee } from "@/components/common/marquee";
import { EducatorsSection } from "@/components/subject/educators-section";
import { FeatureSplit } from "@/components/subject/feature-split";
import { OfferSection } from "@/components/subject/offer-section";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectHero } from "@/components/subject/subject-hero";
import { SubjectStats } from "@/components/subject/subject-stats";
import { PopQuiz } from "@/components/tutoring/pop-quiz";
import { SubjectBook } from "@/components/tutoring/subject-book";
import {
  TUTORING_EDUCATORS,
  TUTORING_MARQUEE,
  TUTORING_OFFERS,
  TUTORING_STATS,
} from "@/data/tutoring";

export const metadata: Metadata = {
  title: "Academic Tutoring — Your Learning Journey",
  description:
    "Maths, sciences, reading and writing — steady one-to-one support from vetted educators, at home or online, for school-age and adult learners.",
};

export default function TutoringSubjectPage() {
  return (
    <main>
      <SubjectHero
        title={
          <>
            Academic Tutoring, for{" "}
            <Highlight tone="gold">every subject.</Highlight>
          </>
        }
        description="Maths, sciences, reading and writing — steady one-to-one support from vetted educators, at home or online, for school-age and adult learners."
        videoSrc="/assets/tutoring/videos/hero.mp4"
        primaryCtaLabel="Find a tutor"
      />

      <Marquee items={TUTORING_MARQUEE} />

      <OfferSection offers={TUTORING_OFFERS} />

      <PopQuiz />

      <FeatureSplit
        image={{
          src: "/assets/tutoring/images/feature-study-session.jpg",
          alt: "A study session around the table",
        }}
        title={
          <>
            One learner at a time, <Highlight>always.</Highlight>
          </>
        }
        paragraphs={[
          "Group classes move at the group’s pace. Our tutors move at yours — finding the exact gaps, closing them, and building the confidence that makes the next topic easier than the last.",
          "Sessions happen at your kitchen table or online, with a parent nearby for younger learners — always.",
        ]}
        features={[
          "A short first session maps exactly where the learner stands",
          "Parents get a two-line note after every lesson — covered, and next",
          "School-age and adult learners — returning to study is welcome here",
        ]}
      />

      <SubjectBook />

      <EducatorsSection
        title={
          <>
            Who teaches <Highlight tone="gold">academic tutoring.</Highlight>
          </>
        }
        bgImage={{ src: "/assets/tutoring/images/educators-bg.jpg", alt: "" }}
        educators={TUTORING_EDUCATORS}
      />

      <SubjectStats stats={TUTORING_STATS} />

      <SubjectCta
        title={
          <>
            Ready for <Highlight tone="gold">steadier progress?</Highlight>
          </>
        }
        description="Start with a free 20-minute intro call. Tell us where things stand, and we’ll match a tutor who fits — no commitment."
        bgImage={{ src: "/assets/tutoring/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
