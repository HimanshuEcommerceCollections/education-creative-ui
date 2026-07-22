import type { Metadata } from "next";

import { Highlight } from "@/components/common/highlight";
import { ArchOffers } from "@/components/languages/arch-offers";
import { LanguagesApproach } from "@/components/languages/languages-approach";
import { LanguagesEducators } from "@/components/languages/languages-educators";
import { LanguagesHero } from "@/components/languages/languages-hero";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectStats } from "@/components/subject/subject-stats";
import { LANGUAGES_STATS } from "@/data/languages";

export const metadata: Metadata = {
  title: "Languages — Your Learning Journey",
  description:
    "Spanish, French, and Hindi with educators who teach conversation first — real talk from lesson one, grammar sneaking in while you're busy speaking.",
};

export default function LanguagesSubjectPage() {
  return (
    <main>
      <LanguagesHero />

      <ArchOffers />

      <LanguagesApproach />

      <LanguagesEducators />

      <SubjectStats stats={LANGUAGES_STATS} />

      <SubjectCta
        title={
          <>
            Your first <Highlight tone="gold">hola</Highlight> is one click away.
          </>
        }
        description="Meet Lena or Sofia, tell them your goal, and book a first conversation — in whichever language you like."
        bgImage={{ src: "/assets/languages/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
