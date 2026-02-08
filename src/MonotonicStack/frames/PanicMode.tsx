/**
 * Scene 3 — PanicMode (L6-8)
 * L6: "Most people panic. They look left? They look right?"
 * L7: "Nested loops everywhere. That's slow."
 * L8: "And interviewers hate slow."
 *
 * Chaotic nested loop grid, O(N²) visualization, strike-throughs.
 */
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, DANGER } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const PanicMode: React.FC = () => {
    const frame = useCurrentFrame();
    const { L6, L7, L8 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 5, scale: 1.0 },
        { frame: 80, x: -5, y: -10, scale: 1.05 },
        { frame: 250, x: 5, y: -5, scale: 1.02 },
        { frame: 414, x: 0, y: 0, scale: 1.0 },
    ], 4);

    const l6Words = wordByWord('Most people panic. They look left? They look right?', frame, L6.start + 3, 3);
    const l7Words = wordByWord("Nested loops everywhere. That's slow.", frame, L7.start + 3, 3);
    const l8Words = wordByWord('And interviewers hate slow.', frame, L8.start + 3, 4);

    const activeWords = frame >= L8.start ? l8Words : frame >= L7.start ? l7Words : l6Words;
    const activeHighlights = frame >= L8.start
        ? ['interviewers', 'hate', 'slow.']
        : frame >= L7.start
        ? ['Nested', 'loops', 'slow.']
        : ['panic.', 'left?', 'right?'];

    /* Chaotic comparison arrows */
    const arrowCount = Math.min(12, Math.floor((frame - L6.start) / 8));

    /* O(N²) badge */
    const showBigO = frame >= L7.start + 20;

    /* Strike-through on slow */
    const strikeProgress = frame >= L8.start + 15
        ? interpolate(frame, [L8.start + 15, L8.start + 30], [0, 1], {
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
                                opacity, color: isKey ? DANGER : '#CBD5E1',
                                fontSize: isKey ? 68 : 56, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Chaotic comparison arrows */}
                <svg width="600" height="300" viewBox="0 0 600 300" style={{
                    opacity: frame >= L6.start + 10 ? fadeIn(frame, L6.start + 10, 20) : 0,
                    marginBottom: 30,
                }}>
                    {/* Array boxes */}
                    {[4, 2, 1, 5, 3, 6].map((v, i) => (
                        <g key={i}>
                            <rect x={30 + i * 90} y={120} width={70} height={60} rx="10"
                                fill={`${DANGER}15`} stroke={`${DANGER}60`} strokeWidth="3" />
                            <text x={65 + i * 90} y={158} textAnchor="middle"
                                fill="#CBD5E1" fontSize="28" fontWeight="700" fontFamily="SF Mono, monospace">
                                {v}
                            </text>
                        </g>
                    ))}
                    {/* Chaotic arrows */}
                    {Array.from({ length: Math.max(0, arrowCount) }).map((_, k) => {
                        const fromIdx = k % 6;
                        const toIdx = (k + 1 + Math.floor(k / 3)) % 6;
                        const fromX = 65 + fromIdx * 90;
                        const toX = 65 + toIdx * 90;
                        const curveY = 100 - (k % 3) * 25;
                        return (
                            <path key={k}
                                d={`M${fromX} 120 Q${(fromX + toX) / 2} ${curveY} ${toX} 120`}
                                stroke={DANGER} strokeWidth="2" fill="none" opacity={0.5}
                                strokeDasharray="4 4"
                            />
                        );
                    })}
                </svg>

                {/* O(N²) badge */}
                {showBigO && (
                    <div style={{
                        opacity: fadeIn(frame, L7.start + 20, 12),
                        transform: `scale(${scaleIn(frame, L7.start + 20, SP.overshoot) * pulse(frame, 0.96, 1.04, 0.06)})`,
                        background: `${DANGER}10`, border: `4px solid ${DANGER}50`,
                        borderRadius: 24, padding: '20px 48px', willChange: 'transform',
                        boxShadow: glowShadow(frame, DANGER, 0.06),
                        position: 'relative',
                    }}>
                        <span style={{ color: DANGER, fontSize: 72, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                            O(N²)
                        </span>
                        {/* Strike-through */}
                        {strikeProgress > 0 && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '10%',
                                width: `${strikeProgress * 80}%`, height: 6,
                                background: DANGER, borderRadius: 3,
                                transform: 'rotate(-12deg)',
                            }} />
                        )}
                    </div>
                )}

                {/* X marks */}
                {frame >= L8.start + 20 && (
                    <div style={{
                        marginTop: 30, opacity: fadeIn(frame, L8.start + 20, 12),
                        transform: `scale(${scaleIn(frame, L8.start + 20, SP.overshoot)})`,
                    }}>
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <line x1="15" y1="15" x2="65" y2="65" stroke={DANGER} strokeWidth="8" strokeLinecap="round" />
                            <line x1="65" y1="15" x2="15" y2="65" stroke={DANGER} strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanicMode;
