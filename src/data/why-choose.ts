import type { WhyItem } from "@/types/why";

export const WHY_ITEMS: WhyItem[] = [
  {
    id: "verified",
    number: "01",
    title: "Verified Educators",
    description:
      "Credentials & references reviewed before any educator is listed.",
    image: { src: "/assets/home/images/why-verified-educators.jpg", alt: "Verified educators" },
  },
  {
    id: "flexible",
    number: "02",
    title: "Flexible Scheduling",
    description: "Book around your family’s week — evenings, weekends, online.",
    image: { src: "/assets/home/images/why-flexible-scheduling.jpg", alt: "Flexible scheduling" },
  },
  {
    id: "safe",
    number: "03",
    title: "Safe Environment",
    description:
      "Stay present for in-home sessions; observe online lessons any time.",
    image: {
      src: "/assets/home/images/why-safe-environment.jpg",
      alt: "Safe learning environment",
    },
  },
  {
    id: "pricing",
    number: "04",
    title: "Transparent Pricing",
    description: "Each rate shown upfront. No hidden fees, no lock-in.",
    image: { src: "/assets/home/images/why-transparent-pricing.jpg", alt: "Transparent pricing" },
  },
];
