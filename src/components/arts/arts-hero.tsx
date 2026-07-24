import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import styles from "./arts-hero.module.css";

/** Confetti-like custom props (CSS animation duration/delay per shape). */
type CfxStyle = CSSProperties & { "--d": string; "--dl": string };

interface Confetto {
  shape: "dot" | "tri" | "sq";
  style: CfxStyle;
}

/** Drifting decorations behind the collage — positions from the source. */
const CONFETTI: Confetto[] = [
  { shape: "dot", style: { left: "6%", top: "14%", width: 10, height: 10, background: "var(--gold)", "--d": "5s", "--dl": "0s" } },
  { shape: "sq", style: { left: "14%", top: "64%", width: 12, height: 12, background: "var(--slate)", opacity: 0.25, "--d": "6s", "--dl": "1s" } },
  { shape: "tri", style: { left: "44%", top: "10%", "--d": "7s", "--dl": "2s" } },
  { shape: "dot", style: { left: "52%", top: "80%", width: 8, height: 8, background: "var(--slate)", opacity: 0.3, "--d": "5.5s", "--dl": "0.5s" } },
  { shape: "dot", style: { right: "8%", top: "24%", width: 12, height: 12, background: "var(--gold)", opacity: 0.35, "--d": "6.5s", "--dl": "1.4s" } },
  { shape: "sq", style: { right: "20%", bottom: "10%", width: 10, height: 10, background: "var(--gold)", "--d": "5.2s", "--dl": "2.4s" } },
  { shape: "tri", style: { left: "70%", top: "56%", "--d": "8s", "--dl": "3s" } },
];

interface Polaroid {
  src: string;
  className: string;
  style: CSSProperties;
}

/** Three tilted instant-photos, stacked into a loose collage. */
const POLAROIDS: Polaroid[] = [
  {
    src: "/assets/arts/images/hero-pola-1.jpg",
    className: "rotate-[-5deg]",
    style: { left: "2%", top: "4%", width: "46%", height: "56%" },
  },
  {
    src: "/assets/arts/images/hero-pola-2.jpg",
    className: "z-[2] rotate-[4deg]",
    style: { right: "3%", top: "16%", width: "44%", height: "50%" },
  },
  {
    src: "/assets/arts/images/hero-pola-3.jpg",
    className: "z-[3] rotate-[-2deg]",
    style: { left: "22%", bottom: 0, width: "48%", height: "52%" },
  },
];

/**
 * Arts & Crafts hero: a photo backdrop under a diagonal dark wash (so the
 * light copy reads), floating confetti, and a polaroid collage on the right.
 */
export function ArtsHero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(105deg,rgba(16,18,31,0.9)_0%,rgba(18,19,28,0.82)_40%,rgba(18,19,28,0.62)_70%,rgba(18,19,28,0.5)_100%)] after:content-['']"
      >
        <Image
          src="/assets/arts/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className={cn(styles.cfx, "z-[1]")} aria-hidden="true">
        {CONFETTI.map((item, index) => (
          <i key={index} className={styles[item.shape]} style={item.style} />
        ))}
      </div>

      <Container className="relative z-[2]">
        <div className="grid min-h-[92vh] grid-cols-[1.05fr_0.95fr] items-center gap-10 pt-20 max-[960px]:min-h-0 max-[960px]:grid-cols-1 max-[960px]:pb-10 max-[960px]:pt-[120px]">
          <div>
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="mb-[22px] flex flex-wrap items-center gap-[10px] text-[12.5px] tracking-[0.06em] text-[rgba(246,245,241,0.62)]"
              >
                <Link href="/" className="no-underline hover:text-[rgba(246,245,241,0.92)]">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href="/#subjects2"
                  className="no-underline hover:text-[rgba(246,245,241,0.92)]"
                >
                  Subjects
                </Link>
                <span aria-hidden="true">/</span>
                <b className="font-semibold text-[rgba(246,245,241,0.92)]">
                  Arts &amp; Crafts
                </b>
              </nav>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="font-serif text-[clamp(38px,5.2vw,62px)] font-extrabold leading-[1.08] text-[#F6F5F1]">
                Arts &amp; Crafts,
                <br />
                <Highlight tone="gold">made by hand.</Highlight>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-[22px] max-w-[470px] text-[17.5px] leading-[1.7] text-[rgba(246,245,241,0.78)]">
                Painting, clay, paper, thread — unhurried afternoons where small
                hands (and grown-up ones) learn to make real things, with a
                patient educator beside them.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-wrap gap-[14px]">
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
                All materials guidance included — parents book and supervise for
                under-18s.
              </p>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div className="relative mx-auto h-[520px] w-full max-w-[560px] max-[960px]:h-[420px]">
              {POLAROIDS.map((pola) => (
                <div
                  key={pola.src}
                  style={pola.style}
                  className={`group/pola absolute rounded-[10px] border border-line bg-white p-[12px_12px_40px] shadow-[0_24px_50px_rgba(18,19,28,0.16)] transition-transform duration-[450ms] hover:z-[5] hover:-translate-y-2 hover:rotate-0 hover:scale-[1.03] ${pola.className}`}
                >
                  <span
                    aria-hidden="true"
                    style={{ transform: "translateX(-50%) rotate(-3deg)" }}
                    className="absolute -top-3 left-1/2 h-[22px] w-[74px] rounded-[2px] bg-[rgba(210,162,65,0.45)]"
                  />
                  <div className="relative h-full w-full overflow-hidden rounded-[6px]">
                    <Image
                      src={pola.src}
                      alt=""
                      fill
                      sizes="(max-width: 960px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
