/**
 * Day 40 — "Static Block"
 * Series: Java / National Railway
 * Audio file: public/audio/java40.wav
 * Audio duration: ~90.97s → 2729 frames @ 30fps
 * Total composition: 2729 frames
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
  text_caption:   'rgba(255,255,255,0.85)',
  text_highlight: SERIES_ACCENT,
  grid_line:      'rgba(255,255,255,0.06)',
  accent:         SERIES_ACCENT,
  accent_dim:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.12)`,
  accent_mid:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.30)`,
  deep_black:     '#0A0A0A',
  cool_silver:    '#A0A0A0',
  vibrant_red:    '#F7374F',
} as const;

// ── Scene timing ─────────────────────────────────────────────────────────────
export const SCENE_TIMING = {
  s01: { from: 0,    duration: 191 },
  s02: { from: 191,  duration: 220 },
  s03: { from: 411,  duration: 82 },
  s04: { from: 493,  duration: 173 },
  s05: { from: 666,  duration: 179 },
  s06: { from: 845,  duration: 215 },
  s07: { from: 1060, duration: 213 },
  s08: { from: 1273, duration: 100 },
  s09: { from: 1373, duration: 152 },
  s10: { from: 1525, duration: 175 },
  s11: { from: 1700, duration: 209 },
  s12: { from: 1909, duration: 192 },
  s13: { from: 2101, duration: 203 },
  s14: { from: 2304, duration: 248 },
  s15: { from: 2552, duration: 177 },
} as const;

// ── Captions ─────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 40 of learning National Railway System in Java from first principles.", keyWords: ["day 40", "Railway", "Java"], from: 0, duration: 191 },
  { text: "Last day, we learned how a static method belongs to the class and requires no object to be called.", keyWords: ["static method", "class", "object"], from: 191, duration: 220 },
  { text: "Today, we learn the static block.", keyWords: ["static block"], from: 411, duration: 82 },
  { text: "When the railway system application starts, before a single train is created,", keyWords: ["railway", "application", "train"], from: 493, duration: 173 },
  { text: "before a single station object exists, the system needs certain data ready.", keyWords: ["station", "data"], from: 666, duration: 179 },
  { text: "All station codes loaded, all route maps mapped, all fair tables pulled from the database.", keyWords: ["station codes", "route maps", "database"], from: 845, duration: 215 },
  { text: "This cannot wait for an object to be created. It must happen the moment the class is loaded into memory.", keyWords: ["object", "class", "memory"], from: 1060, duration: 213 },
  { text: "That is exactly what a static block does.", keyWords: ["static block"], from: 1273, duration: 100 },
  { text: "Static, parentheses, load stations, routes, fares.", keyWords: ["static", "load"], from: 1373, duration: 152 },
  { text: "It runs once, automatically, the moment the JVM loads the class into memory.", keyWords: ["runs once", "JVM", "class", "memory"], from: 1525, duration: 175 },
  { text: "Not when an object is created, not when a method is called, once and only once.", keyWords: ["object", "method", "once"], from: 1700, duration: 209 },
  { text: "No constructor triggers it, no method call triggers it. The class loading itself triggers it.", keyWords: ["constructor", "method", "class loading"], from: 1909, duration: 192 },
  { text: "This is where you put one time class level setup that every future object will depend on.", keyWords: ["class level", "setup", "object"], from: 2101, duration: 203 },
  { text: "Now, static variables and instance variables both live inside a class, but they behave completely differently.", keyWords: ["static variables", "instance variables", "class"], from: 2304, duration: 248 },
  { text: "That exact difference and why confusing them breaks the system is what we break down next.", keyWords: ["difference", "system", "break down"], from: 2552, duration: 177 },
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
