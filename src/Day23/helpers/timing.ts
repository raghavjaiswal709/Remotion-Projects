/**
 * Day 23 — "A Model Is Not an Agent"
 * style_pencil_art_AI — Premium Colored Pencil AI Explainer
 *
 * All frame numbers derived directly from the word-by-word CSV timestamps.
 * Audio duration: 0.000s → 85.040s = 2551 frames at 30fps
 * Total composition: 2700 frames (90 seconds incl. day card)
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
  text_day:       '#C8D0D4',
  text_title:     '#3B82F6',
  text_series:    '#6B7280',
  text_caption:   '#0D0D0D',
  text_override:  '#C8D0D4',
} as const;

// ── Scene timing: frameIn & durationInFrames ───────────────────────────────
// Each scene is mapped to the EXACT CSV word timestamps.
// Scene frame windows use: frameIn = Math.round(startSec * 30)
// ──────────────────────────────────────────────────────────────────────────
export const SCENE_TIMING = {
  // Scene 01 — Day Card (pre-audio title card)
  // Covers: 0s → 2.7s (before first spoken word)
  s01: { from: 0,    duration: 81  },

  // Scene 02 — "This is day 23 of learning agentic AI from first principles."
  // CSV words 1-11: 0.000s → 4.580s
  s02: { from: 0,    duration: 138 },

  // Scene 03 — "Last time, we saw structured output..."
  // CSV words 12-17: 5.140s → 7.580s → extend to 8.080s gap
  s03: { from: 154,  duration: 72  },

  // Scene 04 — "...and we understood that forcing the model's completion into a machine readable format..."
  // CSV words 18-30: 8.080s → 12.940s
  s04: { from: 242,  duration: 146 },

  // Scene 05 — "...is what turns text into something a program can actually act on."
  // CSV words 31-42: 12.940s → 17.260s
  s05: { from: 388,  duration: 130 },

  // Scene 06 — "Now, a model and an agent are not the same thing."
  // CSV words 43-53: 17.900s → 21.260s
  s06: { from: 537,  duration: 101 },

  // Scene 07 — "Most people treat them as interchangeable. They are not."
  // CSV words 54-62: 21.880s → 25.340s
  s07: { from: 656,  duration: 104 },

  // Scene 08 — "A model takes one input. It produces one output. That is it."
  // CSV words 63-74: 25.340s → 30.980s
  s08: { from: 760,  duration: 170 },

  // Scene 09 — "One step done."
  // CSV words 75-77: 31.700s → 32.880s
  s09: { from: 951,  duration: 36  },

  // Scene 10 — "There is no loop. There is no observation of what happens next. There is no adaptation."
  // CSV words 78-93: 33.620s → 39.080s
  s10: { from: 1009, duration: 164 },

  // Scene 11 — "You give it a prompt. It gives you a completion. The transaction is over."
  // CSV words 94-107: 39.900s → 44.400s
  s11: { from: 1197, duration: 135 },

  // Scene 12 — "An agent is different at the architectural level."
  // CSV words 108-115: 45.240s → 48.100s
  s12: { from: 1357, duration: 86  },

  // Scene 13 — "An agent takes input, produces output..."
  // CSV words 116-127: 48.600s → 52.640s
  s13: { from: 1458, duration: 121 },

  // Scene 14 — "...and then observes what that output caused in the world."
  // CSV words 124-131: 51.840s → 54.440s
  s14: { from: 1555, duration: 78  },

  // Scene 15 — "It feeds that observation back as the next input, and it runs again."
  // CSV words 132-144: 54.440s → 59.140s
  s15: { from: 1633, duration: 141 },

  // Scene 16 — "The loop is what makes it an agent."
  // CSV words 145-152: 59.820s → 61.740s
  s16: { from: 1795, duration: 58  },

  // Scene 17 — "See the difference. The model answers."
  // CSV words 153-158: 62.400s → 64.560s
  s17: { from: 1872, duration: 65  },

  // Scene 18 — "The agent acts, watches, and responds."
  // CSV words 159-164: 65.120s → 67.720s
  s18: { from: 1954, duration: 78  },

  // Scene 19 — "The model is frozen after one step."
  // CSV words 165-171: 68.400s → 70.260s
  s19: { from: 2052, duration: 56  },

  // Scene 20 — "The agent keeps moving."
  // CSV words 172-175: 70.800s → 72.080s
  s20: { from: 2124, duration: 38  },

  // Scene 21 — "The loop is not a feature. It is the definition."
  // CSV words 176-185: 72.740s → 75.680s
  s21: { from: 2182, duration: 88  },

  // Scene 22 — "Without the loop, you have a very powerful calculator."
  // CSV words 186-194: 76.480s → 79.340s
  s22: { from: 2294, duration: 86  },

  // Scene 23 — "With the loop, you have something that can navigate the world."
  // CSV words 195-205: 79.340s → 83.020s
  s23: { from: 2380, duration: 111 },

  // Scene 24 — "The loop is everything."
  // CSV words 206-209: 83.480s → 85.040s
  s24: { from: 2504, duration: 47  },

  // Scene 25 — Outro hold (fade out)
  // 85.040s → 90.000s
  s25: { from: 2551, duration: 149 },
} as const;

// ── Caption lines (for subtitle overlay) ──────────────────────────────────
export const CAPTIONS = [
  { text: "This is day 23 of learning agentic AI from first principles.",
    from: 0, duration: 138 },
  { text: "Last time, we saw structured output.",
    from: 154, duration: 72 },
  { text: "Forcing the model's completion into a machine readable format...",
    from: 242, duration: 146 },
  { text: "...is what turns text into something a program can actually act on.",
    from: 388, duration: 130 },
  { text: "Now, a model and an agent are not the same thing.",
    from: 537, duration: 101 },
  { text: "Most people treat them as interchangeable. They are not.",
    from: 656, duration: 104 },
  { text: "A model takes one input. It produces one output. That is it.",
    from: 760, duration: 170 },
  { text: "One step done.",
    from: 951, duration: 36 },
  { text: "There is no loop. No observation. No adaptation.",
    from: 1009, duration: 164 },
  { text: "You give it a prompt. It gives you a completion. Transaction over.",
    from: 1197, duration: 135 },
  { text: "An agent is different at the architectural level.",
    from: 1357, duration: 86 },
  { text: "An agent takes input, produces output...",
    from: 1458, duration: 121 },
  { text: "...and observes what that output caused in the world.",
    from: 1555, duration: 78 },
  { text: "It feeds that observation back as the next input, and it runs again.",
    from: 1633, duration: 141 },
  { text: "The loop is what makes it an agent.",
    from: 1795, duration: 58 },
  { text: "See the difference. The model answers.",
    from: 1872, duration: 65 },
  { text: "The agent acts, watches, and responds.",
    from: 1954, duration: 78 },
  { text: "The model is frozen after one step.",
    from: 2052, duration: 56 },
  { text: "The agent keeps moving.",
    from: 2124, duration: 38 },
  { text: "The loop is not a feature. It is the definition.",
    from: 2182, duration: 88 },
  { text: "Without the loop, you have a very powerful calculator.",
    from: 2294, duration: 86 },
  { text: "With the loop, you have something that can navigate the world.",
    from: 2380, duration: 111 },
  { text: "The loop is everything.",
    from: 2504, duration: 47 },
] as const;

// ── Animation helpers ──────────────────────────────────────────────────────
/** Linear interpolation */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));

/** Fade in opacity from frameStart over durationFrames */
export const fadeIn = (frame: number, start: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - start) / dur));

/** Fade out opacity */
export const fadeOut = (frame: number, start: number, dur: number): number =>
  1 - Math.min(1, Math.max(0, (frame - start) / dur));

/** Ease snap: fast settle */
export const easeSnap = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** SVG stroke dash animation — returns strokeDashoffset */
export const drawPath = (frame: number, start: number, dur: number, totalLength: number): number => {
  const t = Math.max(0, Math.min(1, (frame - start) / dur));
  return totalLength * (1 - easeSnap(t));
};

/** Scale from fromScale → toScale over dur frames starting at start */
export const scaleAnim = (frame: number, start: number, dur: number, from: number, to: number): number => {
  const t = Math.max(0, Math.min(1, (frame - start) / dur));
  return lerp(from, to, easeSnap(t));
};
