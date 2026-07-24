import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";

const META = ["College Admissions Counselor", "★ 4.9", "$65/hr"];

/**
 * Featured counselor band: a dark, photo-backed section with a portrait and
 * an editorial profile for the page's sample counselor, Priya S.
 */
export function CounselorSpotlight() {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(210,162,65,0.18)] bg-[#12131C] py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.88),rgba(18,19,28,0.8)_50%,rgba(18,19,28,0.9))] after:content-['']"
      >
        <Image
          src="/assets/admissions/images/counselor-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[2]">
        <Reveal>
          <div className="group grid grid-cols-[0.85fr_1.15fr] items-center gap-16 transition-transform duration-[400ms] hover:-translate-y-1 max-[960px]:grid-cols-1 max-[960px]:gap-9">
            <div className="mx-auto w-full max-w-[380px] max-[960px]:max-w-[320px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-[rgba(210,162,65,0.5)]">
                <Image
                  src="/assets/admissions/images/counselor-priya.jpg"
                  alt="Priya S., college admissions counselor"
                  fill
                  sizes="(max-width: 960px) 320px, 380px"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
                />
              </div>
            </div>

            <div>
              <Eyebrow tone="light">Your counselor</Eyebrow>
              <h2 className="mb-3 font-serif text-[clamp(30px,4vw,46px)] font-extrabold text-[#F6F5F1]">
                Priya S.
              </h2>
              <div className="mb-4 flex flex-wrap gap-[18px] text-[14px] font-semibold text-[rgba(246,245,241,0.78)]">
                {META.map((meta) => (
                  <span key={meta} className={meta.startsWith("★") ? "text-gold" : undefined}>
                    {meta}
                  </span>
                ))}
              </div>
              <p className="mb-6 max-w-[520px] text-[16px] leading-[1.75] text-[rgba(246,245,241,0.72)]">
                Former university admissions reader turned one-on-one counselor.
                Priya has guided dozens of Triangle-area families through the
                process — calmly, honestly, and without ever writing a word for
                the student.
              </p>
              <Button href="/browse" variant="primary">
                View profile
              </Button>
              <p className="mt-[14px] text-[12.5px] text-[rgba(246,245,241,0.5)]">
                Booking and all communication run through a parent or guardian.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
