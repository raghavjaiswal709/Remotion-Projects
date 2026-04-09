/**
 * Scene 07 — People Treat Them As Interchangeable
 * "Most people treat them as interchangeable. They are not."
 * Hero: Confused equal-sign animation, then big red X.
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

export const Scene07_Interchangeable: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xScale = interpolate(frame, [50, 68], [0.5, 1.05], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
          {/* Confused squiggly equal signs */}
          {xEnter < 0.9 && [0,1,2].map(i => (
            <g key={i} opacity={enter * (1 - xEnter) * (0.15 + i * 0.06)}>
              <text x={280 + i * 140} y={920 + i * 60}
                fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
                fill={COLORS.warm_blue}>≈</text>
            </g>
          ))}
          {/* Glowing red X */}
          {xEnter > 0.2 && (
            <g transform={`translate(540, 960) scale(${xScale}) translate(-540, -960)`}>
              <circle cx={540} cy={960} r={200}
                fill="#EF4444" opacity={xEnter * 0.1} filter="url(#redGlow)"/>
              <line x1={400} y1={820} x2={680} y2={1100}
                stroke="#EF4444" strokeWidth={24} strokeLinecap="round"
                opacity={xEnter} filter="url(#redGlow)"/>
              <line x1={680} y1={820} x2={400} y2={1100}
                stroke="#EF4444" strokeWidth={24} strokeLinecap="round"
                opacity={xEnter} filter="url(#redGlow)"/>
            </g>
          )}
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 120, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The <span style={{ color: COLORS.vibrant_red }}>Common</span> Mistake
          </div>
          <div style={{ marginTop: 12, fontSize: 30, color: COLORS.light_gray }}>
            Most people treat them as interchangeable
          </div>
        </div>

        {/* Misconception cards */}
        {MISCONCEPTIONS.map((m, i) => {
          const mEnter = interpolate(frame, [10 + i*14, 32 + i*14], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              position: 'absolute',
              top: 320 + i * 126,
              left: 80, right: 80,
              background: '#0D1A2E',
              borderRadius: 16,
              border: '1.5px solid rgba(59,130,246,0.2)',
              padding: '22px 32px',
              display: 'flex', alignItems: 'center', gap: 20,
              opacity: mEnter,
              transform: `translateX(${interpolate(frame, [10+i*14, 32+i*14], [-40, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '2px solid rgba(239,68,68,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <line x1={4} y1={4} x2={20} y2={20} stroke="#EF4444" strokeWidth={3} strokeLinecap="round"/>
                  <line x1={20} y1={4} x2={4} y2={20} stroke="#EF4444" strokeWidth={3} strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{
                fontSize: 28, color: '#8090A0',
                fontFamily: '"Courier New", monospace',
              }}>
                {m}
              </div>
            </div>
          );
        })}

        {/* "They are not" callout */}
        <div style={{
          position: 'absolute', top: 880, left: 80, right: 80,
          opacity: xEnter,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 90, fontWeight: 900,
            color: COLORS.vibrant_red,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.04em',
            textShadow: '0 0 40px rgba(239,68,68,0.4)',
          }}>
            THEY ARE NOT.
          </div>
        </div>

        {/* Explanation */}
        <div style={{
          position: 'absolute', top: 1080, left: 80, right: 80,
          opacity: interpolate(frame, [70, 96], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(239,68,68,0.06)',
          border: '2px solid rgba(239,68,68,0.2)',
          borderRadius: 18, padding: '28px 36px',
        }}>
          <div style={{ fontSize: 30, color: COLORS.light_gray, lineHeight: 1.6 }}>
            Using "model" and "agent" interchangeably causes confusion in architecture,
            design, and expectations. The distinction is
            <span style={{ color: COLORS.vibrant_red, fontWeight: 700 }}> fundamental</span>.
          </div>
        </div>

        <CaptionBar
          text="Most people treat them as interchangeable. They are not."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
