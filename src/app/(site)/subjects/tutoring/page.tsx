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
import { loadEducatorRatings } from "@/lib/educators/directory";
import { loadPricingSnapshot, withLiveRates } from "@/lib/pricing/snapshot";

export const metadata: Metadata = {
  title: "Academic Tutoring",
  description:
    "Maths, sciences, reading and writing — steady one-to-one support from vetted educators, at home or online, for school-age and adult learners.",
};

export default async function TutoringSubjectPage() {
  /*
   * Card content stays in-repo; the hourly rate is the admin-set figure and the
   * rating is the API's published average, so this page can't drift from the same
   * educator on browse or their profile. No rating for someone means no pill.
   */
  const [snapshot, ratings] = await Promise.all([
    loadPricingSnapshot(),
    loadEducatorRatings(),
  ]);
  const educators = withLiveRates(TUTORING_EDUCATORS, snapshot, "tutoring");

  return (
    <main>
      <SubjectHero
        name="Academic Tutoring"
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
        educators={educators}
        ratings={ratings}
      />

      <SubjectStats stats={TUTORING_STATS} />

      <SubjectCta
        title={
          <>
            Ready for <Highlight tone="gold">steadier progress?</Highlight>
          </>
        }
        description="Choose a tutor, a time, and a format, then pay to place the request. A coordinator confirms it with them within two days — or you’re refunded in full, automatically."
        bgImage={{ src: "/assets/tutoring/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
