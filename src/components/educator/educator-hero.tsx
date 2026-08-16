import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { bookHrefFor } from "@/constants/site";
import type { EducatorRating } from "@/lib/educators/rating";
import { cn } from "@/lib/utils";
import type { EducatorProfile } from "@/data/educators";

import { ArrowRightIcon, HomeIcon, PinIcon } from "./educator-icons";
import { PortraitCard } from "./portrait-card";
import { StarRating } from "./star-rating";

interface EducatorHeroProps {
  profile: EducatorProfile;
  /**
   * The published rating, or undefined when this educator has none. Undefined
   * renders no star row at all — the vetting line below still says the thing the
   * platform can stand behind, which is what this slot held before any review
   * existed.
   */
  rating?: EducatorRating;
}

/** Split dark hero: tilting portrait beside the educator's headline details. */
export function EducatorHero({ profile, rating }: EducatorHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(115deg,#121214_0%,#101012_52%,#161618_100%)] pb-[88px] pt-[150px]">
      <Container>
        <div className="grid grid-cols-[0.82fr_1.18fr] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-[38px]">
          <Reveal>
            <PortraitCard initials={profile.initials} />
          </Reveal>

          <Reveal delay={1}>
            <nav
              aria-label="Breadcrumb"
              className="mb-[22px] flex flex-wrap items-center gap-[9px] text-[12.5px] text-[rgba(244,241,234,0.55)]"
            >
              <Link href="/" className="text-[rgba(244,241,234,0.78)] transition-colors hover:text-gold">
                Home
              </Link>
              <span aria-hidden="true" className="text-[rgba(244,241,234,0.35)]">
                /
              </span>
              <Link href="/browse" className="text-[rgba(244,241,234,0.78)] transition-colors hover:text-gold">
                Browse
              </Link>
              <span aria-hidden="true" className="text-[rgba(244,241,234,0.35)]">
                /
              </span>
              <b className="font-semibold text-white">{profile.name}</b>
            </nav>

            <Eyebrow tone="gold">{profile.subject}</Eyebrow>

            <h1 className="font-serif text-[clamp(42px,6vw,74px)] font-semibold leading-none tracking-[-0.02em] text-white">
              {profile.name}
            </h1>

            {/*
              Every claim in this slot has to be one the platform can stand behind.
              The star row is drawn only from `GET /educators/:slug/reviews` — one
              review per completed, paid-for booking — and is absent entirely when
              there is nothing to average. The vetting line stays either way; it
              describes a step that really happens before listing.
            */}
            {rating ? (
              <div className="mt-[18px] flex items-center gap-3">
                <StarRating value={rating.average} size={20} />
                <span className="font-serif text-[20px] font-bold text-white">
                  {rating.average.toFixed(1)}
                </span>
                <span className="text-[14px] text-[rgba(244,241,234,0.65)]">
                  {rating.count} {rating.count === 1 ? "review" : "reviews"}
                </span>
              </div>
            ) : null}

            <p
              className={cn(
                "mb-[22px] text-[14.5px] leading-[1.6] text-[rgba(244,241,234,0.72)]",
                rating ? "mt-[14px]" : "mt-[18px]",
              )}
            >
              Credentials and references reviewed before listing. A parent or guardian
              books and supervises every session.
            </p>

            <div className="mb-[26px] flex flex-wrap gap-[10px]">
              <span className="inline-flex items-center gap-2 rounded-[30px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.09)] px-4 py-[9px] text-[13px] font-semibold text-[rgba(244,241,234,0.92)]">
                <PinIcon className="h-[15px] w-[15px] text-gold" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[30px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.09)] px-4 py-[9px] text-[13px] font-semibold text-[rgba(244,241,234,0.92)]">
                <HomeIcon className="h-[15px] w-[15px] text-gold" />
                {profile.formats}
              </span>
            </div>

            <div className="mb-[28px] font-serif text-[28px] font-bold text-white">
              ${profile.price}{" "}
              <span className="text-[15px] font-medium text-[rgba(244,241,234,0.6)]">
                / {profile.priceUnit}
              </span>
            </div>

            <div className="flex flex-wrap gap-[14px]">
              <Button href={bookHrefFor(profile.slug)} variant="primary">
                Book a Session
                <ArrowRightIcon className="h-[17px] w-[17px]" />
              </Button>
              {/*
                Was "Message {firstName}", pointed at /contact. There is no
                messaging, and the contact form doesn't reach an educator — this
                goes somewhere that answers the question that button was really
                being clicked for.
              */}
              <Button href="/how-it-works" variant="ghost">
                How booking works
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
