import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { COOKING_OFFERS } from "@/data/cooking";

/** "Three ways to begin" — cooking offers as photo cards (no icon badge). */
export function CookingOffers() {
  return (
    <Section className="border-b border-line bg-[linear-gradient(180deg,var(--ivory),var(--sand)_60%,var(--ivory))] py-24">
      <Reveal>
        <SectionHeading
          className="mb-12"
          eyebrow="What’s cooking"
          title={
            <>
              Three ways to <Highlight>begin.</Highlight>
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-3 gap-[30px] max-[960px]:mx-auto max-[960px]:max-w-[560px] max-[960px]:grid-cols-1">
        {COOKING_OFFERS.map((offer, index) => (
          <Reveal key={offer.id} delay={(index + 1) as RevealDelay}>
            <article className="group h-full overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_20px_44px_rgba(18,19,28,0.1)] transition-[transform,box-shadow] duration-[450ms] hover:-translate-y-2 hover:shadow-[0_36px_66px_rgba(18,19,28,0.18)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={offer.image.src}
                  alt={offer.image.alt}
                  fill
                  sizes="(max-width: 960px) 560px, 33vw"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-col gap-2 px-6 pb-[26px] pt-[22px]">
                <h3 className="font-serif text-[20px] font-bold text-ink">{offer.title}</h3>
                <p className="text-[14px] leading-[1.6] text-muted">{offer.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
