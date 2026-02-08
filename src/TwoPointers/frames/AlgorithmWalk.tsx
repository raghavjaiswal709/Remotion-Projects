/**
 * Scene 5 — AlgorithmWalk
 * Lines 9-12: The core two-pointer algorithm in action.
 *   L9:  "Now watch closely. Add the two numbers."
 *   L10: "If the sum is too small, move the left pointer right."
 *   L11: "If the sum is too big, move the right pointer left."
 *   L12: "If it matches, you're done."
 *
 * Visuals:
 *  - Full array with L/R pointers that MOVE through TEACH_STEPS
 *  - Sum calculation badge shows current sum vs target
 *  - Color-coded feedback: red (too big), blue (too small), green (match)
 *  - Smooth pointer glide via smoothLerp
 *  - Camera follows the action zone
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import {
    LINE_TIMING,
    DEMO_ARRAY,
    TEACH_TARGET,
    TEACH_STEPS,
    ACCENT,
    DANGER,
    SUCCESS,
    PTR_LEFT,
    PTR_RIGHT,
} from '../helpers/timing';
import {
    CELL,
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    smoothLerp,
    glowShadow,
    pulse,
} from '../helpers/animations';

const AlgorithmWalk: React.FC = () => {
    const frame = useCurrentFrame();
    const { L9, L10, L11, L12 } = LINE_TIMING;

    // ── Step scheduling ──
    // 5 steps distributed across the scene
    const stepFrames = [
        L9.start + 15,   // Step 0: L=0, R=7, sum=14, too_big
        L10.start + 10,  // Step 1: L=0, R=6, sum=12, too_big
        L10.start + 50,  // Step 2: L=0, R=5, sum=10, too_small
        L11.start + 20,  // Step 3: L=1, R=5, sum=12, too_big
        L12.start + 5,   // Step 4: L=1, R=4, sum=11, match!
    ];

    // Current step index
    let currentStep = 0;
    for (let i = 0; i < stepFrames.length; i++) {
        if (frame >= stepFrames[i]) currentStep = i;
    }

    const step = TEACH_STEPS[currentStep];
    const moveDur = 18; // frames for pointer glide

    // Compute pointer positions with smoothLerp between steps
    let lPos = TEACH_STEPS[0].l;
    let rPos = TEACH_STEPS[0].r;

    for (let i = 1; i <= currentStep; i++) {
        const sf = stepFrames[i];
        lPos = smoothLerp(frame, sf, sf + moveDur, TEACH_STEPS[i - 1].l, TEACH_STEPS[i].l);
        rPos = smoothLerp(frame, sf, sf + moveDur, TEACH_STEPS[i - 1].r, TEACH_STEPS[i].r);
    }

    // Colors based on action
    const actionColor = step.action === 'too_big' ? DANGER
        : step.action === 'too_small' ? ACCENT
            : SUCCESS;

    const actionLabel = step.action === 'too_big' ? 'TOO BIG ↓'
        : step.action === 'too_small' ? 'TOO SMALL ↑'
            : '✓ MATCH!';

    // Camera follows midpoint of pointers
    const midIdx = (lPos + rPos) / 2;
    const camX = interpolate(midIdx, [0, DEMO_ARRAY.length - 1], [40, -40]);

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: -20, scale: 1.0 },
        { frame: 40, x: camX * 0.3, y: -30, scale: 1.06 },
        { frame: 130, x: camX * 0.5, y: -20, scale: 1.08 },
        { frame: 220, x: 0, y: -10, scale: 1.04 },
        { frame: 266, x: 0, y: 0, scale: 1.0 },
    ], 2);

    // Text lines
    const l9Words = wordByWord('Now watch closely. Add the two numbers.', frame, L9.start + 3, 3);
    const l10Words = wordByWord('If the sum is too small, move the left pointer right.', frame, L10.start + 3, 2);
    const l11Words = wordByWord('If the sum is too big, move the right pointer left.', frame, L11.start + 3, 2);
    const l12Words = wordByWord('If it matches, you\'re done.', frame, L12.start + 3, 3);

    // Pick which text line is active
    const activeLineFrame =
        frame >= L12.start ? 4
            : frame >= L11.start ? 3
                : frame >= L10.start ? 2
                    : 1;

    const activeWords =
        activeLineFrame === 4 ? l12Words
            : activeLineFrame === 3 ? l11Words
                : activeLineFrame === 2 ? l10Words
                    : l9Words;

    // Sum display
    const sumOpacity = fadeIn(frame, stepFrames[0] + 10, 8);
    const sumValue = frame >= stepFrames[currentStep] + moveDur
        ? step.sum
        : currentStep > 0
            ? TEACH_STEPS[currentStep - 1].sum
            : TEACH_STEPS[0].sum;

    const isMatch = step.action === 'match' && frame >= stepFrames[4] + moveDur;

    return (
        <div
            style={{
                width: 1080,
                height: 1920,
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Match celebration flash */}
            {isMatch && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(ellipse at center, ${SUCCESS}15 0%, transparent 70%)`,
                        opacity: fadeIn(frame, stepFrames[4] + moveDur, 15),
                    }}
                />
            )}

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Active text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 10,
                        maxWidth: 900,
                        marginBottom: 50,
                        padding: '0 40px',
                        minHeight: 70,
                    }}
                >
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = ['closely.', 'small,', 'big,', 'left', 'right.', 'right,', 'matches,', 'done.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? actionColor : '#CBD5E1',
                                    fontSize: 44,
                                    fontWeight: isKey ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Array with moving pointers */}
                <div style={{ display: 'flex', gap: CELL.GAP, position: 'relative' }}>
                    {DEMO_ARRAY.map((val, idx) => {
                        const isL = Math.abs(idx - lPos) < 0.5;
                        const isR = Math.abs(idx - rPos) < 0.5;
                        const isAnswerCell = isMatch && (idx === step.l || idx === step.r);
                        const cellBorder = isAnswerCell
                            ? SUCCESS
                            : isL
                                ? PTR_LEFT
                                : isR
                                    ? PTR_RIGHT
                                    : '#334155';
                        const cellBg = isAnswerCell
                            ? `${SUCCESS}20`
                            : isL
                                ? `${PTR_LEFT}12`
                                : isR
                                    ? `${PTR_RIGHT}12`
                                    : '#1E293B';

                        return (
                            <div
                                key={idx}
                                style={{
                                    width: CELL.W,
                                    height: CELL.H,
                                    borderRadius: CELL.R,
                                    background: cellBg,
                                    border: `${CELL.BORDER}px solid ${cellBorder}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: isAnswerCell
                                        ? `0 0 24px 6px ${SUCCESS}30`
                                        : 'none',
                                }}
                            >
                                <span
                                    style={{
                                        color: isAnswerCell ? SUCCESS : '#F1F5F9',
                                        fontSize: 46,
                                        fontWeight: 800,
                                        fontFamily: 'SF Mono, Menlo, monospace',
                                    }}
                                >
                                    {val}
                                </span>
                            </div>
                        );
                    })}

                    {/* L pointer (absolutely positioned, slides) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: CELL.H + 12,
                            left: lPos * (CELL.W + CELL.GAP) + CELL.W / 2 - 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            willChange: 'transform',
                        }}
                    >
                        <svg width="40" height="24" viewBox="0 0 40 24">
                            <polygon points="20,0 0,24 40,24" fill={isMatch ? SUCCESS : PTR_LEFT} />
                        </svg>
                        <span style={{ color: isMatch ? SUCCESS : PTR_LEFT, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace', marginTop: 2 }}>
                            L
                        </span>
                    </div>

                    {/* R pointer */}
                    <div
                        style={{
                            position: 'absolute',
                            top: CELL.H + 12,
                            left: rPos * (CELL.W + CELL.GAP) + CELL.W / 2 - 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            willChange: 'transform',
                        }}
                    >
                        <svg width="40" height="24" viewBox="0 0 40 24">
                            <polygon points="20,0 0,24 40,24" fill={isMatch ? SUCCESS : PTR_RIGHT} />
                        </svg>
                        <span style={{ color: isMatch ? SUCCESS : PTR_RIGHT, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace', marginTop: 2 }}>
                            R
                        </span>
                    </div>
                </div>

                {/* Sum calculation badge */}
                <div
                    style={{
                        marginTop: 70,
                        opacity: sumOpacity,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        background: `${actionColor}10`,
                        border: `3px solid ${actionColor}40`,
                        borderRadius: 20,
                        padding: '18px 36px',
                        transform: `scale(${isMatch ? pulse(frame, 1.0, 1.06, 0.12) : 1})`,
                        boxShadow: isMatch ? glowShadow(frame, SUCCESS, 0.08) : 'none',
                        willChange: 'transform',
                    }}
                >
                    <span style={{ color: '#94A3B8', fontSize: 38, fontWeight: 600, fontFamily: 'SF Mono, monospace' }}>
                        {DEMO_ARRAY[Math.round(lPos)]} + {DEMO_ARRAY[Math.round(rPos)]}
                    </span>
                    <span style={{ color: '#64748B', fontSize: 38, fontWeight: 600 }}>
                        =
                    </span>
                    <span style={{ color: actionColor, fontSize: 52, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        {sumValue}
                    </span>
                    <span style={{ color: '#64748B', fontSize: 34, fontWeight: 600 }}>
                        vs
                    </span>
                    <span style={{ color: '#CBD5E1', fontSize: 42, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>
                        {TEACH_TARGET}
                    </span>
                </div>

                {/* Action label */}
                <div
                    style={{
                        marginTop: 24,
                        opacity: fadeIn(frame, stepFrames[currentStep] + moveDur + 4, 8),
                        transform: `scale(${scaleIn(frame, stepFrames[currentStep] + moveDur + 4, SP.punchy)})`,
                        willChange: 'transform',
                    }}
                >
                    <span
                        style={{
                            color: actionColor,
                            fontSize: 40,
                            fontWeight: 900,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            letterSpacing: 2,
                        }}
                    >
                        {actionLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmWalk;
