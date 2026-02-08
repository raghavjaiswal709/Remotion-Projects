/**
 * Scene 2 — ProblemSetup
 * Lines 3-4: "Today's weapon. Two pointers."
 *            "You're given a sorted array, pair that adds to a target."
 *
 * Visuals:
 *  Layer 1: Title card "TWO POINTERS" with dramatic scale-in
 *  Layer 2: Sorted array materialises cell-by-cell
 *  Layer 3: Target badge appears with glow
 *  Camera: Pan down from title to array
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, DEMO_ARRAY, TEACH_TARGET, ACCENT, ACCENT_LIGHT, ACCENT_DARK } from '../helpers/timing';
import {
    CELL,
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    glowShadow,
} from '../helpers/animations';

const ProblemSetup: React.FC = () => {
    const frame = useCurrentFrame();
    const { L3, L4 } = LINE_TIMING;

    // Camera: start centered on title, drift down to array
    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 40, scale: 1.0 },
        { frame: 50, x: 0, y: 0, scale: 1.02 },
        { frame: 120, x: 0, y: -50, scale: 1.0 },
        { frame: 190, x: 0, y: -40, scale: 1.0 },
    ], 2);

    // L3: "Today's weapon. Two pointers."
    const l3Words = wordByWord('Today\'s weapon. Two pointers.', frame, L3.start + 4, 4);

    // L4: word-by-word
    const l4Words = wordByWord(
        'You\'re given a sorted array, pair that adds to a target.',
        frame,
        L4.start + 4,
        3,
    );

    // Array cells stagger in
    const arrayStartFrame = L4.start + 20;

    // Target badge
    const targetAppear = L4.start + 50;
    const targetScale = scaleIn(frame, targetAppear, SP.overshoot);
    const targetOpacity = fadeIn(frame, targetAppear, 10);

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
            {/* Camera */}
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Title: TWO POINTERS */}
                <div
                    style={{
                        marginBottom: 80,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 16,
                        maxWidth: 900,
                    }}
                >
                    {l3Words.map(({ word, opacity }, i) => {
                        const isBig = ['Two', 'pointers.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isBig ? '#FFFFFF' : '#94A3B8',
                                    fontSize: isBig ? 84 : 54,
                                    fontWeight: isBig ? 900 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isBig ? `0 0 40px ${ACCENT}50` : 'none',
                                    letterSpacing: isBig ? 4 : 0,
                                    textTransform: isBig ? 'uppercase' as const : 'none' as const,
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L4 subtitle */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 10,
                        maxWidth: 850,
                        marginBottom: 80,
                        padding: '0 40px',
                    }}
                >
                    {l4Words.map(({ word, opacity }, i) => {
                        const isKey = ['sorted', 'array,', 'pair', 'target.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? ACCENT_LIGHT : '#CBD5E1',
                                    fontSize: 46,
                                    fontWeight: isKey ? 700 : 500,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Array cells */}
                <div
                    style={{
                        display: 'flex',
                        gap: CELL.GAP,
                        position: 'relative',
                    }}
                >
                    {DEMO_ARRAY.map((val, i) => {
                        const cellDelay = arrayStartFrame + i * 5;
                        const s = scaleIn(frame, cellDelay, SP.snappy);
                        const o = fadeIn(frame, cellDelay, 8);
                        return (
                            <div
                                key={i}
                                style={{
                                    width: CELL.W,
                                    height: CELL.H,
                                    borderRadius: CELL.R,
                                    background: '#1E293B',
                                    border: `${CELL.BORDER}px solid ${ACCENT}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: o,
                                    transform: `scale(${s})`,
                                    willChange: 'transform',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#F1F5F9',
                                        fontSize: 48,
                                        fontWeight: 800,
                                        fontFamily: 'SF Mono, Menlo, monospace',
                                    }}
                                >
                                    {val}
                                </span>
                            </div>
                        );
                    })}

                    {/* Index labels below */}
                    {DEMO_ARRAY.map((_, i) => {
                        const cellDelay = arrayStartFrame + i * 5 + 8;
                        const o = fadeIn(frame, cellDelay, 6);
                        return (
                            <span
                                key={`idx-${i}`}
                                style={{
                                    position: 'absolute',
                                    top: CELL.H + 8,
                                    left: i * (CELL.W + CELL.GAP) + CELL.W / 2,
                                    transform: 'translateX(-50%)',
                                    color: '#64748B',
                                    fontSize: 28,
                                    fontWeight: 600,
                                    fontFamily: 'SF Mono, Menlo, monospace',
                                    opacity: o,
                                }}
                            >
                                {i}
                            </span>
                        );
                    })}
                </div>

                {/* Target badge */}
                <div
                    style={{
                        marginTop: 80,
                        opacity: targetOpacity,
                        transform: `scale(${targetScale})`,
                        background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
                        borderRadius: 24,
                        padding: '20px 48px',
                        boxShadow: glowShadow(frame, ACCENT, 0.05),
                        willChange: 'transform',
                    }}
                >
                    <span
                        style={{
                            color: '#FFFFFF',
                            fontSize: 44,
                            fontWeight: 800,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        }}
                    >
                        TARGET = {TEACH_TARGET}
                    </span>
                </div>

                {/* "sorted" label */}
                <div
                    style={{
                        marginTop: 30,
                        opacity: fadeIn(frame, arrayStartFrame + 40, 12),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <span style={{ color: '#34D399', fontSize: 32, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        ✓ sorted
                    </span>
                    <span style={{ color: '#64748B', fontSize: 32, fontWeight: 500, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        ascending order
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProblemSetup;
