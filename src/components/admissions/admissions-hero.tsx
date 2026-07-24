import Link from "next/link";

import { Container } from "@/components/common/container";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/**
 * College Admissions hero: a full-bleed background video under a diagonal dark
 * wash, with left-aligned, vertically-centered copy — matching the shared
 * subject-hero design (Arts, Cooking, …).
 */
export function AdmissionsHero() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(210,162,65,0.2)] bg-[#12131C]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(105deg,rgba(15,17,32,0.92)_0%,rgba(20,22,37,0.84)_42%,rgba(20,22,37,0.6)_72%,rgba(20,22,37,0.5)_100%)] after:content-['']"
      >
        <HeroVideo src="/assets/admissions/videos/hero.mp4" />
      </div>

      <Container className="relative z-[2]">
        <div className="grid min-h-[92vh] max-w-[760px] items-center pt-20 max-[960px]:min-h-0 max-[960px]:pb-[50px] max-[960px]:pt-[120px]">
          <div>
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="mb-[22px] flex flex-wrap items-center gap-[10px] text-[12.5px] tracking-[0.06em] text-[rgba(246,245,241,0.6)]"
              >
                <Link href="/" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/browse" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
                  Subjects
                </Link>
                <span aria-hidden="true">/</span>
                <b className="font-semibold text-[rgba(246,245,241,0.92)]">
                  College Admissions
                </b>
              </nav>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="mb-[22px] font-serif text-[clamp(38px,5.4vw,64px)] font-extrabold leading-[1.06] text-[#F6F5F1] [text-shadow:0_2px_26px_rgba(0,0,0,0.4)]">
                College Admissions,
                <br />
                <Highlight tone="gold">thoughtfully guided.</Highlight>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mb-8 max-w-[460px] text-[17.5px] leading-[1.7] text-[rgba(246,245,241,0.78)]">
                One counselor, one student, one honest plan — from the first
                junior-year conversation to the day the decision is made. We guide
                the process; the achievement stays yours.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-wrap gap-[14px]">
                <Button href="/browse" variant="primary">
                  Browse educators
                </Button>
                <Button href="/how-it-works" variant="ghost">
                  How it works
                </Button>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <p className="mt-[18px] text-[12.5px] text-[rgba(246,245,241,0.6)]">
                Parents stay in the loop at every step — all contact runs through
                you.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
