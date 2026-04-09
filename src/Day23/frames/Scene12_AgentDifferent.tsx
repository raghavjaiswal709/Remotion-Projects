/**
 * Scene 12 — Agent: Different Architecturally
 * "An agent is different at the architectural level."
 * Hero: Dramatic agent architecture diagram — loop circle vs single arrow.
 * Duration: 86 frames (2.87s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, LoopArrow } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene12_AgentDifferent: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const circ = 2 * Math.PI * 280;
  const loopDash = interpolate(frame, [25, 75], [circ, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Background ambient */}
          <ellipse cx={540} cy={900} rx={380} ry={380}
            fill={COLORS.electric_cyan} opacity={0.03}/>

          {/* Loop arc */}
          <LoopArrow cx={540} cy={900} r={280}
            color={COLORS.electric_cyan} strokeWidth={10}
            dashOffset={loopDash} opacity={enter}
            showArrow={loopDash < 40} label="LOOP"/>

          {/* Center label */}
          <text x={540} y={895} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
            fill={COLORS.electric_cyan} letterSpacing="-0.04em"
            opacity={enter} filter="url(#cyanGlow)">
            AGENT
          </text>
          <text x={540} y={950} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500}
            fill={COLORS.cool_silver} opacity={enter * 0.7}>
            Architectural loop
          </text>

          {/* 4 node labels on loop */}
          {[
            { angle: 0, label: 'Input', color: '#3B82F6' },
            { angle: 90, label: 'Act', color: '#22C55E' },
            { angle: 180, label: 'Observe', color: '#F59E0B' },
            { angle: 270, label: 'Adapt', color: '#A78BFA' },
          ].map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const nx = 540 + Math.cos(rad) * 280;
            const ny = 900 + Math.sin(rad) * 280;
            const nEnter = interpolate(frame, [20 + i*12, 46 + i*12], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={nEnter}>
                <circle cx={nx} cy={ny} r={48}
                  fill="#F5F0E8" stroke={n.color} strokeWidth={4}
                  filter="url(#shadow)"/>
                <text x={nx} y={ny + 8} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800}
                  fill={n.color}>{n.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Architecturally
            <span style={{ color: COLORS.electric_cyan }}> Different</span>
          </div>
        </div>

        {/* Key statement */}
        <div style={{
          position: 'absolute', top: 1310, left: 80, right: 80,
          opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.07)',
          border: '2px solid rgba(0,229,255,0.25)',
          borderRadius: 18, padding: '28px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 36, fontWeight: 700, color: COLORS.deep_black, lineHeight: 1.4,
          }}>
            The loop is <span style={{ color: COLORS.electric_cyan }}>not a feature</span>.
            <br/>It is the <span style={{ color: COLORS.electric_cyan }}>architecture itself</span>.
          </div>
        </div>

        <CaptionBar
          text="An agent is different at the architectural level."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
