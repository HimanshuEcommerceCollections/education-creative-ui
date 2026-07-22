import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { TRUST_CARDS } from "@/data/how-it-works";

import { TRUST_ICONS } from "./how-it-works-icons";
import styles from "./trust-safety.module.css";

/** Trust & Safety: glassmorphism cards over a dark, photo-backed band. */
export function TrustSafety() {
  return (
    <section id="trust" className="relative overflow-hidden bg-sand py-[16vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.88),rgba(18,19,28,0.82))] after:content-['']"
      >
        <Image
          src="/assets/how-it-works/images/trust-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <div className="mb-[76px] max-w-[680px]">
            <Eyebrow tone="gold">Trust &amp; Safety</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
              Every educator is <Highlight tone="gold">reviewed</Highlight> before they&rsquo;re
              listed.
            </h2>
            <p className="mt-[14px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
              We earn trust with process, not promises.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
          {TRUST_CARDS.map((card, index) => {
            const Icon = TRUST_ICONS[card.icon];
            return (
              <Reveal key={card.title} delay={(index + 1) as RevealDelay}>
                <div
                  className={`${styles.glassCard} group h-full overflow-hidden rounded-[18px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_16px_40px_-24px_rgba(0,0,0,0.55)] backdrop-blur-[16px] backdrop-saturate-[1.4] transition-[transform,background,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-2 hover:border-[rgba(210,162,65,0.45)] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.06)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_34px_66px_-28px_rgba(0,0,0,0.7)]`}
                >
                  <div className="relative z-[1] mb-[22px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-[rgba(210,162,65,0.28)] bg-[rgba(210,162,65,0.18)] text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,0.7,0.2,1)] group-hover:rotate-[-4deg] group-hover:scale-[1.08]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative z-[1] mb-[10px] font-serif text-[19px] font-semibold tracking-[-0.005em] text-white">
                    {card.title}
                  </h3>
                  <p className="relative z-[1] text-[14.5px] leading-[1.6] text-[rgba(244,241,234,0.75)]">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
