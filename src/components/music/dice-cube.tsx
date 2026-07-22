import {
  DrumsFaceIcon,
  GuitarFaceIcon,
  PianoFaceIcon,
} from "@/components/music/icons";
import { cn } from "@/lib/utils";

import styles from "./dice-cube.module.css";

interface DiceCubeProps {
  /** Accumulated cube rotation in degrees. */
  rotation: { x: number; y: number };
}

/** The 3D cube: piano (front/back), guitar (right/left), drums (top/bottom). */
export function DiceCube({ rotation }: DiceCubeProps) {
  return (
    <div
      className={styles.dcube}
      style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
    >
      <div className={cn(styles.cf, styles.cfF)}>
        <PianoFaceIcon />
      </div>
      <div className={cn(styles.cf, styles.cfB)}>
        <PianoFaceIcon />
      </div>
      <div className={cn(styles.cf, styles.cfR)}>
        <GuitarFaceIcon />
      </div>
      <div className={cn(styles.cf, styles.cfL)}>
        <GuitarFaceIcon />
      </div>
      <div className={cn(styles.cf, styles.cfT)}>
        <DrumsFaceIcon />
      </div>
      <div className={cn(styles.cf, styles.cfD)}>
        <DrumsFaceIcon />
      </div>
    </div>
  );
}
