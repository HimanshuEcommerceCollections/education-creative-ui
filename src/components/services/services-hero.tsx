import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/**
 * Services hero: a full-bleed background video under a vertical dark wash, with
 * the copy sitting on the bottom edge — the treatment the subject pages use.
 * Dark from the very top, so `/services` stays out of the header's
 * LIGHT_HERO_ROUTES.
 */
export function ServicesHero() {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-[#12131C] pt-[120px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.72)_0%,rgba(18,19,28,0.58)_45%,rgba(18,19,28,0.9)_100%)] after:content-['']"
      >
        <HeroVideo
          src="/assets/how-it-works/videos/hero.mp4"
          poster="/assets/how-it-works/images/hero-poster.jpg"
        />
      </div>

      <Container className="relative z-[2] pb-[72px] text-white">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[22px] flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-white/75"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold text-white">Services</b>
          </nav>

          <Eyebrow tone="gold">Our Services</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="max-w-[16ch] font-serif text-[clamp(42px,6.4vw,80px)] font-semibold leading-[0.98] tracking-[-0.02em] [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]">
            Six subjects, one <Highlight tone="gold">trusted marketplace.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-[18px] max-w-[56ch] text-[17.5px] leading-[1.65] text-white/[0.88]">
            Every service means one thing: time with a vetted, independent educator who
            fits your family. Browse the six subjects below, in your home or online — a
            parent stays in control of every booking.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-[30px] flex flex-wrap gap-[14px]">
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
