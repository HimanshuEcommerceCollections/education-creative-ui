import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EducatorPage } from "@/components/educator/educator-page";
import { EDUCATOR_SLUGS, getEducator } from "@/data/educators";

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

  return (
    <main>
      <EducatorPage profile={profile} />
    </main>
  );
}
