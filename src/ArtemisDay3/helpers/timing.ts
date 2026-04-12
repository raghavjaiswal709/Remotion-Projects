/**
 * Day 3 — "Apollo 8 vs Artemis II — Same Path, 56 Years Apart"
 * Series: HiddenWorld (Artemis II mini-series)
 * Audio file: public/audio/arti_first.wav
 * Audio duration: 90.200s → 2706 frames @ 30fps
 * Total composition: 3368 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Color palette ──
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

// ── Frame constants ──
const SCROLL_FRAMES = 150;

// Audio: 90.200s → 2706 frames
// AUDIO_END = 150 + 2706 = 2856
// TAKEAWAY_FROM = 2856 + 30 = 2886
// OUTRO_FROM = 2886 + 120 = 3006
// TOTAL_FRAMES = 3006 + 362 = 3368

export const SCENE_TIMING = {
  // Scene 01 — Scroll Timeline (SILENT)
  s01: { from: 0, duration: 150 },

  // Scene 02 — "Two crews, same path around the moon, 56 years apart." [0.000s → 5.840s]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: Math.max(60, Math.round((5.840 - 0.000) * 30) + 18) },

  // Scene 03 — "What changed and what never did?" [6.660s → 8.860s]
  s03: { from: SCROLL_FRAMES + Math.round(6.660 * 30), duration: Math.max(60, Math.round((8.860 - 6.660) * 30) + 18) },

  // Scene 04 — "This is day three of resolving hidden secrets around the world." [9.820s → 14.160s]
  s04: { from: SCROLL_FRAMES + Math.round(9.820 * 30), duration: Math.max(60, Math.round((14.160 - 9.820) * 30) + 18) },

  // Scene 05 — "Last day, we learned why Artemis II is the most consequential crude mission NASA has launched since the moon landings ended." [15.000s → 23.200s]
  s05: { from: SCROLL_FRAMES + Math.round(15.000 * 30), duration: Math.max(60, Math.round((23.200 - 15.000) * 30) + 18) },

  // Scene 06 — "In December 1968, Apollo 8 carried three astronauts around the moon and back," [23.800s → 30.280s]
  s06: { from: SCROLL_FRAMES + Math.round(23.800 * 30), duration: Math.max(60, Math.round((30.280 - 23.800) * 30) + 18) },

  // Scene 07 — "no landing just a loop to prove the journey was survivable." [30.800s → 34.740s]
  s07: { from: SCROLL_FRAMES + Math.round(30.800 * 30), duration: Math.max(60, Math.round((34.740 - 30.800) * 30) + 18) },

  // Scene 08 — "In 2025, Artemis II does the same thing." [35.000s → 38.820s]
  s08: { from: SCROLL_FRAMES + Math.round(35.000 * 30), duration: Math.max(60, Math.round((38.820 - 35.000) * 30) + 18) },

  // Scene 09 — "Four astronauts, same free return trajectory around the moon," [39.160s → 43.360s]
  s09: { from: SCROLL_FRAMES + Math.round(39.160 * 30), duration: Math.max(60, Math.round((43.360 - 39.160) * 30) + 18) },

  // Scene 10 — "same fundamental question, can humans survive deep space beyond Earth's magnetic shield long enough to matter?" [43.800s → 51.760s]
  s10: { from: SCROLL_FRAMES + Math.round(43.800 * 30), duration: Math.max(60, Math.round((51.760 - 43.800) * 30) + 18) },

  // Scene 11 — "But almost everything else is unrecognizable." [52.450s → 55.820s]
  s11: { from: SCROLL_FRAMES + Math.round(52.450 * 30), duration: Math.max(60, Math.round((55.820 - 52.450) * 30) + 18) },

  // Scene 12 — "Apollo 8 ran on computers less powerful than a wristwatch." [56.500s → 60.600s]
  s12: { from: SCROLL_FRAMES + Math.round(56.500 * 30), duration: Math.max(60, Math.round((60.600 - 56.500) * 30) + 18) },

  // Scene 13 — "Artemis II carries systems that detect radiation threats in real time," [61.220s → 65.620s]
  s13: { from: SCROLL_FRAMES + Math.round(61.220 * 30), duration: Math.max(60, Math.round((65.620 - 61.220) * 30) + 18) },

  // Scene 14 — "adjust trajectory mid-flight, and communicate with Earth at speeds Apollo could never access." [66.100s → 72.300s]
  s14: { from: SCROLL_FRAMES + Math.round(66.100 * 30), duration: Math.max(60, Math.round((72.300 - 66.100) * 30) + 18) },

  // Scene 15 — "The destination is the same, the machine is from a different civilization." [73.120s → 77.660s]
  s15: { from: SCROLL_FRAMES + Math.round(73.120 * 30), duration: Math.max(60, Math.round((77.660 - 73.120) * 30) + 18) },

  // Scene 16 — "That is what 56 years of refusing to stop looks like." [78.460s → 83.220s]
  s16: { from: SCROLL_FRAMES + Math.round(78.460 * 30), duration: Math.max(60, Math.round((83.220 - 78.460) * 30) + 18) },

  // Scene 17 — "Tomorrow, one button on board Artemis II, what happens the moment a crew member hits it?" [83.940s → 90.200s]
  s17: { from: SCROLL_FRAMES + Math.round(83.940 * 30), duration: Math.max(60, Math.round((90.200 - 83.940) * 30) + 18) },

  // Scene 18 — Key Takeaway
  s_takeaway: { from: 2886, duration: 120 },

  // Scene 19 — Outro
  s_outro: { from: 3006, duration: 362 },
} as const;

// ── Captions ──
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "Two crews, same path around the moon, 56 years apart.", keyWords: ["56", "moon"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "What changed and what never did?", keyWords: ["changed"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "This is day three of resolving hidden secrets around the world.", keyWords: ["day three", "hidden secrets"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "Last day, we learned why Artemis II is the most consequential crude mission NASA has launched since the moon landings ended.", keyWords: ["Artemis II", "NASA", "moon landings"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "In December 1968, Apollo 8 carried three astronauts around the moon and back,", keyWords: ["1968", "Apollo 8", "three astronauts"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "no landing just a loop to prove the journey was survivable.", keyWords: ["loop", "survivable"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "In 2025, Artemis II does the same thing.", keyWords: ["2025", "Artemis II"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Four astronauts, same free return trajectory around the moon,", keyWords: ["Four astronauts", "free return trajectory"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "same fundamental question, can humans survive deep space beyond Earth's magnetic shield long enough to matter?", keyWords: ["deep space", "magnetic shield"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "But almost everything else is unrecognizable.", keyWords: ["unrecognizable"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "Apollo 8 ran on computers less powerful than a wristwatch.", keyWords: ["Apollo 8", "wristwatch"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "Artemis II carries systems that detect radiation threats in real time,", keyWords: ["Artemis II", "radiation", "real time"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "adjust trajectory mid-flight, and communicate with Earth at speeds Apollo could never access.", keyWords: ["trajectory", "mid-flight", "Apollo"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "The destination is the same, the machine is from a different civilization.", keyWords: ["destination", "different civilization"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "That is what 56 years of refusing to stop looks like.", keyWords: ["56 years"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
  { text: "Tomorrow, one button on board Artemis II, what happens the moment a crew member hits it?", keyWords: ["Tomorrow", "Artemis II", "abort"], from: SCENE_TIMING.s17.from, duration: SCENE_TIMING.s17.duration },
];

// ── Animation helpers ──
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
