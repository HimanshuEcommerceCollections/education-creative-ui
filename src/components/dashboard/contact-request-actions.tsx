"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ContactRequestRecord } from "@contracts/contact-requests.ts";

import { updateContactRequestAction } from "@/app/(dashboard)/dashboard/queries/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const PRIMARY = "border-transparent bg-slate text-white hover:bg-slate-deep";
const SECONDARY =
  "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";
const DANGER =
  "border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]";

function PendingButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(ACTION_BUTTON, className)}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * Everything staff can do to one enquiry: take it, let it go, say they're on it,
 * write down what came of it, or bin it.
 *
 * The only interactive part of the queue, which is why it is this small child
 * rather than the row or the page — both of those stay Server Components.
 *
 * Two `useActionState` hooks over the same action, deliberately. The resolve
 * form is the one control that can fail validation, and its error belongs under
 * its own textarea; sharing a single state would put "say what came of it"
 * beside the Take it button instead.
 *
 * Nothing here messages the person who wrote in. Staff answer from their own
 * mail client — what these buttons record is who owns the enquiry and how it
 * ended, and the copy says so where a reader might otherwise assume the opposite.
 */
export function ContactRequestActions({
  request,
  viewerId,
}: {
  request: ContactRequestRecord;
  /** The signed-in coordinator, so "Amelia has it" can read "You have it". */
  viewerId: string;
}) {
  const [quickState, quickAction] = useActionState(updateContactRequestAction, IDLE);
  const [resolveState, resolveAction] = useActionState(updateContactRequestAction, IDLE);
  const [resolving, setResolving] = useState(false);

  // A staff session idling out mid-triage is not a problem with this enquiry,
  // and never renders as one.
  const expired = sessionExpired(quickState, resolveState);
  const failed = quickState.status === "error" || resolveState.status === "error";
  const message = expired
    ? undefined
    : (formMessage(quickState) ??
      formMessage(resolveState) ??
      (quickState.status === "success" ? quickState.message : undefined) ??
      (resolveState.status === "success" ? resolveState.message : undefined));

  const held = request.assignedToId !== null;
  const heldByViewer = request.assignedToId === viewerId;
  const noteError = fieldError(resolveState, "resolutionNote");

  /*
   * Resolved and spam are ends, not states to push further. The row stays
   * readable under those filters — it is the record of a decision — but the
   * controls go, exactly as a moderated review's do.
   */
  const settled = request.status === "resolved" || request.status === "spam";

  // Collapses itself once the resolve lands, without an effect on the result.
  const notePanelOpen = resolving && resolveState.status !== "success";

  return (
    <div>
      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mb-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] text-slate",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? (
        <SessionExpiredAlert
          className={
            "mb-4 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.55)] " +
            "bg-[rgba(210,162,65,0.12)] px-[16px] py-[14px]"
          }
        />
      ) : null}

      {settled ? (
        <p className="text-[13px] leading-[1.6] text-muted">
          This one is closed, so there is nothing left to do to it. It stays here as
          the record of what was decided.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {!held ? (
              <form action={quickAction}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="assignToSelf" value="true" />
                <PendingButton
                  label="Take it"
                  pendingLabel="Taking…"
                  className={request.status === "new" ? PRIMARY : SECONDARY}
                />
              </form>
            ) : (
              <form action={quickAction}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="unassign" value="true" />
                <PendingButton
                  label={heldByViewer ? "Give it back" : "Release it"}
                  pendingLabel="Releasing…"
                  className={SECONDARY}
                />
              </form>
            )}

            {request.status === "new" ? (
              <form action={quickAction}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="status" value="in_progress" />
                <PendingButton
                  label="I'm on it"
                  pendingLabel="Saving…"
                  className={held ? PRIMARY : SECONDARY}
                />
              </form>
            ) : null}

            {!notePanelOpen ? (
              <button
                type="button"
                onClick={() => setResolving(true)}
                className="text-[13px] font-semibold text-slate transition-colors hover:text-gold"
              >
                Resolve this
              </button>
            ) : null}

            <form action={quickAction} className="ml-auto">
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="status" value="spam" />
              <PendingButton
                label="Not a real enquiry"
                pendingLabel="Filing…"
                className={DANGER}
              />
            </form>
          </div>

          {!held && request.status !== "new" ? (
            <p className="mt-3 text-[12.5px] leading-[1.5] text-muted">
              Nobody holds this one &mdash; take it so two people don&rsquo;t answer the
              same email.
            </p>
          ) : null}

          {notePanelOpen ? (
            <form action={resolveAction} className="mt-4">
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="status" value="resolved" />

              <label
                htmlFor={`resolutionNote-${request.id}`}
                className="text-[12px] font-semibold uppercase tracking-[0.07em] text-muted"
              >
                What came of it? (required)
              </label>
              <p className="mt-[6px] text-[12.5px] leading-[1.55] text-muted">
                This is a note for whoever opens the enquiry next &mdash;{" "}
                <b className="font-semibold text-ink">
                  it is not sent to {request.name}
                </b>
                . Reply from your own mail client, then say here what you told them.
              </p>
              <textarea
                id={`resolutionNote-${request.id}`}
                name="resolutionNote"
                rows={3}
                required
                maxLength={2000}
                placeholder="Emailed her three piano educators with availability on Thursdays; she's booking directly."
                aria-invalid={Boolean(noteError) || undefined}
                aria-describedby={noteError ? `resolutionNote-${request.id}-error` : undefined}
                className="mt-2 w-full rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13.5px] leading-[1.6] text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none"
              />
              {noteError ? (
                <p
                  id={`resolutionNote-${request.id}-error`}
                  className="mt-[6px] text-[12px] text-[#a63a30]"
                >
                  {noteError}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <PendingButton
                  label="Resolve"
                  pendingLabel="Resolving…"
                  className={PRIMARY}
                />
                <button
                  type="button"
                  onClick={() => setResolving(false)}
                  className="text-[13px] font-semibold text-muted transition-colors hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </>
      )}
    </div>
  );
}
