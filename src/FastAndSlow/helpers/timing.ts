/**
 * Fast & Slow Pointers — Timing Constants
 *
 * All values derived STRICTLY from: public/fast and alow.csv
 *
 * FPS = 60. Tolerance ±0.05s (±3 frames).
 *
 * ┌─────┬────────┬────────┬──────────────────────────────────────────────────────────────────┐
 * │ Line│ Start  │  End   │ Text                                                             │
 * ├─────┼────────┼────────┼──────────────────────────────────────────────────────────────────┤
 * │  1  │  0.000 │  2.980 │ While you scroll, let's revise this for your next interview.     │
 * │  2  │  3.600 │  5.800 │ Day 3 of turning you into a logic machine.                       │
 * │  3  │  6.220 │  8.640 │ Today's weapon, fast and slow pointers.                          │
 * │  4  │  9.200 │ 11.900 │ This pattern looks simple, and that's why people miss it.        │
 * │  5  │ 12.360 │ 14.300 │ You're given a linked list or a sequence,                        │
 * │  6  │ 14.700 │ 15.780 │ and they ask something scary.                                    │
 * │  7  │ 16.260 │ 16.960 │ Is there a cycle?                                                │
 * │  8  │ 17.440 │ 17.960 │ Find the middle.                                                 │
 * │  9  │ 18.320 │ 19.000 │ Detect a loop.                                                   │
 * │ 10  │ 19.520 │ 20.340 │ Most people panic.                                               │
 * │ 11  │ 20.720 │ 21.600 │ They use extra memory.                                           │
 * │ 12  │ 21.960 │ 22.720 │ They overthink.                                                  │
 * │ 13  │ 23.080 │ 23.700 │ That's a mistake.                                                │
 * │ 14  │ 24.220 │ 25.140 │ Here's the smarter way.                                          │
 * │ 15  │ 25.540 │ 26.160 │ Use two pointers.                                                │
 * │ 16  │ 26.640 │ 27.320 │ One moves slow.                                                  │
 * │ 17  │ 27.640 │ 28.260 │ One moves fast.                                                  │
 * │ 18  │ 28.680 │ 29.480 │ Slow moves one step.                                             │
 * │ 19  │ 29.480 │ 31.140 │ Fast moves two steps.                                            │
 * │ 20  │ 31.700 │ 32.480 │ Now pay attention.                                               │
 * │ 21  │ 32.840 │ 35.300 │ If there's a cycle, fast will eventually catch slow.             │
 * │ 22  │ 35.640 │ 35.780 │ Why?                                                             │
 * │ 23  │ 35.940 │ 37.860 │ Because fast is literally chasing slow.                          │
 * │ 24  │ 38.440 │ 40.060 │ If there's no cycle, fast hits the end.                          │
 * │ 25  │ 40.380 │ 40.640 │ Simple.                                                          │
 * │ 26  │ 41.180 │ 42.200 │ Clean, brilliant.                                                │
 * │ 27  │ 42.860 │ 43.720 │ Want the middle of a list?                                       │
 * │ 28  │ 44.040 │ 46.820 │ By the time fast reaches the end, slow is at the middle.         │
 * │ 29  │ 47.080 │ 47.520 │ No counting.                                                     │
 * │ 30  │ 47.980 │ 48.600 │ No extra space.                                                  │
 * │ 31  │ 49.100 │ 49.440 │ No tricks.                                                       │
 * │ 32  │ 49.980 │ 53.160 │ This drops complexity to O of N time and O of 1 space.           │
 * │ 33  │ 53.620 │ 54.400 │ Interviewers love this.                                          │
 * │ 34  │ 54.780 │ 55.340 │ Cycle detection.                                                 │
 * │ 35  │ 55.780 │ 56.180 │ Middle element.                                                  │
 * │ 36  │ 56.560 │ 57.020 │ Happy numbers.                                                   │
 * │ 37  │ 57.460 │ 58.240 │ Circular arrays.                                                 │
 * │ 38  │ 58.800 │ 61.260 │ Once this clicks, linked list questions stop being scary.        │
 * │ 39  │ 61.700 │ 62.660 │ Fast and slow pointers.                                          │
 * │ 40  │ 62.960 │ 63.440 │ Two speeds.                                                      │
 * │ 41  │ 63.860 │ 64.340 │ One brain.                                                       │
 * └─────┴────────┴────────┴──────────────────────────────────────────────────────────────────┘
 *
 * Scene mapping (12 scenes):
 *   Scene 1  (ScrollHook):     L1-2    →  0.00 –  5.80s
 *   Scene 2  (WeaponIntro):    L3-4    →  6.22 – 11.90s
 *   Scene 3  (ProblemSetup):   L5-9    → 12.36 – 19.00s
 *   Scene 4  (PanicMode):      L10-13  → 19.52 – 23.70s
 *   Scene 5  (SmarterWay):     L14-17  → 24.22 – 28.26s
 *   Scene 6  (AlgorithmDemo):  L18-19  → 28.68 – 31.14s
 *   Scene 7  (CycleDetection): L20-25  → 31.70 – 40.64s
 *   Scene 8  (MiddleElement):  L26-31  → 41.18 – 49.44s
 *   Scene 9  (ComplexityDrop): L32-33  → 49.98 – 54.40s
 *   Scene 10 (Applications):   L34-37  → 54.78 – 58.24s
 *   Scene 11 (Confidence):     L38     → 58.80 – 61.26s
 *   Scene 12 (Outro):          L39-41  → 61.70 – 64.34s
 */

