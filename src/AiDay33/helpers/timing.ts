/**
 * Day 33 — "What Is a Step?"
 * Series: Agentic AI
 * Audio file: public/audio/AI day 33.wav
 * Audio duration: 89.160s → 2675 frames @ 30fps
 * Total composition: 2675 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Agentic AI ───────────────────────────────────────────────
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
// 28 content scenes (some short CSV phrases merged)
// TOTAL_FRAMES = 2675
export const SCENE_TIMING = {
  // Scene 01 — "This is day 33 of learning agent AI from first principles." [0.000→5.060]
  s01: { from: 0, duration: 169 },
  // Scene 02 — "Last day, we learned what a trajectory is." [5.620→8.080]
  s02: { from: 169, duration: 82 },
  // Scene 03 — "The complete sequence of actions and observations from task start to task end." [8.380→12.760]
  s03: { from: 251, duration: 144 },
  // Scene 04 — "Today, we define the step." [13.180→15.220]
  s04: { from: 395, duration: 79 },
  // Scene 05 — "A step is one complete iteration of the agent loop." [15.800→19.020]
  s05: { from: 474, duration: 115 },
  // Scene 06 — "One observation in, one action out." [19.620→21.920]
  s06: { from: 589, duration: 85 },
  // Scene 07 — "That is the atomic unit of agent execution." [22.460→25.380]
  s07: { from: 674, duration: 109 },
  // Scene 08 — "Search results arrive. That is the observation." [26.100→28.480]
  s08: { from: 783, duration: 71 },
  // Scene 09 — "Call the document reader. That is the action." [28.480→31.360]
  s09: { from: 854, duration: 106 },
  // Scene 10 — "One step complete. Move to the next." [32.000→34.000]
  s10: { from: 960, duration: 91 },
  // Scene 11 — "Complex tasks require dozens of steps." [35.020→37.360]
  s11: { from: 1051, duration: 85 },
  // Scene 12 — "Sometimes hundreds." [37.860→38.840]
  s12: { from: 1136, duration: 49 },
  // Scene 13 — "The entire trajectory is a chain of steps." [39.500→42.160]
  s13: { from: 1185, duration: 94 },
  // Scene 14 — "Each one a small, controlled exchange between the agent and its environment." [42.620→46.700]
  s14: { from: 1279, duration: 148 },
  // Scene 15 — "The value of thinking in steps is what each boundary gives you." [47.560→51.240]
  s15: { from: 1427, duration: 129 },
  // Scene 16 — "Each step is independently auditable." [51.860→53.960]
  s16: { from: 1556, duration: 75 },
  // Scene 17 — "Was this decision correct given this input?" [54.380→56.500]
  s17: { from: 1631, duration: 86 },
  // Scene 18 — "Each step is individually cost measurable." [57.220→59.520]
  s18: { from: 1717, duration: 87 },
  // Scene 19 — "One model call, one tool call, tokens counted." [60.120→63.100]
  s19: { from: 1804, duration: 109 },
  // Scene 20 — "Each step is separately retriable." [63.780→65.920]
  s20: { from: 1913, duration: 80 },
  // Scene 21 — "If step 17 fails, you retry step 17." [66.420→69.400]
  s21: { from: 1993, duration: 103 },
  // Scene 22 — "Not the entire task from the beginning." [69.860→71.680]
  s22: { from: 2096, duration: 88 },
  // Scene 23 — "Reliability is engineered at the step level. Not the task level." [72.800→76.380]
  s23: { from: 2184, duration: 135 },
  // Scene 24 — "One large goal produces many steps." [77.300→79.720]
  s24: { from: 2319, duration: 86 },
  // Scene 25 — "But those steps need to arrive in the right order." [80.160→82.480]
  s25: { from: 2405, duration: 87 },
  // Scene 26 — "How do you break a complex goal into that ordered sequence?" [83.070→85.980]
  s26: { from: 2492, duration: 107 },
  // Scene 27 — "That problem has a name." [86.620→87.800]
  s27: { from: 2599, duration: 49 },
  // Scene 28 — "And we solve it next." [88.260→89.160]
  s28: { from: 2648, duration: 27 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 33 of learning agent AI from first principles.", keyWords: ["day 33", "agent AI", "first principles"], from: 0, duration: 169 },
  { text: "Last day, we learned what a trajectory is.", keyWords: ["trajectory"], from: 169, duration: 82 },
  { text: "The complete sequence of actions and observations from task start to task end.", keyWords: ["actions", "observations", "task start", "task end"], from: 251, duration: 144 },
  { text: "Today, we define the step.", keyWords: ["step"], from: 395, duration: 79 },
  { text: "A step is one complete iteration of the agent loop.", keyWords: ["step", "iteration", "agent loop"], from: 474, duration: 115 },
  { text: "One observation in, one action out.", keyWords: ["observation", "action"], from: 589, duration: 85 },
  { text: "That is the atomic unit of agent execution.", keyWords: ["atomic unit", "execution"], from: 674, duration: 109 },
  { text: "Search results arrive. That is the observation.", keyWords: ["observation", "search"], from: 783, duration: 71 },
  { text: "Call the document reader. That is the action.", keyWords: ["action", "document reader"], from: 854, duration: 106 },
  { text: "One step complete. Move to the next.", keyWords: ["step", "complete"], from: 960, duration: 91 },
  { text: "Complex tasks require dozens of steps.", keyWords: ["dozens", "steps"], from: 1051, duration: 85 },
  { text: "Sometimes hundreds.", keyWords: ["hundreds"], from: 1136, duration: 49 },
  { text: "The entire trajectory is a chain of steps.", keyWords: ["trajectory", "chain", "steps"], from: 1185, duration: 94 },
  { text: "Each one a small, controlled exchange between the agent and its environment.", keyWords: ["controlled exchange", "agent", "environment"], from: 1279, duration: 148 },
  { text: "The value of thinking in steps is what each boundary gives you.", keyWords: ["thinking in steps", "boundary"], from: 1427, duration: 129 },
  { text: "Each step is independently auditable.", keyWords: ["independently", "auditable"], from: 1556, duration: 75 },
  { text: "Was this decision correct given this input?", keyWords: ["decision", "correct", "input"], from: 1631, duration: 86 },
  { text: "Each step is individually cost measurable.", keyWords: ["cost", "measurable"], from: 1717, duration: 87 },
  { text: "One model call, one tool call, tokens counted.", keyWords: ["model call", "tool call", "tokens"], from: 1804, duration: 109 },
  { text: "Each step is separately retriable.", keyWords: ["separately", "retriable"], from: 1913, duration: 80 },
  { text: "If step 17 fails, you retry step 17.", keyWords: ["step 17", "retry"], from: 1993, duration: 103 },
  { text: "Not the entire task from the beginning.", keyWords: ["entire task", "beginning"], from: 2096, duration: 88 },
  { text: "Reliability is engineered at the step level. Not the task level.", keyWords: ["reliability", "step level", "task level"], from: 2184, duration: 135 },
  { text: "One large goal produces many steps.", keyWords: ["goal", "many steps"], from: 2319, duration: 86 },
  { text: "But those steps need to arrive in the right order.", keyWords: ["right order"], from: 2405, duration: 87 },
  { text: "How do you break a complex goal into that ordered sequence?", keyWords: ["complex goal", "ordered sequence"], from: 2492, duration: 107 },
  { text: "That problem has a name.", keyWords: ["name"], from: 2599, duration: 49 },
  { text: "And we solve it next.", keyWords: ["next"], from: 2648, duration: 27 },
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
