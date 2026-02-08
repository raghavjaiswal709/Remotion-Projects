/**
 * Sliding Window — Animation Engine (v2 — Production)
 *
 * Architecture:
 *   1. Spring Factory — reusable spring with delay + configurable physics
 *   2. Interpolation Shortcuts — fadeIn, fadeOut, slideUp, popIn
 *   3. CameraController — continuous drift + snap-focus + whip-pan + settle
 *   4. ValueFlow — number ticking system for sum display
 *   5. Stroke Animator — SVG stroke-dashoffset for arrow draw-on
 *   6. Portrait-first constants — all sizes optimized for 1080×1920
 *
 * Easing philosophy:
 *   - Entry = spring (stiffness 120-200, damping 10-16): bouncy, alive
 *   - Emphasis = overshoot spring (stiffness 200, damping 8): punchy
 *   - Camera = smooth linear interpolate with clamp: cinematic
 *   - Exits = linear fadeOut: clean, not distracting
 *   - Whip-pan = high stiffness (300), low damping (10): fast snap
 */

import { interpolate, spring } from 'remotion';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. SPRING FACTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Named presets — every animation decision documented */
export const SP = {
    /** Gentle entry — cells, text. stiff:120, damp:14 */
    gentle: { stiffness: 120, damping: 14 },
    /** Snappy — badges, labels. stiff:160, damp:12 */
    snappy: { stiffness: 160, damping: 12 },
    /** Punchy — big titles. stiff:200, damp:10 */
    punchy: { stiffness: 200, damping: 10 },
    /** Overshoot — stamps. stiff:200, damp:8 */
    overshoot: { stiffness: 200, damping: 8 },
    /** Whip — camera snap. stiff:300, damp:12 */
    whip: { stiffness: 300, damping: 12 },
    /** Settle — camera ease. stiff:80, damp:18 */
    settle: { stiffness: 80, damping: 18 },
} as const;

/**
 * Spring value starting at `delay` frames. 0 before, animates to 1 after.
 */
export const createSpring = (
    frame: number,
    fps: number,
    delay: number,
    config?: { stiffness?: number; damping?: number; mass?: number },
) =>
    spring({
        frame: Math.max(0, frame - delay),
        fps,
        config: config ?? SP.gentle,
    });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. INTERPOLATION SHORTCUTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const fadeIn = (f: number, s: number, e: number) =>
    interpolate(f, [s, e], [0, 1], CLAMP);

export const fadeOut = (f: number, s: number, e: number) =>
    interpolate(f, [s, e], [1, 0], CLAMP);

export const slideUp = (frame: number, fps: number, delay: number, fromY = 40) => {
    const s = createSpring(frame, fps, delay, SP.gentle);
    return interpolate(s, [0, 1], [fromY, 0]);
};

export const popIn = (frame: number, fps: number, delay: number) =>
    createSpring(frame, fps, delay, SP.snappy);

/** Scale from small→1 with spring */
export const scaleIn = (frame: number, fps: number, delay: number, from = 0.6) => {
    const s = createSpring(frame, fps, delay, SP.punchy);
    return interpolate(s, [0, 1], [from, 1]);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. CAMERA CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CamState {
    scale: number;
    x: number;
    y: number;
}

/** Continuous micro-drift — very smooth, low-frequency breathing motion */
export const camDrift = (frame: number): { dx: number; dy: number } => ({
    dx: Math.sin(frame * 0.015) * 0.08 + Math.sin(frame * 0.007) * 0.04,
    dy: Math.cos(frame * 0.012) * 0.06 + Math.cos(frame * 0.005) * 0.03,
});

/** Smooth easing — eliminates linear jerk on camera moves */
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const camCSS = (s: number, x: number, y: number) =>
    `scale(${s.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)`;

/** Interpolate between two camera states + drift — eased for zero jitter */
export const camLerp = (
    frame: number,
    sf: number,
    ef: number,
    from: CamState,
    to: CamState,
): string => {
    const raw = interpolate(frame, [sf, ef], [0, 1], CLAMP);
    const t = easeInOutCubic(raw);
    const d = camDrift(frame);
    return camCSS(
        from.scale + (to.scale - from.scale) * t,
        from.x + (to.x - from.x) * t + d.dx,
        from.y + (to.y - from.y) * t + d.dy,
    );
};

/** Multi-keyframe camera — array of { at, state } */
export const camMulti = (
    frame: number,
    kf: { at: number; state: CamState }[],
): string => {
    if (kf.length === 0) return camCSS(1, 0, 0);
    if (kf.length === 1) {
        const d = camDrift(frame);
        const s = kf[0].state;
        return camCSS(s.scale, s.x + d.dx, s.y + d.dy);
    }
    for (let i = 0; i < kf.length - 1; i++) {
        if (frame <= kf[i + 1].at) {
            return camLerp(frame, kf[i].at, kf[i + 1].at, kf[i].state, kf[i + 1].state);
        }
    }
    const last = kf[kf.length - 1].state;
    const d = camDrift(frame);
    return camCSS(last.scale, last.x + d.dx, last.y + d.dy);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. VALUE FLOW — animated number ticking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const tickValue = (
    frame: number,
    sf: number,
    ef: number,
    fromVal: number,
    toVal: number,
): number => Math.round(interpolate(frame, [sf, ef], [fromVal, toVal], CLAMP));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. STROKE ANIMATOR — SVG draw-on
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const strokeAnim = (
    frame: number,
    sf: number,
    ef: number,
    pathLen: number,
): { strokeDasharray: string; strokeDashoffset: number } => {
    const p = interpolate(frame, [sf, ef], [0, 1], CLAMP);
    return { strokeDasharray: `${pathLen}`, strokeDashoffset: pathLen * (1 - p) };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. PORTRAIT-FIRST CELL CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CELL = {
    W: 120,
    H: 120,
    GAP: 16,
    R: 18,
    BORDER: 4,
} as const;

export const CELL_STEP = CELL.W + CELL.GAP; // 136
export const arrayWidth = (n: number) => n * CELL.W + (n - 1) * CELL.GAP;

/**
 * Smooth interpolation with easeInOutCubic — use for any position/movement
 * that would otherwise be a raw linear interpolate (eliminates jitter).
 */
export const smoothLerp = (
    frame: number,
    sf: number,
    ef: number,
    from: number,
    to: number,
): number => {
    const raw = interpolate(frame, [sf, ef], [0, 1], CLAMP);
    const t = easeInOutCubic(raw);
    return from + (to - from) * t;
};
