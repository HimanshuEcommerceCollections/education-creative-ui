import Link from "next/link";

/**
 * What a protected page renders when `/auth/session` couldn't be reached.
 *
 * The honest alternative to a login redirect: the visitor's cookie is untouched
 * and probably fine, so telling them to sign in again would be a lie that also
 * wastes their time. Retry is a plain link to the same URL — a reload, without
 * needing client JavaScript to offer one.
 */
export function ServiceUnavailable({
  message,
  retryHref,
}: {
  message: string;
  /** Where "Try again" points. Defaults to the account home. */
  retryHref?: string;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[560px] flex-col justify-center px-6 py-24 text-center">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-slate">
        Temporarily unavailable
      </p>
      <h1 className="font-serif text-[30px] font-semibold tracking-[-0.015em] max-[560px]:text-[25px]">
        We can&rsquo;t load this right now
      </h1>
      <p role="status" className="mt-4 text-[15px] leading-[1.65] text-muted">
        {message}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={retryHref ?? "/account"}
          className="rounded-[40px] border border-ink px-[24px] py-[11px] text-[14px] font-semibold text-ink no-underline transition-all duration-[400ms] ease-brand hover:bg-slate hover:text-ivory"
        >
          Try again
        </Link>
        <Link
          href="/support"
          className="rounded-[40px] border-[1.5px] border-line px-[24px] py-[11px] text-[14px] font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
        >
          Get help
        </Link>
      </div>
    </main>
  );
}
