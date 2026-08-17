"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ConfigField, ConfigGroup } from "@contracts/config.ts";

import { updateConfigAction } from "@/app/(dashboard)/dashboard/config/actions";
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
 * The site-configuration editors. Entirely data-driven: labels, help, bounds and
 * defaults all arrive on the API response, so the browser never holds a copy of
 * the registry — which is what keeps the platform's take rate and margin floor
 * off the wire to a role that may not read them.
 *
 * One form per group, matching how the settings actually relate: a take rate and
 * the margin floor it has to clear are validated together server-side, and
 * saving one without the other produces a state nobody chose.
 */

const NUMBER_INPUT =
  "w-[110px] rounded-[10px] border-[1.5px] border-line bg-sand px-[10px] py-[7px] text-[13.5px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/** The stored value in the unit the admin reads and types. */
function displayValue(setting: ConfigField): string {
  const value = setting.value;
  if (typeof value !== "number") return "";
  if (setting.kind === "money_cents") {
    return value % 100 === 0 ? String(value / 100) : (value / 100).toFixed(2);
  }
  if (setting.kind === "percent_bps") {
    return value % 100 === 0 ? String(value / 100) : (value / 100).toFixed(2);
  }
  return String(value);
}

/** The same conversion, for the "default: …" caption and the bounds line. */
function describe(setting: ConfigField, value: number | boolean): string {
  if (typeof value === "boolean") return value ? "on" : "off";
  if (setting.kind === "money_cents") return `$${(value / 100).toFixed(2)}`;
  if (setting.kind === "percent_bps") return `${value / 100}%`;
  return setting.unit ? `${value} ${setting.unit}` : String(value);
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-transparent bg-slate px-[18px] py-[8px] text-[12.5px] font-semibold text-white transition-colors hover:bg-slate-deep disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

function Feedback({ state }: { state: AuthFormState }) {
  // A staff session idling out isn't a problem with these numbers, so it doesn't
  // render as a red box under them.
  if (sessionExpired(state)) return <SessionExpiredAlert className="mt-4" />;

  const failed = state.status === "error";
  const message =
    formMessage(state) ?? (state.status === "success" ? state.message : undefined);
  if (!message) return null;

  return (
    <p
      role={failed ? "alert" : "status"}
      className={cn(
        "mt-4 rounded-[10px] border-[1.5px] px-3 py-2 text-[12.5px] leading-[1.5]",
        failed
          ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
          : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
      )}
    >
      {message}
    </p>
  );
}

/**
 * The provenance line under a setting.
 *
 * "Default" is not the same statement as "someone chose this and it happens to
 * match" — when a coordinator asks why the notice window is 24 hours, the answer
 * "nobody has ever changed it" and the answer "Priya set it to that on Tuesday"
 * lead to different conversations.
 */
function Provenance({ setting }: { setting: ConfigField }) {
  if (!setting.overridden) {
    return (
      <span className="text-[11.5px] text-muted">
        Platform default ({describe(setting, setting.defaultValue)}) — never changed
      </span>
    );
  }

  const when = setting.updatedAt
    ? new Date(setting.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <span className="text-[11.5px] text-muted">
      Default {describe(setting, setting.defaultValue)}
      {setting.updatedByName ? ` · set by ${setting.updatedByName}` : " · overridden"}
      {when ? ` on ${when}` : ""}
    </span>
  );
}

function BooleanRow({ setting, error }: { setting: ConfigField; error?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-t border-line py-4 first:border-t-0 first:pt-0">
      <div className="min-w-[220px] max-w-[52ch]">
        <label
          htmlFor={setting.key}
          className="text-[14px] font-semibold leading-[1.4] text-ink"
        >
          {setting.label}
        </label>
        <p className="mt-1 text-[12.5px] leading-[1.55] text-muted">{setting.help}</p>
        {setting.lockedReason ? (
          <p className="mt-2 rounded-[10px] border border-dashed border-line bg-sand/50 px-3 py-2 text-[12px] leading-[1.5] text-muted">
            {setting.lockedReason}
          </p>
        ) : null}
        <p className="mt-2">
          <Provenance setting={setting} />
        </p>
        {error ? <p className="mt-1 text-[12px] text-[#a63a30]">{error}</p> : null}
      </div>

      <label className="flex shrink-0 items-center gap-[10px] text-[13px] text-muted">
        <input
          id={setting.key}
          type="checkbox"
          name={setting.key}
          defaultChecked={setting.value === true}
          disabled={!setting.editable}
          aria-invalid={Boolean(error)}
          className="size-[18px] accent-[var(--slate)] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {setting.editable ? "Enabled" : "Fixed"}
      </label>
    </div>
  );
}

function NumberRow({ setting, error }: { setting: ConfigField; error?: string }) {
  const boundsId = `${setting.key}-bounds`;
  const bounds =
    setting.min !== undefined && setting.max !== undefined
      ? `${describe(setting, setting.min)} – ${describe(setting, setting.max)}`
      : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-t border-line py-4 first:border-t-0 first:pt-0">
      <div className="min-w-[220px] max-w-[52ch]">
        <label
          htmlFor={setting.key}
          className="text-[14px] font-semibold leading-[1.4] text-ink"
        >
          {setting.label}
        </label>
        <p className="mt-1 text-[12.5px] leading-[1.55] text-muted">{setting.help}</p>
        <p className="mt-2">
          <Provenance setting={setting} />
        </p>
        {error ? <p className="mt-1 text-[12px] text-[#a63a30]">{error}</p> : null}
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <span className="flex items-center gap-1 text-[13.5px] text-muted">
          {setting.kind === "money_cents" ? "$" : null}
          <input
            id={setting.key}
            name={setting.key}
            defaultValue={displayValue(setting)}
            inputMode="decimal"
            disabled={!setting.editable}
            aria-invalid={Boolean(error)}
            aria-describedby={bounds ? boundsId : undefined}
            className={NUMBER_INPUT}
          />
          {setting.kind === "percent_bps" ? <span className="text-[12px]">%</span> : null}
          {setting.unit ? <span className="text-[12px]">{setting.unit}</span> : null}
        </span>
        {bounds ? (
          <span id={boundsId} className="text-[11.5px] text-muted">
            {bounds}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One group, saved as a unit.
 *
 * Every setting in the group is submitted, not just the changed ones — the
 * server compares against what is stored and writes only the differences, so a
 * no-op save says "no changes to save" rather than stamping someone's name on
 * fourteen settings they didn't touch.
 */
export function ConfigGroupForm({ group }: { group: ConfigGroup }) {
  const [state, action] = useActionState(updateConfigAction, IDLE);

  const editable = group.settings.filter((setting) => setting.editable);

  return (
    <form action={action}>
      <input
        type="hidden"
        name="__fields"
        value={JSON.stringify(
          editable.map((setting) => ({ key: setting.key, kind: setting.kind })),
        )}
      />

      <div className="flex flex-col">
        {group.settings.map((setting) =>
          setting.kind === "boolean" ? (
            <BooleanRow
              key={setting.key}
              setting={setting}
              error={fieldError(state, setting.key)}
            />
          ) : (
            <NumberRow
              key={setting.key}
              setting={setting}
              error={fieldError(state, setting.key)}
            />
          ),
        )}
      </div>

      {editable.length > 0 ? (
        <div className="mt-5 flex justify-end border-t border-line pt-5">
          <SaveButton />
        </div>
      ) : null}

      <Feedback state={state} />
    </form>
  );
}
