import type { ReactNode } from "react";

interface DashboardPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Right-aligned actions beside the heading. */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Content frame for a dashboard page. Deliberately plainer than the marketing
 * site's `Section` — no radial washes or reveal animations, because these are
 * screens someone reads all day.
 */
export function DashboardPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: DashboardPageProps) {
  return (
    <main className="mx-auto max-w-[1120px] px-9 pb-16 pt-10 max-[999px]:px-6 max-[999px]:pt-7">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          {eyebrow ? (
            <p className="mb-[7px] text-[11.5px] font-bold uppercase tracking-[0.13em] text-slate">
              {eyebrow}
            </p>
          ) : null}
          {/*
            Some pages put a person's own text here — the queries detail titles
            itself with the sender's name — so one long token must wrap, not size
            the page.
          */}
          <h1 className="break-words font-serif text-[30px] font-semibold tracking-[-0.015em] max-[560px]:text-[25px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-[9px] max-w-[64ch] text-[14.5px] leading-[1.65] text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </header>

      {children}
    </main>
  );
}

/** Bordered content block. */
export function DashboardCard({
  title,
  action,
  children,
  footer,
}: {
  title?: string;
  /** Small control in the card's header row (a "view all" link, say). */
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-line bg-white p-6 shadow-[0_26px_54px_-48px_rgba(35,40,70,0.4)] max-[560px]:p-5">
      {title ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em]">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
      {footer ? <div className="mt-5 border-t border-line pt-5">{footer}</div> : null}
    </section>
  );
}

/**
 * Single figure with a label. Values are rendered as-is — anything derived from a
 * count should be computed server-side so the number and the list can't disagree.
 */
export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "attention";
}) {
  return (
    <div
      className={
        tone === "attention"
          ? "rounded-[16px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-5 py-[18px]"
          : "rounded-[16px] border border-line bg-white px-5 py-[18px]"
      }
    >
      <p className="mb-[6px] text-[11.5px] font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="font-serif text-[30px] font-semibold leading-none tracking-[-0.02em] text-ink">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[12.5px] leading-[1.45] text-muted">{hint}</p> : null}
    </div>
  );
}

/** Empty-state copy for a list with nothing in it. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[14px] border border-dashed border-line bg-sand/40 px-5 py-6 text-center text-[14px] leading-[1.6] text-muted">
      {children}
    </p>
  );
}
