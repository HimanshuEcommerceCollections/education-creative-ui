import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "light"
  | "ghost"
  | "gold";

/** Shared `.btn` styles from the source. */
const BASE =
  "inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-[9px] " +
  "rounded-[40px] border border-transparent px-8 py-4 font-sans text-[15px] font-semibold " +
  "tracking-[0.01em] no-underline transition-[transform,background-color,box-shadow,letter-spacing] " +
  "duration-[450ms] ease-brand motion-reduce:transition-none";

/**
 * `.btn.pri` / `.sec` / `.light` / `.ghost` variants.
 *
 * `secondary` reproduces the source's hero `.btn.sec` in its only rendered
 * form — the white/transparent treatment used over the hero video.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-slate text-white hover:-translate-y-[3px] hover:bg-slate-deep " +
    "hover:tracking-[0.04em] hover:shadow-[0_18px_40px_-12px_rgba(46,58,115,0.42)]",
  secondary:
    "border-[rgba(255,255,255,0.55)] bg-transparent text-white " +
    "hover:-translate-y-[2px] hover:bg-[rgba(30,28,25,0.05)]",
  outline:
    "border-[rgba(30,28,25,0.28)] bg-transparent text-ink " +
    "hover:-translate-y-[2px] hover:bg-[rgba(30,28,25,0.05)]",
  light: "bg-ivory text-ink hover:-translate-y-[2px]",
  ghost:
    "border-[rgba(255,255,255,0.5)] bg-transparent text-white " +
    "hover:-translate-y-[2px] hover:bg-[rgba(255,255,255,0.12)]",
  gold:
    "bg-gold text-slate-deep shadow-[0_12px_26px_rgba(210,162,65,0.35)] " +
    "hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(210,162,65,0.45)]",
};

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonElementProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
> & { href?: undefined };

type AnchorElementProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "children"
> & { href: string };

export type ButtonProps = CommonProps & (ButtonElementProps | AnchorElementProps);

function isAnchor(
  props: ButtonElementProps | AnchorElementProps,
): props is AnchorElementProps {
  return typeof props.href === "string";
}

/**
 * Polymorphic button that renders an `<a>` when given an `href` (the source
 * uses anchor-styled CTAs for on-page navigation) and a `<button>` otherwise.
 */
export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], className);

  if (isAnchor(props)) {
    // Internal routes ("/..." including "/#hash") navigate client-side via
    // next/link; hash-only ("#..."), mailto:, tel:, and external URLs stay <a>.
    if (props.href.startsWith("/")) {
      return (
        <Link className={classes} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
