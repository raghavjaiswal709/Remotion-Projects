/**
 * Scene 3 — WindowIntro (17.86 – 26.42s, 257 frames)
 *
 * CSV LINES:
 *   L5 (17.86-22.24 / f0-131): "Here's the smarter way. Imagine a window on the array.
 *                                 It has a start. It has an end."
 *   L6 (22.82-26.42 / f149-257): "Now listen carefully. When the window moves,
 *                                   only two numbers matter."
 *
 * VISUAL PLAN:
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ PHASE A: "Smarter way" + Window appears (f0-130)                     │
 * │                                                                      │
 * │ f0-5:    Container in. Dot grid.                                     │
 * │ f5-20:   "Here's the smarter way" — "smarter" ACCENT, scale punch   │
 * │ f20-45:  Array cells stagger in (same DEMO_ARRAY, visual continuity) │
 * │ f50-70:  Blue window rectangle DRAWS itself (stroke animation) around│
 * │          cells [0,1,2]. Not a hard appear — the border draws on.     │
 * │ f70-85:  "START" label springs down above left edge of window        │
 * │ f80-95:  "END" label springs down above right edge of window         │
 * │ f95-115: Sum "2 + 7 + 1 = 10" fades in below array                  │
 * │ f100-130:"Imagine a window" text — "window" ACCENT bold              │
 * │                                                                      │
 * │ CAMERA: f0→1.0, f20-50→1.08 zoom on array, hold                     │
 * │                                                                      │
 * │ FOREGROUND: START/END labels, sum                                    │
 * │ MIDGROUND: Array + window outline                                    │
 * │ BACKGROUND: Dot grid                                                 │
 * ├───────────────────────────────────────────────────────────────────────┤
 * │ PHASE B: Window slides + "only TWO numbers matter" (f130-257)        │
 * │                                                                      │
 * │ f130-140: "Now listen carefully" text fades in                       │
 * │ f140-180: Window slides RIGHT by one cell (spring-inertia easing)    │
 * │   f145:   Cell 0 starts dimming (opacity 1→0.2)                     │
 * │   f155:   Cell 3 highlights (border+bg → ACCENT)                    │
 * │   f160:   "LEAVES" label under cell 0 — red, with ← arrow drawing  │
 * │   f170:   "ENTERS" label above cell 3 — blue, with → arrow drawing │
 * │   f155-180: Ghost outline stays at old position (dashed, fading)     │
 * │ f185-210: "unchanged" badges float above cells 1,2                   │
 * │ f210-235: "Only TWO numbers matter" — "TWO" massive ACCENT,         │
 * │           scale 0.6→1 overshoot. Rest text smaller.                  │
 * │ f235-257: "Don't recalculate the middle" — pill badge, zinc          │
 * │                                                                      │
 * │ CAMERA: f130-150→ slight pan left following slide. f210→ zoom 1.05   │
 * │         on the "TWO" text.                                           │
 * │                                                                      │
 * │ LAYERS:                                                              │
 * │   FG: LEAVES/ENTERS labels, TWO text                                │
 * │   MG: Array + window outline (both old ghost + new position)         │
 * │   BG: Dot grid + faded cell 0                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
    createSpring, SP, fadeIn, fadeOut, scaleIn, strokeAnim,
    camMulti, smoothLerp, CELL, CELL_STEP,
} from '../helpers/animations';
import {
    DEMO_ARRAY, WINDOW_SIZE,
    ACCENT, ACCENT_BG, ACCENT_LIGHT, DANGER, DANGER_BG,
} from '../helpers/timing';

const WindowIntro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = fadeIn(frame, 0, 12);

    // ━━━ PHASE A: "Smarter way" ━━━

    const smartOp = fadeIn(frame, 5, 18);
    const smartY = interpolate(createSpring(frame, fps, 5, SP.gentle), [0, 1], [30, 0]);
    const smartScale = scaleIn(frame, fps, 8, 0.8);

    // Array cells
    const getCellEntry = (i: number) => {
        const d = 22 + i * 3;
        return {
            scale: interpolate(createSpring(frame, fps, d, SP.snappy), [0, 1], [0, 1]),
            opacity: fadeIn(frame, d, d + 8),
        };
    };

    // Window stroke draw-on: SVG rect draws from f50→70
    const winStroke = strokeAnim(frame, 50, 72, 800);
    const winDrawOp = fadeIn(frame, 48, 55);

    // START / END labels
    const startOp = fadeIn(frame, 72, 85);
    const startY = interpolate(createSpring(frame, fps, 72, SP.snappy), [0, 1], [15, 0]);
    const endOp = fadeIn(frame, 80, 92);
    const endY = interpolate(createSpring(frame, fps, 80, SP.snappy), [0, 1], [15, 0]);

    // Initial sum
    const sumOp = fadeIn(frame, 95, 110);

    // "Imagine a window"
    const imagineOp = fadeIn(frame, 100, 118);

    // ━━━ PHASE B: Slide + "TWO numbers matter" ━━━

    const listenOp = fadeIn(frame, 135, 148);

    // Window slide: position 0 → position 1 over f140-178 (smooth eased)
    const windowX = smoothLerp(frame, 140, 178, 0, CELL_STEP);

    // Cell 0 dims
    const cell0Dim = interpolate(frame, [145, 170], [1, 0.2], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    // Cell 3 highlights
    const cell3Hl = interpolate(frame, [155, 175], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Ghost outline at old position
    const ghostOp = frame >= 140 ? fadeOut(frame, 155, 185) : 0;

    // "LEAVES" / "ENTERS" labels + arrow draw-on
    const leavesOp = fadeIn(frame, 162, 175);
    const leavesArrow = strokeAnim(frame, 162, 178, 60);
    const entersOp = fadeIn(frame, 172, 185);
    const entersArrow = strokeAnim(frame, 172, 188, 60);

    // "unchanged" on cells 1, 2
    const unchangedOp = fadeIn(frame, 192, 208);

    // "Only TWO numbers matter"
    const twoOp = fadeIn(frame, 212, 225);
    const twoScale = scaleIn(frame, fps, 212, 0.55);

    // "Don't recalculate the middle"
    const dontOp = fadeIn(frame, 236, 250);

    // ━━━ CAMERA ━━━
    const cam = camMulti(frame, [
        { at: 0, state: { scale: 1, x: 0, y: 0 } },
        { at: 30, state: { scale: 1.08, x: 0, y: -2 } },
        { at: 130, state: { scale: 1.08, x: 0, y: -2 } },
        { at: 155, state: { scale: 1.06, x: -1.5, y: -2 } },  // pan left with slide
        { at: 210, state: { scale: 1.04, x: 0, y: 1 } },      // zoom on TWO text
        { at: 257, state: { scale: 1.0, x: 0, y: 0 } },
    ]);

    // Window outline computed size
    const winW = WINDOW_SIZE * CELL.W + (WINDOW_SIZE - 1) * CELL.GAP + 20;
    const winH = CELL.H + 24;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-white font-sans relative overflow-hidden"
            style={{ opacity: containerOp }}
        >
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.3,
            }} />

            <div
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ transform: cam, transformOrigin: 'center center', willChange: 'transform' }}
            >
                <div className="flex flex-col items-center gap-11 w-full max-w-[92%]">

                    {/* "Here's the smarter way" */}
                    <div style={{ opacity: smartOp, transform: `translateY(${smartY}px)` }}>
                        <p className="text-[50px] font-bold text-zinc-800 text-center">
                            Here's the{' '}
                            <span
                                className="font-black"
                                style={{ color: ACCENT, display: 'inline-block', transform: `scale(${smartScale})` }}
                            >
                                smarter
                            </span>
                            {' '}way
                        </p>
                    </div>

                    {/* Array + Window */}
                    <div className="relative flex flex-col items-center">
                        <div className="flex items-center relative" style={{ gap: CELL.GAP }}>
                            {DEMO_ARRAY.map((val, i) => {
                                const c = getCellEntry(i);
                                let opMul = 1;
                                let bg = '#fafafa';
                                let border = '#d4d4d8';

                                // Initial window (before slide)
                                if (frame < 140 && frame >= 50 && i >= 0 && i < WINDOW_SIZE) {
                                    bg = ACCENT_BG; border = ACCENT;
                                }
                                // After slide starts
                                if (frame >= 140) {
                                    if (i === 0) opMul = cell0Dim;
                                    if (i >= 1 && i <= 2) { bg = ACCENT_BG; border = ACCENT; }
                                    if (i === 3 && cell3Hl > 0.5) { bg = ACCENT_BG; border = ACCENT; }
                                }

                                return (
                                    <div
                                        key={i}
                                        className="relative flex items-center justify-center"
                                        style={{
                                            width: CELL.W, height: CELL.H,
                                            borderRadius: CELL.R,
                                            border: `${CELL.BORDER}px solid ${border}`,
                                            backgroundColor: bg,
                                            transform: `scale(${c.scale})`,
                                            opacity: c.opacity * opMul,
                                        }}
                                    >
                                        <span className="text-[48px] font-bold text-zinc-800 font-mono">{val}</span>
                                        <span className="absolute -bottom-10 text-lg font-mono text-zinc-400">{i}</span>

                                        {/* "LEAVES" under cell 0 */}
                                        {i === 0 && frame >= 160 && (
                                            <div className="absolute -bottom-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ opacity: leavesOp }}>
                                                <svg width="20" height="24" viewBox="0 0 20 24" className="mb-1">
                                                    <path d="M10 0 L10 20 M3 14 L10 22 L17 14"
                                                        stroke={DANGER} strokeWidth="3" strokeLinecap="round" fill="none"
                                                        style={leavesArrow}
                                                    />
                                                </svg>
                                                <span className="text-xl font-bold px-3 py-1 rounded-full"
                                                    style={{ color: DANGER, backgroundColor: DANGER_BG }}>
                                                    LEAVES
                                                </span>
                                            </div>
                                        )}

                                        {/* "ENTERS" above cell 3 */}
                                        {i === 3 && frame >= 170 && (
                                            <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ opacity: entersOp }}>
                                                <span className="text-xl font-bold px-3 py-1 rounded-full mb-1"
                                                    style={{ color: ACCENT, backgroundColor: ACCENT_BG, border: `2px solid ${ACCENT_LIGHT}` }}>
                                                    ENTERS
                                                </span>
                                                <svg width="20" height="24" viewBox="0 0 20 24">
                                                    <path d="M10 24 L10 4 M3 10 L10 2 L17 10"
                                                        stroke={ACCENT} strokeWidth="3" strokeLinecap="round" fill="none"
                                                        style={entersArrow}
                                                    />
                                                </svg>
                                            </div>
                                        )}

                                        {/* "unchanged" on cells 1, 2 */}
                                        {(i === 1 || i === 2) && frame >= 190 && (
                                            <div className="absolute -top-[52px] left-1/2 -translate-x-1/2" style={{ opacity: unchangedOp }}>
                                                <span className="text-sm font-semibold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full whitespace-nowrap">
                                                    unchanged
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Ghost window outline at old position */}
                            {frame >= 140 && (
                                <div
                                    className="absolute top-1/2 rounded-2xl pointer-events-none"
                                    style={{
                                        width: winW, height: winH,
                                        border: '3px dashed #d4d4d8',
                                        left: -10, transform: 'translateY(-50%)',
                                        opacity: ghostOp,
                                    }}
                                />
                            )}

                            {/* Active window — drawn stroke (SVG rect) */}
                            <div
                                className="absolute top-1/2 pointer-events-none"
                                style={{
                                    left: -10 + windowX,
                                    transform: 'translateY(-50%)',
                                    opacity: winDrawOp,
                                }}
                            >
                                <svg width={winW} height={winH} viewBox={`0 0 ${winW} ${winH}`}>
                                    <rect
                                        x="2" y="2"
                                        width={winW - 4} height={winH - 4}
                                        rx="16" ry="16"
                                        fill="none"
                                        stroke={ACCENT}
                                        strokeWidth="4"
                                        style={frame < 72 ? winStroke : undefined}
                                    />
                                </svg>

                                {/* START label */}
                                <div className="absolute -top-[42px] left-3" style={{ opacity: startOp, transform: `translateY(${startY}px)` }}>
                                    <span className="text-[15px] font-bold font-mono uppercase tracking-widest" style={{ color: ACCENT }}>
                                        start
                                    </span>
                                </div>
                                {/* END label */}
                                <div className="absolute -top-[42px] right-3" style={{ opacity: endOp, transform: `translateY(${endY}px)` }}>
                                    <span className="text-[15px] font-bold font-mono uppercase tracking-widest" style={{ color: ACCENT }}>
                                        end
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sum */}
                        <div className="mt-14 flex items-center gap-4 font-mono text-[32px]" style={{ opacity: sumOp }}>
                            <span className="text-zinc-400">sum =</span>
                            <span className="font-bold" style={{ color: ACCENT }}>2 + 7 + 1 = 10</span>
                        </div>
                    </div>

                    {/* "Imagine a window" */}
                    <div style={{ opacity: imagineOp }}>
                        <p className="text-[34px] font-semibold text-zinc-500 text-center">
                            Imagine a <span className="font-black" style={{ color: ACCENT }}>window</span> on the array.
                        </p>
                    </div>

                    {/* "Listen carefully" */}
                    <div style={{ opacity: listenOp }}>
                        <p className="text-[32px] font-semibold text-zinc-500 text-center">
                            When the window moves...
                        </p>
                    </div>

                    {/* "Only TWO numbers matter" */}
                    <div style={{ opacity: twoOp, transform: `scale(${twoScale})` }}>
                        <p className="text-[54px] font-black text-zinc-900 text-center">
                            Only{' '}
                            <span className="text-[72px]" style={{ color: ACCENT }}>TWO</span>
                            {' '}numbers matter.
                        </p>
                    </div>

                    {/* "Don't recalculate the middle" */}
                    <div
                        className="px-7 py-3 rounded-full bg-zinc-50"
                        style={{ opacity: dontOp, border: '2px solid #e4e4e7' }}
                    >
                        <span className="text-xl font-semibold text-zinc-500">
                            The middle stays. <span className="font-bold text-zinc-800">Don't recalculate it.</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindowIntro;
