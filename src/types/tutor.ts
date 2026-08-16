/** Direction the card stack advances. */
export type StackDirection = "next" | "prev";

/** A featured educator card in the swipeable stack. */
export interface Tutor {
  id: string;
  subject: string;
  name: string;
  experience: string;
  intro: string;
}
