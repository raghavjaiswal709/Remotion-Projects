/**
 * Scene 02 — Introduction
 * "This is day 23 of learning agentic AI from first principles."
 * Hero: Ultra-detailed AIRobot SVG, principle orbit nodes, glowing headline text.
 * Duration: 138 frames (4.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { AIRobot, PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const ORBIT_NODES = [
  { label: 'DAY 23', angle: -60, dist: 380, color: '#00E5FF' },
  { label: 'AGENTIC AI', angle: 30, dist: 380, color: '#3B82F6' },
  { label: 'FIRST\nPRINCIPLES', angle: 150, dist: 380, color: '#22C55E' },
  { label: 'THE LOOP', angle: 220, dist: 380, color: '#F59E0B' },
];

export const Scene02_Introduction: React.FC = () => {
  const frame = useCurrentFrame();
  const robotEnter = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const orbitSpin = frame * 0.18;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.3}/>

          {/* Circuit background traces */}
          {[0,1,2,3].map(i => (
            <line key={i}
              x1={100 + i * 240} y1={0} x2={80 + i * 240} y2={1920}
              stroke={COLORS.electric_cyan} strokeWidth={0.7} opacity={0.05}/>
          ))}

          {/* Ambient glow behind robot */}
          <ellipse cx={540} cy={900} rx={280} ry={400}
            fill={COLORS.electric_cyan} opacity={0.04}/>

          {/* Orbit ring */}
          <circle cx={540} cy={900} r={380}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="12 8" opacity={0.15 * robotEnter}/>
          <circle cx={540} cy={900} r={360}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={0.8}
            opacity={0.1 * robotEnter}/>

          {/* Orbit nodes */}
          {ORBIT_NODES.map((n, i) => {
            const rad = ((n.angle + orbitSpin + i * 0.2) * Math.PI) / 180;
            const nx = 540 + Math.cos(rad) * n.dist;
            const ny = 900 + Math.sin(rad) * n.dist;
            const nEnter = interpolate(frame, [10 + i * 15, 35 + i * 15], [0, 1], { extrapolateRight: 'clamp' });
            const lines = n.label.split('\n');
            return (
              <g key={i} opacity={nEnter}>
                {/* Connector line */}
                <line x1={540} y1={900} x2={nx} y2={ny}
                  stroke={n.color} strokeWidth={1.5} opacity={0.2}/>
                {/* Node circle */}
                <circle cx={nx} cy={ny} r={52}
                  fill="#F5F0E8" stroke={n.color} strokeWidth={3}
                  filter="url(#shadow)"/>
                <circle cx={nx} cy={ny} r={46}
                  fill="none" stroke={n.color} strokeWidth={1} opacity={0.4}/>
                {/* Node glow */}
                <circle cx={nx} cy={ny} r={52}
                  fill="none" stroke={n.color} strokeWidth={6}
                  opacity={0.15} filter="url(#softGlow)"/>
                {/* Node label */}
                {lines.map((line, li) => (
                  <text key={li} x={nx} y={ny + li * 24 - (lines.length - 1) * 12}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={800}
                    fill={n.color} letterSpacing="-0.01em">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* AIRobot SVG */}
          <AIRobot cx={540} cy={420} scale={robotEnter} opacity={robotEnter}
            coreGlow={0.8} frame={frame} variant="active"/>

          {/* Horizontal rule */}
          <line x1={80} y1={1480} x2={1000} y2={1480}
            stroke={COLORS.electric_cyan} strokeWidth={2}
            strokeDasharray="8 6" opacity={0.25 * titleEnter}/>
        </svg>

        {/* Headline */}
        <div style={{
          position: 'absolute', top: 1500, left: 80, right: 80,
          opacity: titleEnter,
          transform: `translateY(${interpolate(frame, [20, 55], [30, 0], { extrapolateRight: 'clamp' })}px)`,
        }}>
          <div style={{
            fontSize: 54, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}>
            Day 23 · Learning Agentic AI
            <br/>
            <span style={{ color: COLORS.electric_cyan }}>From First Principles</span>
          </div>
        </div>

        {/* Caption */}
        <CaptionBar
          text="This is day 23 of learning agentic AI from first principles."
          opacity={titleEnter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
