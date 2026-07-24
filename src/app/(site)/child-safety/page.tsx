import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { CHILD_SAFETY } from "@/data/legal";

export const metadata: Metadata = {
  title: "Child Safety & COPPA — Your Learning Journey",
  description:
    "How Your Learning Journey protects children: parent-managed contact, no child accounts, parent-supervised sessions, and how to report a safety concern.",
};

export default function ChildSafetyPage() {
  return (
    <main>
      <LegalPage content={CHILD_SAFETY} />
    </main>
  );
}
