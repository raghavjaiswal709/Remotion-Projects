/**
 * Day 35 — "Agent vs. Pipeline"
 * Series: Agentic AI
 * Audio file: public/audio/Day 35.wav
 * Audio duration: 79.600s → 2388 frames @ 30fps
 * Total composition: 2388 frames
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

// ── Scene timing ─────────────────────────────────────────────────────────────
// Audio starts at frame 0 — scene froms = Math.round(csv_start_seconds * 30)
// TOTAL_FRAMES = Math.ceil(79.600 * 30) = 2388
export const SCENE_TIMING = {
  // Scene 01 — "This is day 35 of learning agent AI from first principles." [0.000s → 5.200s]
  s01: { from: 0,    duration: 156 },
  // Scene 02 — "Last day, we learned task decomposition," [5.200s → 8.067s]
  s02: { from: 156,  duration: 86  },
  // Scene 03 — "breaking a large goal into a sequence of smaller sub-tasks..." [8.067s → 14.233s]
  s03: { from: 242,  duration: 185 },
  // Scene 04 — "Today, we draw a distinction that shapes every system design decision..." [14.233s → 19.967s]
  s04: { from: 427,  duration: 172 },
  // Scene 05 — "The difference between an agent and a pipeline." [19.967s → 23.133s]
  s05: { from: 599,  duration: 95  },
  // Scene 06 — "A pipeline is a fixed sequence of steps designed before execution begins." [23.133s → 28.733s]
  s06: { from: 694,  duration: 168 },
  // Scene 07 — "Step 1. Search." [28.733s → 31.100s]
  s07: { from: 862,  duration: 71  },
  // Scene 08 — "Step 2. Read. Step 3. Summaries." [31.100s → 34.433s]
  s08: { from: 933,  duration: 100 },
  // Scene 09 — "Regardless of what the search returns," [34.433s → 36.533s]
  s09: { from: 1033, duration: 63  },
  // Scene 10 — "regardless of what the reading reveals," [36.533s → 38.633s]
  s10: { from: 1096, duration: 73  },
  // Scene 11 — "the pipeline executes the same steps in the same order." [38.633s → 42.633s]
  s11: { from: 1169, duration: 120 },
  // Scene 12 — "An agent decides its own sequence at runtime based on what it observes." [42.633s → 47.833s]
  s12: { from: 1289, duration: 156 },
  // Scene 13 — "If the search returns nothing useful, the agent tries a different query." [47.833s → 52.033s]
  s13: { from: 1445, duration: 126 },
  // Scene 14 — "If the document is irrelevant, the agent skips it and fetches another." [52.033s → 55.467s]
  s14: { from: 1571, duration: 103 },
  // Scene 15 — "If the task needs six steps instead of three, the agent adds them." [55.467s → 60.867s]
  s15: { from: 1674, duration: 162 },
  // Scene 16 — "The pipeline is rigid, the agent is adaptive." [60.867s → 64.567s]
  s16: { from: 1836, duration: 111 },
  // Scene 17 — "Both can decompose a goal into steps," [64.567s → 67.200s]
  s17: { from: 1947, duration: 79  },
  // Scene 18 — "only one can respond to what it actually finds along the way." [67.200s → 71.300s]
  s18: { from: 2026, duration: 123 },
  // Scene 19 — "An adaptation at scale requires something the pipeline never needs." [71.300s → 75.500s]
  s19: { from: 2149, duration: 126 },
  // Scene 20 — "It requires memory. That is exactly what we build next." [75.500s → 79.600s]
  s20: { from: 2275, duration: 113 },
} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 35 of learning agent AI from first principles.", keyWords: ["35", "agent", "AI"], from: 0, duration: 156 },
  { text: "Last day, we learned task decomposition,", keyWords: ["task", "decomposition"], from: 156, duration: 86 },
  { text: "breaking a large goal into a sequence of smaller sub-tasks the agent can execute step by step.", keyWords: ["goal", "sub-tasks", "agent"], from: 242, duration: 185 },
  { text: "Today, we draw a distinction that shapes every system design decision you will ever make.", keyWords: ["distinction", "system", "design"], from: 427, duration: 172 },
  { text: "The difference between an agent and a pipeline.", keyWords: ["agent", "pipeline"], from: 599, duration: 95 },
  { text: "A pipeline is a fixed sequence of steps designed by a human before execution begins.", keyWords: ["pipeline", "fixed", "sequence"], from: 694, duration: 168 },
  { text: "Step 1. Search.", keyWords: ["Search"], from: 862, duration: 71 },
  { text: "Step 2. Read. Step 3. Summarize.", keyWords: ["Read", "Summarize"], from: 933, duration: 100 },
  { text: "Regardless of what the search returns,", keyWords: ["search"], from: 1033, duration: 63 },
  { text: "regardless of what the reading reveals,", keyWords: ["reading"], from: 1096, duration: 73 },
  { text: "the pipeline executes the same steps in the same order.", keyWords: ["pipeline", "same", "order"], from: 1169, duration: 120 },
  { text: "An agent decides its own sequence at runtime based on what it observes.", keyWords: ["agent", "runtime", "observes"], from: 1289, duration: 156 },
  { text: "If the search returns nothing useful, the agent tries a different query.", keyWords: ["agent", "query"], from: 1445, duration: 126 },
  { text: "If the document is irrelevant, the agent skips it and fetches another.", keyWords: ["agent", "skips", "fetches"], from: 1571, duration: 103 },
  { text: "If the task needs six steps instead of three, the agent adds them.", keyWords: ["six", "agent", "adds"], from: 1674, duration: 162 },
  { text: "The pipeline is rigid, the agent is adaptive.", keyWords: ["rigid", "adaptive"], from: 1836, duration: 111 },
  { text: "Both can decompose a goal into steps,", keyWords: ["decompose", "goal"], from: 1947, duration: 79 },
  { text: "only one can respond to what it actually finds along the way.", keyWords: ["respond", "finds"], from: 2026, duration: 123 },
  { text: "An adaptation at scale requires something the pipeline never needs.", keyWords: ["adaptation", "scale", "pipeline"], from: 2149, duration: 126 },
  { text: "It requires memory. That is exactly what we build next.", keyWords: ["memory", "build"], from: 2275, duration: 113 },
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
