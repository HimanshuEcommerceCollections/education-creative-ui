import type { ImageAsset } from "@/types/media";
import type { SubjectStat } from "@/types/subject-page";

/** A labelled step in the process strip below the hero. */
export interface ProcessStep {
  num: string;
  label: string;
}

/** A milestone on the interactive junior-year-to-decision-day timeline. */
export interface Milestone {
  season: string;
  title: string;
  body: string;
  points: string[];
}

/** A card in the "how we help" horizontal rail. */
export interface HelpCard {
  num: string;
  title: string;
  description: string;
  image: ImageAsset;
}

/** A question/answer pair in the admissions FAQ. */
export interface AdmissionsFaqItem {
  id: string;
  question: string;
  answer: string;
}

/** The five-beat process shown as a ticker strip under the hero. */
export const ADMISSIONS_PROCESS: ProcessStep[] = [
  { num: "01", label: "Essays" },
  { num: "02", label: "Applications" },
  { num: "03", label: "Interviews" },
  { num: "04", label: "Aid & Scholarships" },
  { num: "05", label: "Decisions" },
];

/** Milestones for the pinned timeline, junior spring through spring. */
export const ADMISSIONS_MILESTONES: Milestone[] = [
  {
    season: "Junior Spring",
    title: "Map the story",
    body: "We take stock together — courses, activities, interests — and sketch the narrative a college will meet.",
    points: [
      "Course plan and rigor check",
      "Testing timeline that fits the student",
      "Finding the activity story worth telling",
    ],
  },
  {
    season: "Summer",
    title: "Draft the essay",
    body: "Quiet weeks are for drafts. Your counselor workshops the personal statement line by line — the student's voice, sharpened, never replaced.",
    points: [
      "Topic discovery sessions",
      "A three-draft revision cycle",
      "Supplemental essays mapped early",
    ],
  },
  {
    season: "Senior Fall",
    title: "Build and submit",
    body: "A balanced, realistic college list and organized applications — every deadline tracked, every submission calm.",
    points: [
      "Balanced list: reach, match, likely",
      "Early vs. regular decision strategy",
      "Full application review before submitting",
    ],
  },
  {
    season: "Winter",
    title: "Interviews and aid",
    body: "Practice interviews until they feel like conversation, and financial-aid paperwork filed without the panic.",
    points: [
      "Mock interviews with real feedback",
      "FAFSA and CSS Profile guidance",
      "Scholarship search, organized",
    ],
  },
  {
    season: "Spring",
    title: "Decide well",
    body: "Offers in hand, we compare honestly — fit, finances, and feeling — so the final choice belongs to the family.",
    points: [
      "Side-by-side offer comparison",
      "Questions to ask on revisit days",
      "A calm commitment checklist",
    ],
  },
];

/** The three kinds of support, shown in the 3D scroll rail. */
export const ADMISSIONS_HELP: HelpCard[] = [
  {
    num: "01",
    title: "Essay coaching",
    description:
      "The one part of an application only the student can write — workshopped draft by draft, voice intact.",
    image: {
      src: "/assets/admissions/images/help-essay.jpg",
      alt: "Student workshopping an essay draft",
    },
  },
  {
    num: "02",
    title: "Application strategy",
    description:
      "A balanced college list, every deadline on one calendar, and full reviews before anything is submitted.",
    image: {
      src: "/assets/admissions/images/help-strategy.jpg",
      alt: "Organizing applications and deadlines",
    },
  },
  {
    num: "03",
    title: "Interviews, aid & decisions",
    description:
      "Mock interviews, financial-aid paperwork demystified, and an honest side-by-side when offers arrive.",
    image: {
      src: "/assets/admissions/images/help-interviews.jpg",
      alt: "Practice interview across the table",
    },
  },
];

/**
 * Subject stats strip.
 *
 * On a page aimed at families making a college decision, a decorative statistic is
 * the last thing that belongs, so every tile states only what the page and the
 * policy guarantee: the roadmap below has five milestones, credentials are reviewed
 * before a counselor is listed, and an unconfirmed booking refunds itself. Nothing
 * in the product collects a review and nothing counts delivered work, so no tile
 * may claim an average rating, families guided, or essays workshopped.
 */
export const ADMISSIONS_STATS: SubjectStat[] = [
  { id: "milestones", value: ADMISSIONS_MILESTONES.length, label: "Milestones mapped" },
  { id: "checked", value: 100, suffix: "%", label: "Credentials reviewed" },
  // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
  // booking flow makes before anyone pays.
  { id: "confirmation", value: 2, suffix: " days", label: "To confirm, or refund" },
];

/** Honest answers to the questions every family asks. */
export const ADMISSIONS_FAQ: AdmissionsFaqItem[] = [
  {
    id: "guarantee",
    question: "Can you guarantee admission to a specific college?",
    answer:
      "No — and be wary of anyone who says otherwise. Admissions decisions belong to admissions offices. What we can promise is a thorough, organized, honest process: strong essays in the student's own voice, a balanced list, and no missed deadlines.",
  },
  {
    id: "start",
    question: "When should we start?",
    answer:
      "Junior spring is the sweet spot — enough runway without the rush. That said, the roadmap adapts: earlier planners get a gentler pace, and senior-year starters get a focused sprint.",
  },
  {
    id: "parents",
    question: "How are parents involved?",
    answer:
      "Parents are welcome in any session and receive a short note after each one. For students under 18, all scheduling, payment, and communication run through a parent or guardian — always.",
  },
];
