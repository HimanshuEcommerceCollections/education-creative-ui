import Image from "next/image";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: browse educators or reach out, over a dark photo. */
export function HowItWorksCta() {
  return (
    <section className="relative overflow-hidden bg-[#0F1120] py-[18vh] text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(15,17,32,0.82)_0%,rgba(28,32,56,0.88)_100%)] after:content-['']"
      >
        <Image
          src="/assets/how-it-works/images/cta-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1] max-w-[720px]">
        <Reveal>
          <h2 className="font-serif text-[clamp(32px,4.6vw,54px)] font-semibold leading-[1.06] tracking-[-0.02em] text-white">
            Ready to find the right <Highlight tone="gold">fit?</Highlight>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-[18px] text-[16.5px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
            Browse six subjects of vetted, independent educators — or reach out first if you have
            questions.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
            <Button href="/browse" variant="primary">
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
