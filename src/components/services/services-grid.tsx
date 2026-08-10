import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { ServiceCard } from "@/components/services/service-card";
import { SERVICES, type ServiceItem } from "@/data/services";

/** The six subject cards, three up, with the starting-rate note beneath. */
export function ServicesGrid({
  services = SERVICES,
}: {
  /** Cards with "from" rates already overlaid from the live pricing snapshot. */
  services?: ServiceItem[];
}) {
  return (
    <Section className="bg-ivory pb-[4vh] pt-[8vh]">
      <div className="grid grid-cols-3 gap-[22px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={((index % 6) + 1) as RevealDelay}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-[26px] text-center text-[13px] italic text-muted">
          Rates shown are the current starting point for each subject — educators are
          independent and set their own hourly rate, always shown on their profile.
        </p>
      </Reveal>
    </Section>
  );
}
