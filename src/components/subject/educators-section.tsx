import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { EducatorCard } from "@/components/subject/educator-card";
import type { EducatorRating } from "@/lib/educators/rating";
import type { ImageAsset } from "@/types/media";
import type { SubjectEducator } from "@/types/subject-page";

interface EducatorsSectionProps {
  /** Headline; use <Highlight tone="gold"> for the accent. */
  title: ReactNode;
  bgImage: ImageAsset;
  educators: SubjectEducator[];
  /**
   * Published ratings by educator slug (a card's `id`), loaded by the page from
   * the API directory. Sparse: a card whose id is absent shows no rating pill.
   */
  ratings?: Record<string, EducatorRating>;
  /** Optional supervision/COPPA line rendered, centered, below the cards. */
  note?: string;
}

/** Educators section: photo backdrop with a light heading + hover-reveal cards. */
export function EducatorsSection({
  title,
  bgImage,
  educators,
  ratings = {},
  note,
}: EducatorsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-sand py-[14vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.86),rgba(18,19,28,0.8))] after:content-['']"
      >
        <Image
          src={bgImage.src}
          alt={bgImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-14 max-[960px]:grid-cols-1 max-[960px]:gap-[26px]">
          <Reveal>
            <div className="max-w-[680px]">
              <Eyebrow tone="gold">Your educators</Eyebrow>
              <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white">
                {title}
              </h2>
              <p className="mt-[14px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
                Sample profiles — every educator is background checked with
                credentials reviewed. Hover a card to meet them.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-[22px] max-[640px]:grid-cols-1">
            {educators.map((educator, index) => (
              <Reveal key={educator.id} delay={(index + 1) as RevealDelay}>
                <EducatorCard educator={educator} rating={ratings[educator.id]} />
              </Reveal>
            ))}
          </div>
        </div>

        {note ? (
          <Reveal delay={3}>
            <p className="mt-[30px] text-center text-[12px] italic text-[rgba(244,241,234,0.6)]">
              {note}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
