/**
 * Day 38 — "Static Variable"
 * Series: Java / National Railway
 * Audio file: public/audio/java38.wav
 * Audio duration: 81.540s → 2447 frames @ 30fps
 * Total composition: 2447 frames
 *
 * Train.totalActiveTrains is a static int — shared across all Train instances
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Java / National Railway ──────────────────────────────────
const SERIES_ACCENT = '#D87656';
const ACCENT_R = 216, ACCENT_G = 118, ACCENT_B = 86;

// ── Color palette ────────────────────────────────────────────────────────────
export const COLORS = {
  bg_primary:     '#0D0D0D',
  bg_secondary:   '#1A1A1A',
  bg_card:        '#1A1A1A',

  white:          '#FFFFFF',
  text_primary:   '#FFFFFF',
  text_muted:     'rgba(255,255,255,0.55)',
  text_caption:   '#FFFFFF',
  text_highlight: SERIES_ACCENT,

  grid_line:      'rgba(255,255,255,0.06)',

  accent:         SERIES_ACCENT,
  accent_dim:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.12)`,
  accent_mid:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.30)`,

  deep_black:     '#0D0D0D',
  cool_silver:    'rgba(255,255,255,0.55)',
  vibrant_red:    '#F7374F',
} as const;

// ── Scene timing ─────────────────────────────────────────────────────────────
export const SCENE_TIMING = {
  s01: { from: 0,    duration: 203 },
  s02: { from: 203,  duration: 239 },
  s03: { from: 442,  duration: 97  },
  s04: { from: 539,  duration: 285 },
  s05: { from: 824,  duration: 93  },
  s06: { from: 917,  duration: 135 },
  s07: { from: 1052, duration: 234 },
  s08: { from: 1286, duration: 154 },
  s09: { from: 1440, duration: 138 },
  s10: { from: 1578, duration: 95  },
  s11: { from: 1673, duration: 234 },
  s12: { from: 1907, duration: 199 },
  s13: { from: 2106, duration: 280 },
  s14: { from: 2386, duration: 61  },
} as const;

export const TOTAL_FRAMES = 2447;

// ── Captions ─────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 38 of learning National Railway System in Java from first principles.", keyWords: ["day 38", "Railway", "Java"], from: 0, duration: 203 },
  { text: "Last day, we learned how a final class locks a blueprint shut. No subclass can ever inherit from it.", keyWords: ["final class", "blueprint", "subclass", "inherit"], from: 203, duration: 239 },
  { text: "Today, we learn the static variable.", keyWords: ["static variable"], from: 442, duration: 97 },
  { text: "Every train object has its own passenger count, its own speed, its own route. Those are instance variables unique per object.", keyWords: ["train", "instance variables", "object"], from: 539, duration: 285 },
  { text: "But the control room needs one number.", keyWords: ["control room"], from: 824, duration: 93 },
  { text: "How many trains are currently active across the entire network?", keyWords: ["trains", "active", "network"], from: 917, duration: 135 },
  { text: "That number does not belong to any single train object. It belongs to the train class itself.", keyWords: ["train class", "belongs"], from: 1052, duration: 234 },
  { text: "Train.totalActiveTrains is declared as static int.", keyWords: ["totalActiveTrains", "static int"], from: 1286, duration: 154 },
  { text: "Every time a new train object is created, this counter increments.", keyWords: ["train", "counter", "increments"], from: 1440, duration: 138 },
  { text: "Every time a train is retired, it decrements.", keyWords: ["retired", "decrements"], from: 1578, duration: 95 },
  { text: "No matter how many train instances exist, there is only one copy of this variable, shared across all of them.", keyWords: ["one copy", "shared"], from: 1673, duration: 234 },
  { text: "Instance variables live inside each object. Static variables live inside the class.", keyWords: ["Instance variables", "Static variables", "class"], from: 1907, duration: 199 },
  { text: "Now, a variable at the class level is useful, but what about a method that also belongs to the class? One that needs no object to run?", keyWords: ["class level", "method", "object"], from: 2106, duration: 280 },
  { text: "That is exactly what we cover next.", keyWords: ["cover next"], from: 2386, duration: 61 },
];

// ── Animation helpers ────────────────────────────────────────────────────────
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
