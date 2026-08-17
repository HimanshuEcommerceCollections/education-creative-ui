import type { ImageAsset } from "@/types/media";
import type { SubjectStat } from "@/types/subject-page";

/** One of the three arch-shaped "doors in" offer cards. */
export interface ArchOffer {
  id: string;
  /** Native greeting shown above the language name. */
  greeting: string;
  title: string;
  description: string;
  image: ImageAsset;
}

/** A greeting word drifting behind the offer arches. */
export interface FloatingGreeting {
  word: string;
  /** Percentage position within the section. */
  left: string;
  top: string;
  size: string;
  color: string;
  /** Baseline rotation (deg), plus per-word float duration/delay (s). */
  rotate: string;
  duration: string;
  delay: string;
}

/**
 * A featured language educator on the dark spotlight band.
 *
 * No `rating`, and no field may carry one: nothing in the product collects a review,
 * so a number stored here — especially one pre-decorated as `"★ 4.9"` — reaches the
 * page looking like a parent's verdict with nothing behind it.
 */
export interface LanguageEducator {
  id: string;
  name: string;
  role: string;
  experience: string;
  price: string;
  bio: string;
  href: string;
  image: ImageAsset;
}

/** The three languages taught, as arch cards. */
export const ARCH_OFFERS: ArchOffer[] = [
  {
    id: "spanish",
    greeting: "¡Hola!",
    title: "Spanish",
    description:
      "Conversation-first lessons for school support, travel, or heritage speakers reconnecting with family.",
    image: { src: "/assets/languages/images/offer-spanish.jpg", alt: "A Spanish conversation lesson in progress" },
  },
  {
    id: "french",
    greeting: "Bonjour !",
    title: "French",
    description:
      "From first bonjour to confident chatter — pronunciation coaching included from lesson one.",
    image: { src: "/assets/languages/images/offer-french.jpg", alt: "A French lesson with a patient educator" },
  },
  {
    id: "hindi",
    greeting: "नमस्ते",
    title: "Hindi",
    description:
      "Speaking, script, and culture together — popular with families keeping a language alive at home.",
    image: { src: "/assets/languages/images/offer-hindi.jpg", alt: "A Hindi lesson blending speech and script" },
  },
];

/** Greeting words that drift behind the offer arches (positions from source). */
export const FLOATING_GREETINGS: FloatingGreeting[] = [
  { word: "Hola", left: "2%", top: "6%", size: "101px", color: "rgba(var(--slate-rgb),0.05)", rotate: "5deg", duration: "14.5s", delay: "2.7s" },
  { word: "Bonjour", left: "70%", top: "3%", size: "68px", color: "rgba(var(--slate-rgb),0.05)", rotate: "-5deg", duration: "12.3s", delay: "3.7s" },
  { word: "नमस्ते", left: "38%", top: "10%", size: "67px", color: "rgba(var(--slate-rgb),0.05)", rotate: "-8deg", duration: "10s", delay: "3.2s" },
  { word: "Ciao", left: "86%", top: "38%", size: "49px", color: "rgba(var(--slate-rgb),0.05)", rotate: "5deg", duration: "15.8s", delay: "3.9s" },
  { word: "Hallo", left: "4%", top: "52%", size: "64px", color: "rgba(210,162,65,0.07)", rotate: "5deg", duration: "12.7s", delay: "0.4s" },
  { word: "こんにちは", left: "58%", top: "64%", size: "68px", color: "rgba(var(--slate-rgb),0.05)", rotate: "-5deg", duration: "14.4s", delay: "2s" },
  { word: "Olá", left: "24%", top: "78%", size: "69px", color: "rgba(210,162,65,0.07)", rotate: "5deg", duration: "11.1s", delay: "0s" },
  { word: "¿Qué tal?", left: "78%", top: "74%", size: "54px", color: "rgba(var(--slate-rgb),0.05)", rotate: "3deg", duration: "11.8s", delay: "3.3s" },
  { word: "Merci", left: "46%", top: "40%", size: "54px", color: "rgba(210,162,65,0.07)", rotate: "8deg", duration: "14.3s", delay: "3.1s" },
  { word: "Salut", left: "10%", top: "28%", size: "47px", color: "rgba(var(--slate-rgb),0.05)", rotate: "-8deg", duration: "9.8s", delay: "0.6s" },
];

/** The "speak first, perfect later" approach bullets. */
export const APPROACH_POINTS: string[] = [
  "Real conversation from lesson one — no silent semesters",
  "Culture woven in: food, films, festivals, and family phrases",
  "School-curriculum support available when exams loom",
];

/** The two featured language educators. */
export const LANGUAGE_EDUCATORS: LanguageEducator[] = [
  {
    id: "lena",
    name: "Lena K.",
    role: "Spanish & French",
    experience: "7 yrs experience",
    price: "$52/hr",
    bio: "Warm, patient, and relentlessly conversational — Lena's students often forget they're in a lesson at all.",
    href: "/browse",
    image: { src: "/assets/languages/images/educator-lena.jpg", alt: "Lena K., Spanish and French educator" },
  },
  {
    id: "sofia",
    name: "Sofia R.",
    role: "Hindi & English",
    experience: "6 yrs experience",
    price: "$48/hr",
    bio: "Script, songs, and stories — Sofia teaches Hindi the way families speak it, with culture in every lesson.",
    href: "/browse",
    image: { src: "/assets/languages/images/educator-sofia.jpg", alt: "Sofia R., Hindi and English educator" },
  },
];

/**
 * Count-up figures for the stats strip.
 *
 * Both counts below are read off the arrays this page renders, and the confirmation
 * window is the policy the booking flow is built on. Ratings are published per educator,
 * not as a platform average, and there is no session history to count, so nothing here
 * may state an average rating or a monthly lesson tally.
 */
export const LANGUAGES_STATS: SubjectStat[] = [
  { id: "languages", value: ARCH_OFFERS.length, label: "Languages offered" },
  { id: "educators", value: LANGUAGE_EDUCATORS.length, label: "Vetted educators" },
  // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
  // booking flow makes before anyone pays.
  { id: "confirmation", value: 2, suffix: " days", label: "To confirm, or refund" },
];
