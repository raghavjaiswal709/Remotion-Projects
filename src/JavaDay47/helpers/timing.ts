/**
 * Day 47 — "Downcasting"
 * Series: Java / National Railway
 * Audio file: public/audio/java 47.wav
 * Audio duration: 88.020s → 2641 frames @ 30fps
 * Total composition: 2641 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

const SERIES_ACCENT = '#D87656';
const ACCENT_R = 216, ACCENT_G = 118, ACCENT_B = 86;

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

export const SCENE_TIMING = {
  s01: { from: Math.round(0.000 * 30), duration: 0 },
  s02: { from: Math.round(6.960 * 30), duration: 0 },
  s03: { from: Math.round(13.440 * 30), duration: 0 },
  s04: { from: Math.round(16.240 * 30), duration: 0 },
  s05: { from: Math.round(22.000 * 30), duration: 0 },
  s06: { from: Math.round(24.280 * 30), duration: 0 },
  s07: { from: Math.round(27.660 * 30), duration: 0 },
  s08: { from: Math.round(30.600 * 30), duration: 0 },
  s09: { from: Math.round(35.940 * 30), duration: 0 },
  s10: { from: Math.round(40.380 * 30), duration: 0 },
  s11: { from: Math.round(42.680 * 30), duration: 0 },
  s12: { from: Math.round(48.200 * 30), duration: 0 },
  s13: { from: Math.round(50.840 * 30), duration: 0 },
  s14: { from: Math.round(54.260 * 30), duration: 0 },
  s15: { from: Math.round(56.620 * 30), duration: 0 },
  s16: { from: Math.round(60.080 * 30), duration: 0 },
  s17: { from: Math.round(62.680 * 30), duration: 0 },
  s18: { from: Math.round(65.740 * 30), duration: 0 },
  s19: { from: Math.round(68.540 * 30), duration: 0 },
  s20: { from: Math.round(72.200 * 30), duration: 0 },
  s21: { from: Math.round(75.860 * 30), duration: 0 },
  s22: { from: Math.round(78.400 * 30), duration: 0 },
  s23: { from: Math.round(82.980 * 30), duration: 0 },
  s24: { from: Math.round(85.360 * 30), duration: 0 },
} as const;

const TOTAL_FRAMES = 2641;
const keys = Object.keys(SCENE_TIMING) as (keyof typeof SCENE_TIMING)[];
for (let i = 0; i < keys.length; i++) {
  const entry = SCENE_TIMING[keys[i]] as { from: number; duration: number };
  if (i < keys.length - 1) {
    entry.duration = (SCENE_TIMING[keys[i + 1]] as { from: number }).from - entry.from;
  } else {
    entry.duration = TOTAL_FRAMES - entry.from;
  }
}

export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 47 of learning National Railway System in Java from first principles.", keyWords: ["day 47", "National Railway", "Java"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learnt how upcasting stores a child object in a parent-type reference,", keyWords: ["upcasting", "child", "parent-type", "reference"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "narrowing what is accessible through it.", keyWords: ["narrowing", "accessible"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Now the Premium Services module needs the Express-specific behaviour back.", keyWords: ["Premium Services", "Express-specific"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "The reference is Train T.", keyWords: ["Train T", "reference"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "The actual object in memory is an Express train.", keyWords: ["Express train", "memory"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "To access Express-specific methods,", keyWords: ["Express-specific", "methods"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "the code must explicitly tell Java, treat this reference as an Express train.", keyWords: ["explicitly", "Express train"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Express train ET equals Express train T.", keyWords: ["ExpressTrain", "ET", "T"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "This is downcasting,", keyWords: ["downcasting"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "an explicit cast from a parent-type reference back to a specific child type.", keyWords: ["explicit cast", "parent-type", "child type"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "But there is a risk.", keyWords: ["risk"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "If T does not actually hold an Express train in memory,", keyWords: ["T", "Express train", "memory"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "if it holds a freight train,", keyWords: ["freight train"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "Java throws a class cast exception at runtime,", keyWords: ["ClassCastException", "runtime"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "not at compile time, at runtime.", keyWords: ["compile time", "runtime"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "The application crashes in production.", keyWords: ["crashes", "production"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "The cast itself compiles cleanly.", keyWords: ["compiles", "cleanly"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "Java cannot verify it until the program runs.", keyWords: ["verify", "program runs"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "This is why downcasting is never done blindly.", keyWords: ["downcasting", "never", "blindly"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "Before casting, you verify.", keyWords: ["casting", "verify"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "You ask Java, is this object actually what I think it is?", keyWords: ["object", "actually"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "That safety check has a name.", keyWords: ["safety check", "name"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
  { text: "And that is exactly what we cover in the next part.", keyWords: ["next part"], from: SCENE_TIMING.s24.from, duration: SCENE_TIMING.s24.duration },
];

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
