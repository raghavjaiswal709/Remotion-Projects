/**
 * Scene 1 — ScrollHook (L1-2)
 * "While you scroll, let's revise this for your next interview."
 * "Day 3 of turning you into a logic machine."
 *
 * Instant kinetic text, snap zoom, grid flash.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord } from '../helpers/animations';

const ScrollHook: React.FC = () => {
    const frame = useCurrentFrame();
    const { L1, L2 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 20, scale: 1.12 },
        { frame: 30, x: 0, y: 0, scale: 1.06 },
        { frame: 120, x: -5, y: -10, scale: 1.02 },
        { frame: 300, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l1Words = wordByWord(
        'While you scroll, let\'s revise this for your next interview.',
        frame, L1.start + 2, 3,
    );
    const l2Words = wordByWord(
        'Day 3 of turning you into a logic machine.',
        frame, L2.start + 4, 4,
    );

    const gridO = fadeIn(frame, 0, 30);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: gridO * 0.06, zIndex: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L1 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, maxWidth: 900, marginBottom: 60, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l1Words.map(({ word, opacity }, i) => {
                        const isKey = ['scroll,', 'revise', 'interview.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? '#F1F5F9' : '#94A3B8',
                                fontSize: isKey ? 68 : 58, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L2 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 800, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l2Words.map(({ word, opacity }, i) => {
                        const isAccent = ['Day', '3', 'logic', 'machine.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isAccent ? ACCENT : '#64748B',
                                fontSize: isAccent ? 60 : 50, fontWeight: isAccent ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isAccent ? `0 0 24px ${ACCENT}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Day badge */}
                <div style={{
                    marginTop: 80, opacity: fadeIn(frame, L2.start + 20, 20),
                    transform: `scale(${scaleIn(frame, L2.start + 20, SP.overshoot)})`,
                    border: `3px solid ${ACCENT}50`, borderRadius: 24, padding: '16px 48px',
                    background: `${ACCENT}10`, willChange: 'transform',
                    position: 'relative', zIndex: 10,
                }}>
                    <span style={{ color: ACCENT, fontSize: 72, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        DAY 3
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScrollHook;
