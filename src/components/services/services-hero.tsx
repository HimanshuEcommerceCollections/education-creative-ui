import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";

/**
 * Services hero: a light ivory wash with a gold bloom top-right and an oversized
 * ghost word behind the copy. Light from the very top, so `/services` is listed
 * in the header's LIGHT_HERO_ROUTES to keep the nav ink-coloured.
 */
export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-ivory bg-[radial-gradient(120%_92%_at_82%_-6%,#EFEDE7_0%,var(--color-ivory)_56%)] pb-5 pt-[190px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[120px] -top-[140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(210,162,65,0.16),rgba(210,162,65,0)_70%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[104px] z-0 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[min(24vw,300px)] font-extrabold leading-none tracking-[-0.04em] text-[rgba(46,58,115,0.09)] max-[760px]:top-[130px] max-[760px]:text-[26vw]"
      >
        SERVICES
      </div>

      <Container className="relative z-[1] max-w-[820px]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-muted"
          >
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold text-ink">Services</b>
          </nav>

          <Eyebrow>Our Services</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(38px,5.6vw,68px)] font-semibold leading-[1.02] tracking-[-0.025em]">
            Six subjects, one <Highlight>trusted marketplace.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-5 max-w-[58ch] text-[17.5px] leading-[1.62] text-muted">
            Every service means one thing: time with a vetted, independent educator who
            fits your family. Browse the six subjects below, in your home or online — a
            parent stays in control of every booking.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
