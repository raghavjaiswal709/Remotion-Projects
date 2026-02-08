/**
 * Intervals Pattern — Timing Constants
 *
 * All values derived STRICTLY from: public/intervalspatterns_transcript_timestamps.csv
 *
 * FPS = 60. Tolerance ±0.05s (±3 frames).
 *
 * ┌─────┬────────┬────────┬──────────────────────────────────────────────────────────────────┐
 * │ Line│ Start  │  End   │ Text                                                             │
 * ├─────┼────────┼────────┼──────────────────────────────────────────────────────────────────┤
 * │  1  │  0.000 │  2.080 │ Before you scroll, this one saves interviews.                    │
 * │  2  │  2.620 │  4.720 │ Day four of turning you into a pattern first thinker.            │
 * │  3  │  4.960 │  6.720 │ Today's weapon, intervals pattern.                               │
 * │  4  │  7.180 │ 10.400 │ They give you ranges, meetings, time slots, schedules.           │
 * │  5  │ 11.000 │ 12.620 │ And then they ask, can these overlap?                            │
 * │  6  │ 13.060 │ 13.660 │ Can you merge them?                                              │
 * │  7  │ 14.220 │ 15.140 │ What's the minimum needed?                                      │
 * │  8  │ 15.820 │ 16.500 │ Most people freeze.                                              │
 * │  9  │ 17.120 │ 18.620 │ They compare everything with everything.                        │
 * │ 10  │ 19.220 │ 21.900 │ Nested loops, messy logic, instant rejection.                   │
 * │ 11  │ 22.520 │ 23.360 │ Here's the clean way.                                            │
 * │ 12  │ 23.900 │ 25.580 │ First rule, sort the intervals.                                  │
 * │ 13  │ 26.540 │ 28.300 │ Always, now listen carefully.                                    │
 * │ 14  │ 28.300 │ 29.480 │ Take the first interval.                                         │
 * │ 15  │ 29.800 │ 30.640 │ That's your current window.                                      │
 * │ 16  │ 30.860 │ 31.660 │ Move to the next one.                                            │
 * │ 17  │ 32.060 │ 33.360 │ If it overlaps, merge it.                                        │
 * │ 18  │ 33.460 │ 34.720 │ If it doesn't, close the window.                                 │
 * │ 19  │ 35.180 │ 35.920 │ Start a new one.                                                 │
 * │ 20  │ 36.500 │ 37.360 │ That's the whole pattern.                                        │
 * │ 21  │ 38.060 │ 41.300 │ Overlapping means next start ≤ current end.                      │
 * │ 22  │ 41.800 │ 44.020 │ Merging means update the end to the maximum.                     │
 * │ 23  │ 44.620 │ 45.780 │ No comparisons explosion.                                        │
 * │ 24  │ 46.300 │ 46.900 │ No confusion.                                                    │
 * │ 25  │ 47.240 │ 47.860 │ Just one pass.                                                   │
 * │ 26  │ 48.420 │ 51.000 │ This turns your solution into O of N log N for sorting           │
 * │ 27  │ 51.000 │ 52.460 │ and O of N for the scan.                                         │
 * │ 28  │ 53.240 │ 54.900 │ Interview clean, logic clean.                                    │
 * │ 29  │ 55.400 │ 56.640 │ This pattern solves everything.                                  │
 * │ 30  │ 56.640 │ 59.460 │ Merge intervals, meeting rooms, insert interval,                 │
 * │ 31  │ 59.800 │ 60.700 │ employee free time.                                              │
 * │ 32  │ 61.140 │ 62.480 │ Once you see intervals as windows,                               │
 * │ 33  │ 62.920 │ 64.420 │ half the problem is already solved.                              │
 * │ 34  │ 64.880 │ 65.540 │ Intervals pattern.                                               │
 * │ 35  │ 65.920 │ 67.460 │ Sort first, scan once,                                           │
 * └─────┴────────┴────────┴──────────────────────────────────────────────────────────────────┘
 *
 * Scene mapping (11 scenes):
 *   Scene 1  (ScrollHook):      L1-2    →  0.00 –  4.72s
 *   Scene 2  (WeaponIntro):     L3-4    →  4.96 – 10.40s
 *   Scene 3  (ProblemSetup):    L5-7    → 11.00 – 15.14s
 *   Scene 4  (PanicMode):       L8-10   → 15.82 – 21.90s
 *   Scene 5  (CleanWay):        L11-13  → 22.52 – 28.30s
 *   Scene 6  (AlgorithmWalk):   L14-19  → 28.30 – 35.92s
 *   Scene 7  (PatternExplained):L20-25  → 36.50 – 47.86s
 *   Scene 8  (Complexity):      L26-28  → 48.42 – 54.90s
 *   Scene 9  (Applications):    L29-31  → 55.40 – 60.70s
 *   Scene 10 (WindowInsight):   L32-33  → 61.14 – 64.42s
 *   Scene 11 (Outro):           L34-35  → 64.88 – 67.46s
 */

