/**
 * Day 27 — "What Is a Tool?"
 * Series: Agentic AI
 * Audio file: public/audio/ai27.wav
 * Audio duration: 79.020s → 2371 frames @ 30fps
 * Total composition: 3040 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — AI Series ────────────────────────────────────────────────
const SERIES_ACCENT = '#76ABAE';
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174;

// ── Color palette ── use ONLY these, never raw hex codes outside this object ──
export const COLORS = {
  // Backgrounds
  bg_primary:     '#1D1D1C',
  bg_secondary:   '#2C2C2B',
  bg_card:        '#2C2C2B',

  // Text (light on dark)
  white:          '#FFFFFF',
  text_primary:   '#FFFFFF',
  text_muted:     'rgba(255,255,255,0.55)',
  text_caption:   '#FFFFFF',
  text_highlight: SERIES_ACCENT,

  // Grid
  grid_line:      'rgba(255,255,255,0.5)',

  // Series accent
  accent:         SERIES_ACCENT,
  accent_dim:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.12)`,
  accent_mid:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.30)`,

  // Semantic aliases
  deep_black:     '#1D1D1C',
  cool_silver:    'rgba(255,255,255,0.55)',
  vibrant_red:    '#F7374F',
} as const;

// ── Frame constants ──────────────────────────────────────────────────────────
const SCROLL_FRAMES = 150;

// ── Scene timing ─────────────────────────────────────────────────────────────
// ALL 'from' values are COMPOSITION frames (not audio-relative frames)
// Content scenes: from = 150 + Math.round(csv_start_seconds * 30), overlap-adjusted
export const SCENE_TIMING = {

  // Scene 01 — Scrolling Timeline (SILENT, pre-audio)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "This is day 27 of learning Agentic AI from first principles." [0.000s → 4.720s]
  s02: { from: 150, duration: 160 },

  // Scene 03 — "Last day, we learned what an observation is." [5.320s → 8.300s]
  s03: { from: 310, duration: 107 },

  // Scene 04 — "A tool is a named callable function that the agent can invoke." [8.860s → 13.340s]
  s04: { from: 417, duration: 152 },

  // Scene 05 — "Search, read file, send email, run an SQL query." [14.100s → 18.880s]
  s05: { from: 573, duration: 161 },

  // Scene 06 — "Each of these is a tool, a precise bounded capability the agent can choose to use." [19.600s → 25.820s]
  s06: { from: 738, duration: 205 },

  // Scene 07 — "The language model never directly executes anything." [25.820s → 29.840s]
  s07: { from: 943, duration: 139 },

  // Scene 08 — "It generates text. A tool call is a structured piece of text..." [30.340s → 38.120s]
  s08: { from: 1082, duration: 251 },

  // Scene 09 — "The runtime reads that output." [38.800s → 40.560s]
  s09: { from: 1333, duration: 71 },

  // Scene 10 — "It runs the actual function and it returns the result as the next observation." [41.080s → 45.860s]
  s10: { from: 1404, duration: 161 },

  // Scene 11 — "The model decides the tool does." [46.520s → 49.080s]
  s11: { from: 1565, duration: 95 },

  // Scene 12 — "This separation matters deeply." [50.140s → 52.160s]
  s12: { from: 1660, duration: 79 },

  // Scene 13 — "The model's job is reasoning, choosing which tool..." [52.160s → 59.400s]
  s13: { from: 1739, duration: 235 },

  // Scene 14 — "The tool's job is execution, doing the actual work in the real world." [59.980s → 65.400s]
  s14: { from: 1974, duration: 181 },

  // Scene 15 — "A search tool connects the agent to current information." [66.080s → 69.060s]
  s15: { from: 2155, duration: 107 },

  // Scene 16 — "A code tool gives it precise calculation." [69.580s → 72.040s]
  s16: { from: 2262, duration: 92 },

  // Scene 17 — "A browser tool gives it access to any website on Earth." [72.680s → 76.220s]
  s17: { from: 2354, duration: 124 },

  // Scene 18 — "Tools are the agent's hands." [76.960s → 79.020s]
  s18: { from: 2478, duration: 80 },

  // Scene 19 — Key Takeaway
  s_takeaway: { from: 2558, duration: 120 },

  // Scene 20 — Outro
  s_outro: { from: 2678, duration: 362 },

} as const;

// ── Total frames verification ────────────────────────────────────────────────
// OUTRO_FROM (2678) + OUTRO_DUR (362) = 3040 ✓

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 27 of learning Agentic AI from first principles.", keyWords: ["27", "Agentic AI"], from: 150, duration: 160 },
  { text: "Last day, we learned what an observation is.", keyWords: ["observation"], from: 310, duration: 107 },
  { text: "A tool is a named callable function that the agent can invoke.", keyWords: ["tool", "callable function", "invoke"], from: 417, duration: 152 },
  { text: "Search, read file, send email, run an SQL query.", keyWords: ["Search", "SQL"], from: 573, duration: 161 },
  { text: "Each of these is a tool, a precise bounded capability the agent can choose to use.", keyWords: ["tool", "bounded capability"], from: 738, duration: 205 },
  { text: "The language model never directly executes anything.", keyWords: ["language model", "never"], from: 943, duration: 139 },
  { text: "It generates text. A tool call is a structured piece of text that says call this function with these arguments.", keyWords: ["tool call", "structured"], from: 1082, duration: 251 },
  { text: "The runtime reads that output.", keyWords: ["runtime"], from: 1333, duration: 71 },
  { text: "It runs the actual function and returns the result as the next observation.", keyWords: ["function", "observation"], from: 1404, duration: 161 },
  { text: "The model decides the tool does.", keyWords: ["model decides", "tool does"], from: 1565, duration: 95 },
  { text: "This separation matters deeply.", keyWords: ["separation"], from: 1660, duration: 79 },
  { text: "The model's job is reasoning, choosing which tool with what arguments at what point in the task.", keyWords: ["reasoning", "tool"], from: 1739, duration: 235 },
  { text: "The tool's job is execution, doing the actual work in the real world.", keyWords: ["execution", "real world"], from: 1974, duration: 181 },
  { text: "A search tool connects the agent to current information.", keyWords: ["search tool", "information"], from: 2155, duration: 107 },
  { text: "A code tool gives it precise calculation.", keyWords: ["code tool", "calculation"], from: 2262, duration: 92 },
  { text: "A browser tool gives it access to any website on Earth.", keyWords: ["browser tool", "Earth"], from: 2354, duration: 124 },
  { text: "Tools are the agent's hands.", keyWords: ["Tools", "hands"], from: 2478, duration: 80 },
];

// ── Animation helpers ─────────────────────────────────────────────────────────
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Fade from 0→1 over `dur` frames starting at `start` (local frame) */
export const fadeIn = (frame: number, start: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - start) / dur));

/** Fade from 1→0 over `dur` frames starting at `start` (local frame) */
export const fadeOut = (frame: number, start: number, dur: number): number =>
  1 - Math.min(1, Math.max(0, (frame - start) / dur));

/** Ease-snap curve (cubic ease-in-out) */
export const easeSnap = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Eased fade-in 0→1 */
export const snapIn = (frame: number, start: number, dur: number): number =>
  easeSnap(Math.min(1, Math.max(0, (frame - start) / dur)));

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));
