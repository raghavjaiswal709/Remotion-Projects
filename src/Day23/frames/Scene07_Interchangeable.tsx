/**
 * Scene 07 — People Treat Them As Interchangeable
 * "Most people treat them as interchangeable. They are not."
 * Layout (1080×1920):
 *   Title              top=90 → ~260
 *   4 misconception    top=276, 390, 504, 618 (each h=96)
 *   "THEY ARE NOT"     top=760 → ~855
 *   X mark             SVG y=700-1050, center cy=870
 *   Explanation        top=970 → ~1180
 *   "Instead" section  top=1210 → ~1500
 *   Caption            y=1730
 * Duration: 104 frames (3.47s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const MISCONCEPTIONS = [
  '"GPT is an AI agent"',
  '"ChatGPT is doing agentic tasks"',
  '"The model is reasoning autonomously"',
  '"It acts like an agent already"',
];

const INSTEAD_ROWS = [
  { wrong: 'GPT / Claude / Gemini', right: 'LLM Model', rightColor: COLORS.warm_blue },
  { wrong: 'Agent that just responds', right: 'AI Agent', rightColor: COLORS.electric_cyan },
];

export const Scene07_Interchangeable: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xScale = interpolate(frame, [50, 68], [0.5, 1.05], { extrapolateRight: 'clamp', easing: ease });
  const insteadEnter = interpolate(frame, [72, 98], [0, 1], { extrapolateRight: 'clamp' });
  const xGlow = 0.5 + Math.sin(frame * 0.2) * 0.5;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Ambient red glow in X zone */}
          {xEnter > 0.1 && (
            <ellipse cx={540} cy={870} rx={300} ry={200}
              fill="#EF4444" opacity={xEnter * xGlow * 0.06}/>
          )}

          {/* Confused ≈ symbols fading out */}
          {xEnter < 0.85 && [0, 1, 2].map(i => (
            <text key={i}
              x={260 + i * 155} y={895 + i * 55}
              fontFamily="'Inter', sans-serif" fontSize={88} fontWeight={900}
              fill={COLORS.warm_blue}
              opacity={enter * (1 - xEnter * 1.2) * (0.12 + i * 0.05)}>
              ≈
            </text>
          ))}

          {/* Big Red X */}
          {xEnter > 0.2 && (
            <g transform={`translate(540, 870) scale(${xScale}) translate(-540, -870)`}>
              {/* Glow halo */}
              <circle cx={540} cy={870} r={220}
                fill="#EF4444"
                opacity={xEnter * xGlow * 0.09}
                filter="url(#redGlow)"/>
              {/* X strokes */}
              <line x1={390} y1={720} x2={690} y2={1020}
                stroke="#EF4444" strokeWidth={28} strokeLinecap="round"
                opacity={xEnter} filter="url(#redGlow)"/>
              <line x1={690} y1={720} x2={390} y2={1020}
                stroke="#EF4444" strokeWidth={28} strokeLinecap="round"
                opacity={xEnter} filter="url(#redGlow)"/>
            </g>
          )}
        </svg>

        {/* ── Title ── */}
        <div style={{
          position: 'absolute', top: 90, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The <span style={{ color: COLORS.vibrant_red }}>Common</span> Mistake
          </div>
          <div style={{ marginTop: 10, fontSize: 28, color: COLORS.light_gray }}>
            Most people treat them as interchangeable
          </div>
        </div>

        {/* ── Misconception cards ── */}
        {MISCONCEPTIONS.map((m, i) => {
          const mEnter = interpolate(frame, [8 + i * 12, 28 + i * 12], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              position: 'absolute',
              top: 276 + i * 114,
              left: 80, right: 80,
              background: 'linear-gradient(135deg, #0D1020 0%, #080C18 100%)',
              borderRadius: 14,
              border: '1.5px solid rgba(59,130,246,0.18)',
              padding: '20px 28px',
              display: 'flex', alignItems: 'center', gap: 18,
              opacity: mEnter * (1 - xEnter * 0.5),
              transform: `translateX(${interpolate(frame, [8 + i * 12, 28 + i * 12], [-44, 0], { extrapolateRight: 'clamp' })}px)`,
              boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
            }}>
              {/* Crossed badge */}
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '2px solid rgba(239,68,68,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width={22} height={22} viewBox="0 0 22 22">
                  <line x1={4} y1={4} x2={18} y2={18} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round"/>
                  <line x1={18} y1={4} x2={4} y2={18} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{
                fontSize: 26, color: '#8090A0',
                fontFamily: '"Courier New", monospace',
              }}>
                {m}
              </div>
            </div>
          );
        })}

        {/* ── THEY ARE NOT ── top=762 */}
        <div style={{
          position: 'absolute', top: 762, left: 80, right: 80,
          opacity: xEnter, textAlign: 'center', zIndex: 5,
        }}>
          <div style={{
            fontSize: 92, fontWeight: 900,
            color: COLORS.vibrant_red,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.04em',
            textShadow: `0 0 60px rgba(239,68,68,${xGlow * 0.6}), 0 4px 20px rgba(0,0,0,0.4)`,
          }}>
            THEY ARE NOT.
          </div>
        </div>

        {/* ── Explanation ── top=970 */}
        <div style={{
          position: 'absolute', top: 970, left: 80, right: 80,
          opacity: interpolate(frame, [68, 92], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(239,68,68,0.06)',
          border: '2px solid rgba(239,68,68,0.2)',
          borderRadius: 18, padding: '28px 36px',
          zIndex: 5,
        }}>
          <div style={{ fontSize: 28, color: COLORS.light_gray, lineHeight: 1.65 }}>
            Using "model" and "agent" interchangeably causes confusion in architecture,
            design, and expectations. The distinction is
            <span style={{ color: COLORS.vibrant_red, fontWeight: 700 }}> fundamental</span>.
          </div>
        </div>

        {/* ── "Instead, say..." section ── top=1210 */}
        <div style={{
          position: 'absolute', top: 1210, left: 80, right: 80,
          opacity: insteadEnter,
        }}>
          <div style={{
            fontSize: 26, fontWeight: 700, color: COLORS.light_gray,
            fontFamily: '"Inter", sans-serif', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 5, height: 26, borderRadius: 3,
              background: COLORS.electric_cyan,
            }}/>
            What to call them instead:
          </div>

          {INSTEAD_ROWS.map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 16,
              opacity: interpolate(frame, [72 + i * 10, 94 + i * 10], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateX(${interpolate(frame, [72 + i * 10, 94 + i * 10], [-30, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
              <div style={{
                flex: 1, padding: '16px 20px',
                background: 'rgba(239,68,68,0.07)',
                border: '1.5px solid rgba(239,68,68,0.2)',
                borderRadius: 12,
                fontSize: 24, color: '#A07070',
                fontFamily: '"Inter", sans-serif',
                textDecoration: 'line-through',
              }}>
                {row.wrong}
              </div>
              <svg width={28} height={28} viewBox="0 0 28 28">
                <line x1={3} y1={14} x2={19} y2={14} stroke={COLORS.electric_cyan} strokeWidth={2.5} strokeLinecap="round"/>
                <polyline points="12,6 20,14 12,22" fill="none" stroke={COLORS.electric_cyan} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{
                flex: 1, padding: '16px 20px',
                background: 'rgba(0,229,255,0.07)',
                border: `2px solid ${row.rightColor}35`,
                borderRadius: 12,
                fontSize: 24, color: row.rightColor,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 800,
                textAlign: 'center',
              }}>
                {row.right}
              </div>
            </div>
          ))}

          {/* Bottom note */}
          <div style={{
            marginTop: 18,
            padding: '16px 24px',
            background: 'rgba(0,229,255,0.05)',
            border: '1.5px solid rgba(0,229,255,0.18)',
            borderRadius: 12,
            fontSize: 23, color: '#5080A0', lineHeight: 1.5,
            opacity: interpolate(frame, [88, 104], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            Precise language leads to precise architecture.
          </div>
        </div>

        <CaptionBar
          text="Most people treat them as interchangeable. They are not."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
