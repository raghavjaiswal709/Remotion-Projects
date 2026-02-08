/**
 * Scene 3 — ProblemSetup (L5-9)
 * "You're given a linked list or a sequence,"
 * "and they ask something scary."
 * "Is there a cycle?" / "Find the middle." / "Detect a loop."
 *
 * Linked list diagram forms, scary questions pop in as cards.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, LINKED_LIST_NODES, ACCENT, DANGER, WARN } from '../helpers/timing';
import { NODE, SP, camMulti, fadeIn, scaleIn, wordByWord, strokeAnim } from '../helpers/animations';

const ProblemSetup: React.FC = () => {
    const frame = useCurrentFrame();
    const { L5, L6, L7, L8, L9 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 20, scale: 1.0 },
        { frame: 120, x: 0, y: -10, scale: 1.03 },
        { frame: 300, x: 0, y: -20, scale: 1.05 },
        { frame: 398, x: 0, y: 0, scale: 1.02 },
    ], 2);

    const l5Words = wordByWord('You\'re given a linked list or a sequence,', frame, L5.start + 3, 3);
    const l6Words = wordByWord('and they ask something scary.', frame, L6.start + 3, 4);

    const scaryQuestions = [
        { text: 'Is there a cycle?', delay: L7.start + 5, color: DANGER, iconType: 'cycle' },
        { text: 'Find the middle.', delay: L8.start + 5, color: ACCENT, iconType: 'target' },
        { text: 'Detect a loop.', delay: L9.start + 5, color: WARN, iconType: 'infinity' },
    ];

    const renderIcon = (type: string, color: string) => {
        if (type === 'cycle') {
            return <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M 24 8 A 16 16 0 1 1 8 24" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M 8 24 L 8 14 L 18 14" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>;
        } else if (type === 'target') {
            return <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="3" fill="none"/>
                <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="3" fill="none"/>
                <circle cx="24" cy="24" r="6" fill={color}/>
            </svg>;
        } else {
            return <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M 8 24 A 16 16 0 0 1 40 24" stroke={color} strokeWidth="4" fill="none"/>
                <path d="M 8 24 A 16 16 0 0 0 40 24" stroke={color} strokeWidth="4" fill="none"/>
                <circle cx="8" cy="24" r="3" fill={color}/>
                <circle cx="40" cy="24" r="3" fill={color}/>
            </svg>;
        }
    };

    // Linked list node animation
    const nodeBaseDelay = 20;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L5 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 20, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l5Words.map(({ word, opacity }, i) => {
                        const isKey = ['linked', 'list', 'sequence,'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? ACCENT : '#CBD5E1',
                                fontSize: 48, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L6 text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 50, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l6Words.map(({ word, opacity }, i) => {
                        const isScary = ['scary.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isScary ? DANGER : '#94A3B8',
                                fontSize: isScary ? 56 : 46, fontWeight: isScary ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isScary ? `0 0 20px ${DANGER}50` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Linked list visualization */}
                <div style={{ position: 'relative', marginBottom: 60, height: 120, display: 'flex', alignItems: 'center', zIndex: 10 }}>
                    <svg width="880" height="120" viewBox="0 0 880 120">
                        {LINKED_LIST_NODES.map((val, idx) => {
                            const cx = idx * NODE.STEP + NODE.W / 2 + 10;
                            const cy = 60;
                            const delay = nodeBaseDelay + idx * 8;
                            const o = fadeIn(frame, delay, 12);
                            const s = scaleIn(frame, delay, SP.snappy);

                            return (
                                <g key={idx}>
                                    {/* Arrow to next node */}
                                    {idx < LINKED_LIST_NODES.length - 1 && (
                                        <line
                                            x1={cx + NODE.W / 2 + 4} y1={cy}
                                            x2={cx + NODE.STEP - NODE.W / 2 - 4} y2={cy}
                                            stroke="#475569" strokeWidth="3" opacity={o}
                                            markerEnd="url(#arrowhead)"
                                            {...strokeAnim(frame, delay + 8, NODE.GAP, 20)}
                                        />
                                    )}
                                    {/* Node circle */}
                                    <circle
                                        cx={cx} cy={cy} r={NODE.R * s}
                                        fill="#1E293B" stroke="#475569" strokeWidth={NODE.BORDER}
                                        opacity={o}
                                    />
                                    {/* Value */}
                                    <text
                                        x={cx} y={cy + 8}
                                        textAnchor="middle" fill="#F1F5F9"
                                        fontSize="34" fontWeight="800" fontFamily="SF Mono, monospace"
                                        opacity={o}
                                    >
                                        {val}
                                    </text>
                                </g>
                            );
                        })}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                {/* Scary question cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {scaryQuestions.map((q, i) => {
                        const s = scaleIn(frame, q.delay, SP.punchy);
                        const o = fadeIn(frame, q.delay, 12);
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${q.color}10`, border: `3px solid ${q.color}50`,
                                borderRadius: 20, padding: '24px 32px',
                                display: 'flex', alignItems: 'center', gap: 16, willChange: 'transform',
                            }}>
                                {renderIcon(q.iconType, q.color)}
                                <span style={{ color: q.color, fontSize: 32, fontWeight: 800, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                                    {q.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProblemSetup;
