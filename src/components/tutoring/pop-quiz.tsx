"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { SpeakerOffIcon, SpeakerOnIcon } from "@/components/common/icons";
import { Reveal } from "@/components/common/reveal";
import styles from "@/components/tutoring/pop-quiz.module.css";
import { QuizDiceCube } from "@/components/tutoring/quiz-dice-cube";
import { QUIZ_SUBJECT_ICON } from "@/components/tutoring/quiz-icons";
import {
  QUIZ,
  QUIZ_CHEER,
  QUIZ_LABELS,
  QUIZ_PERSIST,
  QUIZ_PRAISE,
  QUIZ_SUBJECTS,
} from "@/data/quiz";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizSubject } from "@/types/quiz";

/** Cube face orientations (deg) that land on each subject / the wild star. */
const FACE_ROTATION: Record<QuizSubject | "wild", [number, number]> = {
  math: [0, 0],
  english: [0, 180],
  science: [0, -90],
  cs: [0, 90],
  languages: [-90, 0],
  wild: [90, 0],
};
const LETTERS = ["A", "B", "C", "D"];
const HOP_MS = 420;
const NOISE_2_MS = 160;
const DEAL_MS = 950;
const FLIP_MS = 650;
const WILD_CHANCE = 1 / 6;
const SOUND_ICON_CLASS = "h-[17px] w-[17px]";

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface ActiveCard {
  subject: QuizSubject;
  question: QuizQuestion;
}

