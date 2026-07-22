import type { Metadata } from "next";

import { ArtsEducatorSpotlight } from "@/components/arts/arts-educator-spotlight";
import { ArtsHero } from "@/components/arts/arts-hero";
import { OrigamiFold } from "@/components/arts/origami-fold";
import { Highlight } from "@/components/common/highlight";
import { Marquee } from "@/components/common/marquee";
import { FeatureSplit } from "@/components/subject/feature-split";
import { OfferSection } from "@/components/subject/offer-section";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectStats } from "@/components/subject/subject-stats";
import { ARTS_MARQUEE, ARTS_OFFERS, ARTS_STATS } from "@/data/arts";

export const metadata: Metadata = {
  title: "Arts & Crafts — Your Learning Journey",
  description:
    "Painting, clay, paper, and thread — unhurried, hands-on making for all ages, taught at home or online by patient, vetted craft educators.",
};

export default function ArtsCraftsSubjectPage() {
  return (
    <main>
      <ArtsHero />

      <Marquee items={ARTS_MARQUEE} />

      <OrigamiFold />

      <OfferSection offers={ARTS_OFFERS} />

      <FeatureSplit
        image={{
          src: "/assets/arts/images/approach.jpg",
          alt: "An art teacher guiding two young students",
        }}
        title={
          <>
            Process over <Highlight>perfect.</Highlight>
          </>
        }
        paragraphs={[
          "Nobody's graded here. Sessions move at the maker's pace — learning to hold the brush, wedge the clay, read the pattern — and every project goes home finished, wobbles and all.",
        ]}
        features={[
          "Small-batch projects sized to finish in one or two sessions",
          "Materials lists sent ahead — or supplied for a small fee",
          "In-home or online; parents always welcome at the table",
        ]}
      />

      <ArtsEducatorSpotlight />

      <SubjectStats stats={ARTS_STATS} />

      <SubjectCta
        title={
          <>
            Make something <Highlight tone="gold">this weekend.</Highlight>
          </>
        }
        description="Tell Theo what you'd love to try — painting, pottery, or paper — and book a first session at your own table."
        bgImage={{ src: "/assets/arts/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
