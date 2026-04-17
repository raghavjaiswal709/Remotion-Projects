/**
 * Day 43 — "Compile-time Polymorphism"
 * Series: Java / National Railway
 * Audio file: public/audio/java43.wav
 * Audio duration: 107.860s → 3236 frames @ 30fps
 * Total composition: 3236 frames
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
// TOTAL_FRAMES = Math.ceil(107.860 * 30) = 3236
export const SCENE_TIMING = {
  // Scene 01 — "This is day 43 of learning National Railway System in Java from first principles." [0.000→5.580]
  s01: { from: Math.round(0.000 * 30), duration: Math.round(6.200 * 30) - Math.round(0.000 * 30) },

  // Scene 02 — "Last day, we learned how the object class silently sits at the top of every class hierarchy," [6.200→11.480]
  s02: { from: Math.round(6.200 * 30), duration: Math.round(12.420 * 30) - Math.round(6.200 * 30) },

  // Scene 03 — "giving every object two string, equals, and hash code for free." [12.420→17.240]
  s03: { from: Math.round(12.420 * 30), duration: Math.round(17.960 * 30) - Math.round(12.420 * 30) },

  // Scene 04 — "Today, we learn compile time polymorphism." [17.960→21.200]
  s04: { from: Math.round(17.960 * 30), duration: Math.round(21.880 * 30) - Math.round(17.960 * 30) },

  // Scene 05 — "The booking service needs to book a ticket," [21.880→23.920]
  s05: { from: Math.round(21.880 * 30), duration: Math.round(24.560 * 30) - Math.round(21.880 * 30) },

  // Scene 06 — "but not every booking request looks the same." [24.560→27.020]
  s06: { from: Math.round(24.560 * 30), duration: Math.round(27.020 * 30) - Math.round(24.560 * 30) },

  // Scene 07 — "Sometimes the passenger provides just an ID and a route." [27.020→30.920]
  s07: { from: Math.round(27.020 * 30), duration: Math.round(31.440 * 30) - Math.round(27.020 * 30) },

  // Scene 08 — "Sometimes they add a seat class." [31.440→33.180]
  s08: { from: Math.round(31.440 * 30), duration: Math.round(33.640 * 30) - Math.round(31.440 * 30) },

  // Scene 09 — "Sometimes a concession type on top of that." [33.640→36.200]
  s09: { from: Math.round(33.640 * 30), duration: Math.round(36.880 * 30) - Math.round(33.640 * 30) },

  // Scene 10 — "Three different scenarios." [36.880→38.180]
  s10: { from: Math.round(36.880 * 30), duration: Math.round(38.800 * 30) - Math.round(36.880 * 30) },

  // Scene 11 — "Three different sets of information." [38.800→40.540]
  s11: { from: Math.round(38.800 * 30), duration: Math.round(41.360 * 30) - Math.round(38.800 * 30) },

  // Scene 12 — "One solution, three methods, all named book ticket," [41.360→44.760]
  s12: { from: Math.round(41.360 * 30), duration: Math.round(45.580 * 30) - Math.round(41.360 * 30) },

  // Scene 13 — "each with a different parameter list." [45.580→47.840]
  s13: { from: Math.round(45.580 * 30), duration: Math.round(48.600 * 30) - Math.round(45.580 * 30) },

  // Scene 14 — "Book ticket, passenger ID, route ID." [48.600→51.320]
  s14: { from: Math.round(48.600 * 30), duration: Math.round(51.860 * 30) - Math.round(48.600 * 30) },

  // Scene 15 — "Book ticket, passenger ID, route ID, seat class." [51.860→56.120]
  s15: { from: Math.round(51.860 * 30), duration: Math.round(56.120 * 30) - Math.round(51.860 * 30) },

  // Scene 16 — "Book ticket, passenger ID, route ID, seat class, concession type." [56.120→62.260]
  s16: { from: Math.round(56.120 * 30), duration: Math.round(62.800 * 30) - Math.round(56.120 * 30) },

  // Scene 17 — "The calling code passes different arguments." [62.800→65.240]
  s17: { from: Math.round(62.800 * 30), duration: Math.round(65.760 * 30) - Math.round(62.800 * 30) },

  // Scene 18 — "The compiler looks at what was passed and at compile time picks the correct version." [65.760→71.300]
  s18: { from: Math.round(65.760 * 30), duration: Math.round(72.020 * 30) - Math.round(65.760 * 30) },

  // Scene 19 — "This happens before the program runs." [72.020→74.220]
  s19: { from: Math.round(72.020 * 30), duration: Math.round(74.680 * 30) - Math.round(72.020 * 30) },

  // Scene 20 — "The JVM never makes this decision." [74.680→76.800]
  s20: { from: Math.round(74.680 * 30), duration: Math.round(77.160 * 30) - Math.round(74.680 * 30) },

  // Scene 21 — "The compiler does." [77.160→78.080]
  s21: { from: Math.round(77.160 * 30), duration: Math.round(78.940 * 30) - Math.round(77.160 * 30) },

  // Scene 22 — "Same method name, different parameter signatures." [78.940→81.600]
  s22: { from: Math.round(78.940 * 30), duration: Math.round(82.240 * 30) - Math.round(78.940 * 30) },

  // Scene 23 — "The right version selected at compile time." [82.240→84.980]
  s23: { from: Math.round(82.240 * 30), duration: Math.round(84.980 * 30) - Math.round(82.240 * 30) },

  // Scene 24 — "This is method overloading, and method overloading is compile time polymorphism." [84.980→91.060]
  s24: { from: Math.round(84.980 * 30), duration: Math.round(91.800 * 30) - Math.round(84.980 * 30) },

  // Scene 25 — "That distinction, compile time versus run time, matters enormously." [91.800→97.000]
  s25: { from: Math.round(91.800 * 30), duration: Math.round(97.540 * 30) - Math.round(91.800 * 30) },

  // Scene 26 — "We will see exactly why when run time polymorphism arrives." [97.540→100.920]
  s26: { from: Math.round(97.540 * 30), duration: Math.round(101.460 * 30) - Math.round(97.540 * 30) },

  // Scene 27 — "But first, every rule and edge case of overloading itself." [101.460→105.240]
  s27: { from: Math.round(101.460 * 30), duration: Math.round(105.760 * 30) - Math.round(101.460 * 30) },

  // Scene 28 — "That is exactly what we cover next." [105.760→107.860]
  s28: { from: Math.round(105.760 * 30), duration: 3236 - Math.round(105.760 * 30) },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 43 of learning National Railway System in Java from first principles.", keyWords: ["day 43", "National Railway", "Java"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned how the object class silently sits at the top of every class hierarchy,", keyWords: ["object class", "hierarchy"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "giving every object toString, equals, and hashCode for free.", keyWords: ["toString", "equals", "hashCode"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Today, we learn compile time polymorphism.", keyWords: ["compile time", "polymorphism"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "The booking service needs to book a ticket,", keyWords: ["booking service", "ticket"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "but not every booking request looks the same.", keyWords: ["booking request"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "Sometimes the passenger provides just an ID and a route.", keyWords: ["ID", "route"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "Sometimes they add a seat class.", keyWords: ["seat class"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Sometimes a concession type on top of that.", keyWords: ["concession type"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "Three different scenarios.", keyWords: ["Three"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "Three different sets of information.", keyWords: ["Three", "information"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "One solution, three methods, all named bookTicket,", keyWords: ["three methods", "bookTicket"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "each with a different parameter list.", keyWords: ["parameter list"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "bookTicket(passengerId, routeId).", keyWords: ["bookTicket", "passengerId", "routeId"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "bookTicket(passengerId, routeId, seatClass).", keyWords: ["bookTicket", "seatClass"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "bookTicket(passengerId, routeId, seatClass, concessionType).", keyWords: ["bookTicket", "concessionType"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "The calling code passes different arguments.", keyWords: ["calling code", "arguments"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "The compiler looks at what was passed and at compile time picks the correct version.", keyWords: ["compiler", "compile time"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "This happens before the program runs.", keyWords: ["before", "program runs"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "The JVM never makes this decision.", keyWords: ["JVM", "never"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "The compiler does.", keyWords: ["compiler"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "Same method name, different parameter signatures.", keyWords: ["method name", "parameter signatures"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "The right version selected at compile time.", keyWords: ["right version", "compile time"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
  { text: "This is method overloading, and method overloading is compile time polymorphism.", keyWords: ["method overloading", "compile time polymorphism"], from: SCENE_TIMING.s24.from, duration: SCENE_TIMING.s24.duration },
  { text: "That distinction, compile time versus run time, matters enormously.", keyWords: ["compile time", "run time"], from: SCENE_TIMING.s25.from, duration: SCENE_TIMING.s25.duration },
  { text: "We will see exactly why when run time polymorphism arrives.", keyWords: ["run time polymorphism"], from: SCENE_TIMING.s26.from, duration: SCENE_TIMING.s26.duration },
  { text: "But first, every rule and edge case of overloading itself.", keyWords: ["rule", "edge case", "overloading"], from: SCENE_TIMING.s27.from, duration: SCENE_TIMING.s27.duration },
  { text: "That is exactly what we cover next.", keyWords: ["cover next"], from: SCENE_TIMING.s28.from, duration: SCENE_TIMING.s28.duration },
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
