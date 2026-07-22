import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Upright emphasis used inside headings — the source's `h2 i` / `h1 i`
 * (`font-style: normal` with an accent color). Slate on light sections,
 * gold over dark media.
 */
export function Highlight({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "gold";
}) {
  return (
    <i className={cn("not-italic", tone === "gold" ? "text-gold" : "text-slate")}>
      {children}
    </i>
  );
}
