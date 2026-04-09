/**
 * Scene 16 — The Loop Is What Makes It an Agent
 * "The loop is what makes it an agent."
 * Hero: LOOP word with huge glow, surrounded by rotating elements.
 * Duration: 58 frames (1.93s) — powerful short punchy scene
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene16_LoopIsAgent: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const spin = frame * 1.8;
  const scale = interpolate(frame, [0, 22], [0.6, 1.02], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = 0.7 + Math.sin(frame * 0.18) * 0.3;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Rotating orbits */}
          {[1,2,3].map(i => (
            <circle key={i}
              cx={540} cy={960} r={180 + i * 120}
              fill="none" stroke={COLORS.electric_cyan}
              strokeWidth={i === 2 ? 4 : 2}
              strokeDasharray={i === 2 ? 'none' : '20 12'}
              opacity={enter * (0.12 + i * 0.04)}
              transform={`rotate(${spin * (i % 2 === 0 ? 1 : -1)}, 540, 960)`}
              filter={i === 2 ? 'url(#cyanGlow)' : undefined}/>
          ))}
          {/* Orbiting dots */}
          {[0,1,2,3,4,5].map(i => {
            const rad = ((i * 60 + spin) * Math.PI) / 180;
            return (
              <circle key={i}
                cx={540 + Math.cos(rad) * 280} cy={960 + Math.sin(rad) * 280}
                r={8 + (i % 3) * 4} fill={COLORS.electric_cyan}
                opacity={enter * 0.5} filter="url(#cyanGlow)"/>
            );
          })}
          {/* Center glow */}
          <ellipse cx={540} cy={960} rx={260} ry={200}
            fill={COLORS.electric_cyan}
            opacity={enter * glowPulse * 0.08}
            filter="url(#cyanGlow)"/>
        </svg>

        {/* Big "LOOP" text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: enter,
        }}>
          <div style={{
            fontSize: 260,
            fontWeight: 900,
            color: COLORS.electric_cyan,
            fontFamily: '"Inter", "SF Pro Display", sans-serif',
            letterSpacing: '-0.06em',
            lineHeight: 0.9,
            transform: `scale(${scale})`,
            filter: `drop-shadow(0 0 80px rgba(0,229,255,${glowPulse})) drop-shadow(0 0 40px rgba(0,229,255,0.6))`,
          }}>
            LOOP
          </div>
          <div style={{
            marginTop: 40, fontSize: 44, fontWeight: 700,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.01em',
          }}>
            = <span style={{ color: COLORS.electric_cyan }}>AGENT</span>
          </div>
          <div style={{
            marginTop: 24, fontSize: 30, color: COLORS.light_gray,
            textAlign: 'center', maxWidth: 600,
          }}>
            This is what separates a model from an agent.
          </div>
        </div>

        <CaptionBar text="The loop is what makes it an agent." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
