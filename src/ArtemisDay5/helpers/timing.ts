/**
 * Day 5 — "Orion Splashdown"
 * Series: HiddenWorld (Artemis II mini-series)
 * Audio file: public/audio/arti_third.wav
 * Audio duration: 87.580s → 2628 frames @ 30fps
 * Total composition: 3290 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

export const COLORS = {
  bg_paper:       '#F5F0E8',
  deep_black:     '#1A1A1A',
  sky_blue:       '#2563EB',
  green:          '#16A34A',
  orange:         '#EA580C',
  brown:          '#92400E',
  amber:          '#D97706',
  cool_silver:    '#94A3B8',
  vibrant_red:    '#DC2626',
  purple:         '#7C3AED',
  text_caption:   '#1A1A1A',
  text_highlight: '#2563EB',
} as const;

const SCROLL_FRAMES = 150;

// Audio: 87.580s → 2628 frames
// AUDIO_END = 150 + 2628 = 2778
// TAKEAWAY_FROM = 2778 + 30 = 2808
// OUTRO_FROM = 2808 + 120 = 2928
// TOTAL_FRAMES = 2928 + 362 = 3290

export const SCENE_TIMING = {
  // Scene 01 — Scrolling Timeline (SILENT)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "The most advanced spacecraft NASA has ever built, and it still falls into the ocean like it is 1969." [0.000→7.520]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: Math.max(60, Math.round((7.520 - 0.000) * 30) + 18) },

  // Scene 03 — "This is day five of resolving hidden secrets around the world." [8.360→12.280]
  s03: { from: SCROLL_FRAMES + Math.round(8.360 * 30), duration: Math.max(60, Math.round((12.280 - 8.360) * 30) + 18) },

  // Scene 04 — "Last day, we learned what happens when a crew member hits the abort button..." [12.860→22.500]
  s04: { from: SCROLL_FRAMES + Math.round(12.860 * 30), duration: Math.max(60, Math.round((22.500 - 12.860) * 30) + 18) },

  // Scene 05 — "Orion splashes down in the Pacific Ocean because water is the safest impact surface..." [23.300→33.440]
  s05: { from: SCROLL_FRAMES + Math.round(23.300 * 30), duration: Math.max(60, Math.round((33.440 - 23.300) * 30) + 18) },

  // Scene 06 — "Not tradition, physics." [33.860→35.440]
  s06: { from: SCROLL_FRAMES + Math.round(33.860 * 30), duration: Math.max(60, Math.round((35.440 - 33.860) * 30) + 18) },

  // Scene 07 — "At that speed, hitting solid ground, even with parachutes fully deployed..." [36.220→45.860]
  s07: { from: SCROLL_FRAMES + Math.round(36.220 * 30), duration: Math.max(60, Math.round((45.860 - 36.220) * 30) + 18) },

  // Scene 08 — "Water extends the impact across a longer window, the forces stay within survivable limits." [46.400→52.260]
  s08: { from: SCROLL_FRAMES + Math.round(46.400 * 30), duration: Math.max(60, Math.round((52.260 - 46.400) * 30) + 18) },

  // Scene 09 — "The sequence begins at 7,600 meters altitude, two drogue chutes deploy..." [52.900→60.860]
  s09: { from: SCROLL_FRAMES + Math.round(52.900 * 30), duration: Math.max(60, Math.round((60.860 - 52.900) * 30) + 18) },

  // Scene 10 — "three pilot chutes pull out three main parachutes." [61.460→64.880]
  s10: { from: SCROLL_FRAMES + Math.round(61.460 * 30), duration: Math.max(60, Math.round((64.880 - 61.460) * 30) + 18) },

  // Scene 11 — "By the moment of splashdown, Orion is descending at under 10 meters per second." [65.300→70.420]
  s11: { from: SCROLL_FRAMES + Math.round(65.300 * 30), duration: Math.max(60, Math.round((70.420 - 65.300) * 30) + 18) },

  // Scene 12 — "Recovery ships are prepositioned before launch day, divers enter the water immediately on contact." [71.040→77.480]
  s12: { from: SCROLL_FRAMES + Math.round(71.040 * 30), duration: Math.max(60, Math.round((77.480 - 71.040) * 30) + 18) },

  // Scene 13 — "The capsule is secured within minutes." [77.980→79.940]
  s13: { from: SCROLL_FRAMES + Math.round(77.980 * 30), duration: Math.max(60, Math.round((79.940 - 77.980) * 30) + 18) },

  // Scene 14 — "It looks like 1969 from the outside." [80.460→83.400]
  s14: { from: SCROLL_FRAMES + Math.round(80.460 * 30), duration: Math.max(60, Math.round((83.400 - 80.460) * 30) + 18) },

  // Scene 15 — "The engineering underneath it is from a completely different world." [83.960→87.580]
  s15: { from: SCROLL_FRAMES + Math.round(83.960 * 30), duration: Math.max(60, Math.round((87.580 - 83.960) * 30) + 18) },

  // Scene 16 — Key Takeaway
  s_takeaway: { from: 2808, duration: 120 },

  // Scene 17 — Outro
  s_outro: { from: 2928, duration: 362 },
} as const;

export const TOTAL_FRAMES = 3290;

export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "The most advanced spacecraft NASA has ever built, and it still falls into the ocean like it is 1969.", keyWords: ["NASA", "1969", "ocean"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "This is day five of resolving hidden secrets around the world.", keyWords: ["five", "hidden secrets"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Last day, we learned what happens when a crew member hits the abort button and why every millisecond of that sequence was engineered years before launch.", keyWords: ["abort button", "millisecond", "engineered"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "Orion splashes down in the Pacific Ocean because water is the safest impact surface available for a capsule returning at 40,000 kilometers per hour.", keyWords: ["Orion", "Pacific Ocean", "40,000"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "Not tradition, physics.", keyWords: ["tradition", "physics"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "At that speed, hitting solid ground, even with parachutes fully deployed, produces deceleration forces no human spine survives reliably.", keyWords: ["deceleration", "human spine"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "Water extends the impact across a longer window, the forces stay within survivable limits.", keyWords: ["Water", "survivable limits"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "The sequence begins at 7,600 meters altitude, two drogue chutes deploy and stabilize the capsule's attitude,", keyWords: ["7,600 meters", "drogue chutes"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "three pilot chutes pull out three main parachutes.", keyWords: ["pilot chutes", "main parachutes"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "By the moment of splashdown, Orion is descending at under 10 meters per second.", keyWords: ["splashdown", "10 meters", "Orion"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "Recovery ships are prepositioned before launch day, divers enter the water immediately on contact.", keyWords: ["Recovery ships", "divers"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "The capsule is secured within minutes.", keyWords: ["secured", "minutes"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "It looks like 1969 from the outside.", keyWords: ["1969"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "The engineering underneath it is from a completely different world.", keyWords: ["engineering", "different world"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
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
