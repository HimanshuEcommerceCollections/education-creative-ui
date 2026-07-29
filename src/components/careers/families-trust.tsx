import Image from "next/image";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { CAREERS_MEDIA, CAREERS_TRUST_POINTS } from "@/data/careers";

import { CheckIcon } from "./careers-icons";

/**
 * Why it matters: the promise every role rolls up to, set left over a dark
 * photo band whose wash lightens toward the right so the photo stays readable.
 */
export function FamiliesTrust() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-[16vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-[linear-gradient(100deg,rgba(15,16,22,0.9)_0%,rgba(17,18,24,0.78)_44%,rgba(20,22,28,0.5)_100%)] after:content-['']"
      >
        <Image
          src={CAREERS_MEDIA.trustBg.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[1]">
        <Reveal className="max-w-[620px]">
          <Eyebrow tone="gold">Why it matters</Eyebrow>

          <h2 className="mb-2 font-serif text-[clamp(28px,3.8vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)]">
            We&rsquo;re building something families <Highlight tone="gold">can trust.</Highlight>
          </h2>

          <p className="mb-6 max-w-[56ch] text-[16.5px] leading-[1.65] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
            Every role here rolls up to the same promise: careful vetting, honest communication, and
            parents in control. The work is human and deliberate &mdash; and it shows up in how
            families experience the marketplace.
          </p>

          <ul className="grid gap-[13px]">
            {CAREERS_TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-[11px] text-[15.5px] font-medium text-[rgba(244,241,234,0.95)] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]"
              >
                <CheckIcon className="mt-[2px] h-[18px] w-[18px] flex-none text-gold" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
