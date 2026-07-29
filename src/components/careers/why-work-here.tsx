import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { CAREER_VALUES } from "@/data/careers";

import { VALUE_ICONS } from "./careers-icons";

/**
 * Why work with us: photo-topped cards whose slate icon chip straddles the
 * image edge, with the photo easing in on hover.
 */
export function WhyWorkHere() {
  return (
    <Section className="bg-ivory pb-[4vh] pt-[8vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="Why work with us"
          title={
            <>
              A team that takes <Highlight>trust seriously.</Highlight>
            </>
          }
          description="We’re early, deliberate, and close to the people we serve. Here’s what that feels like day to day."
        />
      </Reveal>

      <div className="grid grid-cols-4 gap-[22px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
        {CAREER_VALUES.map((value, index) => {
          const Icon = VALUE_ICONS[value.icon];
          return (
            <Reveal key={value.title} delay={(index + 1) as RevealDelay}>
              <article className="group h-full overflow-hidden rounded-[20px] border border-line bg-white transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[6px] hover:border-[rgba(46,58,115,0.22)] hover:shadow-[0_24px_48px_-26px_rgba(46,58,115,0.38)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={value.image.src}
                    alt={value.image.alt}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 ease-brand group-hover:scale-[1.06]"
                  />
                </div>

                <div className="px-6 pb-7 pt-6">
                  <span className="relative -mt-[46px] mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border-[3px] border-white bg-slate text-white shadow-[0_10px_24px_-12px_rgba(35,40,70,0.5)]">
                    <Icon className="h-[26px] w-[26px]" />
                  </span>

                  <h3 className="mb-[9px] font-serif text-[19px] font-semibold tracking-[-0.01em]">
                    {value.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.6] text-muted">{value.body}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
