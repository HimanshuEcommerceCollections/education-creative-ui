import type { GoodToKnowIconName } from "@/components/requirements/requirements-icons";
import type { ImageAsset } from "@/types/media";

/** One entry on the "what you'll need" checklist. */
export interface RequirementItem {
  title: string;
  body: string;
}

/** One stage of the application review, in order. */
export interface ReviewStep {
  title: string;
  body: string;
}

/** An honest-expectations note, illustrated with a photo. */
export interface GoodToKnowNote {
  icon: GoodToKnowIconName;
  title: string;
  body: string;
  image: ImageAsset;
}

/** What an applicant needs before we can start a review. */
export const REQUIREMENTS: RequirementItem[] = [
  {
    title: "Relevant qualifications or demonstrable expertise",
    body: "A degree, certification, or a clear track record in your subject — across Academic Tutoring, College Admissions, Music, Languages, Arts & Crafts, or Cooking. Show us how you know what you teach.",
  },
  {
    title: "Professional references",
    body: "Two or more contacts who can speak to your teaching or work in the field. References help us confirm your experience is what it says it is.",
  },
  {
    title: "Consent to a background & credential review",
    body: "Because you may work with young learners, we ask for your consent to review your background and verify credentials before listing. Families expect this, and so do we.",
  },
  {
    title: "A professional, up-to-date profile",
    body: "A clear bio, the subjects you offer, your rates, and your availability. This is what families read first, so keeping it accurate matters.",
  },
  {
    title: "Reliable communication through the platform",
    body: "Messages, scheduling, and session details stay on the platform. It keeps a clear record for everyone and helps families reach you with confidence.",
  },
];

/** Application → listing, in four stages. */
export const REVIEW_STEPS: ReviewStep[] = [
  {
    title: "Submit application",
    body: "Tell us who you are, what you teach, and share your background and references through the application form.",
  },
  {
    title: "Credential & reference review",
    body: "We verify your qualifications, follow up with your references, and complete the background review you’ve consented to.",
  },
  {
    title: "Profile setup",
    body: "Once reviewed, you build your profile — bio, subjects, rates, and availability — and we help you polish it.",
  },
  {
    title: "Listed to families",
    body: "Your profile goes live in Browse. Families can find you, message you, and book sessions directly.",
  },
];

/** Expectations we set before someone applies. */
export const GOOD_TO_KNOW: GoodToKnowNote[] = [
  {
    icon: "shield",
    title: "You stay independent",
    body: "Educators are independent professionals. You set your own hourly rates, choose your subjects, and manage your own availability — we don’t set your prices.",
    image: {
      src: "/assets/requirements/images/know-independent.jpg",
      alt: "An educator preparing lesson materials at their own desk",
    },
  },
  {
    icon: "users",
    title: "Parents book and supervise",
    body: "For any learner under 18, a parent or guardian books and supervises every session. There is no separate child login — the account stays parent-managed throughout.",
    image: {
      src: "/assets/requirements/images/know-parents.jpg",
      alt: "A parent sitting alongside their child during a lesson",
    },
  },
  {
    icon: "info",
    title: "We describe support, not outcomes",
    body: "Your profile describes the support and practice you offer. We never promise specific scores, grades, or admissions results — learning is a partnership with each family.",
    image: {
      src: "/assets/requirements/images/know-support.jpg",
      alt: "An educator talking through a practice problem with a student",
    },
  },
];
