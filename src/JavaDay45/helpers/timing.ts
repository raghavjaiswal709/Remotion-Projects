/**
 * Day 45 — "Runtime Polymorphism"
 * Series: Java / National Railway
 * Audio file: public/audio/Java 45.wav
 * Audio duration: 78.600s → 2358 frames @ 30fps
 * Total composition: 2358 frames
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
// Audio starts at frame 0. scene_from = Math.round(csv_start_seconds * 30)
// 22 content scenes, gapless sequential
// TOTAL_FRAMES = 2358
export const SCENE_TIMING = {

  // Scene 01 — "This is day 45 of learning National Railway System in Java from first principles." [0.000→5.940]
  s01: { from: Math.round(0.000 * 30), duration: Math.round(6.420 * 30) - Math.round(0.000 * 30) },

  // Scene 02 — "Last day we learned how method overloading lets one method name serve multiple parameter combinations," [6.420→12.660]
  s02: { from: Math.round(6.420 * 30), duration: Math.round(13.220 * 30) - Math.round(6.420 * 30) },

  // Scene 03 — "resolved at compile time." [13.220→14.540]
  s03: { from: Math.round(13.220 * 30), duration: Math.round(15.200 * 30) - Math.round(13.220 * 30) },

  // Scene 04 — "Now consider this. The Fair Engine holds a Fair Calculator reference." [15.200→19.860]
  s04: { from: Math.round(15.200 * 30), duration: Math.round(20.340 * 30) - Math.round(15.200 * 30) },

  // Scene 05 — "At runtime, that reference points to an Express Fair Calculator object." [20.340→24.860]
  s05: { from: Math.round(20.340 * 30), duration: Math.round(25.360 * 30) - Math.round(20.340 * 30) },

  // Scene 06 — "The Calling Code only knows it is a Fair Calculator." [25.360→28.520]
  s06: { from: Math.round(25.360 * 30), duration: Math.round(28.520 * 30) - Math.round(25.360 * 30) },

  // Scene 07 — "It does not know the specific type." [28.520→30.760]
  s07: { from: Math.round(28.520 * 30), duration: Math.round(31.260 * 30) - Math.round(28.520 * 30) },

  // Scene 08 — "When Calculator is called," [31.260→32.840]
  s08: { from: Math.round(31.260 * 30), duration: Math.round(33.480 * 30) - Math.round(31.260 * 30) },

  // Scene 09 — "Java looks at the actual object in memory, not the reference type." [33.480→37.160]
  s09: { from: Math.round(33.480 * 30), duration: Math.round(37.720 * 30) - Math.round(33.480 * 30) },

  // Scene 10 — "It finds Express Fair Calculator." [37.720→39.720]
  s10: { from: Math.round(37.720 * 30), duration: Math.round(40.160 * 30) - Math.round(37.720 * 30) },

  // Scene 11 — "It runs that version of Calculator." [40.160→42.060]
  s11: { from: Math.round(40.160 * 30), duration: Math.round(42.580 * 30) - Math.round(40.160 * 30) },

  // Scene 12 — "This is runtime polymorphism." [42.580→44.800]
  s12: { from: Math.round(42.580 * 30), duration: Math.round(45.400 * 30) - Math.round(42.580 * 30) },

  // Scene 13 — "The method to execute is not decided when the code is compiled." [45.400→48.620]
  s13: { from: Math.round(45.400 * 30), duration: Math.round(49.220 * 30) - Math.round(45.400 * 30) },

  // Scene 14 — "It is decided when the program is running," [49.220→51.200]
  s14: { from: Math.round(49.220 * 30), duration: Math.round(51.640 * 30) - Math.round(49.220 * 30) },

  // Scene 15 — "based on what object actually lives at that reference." [51.640→54.320]
  s15: { from: Math.round(51.640 * 30), duration: Math.round(55.020 * 30) - Math.round(51.640 * 30) },

  // Scene 16 — "This is why you can swap Express Fair Calculator from Metro Fair Calculator without changing a single line of Calling Code." [55.020→62.220]
  s16: { from: Math.round(55.020 * 30), duration: Math.round(62.860 * 30) - Math.round(55.020 * 30) },

  // Scene 17 — "The reference stays the same." [62.860→64.140]
  s17: { from: Math.round(62.860 * 30), duration: Math.round(64.700 * 30) - Math.round(62.860 * 30) },

  // Scene 18 — "The behavior changes entirely." [64.700→66.420]
  s18: { from: Math.round(64.700 * 30), duration: Math.round(67.420 * 30) - Math.round(64.700 * 30) },

  // Scene 19 — "The mechanism that makes this possible is the connection between the parent reference and the child object." [67.420→72.460]
  s19: { from: Math.round(67.420 * 30), duration: Math.round(73.080 * 30) - Math.round(67.420 * 30) },

  // Scene 20 — "That connection has a name." [73.080→74.340]
  s20: { from: Math.round(73.080 * 30), duration: Math.round(74.880 * 30) - Math.round(73.080 * 30) },

  // Scene 21 — "It is called upcasting." [74.880→76.060]
  s21: { from: Math.round(74.880 * 30), duration: Math.round(76.580 * 30) - Math.round(74.880 * 30) },

  // Scene 22 — "And that is exactly what we build next." [76.580→78.600]
  s22: { from: Math.round(76.580 * 30), duration: 2358 - Math.round(76.580 * 30) },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 45 of learning National Railway System in Java from first principles.", keyWords: ["day 45", "National Railway", "Java"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day we learned how method overloading lets one method name serve multiple parameter combinations,", keyWords: ["method overloading", "parameter"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "resolved at compile time.", keyWords: ["compile time"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Now consider this. The Fare Engine holds a FareCalculator reference.", keyWords: ["Fare Engine", "FareCalculator"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "At runtime, that reference points to an ExpressFareCalculator object.", keyWords: ["runtime", "ExpressFareCalculator"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "The calling code only knows it is a FareCalculator.", keyWords: ["calling code", "FareCalculator"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "It does not know the specific type.", keyWords: ["specific type"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "When calculate() is called,", keyWords: ["calculate()"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Java looks at the actual object in memory, not the reference type.", keyWords: ["actual object", "memory", "reference type"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "It finds ExpressFareCalculator.", keyWords: ["ExpressFareCalculator"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "It runs that version of calculate().", keyWords: ["version", "calculate()"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "This is runtime polymorphism.", keyWords: ["runtime polymorphism"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "The method to execute is not decided when the code is compiled.", keyWords: ["not decided", "compiled"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "It is decided when the program is running,", keyWords: ["decided", "running"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "based on what object actually lives at that reference.", keyWords: ["object", "reference"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "This is why you can swap ExpressFareCalculator for MetroFareCalculator without changing a single line of calling code.", keyWords: ["swap", "ExpressFareCalculator", "MetroFareCalculator"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "The reference stays the same.", keyWords: ["reference", "same"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "The behavior changes entirely.", keyWords: ["behavior", "changes"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "The mechanism that makes this possible is the connection between the parent reference and the child object.", keyWords: ["parent reference", "child object"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "That connection has a name.", keyWords: ["connection", "name"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "It is called upcasting.", keyWords: ["upcasting"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "And that is exactly what we build next.", keyWords: ["build next"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
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
