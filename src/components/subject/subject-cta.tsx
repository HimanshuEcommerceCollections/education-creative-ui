import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { ImageAsset } from "@/types/media";

interface SubjectCtaProps {
  /** Headline; use <Highlight tone="gold"> for the accent. */
  title: ReactNode;
  description: string;
  bgImage: ImageAsset;
}

/**
 * Closing call-to-action with a photo backdrop.
 *
 * The button goes where a booking actually starts. There is no intro call anywhere in
 * the product and the contact form doesn't reach an educator, so this must not offer
 * one: the real first step is to open a profile, pick a time, and pay — a coordinator
 * then confirms it, or the booking refunds itself. Each page's `description` says what
 * happens next rather than promising a call nobody schedules.
 */
export function SubjectCta({ title, description, bgImage }: SubjectCtaProps) {
  return (
    <section className="relative overflow-hidden bg-slate-deep py-[16vh] text-center text-ivory">
      <div
        aria-hidden="true"
        className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.82),rgba(18,19,28,0.88))] after:content-['']"
      >
        <Image
          src={bgImage.src}
          alt={bgImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[2]">
        <Reveal>
          <Eyebrow tone="gold" align="center">
            Get started
          </Eyebrow>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mx-auto mb-4 max-w-[20ch] font-serif text-[clamp(30px,4.4vw,54px)] font-semibold leading-[1.03] tracking-[-0.02em]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mx-auto mb-8 max-w-[50ch] leading-[1.65] text-[rgba(244,241,234,0.8)]">
            {description}
          </p>
        </Reveal>
        <Reveal delay={3}>
          <Button href="/browse" variant="light">
            Browse educators
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
