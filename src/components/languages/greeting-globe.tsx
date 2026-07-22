"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import styles from "./greeting-globe.module.css";

/** A language marker anchored to a real city on the globe. */
interface Lang {
  greet: string;
  lang: string;
  place: string;
  lon: number;
  lat: number;
}

/** The six greetings the globe travels between (order matches the flag cards). */
const LANGS: Lang[] = [
  { greet: "Hola", lang: "Spanish", place: "Madrid", lon: -3.7, lat: 40.4 },
  { greet: "Bonjour", lang: "French", place: "Paris", lon: 2.35, lat: 48.85 },
  { greet: "नमस्ते", lang: "Hindi", place: "New Delhi", lon: 77.2, lat: 28.6 },
  { greet: "Ciao", lang: "Italian", place: "Rome", lon: 12.5, lat: 41.9 },
  { greet: "Hallo", lang: "German", place: "Berlin", lon: 13.4, lat: 52.5 },
  { greet: "こんにちは", lang: "Japanese", place: "Tokyo", lon: 139.7, lat: 35.7 },
];

/** Module classes for the six orbiting flag cards, in LANGS order. */
const FLAG_CLASSES = ["fsEs", "fsFr", "fsIn", "fsIt", "fsDe", "fsJp"] as const;

/** Coarse world outlines as [lon, lat] rings — enough to read as continents. */
const LAND: number[][][] = [
  [[-168, 66], [-140, 70], [-120, 72], [-95, 72], [-80, 73], [-70, 62], [-55, 52], [-65, 45], [-75, 40], [-81, 31], [-90, 29], [-97, 26], [-97, 20], [-92, 15], [-88, 13], [-83, 9], [-80, 8], [-85, 12], [-95, 17], [-105, 22], [-113, 28], [-118, 34], [-125, 41], [-128, 50], [-135, 58], [-152, 60], [-168, 66]],
  [[-78, 8], [-70, 11], [-62, 10], [-52, 4], [-44, -3], [-35, -8], [-39, -15], [-41, -22], [-48, -27], [-56, -34], [-62, -39], [-66, -45], [-71, -52], [-74, -50], [-73, -44], [-71, -33], [-70, -20], [-76, -10], [-80, -3], [-78, 8]],
  [[-9, 37], [-9, 43], [-2, 44], [-4, 48], [0, 50], [6, 53], [13, 55], [21, 56], [28, 60], [40, 66], [55, 69], [75, 73], [100, 77], [130, 73], [155, 70], [178, 66], [170, 60], [161, 59], [156, 52], [142, 47], [135, 43], [127, 35], [122, 30], [112, 22], [108, 14], [104, 9], [103, 2], [100, 6], [98, 10], [94, 16], [89, 22], [85, 20], [80, 13], [77, 8], [73, 17], [70, 21], [66, 25], [60, 25], [56, 27], [50, 29], [48, 30], [44, 29], [40, 32], [36, 36], [30, 36], [26, 38], [22, 37], [17, 39], [13, 38], [9, 39], [3, 37], [-2, 36], [-6, 36], [-9, 37]],
  [[39, 21], [44, 12], [52, 15], [58, 20], [59, 24], [55, 26], [50, 29], [44, 29], [39, 29], [35, 28], [36, 24], [39, 21]],
  [[-17, 15], [-16, 22], [-10, 30], [-6, 35], [2, 37], [10, 37], [19, 32], [25, 32], [32, 31], [34, 28], [36, 22], [38, 18], [43, 11], [51, 12], [51, 7], [45, 1], [40, -6], [38, -14], [35, -20], [32, -26], [27, -33], [20, -35], [16, -29], [13, -22], [12, -14], [9, -2], [9, 4], [3, 6], [-4, 5], [-8, 5], [-13, 9], [-17, 15]],
  [[114, -22], [118, -20], [122, -17], [128, -14], [132, -12], [137, -12], [142, -11], [146, -15], [147, -19], [151, -24], [153, -28], [152, -33], [150, -37], [145, -38], [140, -38], [135, -35], [130, -32], [124, -33], [118, -34], [115, -30], [113, -26], [114, -22]],
  [[-45, 60], [-38, 65], [-30, 68], [-21, 70], [-25, 74], [-35, 77], [-50, 77], [-55, 74], [-53, 70], [-49, 64], [-45, 60]],
  [[-5, 50], [-3, 53], [-2, 56], [-4, 58], [-6, 56], [-7, 54], [-5, 50]],
  [[130, 31], [132, 33], [135, 34], [137, 34.5], [140.8, 35.2], [141.5, 37], [142, 41], [143, 44], [141, 44], [139.5, 41], [138, 38], [135.5, 35.5], [131, 32], [130, 31]],
  [[44, -16], [47, -15], [50, -16], [49, -20], [47, -24], [45, -25], [43, -21], [44, -16]],
  [[167, -45], [170, -43], [173, -40], [176, -37], [177, -38], [174, -41], [171, -44], [168, -46], [167, -45]],
  [[109, 1], [113, 3], [117, 5], [119, 1], [116, -2], [112, -3], [109, -1], [109, 1]],
];

