"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToneFn = (
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  slideTo?: number,
) => void;

export type NoiseFn = (
  duration: number,
  volume: number,
  filterType: BiquadFilterType,
  frequency: number,
) => void;

type AudioContextCtor = typeof AudioContext;

/**
 * Tiny Web Audio synth for the instrument playground: short oscillator tones
 * and filtered noise bursts. The AudioContext is created lazily on first
 * sound (after a user gesture) and skipped while muted.
 */
export function useAudioEngine() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseBufRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
    },
    [],
  );

  const getContext = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    let ctx = ctxRef.current;
    if (!ctx) {
      const win = window as Window &
        typeof globalThis & { webkitAudioContext?: AudioContextCtor };
      const Ctor = win.AudioContext ?? win.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }, []);

  const tone = useCallback<ToneFn>(
    (frequency, duration, type, volume, slideTo) => {
      const ac = getContext();
      if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const t = ac.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, t);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration * 0.85);
      }
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    },
    [getContext],
  );

  const noise = useCallback<NoiseFn>(
    (duration, volume, filterType, frequency) => {
      const ac = getContext();
      if (!ac) return;
      if (!noiseBufRef.current) {
        const buffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) {
          data[i] = Math.random() * 2 - 1;
        }
        noiseBufRef.current = buffer;
      }
      const source = ac.createBufferSource();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();
      const t = ac.currentTime;
      source.buffer = noiseBufRef.current;
      filter.type = filterType;
      filter.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      source.start(t);
      source.stop(t + duration + 0.05);
    },
    [getContext],
  );

  const toggleMuted = useCallback(() => setMuted((value) => !value), []);

  return { muted, toggleMuted, tone, noise };
}
