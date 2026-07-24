import type { Metadata } from "next";

import { BrowseCoppa } from "@/components/browse/browse-coppa";
import { BrowseCta } from "@/components/browse/browse-cta";
import { BrowseExplorer } from "@/components/browse/browse-explorer";

export const metadata: Metadata = {
  title: "Browse Educators — Your Learning Journey",
  description:
    "Explore vetted independent educators across six subjects — academics, admissions, music, languages, arts, and cooking. Filter by subject, sort by rating or price, and find a fit for your family.",
};

export default function BrowsePage() {
  return (
    <main>
      <BrowseExplorer />
      <BrowseCoppa />
      <BrowseCta />
    </main>
  );
}
