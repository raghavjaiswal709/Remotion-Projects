/**
 * Day 24 — "The Agent Loop"
 * style_pencil_art_AI — Premium Colored Pencil AI Explainer
 *
 * All frame numbers derived directly from the word-by-word CSV timestamps.
 * Audio duration: 0.000s → 67.460s ≈ 2024 frames at 30fps
 * Total composition: 2250 frames (75 seconds incl. day card + outro)
 *
 * SCENE MAP — 25 scenes covering the EXACT speech timestamps
 * ─────────────────────────────────────────────────────────────────
 * CSV t=0 starts at frame 0 (audio plays from frame 0, no offset)
 * All frame values = Math.round(time_in_seconds * 30)
 */

export const FPS = 30;

// ── Design tokens ──────────────────────────────────────────────────────────
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

// ── Scene timing: from & duration ──────────────────────────────────────────
export const SCENE_TIMING = {
  // Scene 01 — Day Card (pre-audio title card)
  // 0s → 2.7s
  s01: { from: 0,    duration: 81  },

  // Scene 02 — "This is day 24 of learning Agentic AI from first principles."
  // words 1-11: 0.000s → 4.460s
  s02: { from: 0,    duration: 134 },

  // Scene 03 — "Last day, we learned that a model alone is not an agent."
  // words 12-23: 5.080s → 8.460s
  s03: { from: 152,  duration: 102 },

  // Scene 04 — "The agent loop is the heartbeat of every agentic AI system ever built."
  // words 24-36: 8.900s → 13.560s
  s04: { from: 267,  duration: 140 },

  // Scene 05 — "It has four steps."
  // words 37-40: 14.080s → 15.160s
  s05: { from: 422,  duration: 33  },

  // Scene 06 — "Perceive, think, act, observe, then repeat."
  // words 41-46: 15.680s → 19.440s
  s06: { from: 470,  duration: 113 },

  // Scene 07 — "The agent takes in information about the world. That is perceive."
  // words 47-57: 20.240s → 23.880s
  s07: { from: 607,  duration: 109 },

  // Scene 08 — "It reasons about what to do next. That is think."
  // words 58-67: 24.400s → 27.220s
  s08: { from: 732,  duration: 85  },

  // Scene 09 — "It calls a tool or produces an output. That is act."
  // words 68-78: 27.220s → 31.400s
  s09: { from: 817,  duration: 126 },

  // Scene 10 — "It receives the result of that action back. That is observe."
  // words 79-89: 31.920s → 35.700s
  s10: { from: 958,  duration: 114 },

  // Scene 11 — "Then it runs the loop again from the beginning."
  // words 90-98: 36.300s → 38.340s
  s11: { from: 1089, duration: 62  },

  // Scene 12 — "This is not a metaphor."
  // words 99-103: 39.000s → 40.140s
  s12: { from: 1170, duration: 42  },

  // Scene 13 — "It is the literal execution sequence inside every production agentic system in existence."
  // words 104-116: 40.700s → 46.040s
  s13: { from: 1221, duration: 161 },

  // Scene 14 — "A single model call moves in one direction. Input to output."
  // words 117-127: 46.760s → 51.040s
  s14: { from: 1403, duration: 128 },

  // Scene 15 — "The loop moves in a circle."
  // words 128-133: 51.620s → 53.120s
  s15: { from: 1549, duration: 45  },

  // Scene 16 — "That circle is what separates a model from an agent."
  // words 134-143: 53.720s → 56.640s
  s16: { from: 1612, duration: 88  },

  // Scene 17 — "Every concept in this series, memory, planning, tools, multi-agent systems..."
  // words 144-154: 56.640s → 62.880s
  s17: { from: 1699, duration: 187 },

  // Scene 18 — "...exists to make this loop more capable."
  // words 155-161: 63.120s → 65.520s
  s18: { from: 1894, duration: 72  },

  // Scene 19 — "The loop is everything."
  // words 162-165: 66.120s → 67.460s
  s19: { from: 1984, duration: 56  },

  // Scene 20 — Key Takeaway (paper, ink, bold — post-audio recap)
  s20: { from: 2040, duration: 120 },

  // Scene 21 — Outro (paper, ink — social CTA + series branding)
  s21: { from: 2160, duration: 90  },
} as const;

// ── Caption lines ─────────────────────────────────────────────────────────
export const CAPTIONS = [
  { text: "This is day 24 of learning agentic AI from first principles.", from: 0, duration: 134 },
  { text: "Last day, we learned that a model alone is not an agent.", from: 152, duration: 102 },
  { text: "The agent loop is the heartbeat of every agentic AI system ever built.", from: 267, duration: 140 },
  { text: "It has four steps.", from: 422, duration: 33 },
  { text: "Perceive, think, act, observe, then repeat.", from: 470, duration: 113 },
  { text: "The agent takes in information about the world. That is perceive.", from: 607, duration: 109 },
  { text: "It reasons about what to do next. That is think.", from: 732, duration: 85 },
  { text: "It calls a tool or produces an output. That is act.", from: 817, duration: 126 },
  { text: "It receives the result of that action back. That is observe.", from: 958, duration: 114 },
  { text: "Then it runs the loop again from the beginning.", from: 1089, duration: 62 },
  { text: "This is not a metaphor.", from: 1170, duration: 42 },
  { text: "It is the literal execution sequence inside every production agentic system.", from: 1221, duration: 161 },
  { text: "A single model call moves in one direction. Input to output.", from: 1403, duration: 128 },
  { text: "The loop moves in a circle.", from: 1549, duration: 45 },
  { text: "That circle separates a model from an agent.", from: 1612, duration: 88 },
  { text: "Every concept in this series exists to make this loop more capable.", from: 1699, duration: 187 },
  { text: "The loop is everything.", from: 1984, duration: 42 },
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
