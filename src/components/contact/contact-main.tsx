import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";

import { ContactForm } from "./contact-form";
import { ContactInfoCard } from "./contact-info-card";

/** The primary contact layout: the message form beside the "reach us" card. */
export function ContactMain() {
  return (
    <Section className="pb-[12vh] pt-[2vh]">
      <div className="grid grid-cols-[1.12fr_0.88fr] items-start gap-[52px] max-[960px]:grid-cols-1 max-[960px]:gap-[38px]">
        <Reveal>
          <ContactForm />
        </Reveal>
        <Reveal delay={2}>
          <ContactInfoCard />
        </Reveal>
      </div>
    </Section>
  );
}
