/**
 * Day 41 — "Instance vs Static Variable"
 * Series: Java / National Railway
 * Audio file: public/audio/java41.wav
 * Audio duration: 90.580s → 2718 frames @ 30fps
 * Total composition: 2718 frames
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
// Audio starts at frame 0 — scene froms = Math.round(csv_start_seconds * 30)
// scene_duration = next_scene_from - current_scene_from (gapless sequential)
// TOTAL_FRAMES = Math.ceil(90.580 * 30) = 2718
export const SCENE_TIMING = {
  // Scene 01 — "This is day 41 of learning National Railway System in Java from first principles." [0.000s → 5.940s]
  s01: { from: 0, duration: 193 },

  // Scene 02 — "Last day, we learned how a static block runs once" [6.420s → 9.700s]
  s02: { from: 193, duration: 98 },

  // Scene 03 — "when the cost loads before any object ever exists." [9.700s → 13.080s]
  s03: { from: 291, duration: 127 },

  // Scene 04 — "Today, we learn the difference between instance variables and static variables." [13.920s → 18.060s]
  s04: { from: 418, duration: 143 },

  // Scene 05 — "The train class has both." [18.700s → 20.140s]
  s05: { from: 561, duration: 68 },

  // Scene 06 — "Private int current passenger count, instance variable," [20.980s → 24.340s]
  s06: { from: 629, duration: 101 },

  // Scene 07 — "train hashtag KL2401 carries its own count." [24.340s → 29.480s]
  s07: { from: 730, duration: 175 },

  // Scene 08 — "Train hashtag MH1102 carries its own, completely separate per object." [30.180s → 37.060s]
  s08: { from: 905, duration: 237 },

  // Scene 09 — "Static int total passengers in system, class variable," [38.060s → 40.660s]
  s09: { from: 1142, duration: 135 },

  // Scene 10 — "one copy shared across every train object in the entire system." [42.580s → 47.280s]
  s10: { from: 1277, duration: 161 },

  // Scene 11 — "When train hashtag KL2401 boards 300 passengers," [47.920s → 52.900s]
  s11: { from: 1438, duration: 165 },

  // Scene 12 — "current passenger count for that train becomes 300," [53.420s → 56.400s]
  s12: { from: 1603, duration: 99 },

  // Scene 13 — "and total passengers in system for the class increases by 300." [56.740s → 61.200s]
  s13: { from: 1702, duration: 148 },

  // Scene 14 — "Two different scopes," [61.680s → 63.260s]
  s14: { from: 1850, duration: 63 },

  // Scene 15 — "two different lifetimes, two different purposes." [63.760s → 66.880s]
  s15: { from: 1913, duration: 118 },

  // Scene 16 — "Confuse them in the control room dashboard reports wrong numbers." [67.700s → 71.500s]
  s16: { from: 2031, duration: 131 },

  // Scene 17 — "The booking system double count seats, the financial reports break." [72.080s → 75.940s]
  s17: { from: 2162, duration: 143 },

  // Scene 18 — "Every train in the system has one silent parent it never declared," [76.840s → 80.900s]
  s18: { from: 2305, duration: 132 },

  // Scene 19 — "and that parent gives every object three methods they use every single day." [81.220s → 85.860s]
  s19: { from: 2437, duration: 157 },

  // Scene 20 — "That is the object class, and that is exactly what we cover next." [86.480s → 90.580s]
  s20: { from: 2594, duration: 124 },
} as const;

// ── Captions ─────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 41 of learning National Railway System in Java from first principles.", keyWords: ["day 41", "Railway", "Java"], from: 0, duration: 193 },
  { text: "Last day, we learned how a static block runs once", keyWords: ["static block", "runs once"], from: 193, duration: 98 },
  { text: "when the class loads before any object ever exists.", keyWords: ["class", "object"], from: 291, duration: 127 },
  { text: "Today, we learn the difference between instance variables and static variables.", keyWords: ["instance variables", "static variables"], from: 418, duration: 143 },
  { text: "The train class has both.", keyWords: ["train", "class"], from: 561, duration: 68 },
  { text: "Private int currentPassengerCount, instance variable,", keyWords: ["currentPassengerCount", "instance variable"], from: 629, duration: 101 },
  { text: "train KL2401 carries its own count.", keyWords: ["KL2401", "count"], from: 730, duration: 175 },
  { text: "Train MH1102 carries its own, completely separate per object.", keyWords: ["MH1102", "separate", "object"], from: 905, duration: 237 },
  { text: "Static int totalPassengersInSystem, class variable,", keyWords: ["totalPassengersInSystem", "class variable"], from: 1142, duration: 135 },
  { text: "one copy shared across every train object in the entire system.", keyWords: ["one copy", "shared", "system"], from: 1277, duration: 161 },
  { text: "When train KL2401 boards 300 passengers,", keyWords: ["KL2401", "300"], from: 1438, duration: 165 },
  { text: "currentPassengerCount for that train becomes 300,", keyWords: ["currentPassengerCount", "300"], from: 1603, duration: 99 },
  { text: "and totalPassengersInSystem for the class increases by 300.", keyWords: ["totalPassengersInSystem", "increases", "300"], from: 1702, duration: 148 },
  { text: "Two different scopes,", keyWords: ["scopes"], from: 1850, duration: 63 },
  { text: "two different lifetimes, two different purposes.", keyWords: ["lifetimes", "purposes"], from: 1913, duration: 118 },
  { text: "Confuse them in the control room dashboard reports wrong numbers.", keyWords: ["control room", "dashboard", "wrong numbers"], from: 2031, duration: 131 },
  { text: "The booking system double count seats, the financial reports break.", keyWords: ["booking system", "double count", "financial reports"], from: 2162, duration: 143 },
  { text: "Every train in the system has one silent parent it never declared,", keyWords: ["silent parent", "declared"], from: 2305, duration: 132 },
  { text: "and that parent gives every object three methods they use every single day.", keyWords: ["three methods", "object", "every single day"], from: 2437, duration: 157 },
  { text: "That is the Object class, and that is exactly what we cover next.", keyWords: ["Object class", "next"], from: 2594, duration: 124 },
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
