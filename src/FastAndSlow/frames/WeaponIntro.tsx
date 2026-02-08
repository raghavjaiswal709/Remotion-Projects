/**
 * Scene 2 — WeaponIntro (L3-4)
 * "Today's weapon, fast and slow pointers."
 * "This pattern looks simple, and that's why people miss it."
 *
 * Two pointer icons (🐢 🐇) materialise + weapon title.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, PTR_SLOW, PTR_FAST, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse } from '../helpers/animations';

const WeaponIntro: React.FC = () => {
    const frame = useCurrentFrame();
    const { L3, L4 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.04 },
        { frame: 341, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const l3Words = wordByWord('Today\'s weapon, fast and slow pointers.', frame, L3.start + 4, 4);
    const l4Words = wordByWord('This pattern looks simple, and that\'s why people miss it.', frame, L4.start + 4, 3);

    const turtleScale = scaleIn(frame, 40, SP.overshoot);
    const rabbitScale = scaleIn(frame, 60, SP.overshoot);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L3 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 900, marginBottom: 40, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l3Words.map(({ word, opacity }, i) => {
                        const isFast = ['fast', 'slow', 'pointers.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isFast ? (word === 'fast' ? PTR_FAST : word === 'slow' ? PTR_SLOW : ACCENT) : '#CBD5E1',
                                fontSize: isFast ? 64 : 52, fontWeight: isFast ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Turtle + Rabbit icons */}
                <div style={{ display: 'flex', gap: 100, marginBottom: 60, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <div style={{
                        opacity: fadeIn(frame, 40, 15), transform: `scale(${turtleScale * pulse(frame, 0.95, 1.05, 0.04)})`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, willChange: 'transform',
                    }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <ellipse cx="60" cy="70" rx="35" ry="25" fill={PTR_SLOW} opacity="0.3"/>
                            <circle cx="60" cy="55" r="28" fill={PTR_SLOW} opacity="0.5"/>
                            <circle cx="40" cy="45" r="12" fill={PTR_SLOW}/>
                            <circle cx="80" cy="45" r="12" fill={PTR_SLOW}/>
                            <circle cx="50" cy="60" r="10" fill={PTR_SLOW}/>
                            <circle cx="70" cy="60" r="10" fill={PTR_SLOW}/>
                            <path d="M 35 50 Q 30 55 35 60" stroke="#1E293B" strokeWidth="3" fill="none"/>
                            <path d="M 85 50 Q 90 55 85 60" stroke="#1E293B" strokeWidth="3" fill="none"/>
                        </svg>
                        <span style={{ color: PTR_SLOW, fontSize: 36, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>SLOW</span>
                    </div>
                    <div style={{
                        opacity: fadeIn(frame, 60, 15), transform: `scale(${rabbitScale * pulse(frame, 0.95, 1.05, 0.06)})`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, willChange: 'transform',
                    }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <ellipse cx="45" cy="30" rx="8" ry="25" fill={PTR_FAST}/>
                            <ellipse cx="75" cy="30" rx="8" ry="25" fill={PTR_FAST}/>
                            <circle cx="60" cy="60" r="30" fill={PTR_FAST} opacity="0.5"/>
                            <circle cx="50" cy="55" r="5" fill="#1E293B"/>
                            <circle cx="70" cy="55" r="5" fill="#1E293B"/>
                            <path d="M 50 68 Q 60 72 70 68" stroke="#1E293B" strokeWidth="3" fill="none"/>
                            <circle cx="35" cy="75" r="8" fill={PTR_FAST} opacity="0.3"/>
                            <circle cx="85" cy="75" r="8" fill={PTR_FAST} opacity="0.3"/>
                        </svg>
                        <span style={{ color: PTR_FAST, fontSize: 36, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>FAST</span>
                    </div>
                </div>

                {/* L4 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 850, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l4Words.map(({ word, opacity }, i) => {
                        const isWarn = ['simple,', 'miss'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isWarn ? WARN : '#94A3B8',
                                fontSize: 46, fontWeight: isWarn ? 800 : 600,
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
