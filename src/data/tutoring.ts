import type {
  OfferItem,
  SubjectEducator,
  SubjectStat,
} from "@/types/subject-page";

/** Marquee ticker labels for the Tutoring subject page. */
export const TUTORING_MARQUEE: readonly string[] = [
  "Maths",
  "Science",
  "English",
  "Reading",
  "Writing",
  "Exam Prep",
];

/** "Three ways in" offer cards. */
export const TUTORING_OFFERS: OfferItem[] = [
  {
    id: "core",
    icon: "graduation",
    title: "Core Subjects",
    description:
      "Maths, science, and English — foundations rebuilt patiently, gap by gap.",
    image: { src: "/assets/tutoring/images/offer-core-subjects.jpg", alt: "Core Subjects" },
  },
  {
    id: "exam",
    icon: "target",
    title: "Exam Preparation",
    description:
      "Structured prep for school exams: pacing, past papers, and calm on the day.",
    image: { src: "/assets/tutoring/images/offer-exam-preparation.jpg", alt: "Exam Preparation" },
  },
  {
    id: "study",
    icon: "pencil",
    title: "Study Skills",
    description:
      "Notes, planning, and revision habits that stick — skills that outlast any one test.",
    image: { src: "/assets/tutoring/images/offer-study-skills.jpg", alt: "Study Skills" },
  },
];

/** Sample educator profiles. */
export const TUTORING_EDUCATORS: SubjectEducator[] = [
  {
    id: "elena",
    name: "Elena M.",
    role: "Academic Tutor",
    meta: "8 yrs experience · Online · In-home",
    rating: "4.9",
    bio: "Patient and structured, wonderful with exam nerves across core academic subjects.",
    price: "$55/hr",
    href: "/educators/elena",
    image: { src: "/assets/tutoring/images/educator-elena.jpg", alt: "Elena M., academic tutor" },
  },
  {
    id: "daniel",
    name: "Daniel A.",
    role: "Academic Tutor",
    meta: "5 yrs experience · Online",
    rating: "4.7",
    bio: "Maths and sciences made calm and clear, one concept at a time.",
    price: "$50/hr",
    href: "/educators/daniel",
    image: { src: "/assets/tutoring/images/educator-daniel.jpg", alt: "Daniel A., academic tutor" },
  },
];

/** Subject stats strip. */
export const TUTORING_STATS: SubjectStat[] = [
  { id: "monthly", value: 210, suffix: "+", label: "Tutoring sessions monthly" },
  { id: "tutors", value: 2, label: "Vetted tutors" },
  { id: "rating", value: 4.8, decimals: 1, label: "Average rating" },
];
