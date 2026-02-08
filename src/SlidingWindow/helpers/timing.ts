/**
 * Sliding Window — Timing Constants (v2 — Production)
 *
 * All values derived STRICTLY from the transcript CSV.
 * FPS = 30. Tolerance ±0.05s (±1.5 frames).
 *
 * CSV source: public/sliding window 1_transcript_timestamps.csv
 *
 * ┌─────┬────────────┬────────────┬──────────────────────────────────────────────────────────┐
 * │ Line│  Start (s) │  End (s)   │ Text                                                     │
 * ├─────┼────────────┼────────────┼──────────────────────────────────────────────────────────┤
 * │  1  │  0.000     │  3.680     │ Still recalculating arrays? That's why interviews reject  │
 * │  2  │  4.080     │  7.940     │ Day one of turning you into a logic monster. Sliding win  │
 * │  3  │  8.460     │ 13.460     │ You're given an array. Max sum of three numbers. Panic.   │
 * │  4  │ 13.780     │ 17.320     │ Again, and again. That's slow.                            │
 * │  5  │ 17.860     │ 22.240     │ Here's the smarter way. Imagine a window.                 │
 * │  6  │ 22.820     │ 26.420     │ When the window moves, only two numbers matter.           │
 * │  7  │ 26.420     │ 31.580     │ One leaves. One enters. Take the current sum.             │
 * │  8  │ 32.020     │ 34.740     │ Subtract what left. Add what entered. Boom.               │
 * │  9  │ 35.620     │ 40.020     │ New answer. Middle never changes. Trick changes all.      │
 * │ 10  │ 40.500     │ 46.500     │ Complexity drops O(N×K) → O(N). One pass. Zero waste.     │
 * │ 11  │ 46.900     │ 51.340     │ Variable window. Expand front. Shrink back. Track best.   │
 * │ 12  │ 51.340     │ 54.940     │ Master this rhythm. Half of array interviews solved.      │
 * │ 13  │ 55.300     │ 58.480     │ Sliding window pattern. Remember it. Use it. Win.         │
 * └─────┴────────────┴────────────┴──────────────────────────────────────────────────────────┘
 *
 * Scene mapping:
 *   Scene 1 (RecalculatingArrays): Lines 1-2  →  0.00 – 7.94s
 *   Scene 2 (BruteForceDemo):      Lines 3-4  →  8.46 – 17.32s
 *   Scene 3 (WindowIntro):         Lines 5-6  → 17.86 – 26.42s
 *   Scene 4 (SlideAndUpdate):      Lines 7-9  → 26.42 – 40.02s
 *   Scene 5 (ComplexityDrop):      Line 10    → 40.50 – 46.50s
 *   Scene 6 (VariableWindow):      Lines 11-12→ 46.90 – 54.94s
 *   Scene 7 (Outro):               Line 13    → 55.30 – 58.48s
 */

export const FPS = 30;

export const toFrame = (seconds: number): number => Math.round(seconds * FPS);

export const TOTAL_DURATION_S = 58.48;
export const TOTAL_FRAMES = toFrame(TOTAL_DURATION_S); // 1754

/**
 * Scene timing — from/duration in frames, derived from CSV.
 * `from` = absolute start frame.
 * `duration` = length in frames.
 */
export const SCENES = {
    recalculating: {
        from: toFrame(0.0),          // 0
        duration: toFrame(7.94),      // 238
    },
    bruteForce: {
        from: toFrame(8.46),          // 254
        duration: toFrame(17.32) - toFrame(8.46), // 266
    },
    windowIntro: {
        from: toFrame(17.86),         // 536
        duration: toFrame(26.42) - toFrame(17.86), // 257
    },
    slideAndUpdate: {
        from: toFrame(26.42),         // 793
        duration: toFrame(40.02) - toFrame(26.42), // 408
    },
    complexityDrop: {
        from: toFrame(40.50),         // 1215
        duration: toFrame(46.50) - toFrame(40.50), // 180
    },
    variableWindow: {
        from: toFrame(46.90),         // 1407
        duration: toFrame(54.94) - toFrame(46.90), // 241
    },
    outro: {
        from: toFrame(55.30),         // 1659
        duration: toFrame(58.48) - toFrame(55.30), // 95
    },
} as const;

/**
 * Per-line timing within each scene (relative to scene start = 0).
 * This enables sub-line precision for word-by-word animations.
 */
export const LINE_TIMING = {
    L1: { start: toFrame(0.0),   end: toFrame(3.68) },   // within Scene 1
    L2: { start: toFrame(4.08),  end: toFrame(7.94) },   // within Scene 1
    L3: { start: toFrame(0.0),   end: toFrame(5.0) },    // within Scene 2 (relative)
    L4: { start: toFrame(5.32),  end: toFrame(8.86) },   // within Scene 2
    L5: { start: toFrame(0.0),   end: toFrame(4.38) },   // within Scene 3
    L6: { start: toFrame(4.96),  end: toFrame(8.56) },   // within Scene 3
    L7: { start: toFrame(0.0),   end: toFrame(5.16) },   // within Scene 4
    L8: { start: toFrame(5.60),  end: toFrame(8.32) },   // within Scene 4
    L9: { start: toFrame(9.20),  end: toFrame(13.60) },  // within Scene 4
    L10: { start: toFrame(0.0),  end: toFrame(6.0) },    // within Scene 5
    L11: { start: toFrame(0.0),  end: toFrame(4.44) },   // within Scene 6
    L12: { start: toFrame(4.44), end: toFrame(8.04) },   // within Scene 6
    L13: { start: toFrame(0.0),  end: toFrame(3.18) },   // within Scene 7
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMO DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const DEMO_ARRAY = [2, 7, 1, 5, 3, 8, 4];
export const WINDOW_SIZE = 3;

/**
 * Pre-computed window sums (K=3):
 *   pos 0: [2,7,1] = 10
 *   pos 1: [7,1,5] = 13
 *   pos 2: [1,5,3] = 9
 *   pos 3: [5,3,8] = 16 ← max
 *   pos 4: [3,8,4] = 15
 */
export const WINDOW_SUMS = [10, 13, 9, 16, 15];
export const MAX_SUM_INDEX = 3; // sum=16

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN TOKENS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Single accent color — blue. Everything else is grayscale. */
export const ACCENT = '#2563EB';      // blue-600
export const ACCENT_LIGHT = '#93C5FD'; // blue-300
export const ACCENT_BG = '#DBEAFE';    // blue-100
export const ACCENT_DARK = '#1D4ED8';  // blue-700

/** Danger color — used ONLY for brute-force / wrong approach */
export const DANGER = '#EF4444';       // red-500
export const DANGER_LIGHT = '#FCA5A5'; // red-300
export const DANGER_BG = '#FEE2E2';    // red-100
