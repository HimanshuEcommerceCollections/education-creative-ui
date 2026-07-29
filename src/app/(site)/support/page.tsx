import type { Metadata } from "next";

import { CoppaBand } from "@/components/common/coppa-band";
import { SupportContactStrip } from "@/components/support/support-contact-strip";
import { SupportHero } from "@/components/support/support-hero";
import { SupportSearchProvider } from "@/components/support/support-search-context";
import { ShieldCheckIcon } from "@/components/support/support-icons";
import { SupportTopics } from "@/components/support/support-topics";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Search the help center or browse topics — accounts, booking, pricing, safety, educators, and managing your sessions. A parent or guardian is always the point of contact.",
};

export default function SupportPage() {
  return (
    <main>
      {/* The hero's search field filters the topic grid in the next section. */}
      <SupportSearchProvider>
        <SupportHero />
        <SupportTopics />
      </SupportSearchProvider>

      <SupportContactStrip />

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/support/images/coppa-bg.jpg"
        icon={<ShieldCheckIcon className="h-7 w-7" />}
      />
    </main>
  );
}
