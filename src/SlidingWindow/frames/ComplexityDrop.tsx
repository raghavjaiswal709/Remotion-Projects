/**
 * Scene 5 — ComplexityDrop (40.50 – 46.50s, 180 frames)
 *
 * CSV LINES:
 *   L10 (40.50-46.50 / f0-180): "Instead of checking every window from scratch, you
 *        slide one step, update two numbers, and move on.
 *        Brute force? O(N×K). Sliding window? O(N)."
 *
 * VISUAL PLAN:
 *   f0-12:    Fade in container, dot grid.
 *   f5-40:    "Instead of checking every window…" — word-by-word, gentle spring
 *   f30-55:   "slide one step" — animated mini window slides one cell (quick demo)
 *   f45-65:   "update two numbers" — ±badges pulse
 *
 *   f70-90:   "Brute force?" title with O(N×K) — big red text, strikethrough animates
 *   f90-120:  BIG comparison bars:
 *             - Left bar (red): O(N×K) tall, fills ~80% height → label "Brute Force"
 *             - Animates up over 20f
 *   f110-140: Right bar (blue): O(N) short, fills ~15% → label "Sliding Window"
 *             - Animates up over 20f
 *   f120-145: Difference arrow between bars with "K× faster" label
 *
 *   f130-160: "O(N)" punches in huge (scale 0.4→1 overshoot), centered
 *             Red strikethrough crosses O(N×K)
 *   f150-175: Badge pulse: "🏆 O(N)" with shine effect
 *   f170-180: Fade out
 *
 *   CAMERA: Start at 1.0, zoom to 1.08 on bars, settle to 1.0 at end
 *   LAYERS:
 *     FG: Big O notation text, badges
 *     MG: Comparison bars
 *     BG: Dot grid, dimmed old text
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, camMulti,
} from '../helpers/animations';
import { ACCENT, ACCENT_BG, ACCENT_LIGHT, DANGER, DANGER_BG } from '../helpers/timing';

const ComplexityDrop: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 10);
    const exitOp = fadeOut(frame, 168, 180);

    // ━━━ Word-by-word intro text ━━━
    const words = ['Instead', 'of', 'checking', 'every', 'window…'];
    const wordOps = words.map((_, i) => fadeIn(frame, 5 + i * 5, 12 + i * 5));
    const wordY = words.map((_, i) =>
        interpolate(createSpring(frame, fps, 5 + i * 5, SP.gentle), [0, 1], [20, 0]),
    );

    // ━━━ "slide one step" line ━━━
    const slideTextOp = fadeIn(frame, 30, 45);
    const slideTextY = interpolate(createSpring(frame, fps, 30, SP.snappy), [0, 1], [20, 0]);

    // ━━━ "update two numbers" line ━━━
    const updateTextOp = fadeIn(frame, 45, 58);
    const updateBadgePulse = interpolate(
        createSpring(frame, fps, 50, SP.overshoot), [0, 1], [0.85, 1],
    );

    // ━━━ Brute Force Title ━━━
    const bfTitleOp = fadeIn(frame, 70, 85);
    const bfTitleY = interpolate(createSpring(frame, fps, 70, SP.punchy), [0, 1], [30, 0]);

    // ━━━ COMPARISON BARS ━━━
    const barMaxH = 420;

    // Left bar (O(N×K)) — red, tall
    const leftBarH = interpolate(frame, [92, 115], [0, barMaxH * 0.82], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const leftBarOp = fadeIn(frame, 90, 100);

    // Right bar (O(N)) — blue, short
    const rightBarH = interpolate(frame, [112, 135], [0, barMaxH * 0.18], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const rightBarOp = fadeIn(frame, 110, 120);

    // Arrow between bars
    const arrowOp = fadeIn(frame, 125, 140);
    const arrowScale = scaleIn(frame, fps, 125, 0.6);

    // ━━━ BIG O(N) PUNCH ━━━
    const bigOOp = fadeIn(frame, 135, 150);
    const bigOScale = scaleIn(frame, fps, 135, 0.4);

    // Strikethrough on O(N×K)
    const strikeW = interpolate(frame, [132, 148], [0, 100], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Badge
    const badgeOp = fadeIn(frame, 152, 165);
    const badgeScale = scaleIn(frame, fps, 152, 0.7);

    // ━━━ CAMERA ━━━
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 70, state: { scale: 1.04, x: 0, y: -2 } },
        { at: 130, state: { scale: 1.08, x: 0, y: -3 } },
        { at: 165, state: { scale: 1, x: 0, y: 0 } },
    ]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: Math.min(containerOp, exitOp) }}
        >
            {/* BG grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.2,
            }} />

            <div className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}>

                <div className="flex flex-col items-center gap-8 w-full max-w-[90%]">
                    {/* Word-by-word intro */}
                    <p className="text-[40px] font-semibold text-zinc-700 text-center leading-snug">
                        {words.map((w, i) => (
                            <span key={i} style={{
                                opacity: wordOps[i],
                                transform: `translateY(${wordY[i]}px)`,
                                display: 'inline-block',
                                marginRight: 10,
                            }}>{w}</span>
                        ))}
                    </p>

                    {/* "slide one step" */}
                    <p className="text-[34px] text-zinc-600" style={{ opacity: slideTextOp, transform: `translateY(${slideTextY}px)` }}>
                        You <span className="font-bold" style={{ color: ACCENT }}>slide one step</span>,{' '}
                        <span style={{ opacity: updateTextOp }}>
                            update{' '}
                            <span
                                className="font-bold px-3 py-1 rounded-lg inline-block"
                                style={{
                                    color: DANGER, backgroundColor: DANGER_BG,
                                    transform: `scale(${updateBadgePulse})`,
                                }}
                            >−1</span>
                            {' '}
                            <span
                                className="font-bold px-3 py-1 rounded-lg inline-block"
                                style={{
                                    color: ACCENT, backgroundColor: ACCENT_BG,
                                    border: `2px solid ${ACCENT_LIGHT}`,
                                    transform: `scale(${updateBadgePulse})`,
                                }}
                            >+1</span>
                        </span>
                    </p>

                    {/* Brute Force title + strikethrough */}
                    <div className="relative" style={{ opacity: bfTitleOp, transform: `translateY(${bfTitleY}px)` }}>
                        <p className="text-[42px] font-bold text-zinc-800 text-center">
                            Brute force?{' '}
                            <span className="relative inline-block">
                                <span className="font-black font-mono" style={{ color: DANGER }}>O(N×K)</span>
                                {/* animated strikethrough */}
                                <span className="absolute left-0 top-1/2 h-[5px] rounded-full" style={{
                                    width: `${strikeW}%`, backgroundColor: DANGER,
                                    transform: 'translateY(-50%)',
                                }} />
                            </span>
                        </p>
                    </div>

                    {/* Comparison bars */}
                    <div className="flex items-end gap-14" style={{ height: barMaxH + 50 }}>
                        {/* Left bar: O(N×K) */}
                        <div className="flex flex-col items-center gap-3" style={{ opacity: leftBarOp }}>
                            <div className="w-[120px] rounded-t-2xl relative" style={{
                                height: leftBarH,
                                backgroundColor: DANGER,
                                opacity: 0.9,
                            }}>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[26px] font-black font-mono whitespace-nowrap" style={{ color: DANGER }}>
                                    O(N×K)
                                </span>
                            </div>
                            <span className="text-base font-semibold text-zinc-500">Brute Force</span>
                        </div>

                        {/* Arrow / multiplier */}
                        <div className="flex flex-col items-center justify-center mb-8"
                            style={{ opacity: arrowOp, transform: `scale(${arrowScale})` }}>
                            <span className="text-[50px]">→</span>
                            <span className="text-[30px] font-black mt-1 px-4 py-1 rounded-xl"
                                style={{ color: ACCENT, backgroundColor: ACCENT_BG }}>
                                K× faster
                            </span>
                        </div>

                        {/* Right bar: O(N) */}
                        <div className="flex flex-col items-center gap-3" style={{ opacity: rightBarOp }}>
                            <div className="w-[120px] rounded-t-2xl relative" style={{
                                height: rightBarH,
                                backgroundColor: ACCENT,
                            }}>
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[26px] font-black font-mono whitespace-nowrap" style={{ color: ACCENT }}>
                                    O(N)
                                </span>
                            </div>
                            <span className="text-base font-semibold text-zinc-500">Sliding Window</span>
                        </div>
                    </div>

                    {/* BIG O(N) punch */}
                    <div style={{ opacity: bigOOp, transform: `scale(${bigOScale})` }}>
                        <span className="text-[84px] font-black font-mono" style={{ color: ACCENT }}>
                            O(N)
                        </span>
                    </div>

                    {/* Champion badge */}
                    <div
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl"
                        style={{
                            opacity: badgeOp,
                            transform: `scale(${badgeScale})`,
                            backgroundColor: ACCENT_BG,
                            border: `3px solid ${ACCENT}`,
                        }}
                    >
                        <span className="text-[40px]">🏆</span>
                        <span className="text-[34px] font-black font-mono" style={{ color: ACCENT }}>
                            O(N) wins
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplexityDrop;
