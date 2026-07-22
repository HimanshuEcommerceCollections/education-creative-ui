import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Slate on light backgrounds; gold (with glow) over media; light on dark. */
type EyebrowTone = "slate" | "gold" | "light";
type EyebrowAlign = "left" | "center";

const TONE: Record<EyebrowTone, string> = {
  slate: "text-slate",
  gold: "text-gold [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]",
  light: "text-[rgba(246,245,241,0.66)]",
};

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  align?: EyebrowAlign;
  className?: string;
}

/** The `.eyebrow` kicker: uppercase label preceded by a short gold rule. */
export function Eyebrow({
  children,
  tone = "slate",
  align = "left",
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-[18px] flex items-center gap-[13px] text-[11.5px] font-semibold uppercase tracking-[0.28em]",
        align === "center" && "justify-center",
        TONE[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block h-px w-[30px] bg-gold" />
      {children}
    </p>
  );
}
