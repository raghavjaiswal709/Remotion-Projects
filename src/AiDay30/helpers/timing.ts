/**
 * Day 30 — "What Is a Task?"
 * Series: Agentic AI
 * Audio file: public/audio/AI day 30.wav
 * Audio duration: 77.42s → 2323 frames @ 30fps
 * Total composition: 2323 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — AI series ────────────────────────────────────────────────
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
// Audio starts at frame 0 — scene from = Math.round(csv_start_seconds * 30)
// 23 content scenes, TOTAL_FRAMES = 2323
export const SCENE_TIMING = {
  // Scene 01 — "This is Day 30 of learning agent AI from first principles." [0.000s → 4.800s]
  s01: { from: Math.round(0.000 * 30), duration: Math.round(5.360 * 30) - Math.round(0.000 * 30) },

  // Scene 02 — "Last day, we learned what an agent runtime is." [5.360s → 8.480s]
  s02: { from: Math.round(5.360 * 30), duration: Math.round(8.860 * 30) - Math.round(5.360 * 30) },

  // Scene 03 — "The code that wraps the model and executes the loop." [8.860s → 11.580s]
  s03: { from: Math.round(8.860 * 30), duration: Math.round(12.200 * 30) - Math.round(8.860 * 30) },

  // Scene 04 — "Today, we define the task." [12.200s → 14.320s]
  s04: { from: Math.round(12.200 * 30), duration: Math.round(15.020 * 30) - Math.round(12.200 * 30) },

  // Scene 05 — "A task is a goal with three required components." [15.020s → 18.320s]
  s05: { from: Math.round(15.020 * 30), duration: Math.round(18.920 * 30) - Math.round(15.020 * 30) },

  // Scene 06 — "A start state, a desired end state," [18.920s → 21.140s]
  s06: { from: Math.round(18.920 * 30), duration: Math.round(21.380 * 30) - Math.round(18.920 * 30) },

  // Scene 07 — "and a measurable success criterion." [21.380s → 23.360s]
  s07: { from: Math.round(21.380 * 30), duration: Math.round(24.020 * 30) - Math.round(21.380 * 30) },

  // Scene 08 — "Without all three, the agent cannot determine when it has succeeded." [24.020s → 27.780s]
  s08: { from: Math.round(24.020 * 30), duration: Math.round(27.780 * 30) - Math.round(24.020 * 30) },

  // Scene 09 — "Here is a complete task." [27.780s → 30.180s]
  s09: { from: Math.round(27.780 * 30), duration: Math.round(30.860 * 30) - Math.round(27.780 * 30) },

  // Scene 10 — "Find the three cheapest flights from Delhi to London next Tuesday." [30.860s → 34.320s]
  s10: { from: Math.round(30.860 * 30), duration: Math.round(34.820 * 30) - Math.round(30.860 * 30) },

  // Scene 11 — "And book the one with the shortest layover." [34.820s → 36.660s]
  s11: { from: Math.round(34.820 * 30), duration: Math.round(37.380 * 30) - Math.round(34.820 * 30) },

  // Scene 12 — "Start state, no booking exists." [37.380s → 39.180s]
  s12: { from: Math.round(37.380 * 30), duration: Math.round(39.940 * 30) - Math.round(37.380 * 30) },

  // Scene 13 — "End state, one confirmed ticket." [39.940s → 41.960s]
  s13: { from: Math.round(39.940 * 30), duration: Math.round(42.640 * 30) - Math.round(39.940 * 30) },

  // Scene 14 — "Success criterion, cheapest three candidates, shortest layover selected." [42.640s → 46.560s]
  s14: { from: Math.round(42.640 * 30), duration: Math.round(47.360 * 30) - Math.round(42.640 * 30) },

  // Scene 15 — "Every part is precise." [47.360s → 48.700s]
  s15: { from: Math.round(47.360 * 30), duration: Math.round(49.620 * 30) - Math.round(47.360 * 30) },

  // Scene 16 — "Now here is not a task." [49.620s → 51.320s]
  s16: { from: Math.round(49.620 * 30), duration: Math.round(51.920 * 30) - Math.round(49.620 * 30) },

  // Scene 17 — "Help me with flights. There is no end state." [51.920s → 54.520s]
  s17: { from: Math.round(51.920 * 30), duration: Math.round(54.900 * 30) - Math.round(51.920 * 30) },

  // Scene 18 — "There is no criterion. The agent has no way to know when it is done." [54.900s → 59.060s]
  s18: { from: Math.round(54.900 * 30), duration: Math.round(59.800 * 30) - Math.round(54.900 * 30) },

  // Scene 19 — "The planner, the halt condition, the evaluator," [59.800s → 62.640s]
  s19: { from: Math.round(59.800 * 30), duration: Math.round(62.940 * 30) - Math.round(59.800 * 30) },

  // Scene 20 — "every layer of the agentic system depends on the task being precisely defined." [62.940s → 67.720s]
  s20: { from: Math.round(62.940 * 30), duration: Math.round(68.420 * 30) - Math.round(62.940 * 30) },

  // Scene 21 — "Vague task in, vague agent behavior out." [68.420s → 71.220s]
  s21: { from: Math.round(68.420 * 30), duration: Math.round(71.620 * 30) - Math.round(68.420 * 30) },

  // Scene 22 — "How much of this the agent handles alone," [71.620s → 74.020s]
  s22: { from: Math.round(71.620 * 30), duration: Math.round(74.380 * 30) - Math.round(71.620 * 30) },

  // Scene 23 — "without stopping to ask you, is the question we answer next." [74.380s → 77.420s]
  s23: { from: Math.round(74.380 * 30), duration: 2323 - Math.round(74.380 * 30) },
} as const;

// ── Captions ─────────────────────────────────────────────────────────────────
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is Day 30 of learning agent AI from first principles.", keyWords: ["Day 30", "agent AI"], from: SCENE_TIMING.s01.from, duration: SCENE_TIMING.s01.duration },
  { text: "Last day, we learned what an agent runtime is.", keyWords: ["agent runtime"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "The code that wraps the model and executes the loop.", keyWords: ["model", "loop"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Today, we define the task.", keyWords: ["task"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "A task is a goal with three required components.", keyWords: ["task", "goal", "three"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "A start state, a desired end state,", keyWords: ["start state", "end state"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "and a measurable success criterion.", keyWords: ["measurable", "success criterion"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "Without all three, the agent cannot determine when it has succeeded.", keyWords: ["three", "succeeded"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Here is a complete task.", keyWords: ["complete task"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "Find the three cheapest flights from Delhi to London next Tuesday.", keyWords: ["three", "cheapest", "Delhi", "London"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "And book the one with the shortest layover.", keyWords: ["shortest", "layover"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "Start state, no booking exists.", keyWords: ["Start state", "no booking"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "End state, one confirmed ticket.", keyWords: ["End state", "confirmed ticket"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "Success criterion, cheapest three candidates, shortest layover selected.", keyWords: ["Success criterion", "cheapest", "shortest"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "Every part is precise.", keyWords: ["precise"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "Now here is not a task.", keyWords: ["not a task"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "Help me with flights. There is no end state.", keyWords: ["no end state"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
  { text: "There is no criterion. The agent has no way to know when it is done.", keyWords: ["no criterion", "done"], from: SCENE_TIMING.s18.from, duration: SCENE_TIMING.s18.duration },
  { text: "The planner, the halt condition, the evaluator,", keyWords: ["planner", "halt condition", "evaluator"], from: SCENE_TIMING.s19.from, duration: SCENE_TIMING.s19.duration },
  { text: "every layer of the agentic system depends on the task being precisely defined.", keyWords: ["agentic system", "precisely defined"], from: SCENE_TIMING.s20.from, duration: SCENE_TIMING.s20.duration },
  { text: "Vague task in, vague agent behavior out.", keyWords: ["Vague"], from: SCENE_TIMING.s21.from, duration: SCENE_TIMING.s21.duration },
  { text: "How much of this the agent handles alone,", keyWords: ["agent", "alone"], from: SCENE_TIMING.s22.from, duration: SCENE_TIMING.s22.duration },
  { text: "without stopping to ask you, is the question we answer next.", keyWords: ["question", "next"], from: SCENE_TIMING.s23.from, duration: SCENE_TIMING.s23.duration },
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
