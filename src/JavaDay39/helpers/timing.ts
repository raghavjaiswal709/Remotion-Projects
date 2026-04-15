/**
 * Day 39 — "Static Method"
 * Series: Java / National Railway
 * Audio file: public/audio/java39.wav
 * Audio duration: ~89.9s → 2698 frames @ 30fps
 * Total composition: 2698 frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

const SERIES_ACCENT = '#D87656';
const ACCENT_R = 216, ACCENT_G = 118, ACCENT_B = 86;

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
  s01: { from: 0,    duration: 194 },
  s02: { from: 194,  duration: 228 },
  s03: { from: 422,  duration: 73  },
  s04: { from: 495,  duration: 232 },
  s05: { from: 727,  duration: 150 },
  s06: { from: 877,  duration: 144 },
  s07: { from: 1021, duration: 241 },
  s08: { from: 1262, duration: 132 },
  s09: { from: 1394, duration: 187 },
  s10: { from: 1581, duration: 92  },
  s11: { from: 1673, duration: 218 },
  s12: { from: 1891, duration: 145 },
  s13: { from: 2036, duration: 211 },
  s14: { from: 2247, duration: 101 },
  s15: { from: 2348, duration: 207 },
  s16: { from: 2555, duration: 143 },
} as const;

export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 39 of learning National Railway System in Java from first principles.", keyWords: ["day 39", "Railway", "Java"], from: 0, duration: 194 },
  { text: "Last day, we learned how a static variable belongs to the class, one shared value across every object.", keyWords: ["static variable", "class", "shared"], from: 194, duration: 228 },
  { text: "Today, we learn the static method.", keyWords: ["static method"], from: 422, duration: 73 },
  { text: "To call a regular method, you need an object, train1.getSpeed. The object must exist first.", keyWords: ["regular method", "object", "getSpeed"], from: 495, duration: 232 },
  { text: "But some operations in the railway system do not belong to any single object.", keyWords: ["operations", "railway", "object"], from: 727, duration: 150 },
  { text: "The control room needs station.total network stations.", keyWords: ["control room", "station", "network"], from: 877, duration: 144 },
  { text: "This is a network-level query. No specific station object is needed. No instance has to exist.", keyWords: ["network-level", "station", "instance"], from: 1021, duration: 241 },
  { text: "Declare the method as static and you call it directly on the class.", keyWords: ["static", "class"], from: 1262, duration: 132 },
  { text: "Station.total network stations. No object. No constructor. Nothing.", keyWords: ["Station", "object", "constructor"], from: 1394, duration: 187 },
  { text: "Static methods can only work with static data.", keyWords: ["Static methods", "static data"], from: 1581, duration: 92 },
  { text: "They cannot access instance variables because there is no object, no instance, nothing to reach into.", keyWords: ["instance variables", "object"], from: 1673, duration: 218 },
  { text: "They are utility-level operations that exist at the class level.", keyWords: ["utility-level", "class level"], from: 1891, duration: 145 },
  { text: "Math.squareroot.collections.sort. Every Java utility method you have ever called.", keyWords: ["Math", "Collections", "utility"], from: 2036, duration: 211 },
  { text: "Static methods invoked on the class itself.", keyWords: ["Static methods", "class"], from: 2247, duration: 101 },
  { text: "But what about the code that runs before any object is ever created, before any constructor even fires?", keyWords: ["code", "object", "constructor"], from: 2348, duration: 207 },
  { text: "That is the static block and that is exactly what we cover next.", keyWords: ["static block", "cover next"], from: 2555, duration: 143 },
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
