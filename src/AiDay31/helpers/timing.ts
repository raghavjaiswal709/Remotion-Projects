/**
 * Day 31 — "What Is Autonomy?"
 * Series: Agentic AI
 * Audio file: public/audio/AI day 31.wav
 * Audio duration: 88.620s → 2659 frames @ 30fps
 * Total composition: 2659 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Agentic AI ───────────────────────────────────────────────
const SERIES_ACCENT = '#76ABAE';
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174;

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
// Audio starts at frame 0. TOTAL_FRAMES = 2659
export const SCENE_TIMING = {
  // Scene 01 — "This is day 31 of learning agent AI from first principles." [0.000s → 4.860s]
  s01: { from: 0, duration: 161 },
  // Scene 02 — "Last day, we learned what a task is," [5.380s → 7.880s]
  s02: { from: 161, duration: 84 },
  // Scene 03 — "a goal with a start state, an end state," [8.160s → 10.600s]
  s03: { from: 245, duration: 80 },
  // Scene 04 — "and a measurable success criterion." [10.840s → 12.460s]
  s04: { from: 325, duration: 73 },
  // Scene 05 — "Today, we define autonomy." [13.260s → 15.260s]
  s05: { from: 398, duration: 86 },
  // Scene 06 — "Autonomy is not on or off. It is a spectrum." [16.140s → 19.380s]
  s06: { from: 484, duration: 118 },
  // Scene 07 — "Full autonomy. The agent decides and acts without asking." [20.060s → 24.040s]
  s07: { from: 602, duration: 140 },
  // Scene 08 — "Zero autonomy. The agent proposes every step and a human approves before anything executes." [24.720s → 30.780s]
  s08: { from: 742, duration: 204 },
  // Scene 09 — "Neither extreme is correct for every task." [31.520s → 34.000s]
  s09: { from: 946, duration: 95 },
  // Scene 10 — "Full autonomy on a task that deletes database records is dangerous." [34.700s → 38.580s]
  s10: { from: 1041, duration: 138 },
  // Scene 11 — "Full human approval on a task that reads 50 documents is pointless," [39.300s → 43.520s]
  s11: { from: 1179, duration: 142 },
  // Scene 12 — "slower than doing it yourself." [44.040s → 45.300s]
  s12: { from: 1321, duration: 66 },
  // Scene 13 — "Real production systems calibrate autonomy to one thing," [46.240s → 49.560s]
  s13: { from: 1387, duration: 112 },
  // Scene 14 — "the reversibility of each action." [49.960s → 51.820s]
  s14: { from: 1499, duration: 81 },
  // Scene 15 — "Reading a file? Autonomous. Summarizing a document? Autonomous." [52.680s → 56.800s]
  s15: { from: 1580, duration: 138 },
  // Scene 16 — "Sending an email to a client? Show the draft. Wait for approval." [57.280s → 61.320s]
  s16: { from: 1718, duration: 144 },
  // Scene 17 — "Deleting a database record? Full stop. Human decides." [62.060s → 65.400s]
  s17: { from: 1862, duration: 128 },
  // Scene 18 — "If the action can be undone, the agent proceeds." [66.320s → 69.060s]
  s18: { from: 1990, duration: 100 },
  // Scene 19 — "If the action cannot be undone, the agent waits." [69.680s → 72.340s]
  s19: { from: 2090, duration: 98 },
  // Scene 20 — "This is the design principle that makes autonomous systems trustworthy, rather than reckless." [72.940s → 77.820s]
  s20: { from: 2188, duration: 171 },
  // Scene 21 — "And every action the agent takes, every step, every decision," [78.620s → 82.360s]
  s21: { from: 2359, duration: 125 },
  // Scene 22 — "from start to finish, forms a complete record." [82.800s → 85.540s]
  s22: { from: 2484, duration: 98 },
  // Scene 23 — "That record has a name, and we define it next." [86.060s → 88.620s]
  s23: { from: 2582, duration: 77 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is Day 31 of learning agent AI from first principles.", keyWords: ["Day 31", "agent AI", "first principles"], from: 0, duration: 161 },
  { text: "Last day, we learned what a task is,", keyWords: ["task"], from: 161, duration: 84 },
  { text: "a goal with a start state, an end state,", keyWords: ["start state", "end state"], from: 245, duration: 80 },
  { text: "and a measurable success criterion.", keyWords: ["success criterion"], from: 325, duration: 73 },
  { text: "Today, we define autonomy.", keyWords: ["autonomy"], from: 398, duration: 86 },
  { text: "Autonomy is not on or off. It is a spectrum.", keyWords: ["spectrum"], from: 484, duration: 118 },
  { text: "Full autonomy. The agent decides and acts without asking.", keyWords: ["Full autonomy", "decides", "acts"], from: 602, duration: 140 },
  { text: "Zero autonomy. The agent proposes every step and a human approves before anything executes.", keyWords: ["Zero autonomy", "proposes", "human approves"], from: 742, duration: 204 },
  { text: "Neither extreme is correct for every task.", keyWords: ["Neither extreme"], from: 946, duration: 95 },
  { text: "Full autonomy on a task that deletes database records is dangerous.", keyWords: ["deletes", "database", "dangerous"], from: 1041, duration: 138 },
  { text: "Full human approval on a task that reads 50 documents is pointless,", keyWords: ["human approval", "50 documents", "pointless"], from: 1179, duration: 142 },
  { text: "slower than doing it yourself.", keyWords: ["slower"], from: 1321, duration: 66 },
  { text: "Real production systems calibrate autonomy to one thing,", keyWords: ["calibrate", "autonomy"], from: 1387, duration: 112 },
  { text: "the reversibility of each action.", keyWords: ["reversibility"], from: 1499, duration: 81 },
  { text: "Reading a file? Autonomous. Summarizing a document? Autonomous.", keyWords: ["Autonomous", "file", "document"], from: 1580, duration: 138 },
  { text: "Sending an email to a client? Show the draft. Wait for approval.", keyWords: ["email", "draft", "approval"], from: 1718, duration: 144 },
  { text: "Deleting a database record? Full stop. Human decides.", keyWords: ["Deleting", "database", "Full stop"], from: 1862, duration: 128 },
  { text: "If the action can be undone, the agent proceeds.", keyWords: ["undone", "proceeds"], from: 1990, duration: 100 },
  { text: "If the action cannot be undone, the agent waits.", keyWords: ["cannot", "undone", "waits"], from: 2090, duration: 98 },
  { text: "This is the design principle that makes autonomous systems trustworthy, rather than reckless.", keyWords: ["design principle", "trustworthy", "reckless"], from: 2188, duration: 171 },
  { text: "And every action the agent takes, every step, every decision,", keyWords: ["action", "step", "decision"], from: 2359, duration: 125 },
  { text: "from start to finish, forms a complete record.", keyWords: ["record"], from: 2484, duration: 98 },
  { text: "That record has a name, and we define it next.", keyWords: ["name", "next"], from: 2582, duration: 77 },
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
