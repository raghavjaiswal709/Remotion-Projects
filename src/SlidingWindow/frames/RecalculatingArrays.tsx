/**
 * Scene 1 — RecalculatingArrays (0.00 – 7.94s, 238 frames)
 *
 * CSV LINES:
 *   L1 (0.00-3.68 / f0-110): "Still recalculating arrays? That's why interviews reject you."
 *   L2 (4.08-7.94 / f122-238): "Day one of turning you into a logic monster. Today's weapon, sliding window."
 *
 * VISUAL PLAN (frame-by-frame):
 *
 * ┌────────────────────────────────────────────────────────────────────────────────┐
 * │ PHASE A: "Still recalculating?" — f0-110                                      │
 * │                                                                               │
 * │ f0-5:   Container fades in. Background: faint dot grid (alive feeling)        │
 * │ f5-20:  "Still recalculating arrays?" — word-by-word entrance from bottom     │
 * │         "recalculating" is ACCENT colored, scales 0.8→1 with overshoot        │
 * │ f12-40: Array cells stagger in (spring scale 0→1, 4-frame stagger per cell)   │
 * │ f25-95: 3 brute-force iterations cycle:                                       │
 * │         - Iter 0 (f25-50): highlight cells [0,1,2], show Σ 2+7+1 = 10        │
 * │         - Iter 1 (f50-75): highlight [1,2,3], show Σ 7+1+5 = 13              │
 * │         - Iter 2 (f75-100): highlight [2,3,4], show Σ 1+5+3 = 9              │
 * │         Between iterations: "recalculate all 3!" label in red                 │
 * │ f90-110: "SLOW" stamp punches in with overshoot spring + -12° rotation        │
 * │          "interviews reject you" text slides up from below                    │
 * │                                                                               │
 * │ CAMERA: f0→ 1.0, f20-50 zoom to 1.15 (focus on array), hold                 │
 * │                                                                               │
 * │ FOREGROUND: Active sum calculation + highlight                                │
 * │ MIDGROUND:  Full array with indices                                           │
 * │ BACKGROUND: Faint grid dots (alive)                                           │
 * ├────────────────────────────────────────────────────────────────────────────────┤
 * │ PHASE B: "Day one — SLIDING WINDOW" — f110-238                                │
 * │                                                                               │
 * │ f110-130: Phase A fades out, camera zooms back to 1.0                         │
 * │ f122-137: "DAY ONE" subtitle (small caps, tracking 0.3em) slides up           │
 * │ f140-160: "Today's weapon" text fades in                                      │
 * │ f155-175: "SLIDING" + "WINDOW" punch in (scale 0.5→1, overshoot spring)      │
 * │           Text is massive: 100px+ font                                        │
 * │ f175-210: Animated underline draws left→right under WINDOW                    │
 * │ f195-225: Ghost array silhouette appears under title (continuity hint)        │
 * │ f210-238: Blue window outline pulses twice over the ghost array               │
 * │                                                                               │
 * │ CAMERA: f110-140 whip-zoom back to 1.0, then settle                          │
 * │         f155→ slight zoom 1.03 on the title (punch-in)                        │
 * └────────────────────────────────────────────────────────────────────────────────┘
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn,
    camMulti, CELL,
} from '../helpers/animations';
import { DEMO_ARRAY, ACCENT, DANGER, ACCENT_BG } from '../helpers/timing';

const RecalculatingArrays: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ━━━ CONTAINER ━━━
    const containerOpacity = fadeIn(frame, 0, 12);

    // ━━━ BACKGROUND: subtle dot grid (layer 3 — always present, alive) ━━━
    // Rendered as a CSS repeating pattern — not animated per-frame, but camera drift makes it feel alive

    // ━━━ PHASE A: "Still recalculating arrays?" ━━━

    // Brute-force area visibility
    const phaseAOpacity = fadeOut(frame, 110, 135);

    // "Still" word
    const w1 = fadeIn(frame, 5, 12);
    const w1Y = interpolate(createSpring(frame, fps, 5, SP.gentle), [0, 1], [30, 0]);
    // "recalculating" word — accent + overshoot scale
    const w2 = fadeIn(frame, 9, 16);
    const w2Scale = scaleIn(frame, fps, 9, 0.7);
    // "arrays?" word
    const w3 = fadeIn(frame, 13, 20);
    const w3Y = interpolate(createSpring(frame, fps, 13, SP.gentle), [0, 1], [25, 0]);

    // Array cells stagger in
    const getCellEntry = (i: number) => {
        const d = 15 + i * 4;
        return {
            scale: interpolate(createSpring(frame, fps, d, SP.snappy), [0, 1], [0, 1]),
            opacity: fadeIn(frame, d, d + 10),
        };
    };

    // Brute-force iterations: 3 cycles, each ~25 frames
    const iterDur = 24;
    const iterStart = 28;
    const getIter = () => {
        if (frame < iterStart) return -1;
        return Math.min(Math.floor((frame - iterStart) / iterDur), 2);
    };
    const currentIter = getIter();

    // Cell highlight: which cells are being summed
    const isActive = (ci: number) => {
        if (currentIter < 0) return false;
        return ci >= currentIter && ci < currentIter + 3;
    };

    // Sum line for current iteration
    const getIterOpacity = (idx: number) => {
        const s = iterStart + idx * iterDur;
        const fadeInEnd = s + 10;
        const fadeOutStart = s + 18;
        const fadeOutEnd = s + iterDur;
        const inVal = fadeIn(frame, s, fadeInEnd);
        const outVal = idx < 2 ? fadeOut(frame, fadeOutStart, fadeOutEnd) : 1;
        return Math.min(inVal, outVal);
    };
    const sums = [[2, 7, 1, 10], [7, 1, 5, 13], [1, 5, 3, 9]];

    // "recalculate all 3!" red label — appears after first iteration
    const readdOp = currentIter >= 1 ? fadeIn(frame, iterStart + currentIter * iterDur + 8, iterStart + currentIter * iterDur + 16) : 0;

    // "SLOW" stamp
    const stampOp = fadeIn(frame, 88, 100);
    const stampScale = createSpring(frame, fps, 88, SP.overshoot);

    // "interviews reject you"
    const rejectOp = fadeIn(frame, 95, 108);
    const rejectY = interpolate(createSpring(frame, fps, 95, SP.gentle), [0, 1], [25, 0]);

    // ━━━ PHASE B: "Day one — SLIDING WINDOW" ━━━

    const dayOneOp = fadeIn(frame, 122, 137);
    const dayOneY = interpolate(createSpring(frame, fps, 122, SP.gentle), [0, 1], [30, 0]);

    const weaponOp = fadeIn(frame, 140, 155);
    const weaponY = interpolate(createSpring(frame, fps, 140, SP.gentle), [0, 1], [20, 0]);

    const titleOp = fadeIn(frame, 155, 168);
    const titleScale = scaleIn(frame, fps, 155, 0.5);

    // Underline draws left→right
    const underlineW = interpolate(frame, [175, 210], [0, 100], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Ghost array under title
    const ghostOp = fadeIn(frame, 195, 212);
    // Blue window outline pulse over ghost
    const windowPulseOp = interpolate(frame, [210, 220, 230, 238], [0, 0.8, 0.4, 0.9], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // ━━━ CAMERA ━━━
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 25, state: { scale: 1.12, x: 0, y: -3 } },      // zoom into array
        { at: 110, state: { scale: 1.12, x: 0, y: -3 } },     // hold
        { at: 140, state: { scale: 1.0, x: 0, y: 0 } },       // whip back
        { at: 160, state: { scale: 1.04, x: 0, y: 1 } },      // slight zoom on title
        { at: 238, state: { scale: 1.02, x: 0, y: 0 } },      // settle
    ]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: containerOpacity }}
        >
            {/* Background: subtle dot grid — layer 3 */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.35,
                }}
            />

            <div
                className="w-full h-full flex flex-col items-center justify-center relative"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}
            >
                {/* ━━━ PHASE A ━━━ */}
                <div
                    className="flex flex-col items-center gap-14 w-full max-w-[92%] absolute"
                    style={{ opacity: phaseAOpacity }}
                >
                    {/* Word-by-word title */}
                    <div className="text-center">
                        <p className="text-[56px] font-black text-zinc-900 tracking-tight leading-tight">
                            <span style={{ opacity: w1, transform: `translateY(${w1Y}px)`, display: 'inline-block' }}>
                                Still{' '}
                            </span>
                            <span style={{
                                opacity: w2,
                                transform: `scale(${w2Scale})`,
                                display: 'inline-block',
                                color: ACCENT,
                            }}>
                                recalculating
                            </span>
                            <span style={{ opacity: w3, transform: `translateY(${w3Y}px)`, display: 'inline-block' }}>
                                {' '}arrays?
                            </span>
                        </p>
                    </div>

                    {/* Array — layer 2 (midground) */}
                    <div className="flex items-center gap-[14px]">
                        {DEMO_ARRAY.map((val, i) => {
                            const c = getCellEntry(i);
                            const active = isActive(i);
                            return (
                                <div
                                    key={i}
                                    className="relative flex items-center justify-center"
                                    style={{
                                        width: CELL.W,
                                        height: CELL.H,
                                        borderRadius: CELL.R,
                                        border: `${CELL.BORDER}px solid ${active ? ACCENT : '#d4d4d8'}`,
                                        backgroundColor: active ? ACCENT_BG : '#fafafa',
                                        transform: `scale(${c.scale})`,
                                        opacity: c.opacity,
                                    }}
                                >
                                    <span className="text-[42px] font-bold text-zinc-800 font-mono">{val}</span>
                                    <span className="absolute -bottom-9 text-base font-mono text-zinc-400">{i}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Brute-force sum lines — layer 1 (foreground) */}
                    <div className="flex flex-col items-center gap-3 min-h-[100px]">
                        {sums.map(([a, b, c, sum], idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 font-mono text-[32px]"
                                style={{ opacity: getIterOpacity(idx) }}
                            >
                                <span className="text-zinc-400">Σ</span>
                                <span className="text-zinc-700 font-bold">{a} + {b} + {c}</span>
                                <span className="text-zinc-400">=</span>
                                <span className="font-black text-zinc-900 text-[32px]">{sum}</span>
                                {idx >= 1 && (
                                    <span
                                        className="text-base font-sans font-bold ml-3 px-3 py-1 rounded-full"
                                        style={{ color: DANGER, backgroundColor: '#FEE2E2', opacity: readdOp }}
                                    >
                                        ← re-add all 3!
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* "SLOW" stamp — overshoot + rotation */}
                    <div
                        className="absolute flex items-center justify-center"
                        style={{
                            opacity: stampOp,
                            transform: `scale(${interpolate(stampScale, [0, 1], [2.5, 1])}) rotate(-12deg)`,
                        }}
                    >
                        <div
                            className="rounded-2xl px-12 py-5"
                            style={{ border: `6px solid ${DANGER}` }}
                        >
                            <span className="text-[76px] font-black tracking-wider uppercase" style={{ color: DANGER }}>
                                SLOW
                            </span>
                        </div>
                    </div>

                    {/* "interviews reject you" */}
                    <div style={{ opacity: rejectOp, transform: `translateY(${rejectY}px)` }}>
                        <p className="text-[36px] font-bold text-zinc-500 text-center">
                            That's why interviews{' '}
                            <span className="font-black" style={{ color: DANGER }}>reject</span> you.
                        </p>
                    </div>
                </div>

                {/* ━━━ PHASE B ━━━ */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
                    {/* "Day One" */}
                    <div style={{ opacity: dayOneOp, transform: `translateY(${dayOneY}px)` }}>
                        <p className="text-[32px] font-semibold text-zinc-400 uppercase tracking-[0.35em]">
                            Day One — Your Weapon
                        </p>
                    </div>

                    {/* "Today's weapon" */}
                    <div style={{ opacity: weaponOp, transform: `translateY(${weaponY}px)` }}>
                        <p className="text-[36px] font-bold text-zinc-500">Today's weapon:</p>
                    </div>

                    {/* SLIDING WINDOW — massive title */}
                    <div
                        className="text-center"
                        style={{ opacity: titleOp, transform: `scale(${titleScale})` }}
                    >
                        <h1
                            className="text-[120px] font-black tracking-tight leading-[0.9]"
                            style={{ color: ACCENT }}
                        >
                            SLIDING
                        </h1>
                        <h1 className="text-[120px] font-black tracking-tight leading-[0.9] text-zinc-900">
                            WINDOW
                        </h1>
                        {/* Draw-on underline */}
                        <div className="flex justify-center mt-5">
                            <div
                                className="h-[6px] rounded-full"
                                style={{
                                    width: `${underlineW}%`,
                                    maxWidth: 520,
                                    backgroundColor: ACCENT,
                                }}
                            />
                        </div>
                    </div>

                    {/* Ghost array silhouette */}
                    <div className="flex items-center gap-2 mt-6" style={{ opacity: ghostOp }}>
                        {DEMO_ARRAY.map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border-[3px] border-zinc-200"
                                style={{
                                    width: 52,
                                    height: 52,
                                    opacity: fadeIn(frame, 198 + i * 3, 208 + i * 3),
                                }}
                            />
                        ))}
                    </div>

                    {/* Blue window outline pulse over ghost */}
                    <div
                        className="flex items-center gap-2"
                        style={{ opacity: windowPulseOp, marginTop: -66 }}
                    >
                        <div
                            className="rounded-xl"
                            style={{
                                width: 3 * 52 + 2 * 8 + 12,
                                height: 60,
                                border: `4px solid ${ACCENT}`,
                                boxShadow: `0 0 0 3px ${ACCENT}20`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecalculatingArrays;
