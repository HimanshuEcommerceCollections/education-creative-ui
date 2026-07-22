import styles from "@/components/tutoring/pop-quiz.module.css";
import {
  CsFaceIcon,
  EnglishFaceIcon,
  LanguagesFaceIcon,
  MathFaceIcon,
  ScienceFaceIcon,
  WildFaceIcon,
} from "@/components/tutoring/quiz-icons";
import { cn } from "@/lib/utils";

interface QuizDiceCubeProps {
  /** Accumulated cube rotation in degrees. */
  rotation: { x: number; y: number };
}

/** The 3D quiz cube: math, english, science, cs, languages, and a wild star. */
export function QuizDiceCube({ rotation }: QuizDiceCubeProps) {
  return (
    <div
      className={styles.qcube}
      style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
    >
      <div className={cn(styles.qf, styles.qfFront)}>
        <MathFaceIcon />
      </div>
      <div className={cn(styles.qf, styles.qfBack)}>
        <EnglishFaceIcon />
      </div>
      <div className={cn(styles.qf, styles.qfRight)}>
        <ScienceFaceIcon />
      </div>
      <div className={cn(styles.qf, styles.qfLeft)}>
        <CsFaceIcon />
      </div>
      <div className={cn(styles.qf, styles.qfTop)}>
        <LanguagesFaceIcon />
      </div>
      <div className={cn(styles.qf, styles.qfDown)}>
        <WildFaceIcon />
      </div>
    </div>
  );
}
