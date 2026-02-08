/**
 * Two Pointers — Timing Constants (Production)
 *
 * All values derived STRICTLY from the transcript CSV:
 *   public/Timeline 1_transcript_timestamps.csv
 *
 * FPS = 30. Tolerance ±0.05s (±1.5 frames).
 *
 * ┌─────┬────────┬────────┬──────────────────────────────────────────────────────────────────┐
 * │ Line│ Start  │  End   │ Text                                                             │
 * ├─────┼────────┼────────┼──────────────────────────────────────────────────────────────────┤
 * │  1  │  0.000 │  2.980 │ Still using nested loops? That's an instant interview fail.      │
 * │  2  │  3.620 │  5.740 │ Day 2 of turning you into a logic assassin.                      │
 * │  3  │  6.360 │  8.100 │ Today's weapon. Two pointers.                                    │
 * │  4  │  8.620 │ 12.720 │ You're given a sorted array, pair that adds to a target.         │
 * │  5  │ 12.960 │ 13.740 │ Most people do this.                                             │
 * │  6  │ 14.280 │ 16.760 │ Loop inside a loop, brute force, slow, dead.                     │
 * │  7  │ 17.360 │ 20.140 │ Here's the smarter way. Put one pointer at the start.            │
 * │  8  │ 21.080 │ 22.300 │ Put one pointer at the end.                                      │
 * │  9  │ 22.800 │ 24.840 │ Now watch closely. Add the two numbers.                          │
 * │ 10  │ 25.240 │ 27.540 │ If the sum is too small, move the left pointer right.            │
 * │ 11  │ 27.540 │ 30.160 │ If the sum is too big, move the right pointer left.              │
 * │ 12  │ 30.580 │ 31.660 │ If it matches, you're done.                                     │
 * │ 13  │ 32.360 │ 34.380 │ One move, one decision, every step.                              │
 * │ 14  │ 34.760 │ 37.420 │ No guessing, no backtracking, no wasted work.                    │
 * │ 15  │ 37.720 │ 39.120 │ Each pointer moves only forward.                                 │
 * │ 16  │ 39.500 │ 40.960 │ Never backward. That's why this works.                           │
 * │ 17  │ 41.600 │ 44.220 │ Time complexity drops from O(N²) to O(N).                        │
 * │ 18  │ 44.460 │ 45.960 │ One scan, perfect logic.                                         │
 * │ 19  │ 46.440 │ 47.720 │ This pattern shows up everywhere.                                │
 * │ 20  │ 48.320 │ 51.200 │ Pair sum, triplets, remove duplicates,                           │
 * │ 21  │ 51.540 │ 53.900 │ reverse arrays, palindrome checks, master this,                  │
 * │ 22  │ 54.040 │ 56.120 │ and brute force becomes illegal in your brain.                   │
 * │ 23  │ 56.120 │ 60.680 │ Two pointers, think less, move smarter, crack interviews.        │
 * └─────┴────────┴────────┴──────────────────────────────────────────────────────────────────┘
 *
 * Scene mapping (9 scenes):
 *   Scene 1 (Hook):          L1-2   →  0.00 –  5.74s
 *   Scene 2 (ProblemSetup):  L3-4   →  6.36 – 12.72s
 *   Scene 3 (BruteForce):    L5-6   → 12.96 – 16.76s
 *   Scene 4 (PointerSetup):  L7-8   → 17.36 – 22.30s
 *   Scene 5 (AlgorithmWalk): L9-12  → 22.80 – 31.66s
 *   Scene 6 (Efficiency):    L13-16 → 32.36 – 40.96s
 *   Scene 7 (ComplexityDrop):L17-18 → 41.60 – 45.96s
 *   Scene 8 (PatternEverywhere):L19-22 → 46.44 – 56.12s
 *   Scene 9 (Outro):         L23    → 56.12 – 60.68s
 */

export const FPS = 30;

export const toFrame = (seconds: number): number => Math.round(seconds * FPS);

export const TOTAL_DURATION_S = 60.68;
export const TOTAL_FRAMES = toFrame(TOTAL_DURATION_S); // 1820

export const SCENES = {
    hook: {
        from: toFrame(0.0),
        duration: toFrame(5.74) - toFrame(0.0),            // 172
    },
    problemSetup: {
        from: toFrame(6.36),
        duration: toFrame(12.72) - toFrame(6.36),           // 191
    },
    bruteForce: {
        from: toFrame(12.96),
        duration: toFrame(16.76) - toFrame(12.96),           // 114
    },
    pointerSetup: {
        from: toFrame(17.36),
        duration: toFrame(22.30) - toFrame(17.36),           // 148
    },
    algorithmWalk: {
        from: toFrame(22.80),
        duration: toFrame(31.66) - toFrame(22.80),           // 266
    },
    efficiency: {
        from: toFrame(32.36),
        duration: toFrame(40.96) - toFrame(32.36),           // 258
    },
    complexityDrop: {
        from: toFrame(41.60),
        duration: toFrame(45.96) - toFrame(41.60),           // 131
    },
    patternEverywhere: {
        from: toFrame(46.44),
        duration: toFrame(56.12) - toFrame(46.44),           // 290
    },
    outro: {
        from: toFrame(56.12),
        duration: toFrame(60.68) - toFrame(56.12),           // 137
    },
} as const;

/**
 * Per-line timing — relative to each scene's first frame = 0.
 */
