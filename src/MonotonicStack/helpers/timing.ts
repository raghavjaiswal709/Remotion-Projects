/**
 * Monotonic Stack — Timing Constants
 *
 * All values derived STRICTLY from: public/monotonic stack_transcript_timestamps.csv
 *
 * FPS = 60. Tolerance ±0.05s (±3 frames).
 *
 * ┌─────┬────────┬────────┬──────────────────────────────────────────────────────────────────────────────┐
 * │ Line│ Start  │  End   │ Text                                                                         │
 * ├─────┼────────┼────────┼──────────────────────────────────────────────────────────────────────────────┤
 * │  1  │  0.000 │  4.160 │ Quick question, why do stocks suddenly crash, but never warn you before?     │
 * │  2  │  4.840 │  7.380 │ Day five of turning you into an interview pattern machine.                   │
 * │  3  │  8.180 │ 12.400 │ Today's weapon, monotonic stack, they give you an array and ask scary...     │
 * │  4  │ 12.960 │ 13.720 │ Next, greater element?                                                       │
 * │  5  │ 14.340 │ 17.440 │ Previous smaller? Stock span? Daily temperatures?                             │
 * │  6  │ 18.000 │ 20.380 │ Most people panic. They look left? They look right?                           │
 * │  7  │ 21.100 │ 23.040 │ Nested loops everywhere. That's slow.                                        │
 * │  8  │ 23.480 │ 24.900 │ And interviewers hate slow.                                                  │
 * │  9  │ 25.440 │ 28.860 │ Here's the smarter way. Use a stack, but not any stack.                      │
 * │ 10  │ 28.860 │ 33.180 │ A monotonic stack. That means the stack is always increasing or decreasing.  │
 * │ 11  │ 33.960 │ 36.640 │ Now pay attention. You scan the array from left to right.                    │
 * │ 12  │ 37.020 │ 39.540 │ For each element, while the stack breaks the rule you pop.                   │
 * │ 13  │ 39.920 │ 42.900 │ When the rule is safe, you push that pop moment. That's the answer.          │
 * │ 14  │ 43.220 │ 47.540 │ Why? Because the element being popped just found its next greater or smaller.│
 * │ 15  │ 48.160 │ 51.520 │ One push, one pop. No element is touched twice.                              │
 * │ 16  │ 52.140 │ 55.060 │ That's why this works. Time complexity becomes O of N.                       │
 * │ 17  │ 55.340 │ 58.240 │ No backtracking, no rechecking. This pattern shows up everywhere.            │
 * │ 18  │ 59.000 │ 62.700 │ Next, greater element? Daily temperatures? Largest rectangle in histogram?   │
 * │ 19  │ 63.140 │ 67.520 │ Stock span problem? Once this clicks, array problems start feeling easy.     │
 * │ 20  │ 68.260 │ 71.180 │ Monotonic stack? Control the stack? Reveal the future?                       │
 * │ 21  │ 71.780 │ 72.300 │ Crack interview.                                                             │
 * └─────┴────────┴────────┴──────────────────────────────────────────────────────────────────────────────┘
 *
 * Scene mapping (11 scenes):
 *   Scene 1  (CrashHook):       L1-2    →  0.00 –  7.38s   — Eye-catching crash + Day 5 badge
 *   Scene 2  (WeaponIntro):     L3-5    →  8.18 – 17.44s   — Monotonic stack intro + scary questions
 *   Scene 3  (PanicMode):       L6-8    → 18.00 – 24.90s   — Nested loops chaos
 *   Scene 4  (SmarterWay):      L9-10   → 25.44 – 33.18s   — Stack reveal + monotonic property
 *   Scene 5  (ScanAlgorithm):   L11-13  → 33.96 – 42.90s   — Scan + pop + push walkthrough
 *   Scene 6  (WhyItWorks):      L14-15  → 43.22 – 51.52s   — Popped = answer revelation
 *   Scene 7  (Complexity):      L16-17  → 52.14 – 58.24s   — O(N) proof
 *   Scene 8  (Applications):    L18-19  → 59.00 – 67.52s   — Use cases grid
 *   Scene 9  (Outro):           L20-21  → 68.26 – 72.30s   — Final tagline + crack interview
 */

export const FPS = 60;

export const toFrame = (seconds: number): number => Math.round(seconds * FPS);

