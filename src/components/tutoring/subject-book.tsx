"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { ChevronIcon } from "@/components/common/icons";
import { Reveal } from "@/components/common/reveal";
import {
  BookCover,
  BookEndFace,
  BookPageFace,
  BookPhotoFace,
} from "@/components/tutoring/book-faces";
import styles from "@/components/tutoring/subject-book.module.css";
import { BOOK_LABELS, BOOK_PAGES, BOOK_PHOTOS } from "@/data/book";
import { cn } from "@/lib/utils";

/** Leaf count: a cover leaf plus one per subject page. */
const N = BOOK_PAGES.length + 1;
const LEAVES = Array.from({ length: N }, (_, index) => index);
const NAV_ICON_CLASS =
  "h-[18px] w-[18px] fill-none stroke-current [stroke-width:2] [stroke-linecap:round] [stroke-linejoin:round]";
const NAV_BTN_CLASS =
  "flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition-[background-color,color,transform] duration-300 hover:enabled:-translate-y-0.5 hover:enabled:bg-slate hover:enabled:text-white disabled:cursor-default disabled:opacity-[0.32]";

/** Interactive 3D flip-book of the subjects taught. */
export function SubjectBook() {
  const [current, setCurrent] = useState(0);
  const [movingLeaf, setMovingLeaf] = useState<number | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const zTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (zTimer.current) window.clearTimeout(zTimer.current);
    },
    [],
  );

  const go = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(N, next));
      if (target === current) return;
      // Keep the turning leaf on top for the duration of the animation.
      setMovingLeaf(Math.min(current, target));
      if (zTimer.current) window.clearTimeout(zTimer.current);
      zTimer.current = window.setTimeout(() => setMovingLeaf(null), 1000);
      setCurrent(target);
    },
    [current],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const element = bookRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      go(event.key === "ArrowRight" ? current + 1 : current - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, go]);

  const leafZ = (i: number) => {
    if (i === movingLeaf) return N + 9;
    return i < current ? i + 2 : N - i + 2;
  };

  return (
    <section className={styles.bookSec}>
      <Container>
        <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-14 max-[960px]:grid-cols-1 max-[960px]:gap-4">
          <div className="max-[960px]:text-center">
            <Reveal>
              <div className="mb-[6px] max-[960px]:flex max-[960px]:flex-col max-[960px]:items-center">
                <Eyebrow>Subjects we teach</Eyebrow>
                <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em]">
                  Open the <Highlight>book.</Highlight>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <p className="mt-[14px] max-w-[440px] text-[17px] leading-[1.65] text-muted max-[960px]:mx-auto">
                Five core subjects, one calm method. Tap the cover, then turn the
                pages — or use the arrows.
              </p>
            </Reveal>
            <Reveal
              delay={3}
              className="mt-8 flex items-center justify-start gap-4 max-[960px]:mt-6 max-[960px]:justify-center"
            >
              <button
                type="button"
                className={NAV_BTN_CLASS}
                aria-label="Previous page"
                disabled={current === 0}
                onClick={() => go(current - 1)}
              >
                <ChevronIcon direction="left" className={NAV_ICON_CLASS} />
              </button>
              <div
                className="min-w-[150px] text-center font-serif text-sm font-semibold tracking-[0.06em] text-ink max-[720px]:min-w-[130px] max-[720px]:text-xs"
                aria-live="polite"
              >
                {BOOK_LABELS[current]}
              </div>
              <button
                type="button"
                className={NAV_BTN_CLASS}
                aria-label="Next page"
                disabled={current === N}
                onClick={() => go(current + 1)}
              >
                <ChevronIcon direction="right" className={NAV_ICON_CLASS} />
              </button>
            </Reveal>
          </div>

          <Reveal
            delay={2}
            className={cn(
              styles.bookStage,
              current > 0 && styles.open,
              current === N && styles.done,
            )}
          >
            <div className={styles.bookShadow} aria-hidden="true" />
            <div
              ref={bookRef}
              className={styles.book}
              role="region"
              aria-label="Subjects we teach, interactive book"
            >
              <div className={styles.bstackL} aria-hidden="true" />
              <div className={styles.bbase}>
                <div className={styles.bbaseIn}>
                  <h3>
                    Every subject,
                    <br />
                    one calm method.
                  </h3>
                  <p>Vetted educators across all five.</p>
                  <Link className={styles.bcta} href="/browse">
                    Browse educators →
                  </Link>
                </div>
              </div>

              {LEAVES.map((i) => (
                <div
                  key={i}
                  className={cn(styles.leaf, i < current && styles.turned)}
                  style={{ zIndex: leafZ(i) }}
                >
                  <div className={cn(styles.face, i === 0 && styles.cover)}>
                    {i === 0 ? (
                      <BookCover />
                    ) : (
                      <BookPageFace page={BOOK_PAGES[i - 1]} />
                    )}
                  </div>
                  <div
                    className={cn(
                      styles.face,
                      styles.back,
                      i <= 4 ? styles.photoPage : styles.endPage,
                    )}
                  >
                    {i <= 4 ? (
                      <BookPhotoFace photo={BOOK_PHOTOS[i]} />
                    ) : (
                      <BookEndFace />
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                className={cn(styles.hs, styles.hsNext)}
                onClick={() => go(current + 1)}
              />
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                className={cn(styles.hs, styles.hsPrev)}
                onClick={() => go(current - 1)}
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
