/**
 * Scene 6 — VariableWindow (46.90 – 54.94s, 241 frames)
 *
 * CSV LINES:
 *   L11 (46.90-50.62 / f0-112): "And this idea goes way beyond max sum.
 *        Longest substring without repeats? Sliding window."
 *   L12 (50.94-54.94 / f121-241): "Smallest subarray above a target? Sliding window.
 *        Any time you're scanning a range that grows or shrinks, this is your tool."
 *
 * VISUAL PLAN:
 *
 * f0-10:    Fade in container + dot grid.
 *
 * f5-35:    "And this idea goes way beyond max sum"
 *           — word-by-word, "way beyond" in ACCENT, overshoot spring
 *
 * f30-55:   Title card: "Variable-Size Windows"
 *           — Scale punch 0.6→1 overshoot
 *           — Underline stroke draw-on
 *
 * f40-80:   EXPANDING WINDOW DEMO:
 *           Array: [a, b, c, b, d, e, c, a]
 *           Window starts at 1 cell, expands char by char
 *           - Right pointer extends right (ACCENT glow)
 *           - Letters appear inside window
 *           - At 'b' repeat → window contracts from left (RED flash)
 *           - "Expand → Shrink" labels
 *
 * f80-110:  Subtitle: "Longest substring without repeats? Sliding window."
 *           — "Sliding window" in ACCENT bold
 *
 * f115-160: SHRINKING WINDOW DEMO:
 *           Array: [4, 2, 1, 7, 8, 1, 2, 8]  target = 10
 *           Window starts wide, shrinks from left
 *           - Running sum ticks down
 *           - When sum < target → expand right
 *           - When sum ≥ target → record + shrink left
 *           - "Smallest subarray above 10"
 *
 * f155-200: "Any time you're scanning a range…"
 *           — word-by-word, gentle spring
 *
 * f195-230: "this is your tool" — BIG kinetic text, ACCENT
 *           — overshoot scale 0.5→1
 *
 * f225-241: Fade out
 *
 * CAMERA: gentle drift, zoom 1.04 on demos, settle at end
 * LAYERS: FG: labels + text, MG: arrays + windows, BG: dot grid
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, camMulti, strokeAnim,
} from '../helpers/animations';
import { ACCENT, ACCENT_BG, DANGER, DANGER_BG } from '../helpers/timing';

/* Local demo data */
const SUBSTR_ARRAY = ['a', 'b', 'c', 'b', 'd', 'e', 'c', 'a'];
const SUBSUM_ARRAY = [4, 2, 1, 7, 8, 1, 2, 8];
const SUBSUM_TARGET = 10;

