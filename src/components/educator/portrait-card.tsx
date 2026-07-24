import { CapIcon } from "./educator-icons";
import { Monogram } from "./monogram";
import styles from "./portrait-card.module.css";

/** Tilted monogram portrait with a gold capability badge (levels out on hover). */
export function PortraitCard({ initials }: { initials: string }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <Monogram initials={initials} size="text-[clamp(56px,9vw,104px)]" />
      </div>
      <span className={styles.badge} aria-hidden="true">
        <CapIcon />
      </span>
    </div>
  );
}
