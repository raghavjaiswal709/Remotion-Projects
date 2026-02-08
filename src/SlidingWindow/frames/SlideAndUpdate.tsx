/**
 * Scene 4 — SlideAndUpdate (26.42 – 40.02s, 408 frames)
 *
 * CSV LINES:
 *   L7 (26.42-31.58 / f0-155): "One number leaves. One number enters. That's it.
 *                                 So stop recalculating. Take the current sum."
 *   L8 (32.02-34.74 / f168-249): "Subtract what left. Add what entered. Boom."
 *   L9 (35.62-40.02 / f276-408): "New answer. The middle never changes. So don't touch it.
 *                                   This single trick changes everything."
 *
 * VISUAL PLAN:
 *
 * This is the CORE scene — the longest at 408 frames. It must be hyper-detailed.
 *
 * f0-10:   Container in. Dot grid.
 * f5-30:   "One leaves. One enters." — word-by-word kinetic text.
 *          "leaves" = red. "enters" = blue. Each word springs in separately.
 *
 * f30-65:  Formula box draws in: "newSum = oldSum − left + right"
 *          - "−left" in red pill, "−" draws as stroke
 *          - "+right" in blue pill, "+" draws as stroke
 *          - "newSum" in ACCENT bold
 *
 * f10-50:  Array cells appear (stagger). Window at position 0.
 *          Current sum = 10 shown below.
 *
 * f70-310: FULL SLIDING ANIMATION — 5 positions, ~48f per position
 *   For EACH slide from pos N to pos N+1:
 *     Phase 1 (12f): Window glides right (spring with inertia)
 *       - Left cell dims (1→0.2 opacity) — RED highlight flash on leaving value
 *       - Right cell lights up — BLUE highlight flash on entering value
 *       - Ghost outline at old position (dashed, fades over 15f)
 *
 *     Phase 2 (12f): Calculation display
 *       - "−leftVal" floats UP from left cell (red, with animated "−" sign)
 *       - "+rightVal" floats DOWN into window (blue, with animated "+" sign)
 *       - Sum ticks from oldSum to newSum (ValueFlow tick animation)
 *
 *     Phase 3 (12f): Result
 *       - Live calculation: "oldSum − leftVal + rightVal = newSum"
 *       - "BOOM" text punches in (overshoot spring)
 *       - Running max tracker updates
 *
 *     Phase 4 (12f): Settle + prepare for next
 *       - Non-focus text dims to 0.3 opacity
 *       - Camera drift adjusts
 *
 *   CAMERA: Tracks the window. Slight x-offset follows window position.
 *           Punch-zoom (1.06→1.12) on each "BOOM" moment.
 *
 *   LAYERS:
 *     FG: ±value floats, sum calculation, BOOM text
 *     MG: Array + window outline
 *     BG: Ghost outlines, dot grid, dimmed past cells
 *
 * f310-370: "The middle never changes"
 *   - Camera zooms to 1.05, centers
 *   - Middle cells get "lock" visual (zinc border highlight)
 *   - Text slides up
 *
 * f370-408: "This single trick changes everything"
 *   - Big kinetic text. "changes everything" = ACCENT, overshoot scale.
 *   - Fade at end for scene transition
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, tickValue,
    camMulti, smoothLerp, CELL, CELL_STEP,
} from '../helpers/animations';
import {
    DEMO_ARRAY, WINDOW_SIZE, WINDOW_SUMS,
    ACCENT, ACCENT_BG, ACCENT_LIGHT, DANGER, DANGER_BG,
} from '../helpers/timing';

const SlideAndUpdate: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 10);
    const numPos = DEMO_ARRAY.length - WINDOW_SIZE + 1; // 5

    // ━━━ HEADER: "One leaves. One enters." ━━━
    const hLeaveOp = fadeIn(frame, 5, 15);
    const hLeaveY = interpolate(createSpring(frame, fps, 5, SP.gentle), [0, 1], [25, 0]);
    const hEnterOp = fadeIn(frame, 12, 22);
    const hEnterY = interpolate(createSpring(frame, fps, 12, SP.gentle), [0, 1], [25, 0]);
    const hThatsItOp = fadeIn(frame, 20, 30);

    // ━━━ FORMULA BOX ━━━
    const formulaOp = fadeIn(frame, 35, 52);
    const formulaScale = scaleIn(frame, fps, 35, 0.85);
    const minusOp = fadeIn(frame, 42, 52);
    const plusOp = fadeIn(frame, 48, 58);

    // ━━━ ARRAY ━━━
    const getCellOp = (i: number) => {
        const d = 12 + i * 3;
        return fadeIn(frame, d, d + 8);
    };

    // ━━━ SLIDING ANIMATION ━━━
    const slideStart = 75;
    const slideFrames = 48;

    // Current position: 0-4
    const rawPos = frame < slideStart ? 0
        : Math.min((frame - slideStart) / slideFrames, numPos - 1);
    const currentPos = Math.floor(Math.max(0, rawPos));

    // Smooth window X (eased cubic — no jitter)
    const windowTargetX = currentPos * CELL_STEP;
    const prevX = Math.max(0, currentPos - 1) * CELL_STEP;
    const windowX = frame < slideStart ? 0
        : smoothLerp(frame, slideStart + currentPos * slideFrames, slideStart + currentPos * slideFrames + 14, prevX, windowTargetX);

    // Per-slide phase within current iteration (0-47)
    const slidePhase = frame < slideStart ? -1
        : (frame - slideStart) % slideFrames;

    // Leaving/entering cells
    const leavingIdx = currentPos > 0 ? currentPos - 1 : -1;
    const enteringIdx = currentPos + WINDOW_SIZE - 1;
    const leftVal = leavingIdx >= 0 ? DEMO_ARRAY[leavingIdx] : 0;
    const rightVal = DEMO_ARRAY[Math.min(enteringIdx, DEMO_ARRAY.length - 1)];

    // Is cell in current window?
    const inWindow = (i: number) => i >= currentPos && i < currentPos + WINDOW_SIZE;

    // Sum values
    const curSum = WINDOW_SUMS[Math.min(currentPos, numPos - 1)];
    const prevSum = currentPos > 0 ? WINDOW_SUMS[currentPos - 1] : WINDOW_SUMS[0];

    // Sum tick animation
    const slideBase = slideStart + currentPos * slideFrames;
    const sumDisplay = currentPos > 0 && frame >= slideStart
        ? tickValue(frame, slideBase + 14, slideBase + 22, prevSum, curSum)
        : WINDOW_SUMS[0];

    // Float animations for ±values
    const showFloat = frame >= slideStart + slideFrames && slidePhase >= 8 && slidePhase <= 30;
    const floatMinusY = showFloat
        ? interpolate(slidePhase, [8, 20], [0, -35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 0;
    const floatPlusY = showFloat
        ? interpolate(slidePhase, [10, 22], [35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 0;
    const floatOp = showFloat
        ? interpolate(slidePhase, [8, 14, 26, 30], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 0;

    // "BOOM" text
    const showBoom = frame >= slideStart + slideFrames && slidePhase >= 20 && slidePhase <= 38;
    const boomOp = showBoom ? interpolate(slidePhase, [20, 26, 34, 38], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }) : 0;
    const boomScale = showBoom ? scaleIn(frame, fps, slideBase + 20, 0.5) : 1;

    // Live calculation line
    const showCalc = frame >= slideStart + slideFrames && currentPos > 0;
    const calcOp = showCalc ? fadeIn(frame, slideBase + 12, slideBase + 20) : 0;

    // Running max
    const maxSoFar = frame < slideStart
        ? WINDOW_SUMS[0]
        : Math.max(...WINDOW_SUMS.slice(0, currentPos + 1));
    const maxOp = fadeIn(frame, slideStart + 10, slideStart + 25);

    // Ghost outline at previous position
    const ghostOp = currentPos > 0 && frame >= slideStart
        ? fadeOut(frame, slideBase, slideBase + 15) : 0;
    const ghostX = Math.max(0, currentPos - 1) * CELL_STEP;

    // ━━━ PHASE C: "Middle never changes" ━━━
    const middleStart = 318;
    const middleOp = fadeIn(frame, middleStart, middleStart + 18);
    const middleY = interpolate(createSpring(frame, fps, middleStart, SP.gentle), [0, 1], [25, 0]);

    // "Changes everything"
    const changeStart = 370;
    const changeOp = fadeIn(frame, changeStart, changeStart + 18);
    const changeScale = scaleIn(frame, fps, changeStart, 0.7);

    // Exit fade
    const exitOp = fadeOut(frame, 395, 408);

    // ━━━ CAMERA ━━━
    const camXOffset = interpolate(frame, [slideStart, slideStart + slideFrames * (numPos - 1)],
        [0, -4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 60, state: { scale: 1.06, x: 0, y: -2 } },
        { at: 310, state: { scale: 1.06, x: camXOffset, y: -2 } },
        { at: 330, state: { scale: 1.04, x: 0, y: 0 } },
        { at: 370, state: { scale: 1.02, x: 0, y: 1 } },
        { at: 408, state: { scale: 1, x: 0, y: 0 } },
    ]);

    const winW = WINDOW_SIZE * CELL.W + (WINDOW_SIZE - 1) * CELL.GAP + 20;
    const winH = CELL.H + 24;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: Math.min(containerOp, exitOp) }}
        >
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.25,
            }} />

            <div
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}
            >
                <div className="flex flex-col items-center gap-9 w-full max-w-[92%]">

                    {/* Header */}
                    <div className="text-center">
                        <p className="text-[48px] font-bold text-zinc-800">
                            <span style={{ opacity: hLeaveOp, transform: `translateY(${hLeaveY}px)`, display: 'inline-block', color: DANGER }}>
                                One leaves.
                            </span>{' '}
                            <span style={{ opacity: hEnterOp, transform: `translateY(${hEnterY}px)`, display: 'inline-block', color: ACCENT }}>
                                One enters.
                            </span>{' '}
                            <span style={{ opacity: hThatsItOp, display: 'inline-block' }} className="text-zinc-400">
                                That's it.
                            </span>
                        </p>
                    </div>

                    {/* Formula box */}
                    <div
                        className="px-8 py-5 rounded-2xl bg-zinc-50"
                        style={{
                            opacity: formulaOp,
                            transform: `scale(${formulaScale})`,
                            border: `3px solid ${ACCENT}`,
                        }}
                    >
                        <div className="font-mono text-[32px] text-zinc-800 flex items-center gap-3 flex-wrap justify-center">
                            <span className="font-black" style={{ color: ACCENT }}>newSum</span>
                            <span className="text-zinc-400">=</span>
                            <span className="font-bold">oldSum</span>
                            <span className="font-black text-[38px]" style={{ color: DANGER, opacity: minusOp }}>−</span>
                            <span
                                className="font-bold px-3 py-1 rounded-lg"
                                style={{ color: DANGER, backgroundColor: DANGER_BG, opacity: minusOp }}
                            >
                                left
                            </span>
                            <span className="font-black text-[38px]" style={{ color: ACCENT, opacity: plusOp }}>+</span>
                            <span
                                className="font-bold px-3 py-1 rounded-lg"
                                style={{ color: ACCENT, backgroundColor: ACCENT_BG, border: `2px solid ${ACCENT_LIGHT}`, opacity: plusOp }}
                            >
                                right
                            </span>
                        </div>
                    </div>

                    {/* Array + Window */}
                    <div className="relative">
                        <div className="flex items-center" style={{ gap: CELL.GAP }}>
                            {DEMO_ARRAY.map((val, i) => {
                                const active = inWindow(i);
                                const isLeaving = i === leavingIdx && frame >= slideStart + slideFrames;
                                const isEntering = i === enteringIdx && frame >= slideStart + slideFrames;
                                let bg = '#fafafa';
                                let border = '#d4d4d8';
                                if (active && frame >= slideStart) { bg = ACCENT_BG; border = ACCENT; }
                                else if (i >= 0 && i < WINDOW_SIZE && frame < slideStart) { bg = ACCENT_BG; border = ACCENT; }

                                return (
                                    <div
                                        key={i}
                                        className="relative flex items-center justify-center"
                                        style={{
                                            width: CELL.W, height: CELL.H,
                                            borderRadius: CELL.R,
                                            border: `${CELL.BORDER}px solid ${border}`,
                                            backgroundColor: bg,
                                            opacity: getCellOp(i),
                                        }}
                                    >
                                        <span className="text-[48px] font-bold text-zinc-800 font-mono">{val}</span>
                                        <span className="absolute -bottom-10 text-lg font-mono text-zinc-400">{i}</span>

                                        {/* Red "−val" float above leaving cell */}
                                        {isLeaving && (
                                            <div
                                                className="absolute -top-16 left-1/2 -translate-x-1/2"
                                                style={{ opacity: floatOp, transform: `translateY(${floatMinusY}px)` }}
                                            >
                                                <span className="text-[34px] font-black" style={{ color: DANGER }}>−{leftVal}</span>
                                            </div>
                                        )}
                                        {/* Blue "+val" float above entering cell */}
                                        {isEntering && i < DEMO_ARRAY.length && (
                                            <div
                                                className="absolute -top-16 left-1/2 -translate-x-1/2"
                                                style={{ opacity: floatOp, transform: `translateY(${floatPlusY}px)` }}
                                            >
                                                <span className="text-[34px] font-black" style={{ color: ACCENT }}>+{rightVal}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Ghost window at prev pos */}
                        {currentPos > 0 && frame >= slideStart && (
                            <div className="absolute top-1/2 rounded-2xl pointer-events-none" style={{
                                width: winW, height: winH, border: '3px dashed #d4d4d8',
                                left: ghostX - 10, transform: 'translateY(-50%)', opacity: ghostOp,
                            }} />
                        )}

                        {/* Active window */}
                        <div className="absolute top-1/2 rounded-2xl pointer-events-none" style={{
                            width: winW, height: winH,
                            border: `${CELL.BORDER}px solid ${ACCENT}`,
                            left: windowX - 10,
                            transform: 'translateY(-50%)',
                            boxShadow: `0 0 0 4px ${ACCENT}18`,
                        }} />
                    </div>

                    {/* Live calculation */}
                    {showCalc && (
                        <div className="flex items-center gap-3 font-mono text-[28px]" style={{ opacity: calcOp }}>
                            <span className="text-zinc-400">{prevSum}</span>
                            <span className="font-bold" style={{ color: DANGER }}>− {leftVal}</span>
                            <span className="font-bold" style={{ color: ACCENT }}>+ {rightVal}</span>
                            <span className="text-zinc-400">=</span>
                            <span
                                className="text-[34px] font-black px-4 py-1 rounded-xl"
                                style={{ color: ACCENT, backgroundColor: ACCENT_BG }}
                            >
                                {sumDisplay}
                            </span>
                            {/* BOOM */}
                            <span
                                className="text-[32px] font-black text-zinc-800 ml-3 uppercase"
                                style={{ opacity: boomOp, transform: `scale(${boomScale})`, display: 'inline-block' }}
                            >
                                Boom!
                            </span>
                        </div>
                    )}

                    {/* Initial sum */}
                    {frame < slideStart + slideFrames && (
                        <div className="font-mono text-[28px] text-zinc-600">
                            current sum = <span className="font-bold" style={{ color: ACCENT }}>{WINDOW_SUMS[0]}</span>
                        </div>
                    )}

                    {/* Running max tracker */}
                    <div
                        className="flex items-center gap-5 px-6 py-3 rounded-xl bg-zinc-50"
                        style={{ opacity: maxOp, border: '2px solid #e4e4e7' }}
                    >
                        <span className="text-xl font-semibold text-zinc-500 uppercase tracking-wider">Max</span>
                        <span className="text-[34px] font-black font-mono" style={{ color: ACCENT }}>{maxSoFar}</span>
                        <div className="flex gap-[6px]">
                            {WINDOW_SUMS.slice(0, Math.max(currentPos + 1, 1)).map((s, i) => (
                                <div
                                    key={i}
                                    className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                                    style={{
                                        backgroundColor: s === maxSoFar ? ACCENT_BG : '#f4f4f5',
                                        color: s === maxSoFar ? ACCENT : '#a1a1aa',
                                        border: s === maxSoFar ? `3px solid ${ACCENT}` : '2px solid #e4e4e7',
                                    }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* "The middle never changes" */}
                    <div style={{ opacity: middleOp, transform: `translateY(${middleY}px)` }}>
                        <p className="text-[38px] font-bold text-zinc-600 text-center">
                            The middle <span className="font-black text-zinc-800">never changes</span>.
                            So <span className="text-zinc-400">don't touch it</span>.
                        </p>
                    </div>

                    {/* "This single trick changes everything" */}
                    <div style={{ opacity: changeOp, transform: `scale(${changeScale})` }}>
                        <p className="text-[48px] font-black text-zinc-900 text-center">
                            This single trick{' '}
                            <span style={{ color: ACCENT }}>changes everything</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideAndUpdate;
