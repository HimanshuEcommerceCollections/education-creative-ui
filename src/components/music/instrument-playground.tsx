"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { SpeakerOffIcon, SpeakerOnIcon } from "@/components/common/icons";
import { DiceCube } from "@/components/music/dice-cube";
import { Drums } from "@/components/music/drums";
import { Guitar } from "@/components/music/guitar";
import { Piano } from "@/components/music/piano";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { cn } from "@/lib/utils";
import type { Instrument } from "@/types/music";

import styles from "./instrument-playground.module.css";

const INSTRUMENTS: Instrument[] = ["piano", "guitar", "drums"];
const LABEL: Record<Instrument, string> = {
  piano: "Piano",
  guitar: "Guitar",
  drums: "Drums",
};
const HINT: Record<Instrument, string> = {
  piano: "Move across the keys",
  guitar: "Sweep down the strings",
  drums: "Tap or sweep the kit",
};
/** Cube face orientations (deg) that land on each instrument. */
const FACE: Record<Instrument, [number, number][]> = {
  piano: [
    [0, 0],
    [0, 180],
  ],
  guitar: [
    [0, -90],
    [0, 90],
  ],
  drums: [
    [-90, 0],
    [90, 0],
  ],
};
const HOP_MS = 420;
const NOISE_2_MS = 160;
const SWITCH_MS = 900;

/** Interactive instrument playground: play piano/guitar/drums, roll to switch. */
export function InstrumentPlayground() {
  const { muted, toggleMuted, tone, noise } = useAudioEngine();
  const [instrument, setInstrument] = useState<Instrument>("piano");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hopping, setHopping] = useState(false);
  const rolling = useRef(false);
  const spin = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const roll = useCallback(() => {
    if (rolling.current) return;
    rolling.current = true;

    const options = INSTRUMENTS.filter((item) => item !== instrument);
    const pick = options[Math.floor(Math.random() * options.length)];
    const face = FACE[pick][Math.random() < 0.5 ? 0 : 1];
    spin.current = {
      x: spin.current.x + 360 * (1 + Math.floor(Math.random() * 2)),
      y: spin.current.y + 360 * (1 + Math.floor(Math.random() * 2)),
    };
    setRotation({ x: spin.current.x + face[0], y: spin.current.y + face[1] });
    setHopping(true);
    noise(0.12, 0.1, "highpass", 3000);

    timers.current.push(
      window.setTimeout(() => setHopping(false), HOP_MS),
      window.setTimeout(() => noise(0.1, 0.08, "highpass", 2500), NOISE_2_MS),
      window.setTimeout(() => {
        setInstrument(pick);
        rolling.current = false;
      }, SWITCH_MS),
    );
  }, [instrument, noise]);

  return (
    <section className={styles.pianoSec}>
      <Container>
        <div className={styles.pianoTop}>
          <div>
            <Reveal>
              <div className={styles.pianoIntro}>
                <Eyebrow tone="light">Try an instrument</Eyebrow>
                <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
                  Every lesson starts <Highlight>here.</Highlight>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <p className={styles.pianoLede}>
                Sweep the keys, pluck the strings, or hit the drums — every touch
                makes a sound. Roll the dice to switch.
              </p>
            </Reveal>
          </div>

          <Reveal delay={2} className={styles.diceBlock}>
            <button
              type="button"
              className={cn(styles.dice, hopping && styles.hop)}
              onClick={roll}
              aria-label="Roll the dice to change instrument"
            >
              <div className={styles.diceHop}>
                <DiceCube rotation={rotation} />
              </div>
            </button>
            <div className={styles.diceLbl}>Roll to switch</div>
            <div className={styles.instName}>{LABEL[instrument]}</div>
            <button
              type="button"
              className={styles.soundTog}
              onClick={toggleMuted}
              aria-label="Toggle sound"
              aria-pressed={!muted}
            >
              {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
            </button>
          </Reveal>
        </div>

        <Reveal className={styles.instStage} delay={2}>
          <div
            className={cn(styles.instPanel, instrument === "piano" && styles.on)}
            data-inst="piano"
          >
            <Piano tone={tone} />
          </div>
          <div
            className={cn(styles.instPanel, instrument === "guitar" && styles.on)}
            data-inst="guitar"
          >
            <Guitar tone={tone} />
          </div>
          <div
            className={cn(styles.instPanel, instrument === "drums" && styles.on)}
            data-inst="drums"
          >
            <Drums tone={tone} noise={noise} />
          </div>
        </Reveal>

        <Reveal delay={3} className={styles.pianoHint}>
          <i aria-hidden="true" />
          <span>{HINT[instrument]}</span>
          <i aria-hidden="true" />
        </Reveal>
      </Container>
    </section>
  );
}
