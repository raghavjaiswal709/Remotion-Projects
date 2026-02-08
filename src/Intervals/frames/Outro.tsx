/**
 * Scene 11 — Outro (L34-35)
 * "Intervals pattern."
 * "Sort first, scan once,"
 *
 * Hero title, converging bars, tagline, DAY 4 badge.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, MERGED_INTERVALS } from '../helpers/timing';

const MERGE_COLOR = '#8B5CF6';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow, BAR } from '../helpers/animations';

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L34, L35 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 60, x: 0, y: -5, scale: 1.05 },
        { frame: 154, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l34Words = wordByWord('Intervals pattern.', frame, L34.start + 3, 4);
    const l35Words = wordByWord('Sort first, scan once,', frame, L35.start + 3, 4);

    const activeWords = frame >= L35.start ? l35Words : l34Words;
    const activeHighlights = frame >= L35.start
        ? ['Sort', 'first,', 'scan', 'once,']
        : ['Intervals', 'pattern.'];

    /* Merged bars converge animation */
    const convergeP = interpolate(frame, [L34.start + 10, L34.start + 50], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
    });

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Hero title */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14,
                    maxWidth: 900, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 80 : 64, fontWeight: isKey ? 900 : 700,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 30px ${ACCENT}40` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Converging merged bars */}
                <div style={{ position: 'relative', width: 800, height: 200, marginTop: 50 }}>
                    {MERGED_INTERVALS.map(([start, end]: readonly [number, number], i: number) => {
                        const barW = (end - start) * 40;
                        const targetX = (800 - barW) / 2;
                        const spreadX = start * 40;
                        const barX = spreadX + (targetX - spreadX) * convergeP;
                        const barY = i * (BAR.HEIGHT + BAR.GAP) + 20;
                        const colors = [ACCENT, SUCCESS, MERGE_COLOR];
                        const barColor = colors[i % colors.length];
                        const barOp = fadeIn(frame, L34.start + 5 + i * 8, 12);

                        return (
                            <div key={i} style={{
                                position: 'absolute', left: barX, top: barY,
                                width: barW, height: BAR.HEIGHT,
                                opacity: barOp,
                                background: `${barColor}20`, border: `3px solid ${barColor}60`,
                                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: glowShadow(frame, barColor, 0.04),
                            }}>
                                <span style={{
                                    color: barColor, fontSize: 22, fontWeight: 700,
                                    fontFamily: 'SF Mono, monospace',
                                }}>
                                    [{start}, {end}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Tagline: "Sort first, scan once" */}
                {frame >= L35.start + 20 && (
                    <div style={{
                        marginTop: 40, opacity: fadeIn(frame, L35.start + 20, 15),
                        transform: `scale(${scaleIn(frame, L35.start + 20, SP.overshoot)})`,
                        background: `${ACCENT}10`, border: `4px solid ${ACCENT}50`,
                        borderRadius: 24, padding: '18px 44px', willChange: 'transform',
                    }}>
                        <span style={{ color: ACCENT, fontSize: 40, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            SORT FIRST · SCAN ONCE
                        </span>
                    </div>
                )}

                {/* DAY 4 badge */}
                <div style={{
                    position: 'absolute', bottom: 140, opacity: fadeIn(frame, L34.start + 30, 20),
                    transform: `scale(${scaleIn(frame, L34.start + 30, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.03)})`,
                    background: `${ACCENT}10`, border: `3px solid ${ACCENT}40`,
                    borderRadius: 20, padding: '14px 36px', willChange: 'transform',
                    boxShadow: glowShadow(frame, ACCENT, 0.04),
                }}>
                    <span style={{ color: ACCENT, fontSize: 32, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        DAY 4
                    </span>
                </div>

                {/* Follow CTA */}
                <div style={{
                    position: 'absolute', bottom: 80,
                    opacity: fadeIn(frame, L34.start + 40, 20),
                }}>
                    <span style={{
                        color: '#94A3B8', fontSize: 30, fontWeight: 600,
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    }}>
                        Follow for Day 5
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Outro;
