import type { Metadata } from "next";

import { AboutCoppa } from "@/components/about/about-coppa";
import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMission } from "@/components/about/about-mission";
import { AboutSnapshot } from "@/components/about/about-snapshot";
import { AboutTrust } from "@/components/about/about-trust";
import { AboutValues } from "@/components/about/about-values";

export const metadata: Metadata = {
  title: "About — Your Learning Journey",
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
      <AboutCoppa />
      <AboutCta />
    </main>
  );
}
