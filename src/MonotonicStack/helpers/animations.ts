/**
 * Monotonic Stack — Animation Utilities
 *
 * Same engine as Intervals/FastAndSlow, tuned for 60fps.
 * Added: stack-specific push/pop animations.
 */

import { interpolate, spring } from 'remotion';
import { FPS } from './timing';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STACK VISUAL CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const STACK = {
    BLOCK_W: 120,
    BLOCK_H: 64,
    GAP: 8,
    BORDER: 4,
    RADIUS: 14,
    /** X center of the stack column */
    CENTER_X: 540,
    /** Y bottom of the stack base */
    BASE_Y: 1400,
} as const;

export const ARRAY_BAR = {
    WIDTH: 100,
    GAP: 12,
    MAX_H: 300,
    BASE_Y: 700,
    RADIUS: 10,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EASING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

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
    stiffness, damping, mass, overshootClamping: clamp,
});

export const SP = {
    gentle:    makeSpring(120, 14),
    snappy:    makeSpring(160, 12),
    punchy:    makeSpring(200, 10),
    overshoot: makeSpring(200, 8),
    whip:      makeSpring(300, 12),
    settle:    makeSpring(80, 18),
    elastic:   makeSpring(180, 6),
    /** Extra violent for hook */
    slam:      makeSpring(400, 8, 0.8, true),
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRING HELPER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const sp = (frame: number, delay: number, config: SpringConfig = SP.snappy): number =>
    spring({
        frame: frame - delay,
        fps: FPS,
        config: { stiffness: config.stiffness, damping: config.damping, mass: config.mass, overshootClamping: config.overshootClamping },
        durationInFrames: 60,
    });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const scaleIn = (frame: number, delay: number, config = SP.snappy): number =>
    sp(frame, delay, config);

export const fadeIn = (frame: number, delay: number, dur = 15): number =>
    interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const fadeOut = (frame: number, start: number, dur = 15): number =>
    interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const smoothLerp = (frame: number, startFrame: number, endFrame: number, from: number, to: number): number => {
    if (frame <= startFrame) return from;
    if (frame >= endFrame) return to;
    return from + (to - from) * easeInOutCubic((frame - startFrame) / (endFrame - startFrame));
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CamKey { frame: number; x: number; y: number; scale: number; }

export const camMulti = (frame: number, keys: CamKey[], driftAmp = 3): { transform: string; willChange: string } => {
    const sorted = [...keys].sort((a, b) => a.frame - b.frame);
    let cx: number, cy: number, cs: number;

    if (frame <= sorted[0].frame) {
        cx = sorted[0].x; cy = sorted[0].y; cs = sorted[0].scale;
    } else if (frame >= sorted[sorted.length - 1].frame) {
        cx = sorted[sorted.length - 1].x; cy = sorted[sorted.length - 1].y; cs = sorted[sorted.length - 1].scale;
    } else {
        let i = 0;
        while (i < sorted.length - 1 && sorted[i + 1].frame <= frame) i++;
        const a = sorted[i], b = sorted[i + 1];
        const e = easeInOutCubic((frame - a.frame) / (b.frame - a.frame));
        cx = a.x + (b.x - a.x) * e;
        cy = a.y + (b.y - a.y) * e;
        cs = a.scale + (b.scale - a.scale) * e;
    }

    const driftX = Math.sin(frame * 0.012) * driftAmp + Math.sin(frame * 0.007) * driftAmp * 0.5;
    const driftY = Math.cos(frame * 0.009) * driftAmp + Math.cos(frame * 0.005) * driftAmp * 0.4;

    return { transform: `translate(${cx + driftX}px, ${cy + driftY}px) scale(${cs})`, willChange: 'transform' };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORD-BY-WORD TEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const wordByWord = (text: string, frame: number, startFrame: number, stagger = 4): { word: string; opacity: number }[] => {
    const words = text.split(/\s+/);
    return words.map((word, i) => {
        const wordStart = startFrame + i * stagger;
        const opacity = interpolate(frame, [wordStart, wordStart + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return { word, opacity };
    });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PULSE / GLOW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const pulse = (frame: number, min = 0.97, max = 1.03, speed = 0.05): number => {
    const t = (Math.sin(frame * speed) + 1) / 2;
    return min + (max - min) * t;
};

export const glowShadow = (frame: number, color: string, speed = 0.05): string => {
    const intensity = (Math.sin(frame * speed) + 1) / 2;
    return `0 0 ${8 + intensity * 16}px ${2 + intensity * 4}px ${color}40`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STACK-SPECIFIC HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Get Y position for a stack block at a given depth (0 = bottom) */
export const stackBlockY = (depth: number, totalInStack: number): number =>
    STACK.BASE_Y - (totalInStack - depth) * (STACK.BLOCK_H + STACK.GAP);

/** Get bar height for a value (normalized to max) */
export const barHeight = (value: number, maxVal: number): number =>
    (value / maxVal) * ARRAY_BAR.MAX_H;

/** Get bar X position for array index */
export const barX = (index: number, total: number): number => {
    const totalW = total * ARRAY_BAR.WIDTH + (total - 1) * ARRAY_BAR.GAP;
    const startX = (1080 - totalW) / 2;
    return startX + index * (ARRAY_BAR.WIDTH + ARRAY_BAR.GAP);
};
