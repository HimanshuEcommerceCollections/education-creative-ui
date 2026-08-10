import type { BookingFormat, SessionDuration } from "@contracts/bookings.ts";

import { BOOKING_PRICING } from "@/data/booking";

/**
 * Client-side price **estimate**.
 *
 * This exists so the summary card can respond instantly as a parent changes
 * format or length — not to decide what anyone is charged. The authoritative
 * amount comes from `POST /quotes`, computed server-side in integer cents and
 * frozen onto the booking; no amount is ever sent from the browser to the API
 * (ARCHITECTURE.md §7).
 *
 * It is worth the duplication only because it follows the *same* formula in the
 * *same* units. Cents throughout, one rounding step per line, and duration as
 * hours on both the parent and educator side — the single basis that removes the
 * negative-margin bug a divergent length multiplier would reintroduce.
 */

export interface EstimateLine {
  label: string;
  amountCents: number;
}

export interface Estimate {
  lineItems: EstimateLine[];
  totalCents: number;
}

/** The format differential the estimate applies — the shape of the API's
 * `format_policies` row in force, and of the in-repo fallback. */
export interface PricingPolicy {
  inHomeMultiplier: number;
  travelFlatCents: number;
}

/**
 * Live pricing for the flow, built by the page from `GET /pricing/snapshot`:
 * admin-set hourly rates (dollars, keyed by educator slug) plus the format
 * differential in force. Null when the API couldn't answer — the flow then
 * estimates from the in-repo figures, same numbers as before the cutover.
 */
export interface LivePricing {
  rates: Record<string, number>;
  policy: PricingPolicy;
}

interface EstimateInput {
  /** The educator's published hourly rate, in whole dollars. */
  ratePerHour: number;
  format: BookingFormat;
  durationMinutes: SessionDuration;
  /** Live differential from the snapshot; defaults to the in-repo config. */
  policy?: PricingPolicy;
}

/**
 * `base = rate × hours`, then the format adjustment. Returns the breakdown as
 * well as the total so the summary can show a parent where the number came from
 * — a single opaque figure next to a card form invites a support email.
 */
export function estimateSession({
  ratePerHour,
  format,
  durationMinutes,
  policy = BOOKING_PRICING,
}: EstimateInput): Estimate {
  const hours = durationMinutes / 60;
  const baseCents = Math.round(ratePerHour * 100 * hours);

  const lineItems: EstimateLine[] = [
    {
      label: `${durationMinutes} min at $${ratePerHour}/hr`,
      amountCents: baseCents,
    },
  ];

  let totalCents = baseCents;

  if (format === "in_home") {
    // Both adjustments are inert until a format differential is configured, so
    // each line is added only when it would carry a number worth reading.
    const adjustedCents = Math.round(baseCents * policy.inHomeMultiplier);
    const differenceCents = adjustedCents - baseCents;

    if (differenceCents !== 0) {
      lineItems.push({ label: "In-home session", amountCents: differenceCents });
    }
    if (policy.travelFlatCents !== 0) {
      lineItems.push({ label: "Travel", amountCents: policy.travelFlatCents });
    }

    totalCents = adjustedCents + policy.travelFlatCents;
  }

  return { lineItems, totalCents };
}

/**
 * Formats cents as currency, dropping `.00` on whole amounts — `$55` reads as a
 * price, `$55.00` reads as an invoice, and a 90-minute session still needs the
 * cents that `$82.50` carries.
 */
export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: BOOKING_PRICING.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
