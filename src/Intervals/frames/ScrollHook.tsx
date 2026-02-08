/**
 * Scene 1 — ScrollHook (L1-2)
 * "Before you scroll, this one saves interviews."
 * "Day four of turning you into a pattern first thinker."
 *
 * Eye-catching opener: animated interval bars exploding into view, 
 * then text appears. Maximum retention, zero skips.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, DANGER, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const ScrollHook: React.FC = () => {
    const frame = useCurrentFrame();
    const { L1, L2 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.15 },
        { frame: 20, x: 0, y: 0, scale: 1.0 },
        { frame: 180, x: 0, y: 10, scale: 1.02 },
        { frame: 283, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l1Words = wordByWord('Before you scroll, this one saves interviews.', frame, L1.start + 20, 4);
    const l2Words = wordByWord('Day four of turning you into a pattern first thinker.', frame, L2.start + 3, 3);

    // Eye-catching opening: colorful interval bars burst in from frame 0
    const barColors = [ACCENT, SUCCESS, DANGER, WARN, '#A78BFA'];
    const bars = [
        { start: 2, end: 8, y: 600 },
        { start: 5, end: 12, y: 720 },
        { start: 10, end: 14, y: 840 },
        { start: 1, end: 6, y: 960 },
        { start: 8, end: 16, y: 1080 },
    ];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Radial gradient burst */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: `radial-gradient(circle at 50% 50%, ${ACCENT}15 0%, transparent 60%)`,
                opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Eye-catching interval bars animation (0-18 frames) */}
                {frame < 80 && bars.map((bar, i) => {
                    const delay = i * 2;
                    const barOp = interpolate(frame, [delay, delay + 12], [0, 1], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                        easing: Easing.out(Easing.back(2)),
                    });
                    const barScale = interpolate(frame, [delay, delay + 12], [0.3, 1], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                        easing: Easing.out(Easing.back(1.5)),
                    });
                    const barRotate = interpolate(frame, [delay, delay + 12], [-15, 0], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                        easing: Easing.out(Easing.cubic),
                    });
                    const barFadeOut = frame > 60 ? interpolate(frame, [60, 75], [1, 0], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }) : 1;

                    const barW = (bar.end - bar.start) * 50;
                    const barX = (1080 - barW) / 2;
                    const color = barColors[i % barColors.length];

                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: barX, top: bar.y,
                            width: barW, height: 56,
                            opacity: barOp * barFadeOut,
                            transform: `scale(${barScale}) rotate(${barRotate}deg)`,
                            background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                            border: `4px solid ${color}80`,
                            borderRadius: 16,
                            boxShadow: `0 0 40px ${color}60, inset 0 0 20px ${color}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            willChange: 'transform, opacity',
                        }}>
                            <span style={{
                                color, fontSize: 28, fontWeight: 900,
                                fontFamily: 'SF Mono, monospace',
                                textShadow: `0 0 10px ${color}80`,
                            }}>
                                [{bar.start}, {bar.end}]
                            </span>
                        </div>
                    );
                })}

                {/* "INTERVALS" flash text (frames 15-75) */}
                {frame >= 15 && frame < 75 && (
                    <div style={{
                        position: 'absolute', top: 400, left: 0, right: 0,
                        display: 'flex', justifyContent: 'center',
                        opacity: interpolate(frame, [15, 25, 60, 75], [0, 1, 1, 0], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                        }),
                        transform: `scale(${interpolate(frame, [15, 25], [0.8, 1], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                            easing: Easing.out(Easing.back(1.2)),
                        })})`,
                    }}>
                        <span style={{
                            fontSize: 120, fontWeight: 900,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            background: `linear-gradient(135deg, ${ACCENT}, ${SUCCESS})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: `0 0 60px ${ACCENT}80`,
                            letterSpacing: 4,
                        }}>
                            INTERVALS
                        </span>
                    </div>
                )}

                {/* L1 word-by-word (delayed to frame 20+) */}
                {frame >= 20 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 900, marginBottom: 50, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                        {l1Words.map(({ word, opacity }, i) => {
                            const isKey = ['scroll,', 'saves', 'interviews.'].includes(word);
                            return (
                                <span key={i} style={{
                                    opacity, color: isKey ? ACCENT : '#F1F5F9',
                                    fontSize: isKey ? 72 : 60, fontWeight: isKey ? 900 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isKey ? `0 0 20px ${ACCENT}40` : 'none',
                                }}>
                                    {word}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* L2 word-by-word */}
                {frame >= L2.start && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 800, marginBottom: 40, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                        {l2Words.map(({ word, opacity }, i) => {
                            const isDay = ['Day', 'four', 'pattern'].includes(word);
                            return (
                                <span key={i} style={{
                                    opacity, color: isDay ? ACCENT : '#94A3B8',
                                    fontSize: 44, fontWeight: isDay ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}>
                                    {word}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* DAY 4 badge */}
                {frame >= L2.start + 20 && (
                    <div style={{
                        opacity: fadeIn(frame, L2.start + 20, 20),
                        transform: `scale(${scaleIn(frame, L2.start + 20, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                        border: `3px solid ${ACCENT}50`, borderRadius: 20, padding: '16px 40px',
                        background: `${ACCENT}10`, willChange: 'transform',
                        position: 'relative', zIndex: 10,
                        boxShadow: glowShadow(frame, ACCENT, 0.05),
                    }}>
                        <span style={{ color: ACCENT, fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                            DAY 4
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrollHook;
