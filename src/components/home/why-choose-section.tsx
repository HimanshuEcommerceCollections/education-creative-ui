import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { WhyCard } from "@/components/home/why-card";
import { WHY_ITEMS } from "@/data/why-choose";

export function WhyChooseSection() {
  return (
    <Section className="bg-sand py-[18vh]">
      <Reveal>
        <SectionHeading
          align="center"
          className="mb-[76px]"
          eyebrow="Why families choose us"
          title={
            <>
              Built around <Highlight>your peace of mind.</Highlight>
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-4 gap-[14px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {WHY_ITEMS.map((item, index) => (
          <Reveal key={item.id} delay={(index + 1) as RevealDelay}>
            <WhyCard item={item} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
