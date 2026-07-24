/** Brand-level constants shared across metadata, header, and footer. */
export const SITE = {
  name: "Your Learning Journey",
  location: "Raleigh",
  tagline:
    "Trusted independent educators for academic and creative learning, in Raleigh — online or in your home.",
  description:
    "Book vetted tutors for academics, music, arts, languages, cooking, and more — online or in your home.",
} as const;

/** Destination for the header "Book" call-to-action (the contact page). */
export const BOOK_HREF = "/contact";

/** Route for the header "Sign in" action. */
export const SIGNIN_HREF = "/login";
