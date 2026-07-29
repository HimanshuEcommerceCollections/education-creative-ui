import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { SUPPORT_CONTACT_DETAILS } from "@/data/support";

import { ArrowRightIcon, SUPPORT_CONTACT_ICONS } from "./support-icons";

/**
 * "Still need a hand?": three white detail cards over a dark washed photo, with
 * a route through to the contact form. The heading is inlined rather than using
 * SectionHeading because that block is styled for light sections.
 */
export function SupportContactStrip() {
  return (
    <Section
      container={false}
      className="relative overflow-hidden bg-[#141416] pb-[15vh] pt-[13vh]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.8)_0%,rgba(13,13,15,0.87)_100%)] after:content-['']"
      >
        <Image
          src="/assets/support/images/contact-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <div className="mb-[76px] max-w-[680px]">
            <Eyebrow tone="gold">Still need a hand?</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
              Reach a real <Highlight tone="gold">person.</Highlight>
            </h2>
            <p className="mt-[14px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.82)]">
              Can&rsquo;t find what you need? Our team is glad to help during business hours.
            </p>
          </div>
        </Reveal>

        <div className="mb-11 grid grid-cols-3 gap-[22px] max-[760px]:grid-cols-1">
          {SUPPORT_CONTACT_DETAILS.map((detail, index) => {
            const Icon = SUPPORT_CONTACT_ICONS[detail.icon];
            return (
              <Reveal key={detail.label} delay={(index + 1) as RevealDelay}>
                <div className="flex h-full items-start gap-4 rounded-[20px] border border-line bg-white p-7 transition-[transform,box-shadow] duration-[400ms] ease-brand hover:-translate-y-[4px] hover:shadow-[0_22px_48px_-30px_rgba(var(--slate-rgb),0.36)]">
                  <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[12px] bg-[var(--chip-a)] text-slate">
                    <Icon className="h-[22px] w-[22px]" />
                  </span>
                  <div>
                    <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {detail.label}
                    </div>
                    <div className="font-serif text-[16px] font-semibold leading-[1.35] tracking-[-0.01em]">
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-slate transition-colors hover:text-gold"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={4} className="text-center">
          <Button href="/contact" variant="primary">
            Contact us
            <ArrowRightIcon className="h-[18px] w-[18px]" />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
