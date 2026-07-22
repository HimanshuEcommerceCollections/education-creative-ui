import Image from "next/image";
import type { CSSProperties } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";
import { ARCH_OFFERS, FLOATING_GREETINGS } from "@/data/languages";
import type { RevealDelay } from "@/lib/reveal";

import styles from "./arch-offers.module.css";

/** Per-word float timing + baseline rotation custom props. */
type FloatStyle = CSSProperties & { "--r": string; "--d": string; "--dl": string };

/**
 * "Three doors in" — the three languages taught, as arch-topped photo cards,
 * with translucent greeting words drifting behind them.
 */
export function ArchOffers() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ivory py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {FLOATING_GREETINGS.map((greeting, index) => (
          <span
            key={index}
            className={cn(
              styles.floatWord,
              "absolute select-none whitespace-nowrap font-serif font-extrabold",
            )}
            style={
              {
                left: greeting.left,
                top: greeting.top,
                fontSize: greeting.size,
                color: greeting.color,
                "--r": greeting.rotate,
                "--d": greeting.duration,
                "--dl": greeting.delay,
              } as FloatStyle
            }
          >
            {greeting.word}
          </span>
        ))}
      </div>

      <Container className="relative z-[1]">
        <Reveal className="mb-[50px] max-w-[680px]">
          <Eyebrow>What&rsquo;s offered</Eyebrow>
          <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Three doors <Highlight tone="gold">in.</Highlight>
          </h2>
        </Reveal>

        <div className="grid grid-cols-3 gap-[30px] max-[900px]:mx-auto max-[900px]:max-w-[420px] max-[900px]:grid-cols-1">
          {ARCH_OFFERS.map((offer, index) => (
            <Reveal key={offer.id} delay={(index + 1) as RevealDelay}>
              <article className="group overflow-hidden rounded-[200px_200px_20px_20px] border border-line bg-white text-center transition-[transform,box-shadow] duration-[450ms] hover:-translate-y-[10px] hover:shadow-[0_34px_60px_rgba(18,19,28,0.14)]">
                <div className="relative aspect-[4/4.4] overflow-hidden rounded-[200px_200px_0_0] border-b border-line">
                  <Image
                    src={offer.image.src}
                    alt={offer.image.alt}
                    fill
                    sizes="(max-width: 900px) 420px, 33vw"
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex flex-col items-center gap-[10px] px-[26px] pb-8 pt-[26px]">
                  <div className="font-serif text-[15px] font-extrabold tracking-[0.06em] text-gold">
                    {offer.greeting}
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-ink">{offer.title}</h3>
                  <p className="text-[14px] leading-[1.65] text-muted">{offer.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
