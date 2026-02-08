/**
 * Scene 4 — PointerSetup
 * Lines 7-8: "Here's the smarter way. Put one pointer at the start."
 *            "Put one pointer at the end."
 *
 * Visuals:
 *  Layer 1: Clean sorted array (same as ProblemSetup)
 *  Layer 2: Left pointer (blue ▲) materialises under index 0
 *  Layer 3: Right pointer (green ▲) materialises under last index
 *  Camera: Pan from left pointer to right pointer
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, DEMO_ARRAY, TEACH_TARGET, ACCENT, PTR_LEFT, PTR_RIGHT } from '../helpers/timing';
import {
    CELL,
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
} from '../helpers/animations';

const PointerSetup: React.FC = () => {
    const frame = useCurrentFrame();
    const { L7, L8 } = LINE_TIMING;

    // Camera: gentle pan from left to right
    const cam = camMulti(frame, [
        { frame: 0, x: 60, y: 0, scale: 1.02 },
        { frame: 50, x: 30, y: -10, scale: 1.05 },
        { frame: 100, x: -30, y: -10, scale: 1.05 },
        { frame: 148, x: 0, y: 0, scale: 1.0 },
    ], 2);

    // L7 words
    const l7Words = wordByWord(
        'Here\'s the smarter way. Put one pointer at the start.',
        frame,
        L7.start + 3,
        3,
    );

    // L8 words
    const l8Words = wordByWord(
        'Put one pointer at the end.',
        frame,
        L8.start + 3,
        3,
    );

    // Left pointer appears at L7.start + 30
    const leftDelay = L7.start + 30;
    const leftScale = scaleIn(frame, leftDelay, SP.overshoot);
    const leftOpacity = fadeIn(frame, leftDelay, 10);

    // Right pointer appears at L8.start + 15
    const rightDelay = L8.start + 15;
    const rightScale = scaleIn(frame, rightDelay, SP.overshoot);
    const rightOpacity = fadeIn(frame, rightDelay, 10);

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
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* L7 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 850,
                        marginBottom: 40,
                        padding: '0 40px',
                    }}
                >
                    {l7Words.map(({ word, opacity }, i) => {
                        const isKey = ['smarter', 'start.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? PTR_LEFT : '#CBD5E1',
                                    fontSize: 48,
                                    fontWeight: isKey ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L8 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 850,
                        marginBottom: 60,
                        padding: '0 40px',
                    }}
                >
                    {l8Words.map(({ word, opacity }, i) => {
                        const isKey = ['end.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? PTR_RIGHT : '#94A3B8',
                                    fontSize: 46,
                                    fontWeight: isKey ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Array with pointers */}
                <div style={{ display: 'flex', gap: CELL.GAP, position: 'relative' }}>
                    {DEMO_ARRAY.map((val, idx) => {
                        const isLeft = idx === 0;
                        const isRight = idx === DEMO_ARRAY.length - 1;
                        const cellBorder = isLeft && frame >= leftDelay
                            ? PTR_LEFT
                            : isRight && frame >= rightDelay
                                ? PTR_RIGHT
                                : '#334155';
                        const cellBg = isLeft && frame >= leftDelay
                            ? `${PTR_LEFT}15`
                            : isRight && frame >= rightDelay
                                ? `${PTR_RIGHT}15`
                                : '#1E293B';

                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                <div
                                    style={{
                                        width: CELL.W,
                                        height: CELL.H,
                                        borderRadius: CELL.R,
                                        background: cellBg,
                                        border: `${CELL.BORDER}px solid ${cellBorder}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow:
                                            isLeft && frame >= leftDelay
                                                ? `0 0 20px 4px ${PTR_LEFT}25`
                                                : isRight && frame >= rightDelay
                                                    ? `0 0 20px 4px ${PTR_RIGHT}25`
                                                    : 'none',
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

                                {/* Index */}
                                <span
                                    style={{
                                        color: '#64748B',
                                        fontSize: 26,
                                        fontWeight: 600,
                                        fontFamily: 'SF Mono, monospace',
                                        marginTop: 6,
                                    }}
                                >
                                    {idx}
                                </span>

                                {/* Left pointer triangle */}
                                {isLeft && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: CELL.H + 36,
                                            opacity: leftOpacity,
                                            transform: `scale(${leftScale})`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            willChange: 'transform',
                                        }}
                                    >
                                        <svg width="30" height="20" viewBox="0 0 30 20">
                                            <polygon points="15,0 0,20 30,20" fill={PTR_LEFT} />
                                        </svg>
                                        <span style={{ color: PTR_LEFT, fontSize: 30, fontWeight: 800, fontFamily: 'SF Mono, monospace', marginTop: 4 }}>
                                            L
                                        </span>
                                    </div>
                                )}

                                {/* Right pointer triangle */}
                                {isRight && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: CELL.H + 36,
                                            opacity: rightOpacity,
                                            transform: `scale(${rightScale})`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            willChange: 'transform',
                                        }}
                                    >
                                        <svg width="30" height="20" viewBox="0 0 30 20">
                                            <polygon points="15,0 0,20 30,20" fill={PTR_RIGHT} />
                                        </svg>
                                        <span style={{ color: PTR_RIGHT, fontSize: 30, fontWeight: 800, fontFamily: 'SF Mono, monospace', marginTop: 4 }}>
                                            R
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Target reminder */}
                <div
                    style={{
                        marginTop: 100,
                        opacity: fadeIn(frame, 20, 15),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <span style={{ color: '#64748B', fontSize: 34, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        target =
                    </span>
                    <span style={{ color: ACCENT, fontSize: 48, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        {TEACH_TARGET}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PointerSetup;
