import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { HeroVideo } from "@/components/common/hero-video";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

interface SubjectHeroProps {
  /** Headline; use <Highlight tone="gold"> for the accent. */
  title: ReactNode;
  description: string;
  videoSrc: string;
  primaryCtaLabel: string;
}

/** Subject hero: full-bleed background video with bottom-aligned copy. */
export function SubjectHero({
  title,
  description,
  videoSrc,
  primaryCtaLabel,
}: SubjectHeroProps) {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.72)_0%,rgba(18,19,28,0.58)_45%,rgba(18,19,28,0.9)_100%)] after:content-['']"
      >
        <HeroVideo src={videoSrc} />
      </div>

      <Container className="relative z-[2] pb-[72px] text-white">
        <Reveal>
          <p className="mb-[22px] text-[12.5px] tracking-[0.06em] text-white/75">
            <Link href="/browse" className="no-underline">
              ← All subjects
            </Link>
          </p>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold">Subject</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="max-w-[14ch] font-serif text-[clamp(42px,6.4vw,80px)] font-semibold leading-[0.98] tracking-[-0.02em] [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-[18px] max-w-[52ch] text-[17.5px] leading-[1.65] text-white/[0.88]">
            {description}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-[30px] flex flex-wrap gap-[14px]">
            <Button href="/browse" variant="primary">
              {primaryCtaLabel}
            </Button>
            <Button href="/how-it-works" variant="ghost">
              How it works
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
