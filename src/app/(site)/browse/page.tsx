import type { Metadata } from "next";

import { BrowseCta } from "@/components/browse/browse-cta";
import { BrowseExplorer } from "@/components/browse/browse-explorer";
import { ShieldIcon } from "@/components/browse/browse-icons";
import { CoppaBand } from "@/components/common/coppa-band";
import { COPPA_POINTS } from "@/data/coppa";

export const metadata: Metadata = {
  title: "Browse Educators",
  description:
    "Explore vetted independent educators across six subjects — academics, admissions, music, languages, arts, and cooking. Filter by subject, sort by rating or price, and find a fit for your family.",
};

export default function BrowsePage() {
  return (
    <main>
      <BrowseExplorer />
      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/browse/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
      />
      <BrowseCta />
    </main>
  );
}
