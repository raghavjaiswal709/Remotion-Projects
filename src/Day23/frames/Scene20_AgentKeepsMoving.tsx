/**
 * Scene 20 — The Agent Keeps Moving
 * "The agent keeps moving."
 * Hero: Agent with spinning loop and motion blur, energy effect.
 * Duration: 38 frames (1.27s) — very short punchy scene
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene20_AgentKeepsMoving: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const spin = frame * 3;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Spinning loop — fast */}
          {[0,1,2].map(i => (
            <circle key={i} cx={540} cy={960} r={200 + i * 80}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={6 - i * 2}
              opacity={enter * (0.7 - i * 0.2)}
              strokeDasharray={`${(2 * Math.PI * (200 + i * 80)) * 0.6} 10000`}
              transform={`rotate(${spin + i * 40}, 540, 960)`}
              filter="url(#cyanGlow)"/>
          ))}
          {/* Center "MOVING" text */}
          <text x={540} y={975} textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={100} fontWeight={900}
            fill={COLORS.electric_cyan}
            letterSpacing="-0.04em"
            filter="url(#cyanGlow)"
            opacity={enter}>
            MOVING
          </text>
          {/* Motion dots */}
          {[0,1,2,3,4,5].map(i => {
            const rad = ((i * 60 + spin * 1.5) * Math.PI) / 180;
            return (
              <circle key={i}
                cx={540 + Math.cos(rad) * 300}
                cy={960 + Math.sin(rad) * 300}
                r={12} fill={COLORS.electric_cyan}
                opacity={enter * 0.6}
                filter="url(#cyanGlow)"/>
            );
          })}
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 200, left: 80, right: 80, textAlign: 'center', opacity: enter }}>
          <div style={{
            fontSize: 72, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The Agent
            <span style={{ color: COLORS.electric_cyan }}> Keeps Moving</span>
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 1400, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.light_gray }}>
            There is no end — until the goal is reached.
          </div>
        </div>

        <CaptionBar text="The agent keeps moving." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
