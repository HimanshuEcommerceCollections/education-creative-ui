"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type {
  EducatorRateView,
  FormatPolicyView,
  RateBand,
} from "@contracts/pricing.ts";

import {
  setEducatorRateAction,
  updateFormatPolicyAction,
  updateRateBandAction,
} from "@/app/(dashboard)/dashboard/pricing/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import {
  IDLE,
  fieldError,
  formMessage,
  sessionExpired,
  type AuthFormState,
} from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

/**
 * Inline editors for the pricing rules. Everything shows and accepts dollars;
 * the actions convert to the contract's integer cents. Each row is its own
 * form so one save can't drag an unrelated half-edited row with it.
 */

const MONEY_INPUT =
  "w-[92px] rounded-[10px] border-[1.5px] border-line bg-sand px-[10px] py-[7px] text-[13.5px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

function dollars(cents: number): string {
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
}

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-transparent bg-slate px-[18px] py-[8px] text-[12.5px] font-semibold text-white transition-colors hover:bg-slate-deep disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Feedback({ state }: { state: AuthFormState }) {
  // An admin session idling out isn't a problem with this row's numbers, so it
  // doesn't render as a red box under them.
  if (sessionExpired(state)) return <SessionExpiredAlert className="mt-3" />;

  const failed = state.status === "error";
  const message =
    formMessage(state) ?? (state.status === "success" ? state.message : undefined);
  if (!message) return null;
  return (
    <p
      role={failed ? "alert" : "status"}
      className={cn(
        "mt-3 rounded-[10px] border-[1.5px] px-3 py-2 text-[12.5px] leading-[1.5]",
        failed
          ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
          : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
      )}
    >
      {message}
    </p>
  );
}

function Money({
  name,
  label,
  defaultCents,
  error,
}: {
  name: string;
  label: string;
  defaultCents: number;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className="flex items-center gap-1 text-[13.5px] text-muted">
        $
        <input
          name={name}
          defaultValue={dollars(defaultCents)}
          inputMode="decimal"
          aria-invalid={Boolean(error)}
          className={MONEY_INPUT}
        />
        <span className="text-[12px]">/hr</span>
      </span>
      {error ? <span className="text-[12px] text-[#a63a30]">{error}</span> : null}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Subject rate bands
// ---------------------------------------------------------------------------

export function RateBandRow({ band }: { band: RateBand }) {
  const [state, action] = useActionState(updateRateBandAction, IDLE);

  return (
    <li className="rounded-[16px] border border-line bg-white p-5">
      <form action={action}>
        <input type="hidden" name="subjectSlug" value={band.subjectSlug} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[150px]">
            <h3 className="font-serif text-[16.5px] font-semibold tracking-[-0.01em]">
              {band.subjectTitle}
            </h3>
            <p className="mt-1 text-[12px] text-muted">
              in force since{" "}
              {new Date(band.effectiveFrom).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <Money
              name="minCents"
              label="Minimum"
              defaultCents={band.minCents}
              error={fieldError(state, "minCents")}
            />
            <Money
              name="suggestedCents"
              label="Suggested"
              defaultCents={band.suggestedCents}
              error={fieldError(state, "suggestedCents")}
            />
            <Money
              name="maxCents"
              label="Maximum"
              defaultCents={band.maxCents}
              error={fieldError(state, "maxCents")}
            />
            <SaveButton />
          </div>
        </div>
        <Feedback state={state} />
      </form>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Educator rates
// ---------------------------------------------------------------------------

export function EducatorRateRow({ rate }: { rate: EducatorRateView }) {
  const [state, action] = useActionState(setEducatorRateAction, IDLE);

  return (
    <li className="rounded-[16px] border border-line bg-white p-5">
      <form action={action}>
        <input type="hidden" name="educatorSlug" value={rate.educatorSlug} />
        <input type="hidden" name="subjectSlug" value={rate.subjectSlug} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[150px]">
            <h3 className="font-serif text-[16.5px] font-semibold tracking-[-0.01em]">
              {rate.educatorName}
            </h3>
            <p className="mt-1 text-[12px] capitalize text-muted">
              {rate.subjectSlug.replace(/-/g, " ")}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <Money
              name="rateCents"
              label="Hourly rate"
              defaultCents={rate.rateCents}
              error={fieldError(state, "rateCents")}
            />
            <SaveButton />
          </div>
        </div>
        <Feedback state={state} />
      </form>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Format differential
// ---------------------------------------------------------------------------

/*
 * The contract's ceilings, spelled out on the form.
 *
 * `updateFormatPolicySchema` caps `inHomeMultiplierBps` at 30000 (×3, so 200% on
 * top of the base) and `travelFlatCents` at 20000. Left unstated, they reach the admin
 * only as a rejection keyed to a field this form doesn't have: entering 250 in the
 * surcharge box fails with nothing highlighted and no hint that a ceiling exists.
 */
const MAX_SURCHARGE_PERCENT = 200;
const MAX_TRAVEL_DOLLARS = 200;

export function FormatPolicyForm({ policy }: { policy: FormatPolicyView }) {
  const [state, action] = useActionState(updateFormatPolicyAction, IDLE);
  const surchargePercent = (policy.inHomeMultiplierBps - 10_000) / 100;

  return (
    <form action={action}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            In-home surcharge
          </span>
          <span className="flex items-center gap-1 text-[13.5px] text-muted">
            +
            <input
              name="inHomeSurchargePercent"
              defaultValue={
                Number.isInteger(surchargePercent)
                  ? String(surchargePercent)
                  : surchargePercent.toFixed(2)
              }
              inputMode="decimal"
              max={MAX_SURCHARGE_PERCENT}
              aria-describedby="in-home-surcharge-limit"
              aria-invalid={Boolean(fieldError(state, "inHomeSurchargePercent"))}
              className={MONEY_INPUT}
            />
            <span className="text-[12px]">%</span>
          </span>
          <span id="in-home-surcharge-limit" className="text-[11.5px] text-muted">
            0&ndash;{MAX_SURCHARGE_PERCENT}%
          </span>
          {fieldError(state, "inHomeSurchargePercent") ? (
            <span className="text-[12px] text-[#a63a30]">
              {fieldError(state, "inHomeSurchargePercent")}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            Travel flat fee
          </span>
          <span className="flex items-center gap-1 text-[13.5px] text-muted">
            $
            <input
              name="travelFlatCents"
              defaultValue={dollars(policy.travelFlatCents)}
              inputMode="decimal"
              aria-describedby="travel-flat-limit"
              aria-invalid={Boolean(fieldError(state, "travelFlatCents"))}
              className={MONEY_INPUT}
            />
          </span>
          <span id="travel-flat-limit" className="text-[11.5px] text-muted">
            $0&ndash;${MAX_TRAVEL_DOLLARS}
          </span>
          {fieldError(state, "travelFlatCents") ? (
            <span className="text-[12px] text-[#a63a30]">
              {fieldError(state, "travelFlatCents")}
            </span>
          ) : null}
        </label>

        <SaveButton label="Save differential" />
      </div>

      <p className="mt-3 text-[12.5px] leading-[1.55] text-muted">
        Applied to in-home sessions only: base × (1 + surcharge) + travel fee. Online
        sessions always price at the base rate. At 0% and $0 the booking page shows no
        format lines at all.
      </p>

      <Feedback state={state} />
    </form>
  );
}
