import type { Metadata } from "next";

import { ClosingCta } from "@/components/common/closing-cta";
import { CoppaBand } from "@/components/common/coppa-band";
import { Highlight } from "@/components/common/highlight";
import { BookingStepper } from "@/components/for-parents/booking-stepper";
import { ParentPillars } from "@/components/for-parents/parent-pillars";
import { ParentQuestions } from "@/components/for-parents/parent-questions";
import { ParentsHero } from "@/components/for-parents/parents-hero";
import { VettingSplit } from "@/components/for-parents/vetting-split";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import { Button } from "@/components/ui/button";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "For Parents",
  description:
    "You stay in the driver’s seat. How booking works from a parent’s side, how we vet independent educators, and the questions families ask first.",
};

export default function ForParentsPage() {
  return (
    <main>
      <ParentsHero />

      <ParentPillars />

      <BookingStepper />

      <VettingSplit />

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/for-parents/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
      />

      <ParentQuestions />

      <ClosingCta
        title={
          <>
            Ready when <Highlight tone="gold">you</Highlight> are.
          </>
        }
        description="Browse vetted, independent educators across all six subjects — or reach out first if you have questions. You stay in control the whole way."
        imageSrc="/assets/for-parents/images/cta-bg.jpg"
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
