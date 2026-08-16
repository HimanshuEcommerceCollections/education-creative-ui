import type { TeachBenefitIconName } from "@/components/become-a-tutor/become-icons";

/** One reason to teach on the platform, shown as a benefit card. */
export interface TeachBenefit {
  icon: TeachBenefitIconName;
  title: string;
  body: string;
}

/** One stage of the application-to-first-session path, in order. */
export interface TeachStep {
  title: string;
  body: string;
}

/** A `<select>` choice on the application form. */
export interface ApplyOption {
  value: string;
  label: string;
}

/** What an educator keeps control of, and what the platform takes off their plate. */
export const TEACH_BENEFITS: TeachBenefit[] = [
  {
    icon: "rate",
    title: "Set your own hourly rate",
    body: "You decide what your time is worth. The rate you choose is the rate shown on your profile — families see it up front before they reach out.",
  },
  {
    icon: "home",
    title: "In-home or online",
    body: "Teach in families’ homes across the Raleigh area, over live video, or a mix of both. You choose the formats and hours that fit your schedule.",
  },
  {
    icon: "calendar",
    title: "Parent-managed bookings",
    body: "A coordinator confirms every session with the parent, and payment runs through their account. You focus on teaching while we handle the logistics.",
  },
  {
    icon: "pin",
    title: "Reach local Raleigh families",
    body: "Get listed in a marketplace families in your area already browse across six subjects — from academic tutoring to music, languages, and cooking.",
  },
];

/** Application → first session, in four honest steps. */
export const TEACH_STEPS: TeachStep[] = [
  {
    title: "Apply",
    body: "Tell us who you are, what you teach, and a little about your experience using the short form below.",
  },
  {
    title: "Credentials & references reviewed",
    body: "We review your qualifications and check references. This step is real — it’s how families trust the marketplace.",
  },
  {
    title: "Get listed",
    body: "Once reviewed, you build your profile, set your hourly rate, and choose your subjects and formats.",
  },
  {
    title: "Start teaching",
    body: "Families reach out and book through their parent account. You show up prepared and teach your session.",
  },
];

/** The six subjects an applicant can teach — mirrors the marketplace taxonomy. */
export const APPLY_SUBJECTS: ApplyOption[] = [
  { value: "academic", label: "Academic Tutoring" },
  { value: "admissions", label: "College Admissions" },
  { value: "music", label: "Music" },
  { value: "languages", label: "Languages" },
  { value: "arts", label: "Arts & Crafts" },
  { value: "cooking", label: "Cooking" },
];

/** Experience bands on the application form. */
export const APPLY_EXPERIENCE: ApplyOption[] = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "10+ years" },
];
