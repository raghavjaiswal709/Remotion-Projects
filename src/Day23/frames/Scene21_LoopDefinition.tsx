/**
 * Scene 21 — Loop Is Not a Feature, It's the Definition
 * "The loop is not a feature. It is the definition."
 * Hero: Dictionary definition card, then LOOP with definition highlighted.
 * Duration: 88 frames (2.93s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene21_LoopDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const defEnter = interpolate(frame, [30, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
          {/* Decorative underline accent */}
          <line x1={80} y1={320} x2={1000} y2={320}
            stroke={COLORS.electric_cyan} strokeWidth={4} opacity={enter * 0.3}/>
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 100, left: 80, right: 80, opacity: enter }}>
          <div style={{
            fontSize: 66, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Not a Feature.
            <br/>
            <span style={{ color: COLORS.electric_cyan }}>The Definition.</span>
          </div>
        </div>

        {/* Dictionary card */}
        <div style={{
          position: 'absolute', top: 380, left: 80, right: 80,
          background: '#FFFEF4',
          borderRadius: 20,
          border: '2px solid #D0C8A0',
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          padding: '44px 48px',
          opacity: defEnter,
        }}>
          {/* Word */}
          <div style={{
            fontSize: 72, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            borderBottom: `3px solid ${COLORS.electric_cyan}`,
            paddingBottom: 16, marginBottom: 20,
            display: 'inline-flex', alignItems: 'baseline', gap: 24,
          }}>
            agent
            <span style={{ fontSize: 28, color: COLORS.light_gray, fontWeight: 400, fontStyle: 'italic' }}>
              /ˈeɪdʒ(ə)nt/ · noun
            </span>
          </div>
          {/* Definition 1 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 24, color: COLORS.light_gray, marginBottom: 8, fontWeight: 600 }}>
              1. general
            </div>
            <div style={{ fontSize: 30, color: '#404050', lineHeight: 1.6 }}>
              A person or thing that takes action on behalf of another.
            </div>
          </div>
          {/* Definition 2 — highlighted */}
          <div style={{
            padding: '24px 28px',
            background: 'rgba(0,229,255,0.07)',
            borderLeft: `6px solid ${COLORS.electric_cyan}`,
            borderRadius: '0 12px 12px 0',
          }}>
            <div style={{ fontSize: 24, color: COLORS.electric_cyan, marginBottom: 8, fontWeight: 700 }}>
              2. AI / computing
            </div>
            <div style={{ fontSize: 30, color: '#304050', lineHeight: 1.6 }}>
              A system that <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>perceives</span> its environment,
              <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}> acts</span> upon it,
              and <span style={{ color: COLORS.electric_cyan, fontWeight: 700 }}>loops</span> — repeatedly adapting
              until a goal is reached.
            </div>
          </div>
        </div>

        {/* Key insight row */}
        <div style={{
          position: 'absolute', top: 1160, left: 80, right: 80,
          display: 'flex', gap: 20,
          opacity: interpolate(frame, [55, 82], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {[
            { label: 'Feature', color: '#EF4444', cross: true },
            { label: '→', color: '#8090A0', cross: false },
            { label: 'Definition', color: '#00E5FF', cross: false },
          ].map((t, i) => (
            <div key={i} style={{
              flex: t.label === '→' ? 0 : 1,
              textAlign: 'center',
              padding: t.label === '→' ? '0 8px' : '24px',
              background: t.label === '→' ? 'transparent' : t.cross ? 'rgba(239,68,68,0.07)' : 'rgba(0,229,255,0.07)',
              borderRadius: 14,
              border: t.label === '→' ? 'none' : `2px solid ${t.color}30`,
            }}>
              <div style={{
                fontSize: t.label === '→' ? 44 : 36,
                fontWeight: 900, color: t.color,
                textDecoration: t.cross ? 'line-through' : 'none',
                textDecorationColor: '#EF4444',
              }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          position: 'absolute', top: 1380, left: 80, right: 80,
          opacity: interpolate(frame, [65, 84], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.06)',
          border: '2px solid rgba(0,229,255,0.2)',
          borderRadius: 16, padding: '24px 36px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.electric_cyan }}>
            Remove the loop — and you no longer have an agent.
          </div>
        </div>

        <CaptionBar
          text="The loop is not a feature. It is the definition."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
