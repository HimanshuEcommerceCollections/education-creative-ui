import Image from "next/image";
import Link from "next/link";

import type { SubjectEducator } from "@/types/subject-page";

const OVERLAY_HOVER =
  "group-hover:after:bg-[linear-gradient(180deg,rgba(16,20,30,0.12)_0%,rgba(18,22,34,0.9)_62%)] " +
  "group-focus-visible:after:bg-[linear-gradient(180deg,rgba(16,20,30,0.12)_0%,rgba(18,22,34,0.9)_62%)]";

/**
 * Educator card: name by default, full detail revealed on hover/focus. A whole
 * card link (the source used a click handler), keyboard-accessible.
 */
export function EducatorCard({ educator }: { educator: SubjectEducator }) {
  return (
    <Link
      href={educator.href}
      className={`group relative block h-[440px] overflow-hidden rounded-[20px] shadow-[0_34px_66px_-34px_rgba(24,24,24,0.35)] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(16,20,30,0)_45%,rgba(16,20,30,0.78)_100%)] after:transition-[background] after:duration-500 after:content-[''] ${OVERLAY_HOVER}`}
    >
      <Image
        src={educator.image.src}
        alt={educator.image.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 30vw"
        className="object-cover transition-transform duration-[1100ms] ease-brand group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-5 z-[2] text-white [transition:transform_0.55s_cubic-bezier(0.16,0.7,0.2,1),opacity_0.4s_ease] group-hover:-translate-y-2 group-hover:opacity-0 group-focus-visible:-translate-y-2 group-focus-visible:opacity-0"
      >
        <h3 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">
          {educator.name}
        </h3>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
          {educator.role}
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-[22px] z-[2] translate-y-[18px] text-white opacity-0 [transition:opacity_0.5s_ease_0.08s,transform_0.55s_cubic-bezier(0.16,0.7,0.2,1)_0.08s] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <h3 className="mb-1 font-serif text-[24px] font-semibold">
          {educator.name}
        </h3>
        <div className="mb-[10px] text-[12px] tracking-[0.04em] text-white/80">
          {educator.meta}
        </div>
        <span className="mb-3 inline-block rounded-[20px] bg-gold px-[11px] py-1 text-[12px] font-bold text-white">
          ★ {educator.rating}
        </span>
        <p className="mb-[14px] text-[13.5px] leading-[1.55] text-white/90">
          {educator.bio}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-[19px] font-semibold">
            {educator.price}
          </span>
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-gold">
            View profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