/** Roll the dice, draw a flashcard, answer, flip to reveal. */
export function PopQuiz() {
  const { muted, toggleMuted, tone, noise } = useAudioEngine();

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hopping, setHopping] = useState(false);
  const [subjectLabel, setSubjectLabel] = useState("");
  const [card, setCard] = useState<ActiveCard | null>(null);
  const [dealNonce, setDealNonce] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answeredCorrect, setAnsweredCorrect] = useState<number | null>(null);
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [praise, setPraise] = useState("");

  const rolling = useRef(false);
  const resolved = useRef(true);
  const attempts = useRef(0);
  const spin = useRef({ x: 0, y: 0 });
  const lastQuestion = useRef<Record<QuizSubject, number>>({
    math: -1,
    science: -1,
    english: -1,
    cs: -1,
    languages: -1,
  });
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const dealCard = useCallback((subject: QuizSubject) => {
    const pool = QUIZ[subject];
    let index = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && index === lastQuestion.current[subject]) {
      index = (index + 1) % pool.length;
    }
    lastQuestion.current[subject] = index;

    attempts.current = 0;
    resolved.current = false;
    setCard({ subject, question: pool[index] });
    setAnsweredCorrect(null);
    setWrongOptions([]);
    setLocked(false);
    setFeedback("");
    setPraise("");
    setFlipped(false);
    setDealNonce((value) => value + 1);
  }, []);

  const roll = useCallback(() => {
    if (rolling.current) return;
    rolling.current = true;
    setFlipped(false);

    const isWild = Math.random() < WILD_CHANCE;
    const subject = pick(QUIZ_SUBJECTS);
    const faceKey: QuizSubject | "wild" = isWild ? "wild" : subject;
    const [fx, fy] = FACE_ROTATION[faceKey];
    spin.current = {
      x: spin.current.x + 360 * (1 + Math.floor(Math.random() * 2)),
      y: spin.current.y + 360 * (1 + Math.floor(Math.random() * 2)),
    };
    setRotation({ x: spin.current.x + fx, y: spin.current.y + fy });
    setHopping(true);
    setSubjectLabel((isWild ? "Wild! " : "") + QUIZ_LABELS[subject]);
    noise(0.12, 0.1, "highpass", 3000);

    timers.current.push(
      window.setTimeout(() => setHopping(false), HOP_MS),
      window.setTimeout(() => noise(0.1, 0.08, "highpass", 2500), NOISE_2_MS),
      window.setTimeout(() => {
        dealCard(subject);
        noise(0.14, 0.09, "lowpass", 900);
        rolling.current = false;
      }, DEAL_MS),
    );
  }, [dealCard, noise]);

  const answer = useCallback(
    (option: number, correct: number) => {
      if (resolved.current) return;

      if (option === correct) {
        resolved.current = true;
        setAnsweredCorrect(option);
        setLocked(true);
        setFeedback("");
        setPraise(attempts.current === 0 ? pick(QUIZ_PRAISE) : pick(QUIZ_PERSIST));
        tone(660, 0.14, "sine", 0.1);
        timers.current.push(
          window.setTimeout(() => tone(880, 0.16, "sine", 0.1), 100),
          window.setTimeout(() => tone(1108, 0.24, "sine", 0.09), 200),
          window.setTimeout(() => {
            setFlipped(true);
            noise(0.12, 0.08, "lowpass", 1200);
          }, FLIP_MS),
        );
      } else {
        attempts.current += 1;
        setWrongOptions((prev) => [...prev, option]);
        setFeedback(pick(QUIZ_CHEER));
        tone(220, 0.18, "triangle", 0.08, 170);
      }
    },
    [noise, tone],
  );

  const ChipIcon = card ? QUIZ_SUBJECT_ICON[card.subject] : null;

  return (
    <section className={styles.quizSec}>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-10 max-[720px]:justify-center max-[720px]:text-center">
          <div>
            <Reveal>
              <div className="max-[720px]:flex max-[720px]:flex-col max-[720px]:items-center">
                <Eyebrow tone="light">Pop quiz</Eyebrow>
                <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
                  Roll a <Highlight>subject.</Highlight>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <p className="mt-3 max-w-[460px] text-[16.5px] leading-[1.65] text-[rgba(246,245,241,0.62)]">
                Roll the dice, draw a flashcard, tap to reveal the answer — a tiny
                taste of how our tutors make practice feel like play.
              </p>
            </Reveal>
          </div>

          <Reveal delay={2} className="flex flex-none flex-col items-center gap-3">
            <button
              type="button"
              className={cn(styles.qdice, hopping && styles.hop)}
              onClick={roll}
              aria-label="Roll the dice for a quiz question"
            >
              <div className={styles.qhop}>
                <QuizDiceCube rotation={rotation} />
              </div>
            </button>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-[rgba(246,245,241,0.55)]">
              Roll for a question
            </div>
            <div className="min-h-[20px] font-serif text-[15px] font-bold uppercase tracking-[0.08em] text-gold">
              {subjectLabel || " "}
            </div>
            <button
              type="button"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(246,245,241,0.25)] bg-transparent text-[rgba(246,245,241,0.75)] transition-[border-color,color] duration-300 hover:border-gold hover:text-gold"
              onClick={toggleMuted}
              aria-label="Toggle sound"
              aria-pressed={!muted}
            >
              {muted ? (
                <SpeakerOffIcon className={SOUND_ICON_CLASS} />
              ) : (
                <SpeakerOnIcon className={SOUND_ICON_CLASS} />
              )}
            </button>
          </Reveal>
        </div>

        <div className={styles.quizStage}>
          <div
            key={dealNonce}
            className={cn(
              styles.qcard,
              flipped && styles.flip,
              card ? styles.deal : undefined,
            )}
            role="group"
            aria-label="Quiz flashcard"
          >
            <div className={cn(styles.qface, styles.qfront)}>
              <div className={styles.qchip}>
                <span className={styles.qi}>{ChipIcon ? <ChipIcon /> : null}</span>
                <span>{card ? QUIZ_LABELS[card.subject] : "Ready?"}</span>
              </div>
              <p className={styles.qQ}>
                {card
                  ? card.question.question
                  : "Roll the dice to draw your first question."}
              </p>
              {card ? (
                <div className={styles.qOpts}>
                  {card.question.options.map((option, index) => (
                    <button
                      type="button"
                      key={option}
                      className={cn(
                        styles.qopt,
                        answeredCorrect === index && styles.good,
                        wrongOptions.includes(index) && styles.bad,
                      )}
                      disabled={locked || wrongOptions.includes(index)}
                      onClick={() => answer(index, card.question.correct)}
                    >
                      <span className={styles.ol}>{LETTERS[index]}</span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <p className={styles.qFb}>{feedback}</p>
            </div>

            <div
              className={cn(styles.qface, styles.qback)}
              role="button"
              tabIndex={flipped ? 0 : -1}
              aria-label="Flip back to the question"
              onClick={() => setFlipped(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setFlipped(false);
                }
              }}
            >
              <p className={styles.qPraise}>{praise}</p>
              <p className={styles.qA}>
                {card ? card.question.options[card.question.correct] : ""}
              </p>
              <p className={styles.qAnote}>{card ? card.question.note : ""}</p>
              <div className={styles.qagain}>Roll again for a new card</div>
            </div>
          </div>
        </div>

        <Reveal
          delay={3}
          className="mt-[44px] flex items-center justify-center gap-[10px] text-[12px] uppercase tracking-[0.14em] text-[rgba(246,245,241,0.5)]"
        >
          <i aria-hidden="true" className="h-0.5 w-[22px] bg-gold" />
          <span>Every card is a real tutoring warm-up</span>
          <i aria-hidden="true" className="h-0.5 w-[22px] bg-gold" />
        </Reveal>
      </Container>
    </section>
  );
}
