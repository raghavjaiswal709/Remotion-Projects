/**
 * Scene 3 — BruteForce
 * Lines 5-6: "Most people do this."
 *            "Loop inside a loop, brute force, slow, dead."
 *
 * Visuals:
 *  Layer 1: Array with two nested-loop cursors scanning (i outer, j inner)
 *  Layer 2: O(N²) badge glowing red, pair-check counter ticking up
 *  Layer 3: Word-by-word text + red "SLOW" / "DEAD" stamps
 *  Camera: Slight shake/zoom to convey chaos
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, DEMO_ARRAY, DANGER } from '../helpers/timing';
import {
    CELL,
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    tickValue,
    glowShadow,
} from '../helpers/animations';

const BruteForce: React.FC = () => {
    const frame = useCurrentFrame();
    const { L5, L6 } = LINE_TIMING;

    // Camera: builds tension
    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.0 },
        { frame: 40, x: 3, y: -5, scale: 1.03 },
        { frame: 80, x: -3, y: 0, scale: 1.05 },
        { frame: 114, x: 0, y: 0, scale: 1.02 },
    ], 3);

    // L5 words
    const l5Words = wordByWord('Most people do this.', frame, L5.start + 3, 4);

    // L6 words
    const l6Words = wordByWord(
        'Loop inside a loop, brute force, slow, dead.',
        frame,
        L6.start + 3,
        3,
    );

    // Brute force pair counter: ticks from 0 to 28 (n*(n-1)/2 for n=8)
    const pairCount = Math.round(tickValue(frame, 20, 0, 28, 70));

    // Nested loop cursors — i and j cycle through
    const cycleSpeed = 4; // frames per step
    const totalPairs = 28;
    const currentPairIdx = Math.min(
        Math.floor(Math.max(0, frame - 20) / cycleSpeed),
        totalPairs - 1,
    );

    // Convert pair index to i, j
    let iPtr = 0;
    let jPtr = 1;
    let count = 0;
    for (let ii = 0; ii < DEMO_ARRAY.length; ii++) {
        for (let jj = ii + 1; jj < DEMO_ARRAY.length; jj++) {
            if (count === currentPairIdx) {
                iPtr = ii;
                jPtr = jj;
            }
            count++;
        }
    }

    const arrayStartFrame = 8;

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
            {/* Danger vignette */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center, transparent 50%, ${DANGER}15 100%)`,
                    opacity: fadeIn(frame, 30, 30),
                }}
            />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L5 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 800,
                        marginBottom: 50,
                    }}
                >
                    {l5Words.map(({ word, opacity }, i) => (
                        <span
                            key={i}
                            style={{
                                opacity,
                                color: '#94A3B8',
                                fontSize: 50,
                                fontWeight: 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Array with cursors */}
                <div style={{ display: 'flex', gap: CELL.GAP, position: 'relative', marginBottom: 30 }}>
                    {DEMO_ARRAY.map((val, idx) => {
                        const isI = idx === iPtr && frame >= 20;
                        const isJ = idx === jPtr && frame >= 20;
                        const cellO = fadeIn(frame, arrayStartFrame + idx * 3, 6);
                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Pointer labels */}
                                <div
                                    style={{
                                        height: 36,
                                        marginBottom: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {isI && (
                                        <span style={{ color: DANGER, fontSize: 28, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>
                                            i
                                        </span>
                                    )}
                                    {isJ && (
                                        <span style={{ color: '#F59E0B', fontSize: 28, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>
                                            j
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        width: CELL.W,
                                        height: CELL.H,
                                        borderRadius: CELL.R,
                                        background: isI
                                            ? `${DANGER}20`
                                            : isJ
                                                ? '#F59E0B20'
                                                : '#1E293B',
                                        border: `${CELL.BORDER}px solid ${isI ? DANGER : isJ ? '#F59E0B' : '#334155'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: cellO,
                                        boxShadow: isI
                                            ? `0 0 16px 4px ${DANGER}30`
                                            : isJ
                                                ? '0 0 16px 4px #F59E0B30'
                                                : 'none',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: '#F1F5F9',
                                            fontSize: 46,
                                            fontWeight: 800,
                                            fontFamily: 'SF Mono, Menlo, monospace',
                                        }}
                                    >
                                        {val}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pair check counter */}
                <div
                    style={{
                        marginTop: 20,
                        opacity: fadeIn(frame, 25, 10),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                    }}
                >
                    <span style={{ color: '#64748B', fontSize: 34, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        Pairs checked:
                    </span>
                    <span style={{ color: DANGER, fontSize: 52, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        {pairCount}
                    </span>
                </div>

                {/* O(N²) badge */}
                <div
                    style={{
                        marginTop: 40,
                        opacity: fadeIn(frame, 40, 12),
                        transform: `scale(${scaleIn(frame, 40, SP.overshoot)})`,
                        background: `${DANGER}15`,
                        border: `3px solid ${DANGER}60`,
                        borderRadius: 20,
                        padding: '16px 40px',
                        boxShadow: glowShadow(frame, DANGER, 0.07),
                        willChange: 'transform',
                    }}
                >
                    <span style={{ color: DANGER, fontSize: 60, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        O(N²)
                    </span>
                </div>

                {/* L6 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 850,
                        marginTop: 50,
                        padding: '0 40px',
                    }}
                >
                    {l6Words.map(({ word, opacity }, i) => {
                        const isDanger = ['brute', 'force,', 'slow,', 'dead.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isDanger ? DANGER : '#94A3B8',
                                    fontSize: 48,
                                    fontWeight: isDanger ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isDanger ? `0 0 20px ${DANGER}40` : 'none',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BruteForce;
