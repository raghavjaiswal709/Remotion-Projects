/**
 * Scene 2 — WeaponIntro (L3-5)
 * L3: "Today's weapon, monotonic stack, they give you an array and ask scary questions."
 * L4: "Next, greater element?"
 * L5: "Previous smaller? Stock span? Daily temperatures?"
 *
 * Stack column appears. Scary question cards slam in.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, DANGER, WARN, PURPLE } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const QUESTIONS = [
    { text: 'Next Greater Element', color: DANGER, delay: 0 },
    { text: 'Previous Smaller', color: WARN, delay: 15 },
    { text: 'Stock Span', color: PURPLE, delay: 30 },
    { text: 'Daily Temperatures', color: ACCENT, delay: 45 },
];

const WeaponIntro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L3, L4, L5 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.04 },
        { frame: 400, x: 0, y: 0, scale: 1.0 },
        { frame: 556, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l3Words = wordByWord("Today's weapon, monotonic stack, they give you an array and ask scary questions.", frame, L3.start + 3, 3);
    const l4Words = wordByWord('Next, greater element?', frame, L4.start + 3, 4);
    const l5Words = wordByWord('Previous smaller? Stock span? Daily temperatures?', frame, L5.start + 3, 3);

    const activeWords = frame >= L5.start ? l5Words : frame >= L4.start ? l4Words : l3Words;
    const activeHighlights = frame >= L5.start
        ? ['Previous', 'smaller?', 'Stock', 'span?', 'Daily', 'temperatures?']
        : frame >= L4.start
        ? ['Next,', 'greater', 'element?']
        : ['weapon,', 'monotonic', 'stack,', 'scary'];

    const questionsVisible = frame >= L4.start;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                    maxWidth: 920, padding: '0 40px', marginBottom: 60, position: 'relative', zIndex: 10, minHeight: 80,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 68 : 56, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 20px ${ACCENT}30` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Stack icon */}
                <div style={{
                    opacity: fadeIn(frame, L3.start + 20, 20),
                    transform: `scale(${scaleIn(frame, L3.start + 20, SP.overshoot)})`,
                    marginBottom: 40, position: 'relative', zIndex: 10,
                }}>
                    <svg width="160" height="200" viewBox="0 0 160 200" fill="none">
                        {/* Stack column walls */}
                        <line x1="20" y1="30" x2="20" y2="190" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        <line x1="140" y1="30" x2="140" y2="190" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        <line x1="20" y1="190" x2="140" y2="190" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                        {/* Stack blocks */}
                        {[0, 1, 2].map((j) => (
                            <rect key={j} x="30" y={130 - j * 48} width="100" height="40" rx="8"
                                fill={`${ACCENT}25`} stroke={ACCENT} strokeWidth="3"
                                opacity={fadeIn(frame, L3.start + 30 + j * 10, 12)}
                            />
                        ))}
                        {/* Top arrow */}
                        <path d="M80 20 L80 45" stroke={WARN} strokeWidth="3" strokeLinecap="round"
                            opacity={fadeIn(frame, L3.start + 60, 15)} />
                        <path d="M72 37 L80 47 L88 37" stroke={WARN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                            opacity={fadeIn(frame, L3.start + 60, 15)} />
                    </svg>
                </div>

                {/* Question cards grid */}
                {questionsVisible && (
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
                        padding: '0 60px', maxWidth: 900, width: '100%',
                    }}>
                        {QUESTIONS.map((q, i) => {
                            const qDelay = L4.start + q.delay;
                            return (
                                <div key={i} style={{
                                    opacity: fadeIn(frame, qDelay, 12),
                                    transform: `scale(${scaleIn(frame, qDelay, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.03 + i * 0.01)})`,
                                    background: `${q.color}08`, border: `3px solid ${q.color}40`,
                                    borderRadius: 20, padding: '24px 16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: glowShadow(frame, q.color, 0.04),
                                    willChange: 'transform',
                                }}>
                                    <span style={{
                                        color: q.color, fontSize: 30, fontWeight: 700, textAlign: 'center',
                                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    }}>
                                        {q.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeaponIntro;
