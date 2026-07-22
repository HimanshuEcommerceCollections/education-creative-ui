import Link from "next/link";

import { Container } from "@/components/common/container";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/**
 * College Admissions hero: a full-bleed background video under a dark wash,
 * with centered copy. Distinct from the other subject heroes (which are
 * bottom-aligned) — this one is centered, per the source design.
 */
export function AdmissionsHero() {
  return (
    <section className="relative flex min-h-[94vh] items-center justify-center overflow-hidden bg-[#12131C] text-center">
      <div aria-hidden="true" className="absolute inset-0">
        <HeroVideo src="/assets/admissions/videos/hero.mp4" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,19,28,0.74)_0%,rgba(18,19,28,0.58)_46%,rgba(18,19,28,0.9)_100%)]"
      />

      <Container className="relative z-[2]">
        <div className="mx-auto flex max-w-[880px] flex-col items-center gap-[22px] pb-[100px] pt-[150px] max-[960px]:pb-20 max-[960px]:pt-[130px]">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center justify-center gap-[10px] text-[12px] uppercase tracking-[0.12em] text-[rgba(246,245,241,0.6)]"
            >
              <Link href="/" className="no-underline hover:text-gold">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/browse" className="no-underline hover:text-gold">
                Subjects
              </Link>
              <span aria-hidden="true">/</span>
              <b className="font-semibold text-[rgba(246,245,241,0.92)]">
                College Admissions
              </b>
            </nav>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="font-serif text-[clamp(34px,4.6vw,62px)] font-extrabold leading-[1.08] text-[#F6F5F1] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
              College Admissions,
              <br />
              <Highlight tone="gold">thoughtfully guided.</Highlight>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="mx-auto max-w-[520px] text-[17.5px] leading-[1.7] text-[rgba(246,245,241,0.78)] [text-shadow:0_1px_12px_rgba(0,0,0,0.3)]">
              One counselor, one student, one honest plan — from the first
              junior-year conversation to the day the decision is made. We guide
              the process; the achievement stays yours.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="flex flex-wrap justify-center gap-[14px]">
              <Button href="/browse" variant="primary">
                Browse educators
              </Button>
              <Button href="/how-it-works" variant="ghost">
                How it works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <p className="text-[12.5px] text-[rgba(246,245,241,0.55)]">
              Parents stay in the loop at every step — all contact runs through
              you.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