export const TOTAL_DURATION_S = 72.30;
export const TOTAL_FRAMES = toFrame(TOTAL_DURATION_S); // 4338

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENES — absolute from / duration in frames
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SCENES = {
    crashHook: {
        from: toFrame(0.0),
        duration: toFrame(7.38) - toFrame(0.0),
    },
    weaponIntro: {
        from: toFrame(8.18),
        duration: toFrame(17.44) - toFrame(8.18),
    },
    panicMode: {
        from: toFrame(18.00),
        duration: toFrame(24.90) - toFrame(18.00),
    },
    smarterWay: {
        from: toFrame(25.44),
        duration: toFrame(33.18) - toFrame(25.44),
    },
    scanAlgorithm: {
        from: toFrame(33.96),
        duration: toFrame(42.90) - toFrame(33.96),
    },
    whyItWorks: {
        from: toFrame(43.22),
        duration: toFrame(51.52) - toFrame(43.22),
    },
    complexity: {
        from: toFrame(52.14),
        duration: toFrame(58.24) - toFrame(52.14),
    },
    applications: {
        from: toFrame(59.00),
        duration: toFrame(67.52) - toFrame(59.00),
    },
    outro: {
        from: toFrame(68.26),
        duration: toFrame(72.30) - toFrame(68.26),
    },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PER-LINE TIMING — relative to each scene's first frame = 0
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LINE_TIMING = {
    // Scene 1: CrashHook (base=0.00)
    L1:  { start: toFrame(0.0),    end: toFrame(4.16)  },
    L2:  { start: toFrame(4.84),   end: toFrame(7.38)  },
    // Scene 2: WeaponIntro (base=8.18)
    L3:  { start: toFrame(0.0),    end: toFrame(4.22)  },
    L4:  { start: toFrame(4.78),   end: toFrame(5.54)  },
    L5:  { start: toFrame(6.16),   end: toFrame(9.26)  },
    // Scene 3: PanicMode (base=18.00)
    L6:  { start: toFrame(0.0),    end: toFrame(2.38)  },
    L7:  { start: toFrame(3.10),   end: toFrame(5.04)  },
    L8:  { start: toFrame(5.48),   end: toFrame(6.90)  },
    // Scene 4: SmarterWay (base=25.44)
    L9:  { start: toFrame(0.0),    end: toFrame(3.42)  },
    L10: { start: toFrame(3.42),   end: toFrame(7.74)  },
    // Scene 5: ScanAlgorithm (base=33.96)
    L11: { start: toFrame(0.0),    end: toFrame(2.68)  },
    L12: { start: toFrame(3.06),   end: toFrame(5.58)  },
    L13: { start: toFrame(5.96),   end: toFrame(8.94)  },
    // Scene 6: WhyItWorks (base=43.22)
    L14: { start: toFrame(0.0),    end: toFrame(4.32)  },
    L15: { start: toFrame(4.94),   end: toFrame(8.30)  },
    // Scene 7: Complexity (base=52.14)
    L16: { start: toFrame(0.0),    end: toFrame(2.92)  },
    L17: { start: toFrame(3.20),   end: toFrame(6.10)  },
    // Scene 8: Applications (base=59.00)
    L18: { start: toFrame(0.0),    end: toFrame(3.70)  },
    L19: { start: toFrame(4.14),   end: toFrame(8.52)  },
    // Scene 9: Outro (base=68.26)
    L20: { start: toFrame(0.0),    end: toFrame(2.92)  },
    L21: { start: toFrame(3.52),   end: toFrame(4.04)  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMO DATA — stock prices array used for stack walkthroughs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Demo array: stock prices for "Next Greater Element" walkthrough */
export const DEMO_ARRAY = [4, 2, 1, 5, 3, 6] as const;

/** Step-by-step monotonic stack walkthrough (decreasing stack → next greater) */
export const STACK_STEPS: readonly {
    index: number;
    value: number;
    action: 'push' | 'pop' | 'pop-push';
    stack: number[];
    popped: number[];
    answer: { index: number; value: number; nge: number }[];
}[] = [
    { index: 0, value: 4, action: 'push',     stack: [4],        popped: [],     answer: [] },
    { index: 1, value: 2, action: 'push',     stack: [4, 2],     popped: [],     answer: [] },
    { index: 2, value: 1, action: 'push',     stack: [4, 2, 1],  popped: [],     answer: [] },
    { index: 3, value: 5, action: 'pop-push', stack: [5],        popped: [1,2,4], answer: [
        { index: 2, value: 1, nge: 5 },
        { index: 1, value: 2, nge: 5 },
        { index: 0, value: 4, nge: 5 },
    ]},
    { index: 4, value: 3, action: 'push',     stack: [5, 3],     popped: [],     answer: [] },
    { index: 5, value: 6, action: 'pop-push', stack: [6],        popped: [3,5],  answer: [
        { index: 4, value: 3, nge: 6 },
        { index: 3, value: 5, nge: 6 },
    ]},
];

/** NGE result array for display */
export const NGE_RESULT = [5, 5, 5, 6, 6, -1] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN TOKENS — Bright, high-contrast for dark backgrounds
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ACCENT = '#60A5FA';       // blue-400
export const ACCENT_LIGHT = '#BFDBFE'; // blue-200

export const DANGER = '#F87171';       // red-400
export const DANGER_LIGHT = '#FECACA'; // red-200

export const SUCCESS = '#4ADE80';      // green-400
export const SUCCESS_LIGHT = '#BBF7D0'; // green-200

export const WARN = '#FBBF24';         // amber-400
export const PURPLE = '#A78BFA';       // violet-400

export const STACK_COLOR = ACCENT;
export const POP_COLOR = DANGER;
export const PUSH_COLOR = SUCCESS;
export const ANSWER_COLOR = WARN;
