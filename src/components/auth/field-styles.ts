/**
 * Shared field class strings for the auth forms, mirroring the source inputs
 * (white fill, 1.5px line border, gold focus ring). Kept in one place so the
 * text and password fields stay visually identical.
 */
export const FIELD_LABEL =
  "mb-[7px] block text-[12.5px] font-bold tracking-[0.02em] text-ink";

export const FIELD_BASE =
  "w-full rounded-[12px] border-[1.5px] border-line bg-white px-4 py-[14px] " +
  "font-sans text-[15px] text-ink transition-[border-color,box-shadow] duration-300 " +
  "placeholder:text-[#a7a7b0] focus:border-gold focus:outline-none " +
  "focus:shadow-[0_0_0_4px_rgba(210,162,65,0.16)]";

export const FIELD_ERROR =
  "border-[#c2483c] shadow-[0_0_0_4px_rgba(194,72,60,0.12)]";

export const FIELD_WRAP = "mb-4";
