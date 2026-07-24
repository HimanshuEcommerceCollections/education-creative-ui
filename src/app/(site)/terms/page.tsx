import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { TERMS_OF_SERVICE } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The sample terms for the Your Learning Journey demo marketplace: our role, independent educators, bookings, parent responsibilities, and acceptable use.",
};

export default function TermsPage() {
  return (
    <main>
      <LegalPage content={TERMS_OF_SERVICE} />
    </main>
  );
}
