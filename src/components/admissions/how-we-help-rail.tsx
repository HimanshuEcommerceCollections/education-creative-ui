"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ADMISSIONS_HELP } from "@/data/admissions";

import styles from "./how-we-help-rail.module.css";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * "How we help": a sticky section whose vertical scroll drives a horizontal
 * rail of cards, each warped in 3D by its distance from centre. Below 860px the
 * layout falls back to a native horizontal scroll-snap strip (see the module).
 */
export function HowWeHelpRail() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let raf = 0;
    const desktop = () => window.matchMedia("(min-width: 861px)").matches;
    const reduce = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      raf = 0;
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card != null,
      );
      if (!cards.length) return;

      // Mobile: native scroll-snap handles it — clear any inline transforms.
      if (!desktop()) {
        track.style.transform = "";
        cards.forEach((card) => {
          card.style.transform = "";
          card.classList.remove(styles.cardFocus);
        });
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const total = wrap.offsetHeight - vh;
      if (total <= 0) return;

      const progress = clamp(-wrap.getBoundingClientRect().top / total, 0, 1);
      const first = cards[0];
      const last = cards[cards.length - 1];
      const xStart = first.offsetLeft + first.offsetWidth / 2 - vw / 2;
      const xEnd = last.offsetLeft + last.offsetWidth / 2 - vw / 2;
      const x = xStart + progress * (xEnd - xStart);
      track.style.transform = `translateX(${-x}px)`;

      const softMotion = reduce();
      const cx = vw / 2;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const d = (rect.left + rect.width / 2 - cx) / vw;
        if (softMotion) {
          card.style.transform = "";
        } else {
          const rot = clamp(-d * 30, -26, 26);
          const z = -Math.min(240, Math.abs(d) * 300);
          const scale = 1 - Math.min(0.1, Math.abs(d) * 0.12);
          card.style.transform = `rotateY(${rot}deg) translateZ(${z}px) scale(${scale})`;
        }
        card.classList.toggle(styles.cardFocus, Math.abs(d) < 0.18);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={wrapRef} className={styles.wrap}>
      <div className={styles.sticky}>
        <Container className={styles.head}>
          <Reveal>
            <SectionHeading
              eyebrow="How we help"
              title={
                <>
                  Three kinds of <Highlight>support.</Highlight>
                </>
              }
            />
          </Reveal>
        </Container>

        <div className={styles.stage}>
          <div ref={trackRef} className={styles.track}>
            {ADMISSIONS_HELP.map((card, index) => (
              <div
                key={card.num}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={styles.card}
              >
                <div className={styles.bg}>
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(max-width: 860px) 82vw, 460px"
                  />
                </div>
                <div className={styles.shade} aria-hidden="true" />
                <div className={styles.txt}>
                  <div className={styles.num}>{card.num}</div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.hint} aria-hidden="true">
          <i />
          <span>Keep scrolling</span>
          <i />
        </div>
      </div>
    </section>
  );
}