export const FPS = 60;

export const toFrame = (seconds: number): number => Math.round(seconds * FPS);

export const TOTAL_DURATION_S = 64.34;
export const TOTAL_FRAMES = toFrame(TOTAL_DURATION_S); // 3860

export const SCENES = {
    scrollHook: {
        from: toFrame(0.0),
        duration: toFrame(5.80) - toFrame(0.0),
    },
    weaponIntro: {
        from: toFrame(6.22),
        duration: toFrame(11.90) - toFrame(6.22),
    },
    problemSetup: {
        from: toFrame(12.36),
        duration: toFrame(19.00) - toFrame(12.36),
    },
    panicMode: {
        from: toFrame(19.52),
        duration: toFrame(23.70) - toFrame(19.52),
    },
    smarterWay: {
        from: toFrame(24.22),
        duration: toFrame(28.26) - toFrame(24.22),
    },
    algorithmDemo: {
        from: toFrame(28.68),
        duration: toFrame(31.14) - toFrame(28.68),
    },
    cycleDetection: {
        from: toFrame(31.70),
        duration: toFrame(40.64) - toFrame(31.70),
    },
    middleElement: {
        from: toFrame(41.18),
        duration: toFrame(49.44) - toFrame(41.18),
    },
    complexityDrop: {
        from: toFrame(49.98),
        duration: toFrame(54.40) - toFrame(49.98),
    },
    applications: {
        from: toFrame(54.78),
        duration: toFrame(58.24) - toFrame(54.78),
    },
    confidence: {
        from: toFrame(58.80),
        duration: toFrame(61.26) - toFrame(58.80),
    },
    outro: {
        from: toFrame(61.70),
        duration: toFrame(64.34) - toFrame(61.70),
    },
} as const;

/**
 * Per-line timing — relative to each scene's first frame = 0.
 */
