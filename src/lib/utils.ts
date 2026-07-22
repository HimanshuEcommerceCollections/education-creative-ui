/**
 * Minimal className combiner.
 *
 * Intentionally dependency-free (no clsx / tailwind-merge) to avoid adding
 * libraries. It filters falsy values and joins the rest, which is enough for
 * conditional class composition in this project. It does NOT de-duplicate
 * conflicting Tailwind classes, so components keep their base and variant
 * classes non-overlapping and treat a passed `className` as additive.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
