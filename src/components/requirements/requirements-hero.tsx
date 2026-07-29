import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";

/**
 * Requirements hero: a photo-backed dark band with a breadcrumb, gold eyebrow,
 * split headline, and lead paragraph. No CTAs — the page closes with them.
 */
export function RequirementsHero() {
  return (
    <section className="relative overflow-hidden bg-ink-deep pb-[82px] pt-[190px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.66)_0%,rgba(12,12,14,0.82)_100%)] after:content-['']"
      >
        <Image
          src="/assets/requirements/images/hero-bg.jpg"
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
            className="mb-[26px] flex items-center gap-[9px] text-[12.5px] tracking-[0.04em] text-[rgba(255,255,255,0.82)]"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            <b className="font-semibold">Requirements</b>
          </nav>
        </Reveal>

        <Reveal delay={1}>
          <Eyebrow tone="gold">For Educators</Eyebrow>
        </Reveal>

        <Reveal delay={2}>
          <h1 className="max-w-[15ch] font-serif text-[clamp(38px,6vw,72px)] font-semibold leading-none tracking-[-0.025em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.45)]">
            What we look for, <Highlight tone="gold">and why.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={3}>
          <p className="mt-5 max-w-[56ch] text-[17.5px] leading-[1.6] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            We review every educator before listing them, so families can trust the marketplace
            they&rsquo;re browsing. Here&rsquo;s what we ask for &mdash; and the thinking behind
            it. No hidden hoops, no promises we can&rsquo;t keep.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
