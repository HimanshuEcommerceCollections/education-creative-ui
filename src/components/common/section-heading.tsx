import type { ReactNode } from "react";

import { Eyebrow } from "@/components/common/eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  /** Heading content; may include <Highlight> for the accent word. */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** The `.sHead` block: eyebrow kicker, h2, and optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-[680px]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Eyebrow align={align}>{eyebrow}</Eyebrow>
      <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-[14px] text-[16px] leading-[1.6] text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
