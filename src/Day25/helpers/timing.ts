/**
 * Day 25 — "Actions"
 * style_pencil_art_AI — Premium Colored Pencil AI Explainer
 *
 * All frame numbers derived directly from the word-by-word CSV timestamps.
 * Audio duration: 0.000s → 67.980s ≈ 2040 frames at 30fps
 * Total composition: 2250 frames (75 seconds incl. day card + outro)
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

// ── Scene timing ───────────────────────────────────────────────────────────
export const SCENE_TIMING = {
  // Scene 01 — Day Card
  s01: { from: 0,    duration: 81  },

  // Scene 02 — "This is day 25 of learning agentic AI from first principles."
  // words 1-12: 0.000s → 5.060s
  s02: { from: 0,    duration: 152 },

  // Scene 03 — "Last day, we learned what the agent loop is."
  // words 13-21: 5.520s → 8.460s
  s03: { from: 166,  duration: 88  },

  // Scene 04 — "An action is anything the agent can do that changes the state of the world or retrieves information about it."
  // words 22-41: 8.860s → 15.600s
  s04: { from: 266,  duration: 202 },

  // Scene 05 — "Calling an API, writing a file, sending a message, running a database query, clicking a button on a web page."
  // words 42-61: 16.060s → 24.040s
  s05: { from: 482,  duration: 239 },

  // Scene 06 — "Each of these is an action, a verb that agent executes against the environment."
  // words 62-75: 24.440s → 29.440s
  s06: { from: 733,  duration: 150 },

  // Scene 07 — "The agent loop has four steps, perceive, think, act, observe."
  // words 76-85: 29.910s → 35.260s
  s07: { from: 897,  duration: 160 },

  // Scene 08 — "Act is the step where something real happens."
  // words 86-93: 36.080s → 38.760s
  s08: { from: 1082, duration: 81  },

  // Scene 09 — "Without actions, the loop is just thinking."
  // words 94-100: 39.380s → 41.760s
  s09: { from: 1181, duration: 72  },

  // Scene 10 — "The agent reasons, reasons, reasons, and nothing changes anywhere."
  // words 101-109: 42.320s → 46.460s
  s10: { from: 1270, duration: 124 },

  // Scene 11 — "Actions are how intelligence connects to the world."
  // words 110-117: 47.200s → 50.060s
  s11: { from: 1416, duration: 86  },

  // Scene 12 — "This is why tool design matters so much in agentic systems."
  // words 118-128: 50.600s → 54.360s
  s12: { from: 1518, duration: 113 },

  // Scene 13 — "The quality of what an agent can accomplish is exactly the quality of the actions available to it."
  // words 129-146: 54.360s → 60.620s
  s13: { from: 1631, duration: 188 },

  // Scene 14 — "Smarter reasoning with weak actions produces weak outcomes."
  // words 147-154: 61.060s → 64.820s
  s14: { from: 1832, duration: 113 },

  // Scene 15 — "The action set defines the agent's reach."
  // words 155-161: 65.400s → 67.980s
  s15: { from: 1962, duration: 78  },

  // Scene 16 — Key Takeaway (paper, ink, bold — post-audio recap)
  s16: { from: 2040, duration: 120 },

  // Scene 17 — Outro (paper, ink — social CTA + series branding)
  s17: { from: 2160, duration: 90  },
} as const;

export const CAPTIONS = [
  { text: "This is day 25 of learning agentic AI from first principles.", from: 0, duration: 152 },
  { text: "Last day, we learned what the agent loop is.", from: 166, duration: 88 },
  { text: "An action is anything the agent can do that changes the state of the world.", from: 266, duration: 202 },
  { text: "Calling an API, writing a file, sending a message, running a query...", from: 482, duration: 239 },
  { text: "Each of these is an action—a verb the agent executes against the environment.", from: 733, duration: 150 },
  { text: "The agent loop has four steps: perceive, think, act, observe.", from: 897, duration: 160 },
  { text: "Act is the step where something real happens.", from: 1082, duration: 81 },
  { text: "Without actions, the loop is just thinking.", from: 1181, duration: 72 },
  { text: "The agent reasons, reasons, reasons, and nothing changes.", from: 1270, duration: 124 },
  { text: "Actions are how intelligence connects to the world.", from: 1416, duration: 86 },
  { text: "This is why tool design matters so much in agentic systems.", from: 1518, duration: 113 },
  { text: "The quality of actions available defines what the agent can accomplish.", from: 1631, duration: 188 },
  { text: "Smarter reasoning with weak actions produces weak outcomes.", from: 1832, duration: 113 },
  { text: "The action set defines the agent's reach.", from: 1962, duration: 78 },
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
