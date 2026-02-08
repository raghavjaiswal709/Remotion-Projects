/**
 * Scene 8 — MiddleElement (L26-31)
 * "Clean, brilliant." / "Want the middle of a list?"
 * "By the time fast reaches the end, slow is already at the middle."
 * "No counting." / "No extra space." / "No tricks."
 *
 * Linear linked list with slow/fast walking. When fast finishes, slow is at center.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, MIDDLE_LIST, MIDDLE_STEPS, PTR_SLOW, PTR_FAST, ACCENT, SUCCESS } from '../helpers/timing';
import { NODE, SP, camMulti, fadeIn, scaleIn, wordByWord, smoothLerp, pulse, glowShadow } from '../helpers/animations';

const MiddleElement: React.FC = () => {
    const frame = useCurrentFrame();
    const { L26, L27, L28, L29, L30, L31 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 30, y: 10, scale: 1.0 },
        { frame: 100, x: 0, y: -10, scale: 1.03 },
        { frame: 300, x: -20, y: -15, scale: 1.05 },
        { frame: 496, x: 0, y: 0, scale: 1.02 },
    ], 2);

    // Active text lines
    const l26Words = wordByWord('Clean, brilliant.', frame, L26.start + 3, 5);
    const l27Words = wordByWord('Want the middle of a list?', frame, L27.start + 3, 4);
    const l28Words = wordByWord('By the time fast reaches the end, slow is already at the middle.', frame, L28.start + 3, 2);
    const l29Words = wordByWord('No counting.', frame, L29.start + 3, 5);
    const l30Words = wordByWord('No extra space.', frame, L30.start + 3, 5);
    const l31Words = wordByWord('No tricks.', frame, L31.start + 3, 5);

    const activeWords = frame >= L31.start ? l31Words
        : frame >= L30.start ? l30Words
        : frame >= L29.start ? l29Words
        : frame >= L28.start ? l28Words
        : frame >= L27.start ? l27Words
        : l26Words;

    const activeHighlights = frame >= L31.start ? ['tricks.']
        : frame >= L30.start ? ['extra', 'space.']
        : frame >= L29.start ? ['counting.']
        : frame >= L28.start ? ['fast', 'end,', 'slow', 'middle.']
        : frame >= L27.start ? ['middle']
        : ['Clean,', 'brilliant.'];

    const activeColor = frame >= L29.start ? SUCCESS : ACCENT;

    // Step animation for middle finding
    const stepFrames = [
        L28.start + 20,
        L28.start + 60,
        L28.start + 100,
        L28.start + 140,
    ];

    let currentStep = 0;
    for (let i = 0; i < stepFrames.length && i < MIDDLE_STEPS.length - 1; i++) {
        if (frame >= stepFrames[i]) currentStep = i + 1;
    }
    if (currentStep >= MIDDLE_STEPS.length) currentStep = MIDDLE_STEPS.length - 1;

    const ms = MIDDLE_STEPS[currentStep];
    const prevMs = currentStep > 0 ? MIDDLE_STEPS[currentStep - 1] : MIDDLE_STEPS[0];
    const moveDur = 25;
    const sf = currentStep > 0 ? stepFrames[currentStep - 1] : 0;

    const slowIdx = currentStep > 0 ? smoothLerp(frame, sf, sf + moveDur, prevMs.slow, ms.slow) : ms.slow;
    const fastIdx = currentStep > 0 ? smoothLerp(frame, sf, sf + moveDur, prevMs.fast, ms.fast) : ms.fast;
    const isDone = ms.done && frame >= sf + moveDur;

    const nodeCount = MIDDLE_LIST.length;
    const nodeSpacing = 100;
    const startX = 40;

    // "No" badges
    const noBadges = [
        { text: 'No counting', delay: L29.start + 10 },
        { text: 'No extra space', delay: L30.start + 10 },
        { text: 'No tricks', delay: L31.start + 10 },
    ];

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 40, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? activeColor : '#94A3B8',
                                fontSize: isKey ? 52 : 44, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Linear linked list */}
                <div style={{ position: 'relative', zIndex: 10, marginBottom: 40 }}>
                    <svg width="960" height="200" viewBox="0 0 960 200">
                        <defs>
                            <marker id="mid-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
                            </marker>
                        </defs>

                        {MIDDLE_LIST.map((val, idx) => {
                            const cx = startX + idx * nodeSpacing + NODE.W / 2;
                            const cy = 80;
                            const delay = 10 + idx * 5;
                            const o = fadeIn(frame, delay, 10);
                            const isSlow = Math.abs(idx - Math.round(slowIdx)) < 0.4 && frame >= L28.start;
                            const isFast = Math.abs(idx - Math.round(fastIdx)) < 0.4 && frame >= L28.start;
                            const isMiddle = isDone && idx === 4;
                            const nodeStroke = isMiddle ? SUCCESS : isSlow ? PTR_SLOW : isFast ? PTR_FAST : '#475569';
                            const nodeFill = isMiddle ? `${SUCCESS}25` : isSlow ? `${PTR_SLOW}18` : isFast ? `${PTR_FAST}18` : '#1E293B';

                            return (
                                <g key={idx}>
                                    {idx < nodeCount - 1 && (
                                        <line x1={cx + NODE.W / 2 + 2} y1={cy} x2={cx + nodeSpacing - NODE.W / 2 - 2} y2={cy}
                                            stroke="#475569" strokeWidth="2" opacity={o} markerEnd="url(#mid-arrow)" />
                                    )}
                                    <circle cx={cx} cy={cy} r={38} fill={nodeFill} stroke={nodeStroke} strokeWidth={NODE.BORDER} opacity={o} />
                                    <text x={cx} y={cy + 8} textAnchor="middle" fill="#F1F5F9" fontSize="26" fontWeight="800" fontFamily="SF Mono, monospace" opacity={o}>
                                        {val}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Pointer labels */}
                        {frame >= L28.start && (
                            <>
                                <g transform={`translate(${startX + Math.round(slowIdx) * nodeSpacing + NODE.W / 2}, 140)`}>
                                    <polygon points="0,-8 -8,6 8,6" fill={isDone ? SUCCESS : PTR_SLOW} />
                                    <text x="0" y="26" textAnchor="middle" fill={isDone ? SUCCESS : PTR_SLOW} fontSize="20" fontWeight="900" fontFamily="SF Mono, monospace">SLOW</text>
                                </g>
                                <g transform={`translate(${startX + Math.min(Math.round(fastIdx), nodeCount - 1) * nodeSpacing + NODE.W / 2}, 140)`}>
                                    <polygon points="0,-8 -8,6 8,6" fill={PTR_FAST} />
                                    <text x="0" y="26" textAnchor="middle" fill={PTR_FAST} fontSize="20" fontWeight="900" fontFamily="SF Mono, monospace">FAST</text>
                                </g>
                            </>
                        )}
                    </svg>
                </div>

                {/* Middle found badge */}
                {isDone && (
                    <div style={{
                        opacity: fadeIn(frame, sf + moveDur, 15),
                        transform: `scale(${scaleIn(frame, sf + moveDur, SP.overshoot) * pulse(frame, 0.98, 1.02, 0.05)})`,
                        background: `${SUCCESS}12`, border: `3px solid ${SUCCESS}40`,
                        borderRadius: 20, padding: '16px 36px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.05),
                        marginBottom: 40, position: 'relative', zIndex: 10,
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M 5 14 L 11 20 L 23 8" stroke={SUCCESS} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ color: SUCCESS, fontSize: 40, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            MIDDLE = {MIDDLE_LIST[4]}
                        </span>
                    </div>
                )}

                {/* No badges */}
                <div style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 10 }}>
                    {noBadges.map((b, i) => {
                        const s = scaleIn(frame, b.delay, SP.punchy);
                        const o = fadeIn(frame, b.delay, 12);
                        return (
                            <div key={i} style={{
                                opacity: o, transform: `scale(${s})`,
                                background: `${SUCCESS}08`, border: `2px solid ${SUCCESS}30`,
                                borderRadius: 14, padding: '14px 22px',
                                display: 'flex', alignItems: 'center', gap: 10, willChange: 'transform',
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke={SUCCESS} strokeWidth="2"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke={SUCCESS} strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span style={{ color: SUCCESS, fontSize: 26, fontWeight: 700, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>{b.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MiddleElement;
