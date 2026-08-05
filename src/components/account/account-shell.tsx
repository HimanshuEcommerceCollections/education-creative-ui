import type { ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";

interface AccountShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Right-aligned actions beside the heading (sign out, primary CTA). */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Page frame for every signed-in surface — account, staff dashboard, educator
 * dashboard.
 *
 * These routes sit inside the `(site)` route group so they keep the one canonical
 * header and footer rather than growing a second, trimmed navigation. Section
 * navigation within a dashboard belongs *inside* this frame, not in a competing
 * top bar.
 */
export function AccountShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: AccountShellProps) {
  return (
    <main>
      <Section className="min-h-[70vh] bg-ivory bg-[radial-gradient(120%_80%_at_85%_0%,rgba(46,58,115,0.09)_0%,rgba(46,58,115,0)_55%)] pb-20 pt-[132px]">
        <Container>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-slate">
                {eyebrow}
              </p>
              <h1 className="font-serif text-[34px] font-semibold tracking-[-0.015em] max-[560px]:text-[27px]">
                {title}
              </h1>
              {description ? (
                <p className="mt-[10px] max-w-[62ch] text-[15px] leading-[1.65] text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
          </div>

          {children}
        </Container>
      </Section>
    </main>
  );
}

/** Bordered content block used across the signed-in pages. */
export function AccountCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-line bg-white p-7 shadow-[0_30px_60px_-48px_rgba(35,40,70,0.42)] max-[560px]:p-5">
      <h2 className="mb-5 font-serif text-[19px] font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      {children}
      {footer ? <div className="mt-5 border-t border-line pt-5">{footer}</div> : null}
    </section>
  );
}

/** Label/value row for the profile details list. */
export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-[13px] last:border-b-0">
      <dt className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="text-[15px] text-ink">{value}</dd>
    </div>
  );
}
