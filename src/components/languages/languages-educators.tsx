import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import type { LanguageEducator } from "@/data/languages";
import type { RevealDelay } from "@/lib/reveal";

/**
 * "Two voices, five languages" — the featured educators on a dark, photo-backed
 * band, each in a light card with rating, experience, price, and a bio.
 *
 * Takes its educators as a prop rather than reading the module directly, so the
 * page can overlay admin-set rates before they render.
 */
export function LanguagesEducators({ educators }: { educators: LanguageEducator[] }) {
  return (
    <section className="relative overflow-hidden border-y border-[rgba(210,162,65,0.18)] bg-[#12131C] py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(18,19,28,0.9),rgba(18,19,28,0.84)_55%,rgba(18,19,28,0.92))] after:content-['']"
      >
        <Image
          src="/assets/languages/images/educators-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-[2]">
        <Reveal className="mb-[50px] max-w-[680px]">
          <Eyebrow tone="light">Your educators</Eyebrow>
          <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
            Two voices, <Highlight tone="gold">five languages.</Highlight>
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-[30px] max-[960px]:max-w-[440px] max-[960px]:grid-cols-1">
          {educators.map((educator, index) => (
            <Reveal key={educator.id} delay={(index + 1) as RevealDelay}>
              <article className="group overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-[450ms] hover:-translate-y-2 hover:shadow-[0_30px_55px_rgba(18,19,28,0.14)]">
                <div className="relative aspect-[4/3.4] overflow-hidden bg-[linear-gradient(160deg,var(--slate),var(--slate-deep))]">
                  <Image
                    src={educator.image.src}
                    alt={educator.image.alt}
                    fill
                    sizes="(max-width: 960px) 440px, 450px"
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-col gap-2 px-[26px] pb-[30px] pt-6">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                    {educator.role}
                  </div>
                  <h3 className="font-serif text-[21px] font-bold text-ink">{educator.name}</h3>
                  <div className="flex gap-[14px] text-[13px] font-semibold text-slate">
                    <span>{educator.rating}</span>
                    <span>{educator.experience}</span>
                    <span>{educator.price}</span>
                  </div>
                  <p className="my-1 text-[14px] leading-[1.65] text-muted">{educator.bio}</p>
                  <Link
                    href={educator.href}
                    className="self-start border-b-2 border-gold pb-[2px] text-[13.5px] font-bold text-slate no-underline transition-colors hover:text-gold"
                  >
                    View profile &rarr;
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={3}>
          <p className="mt-[34px] text-center text-[12px] italic text-[rgba(246,245,241,0.55)]">
            Lessons for under-18s are booked and supervised by a parent or guardian — always.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
