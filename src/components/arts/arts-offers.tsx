import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ARTS_OFFERS } from "@/data/arts";

/**
 * "Three tables to join" — arts offers as taped photo cards: an inset photo on
 * white, held by a strip of tape straddling the card's top edge. No icon badge;
 * the tape carries the handmade note instead.
 */
export function ArtsOffers() {
  return (
    <Section className="py-[14vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="What’s offered"
          title={
            <>
              Three tables to <Highlight>join.</Highlight>
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-3 gap-10 max-[960px]:mx-auto max-[960px]:max-w-[560px] max-[960px]:grid-cols-1">
        {ARTS_OFFERS.map((offer, index) => (
          <Reveal key={offer.id} delay={(index + 1) as RevealDelay}>
            <article className="group relative h-full rounded-[22px] bg-white p-4 shadow-[0_18px_40px_-12px_rgba(24,24,24,0.14)] transition-[transform,box-shadow] duration-[450ms] ease-brand hover:-translate-y-[6px] hover:shadow-[0_34px_60px_-20px_rgba(24,24,24,0.22)]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[-17px] h-[30px] w-[112px] -translate-x-1/2 rounded-[2px] bg-gold/30"
              />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
                <Image
                  src={offer.image.src}
                  alt={offer.image.alt}
                  fill
                  sizes="(max-width: 960px) 560px, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-[1.06]"
                />
              </div>

              <div className="px-4 pb-5 pt-6">
                <h3 className="mb-2 font-serif text-[21px] font-semibold">
                  {offer.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-muted">
                  {offer.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
