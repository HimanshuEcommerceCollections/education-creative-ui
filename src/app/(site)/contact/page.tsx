import type { Metadata } from "next";

import { CoppaBand } from "@/components/common/coppa-band";
import { ContactCta } from "@/components/contact/contact-cta";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMain } from "@/components/contact/contact-main";
import { WhatToExpect } from "@/components/contact/what-to-expect";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about educators, subjects, scheduling, or pricing? Reach our small Raleigh team. A parent or guardian is the point of contact for every learner under 18.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactMain />
      <WhatToExpect />
      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/how-it-works/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
        stripClassName="bg-ivory"
        bandClassName="bg-sand"
      />
      <ContactCta />
    </main>
  );
}
