/**
 * Scene 9 — Outro (L20-21)
 * L20: "Monotonic stack? Control the stack? Reveal the future?"
 * L21: "Crack interview."
 *
 * Hero title, stack icon, DAY 5 badge, CTA.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L20, L21 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 60, x: 0, y: -5, scale: 1.05 },
        { frame: 200, x: 0, y: 0, scale: 1.0 },
        { frame: 242, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l20Words = wordByWord('Monotonic stack? Control the stack? Reveal the future?', frame, L20.start + 3, 4);
    const l21Words = wordByWord('Crack interview.', frame, L21.start + 3, 5);

    const activeWords = frame >= L21.start ? l21Words : l20Words;
    const activeHighlights = frame >= L21.start
        ? ['Crack', 'interview.']
        : ['Monotonic', 'stack?', 'Control', 'Reveal', 'future?'];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Radial glow */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 50%, ${ACCENT}10 0%, transparent 60%)`,
                opacity: fadeIn(frame, 10, 30),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14,
                    maxWidth: 920, padding: '0 40px', marginBottom: 50, position: 'relative', zIndex: 10, minHeight: 80,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        const color = frame >= L21.start
                            ? (isKey ? SUCCESS : '#CBD5E1')
                            : (isKey ? ACCENT : '#CBD5E1');
                        return (
                            <span key={i} style={{
                                opacity, color,
                                fontSize: isKey ? 76 : 60, fontWeight: isKey ? 900 : 700,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 30px ${color}40` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Stack icon */}
                <div style={{
                    opacity: fadeIn(frame, L20.start + 20, 20),
                    transform: `scale(${scaleIn(frame, L20.start + 20, SP.overshoot) * pulse(frame, 0.96, 1.04, 0.03)})`,
                    marginBottom: 30,
                }}>
                    <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
                        <line x1="15" y1="25" x2="15" y2="150" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        <line x1="105" y1="25" x2="105" y2="150" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        <line x1="15" y1="150" x2="105" y2="150" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        <rect x="22" y="100" width="76" height="36" rx="8" fill={`${ACCENT}25`} stroke={ACCENT} strokeWidth="2.5" />
                        <rect x="22" y="58" width="76" height="36" rx="8" fill={`${SUCCESS}25`} stroke={SUCCESS} strokeWidth="2.5" />
                        <rect x="22" y="16" width="76" height="36" rx="8" fill={`${WARN}25`} stroke={WARN} strokeWidth="2.5" />
                    </svg>
                </div>

                {/* DAY 5 badge */}
                <div style={{
                    opacity: fadeIn(frame, L20.start + 40, 15),
                    transform: `scale(${scaleIn(frame, L20.start + 40, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                    border: `3px solid ${ACCENT}60`, borderRadius: 20, padding: '14px 36px',
                    background: `${ACCENT}10`, willChange: 'transform',
                    boxShadow: glowShadow(frame, ACCENT, 0.04),
                }}>
                    <span style={{ color: ACCENT, fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                        DAY 5
                    </span>
                </div>

                {/* CTA */}
                <div style={{
                    marginTop: 30, opacity: fadeIn(frame, L20.start + 60, 20),
                }}>
                    <span style={{
                        color: '#94A3B8', fontSize: 28, fontWeight: 600,
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    }}>
                        Follow for Day 6
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Outro;
