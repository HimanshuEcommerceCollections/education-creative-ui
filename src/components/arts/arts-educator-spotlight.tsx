import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

const CHIPS = ["★ 4.8 rating", "5 yrs experience", "$45/hr", "In-home & online"];

/**
 * Editorial single-educator spotlight for the Arts & Crafts page: a dark,
 * photo-backed band with a horizontal profile card (photo + details).
 */
export function ArtsEducatorSpotlight() {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(210,162,65,0.18)] bg-[#12131C] py-[14vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.9),rgba(18,19,28,0.92))] after:content-['']"
      >
        <Image
          src="/assets/arts/images/educator-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal>
          <div className="max-w-[680px]">
            <Eyebrow tone="gold">Your educator</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
              Meet <Highlight tone="gold">Theo.</Highlight>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="group mt-11 grid grid-cols-[320px_1fr] overflow-hidden rounded-[20px] bg-white shadow-[0_34px_70px_rgba(0,0,0,0.5)] transition-transform duration-[400ms] hover:-translate-y-[6px] max-[960px]:grid-cols-1">
            <div className="relative min-h-[340px] overflow-hidden max-[960px]:min-h-[300px]">
              <Image
                src="/assets/arts/images/educator-theo.jpg"
                alt="Theo W., arts and crafts educator, at the easel"
                fill
                sizes="(max-width: 960px) 100vw, 320px"
                className="object-cover object-top transition-transform duration-[600ms] group-hover:scale-[1.05]"
              />
            </div>

            <div className="flex flex-col justify-center gap-[13px] p-9 max-[520px]:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                Arts &amp; Crafts Educator
              </div>
              <h3 className="font-serif text-[clamp(24px,3vw,32px)] font-extrabold text-ink">
                Theo W.
              </h3>
              <div className="flex flex-wrap gap-[10px]">
                {CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-sand px-[13px] py-[7px] text-[12.5px] font-semibold text-slate"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="max-w-[520px] text-[15px] leading-[1.7] text-muted">
                A patient maker of many things — Theo has taught watercolour to
                six-year-olds and wheel-throwing to grandparents, and insists the
                wobbliest bowl on the shelf is usually the best story.
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-[18px]">
                <Button href="/browse" variant="primary">
                  View profile
                </Button>
                <p className="text-[12px] italic text-muted">
                  For learners under 18, a parent or guardian books and
                  supervises — always.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
