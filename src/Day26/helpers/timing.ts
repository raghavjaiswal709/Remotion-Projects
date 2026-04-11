/**
 * Day 26 — "Observations"
 * style_pencil_art_AI — Premium Colored Pencil AI Explainer
 *
 * Audio duration: 0.000s → 66.380s ≈ 1992 frames at 30fps
 * Total composition: 2200 frames (~73.3 seconds incl. day card + outro)
 *
 * SCENE MAP — 25 scenes
 */

export const FPS = 30;

export const COLORS = {
  bg_paper:       '#F5F0E8',
  bg_black:       '#0D0D0D',
  electric_cyan:  '#00E5FF',
  deep_black:     '#0D0D0D',
  warm_blue:      '#3B82F6',
  cool_silver:    '#C8D0D4',
  light_gray:     '#B0B8BD',
  soft_white:     '#F9FAFB',
  vibrant_red:    '#EF4444',
  vibrant_green:  '#22C55E',
  amber:          '#F59E0B',
  purple:         '#A78BFA',
  text_day:       '#C8D0D4',
  text_title:     '#3B82F6',
  text_series:    '#6B7280',
  text_caption:   '#0D0D0D',
  text_override:  '#C8D0D4',
} as const;

export const SCENE_TIMING = {
  // Scene 01 — Day Card
  s01: { from: 0,    duration: 81  },

  // Scene 02 — "This is day 26 of learning agent AI from first principles."
  // words 1-11: 0.000s → 4.480s
  s02: { from: 0,    duration: 134 },

  // Scene 03 — "Last day, we learned what an action is."
  // words 12-19: 5.080s → 7.300s
  s03: { from: 152,  duration: 67  },

  // Scene 04 — "An observation is the results of an action."
  // words 20-27: 7.720s → 10.200s
  s04: { from: 232,  duration: 75  },

  // Scene 05 — "Return to the agent as new input for the next loop iteration."
  // words 28-39: 10.620s → 14.200s
  s05: { from: 319,  duration: 108 },

  // Scene 06 — "The agent called a search API. The results come back. That is an observation."
  // words 40-53: 14.860s → 19.680s
  s06: { from: 446,  duration: 145 },

  // Scene 07 — "The agent wrote a file. The success confirmation comes back. That is an observation."
  // words 54-67: 20.240s → 25.160s
  s07: { from: 607,  duration: 148 },

  // Scene 08 — "The agent ran a database query. The returned rows come back. That is an observation."
  // words 68-82: 25.760s → 31.300s
  s08: { from: 773,  duration: 166 },

  // Scene 09 — "The observation is the world's reply to the agent's action."
  // words 83-92: 31.960s → 35.380s
  s09: { from: 959,  duration: 103 },

  // Scene 10 — "Without observations, the agent acts blindly."
  // words 93-98: 35.920s → 38.720s
  s10: { from: 1078, duration: 84  },

  // Scene 11 — "It has no way to know whether its action succeeded, no way to adapt, no way to change course based on what it finds."
  // words 99-122: 39.220s → 46.000s
  s11: { from: 1177, duration: 203 },

  // Scene 12 — "The loop is perceive, think, act, observe."
  // words 123-129: 46.560s → 50.120s
  s12: { from: 1397, duration: 107 },

  // Scene 13 — "Observations feed directly back into the perceived step."
  // words 130-137: 50.760s → 54.020s
  s13: { from: 1523, duration: 98  },

  // Scene 14 — "This is what makes the loop a loop rather than a straight line."
  // words 138-150: 54.020s → 57.600s
  s14: { from: 1621, duration: 107 },

  // Scene 15 — "Every piece of knowledge the agent builds up during a task arrives through observations."
  // words 151-164: 58.100s → 63.080s
  s15: { from: 1743, duration: 149 },

  // Scene 16 — "Take away observations and the loop goes dark."
  // words 165-172: 63.740s → 66.380s
  s16: { from: 1912, duration: 80  },

  // Scene 17 — Key Takeaway (paper, ink, bold — post-audio recap)
  s17: { from: 1992, duration: 120 },

  // Scene 18 — Outro (paper, ink — social CTA + series branding)
  s18: { from: 2112, duration: 88  },
} as const;

export const CAPTIONS = [
  { text: "This is day 26 of learning agent AI from first principles.", from: 0, duration: 134 },
  { text: "Last day, we learned what an action is.", from: 152, duration: 67 },
  { text: "An observation is the result of an action.", from: 232, duration: 75 },
  { text: "Returned to the agent as new input for the next loop iteration.", from: 319, duration: 108 },
  { text: "The agent called a search API. The results come back. That is an observation.", from: 446, duration: 145 },
  { text: "The agent wrote a file. The success confirmation comes back.", from: 607, duration: 148 },
  { text: "The agent ran a database query. The returned rows come back.", from: 773, duration: 166 },
  { text: "The observation is the world's reply to the agent's action.", from: 959, duration: 103 },
  { text: "Without observations, the agent acts blindly.", from: 1078, duration: 84 },
  { text: "No way to adapt, no way to change course.", from: 1177, duration: 203 },
  { text: "The loop is perceive, think, act, observe.", from: 1397, duration: 107 },
  { text: "Observations feed directly back into the perceive step.", from: 1523, duration: 98 },
  { text: "This makes the loop a loop rather than a straight line.", from: 1621, duration: 107 },
  { text: "Every piece of knowledge arrives through observations.", from: 1743, duration: 149 },
  { text: "Take away observations and the loop goes dark.", from: 1912, duration: 80 },
] as const;

// ── Animation helpers ──────────────────────────────────────────────────────
export const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
export const fadeIn = (frame: number, start: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - start) / dur));
export const fadeOut = (frame: number, start: number, dur: number): number =>
  1 - Math.min(1, Math.max(0, (frame - start) / dur));
export const easeSnap = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const drawPath = (frame: number, start: number, dur: number, totalLength: number): number => {
  const t = Math.max(0, Math.min(1, (frame - start) / dur));
  return totalLength * (1 - easeSnap(t));
};
export const scaleAnim = (frame: number, start: number, dur: number, from: number, to: number): number => {
  const t = Math.max(0, Math.min(1, (frame - start) / dur));
  return lerp(from, to, easeSnap(t));
};
