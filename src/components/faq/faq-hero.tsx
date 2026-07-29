import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { FAQ_HERO } from "@/data/faq";

/**
 * Dark FAQ hero: a classroom photo under a vertical wash, then breadcrumb,
 * eyebrow, split headline and lede. Clears the fixed header with its top
 * padding. The breadcrumb separator is the design's small gold dot.
 */
export function FaqHero() {
  return (
    <Section
      container={false}
      className="relative overflow-hidden bg-[#141416] pb-[78px] pt-[190px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.68)_0%,rgba(12,12,14,0.82)_100%)] after:content-['']"
      >
        <Image
          src={FAQ_HERO.image.src}
          alt={FAQ_HERO.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[26px] flex flex-wrap items-center gap-[9px] text-[12.5px] tracking-[0.04em] text-white/[0.82]"
          >
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span
              aria-hidden="true"
              className="inline-block h-1 w-1 rounded-full bg-gold"
            />
            <b className="font-semibold">{FAQ_HERO.crumb}</b>
          </nav>
        </Reveal>

        <Reveal delay={1}>
          <Eyebrow tone="gold">{FAQ_HERO.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={2}>
          <h1 className="max-w-[14ch] font-serif text-[clamp(38px,6vw,72px)] font-semibold leading-none tracking-[-0.025em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.45)]">
            {FAQ_HERO.titleLead}
            <Highlight tone="gold">{FAQ_HERO.titleAccent}</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={3}>
          <p className="mt-5 max-w-[52ch] text-[17.5px] leading-[1.6] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            {FAQ_HERO.lede}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