export const FPS = 60;

export const toFrame = (seconds: number): number => Math.round(seconds * FPS);

export const TOTAL_DURATION_S = 67.46;
export const TOTAL_FRAMES = toFrame(TOTAL_DURATION_S); // 4048

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENES — absolute from / duration in frames
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SCENES = {
    scrollHook: {
        from: toFrame(0.0),
        duration: toFrame(4.72) - toFrame(0.0),
    },
    weaponIntro: {
        from: toFrame(4.96),
        duration: toFrame(10.40) - toFrame(4.96),
    },
    problemSetup: {
        from: toFrame(11.00),
        duration: toFrame(15.14) - toFrame(11.00),
    },
    panicMode: {
        from: toFrame(15.82),
        duration: toFrame(21.90) - toFrame(15.82),
    },
    cleanWay: {
        from: toFrame(22.52),
        duration: toFrame(28.30) - toFrame(22.52),
    },
    algorithmWalk: {
        from: toFrame(28.30),
        duration: toFrame(35.92) - toFrame(28.30),
    },
    patternExplained: {
        from: toFrame(36.50),
        duration: toFrame(47.86) - toFrame(36.50),
    },
    complexity: {
        from: toFrame(48.42),
        duration: toFrame(54.90) - toFrame(48.42),
    },
    applications: {
        from: toFrame(55.40),
        duration: toFrame(60.70) - toFrame(55.40),
    },
    windowInsight: {
        from: toFrame(61.14),
        duration: toFrame(64.42) - toFrame(61.14),
    },
    outro: {
        from: toFrame(64.88),
        duration: toFrame(67.46) - toFrame(64.88),
    },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PER-LINE TIMING — relative to each scene's first frame = 0
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LINE_TIMING = {
    // Scene 1: ScrollHook (base=0.00)
    L1:  { start: toFrame(0.0),    end: toFrame(2.08)  },
    L2:  { start: toFrame(2.62),   end: toFrame(4.72)  },
    // Scene 2: WeaponIntro (base=4.96)
    L3:  { start: toFrame(0.0),    end: toFrame(1.76)  },
    L4:  { start: toFrame(2.22),   end: toFrame(5.44)  },
    // Scene 3: ProblemSetup (base=11.00)
    L5:  { start: toFrame(0.0),    end: toFrame(1.62)  },
    L6:  { start: toFrame(2.06),   end: toFrame(2.66)  },
    L7:  { start: toFrame(3.22),   end: toFrame(4.14)  },
    // Scene 4: PanicMode (base=15.82)
    L8:  { start: toFrame(0.0),    end: toFrame(0.68)  },
    L9:  { start: toFrame(1.30),   end: toFrame(2.80)  },
    L10: { start: toFrame(3.40),   end: toFrame(6.08)  },
    // Scene 5: CleanWay (base=22.52)
    L11: { start: toFrame(0.0),    end: toFrame(0.84)  },
    L12: { start: toFrame(1.38),   end: toFrame(3.06)  },
    L13: { start: toFrame(4.02),   end: toFrame(5.78)  },
    // Scene 6: AlgorithmWalk (base=28.30)
    L14: { start: toFrame(0.0),    end: toFrame(1.18)  },
    L15: { start: toFrame(1.50),   end: toFrame(2.34)  },
    L16: { start: toFrame(2.56),   end: toFrame(3.36)  },
    L17: { start: toFrame(3.76),   end: toFrame(5.06)  },
    L18: { start: toFrame(5.16),   end: toFrame(6.42)  },
    L19: { start: toFrame(6.88),   end: toFrame(7.62)  },
    // Scene 7: PatternExplained (base=36.50)
    L20: { start: toFrame(0.0),    end: toFrame(0.86)  },
    L21: { start: toFrame(1.56),   end: toFrame(4.80)  },
    L22: { start: toFrame(5.30),   end: toFrame(7.52)  },
    L23: { start: toFrame(8.12),   end: toFrame(9.28)  },
    L24: { start: toFrame(9.80),   end: toFrame(10.40) },
    L25: { start: toFrame(10.74),  end: toFrame(11.36) },
    // Scene 8: Complexity (base=48.42)
    L26: { start: toFrame(0.0),    end: toFrame(2.58)  },
    L27: { start: toFrame(2.58),   end: toFrame(4.04)  },
    L28: { start: toFrame(4.82),   end: toFrame(6.48)  },
    // Scene 9: Applications (base=55.40)
    L29: { start: toFrame(0.0),    end: toFrame(1.24)  },
    L30: { start: toFrame(1.24),   end: toFrame(4.06)  },
    L31: { start: toFrame(4.40),   end: toFrame(5.30)  },
    // Scene 10: WindowInsight (base=61.14)
    L32: { start: toFrame(0.0),    end: toFrame(1.34)  },
    L33: { start: toFrame(1.78),   end: toFrame(3.28)  },
    // Scene 11: Outro (base=64.88)
    L34: { start: toFrame(0.0),    end: toFrame(0.66)  },
    L35: { start: toFrame(1.04),   end: toFrame(2.58)  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INTERVAL DEMO DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Unsorted intervals for the merge demo */
export const UNSORTED_INTERVALS: readonly [number, number][] = [
    [6, 8],
    [1, 3],
    [2, 5],
    [9, 12],
    [8, 10],
];

/** Sorted intervals (by start time) */
export const SORTED_INTERVALS: readonly [number, number][] = [
    [1, 3],
    [2, 5],
    [6, 8],
    [8, 10],
    [9, 12],
];

/** Merged result */
export const MERGED_INTERVALS: readonly [number, number][] = [
    [1, 5],
    [6, 12],
];

/**
 * Step-by-step merge walk:
 * Start with [1,3]. Next [2,5] overlaps (2<=3) → merge to [1,5].
 * Next [6,8] no overlap (6>5) → close [1,5], new window [6,8].
 * Next [8,10] overlaps (8<=8) → merge to [6,10].
 * Next [9,12] overlaps (9<=10) → merge to [6,12].
 * Done → [[1,5],[6,12]]
 */
export const MERGE_STEPS: readonly {
    current: [number, number];
    next: [number, number] | null;
    overlaps: boolean;
    result: [number, number];
    action: 'init' | 'merge' | 'close' | 'done';
}[] = [
    { current: [1, 3],  next: [2, 5],   overlaps: true,  result: [1, 5],   action: 'init' },
    { current: [1, 5],  next: [6, 8],   overlaps: false, result: [1, 5],   action: 'merge' },
    { current: [6, 8],  next: [8, 10],  overlaps: true,  result: [6, 10],  action: 'close' },
    { current: [6, 10], next: [9, 12],  overlaps: true,  result: [6, 12],  action: 'merge' },
    { current: [6, 12], next: null,     overlaps: false, result: [6, 12],  action: 'done' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN TOKENS — Bright, high-contrast colors for dark backgrounds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ACCENT = '#60A5FA';       // blue-400 (brighter)
export const ACCENT_LIGHT = '#BFDBFE'; // blue-200

export const DANGER = '#F87171';       // red-400 (brighter)
export const DANGER_LIGHT = '#FECACA'; // red-200

export const SUCCESS = '#4ADE80';      // green-400 (brighter)
export const SUCCESS_LIGHT = '#BBF7D0'; // green-200

export const WARN = '#FBBF24';         // amber-400 (brighter)

/** Active interval window color */
export const INTERVAL_ACTIVE = ACCENT;
/** Overlap conflict color */
export const INTERVAL_CONFLICT = DANGER;
/** Merged result color */
export const INTERVAL_MERGED = SUCCESS;
/** Faded / inactive color */
export const INTERVAL_FADED = '#94A3B8'; // slate-400 (brighter)

/** Timeline axis color */
export const AXIS_COLOR = '#64748B';    // slate-500 (brighter)
/** Grid color */
export const GRID_COLOR = '#334155';    // slate-700
