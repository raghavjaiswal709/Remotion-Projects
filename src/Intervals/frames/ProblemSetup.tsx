/**
 * Scene 3 — ProblemSetup (L5-7)
 * "And then they ask, can these overlap?"
 * "Can you merge them?"
 * "What's the minimum needed?"
 *
 * Scary question cards pop in over overlapping interval bars.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, DANGER, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord } from '../helpers/animations';

const ProblemSetup: React.FC = () => {
    const frame = useCurrentFrame();
    const { L5, L6, L7 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.03 },
        { frame: 248, x: 0, y: 0, scale: 1.01 },
    ], 2);

    const l5Words = wordByWord('And then they ask, can these overlap?', frame, L5.start + 3, 4);

    const scaryQuestions = [
        { text: 'Can these overlap?', delay: L5.start + 20, color: DANGER },
        { text: 'Can you merge them?', delay: L6.start + 8, color: ACCENT },
        { text: 'What\'s the minimum?', delay: L7.start + 8, color: WARN },
    ];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L5 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 30, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l5Words.map(({ word, opacity }, i) => {
                        const isKey = ['overlap?'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? DANGER : '#CBD5E1',
                                fontSize: isKey ? 56 : 48, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 20px ${DANGER}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Overlapping bars visualization */}
                <div style={{ position: 'relative', zIndex: 10, marginBottom: 50 }}>
                    <svg width="800" height="160" viewBox="0 0 800 160">
                        {/* Two overlapping bars */}
                        <rect x="100" y="30" width="280" height="44" rx="10"
                            fill={`${ACCENT}20`} stroke={ACCENT} strokeWidth="3" opacity={fadeIn(frame, 10, 15)} />
                        <text x="240" y="58" textAnchor="middle" fill={ACCENT} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace"
                            opacity={fadeIn(frame, 10, 15)}>[1, 5]</text>

                        <rect x="220" y="90" width="300" height="44" rx="10"
                            fill={`${DANGER}20`} stroke={DANGER} strokeWidth="3" opacity={fadeIn(frame, 25, 15)} />
                        <text x="370" y="118" textAnchor="middle" fill={DANGER} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace"
                            opacity={fadeIn(frame, 25, 15)}>[3, 8]</text>

                        {/* Overlap region highlight */}
                        <rect x="220" y="26" width="160" height="112" rx="6"
                            fill={`${DANGER}08`} stroke={DANGER} strokeWidth="2" strokeDasharray="8 6"
                            opacity={fadeIn(frame, 40, 20) * 0.6} />
                    </svg>
                </div>

                {/* Scary question cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {scaryQuestions.map((q, i) => {
                        const s = scaleIn(frame, q.delay, SP.punchy);
                        const o = fadeIn(frame, q.delay, 12);
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${q.color}10`, border: `3px solid ${q.color}50`,
                                borderRadius: 20, padding: '24px 32px',
                                display: 'flex', alignItems: 'center', gap: 16, willChange: 'transform',
                            }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <text x="20" y="28" textAnchor="middle" fill={q.color} fontSize="28" fontWeight="900">?</text>
                                </svg>
                                <span style={{ color: q.color, fontSize: 32, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                    {q.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProblemSetup;
