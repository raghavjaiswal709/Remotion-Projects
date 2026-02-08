/**
 * Scene 10 — Applications (L34-37)
 * "Cycle detection." / "Middle element." / "Happy numbers." / "Circular arrays."
 *
 * Grid of application cards popping in rapid-fire.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN, DANGER } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn } from '../helpers/animations';

const Applications: React.FC = () => {
    const frame = useCurrentFrame();
    const { L34, L35, L36, L37 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 20, scale: 1.0 },
        { frame: 80, x: -5, y: -5, scale: 1.03 },
        { frame: 160, x: 5, y: -10, scale: 1.04 },
        { frame: 208, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const cards = [
        { text: 'Cycle Detection', iconType: 'cycle', delay: L34.start + 6, color: DANGER },
        { text: 'Middle Element', iconType: 'target', delay: L35.start + 6, color: ACCENT },
        { text: 'Happy Numbers', iconType: 'smile', delay: L36.start + 6, color: WARN },
        { text: 'Circular Arrays', iconType: 'infinity', delay: L37.start + 6, color: SUCCESS },
    ];

    const renderIcon = (type: string, color: string) => {
        if (type === 'cycle') {
            return <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M 30 10 A 20 20 0 1 1 10 30" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M 10 30 L 10 18 L 22 18" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>;
        } else if (type === 'target') {
            return <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="22" stroke={color} strokeWidth="4" fill="none"/>
                <circle cx="30" cy="30" r="14" stroke={color} strokeWidth="4" fill="none"/>
                <circle cx="30" cy="30" r="7" fill={color}/>
            </svg>;
        } else if (type === 'smile') {
            return <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="24" stroke={color} strokeWidth="4" fill="none"/>
                <circle cx="22" cy="24" r="3" fill={color}/>
                <circle cx="38" cy="24" r="3" fill={color}/>
                <path d="M 18 34 Q 30 44 42 34" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>;
        } else {
            return <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M 10 30 A 20 20 0 0 1 50 30" stroke={color} strokeWidth="5" fill="none"/>
                <path d="M 10 30 A 20 20 0 0 0 50 30" stroke={color} strokeWidth="5" fill="none"/>
                <circle cx="10" cy="30" r="4" fill={color}/>
                <circle cx="50" cy="30" r="4" fill={color}/>
            </svg>;
        }
    };

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Title */}
                <div style={{
                    opacity: fadeIn(frame, 0, 15), marginBottom: 60,
                    position: 'relative', zIndex: 10,
                }}>
                    <span style={{ color: '#F1F5F9', fontSize: 52, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        Where it works
                    </span>
                </div>

                {/* Cards grid — 2×2 */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 30, maxWidth: 800, padding: '0 40px',
                    position: 'relative', zIndex: 10,
                }}>
                    {cards.map((card, i) => {
                        const s = scaleIn(frame, card.delay, SP.overshoot);
                        const o = fadeIn(frame, card.delay, 12);
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${card.color}10`, border: `3px solid ${card.color}40`,
                                borderRadius: 24, padding: '36px 24px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                                willChange: 'transform',
                            }}>
                                {renderIcon(card.iconType, card.color)}
                                <span style={{
                                    color: card.color, fontSize: 32, fontWeight: 800,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textAlign: 'center',
                                }}>
                                    {card.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Applications;
