import Image from "next/image";

import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { APPROACH_POINTS } from "@/data/languages";

import styles from "./languages-approach.module.css";

/**
 * "Speak first, perfect later" — the teaching philosophy, paired with a photo
 * of learners around a table of flags.
 */
export function LanguagesApproach() {
  return (
    <Section
      className="border-b border-line bg-[linear-gradient(180deg,var(--ivory),var(--sand)_60%,var(--ivory))] py-[100px]"
      containerClassName="grid grid-cols-2 items-center gap-[60px] max-[960px]:grid-cols-1 max-[960px]:gap-[30px]"
    >
      <Reveal>
        <div className="group relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_30px_60px_-30px_rgba(24,24,24,0.22)] transition-[transform,box-shadow] duration-[450ms] hover:-translate-y-[6px] hover:shadow-[0_34px_60px_rgba(18,19,28,0.18)]">
          <Image
            src="/assets/languages/images/approach.jpg"
            alt="Students sharing languages around a table of flags"
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
          />
        </div>
      </Reveal>

      <div>
        <Reveal>
          <Eyebrow>The approach</Eyebrow>
          <h2 className="mb-5 font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em]">
            Speak first, <Highlight tone="gold">perfect later.</Highlight>
            <span className={styles.dots} aria-hidden="true">
              <s />
              <s />
              <s />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <p className="mb-4 text-[16px] leading-[1.75] text-muted">
            Textbooks start with grammar tables; conversations start with courage. Our educators
            get learners talking in the very first session — mistakes welcome, corrections gentle,
            confidence compounding.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <ul className="mt-[22px] grid gap-[13px]">
            {APPROACH_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink"
              >
                <i
                  aria-hidden="true"
                  className="mt-[7px] h-2 w-2 flex-none rounded-full bg-gold"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