const TAU = Math.PI * 2;

/**
 * The signature "greeting globe": an orthographic 2D canvas earth that
 * auto-rotates between six greetings and responds to click, keyboard, and
 * drag. The canvas math (projection, silhouette clipping, shading) is ported
 * verbatim from the source design; here it lives in an effect over refs.
 */
export function GreetingGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLDivElement>(null);
  const ringBackRef = useRef<HTMLDivElement>(null);
  const ringFrontRef = useRef<HTMLDivElement>(null);
  const flagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const cv = canvasRef.current;
    const capEl = capRef.current;
    const labEl = labRef.current;
    if (!wrapEl || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const N = LANGS.length;
    const css = getComputedStyle(document.documentElement);
    const C_GOLD = (css.getPropertyValue("--gold") || "#D2A241").trim();

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    let lam = (-LANGS[0].lon * Math.PI) / 180;
    const phi0 = (16 * Math.PI) / 180;
    let active = 0;
    let tween: { from: number; to: number; t0: number; dur: number } | null = null;
    let holdUntil = 0;
    const autoOn = !reduce;
    let audio: AudioContext | null = null;

    function caption(i: number) {
      if (capEl) {
        const l = LANGS[i];
        capEl.innerHTML = `<b>${l.greet}</b> · ${l.lang} · ${l.place}`;
      }
    }

    function blip() {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      if (!audio) audio = new Ctor();
      if (audio.state === "suspended") audio.resume();
      const t = audio.currentTime;
      [[720, 0], [960, 0.09]].forEach((p) => {
        const o = audio!.createOscillator();
        const g = audio!.createGain();
        o.type = "sine";
        o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, t + p[1]);
        g.gain.exponentialRampToValueAtTime(0.08, t + p[1] + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[1] + 0.18);
        o.connect(g);
        g.connect(audio!.destination);
        o.start(t + p[1]);
        o.stop(t + p[1] + 0.25);
      });
    }

    let W = 0;
    let H = 0;
    let R = 0;
    let CX = 0;
    let CY = 0;
    function size() {
      const DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = cv!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv!.width = W * DPR;
      cv!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      R = Math.min(W, H) * 0.46;
      CX = W / 2;
      CY = H / 2;
      [ringBackRef.current, ringFrontRef.current].forEach((el) => {
        if (!el) return;
        el.style.width = R * 2.56 + 40 + "px";
        el.style.height = R * 0.6 + 30 + "px";
      });
    }

    /* orthographic projection; returns [x, y, visible, cosc] */
    function proj(lonDeg: number, latDeg: number): [number, number, boolean, number] {
      const lon = (lonDeg * Math.PI) / 180;
      const lat = (latDeg * Math.PI) / 180;
      const cosc =
        Math.sin(phi0) * Math.sin(lat) +
        Math.cos(phi0) * Math.cos(lat) * Math.cos(lon + lam);
      const x = CX + R * Math.cos(lat) * Math.sin(lon + lam);
      const y =
        CY -
        R * (Math.cos(phi0) * Math.sin(lat) - Math.sin(phi0) * Math.cos(lat) * Math.cos(lon + lam));
      return [x, y, cosc > 0, cosc];
    }

    function geoPip(lon: number, lat: number, poly: number[][]) {
      let c = false;
      const n = poly.length;
      let j = n - 1;
      for (let i = 0; i < n; i++) {
        const xi = poly[i][0];
        const yi = poly[i][1];
        const xj = poly[j][0];
        const yj = poly[j][1];
        if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
        j = i;
      }
      return c;
    }
    function pipWrap(lon: number, lat: number, poly: number[][]) {
      return (
        geoPip(lon, lat, poly) || geoPip(lon + 360, lat, poly) || geoPip(lon - 360, lat, poly)
      );
    }
    /* inverse-project a screen point on the limb back to lon/lat */
    function invLimb(theta: number): [number, number] {
      const x = Math.cos(theta);
      const y = Math.sin(theta);
      const X = x;
      const Yv = -y;
      const Z = 0;
      const sinLat = Yv * Math.cos(phi0) + Z * Math.sin(phi0);
      const lat = Math.asin(Math.max(-1, Math.min(1, sinLat)));
      let lon = Math.atan2(X, Z * Math.cos(phi0) - Yv * Math.sin(phi0)) - lam;
      lon = (lon * 180) / Math.PI;
      const latD = (lat * 180) / Math.PI;
      while (lon > 180) lon -= 360;
      while (lon < -180) lon += 360;
      return [lon, latD];
    }

    function drawPoly(pts: number[][]) {
      const n = pts.length - 1;
      const P: [number, number, boolean, number][] = [];
      for (let i = 0; i < n; i++) P.push(proj(pts[i][0], pts[i][1]));
      let anyVis = false;
      let allVis = true;
      for (let i = 0; i < n; i++) {
        if (P[i][2]) anyVis = true;
        else allVis = false;
      }
      if (!anyVis) return;
      if (allVis) {
        ctx!.beginPath();
        ctx!.moveTo(P[0][0], P[0][1]);
        for (let i = 1; i < n; i++) ctx!.lineTo(P[i][0], P[i][1]);
        ctx!.closePath();
        ctx!.fill();
        ctx!.stroke();
        return;
      }
      let start = -1;
      for (let i = 0; i < n; i++) {
        if (!P[i][2] && P[(i + 1) % n][2]) {
          start = i;
          break;
        }
      }
      if (start < 0) return;
      function crossing(ai: number, bi: number) {
        const ca = P[ai][3];
        const cb = P[bi][3];
        const t = ca / (ca - cb);
        const lon = pts[ai][0] + (pts[bi][0] - pts[ai][0]) * t;
        const lat = pts[ai][1] + (pts[bi][1] - pts[ai][1]) * t;
        return proj(lon, lat);
      }
      /* collect visible runs with entry/exit crossings */
      interface Run {
        en: [number, number, boolean, number];
        ex?: [number, number, boolean, number];
        pts: [number, number, boolean, number][];
      }
      const runs: Run[] = [];
      let cur: Run | null = null;
      for (let k = 0; k < n; k++) {
        const ai = (start + k) % n;
        const bi = (start + k + 1) % n;
        const A = P[ai];
        const B = P[bi];
        if (!A[2] && B[2]) {
          cur = { en: crossing(ai, bi), pts: [B] };
        } else if (A[2] && B[2]) {
          if (cur) cur.pts.push(B);
        } else if (A[2] && !B[2]) {
          if (cur) {
            cur.ex = crossing(ai, bi);
            runs.push(cur);
            cur = null;
          }
        }
      }
      if (!runs.length) return;
      /* sorted limb crossings; arcs between neighbors alternate inside/outside */
      const cross: { th: number; type: "S" | "E"; run: number }[] = [];
      for (let i = 0; i < runs.length; i++) {
        cross.push({ th: Math.atan2(runs[i].en[1] - CY, runs[i].en[0] - CX), type: "S", run: i });
        cross.push({ th: Math.atan2(runs[i].ex![1] - CY, runs[i].ex![0] - CX), type: "E", run: i });
      }
      cross.sort((a, b) => a.th - b.th);
      const m = cross.length;
      function arcLen(j: number) {
        let d = cross[(j + 1) % m].th - cross[j].th;
        while (d < 0) d += TAU;
        return d;
      }
      /* parity from the longest arc's midpoint (farthest from edges) */
      let L = 0;
      let best = -1;
      for (let i = 0; i < m; i++) {
        const al = arcLen(i);
        if (al > best) {
          best = al;
          L = i;
        }
      }
      const gp = invLimb(cross[L].th + best / 2);
      const insideL = pipWrap(gp[0], gp[1], pts);
      function arcInside(j: number) {
        let d = (j - L) % 2;
        if (d < 0) d += 2;
        return d === 0 ? insideL : !insideL;
      }
      const posOf: Record<string, number> = {};
      for (let i = 0; i < m; i++) posOf[cross[i].type + cross[i].run] = i;
      /* stitch silhouette rings: run -> inside limb hop -> next run ... */
      const doneRun: Record<number, boolean> = {};
      let drew = false;
      ctx!.beginPath();
      for (let r0 = 0; r0 < runs.length; r0++) {
        if (doneRun[r0]) continue;
        let r = r0;
        let first = true;
        let guard = 0;
        while (guard++ < runs.length * 2 + 2) {
          const run = runs[r];
          doneRun[r] = true;
          if (first) {
            ctx!.moveTo(run.en[0], run.en[1]);
            first = false;
          } else ctx!.lineTo(run.en[0], run.en[1]);
          for (let i = 0; i < run.pts.length; i++) ctx!.lineTo(run.pts[i][0], run.pts[i][1]);
          ctx!.lineTo(run.ex![0], run.ex![1]);
          const kx = posOf["E" + r];
          let hop: number;
          let acw: boolean;
          if (arcInside(kx)) {
            hop = (kx + 1) % m;
            acw = false;
          } else {
            hop = (kx - 1 + m) % m;
            acw = true;
          }
          ctx!.arc(CX, CY, R, cross[kx].th, cross[hop].th, acw);
          if (cross[hop].type !== "S") break;
          const nr = cross[hop].run;
          if (nr === r0) break;
          r = nr;
        }
        ctx!.closePath();
        drew = true;
      }
      if (drew) {
        ctx!.fill();
        ctx!.stroke();
      }
    }

    function render() {
      ctx!.clearRect(0, 0, W, H);
      /* ocean */
      const g = ctx!.createRadialGradient(CX - R * 0.38, CY - R * 0.42, R * 0.08, CX, CY, R);
      g.addColorStop(0, "#5BC0F8");
      g.addColorStop(0.45, "#2D9CDB");
      g.addColorStop(1, "#1565C0");
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, 7);
      ctx!.fillStyle = g;
      ctx!.fill();
      /* land */
      ctx!.fillStyle = "#63C24E";
      ctx!.strokeStyle = "rgba(62,142,38,0.9)";
      ctx!.lineWidth = 0.8;
      LAND.forEach(drawPoly);
      /* sphere shading */
      const sh = ctx!.createRadialGradient(CX - R * 0.45, CY - R * 0.5, R * 0.2, CX, CY, R * 1.02);
      sh.addColorStop(0, "rgba(255,255,255,0)");
      sh.addColorStop(0.72, "rgba(13,60,130,0)");
      sh.addColorStop(1, "rgba(10,45,110,0.38)");
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, 7);
      ctx!.fillStyle = sh;
      ctx!.fill();
      /* glossy highlight */
      const gl = ctx!.createRadialGradient(
        CX - R * 0.42,
        CY - R * 0.5,
        R * 0.02,
        CX - R * 0.42,
        CY - R * 0.5,
        R * 0.75,
      );
      gl.addColorStop(0, "rgba(255,255,255,0.5)");
      gl.addColorStop(0.35, "rgba(255,255,255,0.12)");
      gl.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, 7);
      ctx!.fillStyle = gl;
      ctx!.fill();
      /* markers */
      for (let i = 0; i < N; i++) {
        const mk = LANGS[i];
        const p3 = proj(mk.lon, mk.lat);
        if (!p3[2]) continue;
        const isA = i === active;
        ctx!.beginPath();
        ctx!.arc(p3[0], p3[1], isA ? 5.5 : 3.5, 0, 7);
        ctx!.fillStyle = C_GOLD;
        ctx!.fill();
        ctx!.lineWidth = 1.5;
        ctx!.strokeStyle = "#FBFAF7";
        ctx!.stroke();
        if (isA) {
          const pulse = (Date.now() % 1600) / 1600;
          ctx!.beginPath();
          ctx!.arc(p3[0], p3[1], 6 + pulse * 13, 0, 7);
          ctx!.strokeStyle = "rgba(210,162,65," + 0.55 * (1 - pulse) + ")";
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }
      }
      /* active label chip position */
      const ap = proj(LANGS[active].lon, LANGS[active].lat);
      if (labEl) {
        if (ap[2]) {
          labEl.style.opacity = "1";
          labEl.style.left = ap[0] + "px";
          labEl.style.top = ap[1] - 16 + "px";
          labEl.textContent = LANGS[active].greet;
        } else labEl.style.opacity = "0";
      }
    }

    function norm(a: number) {
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      return a;
    }
    function setActive(i: number, announce: boolean) {
      active = ((i % N) + N) % N;
      const target = (-LANGS[active].lon * Math.PI) / 180;
      const d = norm(target - lam);
      if (reduce) lam = target;
      else tween = { from: lam, to: lam + d, t0: performance.now(), dur: 900 };
      caption(active);
      if (announce) blip();
    }

    function updateFlags() {
      const flagEls = flagRefs.current;
      if (!flagEls.length) return;
      const Rx = R * 1.28;
      const Ry = R * 0.3;
      for (let i = 0; i < flagEls.length; i++) {
        const el = flagEls[i];
        if (!el) continue;
        const a = lam + i * (TAU / flagEls.length) + 0.55;
        const s = Math.sin(a);
        const c = Math.cos(a);
        const x = s * Rx;
        const y = -c * Ry;
        const depth = (c + 1) / 2;
        const sc = 0.62 + 0.48 * depth;
        const op = 0.45 + 0.55 * depth;
        const ry = -s * 32;
        el.style.transform =
          "translate(-50%,-50%) translate(" +
          x.toFixed(1) +
          "px," +
          y.toFixed(1) +
          "px) scale(" +
          sc.toFixed(3) +
          ") rotateY(" +
          ry.toFixed(1) +
          "deg)";
        el.style.opacity = op.toFixed(2);
        el.style.zIndex = c > 0 ? "6" : "1";
      }
    }

    let lastT: number | null = null;
    let raf = 0;
    function loop(t: number) {
      if (lastT === null) lastT = t;
      const dt = Math.min(50, t - lastT);
      lastT = t;
      if (tween) {
        const k = Math.min(1, (t - tween.t0) / tween.dur);
        const e = 1 - Math.pow(1 - k, 3);
        lam = tween.from + (tween.to - tween.from) * e;
        if (k >= 1) {
          lam = tween.to;
          tween = null;
        }
      } else if (autoOn && t > holdUntil) {
        lam += 0.00021 * dt;
        let bi = -1;
        let bv = -2;
        for (let q = 0; q < N; q++) {
          const mk = LANGS[q];
          const cc =
            Math.sin(phi0) * Math.sin((mk.lat * Math.PI) / 180) +
            Math.cos(phi0) * Math.cos((mk.lat * Math.PI) / 180) * Math.cos((mk.lon * Math.PI) / 180 + lam);
          if (cc > bv) {
            bv = cc;
            bi = q;
          }
        }
        if (bi !== active && bv > 0.25) {
          active = bi;
          caption(active);
        }
      }
      render();
      updateFlags();
      raf = requestAnimationFrame(loop);
    }

    function userAdvance() {
      setActive(active + 1, true);
      holdUntil = performance.now() + 6000;
    }

    let dragging = false;
    let dragX = 0;
    let dragged = false;

    function onClick() {
      if (dragged) {
        dragged = false;
        return;
      }
      userAdvance();
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        userAdvance();
      }
    }
    function onPointerdown(e: PointerEvent) {
      dragging = true;
      dragX = e.clientX;
      dragged = false;
    }
    function onPointermove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - dragX;
      if (Math.abs(dx) > 3) dragged = true;
      dragX = e.clientX;
      lam += dx * 0.006;
      tween = null;
      holdUntil = performance.now() + 6000;
    }
    function onPointerup() {
      dragging = false;
    }

    wrapEl.addEventListener("click", onClick);
    wrapEl.addEventListener("keydown", onKeydown);
    wrapEl.addEventListener("pointerdown", onPointerdown);
    window.addEventListener("pointermove", onPointermove);
    window.addEventListener("pointerup", onPointerup);
    window.addEventListener("resize", size);

    size();
    setActive(0, false);
    caption(0);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      wrapEl.removeEventListener("click", onClick);
      wrapEl.removeEventListener("keydown", onKeydown);
      wrapEl.removeEventListener("pointerdown", onPointerdown);
      window.removeEventListener("pointermove", onPointermove);
      window.removeEventListener("pointerup", onPointerup);
      window.removeEventListener("resize", size);
      if (audio) audio.close();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      role="button"
      tabIndex={0}
      aria-label="Rotating globe showing where each language comes from. Click to travel to the next."
      className="relative flex h-[min(560px,74vh)] cursor-pointer touch-pan-y select-none flex-col items-center justify-center gap-6 max-[960px]:h-auto max-[960px]:py-[30px] max-[960px]:pb-[60px]"
    >
      <div className={styles.scene}>
        <div className={styles.glow} aria-hidden="true" />
        <div ref={ringBackRef} className={cn(styles.oring, styles.oringBack)} aria-hidden="true" />
        <div ref={ringFrontRef} className={cn(styles.oring, styles.oringFront)} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} />
        {FLAG_CLASSES.map((flag, i) => (
          <div
            key={flag}
            ref={(el) => {
              flagRefs.current[i] = el;
            }}
            className={cn(styles.fcard, styles[flag])}
            aria-hidden="true"
          />
        ))}
        <div ref={labRef} className={styles.lab} aria-hidden="true" />
      </div>

      <div
        ref={capRef}
        className="min-h-[20px] text-center text-[13px] font-bold uppercase tracking-[0.14em] text-[rgba(246,245,241,0.85)] transition-opacity duration-300 [&_b]:text-gold"
      />

      <div className="flex items-center gap-[10px] text-[11px] uppercase tracking-[0.16em] text-[rgba(246,245,241,0.5)]">
        <i className="h-[2px] w-[20px] bg-gold" aria-hidden="true" />
        <span>Tap the globe to travel</span>
        <i className="h-[2px] w-[20px] bg-gold" aria-hidden="true" />
      </div>
    </div>
  );
}
