import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { COOKIE_POLICY } from "@/data/legal";

export const metadata: Metadata = {
  title: "Cookie Policy — Your Learning Journey",
  description:
    "How the Your Learning Journey demo site uses cookies — essential, preference, and aggregate analytics only, with no advertising profiles and no identifying a child.",
};

export default function CookiePolicyPage() {
  return (
    <main>
      <LegalPage content={COOKIE_POLICY} />
    </main>
  );
}
