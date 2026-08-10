import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EducatorPage } from "@/components/educator/educator-page";
import { EDUCATOR_SLUGS, getEducator } from "@/data/educators";
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
  const rates = ratesBySlug(await loadPricingSnapshot());
  const livePrice = rates[slug];
  const priced = livePrice !== undefined ? { ...profile, price: livePrice } : profile;

  return (
    <main>
      <EducatorPage profile={priced} />
    </main>
  );
}
