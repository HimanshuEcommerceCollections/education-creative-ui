import Image from "next/image";

import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { COPPA_POINTS } from "@/data/how-it-works";

import { ShieldIcon } from "./how-it-works-icons";

/** Parent-supervision (COPPA) band: a reassuring headline + three control points. */
export function CoppaBand() {
  return (
    <Section className="bg-ivory py-[12vh]">
      <Reveal>
        <div className="relative grid grid-cols-[0.8fr_1.2fr] items-center gap-11 overflow-hidden rounded-[24px] border border-line bg-sand p-[52px] max-[860px]:grid-cols-1 max-[860px]:gap-7 max-[860px]:p-[34px]">
          <div aria-hidden="true" className="absolute inset-0 z-0 opacity-[0.14]">
            <Image
              src="/assets/how-it-works/images/coppa-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-[1] flex items-center gap-[18px]">
            <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-[16px] bg-slate text-white">
              <ShieldIcon className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-[clamp(20px,2.2vw,26px)] font-semibold tracking-[-0.01em]">
              For learners under 18, a parent or guardian books and supervises every session —
              always.
            </h3>
          </div>

          <div className="relative z-[1] grid grid-cols-3 gap-6 max-[640px]:grid-cols-1">
            {COPPA_POINTS.map((point) => (
              <div key={point.title} className="border-l-2 border-gold pl-4">
                <b className="mb-1 block font-serif text-[14.5px] font-semibold">{point.title}</b>
                <span className="text-[13.5px] leading-[1.5] text-muted">{point.body}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
