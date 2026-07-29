import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { FAQ_HELP_BAND } from "@/data/faq";

/**
 * Closing "still need help?" band: a desk photo under a slate-to-transparent
 * diagonal wash with a gold glow off the top-right, headline and copy on the
 * left, and the routes through to support and contact on the right.
 */
export function FaqHelpBand() {
  return (
    <Section className="bg-sand py-[12vh]">
      <Reveal>
        <div className="relative grid grid-cols-[1.3fr_auto] items-center gap-10 overflow-hidden rounded-[26px] bg-slate px-14 py-[60px] max-[760px]:grid-cols-1 max-[760px]:gap-7 max-[760px]:px-[30px] max-[760px]:py-10 max-[760px]:text-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(100deg,rgba(15,16,22,0.9)_0%,rgba(17,18,24,0.74)_46%,rgba(20,22,28,0.44)_100%),radial-gradient(120%_140%_at_90%_8%,rgba(210,162,65,0.2),rgba(210,162,65,0)_52%)] after:content-['']"
          >
            <Image
              src={FAQ_HELP_BAND.image.src}
              alt={FAQ_HELP_BAND.image.alt}
              fill
              sizes="(max-width: 1320px) 100vw, 1232px"
              className="object-cover"
            />
          </div>

          <div className="relative z-[1]">
            <h2 className="font-serif text-[clamp(24px,3.4vw,38px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
              {FAQ_HELP_BAND.titleLead}
              <Highlight tone="gold">{FAQ_HELP_BAND.titleAccent}</Highlight>
            </h2>
            <p className="mt-[14px] max-w-[44ch] text-[15.5px] leading-[1.6] text-[rgba(244,241,234,0.8)] max-[760px]:mx-auto">
              {FAQ_HELP_BAND.body}
            </p>
          </div>

          <div className="relative z-[1] flex flex-wrap gap-[14px] max-[760px]:justify-center">
            <Button href="/support">Visit Support</Button>
            <Button href="/contact" variant="ghost">
              Contact Us
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
