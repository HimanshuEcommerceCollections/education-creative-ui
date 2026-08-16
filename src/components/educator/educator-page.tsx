import type { EducatorReviewsResponse } from "@contracts/reviews.ts";

import { Container } from "@/components/common/container";
import { CoppaBand } from "@/components/common/coppa-band";
import { Reveal } from "@/components/common/reveal";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import { ratingBreakdown, type EducatorRating } from "@/lib/educators/rating";
import type { EducatorProfile } from "@/data/educators";
import { COPPA_POINTS } from "@/data/coppa";

import { AvailabilityWeek } from "./availability-week";
import { BookingSidebar } from "./booking-sidebar";
import { EducatorCta } from "./educator-cta";
import { EducatorHero } from "./educator-hero";
import { EducatorTabs } from "./educator-tabs";
import { RatingBars } from "./rating-bars";
import { TrustFlipCard } from "./trust-flip-card";

interface EducatorPageProps {
  profile: EducatorProfile;
  /**
   * This educator's published reviews and their aggregate, or null when the API
   * couldn't answer. Every rating on this page comes from here and nowhere else —
   * `data/educators.ts` carries no rating, review or breakdown field, and must
   * not grow one.
   */
  reviews: EducatorReviewsResponse | null;
}

/** Composes the full educator profile: hero, detail column, booking rail, CTA. */
export function EducatorPage({ profile, reviews }: EducatorPageProps) {
  const aggregate = reviews?.aggregate ?? null;

  /*
   * A rating exists only when the API gave both an average and a review behind
   * it. Anything else — no reviews, an unreachable API — is undefined, and the
   * hero then draws no stars rather than an empty row that reads as zero.
   */
  const rating: EducatorRating | undefined =
    aggregate && aggregate.average !== null && aggregate.count > 0
      ? { average: aggregate.average, count: aggregate.count }
      : undefined;

  /*
   * Facets when any were answered, the star distribution when none were but
   * reviews exist, and nothing at all otherwise — see `ratingBreakdown`. An empty
   * list removes the whole section, heading included: a "Rating breakdown" card
   * with no bars in it is a worse answer than no card.
   */
  const facets = aggregate ? ratingBreakdown(aggregate) : [];

  return (
    <>
      <EducatorHero profile={profile} rating={rating} />

      <section className="bg-ivory py-[clamp(48px,8vh,88px)]">
        <Container>
          <div className="grid grid-cols-[1.55fr_0.9fr] items-start gap-14 max-[960px]:grid-cols-1">
            <div className="min-w-0">
              <Reveal>
                <EducatorTabs profile={profile} reviews={reviews?.items ?? []} />
              </Reveal>
              <Reveal className="mt-11">
                <TrustFlipCard />
              </Reveal>
              {facets.length > 0 ? (
                <Reveal className="mt-11">
                  <RatingBars facets={facets} />
                </Reveal>
              ) : null}
              <Reveal className="mt-11">
                <AvailabilityWeek days={profile.availability} />
              </Reveal>
            </div>

            <BookingSidebar profile={profile} />
          </div>
        </Container>
      </section>

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/how-it-works/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
        stripClassName="bg-ivory"
        bandClassName="bg-sand"
      />

      <EducatorCta profile={profile} />
    </>
  );
}
