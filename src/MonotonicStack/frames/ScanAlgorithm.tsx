/**
 * Scene 5 — ScanAlgorithm (L11-13)
 * L11: "Now pay attention. You scan the array from left to right."
 * L12: "For each element, while the stack breaks the rule you pop."
 * L13: "When the rule is safe, you push that pop moment. That's the answer."
 *
 * Interactive walkthrough: array + stack side by side. 
 * Scan pointer moves, push/pop animations.
 */
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { LINE_TIMING, ACCENT, DANGER, SUCCESS, WARN, DEMO_ARRAY, STACK_STEPS } from '../helpers/timing';
import { camMulti, fadeIn, wordByWord, STACK, ARRAY_BAR, barX } from '../helpers/animations';

const ScanAlgorithm: React.FC = () => {
    const frame = useCurrentFrame();
    const { L11, L12, L13 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 80, x: 0, y: -10, scale: 1.03 },
        { frame: 300, x: 0, y: -5, scale: 1.01 },
        { frame: 536, x: 0, y: 0, scale: 1.0 },
    ], 3);

    const l11Words = wordByWord('Now pay attention. You scan the array from left to right.', frame, L11.start + 3, 3);
    const l12Words = wordByWord('For each element, while the stack breaks the rule you pop.', frame, L12.start + 3, 3);
    const l13Words = wordByWord("When the rule is safe, you push that pop moment. That's the answer.", frame, L13.start + 3, 3);

    const activeWords = frame >= L13.start ? l13Words : frame >= L12.start ? l12Words : l11Words;
    const activeHighlights = frame >= L13.start
        ? ['rule', 'safe,', 'push', 'pop', 'answer.']
        : frame >= L12.start
        ? ['element,', 'breaks', 'rule', 'pop.']
        : ['attention.', 'scan', 'left', 'right.'];

    const activeColor = frame >= L13.start ? SUCCESS : frame >= L12.start ? DANGER : ACCENT;

    /* Calculate current step based on frame progress through the scene */
    const stepProgress = interpolate(frame, [L11.start + 40, L13.end], [0, STACK_STEPS.length - 0.01], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const currentStepIdx = Math.floor(stepProgress);
    const currentStep = STACK_STEPS[Math.min(currentStepIdx, STACK_STEPS.length - 1)];

    /* Scan pointer position */
    const pointerIdx = currentStep.index;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Text */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                    maxWidth: 920, padding: '0 40px', marginBottom: 40, position: 'relative', zIndex: 10, minHeight: 80,
                }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? activeColor : '#CBD5E1',
                                fontSize: isKey ? 64 : 52, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Array visualization */}
                <div style={{ position: 'relative', width: 800, height: 120, marginBottom: 30 }}>
                    {DEMO_ARRAY.map((val, i) => {
                        const x = barX(i, DEMO_ARRAY.length);
                        const isActive = i === pointerIdx;
                        const isPast = i < pointerIdx;
                        const color = isActive ? WARN : isPast ? `${ACCENT}60` : `${ACCENT}30`;
                        const borderColor = isActive ? WARN : isPast ? `${ACCENT}40` : `${ACCENT}20`;

                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                left: x - 540 + 400, top: 20,
                                width: ARRAY_BAR.WIDTH, height: 80,
                                background: `${color}15`,
                                border: `3px solid ${borderColor}`,
                                borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: isActive ? `0 0 20px ${WARN}40` : 'none',
                                transition: 'all 0.15s',
                            }}>
                                <span style={{
                                    color: isActive ? WARN : isPast ? ACCENT : '#64748B',
                                    fontSize: 36, fontWeight: 900, fontFamily: 'SF Mono, monospace',
                                }}>
                                    {val}
                                </span>
                            </div>
                        );
                    })}
                    {/* Scan pointer arrow */}
                    <div style={{
                        position: 'absolute',
                        left: barX(pointerIdx, DEMO_ARRAY.length) - 540 + 400 + ARRAY_BAR.WIDTH / 2 - 12,
                        top: -10,
                        opacity: frame >= L11.start + 30 ? 1 : 0,
                    }}>
                        <svg width="24" height="20" viewBox="0 0 24 20" fill={WARN}>
                            <path d="M12 20 L0 0 L24 0 Z" />
                        </svg>
                    </div>
                </div>

                {/* Stack visualization */}
                <div style={{ position: 'relative', width: 240, height: 380, marginTop: 10 }}>
                    {/* Stack walls */}
                    <svg width="240" height="380" viewBox="0 0 240 380" fill="none" style={{ position: 'absolute', inset: 0 }}>
                        <line x1="30" y1="20" x2="30" y2="360" stroke={`${ACCENT}30`} strokeWidth="4" strokeLinecap="round" />
                        <line x1="210" y1="20" x2="210" y2="360" stroke={`${ACCENT}30`} strokeWidth="4" strokeLinecap="round" />
                        <line x1="30" y1="360" x2="210" y2="360" stroke={`${ACCENT}30`} strokeWidth="4" strokeLinecap="round" />
                    </svg>

                    {/* Stack blocks */}
                    {currentStep.stack.map((val, i) => {
                        const blockY = 360 - (i + 1) * (STACK.BLOCK_H + STACK.GAP) - 4;
                        const isPop = currentStep.popped.includes(val) && currentStep.action === 'pop-push';
                        const blockColor = isPop ? DANGER : ACCENT;

                        return (
                            <div key={`${val}-${i}`} style={{
                                position: 'absolute',
                                left: 40, top: blockY,
                                width: 160, height: STACK.BLOCK_H,
                                background: `${blockColor}20`,
                                border: `3px solid ${blockColor}60`,
                                borderRadius: STACK.RADIUS,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: i === currentStep.stack.length - 1 ? `0 0 15px ${blockColor}30` : 'none',
                            }}>
                                <span style={{ color: blockColor, fontSize: 32, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                    {val}
                                </span>
                            </div>
                        );
                    })}

                    {/* Action label */}
                    <div style={{
                        position: 'absolute', top: -10, left: 0, right: 0,
                        display: 'flex', justifyContent: 'center',
                    }}>
                        <span style={{
                            color: currentStep.action === 'push' ? SUCCESS : currentStep.action === 'pop-push' ? DANGER : ACCENT,
                            fontSize: 22, fontWeight: 700, fontFamily: 'SF Mono, monospace',
                            textTransform: 'uppercase',
                        }}>
                            {currentStep.action === 'push' ? 'PUSH' : currentStep.action === 'pop-push' ? 'POP → PUSH' : ''}
                        </span>
                    </div>
                </div>

                {/* Popped elements indicator */}
                {currentStep.popped.length > 0 && (
                    <div style={{
                        marginTop: 20, display: 'flex', gap: 12, alignItems: 'center',
                        opacity: fadeIn(frame, L12.start, 10),
                    }}>
                        <span style={{ color: DANGER, fontSize: 22, fontWeight: 700, fontFamily: 'SF Mono, monospace' }}>
                            POPPED:
                        </span>
                        {currentStep.popped.map((val, i) => (
                            <div key={i} style={{
                                width: 50, height: 50, borderRadius: 12,
                                background: `${DANGER}15`, border: `2px solid ${DANGER}50`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ color: DANGER, fontSize: 24, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                                    {val}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanAlgorithm;
