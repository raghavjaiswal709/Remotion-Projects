/**
 * Scene 4 — PanicMode (L8-10)
 * "Most people freeze."
 * "They compare everything with everything."
 * "Nested loops, messy logic, instant rejection."
 *
 * Chaotic criss-cross lines between bars, red tint, strike-through on bad approaches.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, DANGER, DANGER_LIGHT } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord } from '../helpers/animations';

const PanicMode: React.FC = () => {
    const frame = useCurrentFrame();
    const { L8, L9, L10 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.0 },
        { frame: 60, x: -5, y: -10, scale: 1.04 },
        { frame: 200, x: 5, y: 5, scale: 1.02 },
        { frame: 365, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l8Words = wordByWord('Most people freeze.', frame, L8.start + 3, 5);
    const l9Words = wordByWord('They compare everything with everything.', frame, L9.start + 3, 3);
    const l10Words = wordByWord('Nested loops, messy logic, instant rejection.', frame, L10.start + 3, 3);

    const panicCards = [
        { text: 'Compare all pairs', delay: L9.start + 15, strikeDelay: L10.start },
        { text: 'Nested loops', delay: L10.start + 8, strikeDelay: L10.start + 30 },
        { text: 'Messy logic', delay: L10.start + 20, strikeDelay: L10.start + 50 },
    ];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Red tint */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: `radial-gradient(ellipse at center, ${DANGER}08 0%, transparent 60%)`,
                opacity: fadeIn(frame, 20, 40),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L8 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 800, marginBottom: 20, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l8Words.map(({ word, opacity }, i) => {
                        const isKey = ['freeze.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? DANGER : '#CBD5E1',
                                fontSize: isKey ? 60 : 48, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 16px ${DANGER}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L9 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 850, marginBottom: 20, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l9Words.map(({ word, opacity }, i) => (
                        <span key={i} style={{
                            opacity, color: '#94A3B8', fontSize: 44, fontWeight: 600,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        }}>{word}</span>
                    ))}
                </div>

                {/* Chaotic comparison lines */}
                <div style={{ position: 'relative', zIndex: 10, marginBottom: 40 }}>
                    <svg width="700" height="160" viewBox="0 0 700 160">
                        {/* 4 small bars */}
                        {[0, 1, 2, 3].map(i => (
                            <rect key={i} x={50 + i * 160} y={i % 2 === 0 ? 20 : 90} width="120" height="40" rx="8"
                                fill={`${DANGER}15`} stroke={DANGER_LIGHT} strokeWidth="2"
                                opacity={fadeIn(frame, 20 + i * 10, 12)} />
                        ))}
                        {/* Criss-cross lines — messy O(n²) comparison */}
                        {[[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].map(([a, b], idx) => (
                            <line key={idx}
                                x1={110 + a * 160} y1={a % 2 === 0 ? 40 : 110}
                                x2={110 + b * 160} y2={b % 2 === 0 ? 40 : 110}
                                stroke={DANGER} strokeWidth="2" strokeDasharray="6 4"
                                opacity={fadeIn(frame, L9.start + 5 + idx * 6, 10) * 0.5} />
                        ))}
                    </svg>
                </div>

                {/* L10 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 850, marginBottom: 30, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l10Words.map(({ word, opacity }, i) => {
                        const isKey = ['Nested', 'loops,', 'rejection.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? DANGER : '#94A3B8',
                                fontSize: 44, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>{word}</span>
                        );
                    })}
                </div>

                {/* Strike-through cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {panicCards.map((c, i) => {
                        const o = fadeIn(frame, c.delay, 12);
                        const s = scaleIn(frame, c.delay, SP.punchy);
                        const struck = frame >= c.strikeDelay;
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${DANGER}08`, border: `2px solid ${DANGER}40`,
                                borderRadius: 14, padding: '14px 28px', willChange: 'transform',
                            }}>
                                <span style={{
                                    color: struck ? '#475569' : DANGER, fontSize: 30, fontWeight: 700,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textDecoration: struck ? 'line-through' : 'none',
                                    transition: 'color 0.3s',
                                }}>
                                    {c.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PanicMode;
