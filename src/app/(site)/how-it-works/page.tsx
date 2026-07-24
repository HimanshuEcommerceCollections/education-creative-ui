import type { Metadata } from "next";

import { CoppaBand } from "@/components/common/coppa-band";
import { HowItWorksCta } from "@/components/how-it-works/how-it-works-cta";
import { HowItWorksHero } from "@/components/how-it-works/how-it-works-hero";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import { JourneyRack } from "@/components/how-it-works/journey-rack";
import { SessionFormats } from "@/components/how-it-works/session-formats";
import { TrustSafety } from "@/components/how-it-works/trust-safety";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Browse vetted, independent educators across six subjects, connect directly, and start learning — in your home or online. Parents stay in control at every step.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorksHero />

      <JourneyRack />

      <TrustSafety />

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/how-it-works/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
        stripClassName="bg-ivory"
        bandClassName="bg-sand"
      />

      <SessionFormats />

      <HowItWorksCta />
    </main>
  );
}
