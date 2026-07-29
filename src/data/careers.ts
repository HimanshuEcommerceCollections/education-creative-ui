import type { RoleIconName, ValueIconName } from "@/components/careers/careers-icons";
import type { ImageAsset } from "@/types/media";

/** One "why work with us" card: a photo, an icon, and a short claim. */
export interface CareerValue {
  icon: ValueIconName;
  title: string;
  body: string;
  image: ImageAsset;
}

/** One sample opening in the roles accordion. */
export interface OpenRole {
  id: string;
  title: string;
  icon: RoleIconName;
  /** Department chip, shown beside its icon. */
  department: string;
  location: string;
  /** Employment type — rendered as the outlined chip. */
  type: string;
  summary: string;
  responsibilities: string[];
}

/** Background media for the Careers page's photo-backed sections. */
export const CAREERS_MEDIA = {
  heroBg: {
    src: "/assets/careers/images/hero-bg.jpg",
    alt: "A team working together",
  } satisfies ImageAsset,
  trustBg: {
    src: "/assets/careers/images/trust-bg.jpg",
    alt: "A team collaborating around a whiteboard",
  } satisfies ImageAsset,
  fitBg: {
    src: "/assets/careers/images/fit-bg.jpg",
    alt: "Colleagues working together",
  } satisfies ImageAsset,
  ctaBg: {
    src: "/assets/careers/images/cta-bg.jpg",
    alt: "A welcoming handshake",
  } satisfies ImageAsset,
} as const;

/** What working here feels like day to day. */
export const CAREER_VALUES: CareerValue[] = [
  {
    icon: "target",
    title: "Mission that matters",
    body: "Every decision comes back to one question: does this help a family find the right educator? Purpose is built into the work.",
    image: {
      src: "/assets/careers/images/value-mission.jpg",
      alt: "A team celebrating together around a meeting table",
    },
  },
  {
    icon: "people",
    title: "Small team, big impact",
    body: "No layers to route through. The thing you ship this week is the thing families use next week — your fingerprints are everywhere.",
    image: {
      src: "/assets/careers/images/value-impact.jpg",
      alt: "A dart landing in the centre of a target beside a laptop",
    },
  },
  {
    icon: "shield",
    title: "Trust-first culture",
    body: "We vet carefully, communicate honestly, and never overpromise. Doing right by kids and parents guides how we build.",
    image: {
      src: "/assets/careers/images/value-trust.jpg",
      alt: "Two colleagues shaking hands across a desk",
    },
  },
  {
    icon: "monitor",
    title: "Flexible & remote-friendly",
    body: "Hybrid in Raleigh or fully remote across the US. We care about outcomes and clear communication, not clocked hours.",
    image: {
      src: "/assets/careers/images/value-flexible.jpg",
      alt: "A small team reviewing work together on laptops",
    },
  },
];

/** Synthetic sample openings — this is a demo page, not a live job board. */
export const OPEN_ROLES: OpenRole[] = [
  {
    id: "community-manager",
    title: "Community Manager",
    icon: "lightbulb",
    department: "Community",
    location: "Raleigh, NC / Hybrid",
    type: "Full-time",
    summary:
      "Grow and nurture our community of families and educators — the human glue that keeps the marketplace warm and responsive.",
    responsibilities: [
      "Host and moderate community touchpoints, from local meetups to online spaces.",
      "Gather feedback from families and educators, and route it to the right people.",
      "Shape a welcoming, trust-first tone across every family-facing channel.",
    ],
  },
  {
    id: "educator-success-lead",
    title: "Educator Success Lead",
    icon: "cap",
    department: "Educator Success",
    location: "Raleigh, NC / Hybrid",
    type: "Full-time",
    summary:
      "Help vetted educators onboard, thrive, and stay. You’ll be their advocate and their guide through every step.",
    responsibilities: [
      "Guide new educators through onboarding and profile setup with care.",
      "Run regular check-ins and surface resources that help educators do their best work.",
      "Partner with product to translate educator feedback into platform improvements.",
    ],
  },
  {
    id: "full-stack-engineer",
    title: "Full-Stack Engineer",
    icon: "code",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    summary:
      "Build the marketplace end to end — from booking flows families rely on to the tools our team uses behind the scenes.",
    responsibilities: [
      "Ship features across the stack, from thoughtful UI to reliable APIs.",
      "Care for data privacy and safety as first-class engineering concerns.",
      "Collaborate closely with a small team where your judgment carries weight.",
    ],
  },
  {
    id: "trust-and-safety-associate",
    title: "Trust & Safety Associate",
    icon: "shield",
    department: "Trust & Safety",
    location: "Raleigh, NC / Hybrid",
    type: "Full-time",
    summary:
      "Keep the marketplace safe. You’ll help run our vetting process and uphold the standards families trust us for.",
    responsibilities: [
      "Support educator vetting and review workflows with thoroughness and discretion.",
      "Respond to reports and questions with clear, compassionate communication.",
      "Help refine safety policies and document them so the whole team stays aligned.",
    ],
  },
];

/** The promise every role rolls up to, in the "why it matters" band. */
export const CAREERS_TRUST_POINTS: string[] = [
  "Credentials reviewed before any educator is listed",
  "Parent-managed booking and supervision, always",
  "We describe the support offered — we never promise outcomes",
];
