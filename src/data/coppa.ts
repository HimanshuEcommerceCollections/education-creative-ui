/** A single parent-control point in the shared COPPA / child-safety band. */
export interface CoppaPoint {
  title: string;
  body: string;
}

/**
 * The canonical parent-supervision points shown in the COPPA band on
 * How It Works, About, Browse, Contact, and educator pages. Single source of
 * truth: every page that renders the band reads it from here, because a second copy
 * is a second wording, and this one is a child-safety claim. The bodies match the
 * band's own headline ("…books and supervises every session — always").
 */
export const COPPA_POINTS: CoppaPoint[] = [
  {
    title: "Parent creates the account",
    body: "Registration and profiles are set up and owned by a parent or guardian.",
  },
  {
    title: "Parent handles booking",
    body: "Scheduling, payment, and all contact with educators run through the parent.",
  },
  {
    title: "Parent stays involved",
    body: "A parent or guardian supervises every session, in-home or online.",
  },
];
