import Image from "next/image";

import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { CAREERS_MEDIA } from "@/data/careers";

/** "Don't see a fit?" — an open invitation for speculative applications. */
export function FitBand() {
  return (
    <Section className="bg-ivory py-[9vh]">
      <Reveal>
        <div className="relative flex flex-wrap items-center justify-between gap-[30px] overflow-hidden rounded-[24px] border border-line bg-[#1b2350] px-12 py-11 max-[720px]:px-[26px] max-[720px]:py-[34px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(100deg,rgba(15,16,22,0.9)_0%,rgba(17,18,24,0.74)_46%,rgba(20,22,28,0.42)_100%)] after:content-['']"
          >
            <Image
              src={CAREERS_MEDIA.fitBg.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-[1]">
            <h3 className="mb-2 font-serif text-[clamp(22px,2.6vw,30px)] font-semibold tracking-[-0.01em] text-white">
              Don&rsquo;t see a fit?
            </h3>
            <p className="max-w-[52ch] text-[15px] leading-[1.6] text-[rgba(244,241,234,0.86)]">
              We&rsquo;re always glad to meet thoughtful people who care about families and learning.
              Tell us how you&rsquo;d like to contribute.
            </p>
          </div>

          <Button href="/contact" variant="ghost" className="relative z-[1]">
            Reach out to us
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
