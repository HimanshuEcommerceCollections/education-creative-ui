import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/media";

type SubjectTileVariant = "photo" | "block";

interface SubjectTileProps {
  variant: SubjectTileVariant;
  category: string;
  title: string;
  cta: string;
  href: string;
  description?: string;
  image?: ImageAsset;
  className?: string;
}

/** The `.go` CTA. Splitting the arrow lets the hover gap animation apply. */
function TileCta({ children }: { children: string }) {
  return (
    <span className="mt-[14px] inline-flex items-center gap-[7px] text-[11px] font-bold uppercase tracking-[0.1em] transition-[gap] duration-[400ms] group-hover:gap-[12px]">
      {children}
      <span aria-hidden="true">→</span>
    </span>
  );
}

const WRAPPER: Record<SubjectTileVariant, string> = {
  photo:
    "justify-end p-[26px] after:absolute after:inset-0 after:z-[1] after:content-[''] " +
    "after:bg-[linear-gradient(180deg,rgba(16,22,18,0.05)_38%,rgba(14,20,16,0.82)_100%)]",
  block: "justify-center bg-slate px-10 py-[34px]",
};

/**
 * A mosaic tile: an image-backed subject card (`photo`) or the solid intro
 * panel (`block`). Rendered as an anchor so the on-page navigation is
 * keyboard-accessible (the source used a click handler) and smooth-scrolls
 * via CSS.
 */
export function SubjectTile({
  variant,
  category,
  title,
  cta,
  href,
  description,
  image,
  className,
}: SubjectTileProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-[14px] text-white",
        WRAPPER[variant],
        className,
      )}
    >
      {variant === "photo" && image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw"
          className="z-0 object-cover [filter:saturate(0.95)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] group-hover:scale-[1.06]"
        />
      ) : null}

      <div className="relative z-[2] flex flex-col">
        <span
          className={cn(
            "mb-[6px] text-[10.5px] uppercase tracking-[0.2em]",
            variant === "photo" ? "opacity-85" : "opacity-70",
          )}
        >
          {category}
        </span>
        <h3
          className={cn(
            "font-serif font-semibold leading-none tracking-[-0.01em]",
            variant === "block"
              ? "max-w-[640px] text-[clamp(24px,2.6vw,36px)]"
              : "text-[clamp(22px,2vw,30px)]",
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-2 max-w-[30ch] text-[13.5px] leading-[1.5]">
            {description}
          </p>
        ) : null}
        <TileCta>{cta}</TileCta>
      </div>
    </a>
  );
}
