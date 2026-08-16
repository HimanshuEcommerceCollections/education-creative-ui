import Link from "next/link";

import {
  CONTACT_REASON_LABELS,
  type ContactRequestRecord,
  type ContactRequestStatus,
} from "@contracts/contact-requests.ts";

import { ContactRequestActions } from "@/components/dashboard/contact-request-actions";
import { ageLabel, arrivedLabel, hasAged } from "@/lib/dashboard/contact-requests";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ContactRequestStatus, string> = {
  new: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  in_progress: "border-[rgba(46,58,115,0.3)] bg-[rgba(var(--slate-rgb),0.08)] text-slate",
  resolved: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  spam: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
};

export const CONTACT_STATUS_LABELS: Record<ContactRequestStatus, string> = {
  new: "New",
  in_progress: "Being worked",
  resolved: "Resolved",
  spam: "Spam",
};

export function ContactStatusBadge({ status }: { status: ContactRequestStatus }) {
  return (
    <span
      className={cn(
        "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
        STATUS_STYLES[status],
      )}
    >
      {CONTACT_STATUS_LABELS[status]}
    </span>
  );
}

/**
 * How much of the message the queue shows. Enough to tell a pricing question
 * from a safeguarding one without opening it; short enough that twenty-five rows
 * still read as a list.
 */
const PREVIEW_CHARS = 150;

/** The opening line, which is where people say what they actually want. */
function preview(message: string): string {
  const firstLine = message.split("\n").find((line) => line.trim().length > 0)?.trim() ?? "";
  return firstLine.length > PREVIEW_CHARS
    ? `${firstLine.slice(0, PREVIEW_CHARS)}…`
    : firstLine;
}

/**
 * One enquiry in the queue.
 *
 * A Server Component: nothing on the row is interactive except the controls, and
 * those live in their own client child. The row itself is text, which is how it
 * should reach the browser.
 *
 * The design decision worth naming is **age**. Everything else on the row could
 * be read from the detail view; how long someone has been waiting for an answer
 * can only be understood next to the other rows, and it is the one number that
 * says whether this queue is being run or merely stored. So it is a standing
 * element with its own emphasis, and it shouts once it passes a working day.
 */
export function ContactRequestRow({
  request,
  readAt,
  viewerId,
}: {
  request: ContactRequestRecord;
  /** The instant the page read the queue — see `loadContactQueue`. */
  readAt: number;
  viewerId: string;
}) {
  const open = request.status === "new" || request.status === "in_progress";
  const ageing = open && hasAged(request.createdAt, readAt);
  const heldByViewer = request.assignedToId === viewerId;
  const href = `/dashboard/queries/${encodeURIComponent(request.id)}`;

  return (
    <li className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_50px_-46px_rgba(35,40,70,0.4)] max-[560px]:p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em]">
              <Link
                href={href}
                className="text-ink no-underline transition-colors hover:text-slate"
              >
                {request.name}
              </Link>
            </h3>
            <ContactStatusBadge status={request.status} />
            <span className="rounded-[30px] border border-line bg-sand px-[11px] py-[3px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">
              {CONTACT_REASON_LABELS[request.reason]}
            </span>
          </div>

          <p className="mt-[10px] text-[14px] leading-[1.6] text-ink">
            {preview(request.message) || (
              <span className="italic text-muted">No message text.</span>
            )}
          </p>

          <p className="mt-2 text-[13px] text-muted">
            {request.assignedToName ? (
              <>
                <b className="font-semibold text-ink">
                  {heldByViewer ? "You have it" : `${request.assignedToName} has it`}
                </b>
              </>
            ) : (
              <b className="font-semibold text-[#a63a30]">Nobody has picked it up</b>
            )}
            {" · arrived "}
            {arrivedLabel(request.createdAt)}
          </p>
        </div>

        {/*
          Age, given its own corner rather than buried in the meta line. This is
          the figure the queue is run on — a `new` row that reads "3d 4h" is the
          reason someone opens this screen at all.
        */}
        <div className="shrink-0 text-right">
          <p
            className={cn(
              "font-serif text-[26px] font-semibold leading-none tracking-[-0.02em]",
              ageing ? "text-[#a63a30]" : "text-ink",
            )}
          >
            {ageLabel(request.createdAt, readAt)}
          </p>
          <p
            className={cn(
              "mt-[6px] text-[11.5px] font-bold uppercase tracking-[0.08em]",
              ageing ? "text-[#a63a30]" : "text-muted",
            )}
          >
            {open ? "Waiting" : "Since arrival"}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <ContactRequestActions request={request} viewerId={viewerId} />
        <p className="mt-4">
          <Link
            href={href}
            className="text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold"
          >
            Open the whole enquiry &rarr;
          </Link>
        </p>
      </div>
    </li>
  );
}
