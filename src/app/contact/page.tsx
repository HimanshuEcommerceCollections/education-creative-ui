import type { Metadata } from "next";

import { ContactCta } from "@/components/contact/contact-cta";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMain } from "@/components/contact/contact-main";
import { WhatToExpect } from "@/components/contact/what-to-expect";
import { CoppaBand } from "@/components/how-it-works/coppa-band";

export const metadata: Metadata = {
  title: "Contact — Your Learning Journey",
  description:
    "Questions about educators, subjects, scheduling, or pricing? Reach our small Raleigh team. A parent or guardian is the point of contact for every learner under 18.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactMain />
      <WhatToExpect />
      <CoppaBand />
      <ContactCta />
    </main>
  );
}
