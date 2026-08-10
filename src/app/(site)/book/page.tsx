import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { BookingFlow } from "@/components/booking/booking-flow";
import type { BookingAccount } from "@/components/booking/contact-fields";
import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { getBookingEducator } from "@/data/booking";
import { getSession } from "@/lib/auth/session";
import { BOOKING_DRAFT_COOKIE, parseBookingDraft } from "@/lib/booking/draft";
import type { LivePricing } from "@/lib/booking/pricing";
import { loadPricingSnapshot, ratesBySlug } from "@/lib/pricing/snapshot";
import { civilNow } from "@/lib/booking/schedule";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Choose an educator, a subject, and a time that suits your family. A parent books and supervises every session.",
};

/**
 * The booking page.
 *
 * Server component so the session is read once, on the server, and the flow can
 * open with the parent's own name and email already in place. Everything
 * interactive lives in `BookingFlow`, per the project's rule about pushing
 * `"use client"` down to the child that needs it.
 *
 * `?educator=<slug>` prefills step 1, which is how an educator's profile page
 * hands the flow the person the parent was already reading about.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ educator?: string }>;
}) {
  const { educator } = await searchParams;
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);

  /*
   * The clock and the draft are both resolved here so the flow renders already
   * restored, and so both sides of hydration measure the notice window against
   * the same instant.
   */
  const now = civilNow();
  const draft = parseBookingDraft(cookieStore.get(BOOKING_DRAFT_COOKIE)?.value);

  /*
   * Whether to offer a pay button at all. The publishable key is safe in a
   * browser, but it is still read here and passed down rather than exposed as a
   * `NEXT_PUBLIC_` variable — this app deliberately has none, and the key it
   * actually mounts Stripe with comes from the API alongside the Checkout
   * Session's client secret, so the two can never name different accounts.
   */
  const paymentsLive = Boolean(process.env.STRIPE_PUBLISHABLE_KEY);

  /*
   * Live pricing for the estimate: admin-set rates and the format differential
   * from the API's snapshot, in the exact shape `estimateSession` consumes. The
   * authoritative charge is still the server's quote at payment time — this
   * keeps the number the parent watches while choosing in step with it.
   */
  const snapshot = await loadPricingSnapshot();
  const pricing: LivePricing | null = snapshot
    ? {
        rates: ratesBySlug(snapshot),
        policy: {
          inHomeMultiplier: snapshot.inHomeMultiplierBps / 10_000,
          travelFlatCents: snapshot.travelFlatCents,
        },
      }
    : null;

  /*
   * Only a parent account prefills. A signed-in coordinator or educator is not
   * the customer for this booking, and quietly stamping their name on it would
   * create a booking nobody can find in their own account. They see the guest
   * path and can sign in as a parent.
   */
  const account: BookingAccount | null =
    session && session.activeRole === "customer"
      ? {
          fullName: session.user.fullName,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
        }
      : null;

  const requested = educator ? getBookingEducator(educator) : undefined;

  return (
    <>
      <section className="pb-8 pt-[150px]">
        <Container>
          <Reveal>
            <p className="mb-4 flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-muted">
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <b className="text-ink">Book a Session</b>
            </p>
            <Eyebrow>Book a Session</Eyebrow>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="font-serif text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.03] tracking-[-0.02em]">
              {requested ? (
                <>
                  Book a session with <Highlight>{requested.name}</Highlight>
                </>
              ) : (
                <>
                  Build your booking, <Highlight>step by step.</Highlight>
                </>
              )}
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.6] text-muted">
              Choose who you&rsquo;d like, what they&rsquo;ll cover, and when suits your
              family. You pay when you book; a coordinator then confirms the time and
              assigns your educator. A parent or guardian books and supervises every
              session.
            </p>
          </Reveal>
        </Container>
      </section>

      <section>
        <Container>
          <BookingFlow
            initialEducatorSlug={educator}
            draft={draft}
            now={now}
            account={account}
            paymentsLive={paymentsLive}
            pricing={pricing}
          />
        </Container>
      </section>
    </>
  );
}
