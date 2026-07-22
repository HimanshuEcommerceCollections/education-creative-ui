import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { ADMISSIONS_FAQ } from "@/data/admissions";

/**
 * FAQ built on native <details>/<summary> — accessible and open-by-click with
 * no JavaScript. A faint "?" watermark sits behind, per the source.
 */
export function AdmissionsFaq() {
  return (
    <section className="relative overflow-hidden bg-ivory pb-[30px] pt-[90px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[2vw] z-0 select-none font-serif text-[clamp(280px,32vw,520px)] font-extrabold leading-none text-[rgba(46,58,115,0.055)]"
      >
        ?
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <SectionHeading
            eyebrow="Honest answers"
            title={
              <>
                Asked by every <Highlight>family.</Highlight>
              </>
            }
          />
        </Reveal>

        <Reveal delay={1}>
          <div className="mx-auto mt-10 flex max-w-[760px] flex-col gap-3">
            {ADMISSIONS_FAQ.map((item) => (
              <details
                key={item.id}
                className="group rounded-[14px] border border-line bg-white px-[22px] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-[2px] hover:border-[rgba(210,162,65,0.55)] open:shadow-[0_18px_40px_rgba(18,19,28,0.08)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-[14px] py-[19px] font-serif text-[16.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="flex-none text-[22px] font-normal text-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[14.5px] leading-[1.7] text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
