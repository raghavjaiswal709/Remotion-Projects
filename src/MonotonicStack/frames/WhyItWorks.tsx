/**
 * Scene 6 — WhyItWorks (L14-15)
 * L14: "Why? Because the element being popped just found its next greater or smaller."
 * L15: "One push, one pop. No element is touched twice."
 *
 * Shows the "aha" moment: popped element → answer mapping.
 * Each pop = finding the next greater element.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN, DANGER, DEMO_ARRAY, NGE_RESULT } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const WhyItWorks: React.FC = () => {
    const frame = useCurrentFrame();
    const { L14, L15 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 120, x: 0, y: -10, scale: 1.04 },
        { frame: 400, x: 0, y: 0, scale: 1.0 },
        { frame: 498, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l14Words = wordByWord('Why? Because the element being popped just found its next greater or smaller.', frame, L14.start + 3, 3);
    const l15Words = wordByWord('One push, one pop. No element is touched twice.', frame, L15.start + 3, 3);

    const activeWords = frame >= L15.start ? l15Words : l14Words;
    const activeHighlights = frame >= L15.start
        ? ['One', 'push,', 'one', 'pop.', 'touched', 'twice.']
        : ['popped', 'found', 'next', 'greater', 'smaller.'];

    /* Show NGE result progressively */
    const ngeRevealCount = Math.min(DEMO_ARRAY.length, Math.floor((frame - L14.start - 30) / 25));

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
                                opacity, color: isKey ? WARN : '#CBD5E1',
                                fontSize: isKey ? 64 : 52, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 20px ${WARN}30` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Array + NGE result rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                    {/* Original array row */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ color: '#64748B', fontSize: 22, fontWeight: 700, fontFamily: 'SF Mono, monospace', width: 100 }}>
                            Array:
                        </span>
                        {DEMO_ARRAY.map((val, i) => (
                            <div key={i} style={{
                                width: 80, height: 70, borderRadius: 14,
                                background: `${ACCENT}15`, border: `3px solid ${ACCENT}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ color: ACCENT, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                    {val}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Arrow indicators */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 112 }}>
                        {DEMO_ARRAY.map((_, i) => {
                            const revealed = i < ngeRevealCount;
                            return (
                                <div key={i} style={{ width: 80, display: 'flex', justifyContent: 'center' }}>
                                    <svg width="24" height="30" viewBox="0 0 24 30" opacity={revealed ? 1 : 0.15}>
                                        <path d="M12 0 L12 22 M6 16 L12 24 L18 16"
                                            stroke={revealed ? WARN : '#334155'} strokeWidth="3"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </div>
                            );
                        })}
                    </div>

                    {/* NGE result row */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ color: '#64748B', fontSize: 22, fontWeight: 700, fontFamily: 'SF Mono, monospace', width: 100 }}>
                            NGE:
                        </span>
                        {NGE_RESULT.map((val, i) => {
                            const revealed = i < ngeRevealCount;
                            const isNone = val === -1;
                            return (
                                <div key={i} style={{
                                    width: 80, height: 70, borderRadius: 14,
                                    background: revealed ? (isNone ? `${DANGER}15` : `${SUCCESS}15`) : '#0F172A',
                                    border: `3px solid ${revealed ? (isNone ? `${DANGER}40` : `${SUCCESS}40`) : '#1E293B'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: revealed ? 1 : 0.3,
                                    transition: 'all 0.2s',
                                }}>
                                    <span style={{
                                        color: revealed ? (isNone ? DANGER : SUCCESS) : '#334155',
                                        fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace',
                                    }}>
                                        {revealed ? val : '?'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* "ONE PUSH ONE POP" badge */}
                {frame >= L15.start + 30 && (
                    <div style={{
                        marginTop: 50, opacity: fadeIn(frame, L15.start + 30, 15),
                        transform: `scale(${scaleIn(frame, L15.start + 30, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                        display: 'flex', gap: 20,
                    }}>
                        <div style={{
                            background: `${SUCCESS}10`, border: `3px solid ${SUCCESS}50`,
                            borderRadius: 20, padding: '14px 32px',
                            boxShadow: glowShadow(frame, SUCCESS, 0.04),
                        }}>
                            <span style={{ color: SUCCESS, fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                1 PUSH
                            </span>
                        </div>
                        <div style={{
                            background: `${DANGER}10`, border: `3px solid ${DANGER}50`,
                            borderRadius: 20, padding: '14px 32px',
                            boxShadow: glowShadow(frame, DANGER, 0.04),
                        }}>
                            <span style={{ color: DANGER, fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                1 POP
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhyItWorks;
