/**
 * Day 42 — "Object class"
 * Series: Java / National Railway
 * Audio file: public/audio/java42.wav
 * Audio duration: 108.440s → 3254 frames @ 30fps
 * Total composition: 3254 frames
 *
 * Topic: Every Train, Station, Ticket, Passenger implicitly extends Object.
 * The equals(), hashCode(), and toString() methods come from this universal parent.
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Java / National Railway ──────────────────────────────────
const SERIES_ACCENT = '#D87656';
const ACCENT_R = 216, ACCENT_G = 118, ACCENT_B = 86;

// ── Color palette ── use ONLY these, never raw hex codes outside this object ──
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
// scene_duration = next_scene_from - current_scene_from (gapless sequential)
// TOTAL_FRAMES = Math.ceil(108.440 * 30) = 3254
export const SCENE_TIMING = {
  // Scene 01 — "This is day 42 of learning national railway system in Java from first principles." [0.000s → 6.340s]
  s01: { from: Math.round(0.000 * 30), duration: 205 },

  // Scene 02 — "Last day, we learned how instance variables describe one object," [6.840s → 11.380s]
  s02: { from: Math.round(6.840 * 30), duration: 145 },

  // Scene 03 — "while static variables describe the class as a whole," [11.680s → 14.900s]
  s03: { from: Math.round(11.680 * 30), duration: 105 },

  // Scene 04 — "and why mixing them breaks the system." [15.180s → 17.980s]
  s04: { from: Math.round(15.180 * 30), duration: 104 },

  // Scene 05 — "Today, we learn the object class." [18.620s → 21.300s]
  s05: { from: Math.round(18.620 * 30), duration: 99 },

  // Scene 06 — "Every class in Java has a parent." [21.940s → 24.320s]
  s06: { from: Math.round(21.940 * 30), duration: 85 },

  // Scene 07 — "Even if you never write extends, there is still a parent." [24.760s → 28.720s]
  s07: { from: Math.round(24.760 * 30), duration: 119 },

  // Scene 08 — "That parent is Java .lang .object" [28.720s → 32.700s]
  s08: { from: Math.round(28.720 * 30), duration: 119 },

  // Scene 09 — "Train, station, ticket, passenger," [32.700s → 36.480s]
  s09: { from: Math.round(32.700 * 30), duration: 121 },

  // Scene 10 — "every single one silently extends object." [36.720s → 40.500s]
  s10: { from: Math.round(36.720 * 30), duration: 126 },

  // Scene 11 — "Java inserts this relationship automatically. You cannot opt out." [40.940s → 45.780s]
  s11: { from: Math.round(40.940 * 30), duration: 157 },

  // Scene 12 — "Because of that, every object in the system inherits three methods used constantly." [46.180s → 52.180s]
  s12: { from: Math.round(46.180 * 30), duration: 180 },

  // Scene 13 — "Dot 2 string converts the object to a readable string" [52.180s → 56.920s]
  s13: { from: Math.round(52.180 * 30), duration: 143 },

  // Scene 14 — "when you print a ticket this runs." [56.920s → 59.360s]
  s14: { from: Math.round(56.920 * 30), duration: 96 },

  // Scene 15 — "Dot equals compares two objects by their actual field values, not their memory addresses," [60.140s → 66.600s]
  s15: { from: Math.round(60.140 * 30), duration: 213 },

  // Scene 16 — "and dot hash code. Generates a numeric code used by hash map and hash set to store and retrieve objects correctly." [67.220s → 76.540s]
  s16: { from: Math.round(67.220 * 30), duration: 279 },

  // Scene 17 — "These come for free," [76.540s → 78.620s]
  s17: { from: Math.round(76.540 * 30), duration: 75 },

  // Scene 18 — "but the default implementations are rarely useful." [79.020s → 82.160s]
  s18: { from: Math.round(79.020 * 30), duration: 112 },

  // Scene 19 — "The default dot 2 string returns train at 4a3b2c, meaningless." [82.760s → 89.600s]
  s19: { from: Math.round(82.760 * 30), duration: 225 },

  // Scene 20 — "In the coming parts, we override each one inside the ticket class." [90.260s → 94.920s]
  s20: { from: Math.round(90.260 * 30), duration: 157 },

  // Scene 21 — "Now, the same method name producing completely different behavior," [95.500s → 100.380s]
  s21: { from: Math.round(95.500 * 30), duration: 157 },

  // Scene 22 — "depending on what you pass into it." [100.740s → 102.600s]
  s22: { from: Math.round(100.740 * 30), duration: 66 },

  // Scene 23 — "That is compile time polymorphism." [102.940s → 105.800s]
  s23: { from: Math.round(102.940 * 30), duration: 86 },

  // Scene 24 — "And that is exactly where we go next." [105.800s → 108.440s]
  s24: { from: Math.round(105.800 * 30), duration: 80 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 42 of learning national railway system in Java from first principles.", keyWords: ["day 42", "Java", "national railway"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned how instance variables describe one object,", keyWords: ["instance variables", "object"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "while static variables describe the class as a whole,", keyWords: ["static variables", "class"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "and why mixing them breaks the system.", keyWords: ["mixing", "breaks"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "Today, we learn the object class.", keyWords: ["object class"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "Every class in Java has a parent.", keyWords: ["class", "parent"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "Even if you never write extends, there is still a parent.", keyWords: ["extends", "parent"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "That parent is java.lang.Object", keyWords: ["java.lang.Object"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Train, station, ticket, passenger,", keyWords: ["Train", "station", "ticket", "passenger"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "every single one silently extends Object.", keyWords: ["extends", "Object"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "Java inserts this relationship automatically. You cannot opt out.", keyWords: ["automatically", "cannot opt out"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "Because of that, every object in the system inherits three methods used constantly.", keyWords: ["three methods", "inherits"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "toString converts the object to a readable string", keyWords: ["toString", "readable"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "when you print a ticket this runs.", keyWords: ["print", "ticket"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "equals compares two objects by their actual field values, not their memory addresses,", keyWords: ["equals", "field values", "memory addresses"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "and hashCode generates a numeric code used by HashMap and HashSet to store and retrieve objects correctly.", keyWords: ["hashCode", "HashMap", "HashSet"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "These come for free,", keyWords: ["free"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "but the default implementations are rarely useful.", keyWords: ["default", "rarely useful"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "The default toString returns Train@4a3b2c, meaningless.", keyWords: ["toString", "meaningless"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "In the coming parts, we override each one inside the Ticket class.", keyWords: ["override", "Ticket"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "Now, the same method name producing completely different behavior,", keyWords: ["method name", "different behavior"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "depending on what you pass into it.", keyWords: ["pass"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "That is compile time polymorphism.", keyWords: ["compile time", "polymorphism"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
  { text: "And that is exactly where we go next.", keyWords: ["next"], from: SCENE_TIMING.s24.from, duration: SCENE_TIMING.s24.duration },
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
