import Image from "next/image";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

/** Closing call-to-action nudging visitors to browse educators first. */
export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-[#141416] py-[18vh] text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,18,20,0.8)_0%,rgba(12,12,14,0.9)_100%)] after:content-['']"
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
            Prefer to <Highlight tone="gold">browse</Highlight> first?
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-[18px] text-[16.5px] leading-[1.6] text-[rgba(244,241,234,0.78)]">
            Explore vetted independent educators by subject, format, and schedule — then reach out
            when you find a fit. A parent or guardian books and supervises for any learner under 18.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
            <Button href="/browse" variant="primary">
              Browse Educators
            </Button>
            <Button href="/how-it-works" variant="ghost">
              How It Works
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
