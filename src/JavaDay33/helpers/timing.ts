/**
 * Day 33 — "@Override Annotation"
 * Series: Java (National Railway OOPs)
 * Audio file: public/audio/java33.wav
 * Audio duration: 71.82s → 2155 frames @ 30fps
 * Total composition: 2817 frames (~93.9s)
 *
 * Frame math:
 *   SCROLL_FRAMES  = 150
 *   AUDIO_FRAMES   = ceil(71.82 * 30) = 2155
 *   AUDIO_END      = 150 + 2155 = 2305
 *   TAKEAWAY_FROM  = 2305 + 30  = 2335
 *   OUTRO_FROM     = 2335 + 120 = 2455
 *   TOTAL_FRAMES   = 2455 + 362 = 2817
 */

import { Easing } from 'remotion';

export const FPS = 30;
export const TOTAL_FRAMES = 2817;

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
  text_caption:   '#F5F0E8',
  text_highlight: '#EA580C',
} as const;

// ── Frame constants ──────────────────────────────────────────────────────────
const SCROLL_FRAMES = 150;

// ── Scene timing ─────────────────────────────────────────────────────────────
export const SCENE_TIMING = {

  // Scene 01 — Scrolling Timeline (SILENT, pre-audio)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "This is day 33 of learning Java from first principles." [0.00→4.20]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: 144 },

  // Scene 03 — "Last day, we learned how child classes can override methods..." [4.80→9.74]
  s03: { from: SCROLL_FRAMES + Math.round(4.800 * 30), duration: 166 },

  // Scene 04 — "Today, we are looking at the @override annotation." [10.42→13.56]
  s04: { from: SCROLL_FRAMES + Math.round(10.420 * 30), duration: 112 },

  // Scene 05 — "When express train overrides calculateFare..." [14.30→23.26]
  s05: { from: SCROLL_FRAMES + Math.round(14.300 * 30), duration: 287 },

  // Scene 06 — "But what if there's a typo?" [23.78→25.28]
  s06: { from: SCROLL_FRAMES + Math.round(23.780 * 30), duration: 63 },

  // Scene 07 — "What if you accidentally write calculateFare with lowercase f?..." [25.78→32.32]
  s07: { from: SCROLL_FRAMES + Math.round(25.780 * 30), duration: 214 },

  // Scene 08 — "The override silently never happens." [32.74→34.88]
  s08: { from: SCROLL_FRAMES + Math.round(32.740 * 30), duration: 82 },

  // Scene 09 — "The @override annotation solves this." [35.48→37.94]
  s09: { from: SCROLL_FRAMES + Math.round(35.480 * 30), duration: 92 },

  // Scene 10 — "You place it directly above the overriding method." [38.48→41.14]
  s10: { from: SCROLL_FRAMES + Math.round(38.480 * 30), duration: 98 },

  // Scene 11 — "The compiler now checks one thing..." [41.58→47.26]
  s11: { from: SCROLL_FRAMES + Math.round(41.580 * 30), duration: 189 },

  // Scene 12 — "If it does not, the program does not compile." [47.78→50.48]
  s12: { from: SCROLL_FRAMES + Math.round(47.780 * 30), duration: 99 },

  // Scene 13 — "A typo becomes a compile time error..." [50.98→59.08]
  s13: { from: SCROLL_FRAMES + Math.round(50.980 * 30), duration: 261 },

  // Scene 14 — "@Override does not change what the method does." [59.78→62.66]
  s14: { from: SCROLL_FRAMES + Math.round(59.780 * 30), duration: 105 },

  // Scene 15 — "It protects your intention..." [63.16→68.14]
  s15: { from: SCROLL_FRAMES + Math.round(63.160 * 30), duration: 167 },

  // Scene 16 — "One annotation, zero room for silent failures." [68.82→71.82]
  s16: { from: SCROLL_FRAMES + Math.round(68.820 * 30), duration: 108 },

  // Scene 17 — Key Takeaway
  s_takeaway: { from: 2335, duration: 120 },

  // Scene 18 — Outro
  s_outro: { from: 2455, duration: 362 },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 33 of learning Java from first principles.", keyWords: ["33", "Java"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "Last day, we learned how child classes can override methods they inherit from the parent.", keyWords: ["override", "child classes", "parent"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Today, we are looking at the @Override annotation.", keyWords: ["@Override", "annotation"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "When ExpressTrain overrides calculateFare, the developer writes the method with the exact same name and parameters as in the parent Train class.", keyWords: ["ExpressTrain", "calculateFare", "Train"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "But what if there's a typo?", keyWords: ["typo"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "What if you accidentally write calculatefare with a lowercase f? Java would treat it as a brand new method.", keyWords: ["calculatefare", "lowercase f", "brand new method"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "The override silently never happens.", keyWords: ["silently", "never happens"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "The @Override annotation solves this.", keyWords: ["@Override", "annotation", "solves"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "You place it directly above the overriding method.", keyWords: ["above", "overriding method"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "The compiler now checks one thing. Does this method actually override a method in the parent?", keyWords: ["compiler", "checks", "override", "parent"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "If it does not, the program does not compile.", keyWords: ["does not compile"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "A typo becomes a compile time error. Not a silent runtime bug that only surfaces when a passenger gets charged the wrong fare.", keyWords: ["compile time error", "silent runtime bug", "wrong fare"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "@Override does not change what the method does.", keyWords: ["@Override", "does not change"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "It protects your intention. It makes the compiler verify that your override is real.", keyWords: ["protects", "intention", "compiler verify", "real"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "One annotation, zero room for silent failures.", keyWords: ["One annotation", "zero", "silent failures"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
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
