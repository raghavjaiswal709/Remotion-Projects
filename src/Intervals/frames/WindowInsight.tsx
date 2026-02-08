/**
 * Scene 10 — WindowInsight (L32-33)
 * "Once you see intervals as windows,"
 * "half the problem is already solved."
 *
 * Interval bars morph into window metaphor; zen moment.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, SORTED_INTERVALS } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow, BAR } from '../helpers/animations';

const WindowInsight: React.FC = () => {
    const frame = useCurrentFrame();
    const { L32, L33 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.0 },
        { frame: 80, x: 0, y: -10, scale: 1.04 },
        { frame: 196, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l32Words = wordByWord('Once you see intervals as windows,', frame, L32.start + 3, 3);
    const l33Words = wordByWord('half the problem is already solved.', frame, L33.start + 3, 3);

    const activeWords = frame >= L33.start ? l33Words : l32Words;
    const activeHighlights = frame >= L33.start
        ? ['half', 'problem', 'already', 'solved.']
        : ['intervals', 'windows,'];

    /* Morph bars from flat to "window" form */
    const morphProgress = interpolate(frame, [L32.start + 20, L32.start + 80], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
    });

    /* Half glow on L33 */
    const halfGlow = frame >= L33.start ? interpolate(frame, [L33.start, L33.start + 40], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }) : 0;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
                    maxWidth: 900, padding: '0 40px', marginBottom: 60, position: 'relative', zIndex: 10, minHeight: 70,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 66 : 56, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Interval bars morphing into windows */}
                <div style={{ position: 'relative', width: 900, height: 400, marginTop: 20 }}>
                    {SORTED_INTERVALS.map(([start, end]: readonly [number, number], i: number) => {
                        const barDelay = L32.start + 10 + i * 10;
                        const barOp = fadeIn(frame, barDelay, 12);
                        const barScale = scaleIn(frame, barDelay, SP.overshoot);

                        const barW = (end - start) * 45;
                        const barX = start * 45;
                        const barY = i * (BAR.HEIGHT + BAR.GAP + 8);

                        /* Window morph: add corner radius, border, inner glow */
                        const cornerRadius = 8 + (20 - 8) * morphProgress;
                        const borderW = 2 + (4 - 2) * morphProgress;
                        const innerPad = 10 * morphProgress;
                        const barH = BAR.HEIGHT + 20 * morphProgress;

                        const barColor = i % 2 === 0 ? ACCENT : SUCCESS;

                        return (
                            <div key={i} style={{
                                position: 'absolute', left: barX + 40, top: barY + 40,
                                width: barW, height: barH,
                                opacity: barOp, transform: `scale(${barScale})`,
                                background: `${barColor}15`,
                                border: `${borderW}px solid ${barColor}60`,
                                borderRadius: cornerRadius,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: innerPad,
                                boxShadow: morphProgress > 0.5 ? glowShadow(frame, barColor, 0.04) : 'none',
                                willChange: 'transform',
                            }}>
                                {/* Window title bar (morphs in) */}
                                {morphProgress > 0.3 && (
                                    <div style={{
                                        position: 'absolute', top: 4, left: 10,
                                        display: 'flex', gap: 4, opacity: morphProgress,
                                    }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
                                    </div>
                                )}
                                <span style={{
                                    color: barColor, fontSize: 22, fontWeight: 700,
                                    fontFamily: 'SF Mono, monospace',
                                    opacity: barOp,
                                }}>
                                    [{start}, {end}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* "Half solved" badge */}
                {halfGlow > 0 && (
                    <div style={{
                        marginTop: 40, opacity: halfGlow,
                        transform: `scale(${scaleIn(frame, L33.start + 10, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                        background: `${SUCCESS}10`, border: `4px solid ${SUCCESS}50`,
                        borderRadius: 24, padding: '18px 44px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.06),
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 44, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            50% SOLVED
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WindowInsight;
