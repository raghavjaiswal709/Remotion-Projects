/**
 * Two Pointers — Animation Utilities (Production)
 *
 * Mirrors SlidingWindow animation engine.
 * - SP presets (spring-like stiffness/damping combos)
 * - camMulti (multi-keyframe camera with easeInOutCubic + drift)
 * - smoothLerp, tickValue, strokeAnim, scaleIn, fadeIn, fadeOut
 * - wordByWord text helper
 *
 * ZERO CSS `transition` usage — all state via interpolate() + spring().
 * All camera containers use  willChange: 'transform'  for GPU compositing.
 */

import { interpolate, spring } from 'remotion';
import { FPS } from './timing';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CELL / GRID CONSTANTS (Portrait-first 1080×1920)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CELL = {
    W: 120,
    H: 120,
    GAP: 16,
    R: 18,
    BORDER: 4,
    get STEP() { return this.W + this.GAP; }, // 136
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING PRESETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SpringConfig {
    stiffness: number;
    damping: number;
    mass: number;
    overshootClamping: boolean;
}

const makeSpring = (stiffness: number, damping: number, mass = 1, clamp = false): SpringConfig => ({
    stiffness,
    damping,
    mass,
    overshootClamping: clamp,
});

/**
 * SP — Spring Presets
 *   gentle:    soft entrance              120 / 14
 *   snappy:    standard UI pop            160 / 12
 *   punchy:    emphasis hit               200 / 10
 *   overshoot: bounce-past settle         200 /  8
 *   whip:      fast snap-in               300 / 12
 *   settle:    slow settle for numbers    80  / 18
 */
export const SP = {
    gentle:    makeSpring(120, 14),
    snappy:    makeSpring(160, 12),
    punchy:    makeSpring(200, 10),
    overshoot: makeSpring(200, 8),
    whip:      makeSpring(300, 12),
    settle:    makeSpring(80, 18),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING HELPER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const sp = (
    frame: number,
    delay: number,
    config: SpringConfig = SP.snappy,
): number =>
    spring({
        frame: frame - delay,
        fps: FPS,
        config: {
            stiffness: config.stiffness,
            damping: config.damping,
            mass: config.mass,
            overshootClamping: config.overshootClamping,
        },
        durationInFrames: 45,
    });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Scale-in from 0 → 1 with spring */
export const scaleIn = (frame: number, delay: number, config = SP.snappy): number =>
    sp(frame, delay, config);

/** Fade in (0→1) with interpolate */
export const fadeIn = (frame: number, delay: number, dur = 12): number =>
    interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Fade out (1→0) with interpolate */
export const fadeOut = (frame: number, start: number, dur = 12): number =>
    interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Tick a number from `from` to `to` over `dur` frames starting at `delay` with easeOutCubic */
export const tickValue = (frame: number, delay: number, from: number, to: number, dur = 30): number => {
    const raw = interpolate(frame, [delay, delay + dur], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const eased = easeOutCubic(raw);
    return from + (to - from) * eased;
};

/** Stroke dash animation: returns { strokeDasharray, strokeDashoffset } */
export const strokeAnim = (
    frame: number,
    delay: number,
    totalLength: number,
    dur = 30,
): { strokeDasharray: string; strokeDashoffset: number } => {
    const progress = interpolate(frame, [delay, delay + dur], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const eased = easeOutCubic(progress);
    return {
        strokeDasharray: `${totalLength}`,
        strokeDashoffset: totalLength * (1 - eased),
    };
};

/**
 * smoothLerp — easeInOutCubic interpolation between two positions.
 * Used for pointer movement so they glide rather than jump.
 */
export const smoothLerp = (
    frame: number,
    startFrame: number,
    endFrame: number,
    from: number,
    to: number,
): number => {
    if (frame <= startFrame) return from;
    if (frame >= endFrame) return to;
    const t = (frame - startFrame) / (endFrame - startFrame);
    const eased = easeInOutCubic(t);
    return from + (to - from) * eased;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA SYSTEM — Multi-keyframe with drift
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CamKey {
    frame: number;
    x: number;
    y: number;
    scale: number;
}

/**
 * camMulti — smoothly interpolates between camera keyframes using easeInOutCubic.
 * Adds subtle dual-sine drift for organic feel (low frequency to avoid jitter).
 *
 * Returns `{ transform, willChange }` ready to spread on a container div's style.
 */
export const camMulti = (
    frame: number,
    keys: CamKey[],
    driftAmp = 3,
): { transform: string; willChange: string } => {
    // Sort keys by frame
    const sorted = [...keys].sort((a, b) => a.frame - b.frame);

    let cx: number, cy: number, cs: number;

    if (frame <= sorted[0].frame) {
        cx = sorted[0].x;
        cy = sorted[0].y;
        cs = sorted[0].scale;
    } else if (frame >= sorted[sorted.length - 1].frame) {
        cx = sorted[sorted.length - 1].x;
        cy = sorted[sorted.length - 1].y;
        cs = sorted[sorted.length - 1].scale;
    } else {
        let i = 0;
        while (i < sorted.length - 1 && sorted[i + 1].frame <= frame) i++;
        const a = sorted[i];
        const b = sorted[i + 1];
        const t = (frame - a.frame) / (b.frame - a.frame);
        const e = easeInOutCubic(t);
        cx = a.x + (b.x - a.x) * e;
        cy = a.y + (b.y - a.y) * e;
        cs = a.scale + (b.scale - a.scale) * e;
    }

    // Dual-sine drift — low frequency to avoid jitter
    const driftX = Math.sin(frame * 0.015) * driftAmp + Math.sin(frame * 0.009) * driftAmp * 0.5;
    const driftY = Math.cos(frame * 0.012) * driftAmp + Math.cos(frame * 0.007) * driftAmp * 0.4;

    return {
        transform: `translate(${cx + driftX}px, ${cy + driftY}px) scale(${cs})`,
        willChange: 'transform',
    };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORD-BY-WORD TEXT ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Returns an array of { word, opacity } for word-by-word reveal.
 * @param text - full sentence
 * @param frame - current frame (scene-local)
 * @param startFrame - when first word appears
 * @param stagger - frames between each word reveal (default 3)
 */
export const wordByWord = (
    text: string,
    frame: number,
    startFrame: number,
    stagger = 3,
): { word: string; opacity: number }[] => {
    const words = text.split(/\s+/);
    return words.map((word, i) => {
        const wordStart = startFrame + i * stagger;
        const opacity = interpolate(frame, [wordStart, wordStart + 4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
        return { word, opacity };
    });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PULSE / GLOW HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Slow pulse between min and max scale */
export const pulse = (frame: number, min = 0.97, max = 1.03, speed = 0.06): number => {
    const t = (Math.sin(frame * speed) + 1) / 2;
    return min + (max - min) * t;
};

/** Glow box-shadow that breathes */
export const glowShadow = (frame: number, color: string, speed = 0.06): string => {
    const intensity = (Math.sin(frame * speed) + 1) / 2;
    const blur = 8 + intensity * 16;
    const spread = 2 + intensity * 4;
    return `0 0 ${blur}px ${spread}px ${color}40`;
};
