"use client";

import { CURRENT_LEARNER_CONSENT_TEXT } from "@contracts/consent.ts";
import { type LearnerAgeBand } from "@contracts/bookings.ts";

import { FieldRow, SelectChevron, fieldClasses } from "@/components/ui/field";
import { AGE_BAND_OPTIONS } from "@/data/booking";

import { ShieldIcon } from "./booking-icons";

export interface LearnerValues {
  firstName: string;
  ageBand: LearnerAgeBand | "";
  focus: string;
  consentGiven: boolean;
}

interface LearnerFieldsProps {
  values: LearnerValues;
  errors: {
    firstName?: string;
    ageBand?: string;
    focus?: string;
    consent?: string;
  };
  onChange: (patch: Partial<LearnerValues>) => void;
}

/**
 * Step 4 — who the session is for.
 *
 * This is the step the source page didn't have, and the one the rest of the
 * platform can't work without: a booking carries a `learner_id`, and an educator
 * preparing a session needs to know they're teaching a 7-year-old rather than a
 * 17-year-old.
 *
 * It is also where the COPPA basis is satisfied. Consent is captured **here**,
 * at the moment child data is first entered — not at checkout. It cannot move to
 * checkout: this data is collected before payment, and a $0 comp booking has no
 * payment to hang consent off (ARCHITECTURE.md §4).
 *
 * The consent sentence is rendered from the shared contract constant rather than
 * retyped, so the wording shown and the wording hashed into the consent record
 * are the same string by construction.
 */
export function LearnerFields({ values, errors, onChange }: LearnerFieldsProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-[18px] max-[560px]:grid-cols-1">
        <FieldRow
          id="learnerFirstName"
          label="Your child's first name"
          error={errors.firstName}
        >
          <input
            id="learnerFirstName"
            name="learner.firstName"
            type="text"
            autoComplete="off"
            placeholder="First name only"
            value={values.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? "learnerFirstName-error" : undefined}
            className={fieldClasses(Boolean(errors.firstName))}
          />
        </FieldRow>

        <FieldRow id="learnerAgeBand" label="Age range" error={errors.ageBand}>
          <div className="relative">
            <select
              id="learnerAgeBand"
              name="learner.ageBand"
              value={values.ageBand}
              onChange={(event) =>
                onChange({ ageBand: event.target.value as LearnerAgeBand })
              }
              aria-invalid={errors.ageBand ? true : undefined}
              aria-describedby={errors.ageBand ? "learnerAgeBand-error" : undefined}
              className={fieldClasses(
                Boolean(errors.ageBand),
                "cursor-pointer appearance-none pr-[42px]",
              )}
            >
              <option value="">Select an age range</option>
              {AGE_BAND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FieldRow>
      </div>

      <FieldRow
        id="learnerFocus"
        label="What should the educator know?"
        error={errors.focus}
        optional
        hint="What they're working on, what they find hard, anything that helps the first session land."
        className="mt-5"
      >
        <textarea
          id="learnerFocus"
          name="learner.focus"
          placeholder="e.g. She's confident with fractions but freezes on word problems, and has a test in three weeks."
          value={values.focus}
          onChange={(event) => onChange({ focus: event.target.value })}
          aria-invalid={errors.focus ? true : undefined}
          aria-describedby={errors.focus ? "learnerFocus-error" : "learnerFocus-hint"}
          className={fieldClasses(
            Boolean(errors.focus),
            "min-h-[104px] resize-y leading-[1.55]",
          )}
        />
      </FieldRow>

      <div className="mt-5 rounded-[16px] border-l-[3px] border-gold bg-ivory px-[18px] py-4">
        <label className="flex cursor-pointer select-none items-start gap-[11px] text-[13.5px] leading-[1.55] text-muted">
          <input
            type="checkbox"
            name="learnerDataConsentGiven"
            checked={values.consentGiven}
            onChange={(event) => onChange({ consentGiven: event.target.checked })}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "learnerConsent-error" : undefined}
            className="mt-[2px] h-[18px] w-[18px] flex-none accent-[var(--slate)]"
          />
          <span>{CURRENT_LEARNER_CONSENT_TEXT}</span>
        </label>

        <p
          id="learnerConsent-error"
          hidden={!errors.consent}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors.consent}
        </p>

        <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-[1.55] text-muted">
          <ShieldIcon className="mt-px h-4 w-4 flex-none text-slate" />
          We never create a login for a child, and we ask for a first name only. These
          details reach an educator only after a coordinator confirms the booking and
          their background check is on file.
        </p>
      </div>
    </div>
  );
}
