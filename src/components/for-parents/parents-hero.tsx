import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { PARENT_HERO_BADGES, PARENT_HERO_IMAGE } from "@/data/for-parents";

import { PARENT_ICONS } from "./for-parents-icons";

/**
 * For Parents hero: a full-bleed photo under a left-weighted dark wash, with
 * left-aligned copy, dual CTAs, and a row of gold-check trust badges. Dark from
 * the very top, so `/for-parents` stays out of the header's LIGHT_HERO_ROUTES.
 */
export function ParentsHero() {
  return (
    <section className="relative overflow-hidden bg-ink-deep pb-32 pt-[220px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(100deg,rgba(16,16,18,0.9)_0%,rgba(16,16,18,0.72)_44%,rgba(12,12,14,0.46)_100%)] after:content-['']"
      >
        <Image
          src={PARENT_HERO_IMAGE.src}
          alt={PARENT_HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_28%]"
        />
      </div>

      <Container className="relative z-[1] max-w-[760px]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-[rgba(244,241,234,0.72)]"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold text-white">For Parents</b>
          </nav>

          <Eyebrow tone="gold">For Parents</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(38px,5.4vw,64px)] font-semibold leading-[1.03] tracking-[-0.025em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]">
            You stay in the <Highlight tone="gold">driver’s seat.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-5 max-w-[56ch] text-[17.5px] leading-[1.62] text-[rgba(244,241,234,0.86)] [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]">
            Every educator is independent and vetted, and for any learner under 18 a parent
            creates the account, books the sessions, and stays involved throughout. Here’s
            exactly how it works — and how we help you choose with confidence.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap gap-[14px]">
            <Button href="/browse" variant="primary">
              Browse Educators
            </Button>
            <Button href="/how-it-works" variant="ghost">
              How It Works
            </Button>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-[30px] flex flex-wrap gap-[22px]">
            {PARENT_HERO_BADGES.map((badge) => {
              const Icon = PARENT_ICONS[badge.icon];
              return (
                <span
                  key={badge.label}
                  className="flex items-center gap-[7px] text-[12.5px] text-[rgba(244,241,234,0.82)]"
                >
                  <Icon className="h-4 w-4 flex-none text-gold" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
