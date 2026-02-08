/**
 * Scene 7 — CycleDetection (L20-25)
 * "Now pay attention." / "If there's a cycle, fast will eventually catch slow."
 * "Why?" / "Because fast is literally chasing slow."
 * "If there's no cycle, fast hits the end." / "Simple."
 *
 * Circular linked list with animated slow/fast pointers.
 * Shows cycle meeting point, then linear case.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, LINKED_LIST_NODES, CYCLE_STEPS, CYCLE_START_IDX, PTR_SLOW, PTR_FAST, ACCENT, SUCCESS, DANGER } from '../helpers/timing';
import { NODE, SP, camMulti, fadeIn, scaleIn, wordByWord, smoothLerp, glowShadow } from '../helpers/animations';

const CycleDetection: React.FC = () => {
    const frame = useCurrentFrame();
    const { L20, L21, L22, L23, L24, L25 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.03 },
        { frame: 300, x: 0, y: -20, scale: 1.06 },
        { frame: 500, x: 0, y: 0, scale: 1.02 },
        { frame: 536, x: 0, y: 0, scale: 1.0 },
    ], 2);

    // Active text - show current narration line
    const l20Words = wordByWord('Now pay attention.', frame, L20.start + 4, 5);
    const l21Words = wordByWord('If there\'s a cycle, fast will eventually catch slow.', frame, L21.start + 4, 3);
    const l22Words = wordByWord('Why?', frame, L22.start + 2, 5);
    const l23Words = wordByWord('Because fast is literally chasing slow.', frame, L23.start + 4, 3);
    const l24Words = wordByWord('If there\'s no cycle, fast hits the end.', frame, L24.start + 4, 3);
    const l25Words = wordByWord('Simple.', frame, L25.start + 4, 5);

    // Pick active text
    const activeWords = frame >= L25.start ? l25Words
        : frame >= L24.start ? l24Words
        : frame >= L23.start ? l23Words
        : frame >= L22.start ? l22Words
        : frame >= L21.start ? l21Words
        : l20Words;

    const activeHighlights = frame >= L25.start ? ['Simple.']
        : frame >= L24.start ? ['no', 'cycle,', 'end.']
        : frame >= L23.start ? ['literally', 'chasing']
        : frame >= L22.start ? ['Why?']
        : frame >= L21.start ? ['cycle,', 'catch', 'slow.']
        : ['attention.'];

    const activeColor = frame >= L24.start ? ACCENT : frame >= L22.start ? SUCCESS : '#F1F5F9';

    // Cycle step animation — distribute steps over cycle detection section
    const stepFrames = [
        L21.start + 20,
        L21.start + 60,
        L21.start + 100,
        L23.start + 20,
        L23.start + 60,
        L23.start + 100,
    ];

    let currentStep = 0;
    for (let i = 0; i < stepFrames.length && i < CYCLE_STEPS.length - 1; i++) {
        if (frame >= stepFrames[i]) currentStep = i + 1;
    }
    if (currentStep >= CYCLE_STEPS.length) currentStep = CYCLE_STEPS.length - 1;

    const step = CYCLE_STEPS[currentStep];
    const prevStep = currentStep > 0 ? CYCLE_STEPS[currentStep - 1] : CYCLE_STEPS[0];
    const moveDur = 25;
    const sf = currentStep > 0 ? stepFrames[currentStep - 1] : 0;

    const slowIdx = currentStep > 0 ? smoothLerp(frame, sf, sf + moveDur, prevStep.slow, step.slow) : step.slow;
    const fastIdx = currentStep > 0 ? smoothLerp(frame, sf, sf + moveDur, prevStep.fast, step.fast) : step.fast;
    const isMeet = step.met && frame >= sf + moveDur;

    // Layout: arrange 8 nodes in a ring
    const nodeCount = 8;
    const ringR = 220;
    const centerX = 440;
    const centerY = 340;

    const getNodePos = (idx: number) => {
        const angle = (idx / nodeCount) * Math.PI * 2 - Math.PI / 2;
        return { x: centerX + Math.cos(angle) * ringR, y: centerY + Math.sin(angle) * ringR };
    };

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            {/* Meet celebration */}
            {isMeet && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: `radial-gradient(ellipse at center, ${SUCCESS}12 0%, transparent 60%)`,
                    opacity: fadeIn(frame, sf + moveDur, 20),
                }} />
            )}

            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 40, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? activeColor : '#94A3B8',
                                fontSize: isKey ? 54 : 46, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                textShadow: isKey ? `0 0 16px ${activeColor}40` : 'none',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Circular linked list */}
                <div style={{ position: 'relative', zIndex: 10, width: 880, height: 700 }}>
                    <svg width="880" height="700" viewBox="0 0 880 700">
                        {/* Cycle arrow from last to cycle start */}
                        <defs>
                            <marker id="fs-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                            </marker>
                        </defs>

                        {/* Connections */}
                        {Array.from({ length: nodeCount }).map((_, idx) => {
                            const from = getNodePos(idx);
                            const toIdx = idx === nodeCount - 1 ? CYCLE_START_IDX : idx + 1;
                            const to = getNodePos(toIdx);
                            const o = fadeIn(frame, 10 + idx * 6, 10);
                            const isCycleEdge = idx === nodeCount - 1;
                            return (
                                <line key={`edge-${idx}`}
                                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                    stroke={isCycleEdge ? DANGER : '#475569'}
                                    strokeWidth={isCycleEdge ? 4 : 3}
                                    strokeDasharray={isCycleEdge ? '8 6' : 'none'}
                                    opacity={o * (isCycleEdge ? 0.6 : 1)}
                                    markerEnd="url(#fs-arrow)"
                                />
                            );
                        })}

                        {/* Nodes */}
                        {Array.from({ length: nodeCount }).map((_, idx) => {
                            const pos = getNodePos(idx);
                            const delay = 10 + idx * 6;
                            const o = fadeIn(frame, delay, 10);
                            const isSlow = Math.abs(idx - Math.round(slowIdx)) < 0.5 && frame >= L21.start;
                            const isFast = Math.abs(idx - Math.round(fastIdx)) < 0.5 && frame >= L21.start;
                            const isCycleNode = idx >= CYCLE_START_IDX;
                            const nodeStroke = isMeet && (isSlow || isFast) ? SUCCESS
                                : isSlow ? PTR_SLOW
                                : isFast ? PTR_FAST
                                : isCycleNode ? '#94A3B8' : '#475569';
                            const nodeFill = isMeet && (isSlow || isFast) ? `${SUCCESS}25`
                                : isSlow ? `${PTR_SLOW}20`
                                : isFast ? `${PTR_FAST}20`
                                : '#1E293B';

                            return (
                                <g key={`node-${idx}`}>
                                    <circle cx={pos.x} cy={pos.y} r={NODE.R} fill={nodeFill} stroke={nodeStroke} strokeWidth={NODE.BORDER} opacity={o} />
                                    <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="#F1F5F9" fontSize="30" fontWeight="800" fontFamily="SF Mono, monospace" opacity={o}>
                                        {LINKED_LIST_NODES[idx]}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Pointer labels */}
                        {frame >= L21.start && (
                            <>
                                <g transform={`translate(${getNodePos(Math.round(slowIdx)).x}, ${getNodePos(Math.round(slowIdx)).y - NODE.R - 16})`}>
                                    <text x="0" y="0" textAnchor="middle" fill={isMeet ? SUCCESS : PTR_SLOW} fontSize="22" fontWeight="900" fontFamily="SF Mono, monospace">
                                        SLOW
                                    </text>
                                </g>
                                <g transform={`translate(${getNodePos(Math.round(fastIdx)).x}, ${getNodePos(Math.round(fastIdx)).y + NODE.R + 28})`}>
                                    <text x="0" y="0" textAnchor="middle" fill={isMeet ? SUCCESS : PTR_FAST} fontSize="22" fontWeight="900" fontFamily="SF Mono, monospace">
                                        FAST
                                    </text>
                                </g>
                            </>
                        )}
                    </svg>
                </div>

                {/* Meet badge */}
                {isMeet && (
                    <div style={{
                        opacity: fadeIn(frame, sf + moveDur, 15),
                        transform: `scale(${scaleIn(frame, sf + moveDur, SP.overshoot)})`,
                        background: `${SUCCESS}15`, border: `3px solid ${SUCCESS}50`,
                        borderRadius: 20, padding: '16px 40px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.06),
                        position: 'relative', zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M 6 16 L 12 22 L 26 8" stroke={SUCCESS} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: SUCCESS, fontSize: 44, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            THEY MEET — CYCLE FOUND!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CycleDetection;
