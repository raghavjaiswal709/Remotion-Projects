/**
 * Day 32 — "Method Overriding"
 * Series: Java (National Railway System)
 * Audio file: public/audio/java32.wav
 * Audio duration: 79.08s → 2373 frames @ 30fps
 * Total composition: 3035 frames (~101.2s)
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Color palette ── use ONLY these, never raw hex codes outside this object ──
export const COLORS = {
  bg_paper:       '#F5F0E8',
  deep_black:     '#1A1A1A',
  sky_blue:       '#2563EB',
  green:          '#16A34A',
  orange:         '#EA580C',
  brown:          '#92400E',
  amber:          '#D97706',
  cool_silver:    '#94A3B8',
  vibrant_red:    '#DC2626',
  purple:         '#7C3AED',
  text_caption:   '#1A1A1A',
  text_highlight: '#EA580C',
} as const;

// ── Frame constants ──────────────────────────────────────────────────────────
const SCROLL_FRAMES = 150;
const AUDIO_FRAMES = Math.ceil(79.08 * 30); // 2373
const AUDIO_END = SCROLL_FRAMES + AUDIO_FRAMES; // 2523
const TAKEAWAY_GAP = 30;
const TAKEAWAY_DUR = 120;
const OUTRO_DUR = 362;
const TAKEAWAY_FROM = AUDIO_END + TAKEAWAY_GAP; // 2553
const OUTRO_FROM = TAKEAWAY_FROM + TAKEAWAY_DUR; // 2673
export const TOTAL_FRAMES = OUTRO_FROM + OUTRO_DUR; // 3035

// ── Scene timing ─────────────────────────────────────────────────────────────
export const SCENE_TIMING = {
  // Scene 01 — Scrolling Timeline (SILENT, pre-audio)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "This is day 32 of learning Java from first principles." [0.00→3.80]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: Math.max(60, Math.round((3.800 - 0.000) * 30) + 18) },

  // Scene 03 — "Last day, we learned how static blocks run once..." [4.42→9.70]
  s03: { from: SCROLL_FRAMES + Math.round(4.420 * 30), duration: Math.max(60, Math.round((9.700 - 4.420) * 30) + 18) },

  // Scene 04 — "Today, we are looking at method overriding." [10.50→13.18]
  s04: { from: SCROLL_FRAMES + Math.round(10.500 * 30), duration: Math.max(60, Math.round((13.180 - 10.500) * 30) + 18) },

  // Scene 05 — "The base train class has a method called Calculate Fair." [13.82→17.52]
  s05: { from: SCROLL_FRAMES + Math.round(13.820 * 30), duration: Math.max(60, Math.round((17.520 - 13.820) * 30) + 18) },

  // Scene 06 — "Every train inherits it, but an express train has premium pricing." [18.08→22.90]
  s06: { from: SCROLL_FRAMES + Math.round(18.080 * 30), duration: Math.max(60, Math.round((22.900 - 18.080) * 30) + 18) },

  // Scene 07 — "A metro train uses distance-based slabs." [23.56→26.64]
  s07: { from: SCROLL_FRAMES + Math.round(23.560 * 30), duration: Math.max(60, Math.round((26.640 - 23.560) * 30) + 18) },

  // Scene 08 — "The fair logic is completely different between them." [27.02→29.96]
  s08: { from: SCROLL_FRAMES + Math.round(27.020 * 30), duration: Math.max(60, Math.round((29.960 - 27.020) * 30) + 18) },

  // Scene 09 — "Method overriding lets a child class write its own version..." [30.84→36.58]
  s09: { from: SCROLL_FRAMES + Math.round(30.840 * 30), duration: Math.max(60, Math.round((36.580 - 30.840) * 30) + 18) },

  // Scene 10 — "The name stays the same. The implementation inside changes." [37.18→40.98]
  s10: { from: SCROLL_FRAMES + Math.round(37.180 * 30), duration: Math.max(60, Math.round((40.980 - 37.180) * 30) + 18) },

  // Scene 11 — "When you call Calculate Fair on an express train object..." [41.80→50.20]
  s11: { from: SCROLL_FRAMES + Math.round(41.800 * 30), duration: Math.max(60, Math.round((50.200 - 41.800) * 30) + 18) },

  // Scene 12 — "The actual object type at runtime decides which implementation executes." [50.78→55.34]
  s12: { from: SCROLL_FRAMES + Math.round(50.780 * 30), duration: Math.max(60, Math.round((55.340 - 50.780) * 30) + 18) },

  // Scene 13 — "The calling code does not need to know which train type..." [56.14→64.34]
  s13: { from: SCROLL_FRAMES + Math.round(56.140 * 30), duration: Math.max(60, Math.round((64.340 - 56.140) * 30) + 18) },

  // Scene 14 — "This is how the railway system applies different fare rules..." [65.16→72.62]
  s14: { from: SCROLL_FRAMES + Math.round(65.160 * 30), duration: Math.max(60, Math.round((72.620 - 65.160) * 30) + 18) },

  // Scene 15 — "Same name, different class, different behavior. That is method overriding." [73.38→79.08]
  s15: { from: SCROLL_FRAMES + Math.round(73.380 * 30), duration: Math.max(60, Math.round((79.080 - 73.380) * 30) + 18) },

  // Scene 16 — Key Takeaway
  s_takeaway: { from: TAKEAWAY_FROM, duration: TAKEAWAY_DUR },

  // Scene 17 — Outro
  s_outro: { from: OUTRO_FROM, duration: OUTRO_DUR },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 32 of learning Java from first principles.", keyWords: ["32", "Java"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "Last day, we learned how static blocks run once when a class is first loaded into memory.", keyWords: ["static blocks", "loaded", "memory"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Today, we are looking at method overriding.", keyWords: ["method overriding"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "The base train class has a method called calculateFare.", keyWords: ["train", "calculateFare"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "Every train inherits it, but an express train has premium pricing.", keyWords: ["inherits", "express train", "premium"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "A metro train uses distance-based slabs.", keyWords: ["metro train", "distance-based"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "The fare logic is completely different between them.", keyWords: ["fare logic", "different"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Method overriding lets a child class write its own version of a method it inherited from the parent.", keyWords: ["child class", "own version", "inherited", "parent"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "The name stays the same. The implementation inside changes.", keyWords: ["name", "same", "implementation", "changes"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "When you call calculateFare on an express train object, Java does not run the train version. It runs the express train version.", keyWords: ["calculateFare", "express train", "Java"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "The actual object type at runtime decides which implementation executes.", keyWords: ["object type", "runtime", "implementation"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "The calling code does not need to know which train type it is dealing with. It calls calculateFare. The right version runs automatically.", keyWords: ["calling code", "calculateFare", "automatically"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "This is how the railway system applies different fare rules to different train types without rewriting any of the code that calls them.", keyWords: ["railway system", "fare rules", "train types"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "Same name, different class, different behavior. That is method overriding.", keyWords: ["Same name", "different class", "method overriding"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
];

// ── Animation helpers ─────────────────────────────────────────────────────────
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const fadeIn = (frame: number, start: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - start) / dur));

export const fadeOut = (frame: number, start: number, dur: number): number =>
  1 - Math.min(1, Math.max(0, (frame - start) / dur));

export const easeSnap = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const snapIn = (frame: number, start: number, dur: number): number =>
  easeSnap(Math.min(1, Math.max(0, (frame - start) / dur)));

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));
