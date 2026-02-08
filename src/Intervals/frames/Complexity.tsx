/**
 * Scene 8 — Complexity (L26-28)
 * "This turns your solution into O of N log N for sorting"
 * "and O of N for the scan."
 * "Interview clean, logic clean."
 *
 * Big-O badges materialize, stacking sort + scan.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LINE_TIMING, ACCENT, SUCCESS, WARN } from '../helpers/timing';
import { SP, camMulti, fadeIn, scaleIn, wordByWord, pulse, glowShadow } from '../helpers/animations';

const Complexity: React.FC = () => {
    const frame = useCurrentFrame();
    const { L26, L27, L28 } = LINE_TIMING;

    const cam = camMulti(frame, [
        { frame: 0, x: 0, y: 10, scale: 1.0 },
        { frame: 120, x: 0, y: -10, scale: 1.04 },
        { frame: 300, x: 0, y: 0, scale: 1.02 },
        { frame: 389, x: 0, y: 0, scale: 1.0 },
    ], 2);

    const l26Words = wordByWord('This turns your solution into O of N log N for sorting', frame, L26.start + 3, 2);
    const l27Words = wordByWord('and O of N for the scan.', frame, L27.start + 3, 3);
    const l28Words = wordByWord('Interview clean, logic clean.', frame, L28.start + 3, 4);

    const activeWords = frame >= L28.start ? l28Words
        : frame >= L27.start ? l27Words
        : l26Words;

    const activeHighlights = frame >= L28.start ? ['Interview', 'clean,', 'logic', 'clean.']
        : frame >= L27.start ? ['O', 'N', 'scan.']
        : ['O', 'N', 'log', 'sorting'];

    const activeColor = frame >= L28.start ? SUCCESS : ACCENT;

    const sortDelay = L26.start + 40;
    const scanDelay = L27.start + 20;
    const cleanDelay = L28.start + 20;

    return (
        <div style={{ width: 1080, height: 1920, background: '#000000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ ...cam, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Active text */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 900, marginBottom: 50, padding: '0 40px', position: 'relative', zIndex: 10, minHeight: 70 }}>
                    {activeWords.map(({ word, opacity }, i) => {
                        const isKey = activeHighlights.includes(word);
                        return (
                            <span key={i} style={{
                                opacity, color: isKey ? activeColor : '#CBD5E1',
                                fontSize: isKey ? 66 : 56, fontWeight: isKey ? 900 : 600,
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                            }}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* Complexity badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {/* Sort: O(N log N) */}
                    <div style={{
                        opacity: fadeIn(frame, sortDelay, 15),
                        transform: `scale(${scaleIn(frame, sortDelay, SP.overshoot)})`,
                        background: `${WARN}10`, border: `4px solid ${WARN}50`,
                        borderRadius: 28, padding: '36px 60px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                        willChange: 'transform', boxShadow: glowShadow(frame, WARN, 0.04),
                    }}>
                        <span style={{ color: '#CBD5E1', fontSize: 30, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            Sort
                        </span>
                        <span style={{ color: WARN, fontSize: 68, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                            O(N log N)
                        </span>
                    </div>

                    {/* Plus sign */}
                    <div style={{ opacity: fadeIn(frame, scanDelay - 10, 12) }}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <line x1="18" y1="6" x2="18" y2="30" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                            <line x1="6" y1="18" x2="30" y2="18" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Scan: O(N) */}
                    <div style={{
                        opacity: fadeIn(frame, scanDelay, 15),
                        transform: `scale(${scaleIn(frame, scanDelay, SP.overshoot)})`,
                        background: `${ACCENT}10`, border: `4px solid ${ACCENT}50`,
                        borderRadius: 28, padding: '36px 60px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                        willChange: 'transform', boxShadow: glowShadow(frame, ACCENT, 0.04),
                    }}>
                        <span style={{ color: '#CBD5E1', fontSize: 30, fontWeight: 600, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            Scan
                        </span>
                        <span style={{ color: ACCENT, fontSize: 68, fontWeight: 900, fontFamily: 'SF Mono, monospace' }}>
                            O(N)
                        </span>
                    </div>
                </div>

                {/* Clean badge */}
                {frame >= cleanDelay && (
                    <div style={{
                        marginTop: 50, opacity: fadeIn(frame, cleanDelay, 15),
                        transform: `scale(${scaleIn(frame, cleanDelay, SP.overshoot) * pulse(frame, 0.97, 1.03, 0.05)})`,
                        background: `${SUCCESS}10`, border: `4px solid ${SUCCESS}50`,
                        borderRadius: 24, padding: '20px 50px', willChange: 'transform',
                        boxShadow: glowShadow(frame, SUCCESS, 0.06),
                        position: 'relative', zIndex: 10,
                    }}>
                        <span style={{ color: SUCCESS, fontSize: 48, fontWeight: 900, fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                            INTERVIEW CLEAN
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complexity;
