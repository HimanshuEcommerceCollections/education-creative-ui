import type { Metadata } from "next";

import { Highlight } from "@/components/common/highlight";
import { Marquee } from "@/components/common/marquee";
import { Equalizer } from "@/components/music/equalizer";
import { FeatureNotes } from "@/components/music/feature-notes";
import { InstrumentPlayground } from "@/components/music/instrument-playground";
import { EducatorsSection } from "@/components/subject/educators-section";
import { FeatureSplit } from "@/components/subject/feature-split";
import { OfferSection } from "@/components/subject/offer-section";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectHero } from "@/components/subject/subject-hero";
import { SubjectStats } from "@/components/subject/subject-stats";
import { EDUCATORS, MUSIC_MARQUEE, MUSIC_STATS, OFFERS } from "@/data/music";
import { loadEducatorRatings } from "@/lib/educators/directory";
import { loadPricingSnapshot, withLiveRates } from "@/lib/pricing/snapshot";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Piano, guitar, voice, strings and more — taught at home or online by vetted independent musicians who meet learners where they are.",
};

export default async function MusicSubjectPage() {
  /*
   * Card content stays in-repo; the hourly rate is the admin-set figure and the
   * rating is the API's published average, so this page can't drift from the same
   * educator on browse or their profile. No rating for someone means no pill.
   */
  const [snapshot, ratings] = await Promise.all([
    loadPricingSnapshot(),
    loadEducatorRatings(),
  ]);
  const educators = withLiveRates(EDUCATORS, snapshot, "music");

  return (
    <main>
      <SubjectHero
        name="Music"
        title={
          <>
            Music, for <Highlight tone="gold">every note.</Highlight>
          </>
        }
        description="Piano, guitar, voice, strings and more — taught at home or online by vetted independent musicians who meet learners where they are."
        videoSrc="/assets/music/videos/hero.mp4"
        primaryCtaLabel="Find a music educator"
      />

      <Marquee items={MUSIC_MARQUEE} />

      <OfferSection offers={OFFERS} />

      <InstrumentPlayground />

      <FeatureSplit
        image={{
          src: "/assets/music/images/feature-keyboard-lesson.jpg",
          alt: "A keyboard lesson, four hands on the keys",
        }}
        title={
          <>
            Lessons built around <Highlight>the learner.</Highlight>
          </>
        }
        paragraphs={[
          "Some learners dream of exams and recitals; others just want to play their favourite songs. Our music educators start with what excites the learner, then build technique through it.",
          "Lessons happen where music feels comfortable — your living room, or online with a camera on the keys.",
        ]}
        features={[
          "All ages and levels — first-timers through advanced players",
          "Exam preparation available (graded boards) when it’s wanted",
          "Parents stay present for in-home lessons; observe online any time",
        ]}
        photoOverlay={<FeatureNotes />}
        belowContent={<Equalizer className="mt-[30px]" />}
      />

      <EducatorsSection
        title={
          <>
            Who teaches <Highlight tone="gold">music.</Highlight>
          </>
        }
        bgImage={{ src: "/assets/music/images/educators-bg.jpg", alt: "" }}
        educators={educators}
        ratings={ratings}
      />

      <SubjectStats stats={MUSIC_STATS} />

      <SubjectCta
        title={
          <>
            Ready to make <Highlight tone="gold">some noise?</Highlight>
          </>
        }
        description="Pick a music educator, choose a time, and pay to place the request. A coordinator confirms it with them within two days — or the booking is refunded in full, automatically."
        bgImage={{ src: "/assets/music/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
