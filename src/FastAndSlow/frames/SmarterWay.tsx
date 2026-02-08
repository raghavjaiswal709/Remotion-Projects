/**
 * Scene 5 — SmarterWay (L14-17)
 * "Here's the smarter way." / "Use two pointers." / "One moves slow." / "One moves fast."
 *
 * Two pointer arrows materialise on a linked list, labeled SLOW and FAST.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, PTR_SLOW, PTR_FAST, SUCCESS } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse } from '../helpers/animations';

const SmarterWay: React.FC = () => {
    const frame = useCurrentFrame();
    const { L14, L15, L16, L17 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 80, x: 0, y: -5, scale: 1.04 },
        { frame: 200, x: 0, y: 0, scale: 1.02 },
        { frame: 242, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l14Words = wordByWord('Here\'s the smarter way.', frame, L14.start + 4, 5);
    const l15Words = wordByWord('Use two pointers.', frame, L15.start + 4, 5);

    // Active text line
    const activeLineFrame = frame >= L15.start ? 2 : 1;
    const activeWords = activeLineFrame === 2 ? l15Words : l14Words;
    const activeHighlights = activeLineFrame === 2 ? ['two', 'pointers.'] : ['smarter'];

    const slowDelay = L16.start + 10;
    const fastDelay = L17.start + 10;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 850, marginBottom: 60, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? SUCCESS : '#CBD5E1',
                                fontSize: isKey ? 64 : 52, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 20px ${SUCCESS}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Pointer pair */}
                <div style={{ display: 'flex', gap: 120, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {/* Slow pointer */}
                    <div style={{
                        opacity: fadeIn(frame, slowDelay, 15),
                        transform: `scale(${scaleIn(frame, slowDelay, SP.overshoot) * pulse(frame, 0.96, 1.04, 0.04)})`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, willChange: 'transform',
                    }}>
                        <div style={{
                            width: 140, height: 140, borderRadius: '50%',
                            background: `${PTR_SLOW}15`, border: `4px solid ${PTR_SLOW}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 0 24px 6px ${PTR_SLOW}25`,
                        }}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <ellipse cx="40" cy="50" rx="25" ry="18" fill={PTR_SLOW} opacity="0.3"/>
                                <circle cx="40" cy="38" r="20" fill={PTR_SLOW} opacity="0.5"/>
                                <circle cx="28" cy="32" r="8" fill={PTR_SLOW}/>
                                <circle cx="52" cy="32" r="8" fill={PTR_SLOW}/>
                                <circle cx="33" cy="42" r="7" fill={PTR_SLOW}/>
                                <circle cx="47" cy="42" r="7" fill={PTR_SLOW}/>
                            </svg>
                        </div>
                        <span style={{ color: PTR_SLOW, fontSize: 40, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>SLOW</span>
                        <span style={{ color: '#94A3B8', fontSize: 28, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>+1 step</span>
                    </div>

                    {/* VS */}
                    <div style={{ opacity: fadeIn(frame, Math.max(slowDelay, fastDelay), 15) }}>
                        <span style={{ color: '#475569', fontSize: 40, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>vs</span>
                    </div>

                    {/* Fast pointer */}
                    <div style={{
                        opacity: fadeIn(frame, fastDelay, 15),
                        transform: `scale(${scaleIn(frame, fastDelay, SP.overshoot) * pulse(frame, 0.96, 1.04, 0.06)})`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, willChange: 'transform',
                    }}>
                        <div style={{
                            width: 140, height: 140, borderRadius: '50%',
                            background: `${PTR_FAST}15`, border: `4px solid ${PTR_FAST}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 0 24px 6px ${PTR_FAST}25`,
                        }}>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <ellipse cx="30" cy="18" rx="5" ry="18" fill={PTR_FAST}/>
                                <ellipse cx="50" cy="18" rx="5" ry="18" fill={PTR_FAST}/>
                                <circle cx="40" cy="42" r="22" fill={PTR_FAST} opacity="0.5"/>
                                <circle cx="33" cy="38" r="4" fill="#1E293B"/>
                                <circle cx="47" cy="38" r="4" fill="#1E293B"/>
                                <path d="M 33 48 Q 40 52 47 48" stroke="#1E293B" strokeWidth="2" fill="none"/>
                            </svg>
                        </div>
                        <span style={{ color: PTR_FAST, fontSize: 40, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>FAST</span>
                        <span style={{ color: '#94A3B8', fontSize: 28, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>+2 steps</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmarterWay;
