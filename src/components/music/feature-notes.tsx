import { MusicNoteGlyph } from "@/components/music/icons";
import { cn } from "@/lib/utils";

import styles from "./feature-notes.module.css";

const NOTES = [
  { left: "18%", delay: "0s", size: "h-[26px] w-[26px]" },
  { left: "46%", delay: "1.7s", size: "h-[20px] w-[20px]" },
  { left: "72%", delay: "3.1s", size: "h-[30px] w-[30px]" },
];

/** Notes drifting up over the feature photo (hidden under reduced motion). */
export function FeatureNotes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2]"
    >
      {NOTES.map((note) => (
        <span
          key={note.left}
          style={{ left: note.left, bottom: "8%", animationDelay: note.delay }}
          className={cn(styles.note, "absolute opacity-0")}
        >
          <MusicNoteGlyph
            className={cn(
              note.size,
              "fill-white/[0.92] [filter:drop-shadow(0_4px_10px_rgba(0,0,0,0.35))]",
            )}
          />
        </span>
      ))}
    </div>
  );
}
