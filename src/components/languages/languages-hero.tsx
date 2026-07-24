import Link from "next/link";
import type { CSSProperties } from "react";

import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { GreetingGlobe } from "./greeting-globe";
import styles from "./languages-hero.module.css";

/** Per-star animation timing custom props. */
type StarStyle = CSSProperties & { "--d": string; "--dl": string };

interface Star {
  left: string;
  top: string;
  size: string;
  gold?: boolean;
  d: string;
  dl: string;
}

/** Fixed starfield positions (from the source) — deterministic for SSR. */
const STARS: Star[] = [
  { left: "32.7%", top: "16.2%", size: "2.4px", d: "2.6s", dl: "2.1s" },
  { left: "6.7%", top: "49.7%", size: "1.3px", gold: true, d: "3.7s", dl: "0.3s" },
  { left: "42.6%", top: "79.7%", size: "1.4px", d: "3.1s", dl: "2.5s" },
  { left: "57.6%", top: "39.3%", size: "3.0px", d: "2.5s", dl: "3.4s" },
  { left: "15.1%", top: "13.1%", size: "1.8px", d: "4.9s", dl: "0.7s" },
  { left: "63.6%", top: "37.0%", size: "2.2px", gold: true, d: "2.6s", dl: "0.2s" },
  { left: "67.7%", top: "42.2%", size: "1.8px", d: "4.2s", dl: "1.8s" },
  { left: "78.8%", top: "67.7%", size: "1.6px", d: "4.2s", dl: "2.1s" },
  { left: "72.5%", top: "29.1%", size: "3.0px", d: "2.8s", dl: "1.7s" },
  { left: "15.9%", top: "48.0%", size: "1.3px", d: "4.5s", dl: "3.1s" },
  { left: "86.8%", top: "31.5%", size: "2.5px", d: "4.2s", dl: "2.3s" },
  { left: "83.3%", top: "90.8%", size: "2.1px", d: "4.5s", dl: "0.2s" },
  { left: "64.4%", top: "95.4%", size: "2.7px", d: "3.3s", dl: "1.5s" },
  { left: "3.2%", top: "45.4%", size: "1.5px", d: "2.8s", dl: "0.2s" },
  { left: "13.7%", top: "25.3%", size: "1.9px", d: "5.1s", dl: "0.3s" },
  { left: "54.8%", top: "85.0%", size: "2.7px", d: "5.1s", dl: "1.1s" },
  { left: "36.2%", top: "85.1%", size: "2.9px", d: "2.9s", dl: "0.7s" },
  { left: "23.9%", top: "47.6%", size: "2.3px", d: "3.2s", dl: "0.0s" },
  { left: "37.2%", top: "55.2%", size: "2.9px", d: "4.5s", dl: "2.1s" },
  { left: "67.3%", top: "7.1%", size: "2.8px", d: "4.8s", dl: "3.5s" },
  { left: "39.5%", top: "39.5%", size: "1.4px", gold: true, d: "4.4s", dl: "0.2s" },
  { left: "21.5%", top: "17.3%", size: "1.8px", gold: true, d: "2.6s", dl: "0.0s" },
  { left: "10.9%", top: "36.2%", size: "1.2px", gold: true, d: "5.1s", dl: "2.5s" },
  { left: "25.7%", top: "34.7%", size: "1.9px", d: "2.8s", dl: "3.4s" },
  { left: "46.7%", top: "47.5%", size: "1.4px", d: "2.7s", dl: "1.4s" },
  { left: "82.2%", top: "17.2%", size: "1.2px", gold: true, d: "5.3s", dl: "2.1s" },
  { left: "54.2%", top: "4.5%", size: "2.2px", d: "5.4s", dl: "3.5s" },
  { left: "26.6%", top: "36.5%", size: "1.5px", d: "4.8s", dl: "2.1s" },
  { left: "33.3%", top: "23.0%", size: "2.7px", d: "5.5s", dl: "3.4s" },
  { left: "81.2%", top: "71.5%", size: "1.6px", gold: true, d: "4.0s", dl: "1.4s" },
  { left: "3.7%", top: "28.3%", size: "1.7px", d: "4.5s", dl: "3.8s" },
  { left: "92.8%", top: "94.9%", size: "2.9px", d: "3.5s", dl: "0.9s" },
  { left: "20.3%", top: "21.2%", size: "2.3px", d: "5.2s", dl: "3.4s" },
  { left: "65.0%", top: "77.2%", size: "1.4px", d: "4.4s", dl: "3.6s" },
  { left: "74.5%", top: "46.9%", size: "1.5px", d: "4.8s", dl: "1.3s" },
  { left: "96.2%", top: "39.2%", size: "1.9px", gold: true, d: "5.3s", dl: "2.9s" },
  { left: "13.4%", top: "16.2%", size: "2.8px", d: "4.9s", dl: "0.6s" },
  { left: "97.1%", top: "63.8%", size: "1.8px", gold: true, d: "4.1s", dl: "0.5s" },
];

/**
 * Languages hero: a dark, star-flecked split with the copy on the left and the
 * interactive greeting globe on the right.
 */
export function LanguagesHero() {
  return (
    <section className="relative grid min-h-[94vh] grid-cols-[1.02fr_0.98fr] items-center gap-[30px] overflow-hidden bg-[radial-gradient(120%_90%_at_70%_20%,#1C2038_0%,#141625_45%,#0F1120_100%)] pt-[70px] max-[960px]:min-h-0 max-[960px]:grid-cols-1 max-[960px]:pt-[110px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        {STARS.map((star, index) => (
          <i
            key={index}
            className={cn(styles.star, star.gold && styles.gold)}
            style={
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                "--d": star.d,
                "--dl": star.dl,
              } as StarStyle
            }
          />
        ))}
      </div>

      <div className="relative z-[2] max-w-[640px] pl-[max(32px,calc((100vw-1180px)/2))] max-[960px]:max-w-none max-[960px]:px-6">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[22px] flex flex-wrap items-center gap-[10px] text-[12.5px] tracking-[0.06em] text-[rgba(246,245,241,0.6)]"
          >
            <Link href="/" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/#subjects2" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
              Subjects
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold text-[rgba(246,245,241,0.92)]">Languages</b>
          </nav>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="mb-[22px] font-serif text-[clamp(38px,5.4vw,64px)] font-extrabold leading-[1.06] text-[#F6F5F1] [text-shadow:0_2px_26px_rgba(0,0,0,0.4)]">
            Languages,
            <br />
            <Highlight tone="gold">spoken from day one.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mb-8 max-w-[460px] text-[17.5px] leading-[1.7] text-[rgba(246,245,241,0.78)]">
            Spanish, French, and Hindi with educators who teach conversation first — grammar
            sneaks in while you&rsquo;re busy actually talking.
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
          <p className="mt-[18px] text-[12.5px] text-[rgba(246,245,241,0.6)]">
            All ages welcome — for learners under 18, parents handle contact and scheduling.
          </p>
        </Reveal>
      </div>

      <Reveal delay={2} className="relative z-[2]">
        <GreetingGlobe />
      </Reveal>
    </section>
  );
}
