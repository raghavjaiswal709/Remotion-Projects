/**
 * Day 29 — "What Is an Agent Runtime?"
 * Series: Agentic AI
 * Audio file: public/audio/ai29.wav
 * Audio duration: 70.520s → 2116 frames @ 30fps
 * Total composition: 2116 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Agentic AI ───────────────────────────────────────────────
const SERIES_ACCENT = '#76ABAE';
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174;

// ── Color palette ─────────────────────────────────────────────────────────────
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
// TOTAL_FRAMES = 2116
export const SCENE_TIMING = {
  s01: { from: Math.round(0.000 * 30), duration: 156 },   // 0→156
  s02: { from: Math.round(5.200 * 30), duration: 85 },    // 156→241
  s03: { from: Math.round(8.020 * 30), duration: 148 },   // 241→389
  s04: { from: Math.round(12.980 * 30), duration: 72 },   // 389→461
  s05: { from: Math.round(15.360 * 30), duration: 72 },   // 461→533
  s06: { from: Math.round(17.780 * 30), duration: 101 },  // 533→634
  s07: { from: Math.round(21.140 * 30), duration: 123 },  // 634→757
  s08: { from: Math.round(25.240 * 30), duration: 61 },   // 757→818
  s09: { from: Math.round(27.260 * 30), duration: 77 },   // 818→895
  s10: { from: Math.round(29.820 * 30), duration: 57 },   // 895→952
  s11: { from: Math.round(31.720 * 30), duration: 58 },   // 952→1010
  s12: { from: Math.round(33.680 * 30), duration: 71 },   // 1010→1081
  s13: { from: Math.round(36.020 * 30), duration: 109 },  // 1081→1190
  s14: { from: Math.round(39.680 * 30), duration: 74 },   // 1190→1264
  s15: { from: Math.round(42.120 * 30), duration: 75 },   // 1264→1339
  s16: { from: Math.round(44.640 * 30), duration: 69 },   // 1339→1408
  s17: { from: Math.round(46.920 * 30), duration: 105 },  // 1408→1513
  s18: { from: Math.round(50.420 * 30), duration: 82 },   // 1513→1595
  s19: { from: Math.round(53.180 * 30), duration: 41 },   // 1595→1636
  s20: { from: Math.round(54.540 * 30), duration: 114 },  // 1636→1750
  s21: { from: Math.round(58.320 * 30), duration: 127 },  // 1750→1877
  s22: { from: Math.round(62.580 * 30), duration: 86 },   // 1877→1963
  s23: { from: Math.round(65.420 * 30), duration: 94 },   // 1963→2057
  s24: { from: Math.round(68.580 * 30), duration: 59 },   // 2057→2116
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 29 of learning Agentic AI from first principles.", keyWords: ["day 29", "Agentic AI"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned how tool calling works.", keyWords: ["tool calling"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "The model writes a structured specification and something else executes it.", keyWords: ["specification", "executes"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Today, we name that something else.", keyWords: ["name"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "This is the agent runtime.", keyWords: ["agent runtime"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "The runtime is the infrastructure surrounding the model.", keyWords: ["infrastructure", "model"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "Pure code, the scaffolding, the entire loop runs inside.", keyWords: ["scaffolding", "loop"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "Here is what it does in exact sequence.", keyWords: ["exact sequence"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "It receives the user input.", keyWords: ["user input"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "It formats it into a prompt.", keyWords: ["prompt"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "It calls the model API.", keyWords: ["model API"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "When the response arrives, it reads it.", keyWords: ["response"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "If the response contains a tool call, it executes that tool.", keyWords: ["tool call", "executes"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "It formats the result as an observation.", keyWords: ["observation"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "It appends that observation to the conversation.", keyWords: ["appends", "conversation"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "Then it calls the model again.", keyWords: ["calls", "again"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "That sequence is the agent loop made executable.", keyWords: ["agent loop", "executable"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "Without the runtime, the model is just a function.", keyWords: ["function"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "Text in, text out, done.", keyWords: ["text"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "With the runtime, it becomes a continuous loop.", keyWords: ["continuous loop"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "Acting on the world, receiving what the world says back, acting again.", keyWords: ["world", "acting"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "Now, there is one thing this loop still needs. A purpose.", keyWords: ["purpose"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "A defined goal to move toward.", keyWords: ["goal"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
  { text: "That is exactly what we name next.", keyWords: ["name next"], from: SCENE_TIMING.s24.from, duration: SCENE_TIMING.s24.duration },
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