const VariableWindow: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 10);
    const exitOp = fadeOut(frame, 228, 241);

    // ━━━ HEADER: "way beyond max sum" ━━━
    const headerWords = ['And', 'this', 'idea', 'goes', 'way', 'beyond', 'max', 'sum.'];
    const accentWords = new Set(['way', 'beyond']);
    const hwOps = headerWords.map((_, i) => fadeIn(frame, 5 + i * 3, 12 + i * 3));
    const hwY = headerWords.map((_, i) =>
        interpolate(createSpring(frame, fps, 5 + i * 3, SP.gentle), [0, 1], [18, 0]),
    );

    // ━━━ TITLE CARD ━━━
    const titleOp = fadeIn(frame, 32, 48);
    const titleScale = scaleIn(frame, fps, 32, 0.6);
    // Underline
    const underlineLen = 280;
    const underlineDash = strokeAnim(frame, 34, 52, underlineLen);

    // ━━━ EXPANDING WINDOW DEMO ━━━
    const expandStart = 42;
    const expandRate = 5; // frames per cell expansion
    const expandLen = Math.min(
        Math.floor(Math.max(0, frame - expandStart) / expandRate),
        SUBSTR_ARRAY.length,
    );
    // Show expand phase
    const expandPhaseOp = fadeIn(frame, expandStart - 4, expandStart + 4);
    // Detect repeat at position 3 ('b' repeats)
    const hitRepeat = expandLen >= 4;
    const contractStart = expandStart + 4 * expandRate + 5;
    const contractLeftShift = hitRepeat && frame >= contractStart
        ? Math.min(Math.floor((frame - contractStart) / expandRate), 2) : 0;

    // ━━━ "Longest substring…" ━━━
    const substrTextOp = fadeIn(frame, 85, 100);
    const substrTextY = interpolate(createSpring(frame, fps, 85, SP.gentle), [0, 1], [20, 0]);

    // ━━━ SHRINKING WINDOW DEMO ━━━
    const shrinkStart = 118;
    const shrinkPhaseOp = fadeIn(frame, shrinkStart - 4, shrinkStart + 4);
    // Simple simulation: window expands until sum ≥ target, then shrinks
    const shrinkTime = Math.max(0, frame - shrinkStart);
    let sLeft = 0;
    let sRight = 0;
    let sSum = 0;
    // Quick sim
    const simSteps: Array<{l: number; r: number; sum: number}> = [];
    {
        let l = 0; let s = 0;
        for (let r = 0; r < SUBSUM_ARRAY.length; r++) {
            s += SUBSUM_ARRAY[r];
            while (s >= SUBSUM_TARGET && l <= r) {
                simSteps.push({ l, r, sum: s });
                s -= SUBSUM_ARRAY[l]; l++;
            }
            simSteps.push({ l, r, sum: s });
        }
    }
    const simIdx = Math.min(Math.floor(shrinkTime / 6), simSteps.length - 1);
    if (simSteps.length > 0 && frame >= shrinkStart) {
        const step = simSteps[Math.max(0, simIdx)];
        sLeft = step.l; sRight = step.r; sSum = step.sum;
    }

    // ━━━ "Any time you're scanning…" ━━━
    const scanWords = ['Any', 'time', "you're", 'scanning', 'a', 'range…'];
    const swOps = scanWords.map((_, i) => fadeIn(frame, 158 + i * 4, 166 + i * 4));
    const swY = scanWords.map((_, i) =>
        interpolate(createSpring(frame, fps, 158 + i * 4, SP.gentle), [0, 1], [18, 0]),
    );

    // ━━━ "this is your tool" ━━━
    const toolOp = fadeIn(frame, 198, 215);
    const toolScale = scaleIn(frame, fps, 198, 0.5);

    // ━━━ CAMERA ━━━
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 42, state: { scale: 1.04, x: 0, y: -2 } },
        { at: 110, state: { scale: 1, x: 0, y: 0 } },
        { at: 118, state: { scale: 1.04, x: 0, y: -2 } },
        { at: 190, state: { scale: 1, x: 0, y: 0 } },
        { at: 241, state: { scale: 1, x: 0, y: 0 } },
    ]);

    const cellW = 100;
    const cellGap = 12;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: Math.min(containerOp, exitOp) }}
        >
            {/* BG grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.22,
            }} />

            <div className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}>

                <div className="flex flex-col items-center gap-7 w-full max-w-[92%]">
                    {/* Header */}
                    <p className="text-[40px] font-semibold text-zinc-700 text-center leading-snug">
                        {headerWords.map((w, i) => (
                            <span key={i} style={{
                                opacity: hwOps[i],
                                transform: `translateY(${hwY[i]}px)`,
                                display: 'inline-block',
                                marginRight: 8,
                                color: accentWords.has(w) ? ACCENT : undefined,
                                fontWeight: accentWords.has(w) ? 800 : undefined,
                            }}>{w}</span>
                        ))}
                    </p>

                    {/* Title card */}
                    <div className="flex flex-col items-center" style={{ opacity: titleOp, transform: `scale(${titleScale})` }}>
                        <span className="text-[50px] font-black text-zinc-900">
                            Variable-Size Windows
                        </span>
                        <svg width={underlineLen} height={8} className="mt-1">
                            <line
                                x1={0} y1={4} x2={underlineLen} y2={4}
                                stroke={ACCENT} strokeWidth={6} strokeLinecap="round"
                                strokeDasharray={underlineDash.strokeDasharray}
                                strokeDashoffset={underlineDash.strokeDashoffset}
                            />
                        </svg>
                    </div>

                    {/* ── EXPANDING WINDOW DEMO ── */}
                    <div className="flex flex-col items-center gap-3" style={{ opacity: expandPhaseOp }}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl font-bold uppercase tracking-wider"
                                style={{ color: ACCENT }}>Expand</span>
                            {hitRepeat && frame >= contractStart && (
                                <span className="text-xl font-bold uppercase tracking-wider"
                                    style={{ color: DANGER }}>→ Shrink</span>
                            )}
                        </div>
                        <div className="relative">
                            <div className="flex items-center" style={{ gap: cellGap }}>
                                {SUBSTR_ARRAY.map((ch, i) => {
                                    const inWin = i >= contractLeftShift && i < expandLen;
                                    const isRepeat = hitRepeat && i === 3 && frame >= expandStart + 3 * expandRate;
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center justify-center"
                                            style={{
                                                width: cellW, height: cellW,
                                                borderRadius: 14,
                                                border: `3px solid ${isRepeat ? DANGER : inWin ? ACCENT : '#d4d4d8'}`,
                                                backgroundColor: isRepeat ? DANGER_BG : inWin ? ACCENT_BG : '#fafafa',
                                            }}
                                        >
                                            <span className="text-[32px] font-bold font-mono"
                                                style={{ color: isRepeat ? DANGER : inWin ? ACCENT : '#71717a' }}>
                                                {ch}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <p className="text-lg text-zinc-400 font-mono">
                            Longest substring without repeats
                        </p>
                    </div>

                    {/* "Longest substring... Sliding window." */}
                    <p className="text-[32px] text-zinc-600 text-center"
                        style={{ opacity: substrTextOp, transform: `translateY(${substrTextY}px)` }}>
                        Longest substring without repeats?{' '}
                        <span className="font-black" style={{ color: ACCENT }}>Sliding window.</span>
                    </p>

                    {/* ── SHRINKING WINDOW DEMO ── */}
                    <div className="flex flex-col items-center gap-3" style={{ opacity: shrinkPhaseOp }}>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-bold text-zinc-500">target ≥</span>
                            <span className="text-[28px] font-black font-mono px-3 py-1 rounded-lg"
                                style={{ color: ACCENT, backgroundColor: ACCENT_BG }}>
                                {SUBSUM_TARGET}
                            </span>
                            <span className="text-xl text-zinc-400 ml-3">sum =</span>
                            <span className="text-[28px] font-black font-mono"
                                style={{ color: sSum >= SUBSUM_TARGET ? ACCENT : '#71717a' }}>
                                {sSum}
                            </span>
                        </div>
                        <div className="relative">
                            <div className="flex items-center" style={{ gap: cellGap }}>
                                {SUBSUM_ARRAY.map((val, i) => {
                                    const inWin = frame >= shrinkStart && i >= sLeft && i <= sRight;
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center justify-center"
                                            style={{
                                                width: cellW, height: cellW,
                                                borderRadius: 14,
                                                border: `3px solid ${inWin ? ACCENT : '#d4d4d8'}`,
                                                backgroundColor: inWin ? ACCENT_BG : '#fafafa',
                                            }}
                                        >
                                            <span className="text-[38px] font-bold font-mono"
                                                style={{ color: inWin ? ACCENT : '#71717a' }}>
                                                {val}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <p className="text-lg text-zinc-400 font-mono">
                            Smallest subarray above target
                        </p>
                    </div>

                    {/* "Any time you're scanning a range…" */}
                    <p className="text-[36px] font-semibold text-zinc-700 text-center leading-snug">
                        {scanWords.map((w, i) => (
                            <span key={i} style={{
                                opacity: swOps[i],
                                transform: `translateY(${swY[i]}px)`,
                                display: 'inline-block',
                                marginRight: 8,
                            }}>{w}</span>
                        ))}
                    </p>

                    {/* "this is your tool" */}
                    <div style={{ opacity: toolOp, transform: `scale(${toolScale})` }}>
                        <p className="text-[54px] font-black text-center">
                            this is{' '}
                            <span style={{ color: ACCENT }}>your tool</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariableWindow;
