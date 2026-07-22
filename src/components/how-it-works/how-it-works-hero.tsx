import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { HERO_BADGES } from "@/data/how-it-works";

import { CheckIcon } from "./how-it-works-icons";

/**
 * How It Works hero: a full-bleed background video under a dark wash, with
 * centered copy, dual CTAs, and a row of trust badges.
 */
export function HowItWorksHero() {
  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden pt-[120px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#12131C] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.78)_0%,rgba(18,19,28,0.62)_45%,rgba(18,19,28,0.94)_100%)] after:content-['']"
      >
        <HeroVideo
          src="/assets/how-it-works/videos/hero.mp4"
          poster="/assets/how-it-works/images/hero-poster.jpg"
        />
      </div>

      <Container className="relative z-[2] mx-auto max-w-[900px] pb-[60px] text-center text-white">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[22px] flex justify-center gap-2 text-[12.5px] tracking-[0.06em] text-white/75"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold">How It Works</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold" align="center">
            The Process
          </Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(36px,5.6vw,68px)] font-semibold leading-[1.04] tracking-[-0.02em] [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]">
            Finding the right educator,
            <br />
            made <Highlight tone="gold">simple.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mx-auto mt-5 max-w-[58ch] text-[17.5px] leading-[1.65] text-white/[0.88]">
            Browse vetted, independent educators across six subjects, connect directly with the
            ones who fit your family, and get started — in your home or online. Parents stay in
            control at every step.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
            <Button href="/browse" variant="primary">
              Browse Educators
            </Button>
            <Button href="#trust" variant="ghost">
              See Trust &amp; Safety
            </Button>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-[34px] flex flex-wrap justify-center gap-[26px]">
            {HERO_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-[7px] text-[12.5px] text-white/[0.82]">
                <CheckIcon className="h-[14px] w-[14px] flex-none text-gold" />
                {badge}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
