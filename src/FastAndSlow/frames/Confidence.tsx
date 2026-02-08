/**
 * Scene 11 — Confidence (L38)
 * "Once this clicks, linked list questions stop being scary."
 *
 * Bold statement with linked list icons transforming from red (scary) to green (mastered).
 */
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, DANGER, SUCCESS } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord } from '../helpers/animations';

const Confidence: React.FC = () => {
    const frame = useCurrentFrame();
    const { L38 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 60, x: 0, y: -5, scale: 1.04 },
        { frame: 148, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const l38Words = wordByWord(
        'Once this clicks, linked list questions stop being scary.',
        frame, L38.start + 3, 3,
    );

    // Color transition from scary red → confident green
    const colorShift = interpolate(frame, [60, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const transitionColor = colorShift < 0.5 ? DANGER : SUCCESS;

    // Icon state indicators
    const icons = Array(5).fill(null);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Background color transition */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: `radial-gradient(ellipse at center, ${transitionColor}08 0%, transparent 60%)`,
                opacity: fadeIn(frame, 20, 30),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Word-by-word text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 900, marginBottom: 60, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l38Words.map(({ word, opacity }, i) => {
                        const isScary = ['scary.'].includes(word);
                        const isPositive = ['clicks,', 'stop'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity,
                                color: isScary ? (colorShift < 0.5 ? DANGER : SUCCESS) : isPositive ? SUCCESS : '#CBD5E1',
                                fontSize: (isScary || isPositive) ? 56 : 48,
                                fontWeight: (isScary || isPositive) ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isScary ? `0 0 20px ${transitionColor}50` : 'none',
                                textDecoration: isScary && colorShift > 0.5 ? 'line-through' : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Icon row — transition from link to check */}
                <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 10 }}>
                    {icons.map((_, i) => {
                        const delay = 30 + i * 15;
                        const s = scaleIn(frame, delay, SP.snappy);
                        const o = fadeIn(frame, delay, 12);
                        const isGreen = frame >= 60 + i * 12;
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                width: 90, height: 90, borderRadius: '50%',
                                background: isGreen ? `${SUCCESS}15` : `${DANGER}15`,
                                border: `3px solid ${isGreen ? SUCCESS : DANGER}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                willChange: 'transform',
                            }}>
                                {isGreen ? (
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <path d="M 8 18 L 14 24 L 28 10" stroke={SUCCESS} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <text x="18" y="26" textAnchor="middle" fill={DANGER} fontSize="32" fontWeight="900">?</text>
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Not scary anymore */}
                {colorShift > 0.5 && (
                    <div style={{
                        marginTop: 50, opacity: fadeIn(frame, 120, 15),
                        transform: `scale(${scaleIn(frame, 120, SP.overshoot)})`,
                        willChange: 'transform', position: 'relative', zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 16,
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 60, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif', letterSpacing: 3 }}>
                            NOT SCARY ANYMORE
                        </span>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <path d="M 10 24 L 18 32 L 38 12" stroke={SUCCESS} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Confidence;
