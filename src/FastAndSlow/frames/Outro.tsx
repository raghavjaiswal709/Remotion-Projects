/**
 * Scene 12 — Outro (L39-41)
 * "Fast and slow pointers." / "Two speeds." / "One brain."
 *
 * Hero title with converging turtle + rabbit, bold tagline.
 */
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, ACCENT, PTR_SLOW, PTR_FAST, SUCCESS } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse } from '../helpers/animations';

const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L39, L40, L41 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: -20, scale: 1.08 },
        { frame: 40, x: 0, y: 0, scale: 1.04 },
        { frame: 100, x: 0, y: 10, scale: 1.0 },
        { frame: 158, x: 0, y: 0, scale: 0.98 },
    ], 2);

    const l39Words = wordByWord('Fast and slow pointers.', frame, L39.start + 3, 4);

    // Hero title
    const heroScale = scaleIn(frame, 8, SP.overshoot);
    const heroOpacity = fadeIn(frame, 8, 20);

    // Taglines
    const tag1Delay = L40.start + 8;
    const tag2Delay = L41.start + 8;

    // Converging icons
    const convergence = interpolate(frame, [0, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Radial glow */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: `radial-gradient(ellipse at center, ${ACCENT}10 0%, transparent 60%)`,
                opacity: fadeIn(frame, 20, 40),
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Converging icons */}
                <div style={{ position: 'relative', width: 600, height: 100, marginBottom: 40, zIndex: 10 }}>
                    <div style={{
                        position: 'absolute', left: convergence * 200,
                        top: 20, opacity: fadeIn(frame, 5, 20),
                    }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <ellipse cx="30" cy="38" rx="18" ry="13" fill={PTR_SLOW} opacity="0.3"/>
                            <circle cx="30" cy="28" r="14" fill={PTR_SLOW} opacity="0.5"/>
                            <circle cx="22" cy="24" r="6" fill={PTR_SLOW}/>
                            <circle cx="38" cy="24" r="6" fill={PTR_SLOW}/>
                            <circle cx="25" cy="30" r="5" fill={PTR_SLOW}/>
                            <circle cx="35" cy="30" r="5" fill={PTR_SLOW}/>
                        </svg>
                    </div>
                    <div style={{
                        position: 'absolute', right: convergence * 200,
                        top: 20, opacity: fadeIn(frame, 5, 20),
                    }}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <ellipse cx="22" cy="12" rx="4" ry="14" fill={PTR_FAST}/>
                            <ellipse cx="38" cy="12" rx="4" ry="14" fill={PTR_FAST}/>
                            <circle cx="30" cy="32" r="16" fill={PTR_FAST} opacity="0.5"/>
                            <circle cx="25" cy="28" r="3" fill="#1E293B"/>
                            <circle cx="35" cy="28" r="3" fill="#1E293B"/>
                            <path d="M 25 36 Q 30 40 35 36" stroke="#1E293B" strokeWidth="2" fill="none"/>
                        </svg>
                    </div>
                </div>

                {/* Hero title */}
                <div style={{
                    opacity: heroOpacity,
                    transform: `scale(${heroScale * pulse(frame, 0.98, 1.02, 0.04)})`,
                    marginBottom: 40, willChange: 'transform', position: 'relative', zIndex: 10,
                }}>
                    <span style={{
                        color: '#F1F5F9', fontSize: 72, fontWeight: 900,
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        textShadow: `0 0 40px ${ACCENT}40`,
                    }}>
                        FAST & SLOW
                    </span>
                </div>

                {/* L39 word-by-word */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 800, marginBottom: 50, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l39Words.map(({ word, opacity }, i) => {
                        const isKey = ['Fast', 'slow', 'pointers.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#94A3B8',
                                fontSize: isKey ? 54 : 46, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Tagline 1: Two speeds */}
                <div style={{
                    opacity: fadeIn(frame, tag1Delay, 15),
                    transform: `scale(${scaleIn(frame, tag1Delay, SP.gentle)})`,
                    marginBottom: 16, willChange: 'transform', position: 'relative', zIndex: 10,
                }}>
                    <span style={{ color: PTR_FAST, fontSize: 48, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        Two speeds.
                    </span>
                </div>

                {/* Tagline 2: One brain */}
                <div style={{
                    opacity: fadeIn(frame, tag2Delay, 15),
                    transform: `scale(${scaleIn(frame, tag2Delay, SP.gentle)})`,
                    marginBottom: 50, willChange: 'transform', position: 'relative', zIndex: 10,
                }}>
                    <span style={{ color: SUCCESS, fontSize: 48, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        One brain.
                    </span>
                </div>

                {/* Day 3 badge */}
                <div style={{
                    opacity: fadeIn(frame, 60, 20),
                    transform: `scale(${scaleIn(frame, 60, SP.gentle)})`,
                    border: `2px solid ${ACCENT}40`, borderRadius: 16, padding: '12px 32px',
                    background: `${ACCENT}08`, willChange: 'transform',
                    position: 'relative', zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <span style={{ color: ACCENT, fontSize: 30, fontWeight: 700, fontFamily: 'SF Mono, monospace' }}>
                        DAY 3
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M 5 12 L 10 17 L 19 8" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Outro;
