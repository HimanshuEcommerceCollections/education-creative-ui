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
import { SERVICES } from "@/data/services";
import { fromRatesBySubject, loadPricingSnapshot } from "@/lib/pricing/snapshot";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six subjects, one trusted marketplace — academic tutoring, college admissions, music, languages, arts & crafts, and cooking, taught in your home or online by vetted independent educators.",
};

export default async function ServicesPage() {
  /*
   * Live pricing overlay: each card's "from" rate is its subject band's minimum
   * from the admin-controlled snapshot, falling back to the in-repo figure when
   * the API can't answer. The card's slug is the tail of its /subjects/* href.
   */
  const snapshot = await loadPricingSnapshot();
  const fromRates = fromRatesBySubject(snapshot);
  const services = SERVICES.map((service) => {
    const subjectSlug = service.href.split("/").at(-1) ?? "";
    const from = fromRates[subjectSlug];
    if (from === undefined) return service;
    return {
      ...service,
      rateFrom: `$${Number.isInteger(from) ? from : from.toFixed(2)}`,
    };
  });

  return (
    <main>
      <ServicesHero />

      <ServicesGrid services={services} />

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
