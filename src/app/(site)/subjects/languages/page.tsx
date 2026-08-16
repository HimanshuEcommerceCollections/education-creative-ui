import type { Metadata } from "next";

import { Highlight } from "@/components/common/highlight";
import { ArchOffers } from "@/components/languages/arch-offers";
import { LanguagesApproach } from "@/components/languages/languages-approach";
import { LanguagesEducators } from "@/components/languages/languages-educators";
import { LanguagesHero } from "@/components/languages/languages-hero";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectStats } from "@/components/subject/subject-stats";
import { LANGUAGE_EDUCATORS, LANGUAGES_STATS } from "@/data/languages";
import { loadPricingSnapshot, withLiveRates } from "@/lib/pricing/snapshot";

export const metadata: Metadata = {
  title: "Languages",
  description:
    "Spanish, French, and Hindi with educators who teach conversation first — real talk from lesson one, grammar sneaking in while you're busy speaking.",
};

export default async function LanguagesSubjectPage() {
  // Card content stays in-repo; the hourly rate is the admin-set figure, so this
  // page can't drift from the same educator on browse or their profile.
  const educators = withLiveRates(
    LANGUAGE_EDUCATORS,
    await loadPricingSnapshot(),
    "languages",
  );

  return (
    <main>
      <LanguagesHero />

      <ArchOffers />

      <LanguagesApproach />

      <LanguagesEducators educators={educators} />

      <SubjectStats stats={LANGUAGES_STATS} />

      <SubjectCta
        title={
          <>
            Your first <Highlight tone="gold">hola</Highlight> is one click away.
          </>
        }
        description="Open Lena's profile or Sofia's, pick a time, and pay to place the request. A coordinator confirms it with them within two days — or you're refunded in full, automatically."
        bgImage={{ src: "/assets/languages/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
