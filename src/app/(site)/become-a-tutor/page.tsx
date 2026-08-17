import type { Metadata } from "next";

import { ApplySection } from "@/components/become-a-tutor/apply-section";
import { BecomeCta } from "@/components/become-a-tutor/become-cta";
import { BecomeHero } from "@/components/become-a-tutor/become-hero";
import { RequirementsBand } from "@/components/become-a-tutor/requirements-band";
import { TeachSteps } from "@/components/become-a-tutor/teach-steps";
import { WhyTeach } from "@/components/become-a-tutor/why-teach";
import { configFlags, loadConfigSnapshot } from "@/lib/config/snapshot";

export const metadata: Metadata = {
  title: "Become an Educator",
  description:
    "Teach on your terms in Raleigh — set your own hourly rate, choose in-home or online, and reach local families. See how the four-step review works and start your application.",
};

/**
 * Everything here is in-repo marketing copy except one thing: whether the
 * application form is accepting. That comes from the `config` snapshot, cached
 * under its own tag and busted when an admin flips the switch — so the page
 * stays static apart from the one fact that isn't.
 */
export default async function BecomeATutorPage() {
  const flags = configFlags(await loadConfigSnapshot());

  return (
    <main>
      <BecomeHero />

      <WhyTeach />

      <TeachSteps />

      <ApplySection open={flags.educatorApplicationsOpen} />

      <RequirementsBand />

      <BecomeCta />
    </main>
  );
}
