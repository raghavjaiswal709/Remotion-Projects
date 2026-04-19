/**
 * Day 32 — "What Is a Trajectory?"
 * Series: Agentic AI
 * Audio file: public/audio/AI day 32.wav
 * Audio duration: 84.520s → 2536 frames @ 30fps
 * Total composition: 2536 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

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

export const SCENE_TIMING = {
  s01: { from: 0, duration: 160 },       // 0.000–4.860 "This is day 32..."
  s02: { from: 160, duration: 80 },      // 5.340–7.740 "Last day, we learned..."
  s03: { from: 240, duration: 141 },     // 8.000–12.020 "the spectrum between..."
  s04: { from: 381, duration: 79 },      // 12.700–14.520 "Today, we define the trajectory."
  s05: { from: 460, duration: 147 },     // 15.340–19.880 "A trajectory is the complete..."
  s06: { from: 607, duration: 53 },      // 20.240–21.520 "from start to finish."
  s07: { from: 660, duration: 57 },      // 22.000–23.340 "Not just the final output,"
  s08: { from: 717, duration: 139 },     // 23.900–28.040 "every state, every action..."
  s09: { from: 856, duration: 51 },      // 28.540–29.680 "Here is a simple one."
  s10: { from: 907, duration: 42 },      // 30.220–31.060 "User gives a goal."
  s11: { from: 949, duration: 52 },      // 31.620–32.820 "Agent calls a search tool."
  s12: { from: 1001, duration: 47 },     // 33.360–34.260 "Search returns results."
  s13: { from: 1048, duration: 45 },     // 34.920–35.900 "Agent reads a document."
  s14: { from: 1093, duration: 51 },     // 36.420–37.480 "Document returns text."
  s15: { from: 1144, duration: 57 },     // 38.120–39.380 "Agent produces a summary."
  s16: { from: 1201, duration: 74 },     // 40.020–41.920 "Six entries. Six moments."
  s17: { from: 1275, duration: 74 },     // 42.500–44.080 "That sequence is the trajectory."
  s18: { from: 1349, duration: 46 },     // 44.980–45.880 "Why does this matter?"
  s19: { from: 1395, duration: 125 },    // 46.500–50.060 "The final output alone..."
  s20: { from: 1520, duration: 177 },    // 50.680–56.200 "A correct answer reached..."
  s21: { from: 1697, duration: 35 },     // 56.580–57.220 "It was lucky."
  s22: { from: 1732, duration: 90 },     // 57.720–60.160 "The trajectory exposes..."
  s23: { from: 1822, duration: 161 },    // 60.740–65.400 "Every decision visible..."
  s24: { from: 1983, duration: 203 },    // 66.100–72.340 "When something goes wrong..."
  s25: { from: 2186, duration: 57 },     // 72.880–74.020 "It is the audit trail."
  s26: { from: 2243, duration: 81 },     // 74.780–77.040 "The trajectory is made of..."
  s27: { from: 2324, duration: 116 },    // 77.460–80.820 "Each one a single observation..."
  s28: { from: 2440, duration: 96 },     // 81.320–84.520 "That atomic unit has a name..."
} as const;

export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 32 of learning Agentic AI from first principles.", keyWords: ["day 32", "Agentic AI"], from: 0, duration: 160 },
  { text: "Last day, we learned what autonomy is,", keyWords: ["autonomy"], from: 160, duration: 80 },
  { text: "the spectrum between full independence and full human control.", keyWords: ["spectrum", "independence", "control"], from: 240, duration: 141 },
  { text: "Today, we define the trajectory.", keyWords: ["trajectory"], from: 381, duration: 79 },
  { text: "A trajectory is the complete sequence of everything that happened during a task,", keyWords: ["trajectory", "sequence", "task"], from: 460, duration: 147 },
  { text: "from start to finish.", keyWords: ["start", "finish"], from: 607, duration: 53 },
  { text: "Not just the final output,", keyWords: ["final output"], from: 660, duration: 57 },
  { text: "every state, every action, every observation, in order.", keyWords: ["state", "action", "observation"], from: 717, duration: 139 },
  { text: "Here is a simple one.", keyWords: ["simple"], from: 856, duration: 51 },
  { text: "User gives a goal.", keyWords: ["User", "goal"], from: 907, duration: 42 },
  { text: "Agent calls a search tool.", keyWords: ["Agent", "search tool"], from: 949, duration: 52 },
  { text: "Search returns results.", keyWords: ["Search", "results"], from: 1001, duration: 47 },
  { text: "Agent reads a document.", keyWords: ["Agent", "document"], from: 1048, duration: 45 },
  { text: "Document returns text.", keyWords: ["Document", "text"], from: 1093, duration: 51 },
  { text: "Agent produces a summary.", keyWords: ["Agent", "summary"], from: 1144, duration: 57 },
  { text: "Six entries. Six moments.", keyWords: ["Six"], from: 1201, duration: 74 },
  { text: "That sequence is the trajectory.", keyWords: ["sequence", "trajectory"], from: 1275, duration: 74 },
  { text: "Why does this matter?", keyWords: ["matter"], from: 1349, duration: 46 },
  { text: "The final output alone cannot tell you if the agent is trustworthy.", keyWords: ["output", "trustworthy"], from: 1395, duration: 125 },
  { text: "A correct answer reached through hallucinated reasoning or broken logic is not a reliable agent.", keyWords: ["hallucinated", "broken logic", "reliable"], from: 1520, duration: 177 },
  { text: "It was lucky.", keyWords: ["lucky"], from: 1697, duration: 35 },
  { text: "The trajectory exposes the full picture.", keyWords: ["trajectory", "full picture"], from: 1732, duration: 90 },
  { text: "Every decision visible. Every tool call locked. Every observation recorded.", keyWords: ["decision", "tool call", "observation"], from: 1822, duration: 161 },
  { text: "When something goes wrong in production, the trajectory is the only record of what the agent actually did and why.", keyWords: ["production", "trajectory", "record"], from: 1983, duration: 203 },
  { text: "It is the audit trail.", keyWords: ["audit trail"], from: 2186, duration: 57 },
  { text: "The trajectory is made of individual steps.", keyWords: ["trajectory", "steps"], from: 2243, duration: 81 },
  { text: "Each one a single observation in, a single action out.", keyWords: ["observation", "action"], from: 2324, duration: 116 },
  { text: "That atomic unit has a name, and we define it next.", keyWords: ["atomic unit", "name"], from: 2440, duration: 96 },
];

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
