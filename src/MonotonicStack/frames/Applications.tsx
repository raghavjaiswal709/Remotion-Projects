/**
 * Scene 8 — Applications (L18-19)
 * L18: "Next, greater element? Daily temperatures? Largest rectangle in histogram?"
 * L19: "Stock span problem? Once this clicks, array problems start feeling unfairly easy."
 *
 * Grid of application cards with SVG icons.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN, DANGER, PURPLE } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

/* SVG icons for each application */
const NGEIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="28" width="10" height="14" rx="3" fill={color} opacity={0.5} />
        <rect x="19" y="18" width="10" height="24" rx="3" fill={color} opacity={0.7} />
        <rect x="32" y="8" width="10" height="34" rx="3" fill={color} />
        <path d="M11 24 L24 12 L37 4" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
    </svg>
);

const TempIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="20" y="6" width="8" height="30" rx="4" stroke={color} strokeWidth="3" fill="none" />
        <circle cx="24" cy="38" r="6" fill={color} />
        <line x1="24" y1="20" x2="24" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const HistIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="24" width="8" height="18" rx="2" fill={color} opacity={0.4} />
        <rect x="14" y="14" width="8" height="28" rx="2" fill={color} opacity={0.6} />
        <rect x="24" y="8" width="8" height="34" rx="2" fill={color} opacity={0.8} />
        <rect x="34" y="18" width="8" height="24" rx="2" fill={color} />
    </svg>
);

const StockIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polyline points="6,36 14,28 22,32 30,16 38,12 44,20" stroke={color} strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M38 12 L44 12 L44 18" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const APPS = [
    { label: 'Next Greater Element', icon: NGEIcon, color: DANGER },
    { label: 'Daily Temperatures', icon: TempIcon, color: WARN },
    { label: 'Largest Rectangle', icon: HistIcon, color: PURPLE },
    { label: 'Stock Span', icon: StockIcon, color: SUCCESS },
];

const Applications: React.FC = () => {
    const frame = useCurrentFrame();
    const { L18, L19 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.03 },
        { frame: 400, x: 0, y: 0, scale: 1.0 },
        { frame: 511, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l18Words = wordByWord('Next, greater element? Daily temperatures? Largest rectangle in histogram?', frame, L18.start + 3, 2);
    const l19Words = wordByWord('Stock span problem? Once this clicks, array problems start feeling unfairly easy.', frame, L19.start + 3, 3);

    const activeWords = frame >= L19.start ? l19Words : l18Words;
    const activeHighlights = frame >= L19.start
        ? ['Stock', 'span', 'clicks,', 'unfairly', 'easy.']
        : ['Next,', 'greater', 'Daily', 'temperatures?', 'Largest', 'rectangle', 'histogram?'];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                    maxWidth: 920, padding: '0 40px', marginBottom: 50, position: 'relative', zIndex: 10, minHeight: 80,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: isKey ? 62 : 50, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Application cards grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
                    padding: '0 60px', maxWidth: 900, width: '100%',
                }}>
                    {APPS.map((app, i) => {
                        const delay = L18.start + 20 + i * 18;
                        const Icon = app.icon;
                        return (
                            <div key={i} style={{
                                opacity: fadeIn(frame, delay, 15),
                                transform: `scale(${scaleIn(frame, delay, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.03 + i * 0.01)})`,
                                background: `${app.color}08`, border: `3px solid ${app.color}40`,
                                borderRadius: 20, padding: '32px 20px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                                boxShadow: glowShadow(frame, app.color, 0.03),
                                willChange: 'transform',
                            }}>
                                <Icon color={app.color} />
                                <span style={{
                                    color: app.color, fontSize: 30, fontWeight: 700, textAlign: 'center',
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                }}>
                                    {app.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* "Unfairly easy" emphasis */}
                {frame >= L19.start + 60 && (
                    <div style={{
                        marginTop: 40, opacity: fadeIn(frame, L19.start + 60, 15),
                        transform: `scale(${scaleIn(frame, L19.start + 60, SP.overshoot)})`,
                        background: `${SUCCESS}10`, border: `3px solid ${SUCCESS}50`,
                        borderRadius: 20, padding: '14px 36px',
                        boxShadow: glowShadow(frame, SUCCESS, 0.05),
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 38, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            UNFAIRLY EASY
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
