/**
 * Scene 9 — Outro
 * Line 23: "Two pointers, think less, move smarter, crack interviews."
 *
 * Visuals:
 *  Layer 1: Dark background with converging pointer arrows
 *  Layer 2: Word-by-word text, "TWO POINTERS" glowing hero text
 *  Layer 3: Tagline "Think Less. Move Smarter." fading in below
 *  Camera: Slow pull-back to reveal full composition
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, ACCENT, ACCENT_LIGHT, PTR_LEFT, PTR_RIGHT } from '../helpers/timing';
import {
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    pulse,
    strokeAnim,
} from '../helpers/animations';

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L23 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: -20, scale: 1.08 },
        { frame: 40, x: 0, y: 0, scale: 1.04 },
        { frame: 100, x: 0, y: 10, scale: 1.0 },
        { frame: 137, x: 0, y: 0, scale: 0.98 },
    ], 2);

    // L23 words
    const l23Words = wordByWord(
        'Two pointers, think less, move smarter, crack interviews.',
        frame,
        L23.start + 3,
        3,
    );

    // Hero title
    const heroScale = scaleIn(frame, 8, SP.overshoot);
    const heroOpacity = fadeIn(frame, 8, 15);

    // Tagline
    const tagDelay = 50;
    const tagScale = scaleIn(frame, tagDelay, SP.gentle);
    const tagOpacity = fadeIn(frame, tagDelay, 15);

    // Converging arrows
    const convergence = interpolate(frame, [0, 100], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Pointer lines
    const lineStroke = strokeAnim(frame, 10, 300, 60);

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
            {/* Radial glow */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center, ${ACCENT}10 0%, transparent 60%)`,
                    opacity: fadeIn(frame, 20, 40),
                }}
            />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Converging pointer SVG */}
                <svg
                    width="800"
                    height="100"
                    viewBox="0 0 800 100"
                    style={{ marginBottom: 40, opacity: fadeIn(frame, 5, 20) }}
                >
                    {/* Left pointer line */}
                    <line
                        x1="50"
                        y1="50"
                        x2={50 + convergence * 300}
                        y2="50"
                        stroke={PTR_LEFT}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{ strokeDasharray: lineStroke.strokeDasharray, strokeDashoffset: lineStroke.strokeDashoffset }}
                    />
                    <circle cx={50 + convergence * 300} cy="50" r="12" fill={PTR_LEFT} />
                    <text x={50 + convergence * 300} y="85" textAnchor="middle" fill={PTR_LEFT} fontSize="24" fontWeight="800" fontFamily="SF Mono, monospace">L</text>

                    {/* Right pointer line */}
                    <line
                        x1="750"
                        y1="50"
                        x2={750 - convergence * 300}
                        y2="50"
                        stroke={PTR_RIGHT}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{ strokeDasharray: lineStroke.strokeDasharray, strokeDashoffset: lineStroke.strokeDashoffset }}
                    />
                    <circle cx={750 - convergence * 300} cy="50" r="12" fill={PTR_RIGHT} />
                    <text x={750 - convergence * 300} y="85" textAnchor="middle" fill={PTR_RIGHT} fontSize="24" fontWeight="800" fontFamily="SF Mono, monospace">R</text>
                </svg>

                {/* Hero: TWO POINTERS */}
                <div
                    style={{
                        opacity: heroOpacity,
                        transform: `scale(${heroScale * pulse(frame, 0.98, 1.02, 0.04)})`,
                        marginBottom: 40,
                        willChange: 'transform',
                    }}
                >
                    <span
                        style={{
                            color: '#FFFFFF',
                            fontSize: 88,
                            fontWeight: 900,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            letterSpacing: 6,
                            textTransform: 'uppercase',
                            textShadow: `0 0 60px ${ACCENT}40, 0 0 120px ${ACCENT}20`,
                        }}
                    >
                        TWO POINTERS
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        opacity: tagOpacity,
                        transform: `scale(${tagScale})`,
                        marginBottom: 50,
                        willChange: 'transform',
                    }}
                >
                    <span
                        style={{
                            color: ACCENT_LIGHT,
                            fontSize: 46,
                            fontWeight: 700,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            letterSpacing: 3,
                        }}
                    >
                        Think Less. Move Smarter.
                    </span>
                </div>

                {/* L23 word-by-word at bottom */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 12,
                        maxWidth: 900,
                        padding: '0 40px',
                    }}
                >
                    {l23Words.map(({ word, opacity }, i) => {
                        const isKey = ['Two', 'pointers,', 'think', 'less,', 'smarter,', 'crack', 'interviews.'].includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? '#F1F5F9' : '#94A3B8',
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

                {/* Day 2 badge */}
                <div
                    style={{
                        marginTop: 80,
                        opacity: fadeIn(frame, 70, 15),
                        transform: `scale(${scaleIn(frame, 70, SP.gentle)})`,
                        background: `${ACCENT}15`,
                        border: `2px solid ${ACCENT}40`,
                        borderRadius: 40,
                        padding: '14px 36px',
                        willChange: 'transform',
                    }}
                >
                    <span style={{ color: ACCENT_LIGHT, fontSize: 30, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        DAY 2 ✓ — Logic Assassin Training
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Outro;
