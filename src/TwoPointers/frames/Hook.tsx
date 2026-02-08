/**
 * Scene 1 — Hook
 * Lines 1-2: "Still using nested loops? That's an instant interview fail."
 *            "Day 2 of turning you into a logic assassin."
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, DANGER } from '../helpers/timing';
import {
    SP,
    camMulti,
    fadeIn,
    scaleIn,
    wordByWord,
} from '../helpers/animations';

const Hook: React.FC = () => {
    const frame = useCurrentFrame();
    const { L1, L2 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 0, scale: 1.0 },
        { frame: 90, x: -5, y: -10, scale: 1.04 },
        { frame: 170, x: 0, y: -5, scale: 1.02 },
    ], 2);

    const l1Words = wordByWord(
        'Still using nested loops? That\'s an instant interview fail.',
        frame, L1.start + 4, 3,
    );

    const l2Words = wordByWord(
        'Day 2 of turning you into a logic assassin.',
        frame, L2.start + 4, 3,
    );

    const xScale = scaleIn(frame, 10, SP.punchy);
    const xOpacity = fadeIn(frame, 10, 15);
    const gridOpacity = fadeIn(frame, 0, 20);

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            {/* Subtle grid */}
            <div style={{
                position: 'absolute', inset: 0, opacity: gridOpacity * 0.08, zIndex: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Giant X icon — behind text */}
                <div style={{
                    position: 'absolute', top: 420, opacity: xOpacity * 0.12,
                    transform: `scale(${xScale * 3})`, fontSize: 300, color: DANGER,
                    fontWeight: 900, willChange: 'transform', zIndex: 0,
                }}>
                    ✕
                </div>

                {/* L1 text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    gap: 14, maxWidth: 900, marginBottom: 60, padding: '0 40px',
                    position: 'relative', zIndex: 10,
                }}>
                    {l1Words.map(({ word, opacity }, i) => {
                        const isEmphasis = ['nested', 'loops?', 'instant', 'interview', 'fail.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isEmphasis ? DANGER : '#F1F5F9',
                                fontSize: isEmphasis ? 68 : 62, fontWeight: isEmphasis ? 900 : 700,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isEmphasis ? `0 0 30px ${DANGER}60` : '0 2px 8px rgba(0,0,0,0.5)',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L2 text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    gap: 12, maxWidth: 800, padding: '0 40px',
                    position: 'relative', zIndex: 10,
                }}>
                    {l2Words.map(({ word, opacity }, i) => {
                        const isAccent = ['Day', '2', 'logic', 'assassin.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isAccent ? ACCENT : '#94A3B8',
                                fontSize: isAccent ? 56 : 50, fontWeight: isAccent ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Code snippet */}
                <div style={{
                    marginTop: 80, opacity: fadeIn(frame, 25, 15),
                    transform: `scale(${scaleIn(frame, 25, SP.gentle)}) translateY(${(1 - scaleIn(frame, 25, SP.gentle)) * 20}px)`,
                    background: 'rgba(239,68,68,0.08)', border: `2px solid ${DANGER}40`,
                    borderRadius: 20, padding: '28px 48px', willChange: 'transform',
                    position: 'relative', zIndex: 10,
                }}>
                    <pre style={{ fontFamily: 'SF Mono, Menlo, monospace', fontSize: 34, color: '#FCA5A5', margin: 0, lineHeight: 1.6 }}>
{`for i in range(n):
  for j in range(n):
    if arr[i]+arr[j]==target:`}
                    </pre>
                    <div style={{
                        position: 'absolute', top: '50%', left: 20, right: 20, height: 4,
                        background: DANGER, transform: `scaleX(${scaleIn(frame, 55, SP.whip)})`,
                        transformOrigin: 'left', willChange: 'transform',
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Hook;
