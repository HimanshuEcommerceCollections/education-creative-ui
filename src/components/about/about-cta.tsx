import Image from "next/image";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { ABOUT_MEDIA } from "@/data/about";

/** Closing call-to-action: browse educators or reach out, over a dark photo. */
export function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-[#141416] py-[18vh] text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,18,20,0.8)_0%,rgba(12,12,14,0.9)_100%)] after:content-['']"
      >
        <Image
          src={ABOUT_MEDIA.ctaBg.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1] max-w-[720px]">
        <Reveal>
          <h2 className="font-serif text-[clamp(32px,4.6vw,54px)] font-semibold leading-[1.06] tracking-[-0.02em] text-white">
            Find an educator that fits your <Highlight tone="gold">family.</Highlight>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-[18px] text-[16.5px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
            Browse vetted independent educators across six subjects in Raleigh — in your home or
            online, always with a parent in control.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
            <Button href="/#subjects2" variant="primary">
              Browse Educators
            </Button>
            <Button href="/contact" variant="ghost">
              Contact Us
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
