import Image from "next/image";

import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { VETTING_IMAGE, VETTING_ITEMS } from "@/data/for-parents";

import { PARENT_ICONS } from "./for-parents-icons";

/**
 * How We Vet: a photo beside the four vetting stages. Its own component rather
 * than the shared FeatureSplit, whose feature list is a single dotted line of
 * prose — these items each carry an icon chip, a title, and a paragraph.
 */
export function VettingSplit() {
  return (
    <Section className="bg-ivory py-[13vh]">
      <div className="grid grid-cols-2 items-center gap-[54px] max-[860px]:grid-cols-1 max-[860px]:gap-9">
        <Reveal className="group relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-[0_40px_80px_-44px_rgba(24,24,24,0.4)]">
          <Image
            src={VETTING_IMAGE.src}
            alt={VETTING_IMAGE.alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1300ms] ease-brand group-hover:scale-105"
          />
        </Reveal>

        <Reveal delay={1}>
          <Eyebrow>How We Vet</Eyebrow>
          <h2 className="mb-[26px] font-serif text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Every educator earns their place.
          </h2>

          <div className="mt-[6px] grid gap-[18px]">
            {VETTING_ITEMS.map((item) => {
              const Icon = PARENT_ICONS[item.icon];
              return (
                <div key={item.title} className="flex gap-[15px]">
                  <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] bg-[var(--chip-a)] text-slate">
                    <Icon className="h-[19px] w-[19px]" />
                  </span>
                  <div>
                    <b className="mb-1 block font-serif text-[16px] font-semibold">
                      {item.title}
                    </b>
                    <p className="text-[14px] leading-[1.55] text-muted">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-[13px] italic text-muted">
            We’re careful with our language: vetting reduces risk, it doesn’t remove it. A
            parent’s supervision is always part of keeping sessions safe.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
