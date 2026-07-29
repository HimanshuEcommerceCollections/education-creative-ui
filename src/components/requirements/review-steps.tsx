import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { REVIEW_STEPS } from "@/data/requirements";
import { cn } from "@/lib/utils";

const LAST = REVIEW_STEPS.length - 1;

/**
 * Our review process: four numbered cards connected by short rules, over a
 * dark photo-backed band. The final step is gold to mark going live.
 */
export function ReviewSteps() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-[13vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.78)_0%,rgba(13,13,15,0.86)_100%)] after:content-['']"
      >
        <Image
          src="/assets/requirements/images/steps-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <div className="mb-[76px] max-w-[680px]">
            <Eyebrow tone="gold">Step by step</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
              Our review <Highlight tone="gold">process</Highlight>
            </h2>
            <p className="mt-[14px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.82)]">
              From application to your first listing. We aim to be thorough and clear at each
              stage &mdash; timelines vary with how quickly references respond.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-4 gap-[22px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {REVIEW_STEPS.map((step, index) => (
            <Reveal key={step.title} delay={(index + 1) as RevealDelay}>
              <div className="relative h-full rounded-[18px] border border-line bg-ivory px-[26px] pb-7 pt-[34px] transition-[transform,box-shadow] duration-[400ms] ease-brand hover:-translate-y-1 hover:shadow-[0_22px_46px_-26px_rgba(46,58,115,0.4)]">
                <div
                  className={cn(
                    "mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-full font-serif text-[19px] font-bold",
                    index === LAST ? "bg-gold text-[#1a1508]" : "bg-slate text-white",
                  )}
                >
                  {index + 1}
                </div>

                {index < LAST ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-13px] top-[56px] h-[2px] w-[26px] bg-[rgba(46,58,115,0.28)] max-[900px]:hidden"
                  />
                ) : null}

                <h3 className="mb-2 font-serif text-[18px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
