/**
 * Scene 16 — The Loop Is What Makes It an Agent
 * "The loop is what makes it an agent."
 * Maximum visual impact: LOOP text center-screen with pulsing orbits.
 * Layout: pure center composition — no layout collisions possible.
 * Duration: 58 frames (1.93s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene16_LoopIsAgent: React.FC = () => {
  const frame = useCurrentFrame();
  const enter      = interpolate(frame, [0, 22],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const spin       = frame * 1.6;
  const scale      = interpolate(frame, [0, 20],  [0.62, 1.02], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse  = 0.65 + Math.sin(frame * 0.2) * 0.35;
  const equEnter   = interpolate(frame, [18, 42], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>

          {/* Outer ambient burst */}
          <circle cx={540} cy={960} r={560}
            fill={COLORS.electric_cyan} opacity={enter * 0.025}/>

          {/* Three concentric rotating rings */}
          {[300, 420, 520].map((r, i) => (
            <circle key={i} cx={540} cy={960} r={r}
              fill="none"
              stroke={COLORS.electric_cyan}
              strokeWidth={i === 1 ? 4 : 1.5}
              strokeDasharray={i === 1 ? 'none' : '18 14'}
              opacity={enter * (0.15 + i * 0.04)}
              transform={`rotate(${spin * (i % 2 === 0 ? 1 : -0.7)}, 540, 960)`}
              filter={i === 1 ? 'url(#cyanGlow)' : undefined}/>
          ))}

          {/* Orbiting dots on middle ring */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const rad = ((i * 60 + spin) * Math.PI) / 180;
            const dotR = 7 + (i % 2) * 5;
            return (
              <circle key={i}
                cx={540 + Math.cos(rad) * 420}
                cy={960 + Math.sin(rad) * 420}
                r={dotR}
                fill={COLORS.electric_cyan}
                opacity={enter * (0.4 + (i % 3) * 0.1)}
                filter="url(#cyanGlow)"/>
            );
          })}

          {/* Central glow burst */}
          <ellipse cx={540} cy={960} rx={240} ry={180}
            fill={COLORS.electric_cyan}
            opacity={enter * glowPulse * 0.07}
            filter="url(#strongCyanGlow)"/>
        </svg>

        {/* Main content — absolutely centered */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: enter,
        }}>
          {/* LOOP hero word */}
          <div style={{
            fontSize: 280,
            fontWeight: 900,
            color: COLORS.electric_cyan,
            fontFamily: '"Inter", "SF Pro Display", sans-serif',
            letterSpacing: '-0.07em',
            lineHeight: 0.88,
            transform: `scale(${scale})`,
            filter: `drop-shadow(0 0 80px rgba(0,229,255,${glowPulse})) drop-shadow(0 0 160px rgba(0,229,255,0.35))`,
          }}>
            LOOP
          </div>

          {/* Equation line */}
          <div style={{
            marginTop: 50,
            display: 'flex', alignItems: 'center', gap: 24,
            opacity: equEnter,
          }}>
            <div style={{
              fontSize: 48, fontWeight: 900,
              color: COLORS.deep_black,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.02em',
            }}>
              = <span style={{ color: COLORS.electric_cyan }}>AGENT</span>
            </div>
          </div>

          {/* Subtitle */}
          <div style={{
            marginTop: 28,
            fontSize: 28, fontWeight: 500,
            color: COLORS.light_gray,
            textAlign: 'center', maxWidth: 560,
            opacity: equEnter * 0.8,
            lineHeight: 1.4,
          }}>
            This single property separates a model from an agent.
          </div>
        </div>

        <CaptionBar text="The loop is what makes it an agent." opacity={enter} y={1720}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
