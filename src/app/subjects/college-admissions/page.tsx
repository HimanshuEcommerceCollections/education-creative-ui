import type { Metadata } from "next";

import { AdmissionsFaq } from "@/components/admissions/admissions-faq";
import { AdmissionsHero } from "@/components/admissions/admissions-hero";
import { CounselorSpotlight } from "@/components/admissions/counselor-spotlight";
import { HowWeHelpRail } from "@/components/admissions/how-we-help-rail";
import { MilestoneTimeline } from "@/components/admissions/milestone-timeline";
import { ProcessStrip } from "@/components/admissions/process-strip";
import { Highlight } from "@/components/common/highlight";
import { SubjectCta } from "@/components/subject/subject-cta";
import { SubjectStats } from "@/components/subject/subject-stats";
import { ADMISSIONS_STATS } from "@/data/admissions";

export const metadata: Metadata = {
  title: "College Admissions — Your Learning Journey",
  description:
    "One-on-one college admissions guidance — essays, applications, interviews, and aid — from junior spring to decision day, with parents in the loop.",
};

export default function CollegeAdmissionsSubjectPage() {
  return (
    <main>
      <AdmissionsHero />

      <ProcessStrip />

      <MilestoneTimeline />

      <HowWeHelpRail />

      <CounselorSpotlight />

      <AdmissionsFaq />

      <SubjectStats stats={ADMISSIONS_STATS} />

      <SubjectCta
        title={
          <>
            Senior year is calmer <Highlight tone="gold">with a plan.</Highlight>
          </>
        }
        description="Tell us where your student is in the journey — we'll match you with the right counselor."
        bgImage={{ src: "/assets/admissions/images/cta-bg.jpg", alt: "" }}
      />
    </main>
  );
}
