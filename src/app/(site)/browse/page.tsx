import type { Metadata } from "next";

import { BrowseCta } from "@/components/browse/browse-cta";
import { BrowseExplorer } from "@/components/browse/browse-explorer";
import { ShieldIcon } from "@/components/browse/browse-icons";
import { CoppaBand } from "@/components/common/coppa-band";
import { COPPA_POINTS } from "@/data/coppa";
import { EDUCATORS } from "@/data/browse";
import { loadEducatorRatings } from "@/lib/educators/directory";
import { loadPricingSnapshot, ratesBySlug } from "@/lib/pricing/snapshot";

export const metadata: Metadata = {
  title: "Browse Educators",
  description:
    "Explore vetted independent educators across six subjects — academics, admissions, music, languages, arts, and cooking. Filter by subject, sort by price, and find a fit for your family.",
};

export default async function BrowsePage() {
  /*
   * Live pricing overlay: card content stays in-repo, but the hourly rate on
   * each card is the admin-set figure from the API's snapshot. When the API
   * can't answer, the card keeps its in-repo price rather than breaking.
   */
  const [snapshot, ratings] = await Promise.all([
    loadPricingSnapshot(),
    /*
     * Published ratings from `GET /educators/directory`, joined onto the cards by
     * slug. Empty when the API can't answer, and empty of anyone with no published
     * reviews — either way those cards render without a rating rather than with a
     * placeholder one.
     */
    loadEducatorRatings(),
  ]);

  const rates = ratesBySlug(snapshot);
  const educators = EDUCATORS.map((educator) =>
    rates[educator.slug] !== undefined
      ? { ...educator, price: rates[educator.slug] }
      : educator,
  );

  return (
    <main>
      <BrowseExplorer educators={educators} ratings={ratings} />
      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/browse/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
      />
      <BrowseCta />
    </main>
  );
}
