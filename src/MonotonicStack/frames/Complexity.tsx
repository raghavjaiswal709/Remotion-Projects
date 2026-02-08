/**
 * Scene 7 — Complexity (L16-17)
 * L16: "That's why this works. Time complexity becomes O of N."
 * L17: "No backtracking, no rechecking. This pattern shows up everywhere."
 *
 * O(N) badge with glow. No-backtracking visualization.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, SUCCESS, WARN, DANGER } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const Complexity: React.FC = () => {
    const frame = useCurrentFrame();
    const { L16, L17 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.04 },
        { frame: 300, x: 0, y: 0, scale: 1.0 },
        { frame: 366, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l16Words = wordByWord("That's why this works. Time complexity becomes O of N.", frame, L16.start + 3, 3);
    const l17Words = wordByWord('No backtracking, no rechecking. This pattern shows up everywhere.', frame, L17.start + 3, 3);

    const activeWords = frame >= L17.start ? l17Words : l16Words;
    const activeHighlights = frame >= L17.start
        ? ['No', 'backtracking,', 'no', 'rechecking.', 'everywhere.']
        : ['works.', 'O', 'of', 'N.'];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                    maxWidth: 920, padding: '0 40px', marginBottom: 50, position: 'relative', zIndex: 10, minHeight: 80,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? SUCCESS : '#CBD5E1',
                                fontSize: isKey ? 66 : 54, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* O(N) badge */}
                <div style={{
                    opacity: fadeIn(frame, L16.start + 30, 15),
                    transform: `scale(${scaleIn(frame, L16.start + 30, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                    background: `${SUCCESS}10`, border: `4px solid ${SUCCESS}50`,
                    borderRadius: 32, padding: '40px 72px',
                    boxShadow: glowShadow(frame, SUCCESS, 0.05),
                    willChange: 'transform', marginBottom: 40,
                }}>
                    <span style={{ color: SUCCESS, fontSize: 96, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        O(N)
                    </span>
                </div>

                {/* No-backtracking badges */}
                {frame >= L17.start + 15 && (
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { text: 'NO BACKTRACKING', color: DANGER },
                            { text: 'NO RECHECKING', color: WARN },
                        ].map((item, i) => (
                            <div key={i} style={{
                                opacity: fadeIn(frame, L17.start + 15 + i * 15, 12),
                                transform: `scale(${scaleIn(frame, L17.start + 15 + i * 15, SP.overshoot)})`,
                                background: `${item.color}08`, border: `3px solid ${item.color}40`,
                                borderRadius: 16, padding: '12px 28px',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <line x1="6" y1="6" x2="22" y2="22" stroke={item.color} strokeWidth="4" strokeLinecap="round" />
                                    <line x1="22" y1="6" x2="6" y2="22" stroke={item.color} strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                <span style={{ color: item.color, fontSize: 26, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complexity;
