import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/**
 * Become-an-Educator hero: a photo-backed dark band with a breadcrumb, gold
 * eyebrow, split headline, and the two entry CTAs (apply, or read the path
 * first). A soft gold bloom sits off the top-right corner.
 */
export function BecomeHero() {
  return (
    <section className="relative overflow-hidden bg-ink-deep pb-24 pt-[190px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.66)_0%,rgba(12,12,14,0.82)_100%)] after:content-['']"
      >
        <Image
          src="/assets/become-a-tutor/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[120px] -top-[140px] z-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(210,162,65,0.16),rgba(210,162,65,0)_70%)]"
      />

      <Container className="relative z-[1] max-w-[900px]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-[9px] text-[12.5px] tracking-[0.04em] text-[rgba(255,255,255,0.85)]"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            <b className="font-semibold">Become an Educator</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold">For Educators</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(38px,5.4vw,66px)] font-semibold leading-[1.03] tracking-[-0.02em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.45)]">
            Teach on your terms, <Highlight tone="gold">in your community.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-[22px] max-w-[58ch] text-[17.5px] leading-[1.65] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            Join a vetted marketplace of independent educators serving families across Raleigh. You
            set your own hourly rate, choose in-home or online, and teach the subjects you know best
            &mdash; while parents handle the booking so you can focus on the session.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap gap-[14px]">
            <Button href="#apply" variant="primary">
              Start Your Application
            </Button>
            <Button href="#how" variant="secondary">
              See How It Works
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
