"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { StaffMember, UserStatus } from "@contracts/staff-invites.ts";

import {
  grantStaffRoleAction,
  resendStaffInviteAction,
  revokeStaffRoleAction,
  setStaffStatusAction,
} from "@/app/(dashboard)/dashboard/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<UserStatus, string> = {
  invited: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  active: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  suspended: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  deactivated: "border-line bg-sand text-muted",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  invited: "Invite pending",
  active: "Active",
  suspended: "Suspended",
  deactivated: "Deactivated",
};

const LINK_BUTTON = "text-[13px] font-semibold transition-colors";

const FIELD =
  "rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

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

/** Which panel of the row is open. Only one at a time — these aren't small decisions. */
type OpenPanel = "none" | "status" | "roles";

/**
 * One member of staff, with the controls that were missing.
 *
 * The roster rendered `suspended` and `deactivated` badges and offered no way to
 * reach either state, no resend for an invite that never arrived, and no role grant
 * — the promotion path was a CLI script on a server. Every state this row can
 * *display* it can now also *cause*.
 *
 * The two invariants that make this safe to expose are the API's, not this
 * component's: nobody may act on their own account, and the last active admin
 * cannot be stripped or suspended. So the controls render and the refusal, when it
 * comes, is shown — rather than this UI guessing at rules it can't enforce.
 */
export function StaffRow({
  member,
  isSelf,
}: {
  member: StaffMember;
  /** The signed-in admin's own row. The API refuses self-service either way. */
  isSelf: boolean;
}) {
  const [statusState, statusAction] = useActionState(setStaffStatusAction, IDLE);
  const [grantState, grantAction] = useActionState(grantStaffRoleAction, IDLE);
  const [revokeState, revokeAction] = useActionState(revokeStaffRoleAction, IDLE);
  const [resendState, resendAction] = useActionState(resendStaffInviteAction, IDLE);
  const [panel, setPanel] = useState<OpenPanel>("none");

  const expired = sessionExpired(statusState, grantState, revokeState, resendState);
  const failed =
    statusState.status === "error" ||
    grantState.status === "error" ||
    revokeState.status === "error" ||
    resendState.status === "error";

  const message = expired
    ? undefined
    : formMessage(statusState) ??
      formMessage(grantState) ??
      formMessage(revokeState) ??
      formMessage(resendState) ??
      (statusState.status === "success" ? statusState.message : undefined) ??
      (grantState.status === "success" ? grantState.message : undefined) ??
      (revokeState.status === "success" ? revokeState.message : undefined) ??
      (resendState.status === "success" ? resendState.message : undefined);

  const suspended = member.status === "suspended" || member.status === "deactivated";
  const isAdmin = member.roles.includes("admin");

  return (
    <li className="rounded-[18px] border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[17px] font-semibold tracking-[-0.01em]">
              {member.fullName}
            </h3>
            <span
              className={cn(
                "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                STATUS_STYLES[member.status],
              )}
            >
              {STATUS_LABELS[member.status]}
            </span>
            {isSelf ? (
              <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">
                You
              </span>
            ) : null}
          </div>
          <p className="mt-[6px] text-[13.5px] text-muted">{member.email}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-semibold capitalize text-slate">
            {member.roles.join(" · ")}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            {member.status === "invited" ? "invited " : "joined "}
            {new Date(member.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      {/*
        `isSelf` hides the controls rather than disabling them: the API refuses a
        self-directed change regardless, and offering a button whose only outcome is
        a refusal is worse than not offering it.
      */}
      {isSelf ? (
        <p className="mt-4 border-t border-line pt-4 text-[12.5px] leading-[1.5] text-muted">
          You can&rsquo;t change your own roles or status — another administrator has to.
          That guard lives on the server.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4">
          {member.status === "invited" ? (
            <form action={resendAction}>
              <input type="hidden" name="userId" value={member.userId} />
              <PendingButton
                label="Resend invite"
                pendingLabel="Sending…"
                className="border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
              />
            </form>
          ) : null}

          <button
            type="button"
            onClick={() => setPanel(panel === "roles" ? "none" : "roles")}
            aria-expanded={panel === "roles"}
            className={cn(LINK_BUTTON, "text-slate hover:text-gold")}
          >
            {panel === "roles" ? "Hide roles" : "Change roles"}
          </button>

          <button
            type="button"
            onClick={() => setPanel(panel === "status" ? "none" : "status")}
            aria-expanded={panel === "status"}
            className={cn(
              LINK_BUTTON,
              suspended ? "text-[#256a45] hover:underline" : "text-[#a63a30] hover:underline",
            )}
          >
            {suspended ? "Restore access" : "Suspend or deactivate"}
          </button>
        </div>
      )}

      {panel === "roles" && !isSelf ? (
        <div className="mt-4 flex flex-col gap-3 rounded-[14px] border border-line bg-sand px-4 py-4">
          <p className="text-[12.5px] leading-[1.5] text-muted">
            A session&rsquo;s active role is fixed at sign-in, so a change takes effect
            once they sign out and back in. Revoking a role signs them out immediately.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <form action={grantAction} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="userId" value={member.userId} />
              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Grant
                <select
                  name="role"
                  defaultValue={isAdmin ? "coordinator" : "admin"}
                  className={cn(FIELD, "w-[170px]")}
                >
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
              <PendingButton
                label="Grant role"
                pendingLabel="Granting…"
                className="border-transparent bg-slate text-white hover:bg-slate-deep"
              />
            </form>

            <form action={revokeAction} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="userId" value={member.userId} />
              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Revoke
                <select
                  name="role"
                  defaultValue={isAdmin ? "admin" : "coordinator"}
                  className={cn(FIELD, "w-[170px]")}
                >
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
              <PendingButton
                label="Revoke role"
                pendingLabel="Revoking…"
                className="border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]"
              />
            </form>
          </div>
          {fieldError(grantState, "role") ?? fieldError(revokeState, "role") ? (
            <p className="text-[12px] text-[#a63a30]">
              {fieldError(grantState, "role") ?? fieldError(revokeState, "role")}
            </p>
          ) : null}
        </div>
      ) : null}

      {panel === "status" && !isSelf ? (
        <form
          action={statusAction}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-[14px] border border-line bg-sand px-4 py-4"
        >
          <input type="hidden" name="userId" value={member.userId} />
          <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
            New status
            <select
              name="status"
              defaultValue={suspended ? "active" : "suspended"}
              className={cn(FIELD, "w-[170px]")}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
            Why? This goes in the audit log.
            <input
              name="reason"
              required
              placeholder="Left the team on 3 Sep"
              aria-invalid={Boolean(fieldError(statusState, "reason"))}
              className={FIELD}
            />
          </label>
          <PendingButton
            label="Save"
            pendingLabel="Saving…"
            className="border-transparent bg-slate text-white hover:bg-slate-deep"
          />
          {fieldError(statusState, "reason") ? (
            <p className="w-full text-[12px] text-[#a63a30]">
              {fieldError(statusState, "reason")}
            </p>
          ) : null}
          <p className="w-full text-[12px] leading-[1.5] text-muted">
            Both stop the account signing in and drop its live sessions.{" "}
            <b className="font-semibold">Suspended</b> is the reversible one;{" "}
            <b className="font-semibold">deactivated</b> means the same to every read
            path and records that the departure was meant to be permanent.
          </p>
        </form>
      ) : null}
    </li>
  );
}
