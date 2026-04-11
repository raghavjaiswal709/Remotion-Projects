/**
 * Day 34 — "Covariant Return Type"
 * Series: Java (National Railway)
 * Audio file: public/audio/java34.wav
 * Audio duration: 82.800s → 2484 frames @ 30fps
 * Total composition: 3146 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Color palette ─────────────────────────────────────────────────────────────
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
// Content scenes: from = 150 + Math.round(csv_start_seconds * 30)
export const SCENE_TIMING = {

  // Scene 01 — Scrolling Timeline (SILENT, pre-audio)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "This is day 34 of learning Java from first principles." [0.00→4.36]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: Math.max(60, Math.round((4.360 - 0.000) * 30) + 18) },
  // → from=150, duration=149

  // Scene 03 — "Last day, we learned how @override makes the compiler verify..." [5.18→11.88]
  s03: { from: SCROLL_FRAMES + Math.round(5.180 * 30), duration: Math.max(60, Math.round((11.880 - 5.180) * 30) + 18) },
  // → from=305, duration=219

  // Scene 04 — "Today, we are looking at covariant return type." [12.68→16.20]
  s04: { from: SCROLL_FRAMES + Math.round(12.680 * 30), duration: Math.max(60, Math.round((16.200 - 12.680) * 30) + 18) },
  // → from=530, duration=124

  // Scene 05 — "The base train class has a method called getEngine that returns an engine object." [16.74→23.06]
  s05: { from: SCROLL_FRAMES + Math.round(16.740 * 30), duration: Math.max(60, Math.round((23.060 - 16.740) * 30) + 18) },
  // → from=652, duration=208

  // Scene 06 — "Bullet train extends train and overrides getEngine, but bullet train does not use an ordinary engine." [23.06→30.98]
  s06: { from: SCROLL_FRAMES + Math.round(23.060 * 30), duration: Math.max(60, Math.round((30.980 - 23.060) * 30) + 18) },
  // → from=842, duration=256

  // Scene 07 — "It uses a Maglev engine, which is a subtype of engine." [31.50→35.20]
  s07: { from: SCROLL_FRAMES + Math.round(31.500 * 30), duration: Math.max(60, Math.round((35.200 - 31.500) * 30) + 18) },
  // → from=1095, duration=129

  // Scene 08 — "Covariant return type allows bullet train to override getEngine and return a Maglev engine instead of a plane engine." [36.04→44.56]
  s08: { from: SCROLL_FRAMES + Math.round(36.040 * 30), duration: Math.max(60, Math.round((44.560 - 36.040) * 30) + 18) },
  // → from=1231, duration=274

  // Scene 09 — "The return type in the child is more specific than the return type in the parent." [45.16→50.00]
  s09: { from: SCROLL_FRAMES + Math.round(45.160 * 30), duration: Math.max(60, Math.round((50.000 - 45.160) * 30) + 18) },
  // → from=1505, duration=163

  // Scene 10 — "This is legal in Java because a Maglev engine is still an engine." [50.00→55.60]
  s10: { from: SCROLL_FRAMES + Math.round(50.000 * 30), duration: Math.max(60, Math.round((55.600 - 50.000) * 30) + 18) },
  // → from=1650, duration=186

  // Scene 11 — "The contract of the parent method is not broken." [56.10→58.90]
  s11: { from: SCROLL_FRAMES + Math.round(56.100 * 30), duration: Math.max(60, Math.round((58.900 - 56.100) * 30) + 18) },
  // → from=1833, duration=102

  // Scene 12 — "The child simply fulfills it with a more precise type." [59.42→63.02]
  s12: { from: SCROLL_FRAMES + Math.round(59.420 * 30), duration: Math.max(60, Math.round((63.020 - 59.420) * 30) + 18) },
  // → from=1933, duration=126

  // Scene 13 — "Code working directly with bullet train objects gets a Maglev engine back, no casting required." [64.02→70.00]
  s13: { from: SCROLL_FRAMES + Math.round(64.020 * 30), duration: Math.max(60, Math.round((70.000 - 64.020) * 30) + 18) },
  // → from=2071, duration=197

  // Scene 14 — "Code working with a generic train reference still gets an engine, no surprises." [70.80→75.68]
  s14: { from: SCROLL_FRAMES + Math.round(70.800 * 30), duration: Math.max(60, Math.round((75.680 - 70.800) * 30) + 18) },
  // → from=2274, duration=164

  // Scene 15 — "The return type can narrow, it can never widen." [75.68→79.96]
  s15: { from: SCROLL_FRAMES + Math.round(75.680 * 30), duration: Math.max(60, Math.round((79.960 - 75.680) * 30) + 18) },
  // → from=2420, duration=146

  // Scene 16 — "That is covariant return type." [80.54→82.80]
  s16: { from: SCROLL_FRAMES + Math.round(80.540 * 30), duration: Math.max(60, Math.round((82.800 - 80.540) * 30) + 18) },
  // → from=2566, duration=86

  // Scene 17 — Key Takeaway
  s_takeaway: { from: 2664, duration: 120 },

  // Scene 18 — Outro
  s_outro: { from: 2784, duration: 362 },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is Day 34 of learning Java from first principles.", keyWords: ["Day 34", "Java", "first principles"], from: 150, duration: 149 },
  { text: "Last day, we learned how @Override makes the compiler verify that a method override is genuine.", keyWords: ["@Override", "compiler verify", "genuine"], from: 305, duration: 219 },
  { text: "Today, we are looking at covariant return type.", keyWords: ["covariant return type"], from: 530, duration: 124 },
  { text: "The base Train class has a method called getEngine that returns an Engine object.", keyWords: ["Train", "getEngine", "Engine"], from: 652, duration: 208 },
  { text: "BulletTrain extends Train and overrides getEngine, but BulletTrain does not use an ordinary engine.", keyWords: ["BulletTrain", "overrides", "getEngine"], from: 842, duration: 256 },
  { text: "It uses a MaglevEngine, which is a subtype of Engine.", keyWords: ["MaglevEngine", "subtype", "Engine"], from: 1095, duration: 129 },
  { text: "Covariant return type allows BulletTrain to override getEngine and return a MaglevEngine instead.", keyWords: ["Covariant", "BulletTrain", "MaglevEngine"], from: 1231, duration: 274 },
  { text: "The return type in the child is more specific than the return type in the parent.", keyWords: ["more specific", "child", "parent"], from: 1505, duration: 163 },
  { text: "This is legal in Java because a MaglevEngine is still an Engine.", keyWords: ["legal", "MaglevEngine", "Engine"], from: 1650, duration: 186 },
  { text: "The contract of the parent method is not broken.", keyWords: ["contract", "not broken"], from: 1833, duration: 102 },
  { text: "The child simply fulfills it with a more precise type.", keyWords: ["fulfills", "more precise type"], from: 1933, duration: 126 },
  { text: "Code working directly with BulletTrain objects gets a MaglevEngine back, no casting required.", keyWords: ["BulletTrain", "MaglevEngine", "no casting"], from: 2071, duration: 197 },
  { text: "Code working with a generic Train reference still gets an Engine, no surprises.", keyWords: ["generic Train", "Engine", "no surprises"], from: 2274, duration: 164 },
  { text: "The return type can narrow, it can never widen.", keyWords: ["narrow", "never widen"], from: 2420, duration: 146 },
  { text: "That is covariant return type.", keyWords: ["covariant return type"], from: 2566, duration: 86 },
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
