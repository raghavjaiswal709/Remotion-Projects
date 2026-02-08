/**
 * Scene 4 — SmarterWay (L9-10)
 * L9: "Here's the smarter way. Use a stack, but not any stack."
 * L10: "A monotonic stack. That means the stack is always increasing or decreasing."
 *
 * Stack column materializes. Blocks arrange in decreasing order.
 * Monotonic property visualized with directional arrow.
 */
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, glowShadow, STACK } from '../helpers/animations';

const SmarterWay: React.FC = () => {
    const frame = useCurrentFrame();
    const { L9, L10 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -5, scale: 1.04 },
        { frame: 350, x: 0, y: 0, scale: 1.0 },
        { frame: 465, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l9Words = wordByWord("Here's the smarter way. Use a stack, but not any stack.", frame, L9.start + 3, 3);
    const l10Words = wordByWord('A monotonic stack. That means the stack is always increasing or decreasing.', frame, L10.start + 3, 3);

    const activeWords = frame >= L10.start ? l10Words : l9Words;
    const activeHighlights = frame >= L10.start
        ? ['monotonic', 'stack.', 'always', 'increasing', 'decreasing.']
        : ['smarter', 'stack,', 'not', 'any'];

    /* Stack blocks build up with decreasing values */
    const stackValues = [8, 5, 3, 1];
    const stackVisible = frame >= L9.start + 40;

    /* Monotonic arrow appears */
    const arrowVisible = frame >= L10.start + 40;
    const arrowProgress = arrowVisible ? interpolate(frame, [L10.start + 40, L10.start + 70], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }) : 0;

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
                                textShadow: isKey ? `0 0 20px ${SUCCESS}30` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Stack visualization */}
                {stackVisible && (
                    <div style={{ position: 'relative', width: 300, height: 400, marginTop: 20 }}>
                        {/* Stack walls */}
                        <svg width="300" height="400" viewBox="0 0 300 400" fill="none" style={{ position: 'absolute', inset: 0 }}>
                            <line x1="60" y1="40" x2="60" y2="380" stroke={`${ACCENT}40`} strokeWidth="4" strokeLinecap="round" />
                            <line x1="240" y1="40" x2="240" y2="380" stroke={`${ACCENT}40`} strokeWidth="4" strokeLinecap="round" />
                            <line x1="60" y1="380" x2="240" y2="380" stroke={`${ACCENT}40`} strokeWidth="4" strokeLinecap="round" />
                            {/* "TOP" label */}
                            <text x="150" y="28" textAnchor="middle" fill={WARN} fontSize="20" fontWeight="700" fontFamily="SF Mono, monospace"
                                opacity={fadeIn(frame, L9.start + 60, 15)}>
                                TOP
                            </text>
                        </svg>

                        {/* Stack blocks */}
                        {stackValues.map((val, i) => {
                            const blockDelay = L9.start + 50 + i * 15;
                            const blockY = 380 - (i + 1) * (STACK.BLOCK_H + STACK.GAP) - 4;
                            return (
                                <div key={i} style={{
                                    position: 'absolute',
                                    left: 70, top: blockY,
                                    width: 160, height: STACK.BLOCK_H,
                                    opacity: fadeIn(frame, blockDelay, 10),
                                    transform: `scale(${scaleIn(frame, blockDelay, SP.overshoot)})`,
                                    background: `${ACCENT}20`, border: `3px solid ${ACCENT}60`,
                                    borderRadius: STACK.RADIUS,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: glowShadow(frame, ACCENT, 0.03),
                                    willChange: 'transform',
                                }}>
                                    <span style={{ color: ACCENT, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                        {val}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Decreasing arrow */}
                        {arrowProgress > 0 && (
                            <svg width="60" height="320" viewBox="0 0 60 320" fill="none"
                                style={{ position: 'absolute', right: -30, top: 50 }}>
                                <line x1="30" y1="10" x2="30" y2={10 + arrowProgress * 280}
                                    stroke={SUCCESS} strokeWidth="4" strokeLinecap="round" />
                                <path d={`M20 ${arrowProgress * 280 - 5} L30 ${arrowProgress * 280 + 10} L40 ${arrowProgress * 280 - 5}`}
                                    stroke={SUCCESS} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                                    fill="none" opacity={arrowProgress > 0.8 ? 1 : 0} />
                                <text x="30" y={arrowProgress * 280 + 40} textAnchor="middle"
                                    fill={SUCCESS} fontSize="18" fontWeight="700" fontFamily="SF Mono, monospace"
                                    opacity={arrowProgress > 0.9 ? 1 : 0}>
                                    DECREASING
                                </text>
                            </svg>
                        )}
                    </div>
                )}

                {/* "MONOTONIC" badge */}
                {frame >= L10.start + 60 && (
                    <div style={{
                        marginTop: 30, opacity: fadeIn(frame, L10.start + 60, 15),
                        transform: `scale(${scaleIn(frame, L10.start + 60, SP.overshoot)})`,
                        background: `${SUCCESS}10`, border: `3px solid ${SUCCESS}50`,
                        borderRadius: 20, padding: '14px 40px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.05),
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 40, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            MONOTONIC
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmarterWay;
