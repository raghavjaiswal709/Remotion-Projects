/**
 * Scene 7 — ComplexityDrop
 * Lines 17-18:
 *   L17: "Time complexity drops from O(N²) to O(N)."
 *   L18: "One scan, perfect logic."
 *
 * Visuals:
 *  Layer 1: Giant O(N²) shrinking/fading, O(N) scaling up green
 *  Layer 2: Animated bar chart: N² bars shrink, single O(N) bar grows
 *  Layer 3: Ticker counter N²→N transition
 *  Camera: Dramatic zoom on the reveal
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, DANGER, SUCCESS } from '../helpers/timing';
import {
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    tickValue,
    strokeAnim,
} from '../helpers/animations';

const ComplexityDrop: React.FC = () => {
    const frame = useCurrentFrame();
    const { L17, L18 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 20, scale: 0.98 },
        { frame: 30, x: 0, y: 0, scale: 1.0 },
        { frame: 70, x: 0, y: -10, scale: 1.06 },
        { frame: 131, x: 0, y: 0, scale: 1.02 },
    ], 2);

    // L17 words
    const l17Words = wordByWord(
        'Time complexity drops from O(N²) to O(N).',
        frame,
        L17.start + 3,
        3,
    );

    // L18 words
    const l18Words = wordByWord(
        'One scan, perfect logic.',
        frame,
        L18.start + 3,
        4,
    );

    // O(N²) scale: starts big, shrinks
    const n2Scale = interpolate(frame, [30, 70], [1.3, 0.5], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const n2Opacity = interpolate(frame, [30, 80], [1, 0.2], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // O(N) scale: starts small, grows
    const onScale = scaleIn(frame, 50, SP.overshoot);
    const onOpacity = fadeIn(frame, 50, 15);

    // Bar chart comparison
    const barTransition = interpolate(frame, [40, 90], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Ticking number: 64 → 8 (N²=64 vs N=8)
    const tickN = Math.round(tickValue(frame, 50, 64, 8, 40));

    // Arrow stroke
    const arrowStroke = strokeAnim(frame, 35, 200, 25);

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

                {/* L17 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 900,
                        marginBottom: 50,
                        padding: '0 40px',
                    }}
                >
                    {l17Words.map(({ word, opacity }, i) => {
                        const isDanger = word === 'O(N²)';
                        const isSuccess = word === 'O(N).';
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isDanger ? DANGER : isSuccess ? SUCCESS : '#CBD5E1',
                                    fontSize: isDanger || isSuccess ? 56 : 48,
                                    fontWeight: isDanger || isSuccess ? 900 : 600,
                                    fontFamily: isDanger || isSuccess ? 'SF Mono, monospace' : 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isDanger
                                        ? `0 0 20px ${DANGER}50`
                                        : isSuccess
                                            ? `0 0 20px ${SUCCESS}50`
                                            : 'none',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Big complexity comparison */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 50,
                        marginBottom: 50,
                    }}
                >
                    {/* O(N²) */}
                    <div
                        style={{
                            opacity: n2Opacity,
                            transform: `scale(${n2Scale})`,
                            willChange: 'transform',
                        }}
                    >
                        <span
                            style={{
                                color: DANGER,
                                fontSize: 100,
                                fontWeight: 900,
                                fontFamily: 'SF Mono, monospace',
                                textShadow: `0 0 30px ${DANGER}40`,
                                textDecoration: frame > 60 ? 'line-through' : 'none',
                            }}
                        >
                            O(N²)
                        </span>
                    </div>

                    {/* Arrow */}
                    <svg width="100" height="40" viewBox="0 0 100 40" style={{ opacity: fadeIn(frame, 35, 10) }}>
                        <line
                            x1="0" y1="20" x2="80" y2="20"
                            stroke="#64748B"
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{ strokeDasharray: arrowStroke.strokeDasharray, strokeDashoffset: arrowStroke.strokeDashoffset }}
                        />
                        <polygon points="75,10 95,20 75,30" fill="#64748B" opacity={fadeIn(frame, 55, 8)} />
                    </svg>

                    {/* O(N) */}
                    <div
                        style={{
                            opacity: onOpacity,
                            transform: `scale(${onScale * 1.2})`,
                            willChange: 'transform',
                        }}
                    >
                        <span
                            style={{
                                color: SUCCESS,
                                fontSize: 100,
                                fontWeight: 900,
                                fontFamily: 'SF Mono, monospace',
                                textShadow: `0 0 30px ${SUCCESS}50`,
                            }}
                        >
                            O(N)
                        </span>
                    </div>
                </div>

                {/* Bar chart */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 40,
                        height: 300,
                        marginBottom: 50,
                    }}
                >
                    {/* N² bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div
                            style={{
                                width: 120,
                                height: 280 * (1 - barTransition * 0.65),
                                background: `linear-gradient(180deg, ${DANGER}, ${DANGER}80)`,
                                borderRadius: '12px 12px 0 0',
                                opacity: 0.5 + (1 - barTransition) * 0.5,
                            }}
                        />
                        <span style={{ color: DANGER, fontSize: 30, fontWeight: 800, fontFamily: 'SF Mono, monospace', opacity: 0.4 + (1 - barTransition) * 0.6 }}>
                            N² = {Math.round(64 - barTransition * 56)}
                        </span>
                    </div>

                    {/* N bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div
                            style={{
                                width: 120,
                                height: 40 + barTransition * 60,
                                background: `linear-gradient(180deg, ${SUCCESS}, ${SUCCESS}80)`,
                                borderRadius: '12px 12px 0 0',
                                boxShadow: `0 0 20px 4px ${SUCCESS}30`,
                            }}
                        />
                        <span style={{ color: SUCCESS, fontSize: 30, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>
                            N = 8
                        </span>
                    </div>
                </div>

                {/* Operations counter */}
                <div
                    style={{
                        opacity: fadeIn(frame, 50, 12),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <span style={{ color: '#64748B', fontSize: 34, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        operations:
                    </span>
                    <span style={{ color: frame >= 80 ? SUCCESS : DANGER, fontSize: 56, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        {tickN}
                    </span>
                </div>

                {/* L18 text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 800,
                        marginTop: 40,
                    }}
                >
                    {l18Words.map(({ word, opacity }, i) => {
                        const isKey = ['One', 'scan,', 'perfect', 'logic.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? SUCCESS : '#94A3B8',
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
            </div>
        </div>
    );
};

export default ComplexityDrop;
