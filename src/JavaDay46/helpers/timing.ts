/**
 * Day 46 — "Upcasting"
 * Series: Java / National Railway
 * Audio file: public/audio/java 46.wav
 * Audio duration: 77.460s → 2324 frames @ 30fps
 * Total composition: 2324 frames
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
// Audio starts at frame 0. TOTAL_FRAMES = 2324
// Phrase groups from CSV, split aggressively for 22 scenes:
//
// s01: "This is day 46 of learning National Railway System in Java from first principles." [0.000→5.500]
// s02: "Last day, we learned how runtime polymorphism lets the actual objects type determine which method runs." [6.060→12.580]
// s03: "When an express train object is stored in a train type reference," [13.340→16.800]
// s04: "train T equals new express train," [17.420→19.560]
// s05: "the object is still an express train in memory," [20.080→22.760]
// s06: "but the reference sees it only as a train." [23.180→25.540]
// s07: "The express specific methods are no longer reachable through T." [25.540→29.600]
// s08: "Java permits this automatically, no cast required." [30.540→33.060]
// s09: "This is upcasting," [33.940→35.220]
// s10: "a child object stored in a parent type reference." [35.640→38.480]
// s11: "Why is this useful?" [39.280→40.260]
// s12: "The control room scheduling system processes all trains the same way." [40.900→44.560]
// s13: "It does not need to know whether it is handling an express or a freight train." [45.120→48.540]
// s14: "It just needs a train." [49.080→50.240]
// s15: "Upcasting makes that generic processing possible." [51.020→53.600]
// s16: "A list of train can hold express trains, metro trains," [53.600→56.880]
// s17: "and freight trains, all treated uniformly." [57.180→60.360]
// s18: "The list processes every entry the same way, calling the same methods on each." [60.960→65.360]
// s19: "But what happens when you need express specific behavior back from that train reference?" [66.160→70.320]
// s20: "Getting it back requires something more deliberate." [70.960→73.220]
// s21: "That is downcasting," [73.760→75.040]
// s22: "and that is exactly what we cover next." [75.400→77.460]

export const SCENE_TIMING = {
  s01: { from: Math.round(0.000 * 30), duration: 0 },
  s02: { from: Math.round(6.060 * 30), duration: 0 },
  s03: { from: Math.round(13.340 * 30), duration: 0 },
  s04: { from: Math.round(17.420 * 30), duration: 0 },
  s05: { from: Math.round(20.080 * 30), duration: 0 },
  s06: { from: Math.round(23.180 * 30), duration: 0 },
  s07: { from: Math.round(25.540 * 30), duration: 0 },
  s08: { from: Math.round(30.540 * 30), duration: 0 },
  s09: { from: Math.round(33.940 * 30), duration: 0 },
  s10: { from: Math.round(35.640 * 30), duration: 0 },
  s11: { from: Math.round(39.280 * 30), duration: 0 },
  s12: { from: Math.round(40.900 * 30), duration: 0 },
  s13: { from: Math.round(45.120 * 30), duration: 0 },
  s14: { from: Math.round(49.080 * 30), duration: 0 },
  s15: { from: Math.round(51.020 * 30), duration: 0 },
  s16: { from: Math.round(53.600 * 30), duration: 0 },
  s17: { from: Math.round(57.180 * 30), duration: 0 },
  s18: { from: Math.round(60.960 * 30), duration: 0 },
  s19: { from: Math.round(66.160 * 30), duration: 0 },
  s20: { from: Math.round(70.960 * 30), duration: 0 },
  s21: { from: Math.round(73.760 * 30), duration: 0 },
  s22: { from: Math.round(75.400 * 30), duration: 0 },
} as const;

// Compute durations using gap-fill approach
const TOTAL_FRAMES = 2324;
const keys = Object.keys(SCENE_TIMING) as (keyof typeof SCENE_TIMING)[];
for (let i = 0; i < keys.length; i++) {
  const entry = SCENE_TIMING[keys[i]] as { from: number; duration: number };
  if (i < keys.length - 1) {
    entry.duration = (SCENE_TIMING[keys[i + 1]] as { from: number }).from - entry.from;
  } else {
    entry.duration = TOTAL_FRAMES - entry.from;
  }
}

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 46 of learning National Railway System in Java from first principles.", keyWords: ["day 46", "National Railway", "Java"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned how runtime polymorphism lets the actual objects type determine which method runs.", keyWords: ["runtime polymorphism", "method"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "When an express train object is stored in a train type reference,", keyWords: ["express train", "train type", "reference"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "train T equals new express train,", keyWords: ["train T", "express train"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "the object is still an express train in memory,", keyWords: ["express train", "memory"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "but the reference sees it only as a train.", keyWords: ["reference", "train"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "The express specific methods are no longer reachable through T.", keyWords: ["express specific", "methods", "reachable"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "Java permits this automatically, no cast required.", keyWords: ["Java", "automatically", "no cast"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "This is upcasting,", keyWords: ["upcasting"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "a child object stored in a parent type reference.", keyWords: ["child", "parent", "reference"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "Why is this useful?", keyWords: ["useful"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "The control room scheduling system processes all trains the same way.", keyWords: ["control room", "scheduling", "trains"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "It does not need to know whether it is handling an express or a freight train.", keyWords: ["express", "freight"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "It just needs a train.", keyWords: ["train"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "Upcasting makes that generic processing possible.", keyWords: ["Upcasting", "generic processing"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "A list of train can hold express trains, metro trains,", keyWords: ["list", "express", "metro"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "and freight trains, all treated uniformly.", keyWords: ["freight", "uniformly"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "The list processes every entry the same way, calling the same methods on each.", keyWords: ["processes", "methods"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "But what happens when you need express specific behavior back from that train reference?", keyWords: ["express specific", "behavior", "train reference"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "Getting it back requires something more deliberate.", keyWords: ["deliberate"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "That is downcasting,", keyWords: ["downcasting"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "and that is exactly what we cover next.", keyWords: ["cover next"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
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
