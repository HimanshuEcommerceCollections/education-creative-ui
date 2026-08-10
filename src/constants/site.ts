/** Brand-level constants shared across metadata, header, and footer. */
export const SITE = {
  name: "Your Learning Journey",
  location: "Raleigh",
  tagline:
    "Trusted independent educators for academic and creative learning, in Raleigh — online or in your home.",
  description:
    "Book vetted tutors for academics, music, arts, languages, cooking, and more — online or in your home.",
} as const;

/** Destination for the header "Book" call-to-action. */
export const BOOK_HREF = "/book";

/** Booking href prefilled with an educator, for their profile page CTAs. */
export function bookHrefFor(educatorSlug: string): string {
  return `${BOOK_HREF}?educator=${encodeURIComponent(educatorSlug)}`;
}

/** Route for the header "Sign in" action. */
export const SIGNIN_HREF = "/login";
