import type { Tutor } from "@/types/tutor";

/**
 * The featured educators in the homepage card stack.
 *
 * No rating field here, and none may be added. The gold `★ 4.9` badge is back on
 * the cards, but it is joined on by `TutorsSection` from the API's published
 * directory, keyed on the `id` below as the educator's slug — a rating written into
 * this file would render identically and mean nothing. A tutor the API holds no
 * rating for gets no badge at all. Experience and the intro are things an educator
 * tells us; a rating is something parents give.
 */
export const TUTORS: Tutor[] = [
  {
    id: "elena",
    subject: "Academic Tutoring",
    name: "Elena M.",
    experience: "8 years experience",
    intro:
      "Patient and structured, and wonderful with exam nerves — across core academic subjects.",
  },
  {
    id: "marcus",
    subject: "Music",
    name: "Marcus T.",
    experience: "12 years experience",
    intro:
      "Classically trained, but happiest teaching the songs you actually want to play.",
  },
  {
    id: "priya",
    subject: "College Admissions",
    name: "Priya S.",
    experience: "6 years experience",
    intro:
      "A former admissions reader who quietly demystifies essays and applications.",
  },
  {
    id: "lena",
    subject: "Arts & Crafts",
    name: "Lena K.",
    experience: "9 years experience",
    intro:
      "A working studio artist who brings hands-on making to every age and ability.",
  },
  {
    id: "sofia",
    subject: "Languages",
    name: "Sofia R.",
    experience: "7 years experience",
    intro:
      "Conversation-first Spanish and French, for children and adults alike.",
  },
  {
    id: "james",
    subject: "Cooking",
    name: "James O.",
    experience: "10 years experience",
    intro: "A professional chef teaching confident, everyday kitchen skills.",
  },
];
