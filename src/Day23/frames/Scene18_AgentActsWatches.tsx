/**
 * Scene 18 — Agent Acts, Watches, Responds
 * "The agent acts, watches, and responds."
 * Hero: Agent with three-step cycle — ACT / WATCH / RESPOND highlighted in sequence.
 * Duration: 78 frames (2.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const AGENT_STEPS = [
  {
    label: 'ACT', desc: 'Calls the flight API', color: '#22C55E',
    iconSvg: (
      <svg width={32} height={32} viewBox="0 0 32 32">
        <polygon points="8,2 24,16 8,30" fill="#22C55E"/>
      </svg>
    ),
  },
  {
    label: 'WATCH', desc: 'Reads the API response', color: '#00E5FF',
    iconSvg: (
      <svg width={32} height={32} viewBox="0 0 32 32">
        <ellipse cx={16} cy={16} rx={13} ry={8} fill="none" stroke="#00E5FF" strokeWidth={2.5}/>
        <circle cx={16} cy={16} r={4.5} fill="#00E5FF" opacity={0.75}/>
        <circle cx={16} cy={16} r={2} fill="#00E5FF"/>
      </svg>
    ),
  },
  {
    label: 'RESPOND', desc: 'Adjusts if booking failed', color: '#F59E0B',
    iconSvg: (
      <svg width={32} height={32} viewBox="0 0 32 32">
        <path d="M 26,8 Q 28,16 20,20 L 14,20 L 18,14" fill="none" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8,20 14,20 14,26" fill="none" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export const Scene18_AgentActsWatches: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter = interpolate(frame, [8, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Robot */}
          <AIRobot cx={540} cy={200} scale={robotEnter * 0.5} opacity={robotEnter}
            coreGlow={0.9} frame={frame} variant="active"/>
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 80, left: 80, right: 80, textAlign: 'center', opacity: enter }}>
          <div style={{
            fontSize: 60, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The Agent
            <span style={{ color: COLORS.electric_cyan }}> Acts, Watches,</span>
            <br/>and Responds
          </div>
        </div>

        {/* Three-step cards */}
        {AGENT_STEPS.map((step, i) => {
          const stepEnter = interpolate(frame, [20 + i * 18, 44 + i * 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          return (
            <div key={i} style={{
              position: 'absolute', top: 550 + i * 350, left: 80, right: 80,
              background: 'linear-gradient(135deg, #0D1A2E 0%, #0A1220 100%)',
              borderRadius: 22,
              border: `3px solid ${step.color}40`,
              padding: '32px 40px',
              display: 'flex', alignItems: 'center', gap: 28,
              opacity: stepEnter,
              transform: `translateX(${interpolate(frame, [20+i*18, 44+i*18], [i % 2 === 0 ? -50 : 50, 0], { extrapolateRight: 'clamp' })}px)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${step.color}20`,
            }}>
              {/* Step number */}
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: `${step.color}15`,
                border: `4px solid ${step.color}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 24px ${step.color}30`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.iconSvg}</div>
              </div>
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 44, fontWeight: 900, color: step.color,
                  letterSpacing: '0.04em', fontFamily: '"Inter", sans-serif',
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: 26, color: '#6A8090',
                  marginTop: 8, fontFamily: '"Inter", sans-serif',
                }}>
                  {step.desc}
                </div>
              </div>
              {/* i indicator */}
              <div style={{
                fontSize: 36, fontWeight: 900, color: `${step.color}60`,
                fontFamily: '"Inter", sans-serif',
              }}>
                {i + 1}
              </div>
            </div>
          );
        })}

        <CaptionBar
          text="The agent acts, watches, and responds."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
