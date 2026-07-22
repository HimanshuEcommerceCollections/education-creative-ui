import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { OfferCard } from "@/components/subject/offer-card";
import { OFFER_ICON_CLASS, OFFER_ICONS } from "@/components/subject/offer-icons";
import type { OfferItem } from "@/types/subject-page";

/** "Three ways in" offers grid — shared across subject pages. */
export function OfferSection({ offers }: { offers: OfferItem[] }) {
  return (
    <Section className="py-[14vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="What’s offered"
          title={
            <>
              Three ways <Highlight>in.</Highlight>
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {offers.map((offer, index) => {
          const Icon = OFFER_ICONS[offer.icon];
          return (
            <Reveal key={offer.id} delay={(index + 1) as RevealDelay}>
              <OfferCard
                image={offer.image}
                title={offer.title}
                description={offer.description}
                icon={<Icon className={OFFER_ICON_CLASS} />}
              />
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
