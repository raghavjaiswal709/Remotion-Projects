/**
 * Day 28 — "What Is Tool Calling?"
 * Series: Agentic AI
 * Audio file: public/audio/ai28.wav
 * Audio duration: 81.760s → 2453 frames @ 30fps
 * Total composition: 2453 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — AI Series ────────────────────────────────────────────────
const SERIES_ACCENT = '#76ABAE';
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174;

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
// Audio starts at frame 0. 25 content scenes. TOTAL_FRAMES = 2453
export const SCENE_TIMING = {
  // Scene 01 — "This is day 28 of learning a GenTik AI from first principles." [0.000s → 4.960s]
  s01: { from: 0, duration: 163 },
  // Scene 02 — "Last day, we learned what a tool is," [5.440s → 7.860s]
  s02: { from: 163, duration: 80 },
  // Scene 03 — "a named callable function that bridges the model's text output and real world effects." [8.100s → 13.320s]
  s03: { from: 243, duration: 180 },
  // Scene 04 — "Today, we look at how the model actually uses that tool." [14.100s → 17.800s]
  s04: { from: 423, duration: 128 },
  // Scene 05 — "This is tool calling." [18.360s → 19.860s]
  s05: { from: 551, duration: 73 },
  // Scene 06 — "The model does not execute functions." [20.800s → 22.920s]
  s06: { from: 624, duration: 79 },
  // Scene 07 — "It does not run code." [23.440s → 24.640s]
  s07: { from: 703, duration: 53 },
  // Scene 08 — "It does not reach into a system and pull a result back." [25.200s → 28.180s]
  s08: { from: 756, duration: 105 },
  // Scene 09 — "What the model does is write an instruction." [28.700s → 31.300s]
  s09: { from: 861, duration: 106 },
  // Scene 10 — "When the agent decides a tool is needed," [32.220s → 34.540s]
  s10: { from: 967, duration: 82 },
  // Scene 11 — "it generates a structured output," [34.980s → 36.720s]
  s11: { from: 1049, duration: 68 },
  // Scene 12 — "not a prose answer, a formatted specification," [37.240s → 40.340s]
  s12: { from: 1117, duration: 116 },
  // Scene 13 — "the name of the tool, the argument names, the argument values." [41.100s → 44.880s]
  s13: { from: 1233, duration: 137 },
  // Scene 14 — "That specification leaves the model." [45.680s → 47.880s]
  s14: { from: 1370, duration: 83 },
  // Scene 15 — "The surrounding system reads it." [48.420s → 50.140s]
  s15: { from: 1453, duration: 65 },
  // Scene 16 — "The surrounding system runs the actual function." [50.600s → 53.240s]
  s16: { from: 1518, duration: 99 },
  // Scene 17 — "The result returns as the next observation." [53.900s → 56.380s]
  s17: { from: 1617, duration: 104 },
  // Scene 18 — "The model never directly executes anything." [57.380s → 60.260s]
  s18: { from: 1721, duration: 106 },
  // Scene 19 — "Its job is to decide." [60.900s → 62.240s]
  s19: { from: 1827, duration: 62 },
  // Scene 20 — "Execution happens in code, outside the model entirely." [62.980s → 66.440s]
  s20: { from: 1889, duration: 147 },
  // Scene 21 — "Decision and execution are two separate things." [67.860s → 70.780s]
  s21: { from: 2036, duration: 109 },
  // Scene 22 — "The model owns one." [71.500s → 72.620s]
  s22: { from: 2145, duration: 49 },
  // Scene 23 — "The system owns the other." [73.140s → 74.420s]
  s23: { from: 2194, duration: 55 },
  // Scene 24 — "And the system that reads every decision and turns it into a real action," [74.980s → 79.180s]
  s24: { from: 2249, duration: 144 },
  // Scene 25 — "that is exactly what we build next." [79.760s → 81.760s]
  s25: { from: 2393, duration: 60 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 28 of learning agentic AI from first principles.", keyWords: ["day 28", "agentic AI", "first principles"], from: 0, duration: 163 },
  { text: "Last day, we learned what a tool is,", keyWords: ["tool"], from: 163, duration: 80 },
  { text: "a named callable function that bridges the model's text output and real world effects.", keyWords: ["callable function", "bridges", "real world"], from: 243, duration: 180 },
  { text: "Today, we look at how the model actually uses that tool.", keyWords: ["model", "uses", "tool"], from: 423, duration: 128 },
  { text: "This is tool calling.", keyWords: ["tool calling"], from: 551, duration: 73 },
  { text: "The model does not execute functions.", keyWords: ["not execute", "functions"], from: 624, duration: 79 },
  { text: "It does not run code.", keyWords: ["not run", "code"], from: 703, duration: 53 },
  { text: "It does not reach into a system and pull a result back.", keyWords: ["not reach", "system", "result"], from: 756, duration: 105 },
  { text: "What the model does is write an instruction.", keyWords: ["write", "instruction"], from: 861, duration: 106 },
  { text: "When the agent decides a tool is needed,", keyWords: ["agent", "decides", "tool"], from: 967, duration: 82 },
  { text: "it generates a structured output,", keyWords: ["structured output"], from: 1049, duration: 68 },
  { text: "not a prose answer, a formatted specification,", keyWords: ["formatted", "specification"], from: 1117, duration: 116 },
  { text: "the name of the tool, the argument names, the argument values.", keyWords: ["tool", "argument"], from: 1233, duration: 137 },
  { text: "That specification leaves the model.", keyWords: ["specification", "leaves", "model"], from: 1370, duration: 83 },
  { text: "The surrounding system reads it.", keyWords: ["system", "reads"], from: 1453, duration: 65 },
  { text: "The surrounding system runs the actual function.", keyWords: ["system", "runs", "function"], from: 1518, duration: 99 },
  { text: "The result returns as the next observation.", keyWords: ["result", "observation"], from: 1617, duration: 104 },
  { text: "The model never directly executes anything.", keyWords: ["never", "executes"], from: 1721, duration: 106 },
  { text: "Its job is to decide.", keyWords: ["decide"], from: 1827, duration: 62 },
  { text: "Execution happens in code, outside the model entirely.", keyWords: ["execution", "code", "outside"], from: 1889, duration: 147 },
  { text: "Decision and execution are two separate things.", keyWords: ["decision", "execution", "separate"], from: 2036, duration: 109 },
  { text: "The model owns one.", keyWords: ["model", "one"], from: 2145, duration: 49 },
  { text: "The system owns the other.", keyWords: ["system", "other"], from: 2194, duration: 55 },
  { text: "And the system that reads every decision and turns it into a real action,", keyWords: ["system", "decision", "real action"], from: 2249, duration: 144 },
  { text: "that is exactly what we build next.", keyWords: ["build next"], from: 2393, duration: 60 },
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
