import type { Metadata } from "next";

import { Section } from "@/components/common/section";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { FaqHelpBand } from "@/components/faq/faq-help-band";
import { FaqHero } from "@/components/faq/faq-hero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on pricing, booking, safety, and joining as an educator. A parent or guardian books and supervises every session for learners under 18.",
};

export default function FaqPage() {
  return (
    <main>
      <FaqHero />

      <Section className="bg-ivory pb-[12vh] pt-2">
        <FaqBrowser />
      </Section>

      <FaqHelpBand />
    </main>
  );
}
