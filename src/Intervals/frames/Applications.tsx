/**
 * Scene 9 — Applications (L29-31)
 * "This pattern solves everything."
 * "Merge intervals, meeting rooms, insert interval."
 * "Employee free time."
 *
 * Grid of application cards with SVG icons.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS } from '../helpers/timing';

const MERGE_COLOR = '#8B5CF6';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, glowShadow, pulse } from '../helpers/animations';

/* SVG icons for each application */
const MergeIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Two overlapping bars merging */}
        <rect x="4" y="14" width="20" height="8" rx="4" fill={color} opacity={0.6} />
        <rect x="12" y="26" width="20" height="8" rx="4" fill={color} opacity={0.6} />
        <rect x="4" y="38" width="28" height="8" rx="4" fill={color} />
    </svg>
);

const MeetingIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Calendar grid */}
        <rect x="6" y="10" width="36" height="32" rx="4" stroke={color} strokeWidth="3" fill="none" />
        <line x1="6" y1="20" x2="42" y2="20" stroke={color} strokeWidth="3" />
        <line x1="18" y1="10" x2="18" y2="42" stroke={color} strokeWidth="2" opacity={0.4} />
        <line x1="30" y1="10" x2="30" y2="42" stroke={color} strokeWidth="2" opacity={0.4} />
        <rect x="8" y="22" width="8" height="6" rx="2" fill={color} opacity={0.7} />
        <rect x="20" y="28" width="8" height="6" rx="2" fill={color} opacity={0.7} />
    </svg>
);

const InsertIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Bar with arrow inserting */}
        <rect x="4" y="12" width="14" height="8" rx="4" fill={color} opacity={0.5} />
        <rect x="30" y="12" width="14" height="8" rx="4" fill={color} opacity={0.5} />
        <rect x="14" y="28" width="20" height="8" rx="4" fill={color} />
        <path d="M24 24 L24 16 L20 20 M24 16 L28 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FreeTimeIcon: React.FC<{ color: string }> = ({ color }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Clock with gap */}
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="3" fill="none" />
        <line x1="24" y1="24" x2="24" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="24" x2="32" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2" fill={color} />
    </svg>
);

const APPS = [
    { label: 'Merge Intervals', icon: MergeIcon, color: ACCENT },
    { label: 'Meeting Rooms', icon: MeetingIcon, color: SUCCESS },
    { label: 'Insert Interval', icon: InsertIcon, color: MERGE_COLOR },
    { label: 'Employee Free Time', icon: FreeTimeIcon, color: '#F59E0B' },
];

const Applications: React.FC = () => {
    const frame = useCurrentFrame();
    const { L29, L30, L31 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 80, x: 0, y: -8, scale: 1.03 },
        { frame: 200, x: 0, y: -5, scale: 1.01 },
        { frame: 318, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l29Words = wordByWord('This pattern solves everything.', frame, L29.start + 3, 3);
    const l30Words = wordByWord('Merge intervals, meeting rooms, insert interval.', frame, L30.start + 3, 2);
    const l31Words = wordByWord('Employee free time.', frame, L31.start + 3, 3);

    const activeWords = frame >= L31.start ? l31Words
        : frame >= L30.start ? l30Words
        : l29Words;

    const activeHighlights = frame >= L31.start ? ['Employee', 'free', 'time.']
        : frame >= L30.start ? ['Merge', 'intervals,', 'meeting', 'rooms,', 'insert', 'interval.']
        : ['solves', 'everything.'];

    const cardsVisible = frame >= L30.start + 15;

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
                                fontSize: isKey ? 64 : 54, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Application cards grid */}
                {cardsVisible && (
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
                        padding: '0 60px', maxWidth: 900, width: '100%',
                    }}>
                        {APPS.map((app, i) => {
                            const delay = L30.start + 25 + i * 15;
                            const Icon = app.icon;
                            return (
                                <div key={i} style={{
                                    opacity: fadeIn(frame, delay, 15),
                                    transform: `scale(${scaleIn(frame, delay, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.03 + i * 0.01)})`,
                                    background: `${app.color}08`, border: `2px solid ${app.color}40`,
                                    borderRadius: 20, padding: '32px 20px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                                    willChange: 'transform', boxShadow: glowShadow(frame, app.color, 0.03),
                                }}>
                                    <Icon color={app.color} />
                                    <span style={{
                                        color: app.color, fontSize: 34, fontWeight: 700,
                                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                        textAlign: 'center',
                                    }}>
                                        {app.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* "Solves everything" emphasis */}
                {frame >= L29.start + 30 && frame < L30.start && (
                    <div style={{
                        marginTop: 40, opacity: fadeIn(frame, L29.start + 30, 15),
                        transform: `scale(${scaleIn(frame, L29.start + 30, SP.overshoot)})`,
                    }}>
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                            <circle cx="100" cy="100" r="80" stroke={ACCENT} strokeWidth="4" strokeDasharray="12 6" opacity={0.3}>
                                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite" />
                            </circle>
                            {/* Checkmark */}
                            <path d="M65 100 L90 125 L140 75" stroke={SUCCESS} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
