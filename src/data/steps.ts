import type { Step } from "@/types/step";

export const STEPS: Step[] = [
  {
    id: "choose",
    number: "01",
    chapter: "Chapter One",
    title: "Choose a subject",
    description:
      "Begin with what they love, or what they need. Six subjects, academic and creative — and a simple choice of learning in your home or online.",
    image: { src: "/assets/home/images/step-choosing-subject.jpg", alt: "Choosing a subject" },
  },
  {
    id: "browse",
    number: "02",
    chapter: "Chapter Two",
    title: "Browse verified educators",
    description:
      "Every independent educator arrives vetted — credentials and references collected before they are ever listed. Read profiles, compare, and shortlist with confidence.",
    image: {
      src: "/assets/home/images/step-browsing-educators.jpg",
      alt: "Browsing verified educators",
    },
  },
  {
    id: "book",
    number: "03",
    chapter: "Chapter Three",
    title: "Book your first lesson",
    description:
      "Reserve a first session in minutes, with pricing shown upfront and no surprises. Stay close to every lesson, and reschedule any time.",
    image: { src: "/assets/home/images/step-booking-lesson.jpg", alt: "Booking the first lesson" },
  },
];
