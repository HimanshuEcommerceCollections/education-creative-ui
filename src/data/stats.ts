import type { Stat } from "@/types/stat";

export const STATS: Stat[] = [
  {
    id: "lessons",
    value: 500,
    suffix: "+",
    label: "Lessons completed",
    description: "Booked through the platform across every subject.",
  },
  {
    id: "checked",
    value: 100,
    suffix: "%",
    label: "Background checked",
    description: "Credentials & references collected before listing.",
  },
  {
    id: "rating",
    value: 4.9,
    decimals: 1,
    suffix: "★",
    label: "Average parent rating",
    description: "Across verified post-session reviews.",
  },
  {
    id: "response",
    value: 24,
    suffix: " hrs",
    label: "Average response time",
    description: "From first message to educator reply.",
  },
];
