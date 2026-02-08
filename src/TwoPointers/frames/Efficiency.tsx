/**
 * Scene 6 — Efficiency
 * Lines 13-16:
 *   L13: "One move, one decision, every step."
 *   L14: "No guessing, no backtracking, no wasted work."
 *   L15: "Each pointer moves only forward."
 *   L16: "Never backward. That's why this works."
 *
 * Visuals:
 *  Layer 1: Horizontal timeline / track with L and R arrows converging
 *  Layer 2: "Rules" cards popping in: "1 move", "no backtrack", "forward only"
 *  Layer 3: Word-by-word text emphasis
 *  Camera: Slow zoom reinforcing confidence
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, ACCENT_LIGHT, SUCCESS, PTR_LEFT, PTR_RIGHT } from '../helpers/timing';
import {
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
    strokeAnim,
} from '../helpers/animations';

const Efficiency: React.FC = () => {
    const frame = useCurrentFrame();
    const { L13, L14, L15, L16 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 80, x: 0, y: 0, scale: 1.03 },
        { frame: 180, x: 0, y: -10, scale: 1.05 },
        { frame: 258, x: 0, y: 0, scale: 1.02 },
    ], 2);

    // Rule cards data
    const rules = [
        { text: 'ONE MOVE', icon: '→', delay: L13.start + 10, color: ACCENT },
        { text: 'ONE DECISION', icon: '⚡', delay: L13.start + 30, color: ACCENT_LIGHT },
        { text: 'NO BACKTRACKING', icon: '✕', delay: L14.start + 10, color: '#F59E0B' },
        { text: 'FORWARD ONLY', icon: '▶', delay: L15.start + 10, color: SUCCESS },
    ];

    // L13
    const l13Words = wordByWord('One move, one decision, every step.', frame, L13.start + 3, 3);
    // L14
    const l14Words = wordByWord('No guessing, no backtracking, no wasted work.', frame, L14.start + 3, 3);
    // L15
    const l15Words = wordByWord('Each pointer moves only forward.', frame, L15.start + 3, 3);
    // L16
    const l16Words = wordByWord('Never backward. That\'s why this works.', frame, L16.start + 3, 3);

    // Convergence arrows on the timeline
    const trackW = 700;
    const arrowProgress = Math.min(1, Math.max(0, (frame - 30) / 180));
    const leftArrowX = arrowProgress * trackW * 0.4;
    const rightArrowX = trackW - arrowProgress * trackW * 0.4;

    // Forward-only arrow stroke animation
    const fwdStroke = strokeAnim(frame, L15.start + 15, 400, 40);

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

                {/* Text area — shows active line */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 60,
                        minHeight: 160,
                        padding: '0 40px',
                    }}
                >
                    {/* L13 */}
                    {frame >= L13.start && frame < L14.start && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850 }}>
                            {l13Words.map(({ word, opacity }, i) => {
                                const isKey = ['One', 'move,', 'decision,'].includes(word);
                                return (
                                    <span key={i} style={{ opacity, color: isKey ? ACCENT : '#CBD5E1', fontSize: 50, fontWeight: isKey ? 800 : 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {/* L14 */}
                    {frame >= L14.start && frame < L15.start && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850 }}>
                            {l14Words.map(({ word, opacity }, i) => {
                                const isKey = ['guessing,', 'backtracking,', 'wasted'].includes(word);
                                return (
                                    <span key={i} style={{ opacity, color: isKey ? '#F59E0B' : '#CBD5E1', fontSize: 48, fontWeight: isKey ? 800 : 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {/* L15 */}
                    {frame >= L15.start && frame < L16.start && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850 }}>
                            {l15Words.map(({ word, opacity }, i) => {
                                const isKey = ['forward.'].includes(word);
                                return (
                                    <span key={i} style={{ opacity, color: isKey ? SUCCESS : '#CBD5E1', fontSize: 50, fontWeight: isKey ? 800 : 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    {/* L16 */}
                    {frame >= L16.start && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850 }}>
                            {l16Words.map(({ word, opacity }, i) => {
                                const isKey = ['Never', 'backward.', 'works.'].includes(word);
                                return (
                                    <span key={i} style={{ opacity, color: isKey ? SUCCESS : '#CBD5E1', fontSize: 50, fontWeight: isKey ? 800 : 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Convergence timeline */}
                <div
                    style={{
                        position: 'relative',
                        width: trackW,
                        height: 8,
                        background: '#334155',
                        borderRadius: 4,
                        marginBottom: 60,
                    }}
                >
                    {/* Left pointer dot */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -16,
                            left: leftArrowX - 16,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: PTR_LEFT,
                            boxShadow: `0 0 16px 4px ${PTR_LEFT}40`,
                            willChange: 'transform',
                        }}
                    />
                    {/* Right pointer dot */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -16,
                            left: rightArrowX - 16,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: PTR_RIGHT,
                            boxShadow: `0 0 16px 4px ${PTR_RIGHT}40`,
                            willChange: 'transform',
                        }}
                    />
                    {/* Labels */}
                    <span style={{ position: 'absolute', top: 32, left: leftArrowX - 8, color: PTR_LEFT, fontSize: 28, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>L</span>
                    <span style={{ position: 'absolute', top: 32, left: rightArrowX - 8, color: PTR_RIGHT, fontSize: 28, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>R</span>
                </div>

                {/* Rule cards */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 20,
                        maxWidth: 900,
                    }}
                >
                    {rules.map((rule, i) => {
                        const s = scaleIn(frame, rule.delay, SP.overshoot);
                        const o = fadeIn(frame, rule.delay, 10);
                        return (
                            <div
                                key={i}
                                style={{
                                    opacity: o,
                                    transform: `scale(${s})`,
                                    background: `${rule.color}10`,
                                    border: `2px solid ${rule.color}40`,
                                    borderRadius: 16,
                                    padding: '18px 28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    willChange: 'transform',
                                }}
                            >
                                <span style={{ fontSize: 32 }}>{rule.icon}</span>
                                <span style={{ color: rule.color, fontSize: 30, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif', letterSpacing: 1 }}>
                                    {rule.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Big forward arrow SVG */}
                <svg
                    width="600"
                    height="60"
                    viewBox="0 0 600 60"
                    style={{ marginTop: 50, opacity: fadeIn(frame, L15.start + 10, 15) }}
                >
                    <line
                        x1="50"
                        y1="30"
                        x2="550"
                        y2="30"
                        stroke={SUCCESS}
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: fwdStroke.strokeDasharray,
                            strokeDashoffset: fwdStroke.strokeDashoffset,
                        }}
                    />
                    <polygon points="545,15 575,30 545,45" fill={SUCCESS} opacity={fadeIn(frame, L15.start + 40, 10)} />
                    <text x="300" y="55" textAnchor="middle" fill={SUCCESS} fontSize="22" fontWeight="700" fontFamily="SF Pro Display, system-ui, sans-serif" opacity={fadeIn(frame, L15.start + 45, 10)}>
                        FORWARD ONLY →
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default Efficiency;
