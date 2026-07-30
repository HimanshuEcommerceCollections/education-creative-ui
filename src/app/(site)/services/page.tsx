import type { Metadata } from "next";

import { ClosingCta } from "@/components/common/closing-cta";
import { CoppaBand } from "@/components/common/coppa-band";
import { Highlight } from "@/components/common/highlight";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import { SessionFormats } from "@/components/how-it-works/session-formats";
import { ServicesGrid } from "@/components/services/services-grid";
import { ServicesHero } from "@/components/services/services-hero";
import { Button } from "@/components/ui/button";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six subjects, one trusted marketplace — academic tutoring, college admissions, music, languages, arts & crafts, and cooking, taught in your home or online by vetted independent educators.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />

      <ServicesGrid />

      <SessionFormats />

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/how-it-works/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
      />

      <ClosingCta
        title={
          <>
            Find the right <Highlight tone="gold">fit</Highlight> for your family.
          </>
        }
        description="Browse vetted, independent educators across all six subjects — or reach out first if you have questions."
        imageSrc="/assets/how-it-works/images/cta-bg.jpg"
      >
        <Button href="/browse" variant="primary">
          Browse Educators
        </Button>
        <Button href="/contact" variant="ghost">
          Ask a Question
        </Button>
      </ClosingCta>
    </main>
  );
}
