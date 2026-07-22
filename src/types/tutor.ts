/** Direction the card stack advances. */
export type StackDirection = "next" | "prev";

/** A featured educator card in the swipeable stack. */
export interface Tutor {
  id: string;
  subject: string;
  name: string;
  experience: string;
  /** Rating shown in the gold badge, e.g. "4.9". */
  rating: string;
  intro: string;
}
