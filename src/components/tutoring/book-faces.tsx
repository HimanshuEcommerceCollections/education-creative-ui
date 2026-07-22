import Image from "next/image";

import { QUIZ_SUBJECT_ICON, WildFaceIcon } from "@/components/tutoring/quiz-icons";
import styles from "@/components/tutoring/subject-book.module.css";
import type { BookPage, BookPhoto } from "@/data/book";

/** Front of the first leaf. */
export function BookCover() {
  return (
    <div className={styles.coverFrame}>
      <div className={styles.cEyebrow}>Your Learning Journey</div>
      <div className={styles.cSeal}>
        <WildFaceIcon />
      </div>
      <h3>
        Subjects
        <br />
        We Teach
      </h3>
      <div className={styles.cRule} />
      <div className={styles.cHint}>Tap to open</div>
    </div>
  );
}

/** A subject page (right-hand page). */
export function BookPageFace({ page }: { page: BookPage }) {
  const Icon = QUIZ_SUBJECT_ICON[page.icon];
  return (
    <div className={styles.pageIn}>
      <div className={styles.pIcon}>
        <Icon />
      </div>
      <h3>{page.title}</h3>
      <div className={styles.pRule} />
      <div className={styles.pChips}>
        {page.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
      <p className={styles.pNote}>{page.note}</p>
      <div className={styles.pnum}>{page.num}</div>
    </div>
  );
}

/** A photo page (left-hand page revealed on turn). */
export function BookPhotoFace({ photo }: { photo: BookPhoto }) {
  return (
    <>
      <Image
        src={photo.image.src}
        alt={photo.image.alt}
        fill
        sizes="(max-width: 960px) 40vw, 280px"
        className="object-cover"
      />
      <div className={styles.bcap}>
        <i aria-hidden="true" />
        <span>{photo.caption}</span>
      </div>
    </>
  );
}

/** Back of the final leaf. */
export function BookEndFace() {
  return (
    <div className={styles.endIn}>
      <div className={styles.cRule} />
      <p>
        — and this is only
        <br />
        the beginning.
      </p>
    </div>
  );
}
