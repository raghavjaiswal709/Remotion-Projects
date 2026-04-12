/**
 * Day 4 — "The Abort Button"
 * Series: HiddenWorld (Artemis II mini-series)
 * Audio file: public/audio/atri_second.wav
 * Audio duration: 85.420s → 2563 frames @ 30fps
 * Total composition: 3225 frames
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

// Audio: 85.420s → 2563 frames
// AUDIO_END = 150 + 2563 = 2713
// TAKEAWAY_FROM = 2713 + 30 = 2743
// OUTRO_FROM = 2743 + 120 = 2863
// TOTAL_FRAMES = 2863 + 362 = 3225

export const SCENE_TIMING = {
  s01: { from: 0, duration: 150 },

  // Scene 02 — "One button, four astronauts, zero second chances." [0.000s → 3.880s]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: Math.max(60, Math.round((3.880 - 0.000) * 30) + 18) },

  // Scene 03 — "This is day four of resolving hidden secrets around the world." [4.460s → 8.040s]
  s03: { from: SCROLL_FRAMES + Math.round(4.460 * 30), duration: Math.max(60, Math.round((8.040 - 4.460) * 30) + 18) },

  // Scene 04 — "Last day, we learned how Artemis II mirrors Apollo 8..." [8.640s → 18.660s]
  s04: { from: SCROLL_FRAMES + Math.round(8.640 * 30), duration: Math.max(60, Math.round((18.660 - 8.640) * 30) + 18) },

  // Scene 05 — "The abort button is the most consequential single action..." [19.280s → 25.120s]
  s05: { from: SCROLL_FRAMES + Math.round(19.280 * 30), duration: Math.max(60, Math.round((25.120 - 19.280) * 30) + 18) },

  // Scene 06 — "press it at launch, and the launch abort system fires instantly," [25.600s → 29.040s]
  s06: { from: SCROLL_FRAMES + Math.round(25.600 * 30), duration: Math.max(60, Math.round((29.040 - 25.600) * 30) + 18) },

  // Scene 07 — "a tower of solid rockets pulls the Orion capsule away..." [29.620s → 38.980s]
  s07: { from: SCROLL_FRAMES + Math.round(29.620 * 30), duration: Math.max(60, Math.round((38.980 - 29.620) * 30) + 18) },

  // Scene 08 — "The crew separates from the explosion before the explosion reaches them." [39.480s → 43.400s]
  s08: { from: SCROLL_FRAMES + Math.round(39.480 * 30), duration: Math.max(60, Math.round((43.400 - 39.480) * 30) + 18) },

  // Scene 09 — "Press it in deep space, and the picture changes completely." [44.060s → 47.320s]
  s09: { from: SCROLL_FRAMES + Math.round(44.060 * 30), duration: Math.max(60, Math.round((47.320 - 44.060) * 30) + 18) },

  // Scene 10 — "No tower, no fast escape. The mission profile switches immediately." [48.020s → 52.480s]
  s10: { from: SCROLL_FRAMES + Math.round(48.020 * 30), duration: Math.max(60, Math.round((52.480 - 48.020) * 30) + 18) },

  // Scene 11 — "Orion uses its service module engines to alter trajectory..." [53.120s → 60.540s]
  s11: { from: SCROLL_FRAMES + Math.round(53.120 * 30), duration: Math.max(60, Math.round((60.540 - 53.120) * 30) + 18) },

  // Scene 12 — "Every abort scenario was designed before a single crew member ever boarded." [61.300s → 65.680s]
  s12: { from: SCROLL_FRAMES + Math.round(61.300 * 30), duration: Math.max(60, Math.round((65.680 - 61.300) * 30) + 18) },

  // Scene 13 — "Every second of response time was calculated in advance." [66.140s → 69.160s]
  s13: { from: SCROLL_FRAMES + Math.round(66.140 * 30), duration: Math.max(60, Math.round((69.160 - 66.140) * 30) + 18) },

  // Scene 14 — "Every failure mode was modeled, tested, and modeled again." [69.780s → 73.380s]
  s14: { from: SCROLL_FRAMES + Math.round(69.780 * 30), duration: Math.max(60, Math.round((73.380 - 69.780) * 30) + 18) },

  // Scene 15 — "The button exists because deep space does not tolerate improvisation." [74.060s → 78.680s]
  s15: { from: SCROLL_FRAMES + Math.round(74.060 * 30), duration: Math.max(60, Math.round((78.680 - 74.060) * 30) + 18) },

  // Scene 16 — "Tomorrow, why the most advanced capsule ever built still lands in the ocean like it is 1969." [79.200s → 85.420s]
  s16: { from: SCROLL_FRAMES + Math.round(79.200 * 30), duration: Math.max(60, Math.round((85.420 - 79.200) * 30) + 18) },

  s_takeaway: { from: 2743, duration: 120 },
  s_outro: { from: 2863, duration: 362 },
} as const;

export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "One button, four astronauts, zero second chances.", keyWords: ["button", "four", "zero"], from: SCENE_TIMING.s02.from, duration: SCENE_TIMING.s02.duration },
  { text: "This is day four of resolving hidden secrets around the world.", keyWords: ["four", "hidden secrets"], from: SCENE_TIMING.s03.from, duration: SCENE_TIMING.s03.duration },
  { text: "Last day, we learned how Artemis II mirrors Apollo 8, same path around the moon, unrecognizable technology, 56 years between them.", keyWords: ["Artemis II", "Apollo 8", "56"], from: SCENE_TIMING.s04.from, duration: SCENE_TIMING.s04.duration },
  { text: "The abort button is the most consequential single action any Artemis II crew member can take,", keyWords: ["abort button", "consequential", "Artemis II"], from: SCENE_TIMING.s05.from, duration: SCENE_TIMING.s05.duration },
  { text: "press it at launch, and the launch abort system fires instantly,", keyWords: ["launch", "abort system", "instantly"], from: SCENE_TIMING.s06.from, duration: SCENE_TIMING.s06.duration },
  { text: "a tower of solid rockets pulls the Orion capsule away from the SLS booster at 700 km/h in under three seconds.", keyWords: ["700", "Orion", "three seconds"], from: SCENE_TIMING.s07.from, duration: SCENE_TIMING.s07.duration },
  { text: "The crew separates from the explosion before the explosion reaches them.", keyWords: ["separates", "explosion"], from: SCENE_TIMING.s08.from, duration: SCENE_TIMING.s08.duration },
  { text: "Press it in deep space, and the picture changes completely.", keyWords: ["deep space", "changes"], from: SCENE_TIMING.s09.from, duration: SCENE_TIMING.s09.duration },
  { text: "No tower, no fast escape. The mission profile switches immediately.", keyWords: ["No tower", "switches", "immediately"], from: SCENE_TIMING.s10.from, duration: SCENE_TIMING.s10.duration },
  { text: "Orion uses its service module engines to alter trajectory and begin the fastest, survivable return path to Earth.", keyWords: ["Orion", "trajectory", "survivable"], from: SCENE_TIMING.s11.from, duration: SCENE_TIMING.s11.duration },
  { text: "Every abort scenario was designed before a single crew member ever boarded.", keyWords: ["abort scenario", "designed", "before"], from: SCENE_TIMING.s12.from, duration: SCENE_TIMING.s12.duration },
  { text: "Every second of response time was calculated in advance.", keyWords: ["response time", "calculated"], from: SCENE_TIMING.s13.from, duration: SCENE_TIMING.s13.duration },
  { text: "Every failure mode was modeled, tested, and modeled again.", keyWords: ["failure mode", "modeled", "tested"], from: SCENE_TIMING.s14.from, duration: SCENE_TIMING.s14.duration },
  { text: "The button exists because deep space does not tolerate improvisation.", keyWords: ["button", "deep space", "improvisation"], from: SCENE_TIMING.s15.from, duration: SCENE_TIMING.s15.duration },
  { text: "Tomorrow, why the most advanced capsule ever built still lands in the ocean like it is 1969.", keyWords: ["capsule", "ocean", "1969"], from: SCENE_TIMING.s16.from, duration: SCENE_TIMING.s16.duration },
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
