import { Fragment } from "react";

import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { ADMISSIONS_PROCESS } from "@/data/admissions";

/** Numbered process ticker (Essays → Decisions) shown under the hero. */
export function ProcessStrip() {
  return (
    <section className="border-b border-line bg-ivory py-[26px]">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-[14px] max-[640px]:justify-center">
            {ADMISSIONS_PROCESS.map((step, index) => (
              <Fragment key={step.num}>
                <span className="group flex cursor-default items-center gap-[9px] text-[13px] font-semibold uppercase tracking-[0.1em] text-ink transition-transform duration-[350ms] hover:-translate-y-[5px]">
                  <b className="font-serif text-[12px] font-extrabold text-gold">
                    {step.num}
                  </b>
                  {step.label}
                </span>
                {index < ADMISSIONS_PROCESS.length - 1 ? (
                  <i
                    aria-hidden="true"
                    className="h-px min-w-[20px] flex-1 bg-line max-[640px]:hidden"
                  />
                ) : null}
              </Fragment>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
