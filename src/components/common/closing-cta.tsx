import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

/** Default dark overlay tint over the CTA photo (used by most pages). */
const DEFAULT_OVERLAY =
  "after:bg-[linear-gradient(180deg,rgba(18,18,20,0.8)_0%,rgba(12,12,14,0.9)_100%)]";

interface ClosingCtaProps {
  title: ReactNode;
  description: ReactNode;
  /** Background photo behind the dark wash. */
  imageSrc: string;
  /** Section background color behind the photo. */
  bgClassName?: string;
  /** Overlay gradient tint (the `after:bg-…` utility). */
  overlayClassName?: string;
  /** Button row, rendered inside the shared centered flex container. */
  children: ReactNode;
}

/**
 * Shared closing call-to-action band: a dark, photo-backed section with a
 * centered headline, lead paragraph, and a button row. Background color and
 * overlay tint are props so each page keeps its exact look.
 */
export function ClosingCta({
  title,
  description,
  imageSrc,
  bgClassName = "bg-ink-deep",
  overlayClassName = DEFAULT_OVERLAY,
  children,
}: ClosingCtaProps) {
  return (
    <section className={cn("relative overflow-hidden py-[18vh] text-center", bgClassName)}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-0 after:absolute after:inset-0 after:content-['']",
          overlayClassName,
        )}
      >
        <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <Container className="relative z-[1] max-w-[720px]">
        <Reveal>
          <h2 className="font-serif text-[clamp(32px,4.6vw,54px)] font-semibold leading-[1.06] tracking-[-0.02em] text-white">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-[18px] text-[16.5px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
            {description}
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}
