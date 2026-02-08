/**
 * Scene 2 — BruteForceDemo (8.46 – 17.32s, 266 frames)
 *
 * CSV LINES:
 *   L3 (8.46-13.46 / f0-150): "You're given an array. They ask for the max sum of three
 *                               numbers. Most people panic. They re-add everything."
 *   L4 (13.78-17.32 / f160-266): "Again, and again. That's slow and slow fails interviews."
 *
 * VISUAL PLAN:
 *
 * f0-15:   Container fades in. Dot grid background persists.
 * f5-25:   "Find the maximum sum of 3 consecutive numbers" — word-by-word.
 *          "maximum sum" = ACCENT, "3" = ACCENT bold. Scale emphasis on "3".
 * f18-22:  "K = 3" badge pops in (snappy spring, rounded pill, ACCENT border+bg)
 * f15-45:  Array cells stagger in (same array from Scene 1 — visual continuity).
 *          Each cell springs from scale 0→1, 4f stagger.
 *
 * f50-180: BRUTE FORCE LOOP — 5 positions, ~26f each
 *   For EACH position pos (0..4):
 *     f_start+0:   Window outline slides to pos (spring, inertia-feel easing)
 *     f_start+3:   Highlighted cells get ACCENT border+bg
 *     f_start+5:   "+" signs spring between highlighted cells
 *     f_start+8:   Sum line: "a + b + c = SUM" with tick animation on SUM number
 *     f_start+12:  "← re-add all 3!" red label (appears from f_start+12, fades)
 *     f_start+22:  Previous iteration dims, next begins
 *
 *   CAMERA: Slight zoom 1.08 on active window, drift follows position
 *
 *   FOREGROUND: Sum calculation + "+" symbols
 *   MIDGROUND: Array + sliding window outline
 *   BACKGROUND: Faded previous position (ghost outline at old position)
 *
 * f180-200: "AGAIN" stamps punch in — two stamps, rotated ±5°, overshoot spring
 * f200-230: "That's SLOW" — word-by-word. "SLOW" = 5xl red, scale emphasis.
 *           Shake effect (sin-based translateX ±6px, 6 cycles)
 * f230-250: "slow fails interviews" — slides up, bold red on "fails"
 * f250-266: Everything dims → fade to next scene
 *
 * CAMERA: f180→ zoom back to 1.0. f200→ tiny shake parallels text shake.
 *
 * ITERATION PROGRESS: 5 dots at bottom, filling as iterations complete.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, tickValue,
    camMulti, smoothLerp, CELL, CELL_STEP,
} from '../helpers/animations';
import {
    DEMO_ARRAY, WINDOW_SIZE, WINDOW_SUMS,
    ACCENT, ACCENT_BG, DANGER, DANGER_BG,
} from '../helpers/timing';

const BruteForceDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 12);
    const numPos = DEMO_ARRAY.length - WINDOW_SIZE + 1; // 5

    // ━━━ HEADER TEXT — word-by-word ━━━
    const h1 = fadeIn(frame, 5, 14);     // "Find the"
    const h1Y = interpolate(createSpring(frame, fps, 5, SP.gentle), [0, 1], [25, 0]);
    const h2 = fadeIn(frame, 10, 18);    // "maximum sum"
    const h2S = scaleIn(frame, fps, 10, 0.75);
    const h3 = fadeIn(frame, 15, 22);    // "of"
    const h4 = fadeIn(frame, 18, 25);    // "3 consecutive numbers"
    const h4S = scaleIn(frame, fps, 18, 0.7);

    // K=3 badge
    const badgeOp = fadeIn(frame, 22, 35);
    const badgeS = scaleIn(frame, fps, 22, 0.7);

    // ━━━ ARRAY CELLS ━━━
    const getCellEntry = (i: number) => {
        const d = 18 + i * 4;
        return {
            scale: interpolate(createSpring(frame, fps, d, SP.snappy), [0, 1], [0, 1]),
            opacity: fadeIn(frame, d, d + 10),
        };
    };

    // ━━━ BRUTE FORCE ITERATIONS ━━━
    const iterDur = 26;
    const iterStart = 55;
    const rawIter = frame < iterStart ? -1 : Math.min(Math.floor((frame - iterStart) / iterDur), numPos - 1);
    const currentIter = rawIter;

    // Window position (with smooth eased interpolation)
    const targetX = Math.max(0, currentIter) * CELL_STEP;
    const windowX = frame < iterStart ? 0
        : smoothLerp(frame, iterStart + currentIter * iterDur, iterStart + currentIter * iterDur + 12,
            Math.max(0, currentIter - 1) * CELL_STEP, targetX);

    const isHighlighted = (ci: number) => {
        if (currentIter < 0) return false;
        return ci >= currentIter && ci < currentIter + WINDOW_SIZE;
    };

    // Plus sign opacity (per-iteration)
    const plusOp = currentIter >= 0
        ? fadeIn(frame, iterStart + currentIter * iterDur + 5, iterStart + currentIter * iterDur + 12)
        : 0;

    // Sum line
    const getSumLine = () => {
        if (currentIter < 0) return null;
        const vals = DEMO_ARRAY.slice(currentIter, currentIter + WINDOW_SIZE);
        return { vals, sum: WINDOW_SUMS[currentIter] };
    };
    const sumLine = getSumLine();
    const sumOp = currentIter >= 0
        ? fadeIn(frame, iterStart + currentIter * iterDur + 8, iterStart + currentIter * iterDur + 16)
        : 0;

    // Tick the sum number
    const sumTick = currentIter >= 0 && currentIter > 0
        ? tickValue(frame, iterStart + currentIter * iterDur + 8, iterStart + currentIter * iterDur + 14,
            WINDOW_SUMS[currentIter - 1], WINDOW_SUMS[currentIter])
        : (currentIter === 0 ? WINDOW_SUMS[0] : 0);

    // "re-add all 3!" label
    const readdOp = currentIter >= 1
        ? fadeIn(frame, iterStart + currentIter * iterDur + 12, iterStart + currentIter * iterDur + 18)
        : 0;

    // Ghost outline at previous position
    const ghostOp = currentIter >= 1
        ? fadeOut(frame, iterStart + currentIter * iterDur, iterStart + currentIter * iterDur + 12)
        : 0;
    const ghostX = currentIter >= 1 ? (currentIter - 1) * CELL_STEP : 0;

    // ━━━ "AGAIN" STAMPS ━━━
    const a1Op = fadeIn(frame, 185, 195);
    const a1S = createSpring(frame, fps, 185, SP.overshoot);
    const a2Op = fadeIn(frame, 198, 208);
    const a2S = createSpring(frame, fps, 198, SP.overshoot);

    // ━━━ "That's SLOW" ━━━
    const slowOp = fadeIn(frame, 210, 222);
    const slowY = interpolate(createSpring(frame, fps, 210, SP.gentle), [0, 1], [25, 0]);
    // Shake
    const shakeX = frame >= 210 && frame <= 245
        ? Math.sin(frame * 1.8) * 6 : 0;

    // "slow fails interviews"
    const failOp = fadeIn(frame, 232, 245);
    const failY = interpolate(createSpring(frame, fps, 232, SP.gentle), [0, 1], [20, 0]);

    // Fade out at end
    const exitOp = fadeOut(frame, 254, 266);

    // ━━━ ITERATION DOTS ━━━
    const dotsOp = currentIter >= 0 ? fadeIn(frame, iterStart, iterStart + 15) : 0;

    // ━━━ CAMERA ━━━
    // Zoom into array during iterations, pull back for AGAIN/SLOW
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 50, state: { scale: 1.08, x: 0, y: -2 } },
        { at: 175, state: { scale: 1.08, x: -2, y: -2 } },
        { at: 200, state: { scale: 1.0, x: 0, y: 0 } },
        { at: 266, state: { scale: 0.98, x: 0, y: 0 } },
    ]);

    // Window outline dimensions
    const winW = WINDOW_SIZE * CELL.W + (WINDOW_SIZE - 1) * CELL.GAP + 20;
    const winH = CELL.H + 20;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: Math.min(containerOp, exitOp) }}
        >
            {/* Background dot grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.3,
                }}
            />

            <div
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}
            >
                <div
                    className="flex flex-col items-center gap-12 w-full max-w-[92%]"
                    style={{ transform: `translateX(${shakeX}px)` }}
                >
                    {/* Header — word-by-word */}
                    <div className="text-center leading-tight">
                        <p className="text-[50px] font-bold text-zinc-800">
                            <span style={{ opacity: h1, transform: `translateY(${h1Y}px)`, display: 'inline-block' }}>
                                Find the{' '}
                            </span>
                            <span style={{ opacity: h2, transform: `scale(${h2S})`, display: 'inline-block', color: ACCENT, fontWeight: 900 }}>
                                maximum sum
                            </span>
                            <span style={{ opacity: h3, display: 'inline-block' }}>{' '}of{' '}</span>
                            <span style={{ opacity: h4, transform: `scale(${h4S})`, display: 'inline-block' }}>
                                <span style={{ color: ACCENT, fontWeight: 900, fontSize: 52 }}>3</span>{' '}
                                <span className="text-zinc-700">consecutive numbers</span>
                            </span>
                        </p>
                    </div>

                    {/* K=3 badge */}
                    <div
                        className="flex items-center gap-3 px-7 py-3 rounded-full"
                        style={{
                            opacity: badgeOp,
                            transform: `scale(${badgeS})`,
                            border: `3px solid ${ACCENT}`,
                            backgroundColor: ACCENT_BG,
                        }}
                    >
                        <span className="text-3xl font-black font-mono" style={{ color: ACCENT }}>K = {WINDOW_SIZE}</span>
                    </div>

                    {/* Array + Window */}
                    <div className="relative">
                        <div className="flex items-center" style={{ gap: CELL.GAP }}>
                            {DEMO_ARRAY.map((val, i) => {
                                const c = getCellEntry(i);
                                const hl = isHighlighted(i);
                                return (
                                    <React.Fragment key={i}>
                                        <div
                                            className="relative flex items-center justify-center"
                                            style={{
                                                width: CELL.W,
                                                height: CELL.H,
                                                borderRadius: CELL.R,
                                                border: `${CELL.BORDER}px solid ${hl ? ACCENT : '#d4d4d8'}`,
                                                backgroundColor: hl ? ACCENT_BG : '#fafafa',
                                                transform: `scale(${c.scale})`,
                                                opacity: c.opacity,
                                            }}
                                        >
                                            <span className="text-[48px] font-bold text-zinc-800 font-mono">{val}</span>
                                            <span className="absolute -bottom-10 text-lg font-mono text-zinc-400">{i}</span>
                                        </div>
                                        {/* Plus sign between highlighted cells */}
                                        {hl && i < (currentIter ?? 0) + WINDOW_SIZE - 1 && i < DEMO_ARRAY.length - 1 && (
                                            <div className="flex items-center justify-center" style={{ width: 0, margin: '0 -7px', opacity: plusOp, zIndex: 10 }}>
                                                <span className="text-[40px] font-black" style={{ color: ACCENT }}>+</span>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Ghost window outline — previous position */}
                        {currentIter >= 1 && (
                            <div
                                className="absolute top-1/2 rounded-2xl pointer-events-none"
                                style={{
                                    width: winW,
                                    height: winH,
                                    border: `3px dashed #d4d4d8`,
                                    left: ghostX - 10,
                                    transform: 'translateY(-50%)',
                                    opacity: ghostOp,
                                }}
                            />
                        )}

                        {/* Active window outline */}
                        {frame >= iterStart && (
                            <div
                                className="absolute top-1/2 rounded-2xl pointer-events-none"
                                style={{
                                    width: winW,
                                    height: winH,
                                    border: `${CELL.BORDER}px solid ${ACCENT}`,
                                    left: windowX - 10,
                                    transform: 'translateY(-50%)',
                                    boxShadow: `0 0 0 4px ${ACCENT}18`,
                                }}
                            />
                        )}
                    </div>

                    {/* Sum line + tick animation */}
                    {sumLine && (
                        <div className="flex items-center gap-4 font-mono text-[32px]" style={{ opacity: sumOp }}>
                            <span className="text-zinc-400">Σ</span>
                            <span className="text-zinc-700 font-bold">
                                {sumLine.vals.join(' + ')}
                            </span>
                            <span className="text-zinc-400">=</span>
                            <span
                                className="font-black text-[38px] px-4 py-1 rounded-xl"
                                style={{ color: ACCENT, backgroundColor: ACCENT_BG }}
                            >
                                {sumTick}
                            </span>
                            {currentIter >= 1 && (
                                <span
                                    className="text-base font-sans font-bold ml-3 px-3 py-1 rounded-full"
                                    style={{ color: DANGER, backgroundColor: DANGER_BG, opacity: readdOp }}
                                >
                                    ← re-add all 3!
                                </span>
                            )}
                        </div>
                    )}

                    {/* Progress dots */}
                    <div className="flex items-center gap-4" style={{ opacity: dotsOp }}>
                        <div className="flex gap-2">
                            {Array.from({ length: numPos }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-9 h-[6px] rounded-full"
                                    style={{ backgroundColor: i <= currentIter ? ACCENT : '#e4e4e7' }}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-mono text-zinc-400">
                            pass {Math.max(currentIter + 1, 1)} / {numPos}
                        </span>
                    </div>

                    {/* "AGAIN" stamps */}
                    <div className="relative flex items-center gap-6 h-[80px]">
                        <div
                            className="px-9 py-3 rounded-xl"
                            style={{
                                opacity: a1Op,
                                transform: `scale(${interpolate(a1S, [0, 1], [2, 1])}) rotate(-5deg)`,
                                border: `4px solid ${DANGER}`,
                            }}
                        >
                            <span className="text-[48px] font-black uppercase tracking-wider" style={{ color: DANGER }}>
                                Again
                            </span>
                        </div>
                        <div
                            className="px-9 py-3 rounded-xl"
                            style={{
                                opacity: a2Op,
                                transform: `scale(${interpolate(a2S, [0, 1], [2, 1])}) rotate(3deg)`,
                                border: `4px solid ${DANGER}`,
                            }}
                        >
                            <span className="text-[48px] font-black uppercase tracking-wider" style={{ color: DANGER }}>
                                & Again
                            </span>
                        </div>
                    </div>

                    {/* "That's SLOW" */}
                    <div style={{ opacity: slowOp, transform: `translateY(${slowY}px)` }}>
                        <p className="text-[50px] font-bold text-zinc-600 text-center">
                            That's{' '}
                            <span className="text-[64px] font-black uppercase" style={{ color: DANGER }}>SLOW</span>
                        </p>
                    </div>

                    {/* "slow fails interviews" */}
                    <div style={{ opacity: failOp, transform: `translateY(${failY}px)` }}>
                        <p className="text-[34px] font-bold text-zinc-500 text-center">
                            and slow <span className="font-black" style={{ color: DANGER }}>fails</span> interviews.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BruteForceDemo;
