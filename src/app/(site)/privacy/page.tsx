import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { PRIVACY_POLICY } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Your Learning Journey",
  description:
    "What the Your Learning Journey demo site would collect and how it would be used — parent-managed accounts, no student records stored, and no selling of personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <LegalPage content={PRIVACY_POLICY} />
    </main>
  );
}
