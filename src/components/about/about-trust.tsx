import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { ABOUT_MEDIA, ABOUT_TRUST_CARDS } from "@/data/about";

import { ABOUT_ICONS } from "./about-icons";

/** "How we earn trust" — four safeguard cards over a dark, photo-backed band. */
export function AboutTrust() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-[15vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.88),rgba(16,16,18,0.9))] after:content-['']"
      >
        <Image
          src={ABOUT_MEDIA.trustBg.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.42]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[radial-gradient(80%_60%_at_84%_100%,rgba(210,162,65,0.12)_0%,rgba(20,20,22,0)_60%),radial-gradient(70%_50%_at_12%_2%,rgba(255,255,255,0.05)_0%,rgba(20,20,22,0)_55%)]"
      />

      <Container className="relative z-[2]">
        <Reveal>
          <div className="mx-auto mb-[76px] max-w-[680px] text-center">
            <Eyebrow tone="gold" align="center">
              How We Earn Trust
            </Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
              Process, not <Highlight tone="gold">promises.</Highlight>
            </h2>
            <p className="mx-auto mt-[14px] max-w-[560px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
              The safeguards that sit behind every profile and every booking on the platform.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-4 gap-[22px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {ABOUT_TRUST_CARDS.map((card, i) => {
            const Icon = ABOUT_ICONS[card.icon];
            return (
              <Reveal key={card.title} delay={(i + 1) as RevealDelay}>
                <div className="group h-full rounded-[18px] border border-white/[0.12] bg-white/[0.05] p-[32px_28px] transition-[transform,background-color,border-color] duration-500 ease-brand hover:-translate-y-[6px] hover:border-[rgba(210,162,65,0.4)] hover:bg-white/[0.08]">
                  <div className="mb-[22px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[rgba(210,162,65,0.16)] text-gold transition-transform duration-500 group-hover:scale-[1.08]">
                    <Icon className="h-[26px] w-[26px]" />
                  </div>
                  <h3 className="mb-[10px] font-serif text-[19px] font-semibold tracking-[-0.01em] text-white">
                    {card.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[rgba(244,241,234,0.72)]">
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
