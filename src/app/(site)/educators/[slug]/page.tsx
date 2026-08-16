import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EducatorPage } from "@/components/educator/educator-page";
import { EDUCATOR_SLUGS, getEducator } from "@/data/educators";
import { loadEducatorReviews } from "@/lib/educators/reviews";
import { loadPricingSnapshot, ratesBySlug } from "@/lib/pricing/snapshot";

interface EducatorRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EDUCATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EducatorRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getEducator(slug);

  if (!profile) {
    return { title: "Educator not found" };
  }

  return {
    title: `${profile.name} — ${profile.subject}`,
    description: profile.about[0],
  };
}

export default async function EducatorProfileRoute({
  params,
}: EducatorRouteProps) {
  const { slug } = await params;
  const profile = getEducator(slug);

  if (!profile) {
    notFound();
  }

  /*
   * Live pricing overlay: the sticky booking card renders the admin-set rate
   * from the snapshot, keeping the in-repo figure only when the API can't
   * answer. Same pattern as /browse, so the two pages can't quote different
   * prices for the same educator.
   */
  /*
   * Ratings and reviews come from the API's public read, never from
   * `data/educators.ts`. Both loads degrade to "nothing known" on failure, so a
   * build with no API running produces the same page an unreviewed educator gets:
   * no stars, no breakdown, and "No reviews yet" in the tab.
   */
  const [snapshot, reviews] = await Promise.all([
    loadPricingSnapshot(),
    loadEducatorReviews(slug),
  ]);

  const rates = ratesBySlug(snapshot);
  const livePrice = rates[slug];
  const priced = livePrice !== undefined ? { ...profile, price: livePrice } : profile;

  return (
    <main>
      <EducatorPage profile={priced} reviews={reviews} />
    </main>
  );
}
