/**
 * Scene 2 — WeaponIntro (L3-4)
 * "Today's weapon, intervals pattern."
 * "They give you ranges, meetings, time slots, schedules."
 *
 * Timeline axis appears with sample interval bars sliding in.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, ACCENT_LIGHT, WARN } from '../helpers/timing';
import { BAR, SP, camMulti, fadeIn, scaleIn, wordByWord, valToX, barWidth } from '../helpers/animations';

const SAMPLE_RANGES: { label: string; interval: [number, number]; color: string }[] = [
    { label: 'Meeting', interval: [1, 4], color: ACCENT },
    { label: 'Slot', interval: [3, 7], color: WARN },
    { label: 'Schedule', interval: [6, 10], color: ACCENT_LIGHT },
];

const WeaponIntro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L3, L4 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 120, x: 0, y: -10, scale: 1.04 },
        { frame: 326, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const l3Words = wordByWord('Today\'s weapon, intervals pattern.', frame, L3.start + 4, 4);
    const l4Words = wordByWord('They give you ranges, meetings, time slots, schedules.', frame, L4.start + 4, 3);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L3 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 900, marginBottom: 40, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l3Words.map(({ word, opacity }, i) => {
                        const isKey = ['intervals', 'pattern.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 64 : 52, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 16px ${ACCENT}40` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Timeline visualization */}
                <div style={{ position: 'relative', zIndex: 10, marginBottom: 50 }}>
                    <svg width="900" height="280" viewBox="0 0 900 280">
                        {/* Axis */}
                        <line x1={BAR.AXIS_X} y1="240" x2="820" y2="240"
                            stroke="#475569" strokeWidth="3" opacity={fadeIn(frame, 30, 20)} />
                        {/* Tick marks */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <g key={i} opacity={fadeIn(frame, 35 + i * 3, 10)}>
                                <line x1={valToX(i)} y1="235" x2={valToX(i)} y2="245" stroke="#475569" strokeWidth="2" />
                                <text x={valToX(i)} y="262" textAnchor="middle" fill="#64748B" fontSize="18" fontFamily="SF Mono, monospace">{i}</text>
                            </g>
                        ))}

                        {/* Interval bars sliding in */}
                        {SAMPLE_RANGES.map((r, idx) => {
                            const delay = L4.start + 20 + idx * 25;
                            const s = scaleIn(frame, delay, SP.elastic);
                            const o = fadeIn(frame, delay, 15);
                            const x = valToX(r.interval[0]);
                            const w = barWidth(r.interval);
                            const y = 60 + idx * (BAR.HEIGHT + BAR.GAP);

                            return (
                                <g key={idx} opacity={o}>
                                    <rect x={x} y={y} width={w * s} height={BAR.HEIGHT}
                                        rx={BAR.RADIUS} fill={`${r.color}25`} stroke={r.color} strokeWidth={BAR.BORDER} />
                                    <text x={x + w / 2} y={y + BAR.HEIGHT / 2 + 6}
                                        textAnchor="middle" fill={r.color} fontSize="22" fontWeight="800" fontFamily="SF Mono, monospace">
                                        {r.label} [{r.interval[0]},{r.interval[1]}]
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* L4 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 850, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l4Words.map(({ word, opacity }, i) => {
                        const isKey = ['ranges,', 'meetings,', 'time', 'slots,', 'schedules.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? WARN : '#94A3B8',
                                fontSize: 44, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeaponIntro;
