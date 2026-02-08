/**
 * Scene 6 — AlgorithmWalk (L14-19)
 * "Take the first interval." / "That's your current window."
 * "Move to the next one." / "If it overlaps, merge it."
 * "If it doesn't, close the window." / "Start a new one."
 *
 * Step-by-step merge walk on sorted intervals with window highlight.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, SORTED_INTERVALS, ACCENT, SUCCESS, DANGER, INTERVAL_MERGED } from '../helpers/timing';
import { BAR, SP, camMulti, fadeIn, scaleIn, wordByWord, smoothLerp, valToX, barWidth, glowShadow } from '../helpers/animations';

const AlgorithmWalk: React.FC = () => {
    const frame = useCurrentFrame();
    const { L14, L15, L16, L17, L18, L19 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: -10, y: -5, scale: 1.03 },
        { frame: 250, x: 10, y: -10, scale: 1.05 },
        { frame: 400, x: 0, y: 0, scale: 1.02 },
        { frame: 457, x: 0, y: 0, scale: 1.0 },
    ], 2);

    // Active text — which line is showing
    const l14Words = wordByWord('Take the first interval.', frame, L14.start + 3, 4);
    const l15Words = wordByWord('That\'s your current window.', frame, L15.start + 3, 4);
    const l16Words = wordByWord('Move to the next one.', frame, L16.start + 3, 4);
    const l17Words = wordByWord('If it overlaps, merge it.', frame, L17.start + 3, 4);
    const l18Words = wordByWord('If it doesn\'t, close the window.', frame, L18.start + 3, 3);
    const l19Words = wordByWord('Start a new one.', frame, L19.start + 3, 4);

    const activeWords = frame >= L19.start ? l19Words
        : frame >= L18.start ? l18Words
        : frame >= L17.start ? l17Words
        : frame >= L16.start ? l16Words
        : frame >= L15.start ? l15Words
        : l14Words;

    const activeHighlights = frame >= L19.start ? ['new']
        : frame >= L18.start ? ['doesn\'t,', 'close', 'window.']
        : frame >= L17.start ? ['overlaps,', 'merge']
        : frame >= L16.start ? ['next']
        : frame >= L15.start ? ['current', 'window.']
        : ['first', 'interval.'];

    const activeColor = frame >= L18.start ? DANGER : frame >= L17.start ? SUCCESS : ACCENT;

    // Algorithm state machine driven by narration timing
    // L14: highlight first bar [1,3]
    // L15: show "window" bracket around [1,3]
    // L16: pointer moves to [2,5]
    // L17: overlap detected → merge to [1,5]
    // L18: pointer at [6,8], no overlap → close [1,5]
    // L19: new window [6,8]

    // Window state
    const windowStart = frame >= L18.start ? 6 : 1;
    const windowEnd = frame >= L19.start ? 8
        : frame >= L18.start ? 8
        : frame >= L17.start + 30 ? 5
        : 3;

    // Pointer position (which bar index the "next" pointer is at)
    const pointerIdx = frame >= L19.start ? 3
        : frame >= L18.start ? 2
        : frame >= L16.start ? 1
        : 0;

    // Show merge animation
    const showMerge = frame >= L17.start + 10 && frame < L18.start;
    // Show close animation
    const showClose = frame >= L18.start;
    // Completed bars
    const completedBars: [number, number][] = frame >= L18.start ? [[1, 5]] : [];

    const barsY = 140;

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

                {/* Algorithm visualization */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <svg width="900" height="500" viewBox="0 0 900 500">
                        {/* Timeline axis */}
                        <line x1={BAR.AXIS_X} y1="420" x2="840" y2="420" stroke="#475569" strokeWidth="3" />
                        {Array.from({ length: 14 }).map((_, i) => (
                            <g key={i}>
                                <line x1={valToX(i)} y1="415" x2={valToX(i)} y2="425" stroke="#475569" strokeWidth="2" />
                                <text x={valToX(i)} y="445" textAnchor="middle" fill="#64748B" fontSize="16" fontFamily="SF Mono, monospace">{i}</text>
                            </g>
                        ))}

                        {/* Sorted interval bars */}
                        {SORTED_INTERVALS.map((interval, idx) => {
                            const x = valToX(interval[0]);
                            const w = barWidth(interval);
                            const y = barsY + idx * (BAR.HEIGHT + BAR.GAP);
                            const isActive = idx === pointerIdx;
                            const isPast = idx < pointerIdx;

                            // Merge animation: [1,3] and [2,5] → [1,5]
                            let displayX = x;
                            let displayW = w;
                            if (idx === 0 && showMerge) {
                                const mergeP = smoothLerp(frame, L17.start + 10, L17.start + 40, 0, 1);
                                displayW = w + (barWidth([1, 5]) - w) * mergeP;
                            }
                            if (idx === 1 && showMerge) {
                                const fadeP = smoothLerp(frame, L17.start + 20, L17.start + 40, 1, 0);
                                return (
                                    <g key={idx} opacity={fadeP}>
                                        <rect x={x} y={y} width={w} height={BAR.HEIGHT}
                                            rx={BAR.RADIUS} fill={`${SUCCESS}20`} stroke={SUCCESS} strokeWidth={BAR.BORDER} />
                                        <text x={x + w / 2} y={y + BAR.HEIGHT / 2 + 6}
                                            textAnchor="middle" fill={SUCCESS} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace">
                                            [{interval[0]},{interval[1]}]
                                        </text>
                                    </g>
                                );
                            }

                            const barColor = showClose && idx <= 1 ? INTERVAL_MERGED
                                : isActive ? ACCENT
                                : isPast ? '#475569'
                                : '#475569';
                            const barFill = isActive ? `${barColor}20` : `${barColor}12`;

                            return (
                                <g key={idx}>
                                    <rect x={displayX} y={y} width={displayW} height={BAR.HEIGHT}
                                        rx={BAR.RADIUS} fill={barFill} stroke={barColor} strokeWidth={BAR.BORDER}
                                        opacity={fadeIn(frame, 10 + idx * 8, 12)} />
                                    <text x={displayX + displayW / 2} y={y + BAR.HEIGHT / 2 + 6}
                                        textAnchor="middle" fill={barColor} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace"
                                        opacity={fadeIn(frame, 10 + idx * 8, 12)}>
                                        {idx === 0 && showMerge ? `[1,${Math.round(3 + smoothLerp(frame, L17.start + 10, L17.start + 40, 0, 2))}]` : `[${interval[0]},${interval[1]}]`}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Current window bracket */}
                        {frame >= L15.start && (
                            <g opacity={fadeIn(frame, L15.start, 15)}>
                                <rect x={valToX(windowStart) - 6} y={barsY - 12}
                                    width={windowEnd * BAR.UNIT_PX - windowStart * BAR.UNIT_PX + 12}
                                    height={BAR.HEIGHT + 24}
                                    rx={14} fill="none" stroke={ACCENT} strokeWidth="3" strokeDasharray="10 6" />
                                <text x={valToX(windowStart) + 4} y={barsY - 20}
                                    fill={ACCENT} fontSize="18" fontWeight="800" fontFamily="SF Mono, monospace">
                                    WINDOW [{windowStart},{windowEnd}]
                                </text>
                            </g>
                        )}

                        {/* Pointer triangle */}
                        {frame >= L14.start && (
                            <g transform={`translate(${valToX(SORTED_INTERVALS[pointerIdx][0]) + barWidth(SORTED_INTERVALS[pointerIdx]) / 2}, ${barsY + pointerIdx * (BAR.HEIGHT + BAR.GAP) - 20})`}>
                                <polygon points="0,12 -8,-4 8,-4" fill={ACCENT} />
                            </g>
                        )}

                        {/* Completed bars at bottom */}
                        {completedBars.map((interval, idx) => {
                            const x = valToX(interval[0]);
                            const w = barWidth(interval);
                            const y = 360;
                            return (
                                <g key={`done-${idx}`} opacity={fadeIn(frame, L18.start + 10, 15)}>
                                    <rect x={x} y={y} width={w} height={BAR.HEIGHT}
                                        rx={BAR.RADIUS} fill={`${INTERVAL_MERGED}20`} stroke={INTERVAL_MERGED} strokeWidth={BAR.BORDER} />
                                    <text x={x + w / 2} y={y + BAR.HEIGHT / 2 + 6}
                                        textAnchor="middle" fill={INTERVAL_MERGED} fontSize="20" fontWeight="800" fontFamily="SF Mono, monospace">
                                        [{interval[0]},{interval[1]}]
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Status badge */}
                {showMerge && (
                    <div style={{
                        opacity: fadeIn(frame, L17.start + 10, 12),
                        transform: `scale(${scaleIn(frame, L17.start + 10, SP.overshoot)})`,
                        background: `${SUCCESS}12`, border: `3px solid ${SUCCESS}40`,
                        borderRadius: 16, padding: '12px 28px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.06),
                        position: 'relative', zIndex: 10,
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                            MERGE
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlgorithmWalk;
