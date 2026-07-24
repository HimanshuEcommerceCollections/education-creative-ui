import type { Metadata } from "next";

import { ShieldIcon } from "@/components/about/about-icons";
import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMission } from "@/components/about/about-mission";
import { AboutSnapshot } from "@/components/about/about-snapshot";
import { AboutTrust } from "@/components/about/about-trust";
import { AboutValues } from "@/components/about/about-values";
import { CoppaBand } from "@/components/common/coppa-band";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "About",
  description:
    "Your Learning Journey is a Raleigh marketplace connecting families with vetted independent educators across six subjects — with parents in control at every step.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutSnapshot />
      <AboutTrust />
      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/about/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
      />
      <AboutCta />
    </main>
  );
}
