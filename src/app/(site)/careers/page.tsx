import type { Metadata } from "next";

import { CareersCta } from "@/components/careers/careers-cta";
import { CareersHero } from "@/components/careers/careers-hero";
import { FamiliesTrust } from "@/components/careers/families-trust";
import { FitBand } from "@/components/careers/fit-band";
import { OpenRoles } from "@/components/careers/open-roles";
import { WhyWorkHere } from "@/components/careers/why-work-here";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a small Raleigh team building a trusted marketplace of vetted independent educators — what it's like to work here, sample openings, and how to reach us.",
};

export default function CareersPage() {
  return (
    <main>
      <CareersHero />

      <WhyWorkHere />

      <OpenRoles />

      <FamiliesTrust />

      <FitBand />

      <CareersCta />
    </main>
  );
}
