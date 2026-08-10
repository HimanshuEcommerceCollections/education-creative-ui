import Link from "next/link";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { bookHrefFor } from "@/constants/site";
import type { EducatorProfile } from "@/data/educators";

import { ArrowRightIcon, HomeIcon, PinIcon } from "./educator-icons";
import { PortraitCard } from "./portrait-card";
import { StarRating } from "./star-rating";

/** Split dark hero: tilting portrait beside the educator's headline details. */
export function EducatorHero({ profile }: { profile: EducatorProfile }) {
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

            <div className="mb-[22px] mt-[18px] flex items-center gap-3">
              <StarRating value={profile.ratingValue} size={20} />
              <span className="font-serif text-[20px] font-bold text-white">{profile.rating}</span>
              <span className="text-[14px] text-[rgba(244,241,234,0.65)]">
                {profile.reviewCount} reviews
              </span>
            </div>

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
              <Button href="/contact" variant="ghost">
                Message {profile.firstName}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
