/**
 * Day 27 — "Tools"
 * style_pencil_art_AI — Premium Colored Pencil AI Explainer
 *
 * Audio duration: 0.000s → 79.020s ≈ 2371 frames at 30fps
 * Total composition: 2842 frames (~94.7 seconds incl. day card + outro)
 *
 * SCENE MAP — 17 scenes mapped to exact CSV transcript timestamps.
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
  orange:         '#F97316',
  text_day:       '#C8D0D4',
  text_title:     '#3B82F6',
  text_series:    '#6B7280',
  text_caption:   '#0D0D0D',
  text_override:  '#C8D0D4',
} as const;

export const SCENE_TIMING = {
  // Scene 01 — Day Card (pre-audio title card)
  s01: { from: 0,    duration: 81  },

  // Scene 02 — Introduction "This is day 27 of learning Agentic AI from first principles."
  // words 1–11: 0.000s → 4.720s
  s02: { from: 0,    duration: 142 },

  // Scene 03 — Last Day Recap "Last day, we learned what an observation is."
  // words 12–19: 5.320s → 8.300s
  s03: { from: 160,  duration: 90  },

  // Scene 04 — Tool Defined "A tool is a named callable function that the agent can invoke."
  // words 20–31: 8.860s → 13.340s
  s04: { from: 266,  duration: 134 },

  // Scene 05 — Tool Examples "Search, read file, send email, run an SQL query."
  // words 32–40: 14.100s → 18.880s
  s05: { from: 423,  duration: 144 },

  // Scene 06 — Precise Capability "Each of these is a tool, a precise bounded capability the agent can choose to use."
  // words 41–56: 19.600s → 25.820s
  s06: { from: 588,  duration: 187 },

  // Scene 07 — Model Generates Text "The language model never directly executes anything. It generates text."
  // words 57–66: 25.820s → 31.380s
  s07: { from: 775,  duration: 167 },

  // Scene 08 — Tool Call Defined "A tool call is a structured piece of text that says call this function with these arguments."
  // words 67–83: 31.900s → 38.120s
  s08: { from: 957,  duration: 187 },

  // Scene 09 — Runtime Executes "The runtime reads that output. It runs the actual function and returns the result as the next observation."
  // words 84–102: 38.800s → 45.860s
  s09: { from: 1164, duration: 212 },

  // Scene 10 — Model Decides, Tool Does "The model decides, the tool does."
  // words 103–108: 46.520s → 49.080s
  s10: { from: 1396, duration: 77  },

  // Scene 11 — Separation Matters "This separation matters deeply. The model's job is reasoning, choosing which tool with what arguments at what point in the task."
  // words 109–129: 50.140s → 59.400s
  s11: { from: 1504, duration: 278 },

  // Scene 12 — Tool's Job: Execution "The tool's job is execution, doing the actual work in the real world."
  // words 130–142: 59.980s → 65.400s
  s12: { from: 1799, duration: 162 },

  // Scene 13 — Search Tool "A search tool connects the agent to current information."
  // words 143–151: 66.080s → 69.060s
  s13: { from: 1982, duration: 89  },

  // Scene 14 — Code Tool "A code tool gives it precise calculation."
  // words 152–158: 69.580s → 72.040s
  s14: { from: 2087, duration: 74  },

  // Scene 15 — Browser Tool "A browser tool gives it access to any website on Earth."
  // words 159–169: 72.680s → 76.220s
  s15: { from: 2180, duration: 106 },

  // Scene 16 — Key Takeaway "Tools are the agent's hands."
  // words 170–174: 76.960s → 79.020s
  s16: { from: 2309, duration: 120 },

  // Scene 17 — Outro (post-audio recap + CTA)
  s17: { from: 2480, duration: 362 },
} as const;

export const CAPTIONS = [
  { text: "This is day 27 of learning Agentic AI from first principles.", from: 0, duration: 142 },
  { text: "Last day, we learned what an observation is.", from: 160, duration: 90 },
  { text: "A tool is a named callable function that the agent can invoke.", from: 266, duration: 134 },
  { text: "Search, read file, send email, run an SQL query.", from: 423, duration: 144 },
  { text: "Each of these is a tool, a precise bounded capability the agent can choose to use.", from: 588, duration: 187 },
  { text: "The language model never directly executes anything. It generates text.", from: 775, duration: 167 },
  { text: "A tool call is a structured piece of text that says: call this function with these arguments.", from: 957, duration: 187 },
  { text: "The runtime reads that output. It runs the actual function and returns the result as the next observation.", from: 1164, duration: 212 },
  { text: "The model decides, the tool does.", from: 1396, duration: 77 },
  { text: "This separation matters deeply. The model's job is reasoning.", from: 1504, duration: 278 },
  { text: "The tool's job is execution, doing the actual work in the real world.", from: 1799, duration: 162 },
  { text: "A search tool connects the agent to current information.", from: 1982, duration: 89 },
  { text: "A code tool gives it precise calculation.", from: 2087, duration: 74 },
  { text: "A browser tool gives it access to any website on Earth.", from: 2180, duration: 106 },
  { text: "Tools are the agent's hands.", from: 2309, duration: 120 },
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
