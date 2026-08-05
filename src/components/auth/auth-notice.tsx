import Link from "next/link";

import { CheckIcon } from "./auth-icons";

interface AuthNoticeProps {
  title: string;
  message: string;
  tone?: "success" | "error";
  action?: { label: string; href: string };
  children?: React.ReactNode;
}

/**
 * Terminal state for the token-driven flows — email confirmed, link expired,
 * reset link sent. Shares the auth panel's centred composition so these pages
 * don't need their own layout.
 */
export function AuthNotice({
  title,
  message,
  tone = "success",
  action,
  children,
}: AuthNoticeProps) {
  return (
    <div className="w-full max-w-[400px] text-center">
      <div
        className={
          tone === "success"
            ? "mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gold text-[#1a1508] shadow-[0_16px_36px_-12px_rgba(210,162,65,0.6)]"
            : "mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[26px] font-semibold text-[#a63a30]"
        }
      >
        {tone === "success" ? <CheckIcon className="h-[34px] w-[34px]" /> : "!"}
      </div>

      <h1 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="mx-auto mt-[10px] max-w-[38ch] text-[14.5px] leading-[1.6] text-muted">
        {message}
      </p>

      {children}

      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex rounded-[30px] border-[1.5px] border-line px-[22px] py-[11px] text-[13.5px] font-semibold text-ink transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
