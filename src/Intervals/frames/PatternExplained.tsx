/**
 * Scene 7 — PatternExplained (L20-25)
 * "That's the whole pattern."
 * "Overlapping means next start ≤ current end."
 * "Merging means update the end to the maximum."
 * "No comparisons explosion." / "No confusion." / "Just one pass."
 *
 * Key insight visualization: overlap condition + merge rule.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, DANGER, WARN } from '../helpers/timing';
import { BAR, SP, camMulti, fadeIn, scaleIn, wordByWord, valToX, barWidth, glowShadow, pulse } from '../helpers/animations';

const PatternExplained: React.FC = () => {
    const frame = useCurrentFrame();
    const { L20, L21, L22, L23, L24, L25 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.03 },
        { frame: 400, x: 0, y: -15, scale: 1.05 },
        { frame: 681, x: 0, y: 0, scale: 1.02 },
    ], 2);

    // Active text
    const l20Words = wordByWord('That\'s the whole pattern.', frame, L20.start + 3, 5);
    const l21Words = wordByWord('Overlapping means next start is less than or equal to current end.', frame, L21.start + 3, 2);
    const l22Words = wordByWord('Merging means update the end to the maximum.', frame, L22.start + 3, 3);
    const l23Words = wordByWord('No comparisons explosion.', frame, L23.start + 3, 4);
    const l24Words = wordByWord('No confusion.', frame, L24.start + 3, 5);
    const l25Words = wordByWord('Just one pass.', frame, L25.start + 3, 5);

    const activeWords = frame >= L25.start ? l25Words
        : frame >= L24.start ? l24Words
        : frame >= L23.start ? l23Words
        : frame >= L22.start ? l22Words
        : frame >= L21.start ? l21Words
        : l20Words;

    const activeHighlights = frame >= L25.start ? ['one', 'pass.']
        : frame >= L24.start ? ['confusion.']
        : frame >= L23.start ? ['comparisons', 'explosion.']
        : frame >= L22.start ? ['Merging', 'end', 'maximum.']
        : frame >= L21.start ? ['Overlapping', 'start', 'end.']
        : ['whole', 'pattern.'];

    const activeColor = frame >= L23.start ? SUCCESS : frame >= L22.start ? ACCENT : WARN;

    // Demo intervals for the condition viz
    const barA: [number, number] = [1, 5];
    const barB: [number, number] = [3, 8];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 30, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 64 : 54, fontWeight: isKey ? 900 : 700,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Overlap condition diagram (L21) */}
                {frame >= L21.start && frame < L23.start && (
                    <div style={{ position: 'relative', zIndex: 10, marginBottom: 30, opacity: fadeIn(frame, L21.start, 20) }}>
                        <svg width="800" height="260" viewBox="0 0 800 260">
                            {/* Bar A */}
                            <rect x={valToX(barA[0]) - 30} y="30" width={barWidth(barA)} height={BAR.HEIGHT}
                                rx={BAR.RADIUS} fill={`${ACCENT}20`} stroke={ACCENT} strokeWidth={BAR.BORDER} />
                            <text x={valToX(barA[0]) - 30 + barWidth(barA) / 2} y="60" textAnchor="middle"
                                fill={ACCENT} fontSize="22" fontWeight="800" fontFamily="SF Mono, monospace">
                                [{barA[0]},{barA[1]}]
                            </text>

                            {/* Bar B */}
                            <rect x={valToX(barB[0]) - 30} y="100" width={barWidth(barB)} height={BAR.HEIGHT}
                                rx={BAR.RADIUS} fill={`${WARN}20`} stroke={WARN} strokeWidth={BAR.BORDER} />
                            <text x={valToX(barB[0]) - 30 + barWidth(barB) / 2} y="130" textAnchor="middle"
                                fill={WARN} fontSize="22" fontWeight="800" fontFamily="SF Mono, monospace">
                                [{barB[0]},{barB[1]}]
                            </text>

                            {/* Overlap indicator — next.start vs current.end */}
                            <line x1={valToX(barB[0]) - 30} y1="170" x2={valToX(barB[0]) - 30} y2="100"
                                stroke={DANGER} strokeWidth="3" strokeDasharray="6 4" opacity={fadeIn(frame, L21.start + 30, 15)} />
                            <text x={valToX(barB[0]) - 30} y="195" textAnchor="middle"
                                fill={DANGER} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace"
                                opacity={fadeIn(frame, L21.start + 30, 15)}>
                                next.start = {barB[0]}
                            </text>

                            <line x1={valToX(barA[1]) - 30} y1="170" x2={valToX(barA[1]) - 30} y2="30"
                                stroke={SUCCESS} strokeWidth="3" strokeDasharray="6 4" opacity={fadeIn(frame, L21.start + 50, 15)} />
                            <text x={valToX(barA[1]) - 30} y="195" textAnchor="middle"
                                fill={SUCCESS} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace"
                                opacity={fadeIn(frame, L21.start + 50, 15)}>
                                curr.end = {barA[1]}
                            </text>

                            {/* Condition badge */}
                            <g opacity={fadeIn(frame, L21.start + 70, 15)}>
                                <rect x="200" y="215" width="400" height="40" rx="10" fill={`${SUCCESS}15`} stroke={SUCCESS} strokeWidth="2" />
                                <text x="400" y="240" textAnchor="middle" fill={SUCCESS} fontSize="22" fontWeight="900" fontFamily="SF Mono, monospace">
                                    3 ≤ 5 → OVERLAP!
                                </text>
                            </g>
                        </svg>
                    </div>
                )}

                {/* Merge rule diagram (L22) */}
                {frame >= L22.start && frame < L23.start && (
                    <div style={{ position: 'relative', zIndex: 10, marginBottom: 30, opacity: fadeIn(frame, L22.start, 20) }}>
                        <svg width="800" height="180" viewBox="0 0 800 180">
                            {/* Merged bar */}
                            <rect x={valToX(barA[0]) - 30} y="30" width={barWidth([1, 8])} height={BAR.HEIGHT}
                                rx={BAR.RADIUS} fill={`${ACCENT}20`} stroke={ACCENT} strokeWidth={BAR.BORDER} />
                            <text x={valToX(barA[0]) - 30 + barWidth([1, 8]) / 2} y="60" textAnchor="middle"
                                fill={ACCENT} fontSize="22" fontWeight="800" fontFamily="SF Mono, monospace">
                                [{barA[0]}, max({barA[1]},{barB[1]})] → [1,8]
                            </text>

                            {/* Max arrow */}
                            <text x="400" y="130" textAnchor="middle" fill={SUCCESS} fontSize="24" fontWeight="900"
                                fontFamily="SF Mono, monospace" opacity={fadeIn(frame, L22.start + 30, 15)}>
                                end = max(curr.end, next.end)
                            </text>
                        </svg>
                    </div>
                )}

                {/* "No" badges (L23-25) */}
                {frame >= L23.start && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', position: 'relative', zIndex: 10, marginTop: 20 }}>
                        {[
                            { text: 'No comparisons explosion', delay: L23.start + 10, color: SUCCESS },
                            { text: 'No confusion', delay: L24.start + 10, color: SUCCESS },
                            { text: 'Just one pass', delay: L25.start + 10, color: ACCENT },
                        ].map((b, i) => (
                            <div key={i} style={{
                                opacity: fadeIn(frame, b.delay, 12),
                                transform: `scale(${scaleIn(frame, b.delay, SP.punchy) * (i === 2 ? pulse(frame, 0.97, 1.03, 0.05) : 1)})`,
                                background: `${b.color}08`, border: `2px solid ${b.color}30`,
                                borderRadius: 16, padding: '16px 32px',
                                display: 'flex', alignItems: 'center', gap: 12, willChange: 'transform',
                                boxShadow: i === 2 ? glowShadow(frame, b.color, 0.06) : 'none',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    {i < 2 ? (
                                        <><circle cx="14" cy="14" r="11" stroke={b.color} strokeWidth="2"/>
                                        <line x1="7" y1="7" x2="21" y2="21" stroke={b.color} strokeWidth="2" strokeLinecap="round"/></>
                                    ) : (
                                        <path d="M 5 14 L 11 20 L 23 8" stroke={b.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    )}
                                </svg>
                                <span style={{ color: b.color, fontSize: 32, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                    {b.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatternExplained;
