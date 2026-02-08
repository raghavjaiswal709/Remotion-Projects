/**
 * Scene 5 — CleanWay (L11-13)
 * "Here's the clean way."
 * "First rule, sort the intervals."
 * "Always, now listen carefully."
 *
 * Unsorted bars reorder themselves smoothly by start time.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, UNSORTED_INTERVALS, ACCENT, SUCCESS } from '../helpers/timing';
import { BAR, SP, camMulti, fadeIn, scaleIn, wordByWord, smoothLerp, valToX, barWidth } from '../helpers/animations';

const CleanWay: React.FC = () => {
    const frame = useCurrentFrame();
    const { L11, L12, L13 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 80, x: 0, y: -5, scale: 1.04 },
        { frame: 250, x: 0, y: 0, scale: 1.02 },
        { frame: 347, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l11Words = wordByWord('Here\'s the clean way.', frame, L11.start + 4, 5);
    const l12Words = wordByWord('First rule, sort the intervals.', frame, L12.start + 4, 4);
    const l13Words = wordByWord('Always, now listen carefully.', frame, L13.start + 4, 4);

    // Sorting animation starts at L12 midpoint
    const sortStart = L12.start + 50;
    const sortDur = 60;

    // Map from unsorted positions to sorted positions
    // Unsorted: [6,8],[1,3],[2,5],[9,12],[8,10]
    // Sorted:   [1,3],[2,5],[6,8],[8,10],[9,12]
    // Index map: unsorted[0]→sorted[2], unsorted[1]→sorted[0], unsorted[2]→sorted[1], unsorted[3]→sorted[4], unsorted[4]→sorted[3]
    const sortMap = [2, 0, 1, 4, 3];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850, marginBottom: 20, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {(frame >= L13.start ? l13Words : frame >= L12.start ? l12Words : l11Words).map(({ word, opacity }, i) => {
                        const isKey = ['clean', 'sort', 'intervals.', 'Always,'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? SUCCESS : '#CBD5E1',
                                fontSize: isKey ? 60 : 48, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 16px ${SUCCESS}40` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* SORT label */}
                <div style={{
                    opacity: fadeIn(frame, L12.start + 10, 15),
                    transform: `scale(${scaleIn(frame, L12.start + 10, SP.overshoot)})`,
                    marginBottom: 20, willChange: 'transform', position: 'relative', zIndex: 10,
                }}>
                    <span style={{ color: SUCCESS, fontSize: 40, fontWeight: 900, fontFamily: 'SF Mono, monospace', letterSpacing: 4 }}>
                        STEP 1: SORT
                    </span>
                </div>

                {/* Interval bars — animate from unsorted to sorted positions */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <svg width="900" height="420" viewBox="0 0 900 420">
                        {/* Timeline axis */}
                        <line x1={BAR.AXIS_X} y1="380" x2="840" y2="380" stroke="#475569" strokeWidth="3" opacity={fadeIn(frame, 20, 15)} />
                        {Array.from({ length: 14 }).map((_, i) => (
                            <g key={i} opacity={fadeIn(frame, 22 + i * 2, 10)}>
                                <line x1={valToX(i)} y1="375" x2={valToX(i)} y2="385" stroke="#475569" strokeWidth="2" />
                                <text x={valToX(i)} y="400" textAnchor="middle" fill="#64748B" fontSize="16" fontFamily="SF Mono, monospace">{i}</text>
                            </g>
                        ))}

                        {/* Interval bars */}
                        {UNSORTED_INTERVALS.map((interval, idx) => {
                            const unsortedY = BAR.BASE_Y - 60 + idx * (BAR.HEIGHT + BAR.GAP);
                            const sortedY = BAR.BASE_Y - 60 + sortMap[idx] * (BAR.HEIGHT + BAR.GAP);
                            const currentY = smoothLerp(frame, sortStart, sortStart + sortDur, unsortedY, sortedY);

                            const x = valToX(interval[0]);
                            const w = barWidth(interval);
                            const entryDelay = 15 + idx * 10;
                            const o = fadeIn(frame, entryDelay, 12);
                            const isSorted = frame >= sortStart + sortDur;

                            return (
                                <g key={idx} opacity={o}>
                                    <rect x={x} y={currentY} width={w} height={BAR.HEIGHT}
                                        rx={BAR.RADIUS} fill={isSorted ? `${SUCCESS}20` : `${ACCENT}20`}
                                        stroke={isSorted ? SUCCESS : ACCENT} strokeWidth={BAR.BORDER} />
                                    <text x={x + w / 2} y={currentY + BAR.HEIGHT / 2 + 6}
                                        textAnchor="middle" fill={isSorted ? SUCCESS : ACCENT}
                                        fontSize="22" fontWeight="800" fontFamily="SF Mono, monospace">
                                        [{interval[0]},{interval[1]}]
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CleanWay;
