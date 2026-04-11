/**
 * Scene 18 — Agent Acts, Watches, Responds
 * "The agent acts, watches, and responds."
 * Layout (no overlaps):
 *   Title               y=60–200
 *   Robot (top-center)  y=210–660  (cy=220, scale=0.55 → antenna≈150, feet≈638)
 *   Separator           y=680
 *   Three action cards  y=720, 970, 1220 (each h≈200)
 *   Caption             y=1700
 * Duration: 78 frames (2.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const AGENT_STEPS = [
  {
    label: 'ACT',     desc: 'Calls the flight API',     color: '#22C55E',
    icon: <svg width={36} height={36} viewBox="0 0 36 36"><polygon points="8,3 28,18 8,33" fill="#22C55E"/></svg>,
  },
  {
    label: 'WATCH',   desc: 'Reads the API response',   color: '#00E5FF',
    icon: <svg width={36} height={36} viewBox="0 0 36 36"><ellipse cx={18} cy={18} rx={15} ry={9} fill="none" stroke="#00E5FF" strokeWidth={2.5}/><circle cx={18} cy={18} r={5} fill="#00E5FF" opacity={0.8}/><circle cx={18} cy={18} r={2.2} fill="#00E5FF"/></svg>,
  },
  {
    label: 'RESPOND', desc: 'Adapts if booking failed', color: '#F59E0B',
    icon: <svg width={36} height={36} viewBox="0 0 36 36"><path d="M 28,9 Q 30,18 22,22 L 14,22 L 19,15" fill="none" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/><polyline points="8,22 14,22 14,29" fill="none" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

export const Scene18_AgentActsWatches: React.FC = () => {
  const frame = useCurrentFrame();
  const enter      = interpolate(frame, [0, 25],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter = interpolate(frame, [6, 42],  [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Robot: cy=220, scale=0.55
  // antenna ≈ 220 - 128*0.55 = 150, feet ≈ 220 + 760*0.55 = 638
  // Title is at y=60-200 → antenna at 150 could visually appear behind title
  // DOM renders above SVG so title text is crisp on top — acceptable
  const ROBOT_CY    = 220;
  const ROBOT_SCALE = 0.55;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* Ambient glow in robot zone */}
          <ellipse cx={540} cy={440} rx={280} ry={240}
            fill={COLORS.electric_cyan} opacity={0.03}/>

          {/* Separator line below robot zone */}
          <line x1={80} y1={680} x2={1000} y2={680}
            stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="5 6" opacity={0.2 * enter}/>

          {/* Agent robot — upper zone */}
          <AIRobot cx={540} cy={ROBOT_CY} scale={robotEnter * ROBOT_SCALE} opacity={robotEnter}
            coreGlow={0.9} frame={frame} variant="active"/>
        </svg>

        {/* Title — DOM layer above SVG */}
        <div style={{
          position: 'absolute', top: 60, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.025em',
            lineHeight: 1.18,
          }}>
            The Agent
            <span style={{ color: COLORS.electric_cyan }}> Acts, Watches,</span>
            <br/>and Responds
          </div>
        </div>

        {/* Three action cards — y=720 / 970 / 1220 */}
        {AGENT_STEPS.map((step, i) => {
          const stepEnter = interpolate(frame, [18 + i * 16, 42 + i * 16], [0, 1], {
            extrapolateRight: 'clamp', easing: ease,
          });
          const slideX = interpolate(frame, [18 + i * 16, 42 + i * 16],
            [i % 2 === 0 ? -44 : 44, 0], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              position: 'absolute',
              top: 720 + i * 250,
              left: 80, right: 80,
              background: 'linear-gradient(135deg, #0C1828 0%, #080F1C 100%)',
              borderRadius: 22,
              border: `2.5px solid ${step.color}40`,
              padding: '28px 38px',
              display: 'flex', alignItems: 'center', gap: 28,
              opacity: stepEnter,
              transform: `translateX(${slideX}px)`,
              boxShadow: `0 10px 40px rgba(0,0,0,0.28), 0 0 0 1px ${step.color}18`,
            }}>
              {/* Icon circle */}
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                background: `${step.color}14`,
                border: `3px solid ${step.color}80`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 28px ${step.color}28`,
              }}>
                {step.icon}
              </div>
              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 42, fontWeight: 900, color: step.color,
                  letterSpacing: '0.02em', fontFamily: '"Inter", sans-serif',
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: 24, color: '#607080',
                  marginTop: 6, fontFamily: '"Inter", sans-serif', lineHeight: 1.4,
                }}>
                  {step.desc}
                </div>
              </div>
              {/* Step number */}
              <div style={{
                fontSize: 64, fontWeight: 900,
                color: `${step.color}30`,
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1,
              }}>
                {i + 1}
              </div>
            </div>
          );
        })}

        <CaptionBar
          text="The agent acts, watches, and responds."
          opacity={enter} y={1700}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
