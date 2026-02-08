/**
 * Scene 1 — CrashHook (L1-2)
 * L1: "Quick question, why do stocks suddenly crash, but never warn you before?"
 * L2: "Day five of turning you into an interview pattern machine."
 *
 * MAXIMUM IMPACT opening. Stock chart crash animation from frame 0.
 * Bars slam down, numbers scatter, "CRASH" text explodes.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { LINE_TIMING, ACCENT, DANGER } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

/* Fake stock price data for the crash chart */
const STOCK_PRICES = [45, 52, 48, 61, 58, 72, 68, 85, 78, 92, 88, 95, 70, 42, 28, 15, 8];

const CrashHook: React.FC = () => {
    const frame = useCurrentFrame();
    const { L2 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.2 },
        { frame: 18, x: 0, y: 0, scale: 1.0 },
        { frame: 60, x: 0, y: -20, scale: 1.05 },
        { frame: 250, x: 0, y: 0, scale: 1.0 },
        { frame: 443, x: 0, y: 0, scale: 1.0 },
    ], 4);

    /* Stock chart crash animation — draws progressively */
    const chartProgress = interpolate(frame, [0, 50], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
    });

    /* Crash moment: bars turn red at frame ~30 */
    const crashMoment = interpolate(frame, [28, 38], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    /* Screen shake on crash */
    const shakeX = frame > 28 && frame < 50 ? Math.sin(frame * 2.5) * (50 - frame) * 0.5 : 0;
    const shakeY = frame > 28 && frame < 50 ? Math.cos(frame * 3.1) * (50 - frame) * 0.3 : 0;

    const l1Words = wordByWord('Quick question, why do stocks suddenly crash, but never warn you before?', frame, 20, 3);
    const l2Words = wordByWord('Day five of turning you into an interview pattern machine.', frame, L2.start + 3, 3);

    /* Fade stock chart out as L2 starts */
    const chartFade = frame > L2.start - 20 ? interpolate(frame, [L2.start - 20, L2.start], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }) : 1;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Red flash on crash */}
            {frame > 28 && frame < 45 && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: `radial-gradient(circle at 50% 40%, ${DANGER}20 0%, transparent 70%)`,
                    opacity: interpolate(frame, [28, 35, 45], [0, 1, 0], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }),
                }} />
            )}

            <div style={{
                ...cam, position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transform: `${cam.transform} translate(${shakeX}px, ${shakeY}px)`,
            }}>
                {/* Stock chart bars — immediate visual from frame 0 */}
                <div style={{ position: 'relative', width: 900, height: 400, marginBottom: 40, opacity: chartFade }}>
                    {STOCK_PRICES.map((price, i) => {
                        const barDelay = i * 2;
                        const visible = chartProgress * STOCK_PRICES.length > i;
                        if (!visible) return null;

                        const barH = (price / 100) * 350;
                        const barW = 40;
                        const barGap = 12;
                        const x = i * (barW + barGap) + 20;
                        const isCrash = i >= 12;
                        const color = isCrash && crashMoment > 0 ? DANGER : isCrash ? ACCENT : ACCENT;

                        const entryScale = interpolate(frame, [barDelay, barDelay + 8], [0, 1], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                            easing: Easing.out(Easing.back(1.5)),
                        });

                        /* Crash bars slam down */
                        const crashDrop = isCrash ? interpolate(frame, [28 + (i - 12) * 3, 38 + (i - 12) * 3], [0, 1], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                            easing: Easing.in(Easing.cubic),
                        }) : 0;
                        const finalH = isCrash ? barH * (1 - crashDrop * 0.6) : barH;

                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                left: x, bottom: 0,
                                width: barW, height: finalH,
                                transform: `scaleY(${entryScale})`,
                                transformOrigin: 'bottom',
                                background: color,
                                borderRadius: '6px 6px 0 0',
                                opacity: 0.9,
                                boxShadow: isCrash && crashMoment > 0 ? `0 0 20px ${DANGER}60` : 'none',
                            }} />
                        );
                    })}
                    {/* Crash line */}
                    {crashMoment > 0 && (
                        <svg style={{ position: 'absolute', inset: 0 }} width="900" height="400">
                            <line
                                x1={12 * 52 + 20} y1={50}
                                x2={12 * 52 + 20 + crashMoment * 200} y2={50 + crashMoment * 300}
                                stroke={DANGER} strokeWidth="4" strokeDasharray="8 4"
                                opacity={crashMoment}
                            />
                        </svg>
                    )}
                </div>

                {/* "CRASH" flash text (frames 30-70) */}
                {frame >= 30 && frame < 70 && (
                    <div style={{
                        position: 'absolute', top: 350,
                        opacity: interpolate(frame, [30, 36, 55, 70], [0, 1, 1, 0], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                        }),
                        transform: `scale(${interpolate(frame, [30, 38], [0.5, 1], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                            easing: Easing.out(Easing.back(1.4)),
                        })})`,
                    }}>
                        <span style={{
                            fontSize: 140, fontWeight: 900,
                            fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            color: DANGER,
                            textShadow: `0 0 60px ${DANGER}80, 0 0 120px ${DANGER}40`,
                            letterSpacing: 8,
                        }}>
                            CRASH
                        </span>
                    </div>
                )}

                {/* L1 text */}
                {frame >= 20 && (
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                        maxWidth: 920, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 80,
                    }}>
                        {l1Words.map(({ word, opacity }, i) => {
                            const isKey = ['stocks', 'crash,', 'never', 'warn'].includes(word);
                            return (
                                <span key={i} style={{
                                    opacity, color: isKey ? DANGER : '#F1F5F9',
                                    fontSize: isKey ? 72 : 58, fontWeight: isKey ? 900 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isKey ? `0 0 20px ${DANGER}40` : 'none',
                                }}>
                                    {word}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* L2 text + DAY 5 badge */}
                {frame >= L2.start && (
                    <>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
                            maxWidth: 800, marginTop: 30, padding: '0 40px', position: 'relative', zIndex: 10,
                        }}>
                            {l2Words.map(({ word, opacity }, i) => {
                                const isKey = ['Day', 'five', 'pattern', 'machine.'].includes(word);
                                return (
                                    <span key={i} style={{
                                        opacity, color: isKey ? ACCENT : '#CBD5E1',
                                        fontSize: isKey ? 52 : 44, fontWeight: isKey ? 800 : 600,
                                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>

                        <div style={{
                            marginTop: 30,
                            opacity: fadeIn(frame, L2.start + 25, 15),
                            transform: `scale(${scaleIn(frame, L2.start + 25, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.04)})`,
                            border: `3px solid ${ACCENT}60`, borderRadius: 20, padding: '14px 36px',
                            background: `${ACCENT}10`, willChange: 'transform',
                            boxShadow: glowShadow(frame, ACCENT, 0.04),
                        }}>
                            <span style={{ color: ACCENT, fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                DAY 5
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CrashHook;
