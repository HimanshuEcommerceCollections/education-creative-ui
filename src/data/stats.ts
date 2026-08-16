import type { Stat } from "@/types/stat";

/**
 * The homepage trust tiles.
 *
 * A tile may only state something a reader could verify from the product itself, so
 * every number below is a fact about how the platform is built rather than a
 * measurement of how it has performed. Reviews are collected per educator and published
 * on their own cards, but nothing computes a platform-wide average and there is no
 * messaging — so an "average parent rating across verified post-session reviews" or an
 * "average response time from first message to educator reply" has no system behind it,
 * and a lesson count is a tally of sessions the platform has not run.
 *
 * When there is real operational data (sessions delivered, refunds honoured), that is
 * the moment to add a measured tile — not before.
 */
export const STATS: Stat[] = [
  {
    id: "checked",
    value: 100,
    suffix: "%",
    label: "Background checked",
    description: "Credentials and references reviewed before an educator is listed.",
  },
  {
    id: "subjects",
    value: 6,
    label: "Subjects",
    description: "Tutoring, admissions, music, languages, arts & crafts, and cooking.",
  },
  {
    id: "supervision",
    value: 100,
    suffix: "%",
    label: "Parent-managed",
    description: "A parent or guardian books and supervises every session. No child logins.",
  },
  {
    // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
    // booking flow makes before anyone pays.
    id: "confirmation",
    value: 2,
    suffix: " days",
    label: "To confirm, or refund",
    description:
      "A coordinator confirms your time within two days, or the booking is refunded in full automatically.",
  },
];
