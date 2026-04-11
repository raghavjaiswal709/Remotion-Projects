/**
 * Moon — "The Moon's Shadow: Apollo 8's 45 Minutes of Silence"
 * Style: Dark Premium Editorial (style_dafault.md)
 *
 * Audio duration: 0.000s → 86.760s
 * Pre-roll DayCard: 90 frames (3s)
 * Composition frame = Math.round(audioSeconds * 30) + 90
 * Total: 2903 frames @ 30fps ≈ 96.8 seconds
 */

export const FPS = 30;

// ── Palette — Dark Premium Editorial ─────────────────────────────────────────
export const C = {
  bg:          '#000000',   // pure absolute black — always
  steel_blue:  '#4A90D4',   // primary active elements, dominant fills
  powder_blue: '#9BBBD4',   // secondary streams, light pulses, inner accents
  teal:        '#2AAFB0',   // cables, wires, connection paths
  soft_teal:   '#5ED0C8',   // ambient background fills, secondary layers
  muted_blue:  '#5C7BA8',   // depth fills, large background panels
  warm_pink:   '#E8728A',   // key emphasis, critical highlights, alerts
  lavender:    '#B0A0D8',   // cosmic elements, abstract patterns
  rose_coral:  '#E86060',   // failure states, danger, broken connections
  salmon:      '#D09078',   // caution states, mid-level warnings
  peach:       '#E0B880',   // human elements, success, hero foreground
  copper:      '#B07840',   // mechanical, industrial, structural
  mint:        '#60C890',   // healthy systems, positive outcomes, success
  silver:      '#B8C4D0',   // outlines, edge strokes, fine detail
  slate:       '#607080',   // secondary structures, passive fills, background
} as const;

// ── Scene timing — all frames in composition time ────────────────────────────
// Audio offset = 90 frames (DayCard pre-roll)
// comp_frame = round(audioSeconds * 30) + 90
export const SCENE_TIMING = {
  // Scene 01 — Day Card (pre-audio title, 3s)
  s01: { from: 0,    duration: 90  },

  // Scene 02 — "When a spacecraft passes behind the moon, it vanishes from Earth completely,"
  // audio 0.000s → 5.300s (words 1–12)
  s02: { from: 90,   duration: 174 },

  // Scene 03 — "not gradually, not fading out. One second, the signal is strong and clear."
  // audio 5.800s → 14.540s (words 13–25, ~sentence boundary)
  s03: { from: 264,  duration: 262 },

  // Scene 04 — "This is called loss of signal, and it happens because the moon is simply in the way."
  // audio 14.540s → 20.460s (words 30–46)
  s04: { from: 526,  duration: 178 },

  // Scene 05 — "Radio waves travel in straight lines. They cannot bend around a rock that is 3,400 kilometers wide."
  // audio 20.460s → 28.080s (words 47–64)
  s05: { from: 704,  duration: 228 },

  // Scene 06 — "Engineers calculate the exact second of blackout before launch."
  // audio 28.080s → 32.720s (words 65–73)
  s06: { from: 932,  duration: 140 },

  // Scene 07 — "They know the spacecraft's speed, its trajectory, and the precise curvature of the moon at that latitude. The cutoff is predictable to within a single second."
  // audio 32.720s → 43.480s (words 74–99)
  s07: { from: 1072, duration: 322 },

  // Scene 08 — "During Apollo 8, the blackout lasted 45 minutes."
  // audio 43.480s → 48.160s (words 100–107 + bridge)
  s08: { from: 1394, duration: 141 },

  // Scene 09 — "For those 45 minutes, mission control heard nothing. No signal, no telemetry, no confirmation the engine burn had worked."
  // audio 48.160s → 58.200s (words 108–126)
  s09: { from: 1535, duration: 301 },

  // Scene 10 — "The crew was completely alone on the far side of the moon, 385,000 kilometers from Earth."
  // audio 58.200s → 65.760s (words 127–143)
  s10: { from: 1836, duration: 227 },

  // Scene 11 — "Everything depended on a burn that no one on Earth could observe."
  // audio 65.760s → 70.580s (words 144–155)
  s11: { from: 2063, duration: 144 },

  // Scene 12 — "Then one crackle came through the headset. Signal restored. Burn successful."
  // audio 70.580s → 77.060s (words 156–166)
  s12: { from: 2207, duration: 195 },

  // Scene 13 — "Crew alive."
  // audio 77.060s → 79.000s (words 167–168)
  s13: { from: 2402, duration: 58  },

  // Scene 14 — "45 minutes of silence ended in one second of static that confirmed history had just been made."
  // audio 79.000s → 86.760s (words 169–185)
  s14: { from: 2460, duration: 233 },

  // Scene 15 — Outro (post-audio)
  s15: { from: 2693, duration: 210 },
} as const;

// ── Animation utilities ───────────────────────────────────────────────────────
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));

export const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.max(lo, Math.min(hi, v));

export const easeOut = (t: number): number =>
  1 - Math.pow(1 - clamp(t), 3);

export const easeSnap = (t: number): number => {
  const c = clamp(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export const fadeIn = (frame: number, start: number, dur: number): number =>
  easeOut(clamp((frame - start) / dur));

export const slideIn = (frame: number, start: number, dur: number, dist = 40): number =>
  lerp(dist, 0, easeSnap(clamp((frame - start) / dur)));

export const drawLine = (frame: number, start: number, dur: number, totalLen: number): number =>
  totalLen * easeOut(clamp((frame - start) / dur));

// Deterministic "random" for stable star/particle positions
export const seed = (n: number): number => ((n * 2654435761) >>> 0) / 4294967296;
