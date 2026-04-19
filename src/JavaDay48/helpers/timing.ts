/**
 * Day 48 — "instanceof keyword"
 * Series: Java / National Railway
 * Audio file: public/audio/Java 48.wav
 * Audio duration: 89.420s → 2683 frames @ 30fps
 * Total composition: 2683 frames
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
// Audio starts at frame 0. TOTAL_FRAMES = Math.ceil(89.420 * 30) = 2683
// scene_duration = next_scene_from - current_scene_from (gapless)

export const SCENE_TIMING = {
  // s01: "This is day 48 of learning National Railway System in Java from first principles." [0.000→5.680]
  s01: { from: 0, duration: 182 },
  // s02: "Last day, we learned how downcasting retrieves child type behavior from apparent reference" [6.080→11.460]
  s02: { from: 182, duration: 185 },
  // s03: "and why a wrong cast crashes the system at runtime." [12.220→14.900]
  s03: { from: 367, duration: 109 },
  // s04: "The fix is one check before every cast." [15.860→18.660]
  s04: { from: 476, duration: 108 },
  // s05: "If T instance of Express Train." [19.480→21.760]
  s05: { from: 584, duration: 93 },
  // s06: "This asks Java," [22.560→23.560]
  s06: { from: 677, duration: 44 },
  // s07: "does the object at this reference actually belong to Express Train?" [24.040→27.400]
  s07: { from: 721, duration: 118 },
  // s08: "If yes, proceed." [27.960→29.260]
  s08: { from: 839, duration: 68 },
  // s09: "If no, skip the block entirely." [30.020→31.980]
  s09: { from: 907, duration: 70 },
  // s10: "No crash." [32.560→32.940]
  s10: { from: 977, duration: 38 },
  // s11: "This is the instance of keyword," [33.840→35.700]
  s11: { from: 1015, duration: 71 },
  // s12: "a runtime type verification before a type cast." [36.200→39.280]
  s12: { from: 1086, duration: 105 },
  // s13: "The premium services module now checks before every downcast." [39.680→43.580]
  s13: { from: 1191, duration: 143 },
  // s14: "If T instance of Express Train." [44.460→46.520]
  s14: { from: 1334, duration: 62 },
  // s15: "Cast it." [46.980→47.420]
  s15: { from: 1396, duration: 38 },
  // s16: "Access Express specific methods." [47.780→49.340]
  s16: { from: 1434, duration: 73 },
  // s17: "Elsef. T instance of Metro Train." [50.180→52.500]
  s17: { from: 1507, duration: 69 },
  // s18: "Cast it." [53.020→53.440]
  s18: { from: 1576, duration: 38 },
  // s19: "Access Metro specific methods." [53.800→55.260]
  s19: { from: 1614, duration: 65 },
  // s20: "Each branch handles its own type safely." [55.960→58.320]
  s20: { from: 1679, duration: 99 },
  // s21: "In any system where apparent reference might hold different child types," [58.920→62.820]
  s21: { from: 1778, duration: 106 },
  // s22: "this check is the gate that stands between correct behavior and a production crash." [63.280→67.580]
  s22: { from: 1884, duration: 95 },
  // s23: "Downcast without it," [68.220→69.340]
  s23: { from: 1979, duration: 63 },
  // s24: "you are trusting that the object is what you assume." [69.720→71.960]
  s24: { from: 2042, duration: 75 },
  // s25: "In a large system, that assumption will eventually be wrong." [72.540→75.500]
  s25: { from: 2117, duration: 77 },
  // s26: "Tomorrow, Java goes further." [76.480→78.280]
  s26: { from: 2194, duration: 72 },
  // s27: "A newer version checks the type and binds it to a variable in the same line." [78.820→82.720]
  s27: { from: 2266, duration: 82 },
  // s28: "No separate cast required." [83.120→84.480]
  s28: { from: 2348, duration: 69 },
  // s29: "That is instance of pattern matching. And that is exactly what we cover next." [85.120→89.420]
  s29: { from: 2417, duration: 266 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 48 of learning National Railway System in Java from first principles.", keyWords: ["day 48", "Java"], from: 0, duration: 182 },
  { text: "Last day, we learned how downcasting retrieves child type behavior from apparent reference", keyWords: ["downcasting", "child type"], from: 182, duration: 185 },
  { text: "and why a wrong cast crashes the system at runtime.", keyWords: ["wrong cast", "crashes", "runtime"], from: 367, duration: 109 },
  { text: "The fix is one check before every cast.", keyWords: ["one check", "every cast"], from: 476, duration: 108 },
  { text: "If T instance of Express Train.", keyWords: ["instanceof", "ExpressTrain"], from: 584, duration: 93 },
  { text: "This asks Java,", keyWords: ["Java"], from: 677, duration: 44 },
  { text: "does the object at this reference actually belong to Express Train?", keyWords: ["object", "reference", "ExpressTrain"], from: 721, duration: 118 },
  { text: "If yes, proceed.", keyWords: ["yes", "proceed"], from: 839, duration: 68 },
  { text: "If no, skip the block entirely.", keyWords: ["no", "skip"], from: 907, duration: 70 },
  { text: "No crash.", keyWords: ["crash"], from: 977, duration: 38 },
  { text: "This is the instanceof keyword,", keyWords: ["instanceof"], from: 1015, duration: 71 },
  { text: "a runtime type verification before a type cast.", keyWords: ["runtime", "type verification", "type cast"], from: 1086, duration: 105 },
  { text: "The premium services module now checks before every downcast.", keyWords: ["premium services", "checks", "downcast"], from: 1191, duration: 143 },
  { text: "If T instance of Express Train.", keyWords: ["instanceof", "ExpressTrain"], from: 1334, duration: 62 },
  { text: "Cast it.", keyWords: ["Cast"], from: 1396, duration: 38 },
  { text: "Access Express specific methods.", keyWords: ["Express", "methods"], from: 1434, duration: 73 },
  { text: "Else if T instance of Metro Train.", keyWords: ["instanceof", "MetroTrain"], from: 1507, duration: 69 },
  { text: "Cast it.", keyWords: ["Cast"], from: 1576, duration: 38 },
  { text: "Access Metro specific methods.", keyWords: ["Metro", "methods"], from: 1614, duration: 65 },
  { text: "Each branch handles its own type safely.", keyWords: ["branch", "type", "safely"], from: 1679, duration: 99 },
  { text: "In any system where apparent reference might hold different child types,", keyWords: ["apparent reference", "child types"], from: 1778, duration: 106 },
  { text: "this check is the gate that stands between correct behavior and a production crash.", keyWords: ["gate", "production crash"], from: 1884, duration: 95 },
  { text: "Downcast without it,", keyWords: ["Downcast"], from: 1979, duration: 63 },
  { text: "you are trusting that the object is what you assume.", keyWords: ["trusting", "assume"], from: 2042, duration: 75 },
  { text: "In a large system, that assumption will eventually be wrong.", keyWords: ["large system", "assumption", "wrong"], from: 2117, duration: 77 },
  { text: "Tomorrow, Java goes further.", keyWords: ["Tomorrow", "Java"], from: 2194, duration: 72 },
  { text: "A newer version checks the type and binds it to a variable in the same line.", keyWords: ["type", "binds", "variable"], from: 2266, duration: 82 },
  { text: "No separate cast required.", keyWords: ["cast", "required"], from: 2348, duration: 69 },
  { text: "That is instanceof pattern matching. And that is exactly what we cover next.", keyWords: ["instanceof", "pattern matching"], from: 2417, duration: 266 },
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
