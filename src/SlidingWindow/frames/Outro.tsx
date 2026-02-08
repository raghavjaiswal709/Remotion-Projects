/**
 * Scene 7 — Outro (55.30 – 58.48s, 95 frames)
 *
 * CSV LINE:
 *   L13 (55.30-58.48 / f0-95): "Remember it. Use it. Win."
 *
 * VISUAL PLAN:
 *   f0-8:    Container fade in
 *   f5-25:   "Remember it." — word-by-word, gentle spring, text-zinc-700
 *   f20-40:  "Use it." — springs in, ACCENT color
 *   f35-60:  "Win." — BIG kinetic text, overshoot scale 0.4→1
 *            ACCENT + glow. Shake-settle micro-animation.
 *
 *   f50-70:  "SLIDING WINDOW" badge — centered, pill shape
 *            Scale in from 0.7, ACCENT bg + white text
 *            Draw-on border (SVG stroke)
 *
 *   f75-95:  Gentle fade to white (the video ends)
 *
 * CAMERA: Start 1.0, zoom to 1.06 on "Win", hold, settle back
 * LAYERS:
 *   FG: Kinetic text, badge
 *   MG: (empty — clean)
 *   BG: Dot grid, subtle
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, camMulti, strokeAnim,
} from '../helpers/animations';
import { ACCENT } from '../helpers/timing';

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 8);
    const exitOp = fadeOut(frame, 78, 95);

    // ━━━ "Remember it." ━━━
    const remOp = fadeIn(frame, 5, 18);
    const remY = interpolate(createSpring(frame, fps, 5, SP.gentle), [0, 1], [30, 0]);

    // ━━━ "Use it." ━━━
    const useOp = fadeIn(frame, 20, 33);
    const useY = interpolate(createSpring(frame, fps, 20, SP.snappy), [0, 1], [30, 0]);

    // ━━━ "Win." ━━━
    const winOp = fadeIn(frame, 35, 48);
    const winScale = scaleIn(frame, fps, 35, 0.4);
    // Subtle shake on Win
    const winShakeX = frame >= 38 && frame <= 48
        ? Math.sin((frame - 38) * 2.5) * interpolate(frame, [38, 48], [4, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })
        : 0;

    // ━━━ BADGE ━━━
    const badgeOp = fadeIn(frame, 52, 65);
    const badgeScale = scaleIn(frame, fps, 52, 0.7);
    // Badge pill border draw-on
    const badgePerimeter = 520;
    const badgeDash = strokeAnim(frame, 54, 70, badgePerimeter);

    // ━━━ CAMERA ━━━
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 35, state: { scale: 1.06, x: 0, y: -1 } },
        { at: 65, state: { scale: 1.06, x: 0, y: -1 } },
        { at: 95, state: { scale: 1, x: 0, y: 0 } },
    ]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: Math.min(containerOp, exitOp) }}
        >
            {/* BG grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.18,
            }} />

            <div className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}>

                <div className="flex flex-col items-center gap-6">
                    {/* "Remember it." */}
                    <p className="text-[54px] font-bold text-zinc-700"
                        style={{ opacity: remOp, transform: `translateY(${remY}px)` }}>
                        Remember it.
                    </p>

                    {/* "Use it." */}
                    <p className="text-[60px] font-bold"
                        style={{ opacity: useOp, color: ACCENT, transform: `translateY(${useY}px)` }}>
                        Use it.
                    </p>

                    {/* "Win." */}
                    <p
                        className="text-[96px] font-black"
                        style={{
                            opacity: winOp,
                            color: ACCENT,
                            transform: `scale(${winScale}) translateX(${winShakeX}px)`,
                            textShadow: `0 0 40px ${ACCENT}40`,
                        }}
                    >
                        Win.
                    </p>

                    {/* Badge: SLIDING WINDOW */}
                    <div className="relative mt-4" style={{ opacity: badgeOp, transform: `scale(${badgeScale})` }}>
                        <svg width={260} height={60} className="absolute -left-[2px] -top-[2px]">
                            <rect
                                x={2} y={2} width={256} height={56} rx={28}
                                fill="none" stroke={ACCENT} strokeWidth={4}
                                strokeDasharray={badgeDash.strokeDasharray}
                                strokeDashoffset={badgeDash.strokeDashoffset}
                            />
                        </svg>
                        <div
                            className="px-10 py-3 rounded-full text-center"
                            style={{ backgroundColor: ACCENT, minWidth: 256 }}
                        >
                            <span className="text-[28px] font-black text-white tracking-wider uppercase">
                                Sliding Window
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Outro;
