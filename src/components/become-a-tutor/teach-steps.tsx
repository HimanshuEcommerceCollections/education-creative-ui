import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { TEACH_STEPS } from "@/data/become-a-tutor";

/**
 * From application to first session: four numbered steps threaded by a
 * slate-to-gold rule, over a dark photo-backed band. The rule turns vertical
 * when the stepper stacks below 820px.
 */
export function TeachSteps() {
  return (
    <section id="how" className="relative overflow-hidden bg-ink-deep py-[15vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0.86)_0%,rgba(13,13,15,0.9)_100%)] after:content-['']"
      >
        <Image
          src="/assets/become-a-tutor/images/steps-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <div className="mx-auto mb-[76px] max-w-[680px] text-center">
            <Eyebrow tone="gold" align="center">
              How It Works
            </Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
              From application <Highlight tone="gold">to your first session.</Highlight>
            </h2>
            <p className="mt-[14px] text-[16px] leading-[1.6] text-[rgba(244,241,234,0.8)]">
              An honest, four-step path. Every educator is reviewed before a profile goes live.
            </p>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-4 gap-6 max-[820px]:grid-cols-1 max-[820px]:gap-0">
          <span
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-[29px] z-0 h-[2px] bg-[linear-gradient(90deg,var(--slate),var(--gold))] opacity-40 max-[820px]:bottom-[29px] max-[820px]:left-[29px] max-[820px]:right-auto max-[820px]:h-auto max-[820px]:w-[2px] max-[820px]:bg-[linear-gradient(180deg,var(--slate),var(--gold))]"
          />

          {TEACH_STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={(index + 1) as RevealDelay}
              className="group relative z-[1] text-center max-[820px]:grid max-[820px]:grid-cols-[60px_1fr] max-[820px]:items-start max-[820px]:gap-5 max-[820px]:pb-9 max-[820px]:text-left"
            >
              <span className="mx-auto mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-slate bg-white font-serif text-[22px] font-bold text-slate shadow-[0_10px_26px_-14px_rgba(35,40,70,0.5)] transition-[transform,background-color,color] duration-500 ease-brand group-hover:-translate-y-1 group-hover:bg-slate group-hover:text-white max-[820px]:mx-0 max-[820px]:mb-0">
                {index + 1}
              </span>

              <div>
                <h3 className="mb-[9px] font-serif text-[18px] font-semibold tracking-[-0.005em] text-white">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-[26ch] text-[14px] leading-[1.6] text-[rgba(244,241,234,0.8)] max-[820px]:mx-0">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
