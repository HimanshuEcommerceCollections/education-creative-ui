"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { ABOUT_MEDIA, ABOUT_VALUES } from "@/data/about";
import { cn } from "@/lib/utils";

import { ABOUT_ICONS, ChevronLeftIcon, ChevronRightIcon } from "./about-icons";
import styles from "./about-values.module.css";

const COUNT = ABOUT_VALUES.length;
const START = Math.floor(COUNT / 2);

/** Position/opacity/stacking for one card given its distance from center. */
function cardStyle(offset: number): CSSProperties {
  const abs = Math.abs(offset);
  return {
    transform: `translateX(${offset * 232}px) translateZ(${-abs * 170}px) rotateY(${offset * -42}deg)`,
    opacity: abs > 2 ? 0 : abs === 0 ? 1 : 0.5,
    zIndex: 100 - abs,
    pointerEvents: abs > 2 ? "none" : "auto",
  };
}

/**
 * Values shown as a scroll-pinned 3D coverflow. Scrolling the tall track steps
 * through the cards; the arrows, clicks, and ←/→ keys drive it manually (and
 * briefly pause the scroll sync). Reduced motion / small screens flatten it to
 * a horizontal scroll strip via the CSS module.
 */
export function AboutValues() {
  const pinRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const [current, setCurrent] = useState(START);

  const clamp = (i: number) => Math.max(0, Math.min(COUNT - 1, i));
  const nudge = () => {
    holdUntil.current = Date.now() + 3000;
  };
  const select = useCallback((i: number) => {
    setCurrent(clamp(i));
    nudge();
  }, []);
  const step = useCallback((delta: number) => {
    setCurrent((c) => clamp(c + delta));
    nudge();
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    if (!pin || !sticky) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      // Only sync while the panel is actually pinned (skip mobile/flattened).
      if (getComputedStyle(sticky).position !== "sticky") return;
      if (Date.now() < holdUntil.current) return;
      const total = pin.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-pin.getBoundingClientRect().top / total, 0), 1);
      setCurrent(Math.min(Math.floor(progress * COUNT), COUNT - 1));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const rect = pin.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      step(e.key === "ArrowRight" ? 1 : -1);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [step]);

  return (
    <section ref={pinRef} className="relative h-[300vh] bg-[#141416] max-[640px]:h-auto motion-reduce:h-auto">
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden max-[640px]:static max-[640px]:h-auto max-[640px]:py-[12vh] motion-reduce:static motion-reduce:h-auto motion-reduce:py-[14vh]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,18,20,0.86)_0%,rgba(14,14,16,0.84)_60%,rgba(16,16,18,0.9)_100%)] after:content-[''] before:absolute before:inset-0 before:z-[1] before:bg-[radial-gradient(70%_60%_at_78%_16%,rgba(210,162,65,0.14),rgba(14,14,16,0)_60%)] before:content-['']"
        >
          <Image
            src={ABOUT_MEDIA.valuesBg.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
        </div>

        <Container className="relative z-[2] w-full">
          <div className="mx-auto mb-[34px] max-w-[680px] text-center">
            <Eyebrow tone="gold" align="center">
              What We Value
            </Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
              Principles we <Highlight tone="gold">hold to.</Highlight>
            </h2>
            <p className="mx-auto mt-[14px] max-w-[560px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
              The same commitments guide every listing on the marketplace. Scroll — or use the
              arrows — to move through them.
            </p>
          </div>

          <div className={styles.cf}>
            <div className={styles.cfStage}>
              {ABOUT_VALUES.map((value, i) => {
                const Icon = ABOUT_ICONS[value.icon];
                const mid = i === current;
                return (
                  <article
                    key={value.title}
                    tabIndex={0}
                    onClick={() => select(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(i);
                      }
                    }}
                    aria-hidden={Math.abs(i - current) > 2}
                    style={cardStyle(i - current)}
                    className={cn(
                      styles.cfCard,
                      "flex cursor-pointer flex-col rounded-[22px] border bg-ivory px-8 py-9",
                      mid
                        ? "border-[rgba(46,58,115,0.28)] shadow-[0_34px_80px_-28px_rgba(46,58,115,0.5)]"
                        : "border-line shadow-[0_24px_60px_-30px_rgba(22,24,29,0.4)]",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-[26px] flex h-14 w-14 items-center justify-center rounded-[15px] transition-[background-color,transform] duration-500",
                        mid ? "scale-[1.06] bg-slate text-white" : "bg-[var(--chip-a)] text-slate",
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 font-serif text-2xl font-semibold tracking-[-0.01em]">
                      {value.title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-muted">{value.body}</p>
                    <div
                      className={cn(
                        "mt-auto pt-6 font-serif text-[13px] font-bold tracking-[0.14em]",
                        mid ? "text-gold" : "text-sand-2",
                      )}
                    >
                      {value.num}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={cn(styles.cfNav, "mt-7 flex justify-center gap-4")}>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous value"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-[1.5px] border-line bg-ivory text-ink transition-[transform,background-color,color,border-color] duration-[350ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-[3px] hover:border-slate hover:bg-slate hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next value"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-[1.5px] border-line bg-ivory text-ink transition-[transform,background-color,color,border-color] duration-[350ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-[3px] hover:border-slate hover:bg-slate hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
