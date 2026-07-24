import Image from "next/image";
import type { ReactNode } from "react";

import type { ImageAsset } from "@/types/media";

interface OfferCardProps {
  image: ImageAsset;
  icon: ReactNode;
  title: string;
  description: string;
}

/** Offer card with a photo top and an icon badge straddling the seam. */
export function OfferCard({ image, icon, title, description }: OfferCardProps) {
  return (
    <div className="group h-full overflow-hidden rounded-[18px] border border-line bg-sand transition-[transform,box-shadow,border-color] duration-500 ease-brand hover:-translate-y-[6px] hover:border-[rgba(46,58,115,0.35)] hover:shadow-[0_30px_60px_-30px_rgba(24,24,24,0.25)]">
      <div className="relative h-[210px] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1100ms] ease-brand group-hover:scale-[1.06]"
        />
      </div>
      <div className="px-[26px] pb-[28px] pt-[26px]">
        <div className="relative mb-5 mt-[-52px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-ivory shadow-[0_10px_24px_-10px_rgba(24,24,24,0.3)]">
          {icon}
        </div>
        <h3 className="mb-2 font-serif text-[21px] font-semibold">{title}</h3>
        <p className="text-[14.5px] leading-[1.65] text-muted">{description}</p>
      </div>
    </div>
  );
}
