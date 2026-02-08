/**
 * Scene 4 — PanicMode (L10-13)
 * "Most people panic." / "They use extra memory." / "They overthink." / "That's a mistake."
 *
 * Red-tinted panic cards cascade in, each getting struck through.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, DANGER } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord } from '../helpers/animations';

const PanicMode: React.FC = () => {
    const frame = useCurrentFrame();
    const { L10, L11, L12, L13 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 60, x: -5, y: -5, scale: 1.04 },
        { frame: 180, x: 5, y: -10, scale: 1.06 },
        { frame: 251, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const mistakes = [
        { text: '😰 Most people panic.', delay: L10.start + 4 },
        { text: '💾 They use extra memory.', delay: L11.start + 4 },
        { text: '🤯 They overthink.', delay: L12.start + 4 },
    ];

    const l13Words = wordByWord('That\'s a mistake.', frame, L13.start + 4, 5);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Danger vignette */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: `radial-gradient(ellipse at center, transparent 40%, ${DANGER}08 100%)`,
                opacity: fadeIn(frame, 0, 30),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Mistake cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 60, position: 'relative', zIndex: 10 }}>
                    {mistakes.map((m, i) => {
                        const s = scaleIn(frame, m.delay, SP.punchy);
                        const o = fadeIn(frame, m.delay, 12);
                        const strikeDelay = m.delay + 40;
                        const strikeProgress = scaleIn(frame, strikeDelay, SP.whip);
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${DANGER}08`, border: `3px solid ${DANGER}30`,
                                borderRadius: 18, padding: '22px 44px',
                                willChange: 'transform', position: 'relative',
                            }}>
                                <span style={{ color: DANGER, fontSize: 44, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                    {m.text}
                                </span>
                                {/* Strike-through */}
                                <div style={{
                                    position: 'absolute', top: '50%', left: 16, right: 16,
                                    height: 4, background: DANGER, transformOrigin: 'left',
                                    transform: `scaleX(${strikeProgress})`,
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* L13: "That's a mistake." */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, maxWidth: 800, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l13Words.map(({ word, opacity }, i) => (
                        <span key={i} style={{
                            opacity, color: word === 'mistake.' ? DANGER : '#F1F5F9',
                            fontSize: word === 'mistake.' ? 72 : 58, fontWeight: 900,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            textShadow: word === 'mistake.' ? `0 0 30px ${DANGER}60` : 'none',
                        }}>
                            {word}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PanicMode;
