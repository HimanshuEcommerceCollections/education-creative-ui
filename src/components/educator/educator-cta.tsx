import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { bookHrefFor } from "@/constants/site";
import type { EducatorProfile } from "@/data/educators";

import { ArrowRightIcon } from "./educator-icons";

/** Closing booking prompt on a dark band, mirroring the hero treatment. */
export function EducatorCta({ profile }: { profile: EducatorProfile }) {
  return (
    <section className="bg-[linear-gradient(115deg,#121214_0%,#101012_52%,#161618_100%)] py-[clamp(64px,10vh,120px)]">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="font-serif text-[clamp(30px,4.4vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
              Ready to book with <Highlight tone="gold">{profile.firstName}?</Highlight>
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] text-[16px] leading-[1.65] text-[rgba(244,241,234,0.72)]">
              {profile.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
              <Button href={bookHrefFor(profile.slug)} variant="primary">
                Book a Session
                <ArrowRightIcon className="h-[17px] w-[17px]" />
              </Button>
              <Button href="/browse" variant="ghost">
                Browse other educators
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
