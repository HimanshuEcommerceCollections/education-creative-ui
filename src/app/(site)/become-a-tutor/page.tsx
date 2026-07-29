import type { Metadata } from "next";

import { ApplySection } from "@/components/become-a-tutor/apply-section";
import { BecomeCta } from "@/components/become-a-tutor/become-cta";
import { BecomeHero } from "@/components/become-a-tutor/become-hero";
import { RequirementsBand } from "@/components/become-a-tutor/requirements-band";
import { TeachSteps } from "@/components/become-a-tutor/teach-steps";
import { WhyTeach } from "@/components/become-a-tutor/why-teach";

export const metadata: Metadata = {
  title: "Become an Educator",
  description:
    "Teach on your terms in Raleigh — set your own hourly rate, choose in-home or online, and reach local families. See how the four-step review works and start your application.",
};

export default function BecomeATutorPage() {
  return (
    <main>
      <BecomeHero />

      <WhyTeach />

      <TeachSteps />

      <ApplySection />

      <RequirementsBand />

      <BecomeCta />
    </main>
  );
}
