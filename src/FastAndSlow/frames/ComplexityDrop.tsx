/**
 * Scene 9 — ComplexityDrop (L32-33)
 * "This drops complexity to O of N time and O of 1 space."
 * "Interviewers love this."
 *
 * Giant O(N) / O(1) reveal with ticking counters.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, SUCCESS, ACCENT } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, glowShadow, pulse } from '../helpers/animations';

const ComplexityDrop: React.FC = () => {
    const frame = useCurrentFrame();
    const { L32, L33 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 20, scale: 0.98 },
        { frame: 50, x: 0, y: 0, scale: 1.0 },
        { frame: 150, x: 0, y: -10, scale: 1.06 },
        { frame: 265, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const l32Words = wordByWord('This drops complexity to O of N time and O of 1 space.', frame, L32.start + 3, 3);
    const l33Words = wordByWord('Interviewers love this.', frame, L33.start + 4, 5);

    // Time complexity badge
    const timeDelay = 40;
    const spaceDelay = 80;
    const loveDelay = L33.start + 20;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L32 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 60, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l32Words.map(({ word, opacity }, i) => {
                        const isTime = word === 'N';
                        const isSpace = word === '1';
                        const isKey = ['O', 'N', '1'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isTime ? ACCENT : isSpace ? SUCCESS : isKey ? '#CBD5E1' : '#94A3B8',
                                fontSize: isKey ? 56 : 46, fontWeight: isKey ? 900 : 600,
                                fontFamily: isKey ? 'SF Mono, monospace' : 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Big complexity badges */}
                <div style={{ display: 'flex', gap: 60, marginBottom: 60, position: 'relative', zIndex: 10 }}>
                    {/* Time: O(N) */}
                    <div style={{
                        opacity: fadeIn(frame, timeDelay, 15),
                        transform: `scale(${scaleIn(frame, timeDelay, SP.overshoot)})`,
                        background: `${ACCENT}12`, border: `4px solid ${ACCENT}50`,
                        borderRadius: 24, padding: '30px 50px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        willChange: 'transform', boxShadow: glowShadow(frame, ACCENT, 0.05),
                    }}>
                        <span style={{ color: '#94A3B8', fontSize: 28, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>TIME</span>
                        <span style={{ color: ACCENT, fontSize: 80, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>O(N)</span>
                    </div>

                    {/* Space: O(1) */}
                    <div style={{
                        opacity: fadeIn(frame, spaceDelay, 15),
                        transform: `scale(${scaleIn(frame, spaceDelay, SP.overshoot)})`,
                        background: `${SUCCESS}12`, border: `4px solid ${SUCCESS}50`,
                        borderRadius: 24, padding: '30px 50px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        willChange: 'transform', boxShadow: glowShadow(frame, SUCCESS, 0.05),
                    }}>
                        <span style={{ color: '#94A3B8', fontSize: 28, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>SPACE</span>
                        <span style={{ color: SUCCESS, fontSize: 80, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>O(1)</span>
                    </div>
                </div>

                {/* L33 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 800, marginBottom: 30, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l33Words.map(({ word, opacity }, i) => {
                        const isKey = ['Interviewers', 'love'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? SUCCESS : '#CBD5E1',
                                fontSize: isKey ? 56 : 48, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 20px ${SUCCESS}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Heart icon */}
                <div style={{
                    opacity: fadeIn(frame, loveDelay, 15),
                    transform: `scale(${scaleIn(frame, loveDelay, SP.overshoot) * pulse(frame, 0.9, 1.1, 0.08)})`,
                    willChange: 'transform', position: 'relative', zIndex: 10,
                }}>
                    <span style={{ fontSize: 80 }}>❤️</span>
                </div>
            </div>
        </div>
    );
};

export default ComplexityDrop;
