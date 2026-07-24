import type { Metadata } from "next";

import { Highlight } from "@/components/common/highlight";
import { Marquee } from "@/components/common/marquee";
import { CookingHero } from "@/components/cooking/cooking-hero";
import { CookingOffers } from "@/components/cooking/cooking-offers";
import { HeatDial } from "@/components/cooking/heat-dial";
import { EducatorsSection } from "@/components/subject/educators-section";
import { FeatureSplit } from "@/components/subject/feature-split";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectStats } from "@/components/subject/subject-stats";
import {
  COOKING_APPROACH_LEAD,
  COOKING_APPROACH_POINTS,
  COOKING_EDUCATORS,
  COOKING_STATS,
} from "@/data/cooking";

export const metadata: Metadata = {
  title: "Cooking",
  description:
    "Learn to read the heat — from a gentle poach to a fearless sear — with a patient cook beside you. Everyday cooking, baking, and world flavours in your own kitchen.",
};

const SIZZLE = ["Poach", "Simmer", "Sauté", "Sear", "Char", "Roast"];

export default function CookingSubjectPage() {
  return (
    <main>
      <CookingHero />

      <Marquee items={SIZZLE} />

      <CookingOffers />

      <HeatDial />

      <FeatureSplit
        image={{
          src: "/assets/cooking/images/approach.jpg",
          alt: "A parent and child slicing peppers together",
        }}
        title={
          <>
            Taste as you <Highlight>go.</Highlight>
          </>
        }
        paragraphs={[COOKING_APPROACH_LEAD]}
        features={COOKING_APPROACH_POINTS}
      />

      <EducatorsSection
        title={
          <>
            Who teaches <Highlight tone="gold">cooking.</Highlight>
          </>
        }
        bgImage={{ src: "/assets/cooking/images/educators-bg.jpg", alt: "" }}
        educators={COOKING_EDUCATORS}
        note="For learners under 18, a parent or guardian books and supervises every session — always."
      />

      <SubjectStats stats={COOKING_STATS} />

      <SubjectCta
        title={
          <>
            Cook something <Highlight tone="gold">tonight.</Highlight>
          </>
        }
        description="Tell James or Rosa what you'd love to make — a weeknight dinner, fresh bread, a dish from somewhere far — and book your first session at your own stove."
        bgImage={{ src: "/assets/cooking/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
