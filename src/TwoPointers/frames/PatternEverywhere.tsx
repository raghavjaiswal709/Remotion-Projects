/**
 * Scene 8 — PatternEverywhere
 * Lines 19-22:
 *   L19: "This pattern shows up everywhere."
 *   L20: "Pair sum, triplets, remove duplicates,"
 *   L21: "reverse arrays, palindrome checks, master this,"
 *   L22: "and brute force becomes illegal in your brain."
 *
 * Visuals:
 *  Layer 1: Grid of application cards popping in with icons
 *  Layer 2: Word-by-word text
 *  Layer 3: "Brute force" badge getting crossed out / shattered
 *  Camera: Slow survey pan across the cards
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, ACCENT_LIGHT, DANGER, SUCCESS } from '../helpers/timing';
import {
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
} from '../helpers/animations';

const PatternEverywhere: React.FC = () => {
    const frame = useCurrentFrame();
    const { L19, L20, L21, L22 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 30, scale: 1.0 },
        { frame: 60, x: -10, y: 0, scale: 1.02 },
        { frame: 150, x: 10, y: -20, scale: 1.03 },
        { frame: 230, x: 0, y: -10, scale: 1.05 },
        { frame: 290, x: 0, y: 0, scale: 1.0 },
    ], 2);

    // Application cards
    const cards = [
        { label: 'Pair Sum', icon: '➕', delay: L20.start + 5, color: ACCENT },
        { label: 'Triplets', icon: '🔺', delay: L20.start + 20, color: '#8B5CF6' },
        { label: 'Remove\nDuplicates', icon: '🧹', delay: L20.start + 35, color: '#F59E0B' },
        { label: 'Reverse\nArrays', icon: '🔄', delay: L21.start + 5, color: '#EC4899' },
        { label: 'Palindrome\nChecks', icon: '🪞', delay: L21.start + 20, color: SUCCESS },
        { label: 'Container\nWith Water', icon: '💧', delay: L21.start + 40, color: '#06B6D4' },
    ];

    // L19
    const l19Words = wordByWord('This pattern shows up everywhere.', frame, L19.start + 3, 3);
    // L20
    const l20Words = wordByWord('Pair sum, triplets, remove duplicates,', frame, L20.start + 3, 3);
    // L21
    const l21Words = wordByWord('reverse arrays, palindrome checks, master this,', frame, L21.start + 3, 3);
    // L22
    const l22Words = wordByWord('and brute force becomes illegal in your brain.', frame, L22.start + 3, 3);

    // Active text selection
    const activeText = frame >= L22.start ? l22Words
        : frame >= L21.start ? l21Words
            : frame >= L20.start ? l20Words
                : l19Words;

    const activeHighlights = frame >= L22.start
        ? ['brute', 'force', 'illegal']
        : frame >= L21.start
            ? ['reverse', 'palindrome', 'master']
                : frame >= L20.start
                    ? ['Pair', 'sum,', 'triplets,', 'duplicates,']
                    : ['everywhere.'];

    const highlightColor = frame >= L22.start ? DANGER : ACCENT_LIGHT;

    // Brute force "illegal" stamp
    const stampDelay = L22.start + 30;
    const stampScale = scaleIn(frame, stampDelay, SP.whip);
    const stampOpacity = fadeIn(frame, stampDelay, 8);
    const stampRotation = -12;

    return (
        <div
            style={{
                width: 1080,
                height: 1920,
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Active text */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 10,
                        maxWidth: 900,
                        marginBottom: 50,
                        padding: '0 40px',
                        minHeight: 70,
                    }}
                >
                    {activeText.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span
                                key={i}
                                style={{
                                    opacity,
                                    color: isKey ? highlightColor : '#CBD5E1',
                                    fontSize: 46,
                                    fontWeight: isKey ? 800 : 600,
                                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                    textShadow: isKey ? `0 0 16px ${highlightColor}40` : 'none',
                                }}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Application cards grid — 3×2 */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 24,
                        maxWidth: 860,
                        padding: '0 40px',
                        marginBottom: 60,
                    }}
                >
                    {cards.map((card, i) => {
                        const s = scaleIn(frame, card.delay, SP.overshoot);
                        const o = fadeIn(frame, card.delay, 10);
                        return (
                            <div
                                key={i}
                                style={{
                                    opacity: o,
                                    transform: `scale(${s})`,
                                    background: `${card.color}10`,
                                    border: `2px solid ${card.color}35`,
                                    borderRadius: 20,
                                    padding: '24px 16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 12,
                                    willChange: 'transform',
                                }}
                            >
                                <span style={{ fontSize: 48 }}>{card.icon}</span>
                                <span
                                    style={{
                                        color: card.color,
                                        fontSize: 26,
                                        fontWeight: 700,
                                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                        textAlign: 'center',
                                        lineHeight: 1.3,
                                        whiteSpace: 'pre-line',
                                    }}
                                >
                                    {card.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* "BRUTE FORCE = ILLEGAL" stamp (appears at L22) */}
                {frame >= L22.start && (
                    <div
                        style={{
                            position: 'relative',
                            opacity: stampOpacity,
                            transform: `scale(${stampScale}) rotate(${stampRotation}deg)`,
                            border: `6px solid ${DANGER}`,
                            borderRadius: 16,
                            padding: '18px 40px',
                            willChange: 'transform',
                        }}
                    >
                        <span
                            style={{
                                color: DANGER,
                                fontSize: 50,
                                fontWeight: 900,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                letterSpacing: 4,
                                textTransform: 'uppercase',
                            }}
                        >
                            BRUTE FORCE = ILLEGAL
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatternEverywhere;