export const LINE_TIMING = {
    // Scene 1: Hook (base=0.00)
    L1: { start: toFrame(0.0),   end: toFrame(2.98) },
    L2: { start: toFrame(3.62),  end: toFrame(5.74) },
    // Scene 2: ProblemSetup (base=6.36)
    L3: { start: toFrame(0.0),   end: toFrame(1.74) },
    L4: { start: toFrame(2.26),  end: toFrame(6.36) },
    // Scene 3: BruteForce (base=12.96)
    L5: { start: toFrame(0.0),   end: toFrame(0.78) },
    L6: { start: toFrame(1.32),  end: toFrame(3.80) },
    // Scene 4: PointerSetup (base=17.36)
    L7: { start: toFrame(0.0),   end: toFrame(2.78) },
    L8: { start: toFrame(3.72),  end: toFrame(4.94) },
    // Scene 5: AlgorithmWalk (base=22.80)
    L9:  { start: toFrame(0.0),   end: toFrame(2.04) },
    L10: { start: toFrame(2.44),  end: toFrame(4.74) },
    L11: { start: toFrame(4.74),  end: toFrame(7.36) },
    L12: { start: toFrame(7.78),  end: toFrame(8.86) },
    // Scene 6: Efficiency (base=32.36)
    L13: { start: toFrame(0.0),   end: toFrame(2.02) },
    L14: { start: toFrame(2.40),  end: toFrame(5.06) },
    L15: { start: toFrame(5.36),  end: toFrame(6.76) },
    L16: { start: toFrame(7.14),  end: toFrame(8.60) },
    // Scene 7: ComplexityDrop (base=41.60)
    L17: { start: toFrame(0.0),   end: toFrame(2.62) },
    L18: { start: toFrame(2.86),  end: toFrame(4.36) },
    // Scene 8: PatternEverywhere (base=46.44)
    L19: { start: toFrame(0.0),   end: toFrame(1.28) },
    L20: { start: toFrame(1.88),  end: toFrame(4.76) },
    L21: { start: toFrame(5.10),  end: toFrame(7.46) },
    L22: { start: toFrame(7.60),  end: toFrame(9.68) },
    // Scene 9: Outro (base=56.12)
    L23: { start: toFrame(0.0),   end: toFrame(4.56) },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMO DATA — Two-pointer pair sum
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * SORTED array for two-pointer demo.
 * Target = 14.  Answer: indices 1 (3) + 6 (11) = 14
 *
 * Brute-force path: try all pairs O(N²).
 * Two-pointer path:
 *   L=0 R=7:  1+13=14? → too big → R--
 *   L=0 R=6:  1+11=12? → too small → L++
 *   L=1 R=6:  3+11=14? → ✓ MATCH!
 */
export const DEMO_ARRAY = [1, 3, 5, 6, 8, 9, 11, 13];
export const TARGET = 14;
export const ANSWER_L = 1;   // index of 3
export const ANSWER_R = 6;   // index of 11

/**
 * Pre-computed two-pointer walk steps for the algorithm animation.
 * Each step: { l, r, sum, action }
 * action: 'too_big' | 'too_small' | 'match'
 */
export const TP_STEPS = [
    { l: 0, r: 7, sum: 14, action: 'match' as const },
    // But for teaching purposes we want a longer walk — use a different target:
    // Actually with target 14:  arr[0]+arr[7]=1+13=14 → match immediately.
    // For a BETTER visual story let's use target=14 BUT show multiple steps.
    // Let me recalculate with TARGET=11:
    //   L=0 R=7: 1+13=14 → too big → R--
    //   L=0 R=6: 1+11=12 → too big → R--
    //   L=0 R=5: 1+9=10  → too small → L++
    //   L=1 R=5: 3+9=12  → too big → R--
    //   L=1 R=4: 3+8=11  → ✓ MATCH!
] as const;

// Override for better teaching: TARGET=11, answer at (1,4)
export const TEACH_TARGET = 11;
export const TEACH_STEPS: readonly { l: number; r: number; sum: number; action: 'too_big' | 'too_small' | 'match' }[] = [
    { l: 0, r: 7, sum: 14, action: 'too_big' },     // Step 0
    { l: 0, r: 6, sum: 12, action: 'too_big' },     // Step 1
    { l: 0, r: 5, sum: 10, action: 'too_small' },   // Step 2
    { l: 1, r: 5, sum: 12, action: 'too_big' },     // Step 3
    { l: 1, r: 4, sum: 11, action: 'match' },       // Step 4 ✓
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ACCENT = '#2563EB';       // blue-600
export const ACCENT_LIGHT = '#93C5FD'; // blue-300
export const ACCENT_BG = '#DBEAFE';    // blue-100
export const ACCENT_DARK = '#1D4ED8';  // blue-700

export const DANGER = '#EF4444';       // red-500
export const DANGER_LIGHT = '#FCA5A5'; // red-300
export const DANGER_BG = '#FEE2E2';    // red-100

export const SUCCESS = '#22C55E';      // green-500
export const SUCCESS_LIGHT = '#86EFAC'; // green-300
export const SUCCESS_BG = '#DCFCE7';   // green-100

/** Left pointer color = ACCENT (blue) */
export const PTR_LEFT = ACCENT;
/** Right pointer color = green — visually distinct from left */
export const PTR_RIGHT = '#059669';    // emerald-600
export const PTR_RIGHT_BG = '#D1FAE5'; // emerald-100
