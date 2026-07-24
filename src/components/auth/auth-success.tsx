"use client";

import { cn } from "@/lib/utils";

import { CheckIcon } from "./auth-icons";
import styles from "./auth-success.module.css";

interface AuthSuccessProps {
  show: boolean;
  title: string;
  message: string;
  againLabel: string;
  onAgain: () => void;
}

/**
 * Confirmation overlay that fills the form panel after a (demo) submit,
 * fading and scaling in over the form beneath it.
 */
export function AuthSuccess({ show, title, message, againLabel, onAgain }: AuthSuccessProps) {
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "absolute inset-0 z-[7] flex flex-col items-center justify-center bg-ivory px-10 text-center",
        "transition-[opacity,transform,visibility] duration-[450ms] ease-[cubic-bezier(0.16,0.7,0.2,1)]",
        show ? "visible scale-100 opacity-100" : "invisible scale-[0.96] opacity-0",
      )}
    >
      <div
        className={cn(
          styles.checkPop,
          "mb-[22px] flex h-[78px] w-[78px] items-center justify-center rounded-full bg-gold text-[#1a1508] shadow-[0_16px_36px_-12px_rgba(210,162,65,0.6)]",
        )}
      >
        <CheckIcon className="h-[38px] w-[38px]" />
      </div>
      <h2 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="mt-[10px] max-w-[340px] text-[14.5px] leading-[1.6] text-muted">{message}</p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 rounded-[30px] border-[1.5px] border-line px-[22px] py-[11px] text-[13.5px] font-semibold text-ink transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
      >
        {againLabel}
      </button>
    </div>
  );
}
