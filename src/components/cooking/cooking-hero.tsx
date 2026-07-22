import Link from "next/link";

import { Container } from "@/components/common/container";
import { HeroVideo } from "@/components/common/hero-video";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/**
 * Cooking hero: a full-bleed kitchen video under a dark diagonal wash and a
 * deep indigo radial base, with single-column copy and a gold primary CTA.
 */
export function CookingHero() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(210,162,65,0.2)] bg-[radial-gradient(120%_90%_at_70%_22%,#1C2038_0%,#141625_46%,#0F1120_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(105deg,rgba(15,17,32,0.92)_0%,rgba(20,22,37,0.84)_42%,rgba(20,22,37,0.6)_72%,rgba(20,22,37,0.5)_100%)] after:content-['']"
      >
        <HeroVideo src="/assets/cooking/videos/hero.mp4" />
      </div>

      <Container className="relative z-[2]">
        <div className="grid min-h-[92vh] max-w-[760px] items-center pt-20 max-[960px]:min-h-0 max-[960px]:pb-[50px] max-[960px]:pt-[120px]">
          <div>
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="mb-[22px] flex gap-[10px] text-[12.5px] tracking-[0.06em] text-[rgba(246,245,241,0.6)]"
              >
                <Link href="/" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/browse" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
                  Subjects
                </Link>
                <span aria-hidden="true">/</span>
                <b className="font-semibold text-[rgba(246,245,241,0.92)]">Cooking</b>
              </nav>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="mb-[22px] font-serif text-[clamp(38px,5.4vw,64px)] font-extrabold leading-[1.06] text-[#F6F5F1] [text-shadow:0_2px_26px_rgba(0,0,0,0.4)]">
                Master the <Highlight tone="gold">heat.</Highlight>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mb-8 max-w-[460px] text-[17.5px] leading-[1.7] text-[rgba(246,245,241,0.76)]">
                The one thing every home cook fears — and the one thing that changes everything.
                Learn to read a flame, from a gentle poach to a fearless sear, with a patient cook
                beside you.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-wrap gap-[14px]">
                <Button href="/browse" variant="gold">
                  Browse educators
                </Button>
                <Button href="/how-it-works" variant="ghost">
                  How it works
                </Button>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <p className="mt-[18px] text-[12.5px] text-[rgba(246,245,241,0.56)]">
                Kitchen safety guidance included — parents book and supervise for under-18s.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
