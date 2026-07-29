import type { Metadata } from "next";

import { GoodToKnow } from "@/components/requirements/good-to-know";
import { RequirementsChecklist } from "@/components/requirements/requirements-checklist";
import { RequirementsCta } from "@/components/requirements/requirements-cta";
import { RequirementsHero } from "@/components/requirements/requirements-hero";
import { ReviewSteps } from "@/components/requirements/review-steps";

export const metadata: Metadata = {
  title: "Educator Requirements",
  description:
    "What we look for before listing an educator — qualifications, references, and a background review — plus the four stages of our review process and what to expect as an independent educator.",
};

export default function RequirementsPage() {
  return (
    <main>
      <RequirementsHero />

      <RequirementsChecklist />

      <ReviewSteps />

      <GoodToKnow />

      <RequirementsCta />
    </main>
  );
}
