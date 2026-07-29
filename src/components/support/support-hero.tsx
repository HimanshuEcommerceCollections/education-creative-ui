import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SUPPORT_HERO } from "@/data/support";

import { SupportSearchBox } from "./support-search-box";
import { CrumbChevronIcon } from "./support-icons";

/**
 * Dark help-center hero: a support-desk photo under a vertical wash, a faint
 * slate glow off the top-right corner, then breadcrumb, headline, lede and the
 * search pill. Clears the fixed header with its top padding.
 */
export function SupportHero() {
  return (
    <Section
      container={false}
      className="relative overflow-hidden bg-[#141416] pb-[86px] pt-[190px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.64)_0%,rgba(12,12,14,0.82)_100%)] after:content-['']"
      >
        <Image
          src={SUPPORT_HERO.image.src}
          alt={SUPPORT_HERO.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute -right-[120px] -top-[160px] z-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(var(--slate-rgb),0.1),rgba(var(--slate-rgb),0))]"
      />

      <Container className="relative z-[1]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[26px] flex flex-wrap items-center gap-[9px] text-[13px] text-white/[0.82]"
          >
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <CrumbChevronIcon className="h-[13px] w-[13px] opacity-50" />
            <b className="font-semibold">{SUPPORT_HERO.crumb}</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow tone="gold">{SUPPORT_HERO.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="max-w-[14ch] font-serif text-[clamp(38px,5.6vw,66px)] font-semibold leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.45)]">
            {SUPPORT_HERO.titleLead}
            <Highlight tone="gold">{SUPPORT_HERO.titleAccent}</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-[18px] max-w-[52ch] text-[17.5px] leading-[1.6] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            {SUPPORT_HERO.lede}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-10 max-w-[600px]">
            <SupportSearchBox />
            <p className="mt-3 pl-1.5 text-[12.5px] text-[rgba(244,241,234,0.7)]">
              {SUPPORT_HERO.searchHint}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