export const LINE_TIMING = {
    // Scene 1: ScrollHook (base=0.00)
    L1:  { start: toFrame(0.0),    end: toFrame(2.98)  },
    L2:  { start: toFrame(3.60),   end: toFrame(5.80)  },
    // Scene 2: WeaponIntro (base=6.22)
    L3:  { start: toFrame(0.0),    end: toFrame(2.42)  },
    L4:  { start: toFrame(2.98),   end: toFrame(5.68)  },
    // Scene 3: ProblemSetup (base=12.36)
    L5:  { start: toFrame(0.0),    end: toFrame(1.94)  },
    L6:  { start: toFrame(2.34),   end: toFrame(3.42)  },
    L7:  { start: toFrame(3.90),   end: toFrame(4.60)  },
    L8:  { start: toFrame(5.08),   end: toFrame(5.60)  },
    L9:  { start: toFrame(5.96),   end: toFrame(6.64)  },
    // Scene 4: PanicMode (base=19.52)
    L10: { start: toFrame(0.0),    end: toFrame(0.82)  },
    L11: { start: toFrame(1.20),   end: toFrame(2.08)  },
    L12: { start: toFrame(2.44),   end: toFrame(3.20)  },
    L13: { start: toFrame(3.56),   end: toFrame(4.18)  },
    // Scene 5: SmarterWay (base=24.22)
    L14: { start: toFrame(0.0),    end: toFrame(0.92)  },
    L15: { start: toFrame(1.32),   end: toFrame(1.94)  },
    L16: { start: toFrame(2.42),   end: toFrame(3.10)  },
    L17: { start: toFrame(3.42),   end: toFrame(4.04)  },
    // Scene 6: AlgorithmDemo (base=28.68)
    L18: { start: toFrame(0.0),    end: toFrame(0.80)  },
    L19: { start: toFrame(0.80),   end: toFrame(2.46)  },
    // Scene 7: CycleDetection (base=31.70)
    L20: { start: toFrame(0.0),    end: toFrame(0.78)  },
    L21: { start: toFrame(1.14),   end: toFrame(3.60)  },
    L22: { start: toFrame(3.94),   end: toFrame(4.08)  },
    L23: { start: toFrame(4.24),   end: toFrame(6.16)  },
    L24: { start: toFrame(6.74),   end: toFrame(8.36)  },
    L25: { start: toFrame(8.68),   end: toFrame(8.94)  },
    // Scene 8: MiddleElement (base=41.18)
    L26: { start: toFrame(0.0),    end: toFrame(1.02)  },
    L27: { start: toFrame(1.68),   end: toFrame(2.54)  },
    L28: { start: toFrame(2.86),   end: toFrame(5.64)  },
    L29: { start: toFrame(5.90),   end: toFrame(6.34)  },
    L30: { start: toFrame(6.80),   end: toFrame(7.42)  },
    L31: { start: toFrame(7.92),   end: toFrame(8.26)  },
    // Scene 9: ComplexityDrop (base=49.98)
    L32: { start: toFrame(0.0),    end: toFrame(3.18)  },
    L33: { start: toFrame(3.64),   end: toFrame(4.42)  },
    // Scene 10: Applications (base=54.78)
    L34: { start: toFrame(0.0),    end: toFrame(0.56)  },
    L35: { start: toFrame(1.00),   end: toFrame(1.40)  },
    L36: { start: toFrame(1.78),   end: toFrame(2.24)  },
    L37: { start: toFrame(2.68),   end: toFrame(3.46)  },
    // Scene 11: Confidence (base=58.80)
    L38: { start: toFrame(0.0),    end: toFrame(2.46)  },
    // Scene 12: Outro (base=61.70)
    L39: { start: toFrame(0.0),    end: toFrame(0.96)  },
    L40: { start: toFrame(1.26),   end: toFrame(1.74)  },
    L41: { start: toFrame(2.16),   end: toFrame(2.64)  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LINKED LIST DEMO DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Linked list for cycle detection demo.
 * Nodes: [1, 2, 3, 4, 5, 6, 7, 8]
 * Cycle: node 8 → node 3 (cycle start at index 2)
 */
export const LINKED_LIST_NODES = [1, 2, 3, 4, 5, 6, 7, 8];
export const CYCLE_START_IDX = 2; // node 3

/**
 * Step-by-step cycle detection walk (Floyd's algorithm).
 * slow +1, fast +2. Using circular indices after reaching end.
 * With cycle 8→3:
 *   Step 0: slow=0, fast=0 (start)
 *   Step 1: slow=1, fast=2
 *   Step 2: slow=2, fast=4
 *   Step 3: slow=3, fast=6
 *   Step 4: slow=4, fast=2 (fast wraps: 8→3→4, i.e. idx 2)
 *   Step 5: slow=5, fast=4
 *   Step 6: slow=6, fast=6 ← MEET!
 */
export const CYCLE_STEPS: readonly { slow: number; fast: number; met: boolean }[] = [
    { slow: 0, fast: 0, met: false },
    { slow: 1, fast: 2, met: false },
    { slow: 2, fast: 4, met: false },
    { slow: 3, fast: 6, met: false },
    { slow: 4, fast: 2, met: false },
    { slow: 5, fast: 4, met: false },
    { slow: 6, fast: 6, met: true },
];

/**
 * Middle-finding demo: list of 9 nodes.
 * slow +1, fast +2. When fast reaches end, slow is at middle.
 */
export const MIDDLE_LIST = [10, 20, 30, 40, 50, 60, 70, 80, 90];
export const MIDDLE_STEPS: readonly { slow: number; fast: number; done: boolean }[] = [
    { slow: 0, fast: 0, done: false },
    { slow: 1, fast: 2, done: false },
    { slow: 2, fast: 4, done: false },
    { slow: 3, fast: 6, done: false },
    { slow: 4, fast: 8, done: true },  // fast at end, slow at middle (index 4 = 50)
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ACCENT = '#2563EB';       // blue-600
export const ACCENT_LIGHT = '#93C5FD'; // blue-300

export const DANGER = '#EF4444';       // red-500
export const DANGER_LIGHT = '#FCA5A5'; // red-300

export const SUCCESS = '#22C55E';      // green-500
export const SUCCESS_LIGHT = '#86EFAC'; // green-300

export const WARN = '#F59E0B';         // amber-500

/** Slow pointer color — blue */
export const PTR_SLOW = ACCENT;
/** Fast pointer color — green */
export const PTR_FAST = '#059669';     // emerald-600
