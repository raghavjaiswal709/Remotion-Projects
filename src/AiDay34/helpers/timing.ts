/**
 * Day 34 — "What Is Task Decomposition?"
 * Series: Agentic AI
 * Audio file: public/audio/Day 34.wav
 * Audio duration: 81.860s → 2456 frames @ 30fps
 * Total composition: 2456 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — Agentic AI ────────────────────────────────────────────────
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

// ── Scene timing ──────────────────────────────────────────────────────────────
// 22 content scenes — audio starts frame 0 (csv_start * 30 = from)
// TOTAL_FRAMES = ceil(81.860 * 30) = 2456
export const SCENE_TIMING = {
  // Scene 01 — "This is day 34 of learning agent AI from first principles." [0.000→4.900s]
  s01: { from: 0, duration: 162 },
  // Scene 02 — "Last day, we learned what a step is." [5.400→7.580s]
  s02: { from: 162, duration: 79 },
  // Scene 03 — "One complete iteration of the agent loop, one observation in, one action out." [8.040→12.880s]
  s03: { from: 241, duration: 166 },
  // Scene 04 — "Today, we go one level up." [13.560→15.200s]
  s04: { from: 407, duration: 68 },
  // Scene 05 — "What happens when the goal is too large to fit in a single step?" [15.820→19.320s]
  s05: { from: 475, duration: 127 },
  // Scene 06 — "Task decomposition. A large goal," [20.060→22.680s]
  s06: { from: 602, duration: 91 },
  // Scene 07 — "right, a market research report on electric vehicles, cannot happen in one action." [23.100→27.760s]
  s07: { from: 693, duration: 140 },
  // Scene 08 — "The model cannot search, read, analyze, and synthesize simultaneously in a single step." [27.760→33.760s]
  s08: { from: 833, duration: 199 },
  // Scene 09 — "Decomposition breaks that goal into smaller sub tasks." [34.400→37.500s]
  s09: { from: 1032, duration: 112 },
  // Scene 10 — "Search for recent industry data." [38.120→39.780s]
  s10: { from: 1144, duration: 66 },
  // Scene 11 — "Read each source, extract key statistics," [40.320→42.980s]
  s11: { from: 1210, duration: 97 },
  // Scene 12 — "identify trends, draft each section, review, and finalize." [43.560→47.560s]
  s12: { from: 1307, duration: 132 },
  // Scene 13 — "Each sub task is achievable in one step or a small number of steps." [47.980→52.020s]
  s13: { from: 1439, duration: 132 },
  // Scene 14 — "Together, they complete the original goal." [52.360→54.380s]
  s14: { from: 1571, duration: 77 },
  // Scene 15 — "The model generates this breakdown itself." [54.940→57.060s]
  s15: { from: 1648, duration: 64 },
  // Scene 16 — "Reasoning about what the goal requires, what order the sub tasks must follow," [57.060→61.620s]
  s16: { from: 1712, duration: 144 },
  // Scene 17 — "and which sub tasks depend on each other's output." [61.880→64.420s]
  s17: { from: 1856, duration: 102 },
  // Scene 18 — "Decomposition is what separates tasks an agent can complete," [65.280→68.300s]
  s18: { from: 1958, duration: 105 },
  // Scene 19 — "from tasks an agent can only attempt." [68.780→70.540s]
  s19: { from: 2063, duration: 75 },
  // Scene 20 — "But here is the question underneath all of this." [71.260→73.560s]
  s20: { from: 2138, duration: 84 },
  // Scene 21 — "Is a fixed sequence of steps really an agent, or is it something else entirely?" [74.060→78.740s]
  s21: { from: 2222, duration: 161 },
  // Scene 22 — "That distinction is exactly what we explore next." [79.440→81.860s]
  s22: { from: 2383, duration: 73 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 34 of learning agent AI from first principles.", keyWords: ["day 34", "agent AI", "first principles"], from: 0, duration: 162 },
  { text: "Last day, we learned what a step is.", keyWords: ["step"], from: 162, duration: 79 },
  { text: "One complete iteration of the agent loop, one observation in, one action out.", keyWords: ["iteration", "agent loop", "observation", "action"], from: 241, duration: 166 },
  { text: "Today, we go one level up.", keyWords: ["one level up"], from: 407, duration: 68 },
  { text: "What happens when the goal is too large to fit in a single step?", keyWords: ["goal", "single step"], from: 475, duration: 127 },
  { text: "Task decomposition. A large goal,", keyWords: ["task decomposition"], from: 602, duration: 91 },
  { text: "right, a market research report on electric vehicles, cannot happen in one action.", keyWords: ["market research", "one action"], from: 693, duration: 140 },
  { text: "The model cannot search, read, analyze, and synthesize simultaneously in a single step.", keyWords: ["search", "analyze", "synthesize", "single step"], from: 833, duration: 199 },
  { text: "Decomposition breaks that goal into smaller sub tasks.", keyWords: ["decomposition", "sub tasks"], from: 1032, duration: 112 },
  { text: "Search for recent industry data.", keyWords: ["search", "industry data"], from: 1144, duration: 66 },
  { text: "Read each source, extract key statistics,", keyWords: ["extract", "statistics"], from: 1210, duration: 97 },
  { text: "identify trends, draft each section, review, and finalize.", keyWords: ["trends", "draft", "finalize"], from: 1307, duration: 132 },
  { text: "Each sub task is achievable in one step or a small number of steps.", keyWords: ["sub task", "achievable", "steps"], from: 1439, duration: 132 },
  { text: "Together, they complete the original goal.", keyWords: ["complete", "goal"], from: 1571, duration: 77 },
  { text: "The model generates this breakdown itself.", keyWords: ["model", "breakdown"], from: 1648, duration: 64 },
  { text: "Reasoning about what the goal requires, what order the sub tasks must follow,", keyWords: ["reasoning", "order", "sub tasks"], from: 1712, duration: 144 },
  { text: "and which sub tasks depend on each other's output.", keyWords: ["depend", "output"], from: 1856, duration: 102 },
  { text: "Decomposition is what separates tasks an agent can complete,", keyWords: ["decomposition", "separates"], from: 1958, duration: 105 },
  { text: "from tasks an agent can only attempt.", keyWords: ["attempt"], from: 2063, duration: 75 },
  { text: "But here is the question underneath all of this.", keyWords: ["question"], from: 2138, duration: 84 },
  { text: "Is a fixed sequence of steps really an agent, or is it something else entirely?", keyWords: ["fixed sequence", "agent"], from: 2222, duration: 161 },
  { text: "That distinction is exactly what we explore next.", keyWords: ["distinction"], from: 2383, duration: 73 },
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
