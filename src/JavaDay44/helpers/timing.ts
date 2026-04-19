/**
 * Day 44 — "Method Overloading"
 * Series: Java / National Railway
 * Audio file: public/audio/Java 44.wav
 * Audio duration: 73.860s → 2216 frames @ 30fps
 * Total composition: 2216 frames
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
// Audio starts at frame 0. scene_from = Math.round(csv_start * 30)
// scene_duration = next_from - current_from (gapless). Last = TOTAL - last_from
// TOTAL_FRAMES = Math.ceil(73.860 * 30) = 2216
export const SCENE_TIMING = {
  // Scene 01 — "This is day 44 of learning National Railway System in Java from first principles." [0.000→5.460]
  s01: { from: Math.round(0.000 * 30), duration: Math.round(5.820 * 30) - Math.round(0.000 * 30) },

  // Scene 02 — "Last day, we learned how compile-time polymorphism lets the system resolve method calls before the program ever runs." [5.820→12.960]
  s02: { from: Math.round(5.820 * 30), duration: Math.round(13.740 * 30) - Math.round(5.820 * 30) },

  // Scene 03 — "The fair booking engine calculates fares in multiple ways." [13.740→16.780]
  s03: { from: Math.round(13.740 * 30), duration: Math.round(17.280 * 30) - Math.round(13.740 * 30) },

  // Scene 04 — "Sometimes it only knows the route." [17.280→18.940]
  s04: { from: Math.round(17.280 * 30), duration: Math.round(19.440 * 30) - Math.round(17.280 * 30) },

  // Scene 05 — "Sometimes it also knows the seat class." [19.440→21.240]
  s05: { from: Math.round(19.440 * 30), duration: Math.round(21.800 * 30) - Math.round(19.440 * 30) },

  // Scene 06 — "Sometimes it also knows whether it is peak hour." [21.800→24.240]
  s06: { from: Math.round(21.800 * 30), duration: Math.round(24.760 * 30) - Math.round(21.800 * 30) },

  // Scene 07 — "In Java, you can write the same method name three times with different parameter signatures." [24.760→29.960]
  s07: { from: Math.round(24.760 * 30), duration: Math.round(30.700 * 30) - Math.round(24.760 * 30) },

  // Scene 08 — "calculateFare(route)." [30.700→31.700]
  s08: { from: Math.round(30.700 * 30), duration: Math.round(32.160 * 30) - Math.round(30.700 * 30) },

  // Scene 09 — "calculateFare(route, seatClass)." [32.160→33.900]
  s09: { from: Math.round(32.160 * 30), duration: Math.round(34.460 * 30) - Math.round(32.160 * 30) },

  // Scene 10 — "calculateFare(route, seatClass, isPeakHour)." [34.460→37.060]
  s10: { from: Math.round(34.460 * 30), duration: Math.round(37.860 * 30) - Math.round(34.460 * 30) },

  // Scene 11 — "The compiler reads the arguments you passed and selects the correct version." [37.860→41.480]
  s11: { from: Math.round(37.860 * 30), duration: Math.round(42.000 * 30) - Math.round(37.860 * 30) },

  // Scene 12 — "You never explicitly choose." [42.000→43.640]
  s12: { from: Math.round(42.000 * 30), duration: Math.round(43.980 * 30) - Math.round(42.000 * 30) },

  // Scene 13 — "The signature chooses for you." [43.980→45.480]
  s13: { from: Math.round(43.980 * 30), duration: Math.round(46.200 * 30) - Math.round(43.980 * 30) },

  // Scene 14 — "This is method overloading." [46.200→47.920]
  s14: { from: Math.round(46.200 * 30), duration: Math.round(48.360 * 30) - Math.round(46.200 * 30) },

  // Scene 15 — "Same name, different parameters." [48.360→49.940]
  s15: { from: Math.round(48.360 * 30), duration: Math.round(50.360 * 30) - Math.round(48.360 * 30) },

  // Scene 16 — "Resolved at compile time." [50.360→51.660]
  s16: { from: Math.round(50.360 * 30), duration: Math.round(52.460 * 30) - Math.round(50.360 * 30) },

  // Scene 17 — "The booking officer always calls calculateFare." [52.460→54.940]
  s17: { from: Math.round(52.460 * 30), duration: Math.round(55.360 * 30) - Math.round(52.460 * 30) },

  // Scene 18 — "The method adapts to whatever data is available." [55.360→57.620]
  s18: { from: Math.round(55.360 * 30), duration: Math.round(58.200 * 30) - Math.round(55.360 * 30) },

  // Scene 19 — "The calling code stays clean." [58.200→59.580]
  s19: { from: Math.round(58.200 * 30), duration: Math.round(60.100 * 30) - Math.round(58.200 * 30) },

  // Scene 20 — "The implementation handles the variation." [60.100→61.860]
  s20: { from: Math.round(60.100 * 30), duration: Math.round(62.820 * 30) - Math.round(60.100 * 30) },

  // Scene 21 — "But what happens when the same method name exists in a parent and a child?" [62.820→66.720]
  s21: { from: Math.round(62.820 * 30), duration: Math.round(67.180 * 30) - Math.round(62.820 * 30) },

  // Scene 22 — "And the decision cannot be made at compile time." [67.180→69.340]
  s22: { from: Math.round(67.180 * 30), duration: Math.round(69.840 * 30) - Math.round(67.180 * 30) },

  // Scene 23 — "That is runtime polymorphism." [69.840→71.620]
  s23: { from: Math.round(69.840 * 30), duration: Math.round(72.060 * 30) - Math.round(69.840 * 30) },

  // Scene 24 — "And that is exactly what we cover next." [72.060→73.860]
  s24: { from: Math.round(72.060 * 30), duration: 2216 - Math.round(72.060 * 30) },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 44 of learning National Railway System in Java from first principles.", keyWords: ["day 44", "National Railway", "Java"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned how compile-time polymorphism lets the system resolve method calls before the program ever runs.", keyWords: ["compile-time polymorphism", "method calls"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "The fare booking engine calculates fares in multiple ways.", keyWords: ["fare booking engine", "multiple ways"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Sometimes it only knows the route.", keyWords: ["route"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "Sometimes it also knows the seat class.", keyWords: ["seat class"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "Sometimes it also knows whether it is peak hour.", keyWords: ["peak hour"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "In Java, you can write the same method name three times with different parameter signatures.", keyWords: ["method name", "parameter signatures"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "calculateFare(route).", keyWords: ["calculateFare", "route"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "calculateFare(route, seatClass).", keyWords: ["calculateFare", "seatClass"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "calculateFare(route, seatClass, isPeakHour).", keyWords: ["calculateFare", "isPeakHour"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "The compiler reads the arguments you passed and selects the correct version.", keyWords: ["compiler", "correct version"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "You never explicitly choose.", keyWords: ["never", "choose"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "The signature chooses for you.", keyWords: ["signature", "chooses"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "This is method overloading.", keyWords: ["method overloading"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "Same name, different parameters.", keyWords: ["Same name", "different parameters"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "Resolved at compile time.", keyWords: ["compile time"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "The booking officer always calls calculateFare.", keyWords: ["booking officer", "calculateFare"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "The method adapts to whatever data is available.", keyWords: ["method", "adapts"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "The calling code stays clean.", keyWords: ["calling code", "clean"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "The implementation handles the variation.", keyWords: ["implementation", "variation"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "But what happens when the same method name exists in a parent and a child?", keyWords: ["parent", "child"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "And the decision cannot be made at compile time.", keyWords: ["decision", "compile time"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "That is runtime polymorphism.", keyWords: ["runtime polymorphism"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
  { text: "And that is exactly what we cover next.", keyWords: ["cover next"], from: SCENE_TIMING.s24.from, duration: SCENE_TIMING.s24.duration },
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
