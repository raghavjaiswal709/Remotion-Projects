/**
 * Scene 6 — AlgorithmDemo (L18-19)
 * "Slow moves one step." / "Fast moves two steps."
 *
 * Linked list with animated slow & fast pointers stepping through nodes.
 * Slow hops 1, fast hops 2 — visual speed difference.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, PTR_SLOW, PTR_FAST } from '../helpers/timing';
import { NODE, camMulti, fadeIn, wordByWord, smoothLerp } from '../helpers/animations';

const AlgorithmDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { L18, L19 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 20, y: 0, scale: 1.0 },
        { frame: 60, x: 0, y: -10, scale: 1.04 },
        { frame: 148, x: -10, y: 0, scale: 1.02 },
    ], 2);

    const l18Words = wordByWord('Slow moves one step.', frame, L18.start + 3, 5);
    const l19Words = wordByWord('Fast moves two steps.', frame, L19.start + 3, 5);

    // Animation: slow pointer steps 0→1, fast pointer steps 0→2
    const stepStart = 30;
    const stepDur = 30;
    const slowPos = smoothLerp(frame, stepStart, stepStart + stepDur, 0, 1);
    const fastPos = smoothLerp(frame, stepStart, stepStart + stepDur, 0, 2);

    // Second step for emphasis
    const step2Start = stepStart + stepDur + 20;
    const slowPos2 = smoothLerp(frame, step2Start, step2Start + stepDur, 1, 2);
    const fastPos2 = smoothLerp(frame, step2Start, step2Start + stepDur, 2, 4);

    const finalSlow = frame >= step2Start ? slowPos2 : slowPos;
    const finalFast = frame >= step2Start ? fastPos2 : fastPos;

    const nodeCount = 7; // show 7 nodes

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* L18 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 800, marginBottom: 30, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l18Words.map(({ word, opacity }, i) => {
                        const isKey = ['one', 'step.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? PTR_SLOW : '#CBD5E1',
                                fontSize: 48, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* L19 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 800, marginBottom: 60, padding: '0 40px', position: 'relative', zIndex: 10 }}>
                    {l19Words.map(({ word, opacity }, i) => {
                        const isKey = ['two', 'steps.'].includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? PTR_FAST : '#94A3B8',
                                fontSize: 48, fontWeight: isKey ? 800 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Linked list with pointers */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <svg width="880" height="200" viewBox="0 0 880 200">
                        {/* Nodes */}
                        {Array.from({ length: nodeCount }).map((_, idx) => {
                            const cx = idx * NODE.STEP + NODE.W / 2 + 40;
                            const cy = 80;
                            const o = fadeIn(frame, 5 + idx * 5, 10);
                            const isSlow = Math.abs(idx - finalSlow) < 0.4;
                            const isFast = Math.abs(idx - finalFast) < 0.4;
                            const nodeColor = isSlow ? PTR_SLOW : isFast ? PTR_FAST : '#475569';
                            const nodeBg = isSlow ? `${PTR_SLOW}20` : isFast ? `${PTR_FAST}20` : '#1E293B';

                            return (
                                <g key={idx}>
                                    {idx < nodeCount - 1 && (
                                        <line x1={cx + NODE.W / 2 + 2} y1={cy} x2={cx + NODE.STEP - NODE.W / 2 - 2} y2={cy}
                                            stroke="#475569" strokeWidth="3" opacity={o} />
                                    )}
                                    <circle cx={cx} cy={cy} r={NODE.R} fill={nodeBg} stroke={nodeColor} strokeWidth={NODE.BORDER} opacity={o} />
                                    <text x={cx} y={cy + 8} textAnchor="middle" fill="#F1F5F9" fontSize="32" fontWeight="800" fontFamily="SF Mono, monospace" opacity={o}>
                                        {idx}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Slow pointer marker */}
                        <g transform={`translate(${finalSlow * NODE.STEP + NODE.W / 2 + 40}, 145)`} opacity={fadeIn(frame, stepStart - 5, 10)}>
                            <polygon points="0,-12 -10,8 10,8" fill={PTR_SLOW} />
                            <text x="0" y="28" textAnchor="middle" fill={PTR_SLOW} fontSize="24" fontWeight="900" fontFamily="SF Mono, monospace">SLOW</text>
                        </g>

                        {/* Fast pointer marker */}
                        <g transform={`translate(${finalFast * NODE.STEP + NODE.W / 2 + 40}, 145)`} opacity={fadeIn(frame, stepStart - 5, 10)}>
                            <polygon points="0,-12 -10,8 10,8" fill={PTR_FAST} />
                            <text x="0" y="28" textAnchor="middle" fill={PTR_FAST} fontSize="24" fontWeight="900" fontFamily="SF Mono, monospace">FAST</text>
                        </g>
                    </svg>
                </div>

                {/* Step counter */}
                <div style={{
                    marginTop: 40, display: 'flex', gap: 60, position: 'relative', zIndex: 10,
                    opacity: fadeIn(frame, stepStart, 15),
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: PTR_SLOW, fontSize: 32, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>SLOW +1</span>
                        <span style={{ color: '#64748B', fontSize: 24, fontWeight: 600 }}>per step</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: PTR_FAST, fontSize: 32, fontWeight: 800, fontFamily: 'SF Mono, monospace' }}>FAST +2</span>
                        <span style={{ color: '#64748B', fontSize: 24, fontWeight: 600 }}>per step</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmDemo;
