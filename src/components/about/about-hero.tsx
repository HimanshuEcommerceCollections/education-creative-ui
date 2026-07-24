import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { ABOUT_MEDIA } from "@/data/about";

/**
 * About hero: a full-bleed background video under a dark wash, with centered
 * copy and dual CTAs.
 */
export function AboutHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink-deep pb-24 pt-[150px] text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.66)_0%,rgba(12,12,14,0.8)_100%)] after:content-['']"
      >
        <HeroVideo src={ABOUT_MEDIA.heroVideo} poster={ABOUT_MEDIA.heroPoster} />
      </div>

      <Container className="relative z-[1] mx-auto max-w-[880px] text-white">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[22px] flex justify-center gap-2 text-[12.5px] tracking-[0.06em] text-white/75"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold">About</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold" align="center">
            About Us
          </Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(40px,6.4vw,78px)] font-bold leading-[1.02] tracking-[-0.03em] [text-shadow:0_2px_4px_rgba(0,0,0,0.55),0_2px_26px_rgba(0,0,0,0.45)]">
            Learning that fits <Highlight tone="gold">your family.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mx-auto mt-[22px] max-w-[660px] text-[clamp(16px,1.6vw,19px)] leading-[1.62] text-[rgba(244,241,234,0.92)] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
            Your Learning Journey is a Raleigh marketplace that connects families with vetted
            independent educators across six subjects — math, reading, writing, science, music, and
            art. You browse, compare, and connect, and parents stay in control at every step.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-[34px] flex flex-wrap justify-center gap-[14px]">
            <Button href="/browse" variant="primary">
              Browse Educators
            </Button>
            <Button href="/how-it-works" variant="ghost">
              How It Works
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
