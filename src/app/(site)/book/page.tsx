import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import type { ParentBooking } from "@contracts/bookings.ts";

import { BookingFlow } from "@/components/booking/booking-flow";
import type { BookingAccount } from "@/components/booking/contact-fields";
import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { PausedNotice } from "@/components/common/paused-notice";
import { Reveal } from "@/components/common/reveal";
import { bookableEducators, getBookingEducator } from "@/data/booking";
import { apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/session";
import type { ResumableBooking } from "@/lib/booking/checkout";
import { BOOKING_DRAFT_COOKIE, parseBookingDraft } from "@/lib/booking/draft";
import { loadEducatorRatings } from "@/lib/educators/directory";
import type { LivePricing } from "@/lib/booking/pricing";
import {
  loadPricingSnapshot,
  pricedSubjectSlugs,
  ratesByEducatorSubject,
} from "@/lib/pricing/snapshot";
import { bookingRules, configFlags, loadConfigSnapshot } from "@/lib/config/snapshot";
import { civilNow } from "@/lib/booking/schedule";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Choose an educator, a subject, and a time that suits your family. A parent books and supervises every session.",
};

/**
 * The booking behind `?resume=`, if it is the caller's own and still unpaid.
 *
 * Resolved from `/bookings/mine` rather than by id: that endpoint is already
 * scoped to the caller's `customer_profiles` row, so an id belonging to somebody
 * else can't be probed here at all. A failure is not worth surfacing — the page falls
 * back to opening as a fresh booking, which costs the parent nothing but a re-entry.
 */
async function findResumableBooking(
  bookingId: string,
): Promise<ResumableBooking | null> {
  try {
    const token = await readSessionToken();
    const { items } = await apiFetch<{ items: ParentBooking[] }>("/bookings/mine", {
      token,
    });
    const match = items.find(
      (booking) => booking.id === bookingId && booking.status === "pending_payment",
    );
    return match
      ? {
          bookingId: match.id,
          reference: match.reference,
          totalCents: match.totalCents,
        }
      : null;
  } catch {
    return null;
  }
}

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
  searchParams: Promise<{ educator?: string; resume?: string }>;
}) {
  const { educator, resume } = await searchParams;
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
   * from the API's snapshot, in the exact shape `estimateSession` consumes. Keyed
   * by (educator, subject) because that is how the snapshot holds them — one rate
   * per pair — so a multi-subject educator prices per subject rather than on
   * whichever row happened to arrive last.
   *
   * The authoritative charge is still the server's quote, which the flow now asks
   * for as the parent chooses; this keeps the pre-auth number sensible for a guest
   * and when that call can't be made.
   */
  /*
   * `ratings` is the published average per educator, for the step-1 cards only —
   * it never touches what is quoted or charged. Empty when the API can't answer,
   * and absent for anyone with no published reviews, which renders as no stars.
   */
  /*
   * `flags.bookingsEnabled` is the platform-wide kill switch. The API refuses a
   * quote and a booking while it is off, so this is not the control — it is what
   * stops a parent entering a learner's details and a card number first. On by
   * default when the API can't be reached: a network blip is not an instruction
   * to close the doors.
   */
  const [snapshot, ratings, config] = await Promise.all([
    loadPricingSnapshot(),
    loadEducatorRatings(),
    loadConfigSnapshot(),
  ]);
  const flags = configFlags(config);
  /*
   * The notice window, how far ahead the calendar opens, and the confirmation
   * SLA printed beside the pay button. Passed down rather than imported by the
   * flow so the calendar and the promise move together when an admin edits them —
   * and so both sides of hydration measure against the same figures.
   */
  const rules = bookingRules(config);
  const rates = ratesByEducatorSubject(snapshot);
  const pricing: LivePricing | null = snapshot
    ? {
        rates,
        policy: {
          inHomeMultiplier: snapshot.inHomeMultiplierBps / 10_000,
          travelFlatCents: snapshot.travelFlatCents,
        },
      }
    : null;

  /*
   * Who can actually be booked. The in-repo roster is a stand-in and the API is the
   * authority — it 404s a slug it doesn't hold and refuses a subject it can't price
   * — so the snapshot narrows the list here rather than letting a parent discover it
   * at the final submit. With no snapshot the local list is used whole; see
   * `bookableEducators`.
   */
  const educators = bookableEducators({
    pricedSubjects: pricedSubjectSlugs(snapshot),
    ratedEducatorSlugs: Object.keys(rates),
  });

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

  const requested = educator ? getBookingEducator(educator, educators) : undefined;

  /*
   * `?resume=<id>` is how "Finish paying" in the parent's booking history gets
   * back to the card form. Only the summary is read here, and only through
   * `/bookings/mine`, which is scoped to the caller's own profile — so an id that
   * isn't theirs, or isn't still awaiting payment, simply doesn't resolve.
   *
   * Deliberately a read: reopening the Stripe session is a POST behind the banner's
   * button, because Next prefetches links and a session must not be opened by
   * hovering one.
   */
  const unfinished = resume && account ? await findResumableBooking(resume) : null;

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
          {flags.bookingsEnabled ? (
            <BookingFlow
              initialEducatorSlug={educator}
              educators={educators}
              ratings={ratings}
              draft={draft}
              now={now}
              account={account}
              paymentsLive={paymentsLive}
              pricing={pricing}
              rules={rules}
              resumable={unfinished}
            />
          ) : (
            <PausedNotice
              title="We've paused new bookings for a moment"
              action={{ href: "/contact", label: "Tell us what you need" }}
            >
              We&rsquo;re catching up with the requests already in front of us, and
              we&rsquo;d rather not take a session we can&rsquo;t confirm. Tell us what
              you&rsquo;re looking for and we&rsquo;ll arrange it with you directly, or
              try again shortly. Any booking you&rsquo;ve already made is unaffected.
            </PausedNotice>
          )}
        </Container>
      </section>
    </>
  );
}
