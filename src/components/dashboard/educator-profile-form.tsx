"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { StaffEducatorProfile } from "@contracts/educators.ts";

import { updateEducatorProfileAction } from "@/app/(dashboard)/dashboard/educators/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-[11px] border-[1.5px] border-line bg-white px-[13px] py-[9px] text-[13.5px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:outline-none";

const LABEL =
  "flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted";

const HINT = "text-[12px] font-normal normal-case tracking-normal leading-[1.5] text-muted";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-transparent bg-slate px-[18px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-slate-deep disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save profile"}
    </button>
  );
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
      {message}
    </span>
  );
}

/**
 * Staff editing an educator's public profile.
 *
 * `subjects` is the field that carries real consequences and doesn't look like
 * it: it is the authoritative list of what this person teaches, compared
 * verbatim by the booking form and the quote path. An educator with an empty
 * list is refused for every topic, which means an *approved* educator with no
 * subjects is still unbookable — a state that otherwise shows up as a booking
 * that mysteriously won't take rather than as a profile that isn't finished. The
 * callout below is on the field itself, where it can actually be acted on.
 *
 * The slug isn't editable. It is a public URL that may already be linked to, so
 * changing it is a redirect problem rather than a form field, and the API
 * doesn't accept it either.
 */
export function EducatorProfileForm({ educator }: { educator: StaffEducatorProfile }) {
  const [state, formAction] = useActionState(updateEducatorProfileAction, IDLE);

  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired
    ? undefined
    : formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  const noSubjects = educator.subjects.length === 0;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="slug" value={educator.slug} />

      <div className="flex flex-wrap gap-5">
        <label className={cn(LABEL, "min-w-[220px] flex-1")}>
          Display name
          <input
            name="name"
            required
            defaultValue={educator.name}
            aria-invalid={Boolean(fieldError(state, "name")) || undefined}
            className={FIELD}
          />
          <FieldError message={fieldError(state, "name")} />
        </label>

        <label className={cn(LABEL, "min-w-[220px] flex-[2]")}>
          Headline
          <input
            name="headline"
            maxLength={200}
            defaultValue={educator.headline ?? ""}
            placeholder="Piano and music theory, ages 6–16"
            aria-invalid={Boolean(fieldError(state, "headline")) || undefined}
            className={FIELD}
          />
          <span className={HINT}>
            One line, shown under their name on the public profile. Leave it empty to
            clear it.
          </span>
          <FieldError message={fieldError(state, "headline")} />
        </label>
      </div>

      <label className={LABEL}>
        Subjects they teach
        <textarea
          name="subjects"
          rows={3}
          defaultValue={educator.subjects.join("\n")}
          placeholder={"Piano\nMusic theory\nGuitar"}
          aria-invalid={Boolean(fieldError(state, "subjects")) || undefined}
          aria-describedby="educator-subjects-hint"
          className={cn(FIELD, "resize-y leading-[1.55]")}
        />
        <span id="educator-subjects-hint" className={HINT}>
          One topic per line, or separated by commas. These are matched word for word
          against what a parent picks when they book.
        </span>
        <FieldError message={fieldError(state, "subjects")} />
      </label>

      {/*
        Stated where it can be fixed, not on a summary somewhere else. "Approved
        but unbookable" is the specific trap: the child-safety gate is open and
        the booking flow still refuses every topic.
      */}
      {noSubjects ? (
        <p
          role="status"
          className="rounded-[12px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-4 py-3 text-[13px] leading-[1.6] text-ink"
        >
          <b className="font-semibold">This profile lists no subjects.</b> The booking
          flow only offers topics an educator has listed and rejects anything else, so{" "}
          {educator.verificationStatus === "approved" ? (
            <>
              {educator.name} is approved and still cannot be booked for anything.
              Adding at least one subject is what finishes the job.
            </>
          ) : (
            <>
              approving {educator.name} won&rsquo;t make them bookable on its own — add
              at least one subject as well.
            </>
          )}
        </p>
      ) : null}

      <label className={LABEL}>
        About
        <textarea
          name="about"
          rows={7}
          defaultValue={educator.about.join("\n\n")}
          placeholder="A paragraph about how they teach…"
          aria-invalid={Boolean(fieldError(state, "about")) || undefined}
          className={cn(FIELD, "resize-y leading-[1.6]")}
        />
        <span className={HINT}>
          Separate paragraphs with a blank line — each one is rendered as its own
          paragraph on the public profile.
        </span>
        <FieldError message={fieldError(state, "about")} />
      </label>

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      <div>
        <SaveButton />
      </div>
    </form>
  );
}
