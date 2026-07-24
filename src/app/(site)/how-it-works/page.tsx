import type { Metadata } from "next";

import { CoppaBand } from "@/components/how-it-works/coppa-band";
import { HowItWorksCta } from "@/components/how-it-works/how-it-works-cta";
import { HowItWorksHero } from "@/components/how-it-works/how-it-works-hero";
import { JourneyRack } from "@/components/how-it-works/journey-rack";
import { SessionFormats } from "@/components/how-it-works/session-formats";
import { TrustSafety } from "@/components/how-it-works/trust-safety";

export const metadata: Metadata = {
  title: "How It Works — Your Learning Journey",
  description:
    "Browse vetted, independent educators across six subjects, connect directly, and start learning — in your home or online. Parents stay in control at every step.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorksHero />

      <JourneyRack />

      <TrustSafety />

      <CoppaBand />

      <SessionFormats />

      <HowItWorksCta />
    </main>
  );
}
