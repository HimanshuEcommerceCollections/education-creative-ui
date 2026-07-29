import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { CAREERS_MEDIA } from "@/data/careers";

import { InfoIcon } from "./careers-icons";

/**
 * Careers hero: a photo-backed dark band with a breadcrumb, gold eyebrow, split
 * headline, lead paragraph, and the chip that flags the sample roles below as
 * synthetic. No CTAs — the roles list is the next thing on the page.
 */
export function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-ink-deep pb-[88px] pt-[190px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.66)_0%,rgba(12,12,14,0.82)_100%)] after:content-['']"
      >
        <Image
          src={CAREERS_MEDIA.heroBg.src}
          alt=""
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
            className="mb-[26px] flex items-center gap-[9px] text-[12.5px] tracking-[0.02em] text-[rgba(255,255,255,0.82)]"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            <b className="font-semibold">Careers</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold">Careers</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="max-w-[16ch] font-serif text-[clamp(38px,6vw,74px)] font-semibold leading-none tracking-[-0.03em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.45)]">
            Help families find the <Highlight tone="gold">right fit.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-[22px] max-w-[60ch] text-[clamp(16px,1.5vw,19px)] leading-[1.62] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            We&rsquo;re a small Raleigh team building a trusted marketplace that connects families
            with vetted independent educators across six subjects. If you care about doing careful,
            human work, there&rsquo;s a place for you here.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <p className="mt-[26px] inline-flex items-center gap-2 rounded-[30px] border border-[rgba(255,255,255,0.28)] bg-white/[0.12] px-[15px] py-[7px] text-[12px] font-semibold tracking-[0.04em] text-[rgba(244,241,234,0.92)]">
            <InfoIcon className="h-[14px] w-[14px]" />
            Demo page &mdash; roles below are synthetic samples
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
