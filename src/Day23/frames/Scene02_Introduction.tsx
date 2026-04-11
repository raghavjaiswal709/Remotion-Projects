/**
 * Scene 02 — Introduction
 * "This is day 23 of learning agentic AI from first principles."
 * Hero: AI Robot (upper half) + animated orbit concept nodes (lower half).
 * Zero overlap — robot occupies y=100→780, nodes live y=900→1460.
 * Duration: 138 frames (4.6s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { AIRobot, PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Concept nodes live in a tight band below the robot
const ORBIT_NODES = [
  { label: 'DAY 23',          angle: -40,  dist: 300, color: '#00E5FF' },
  { label: 'AGENTIC AI',      angle:  40,  dist: 300, color: '#3B82F6' },
  { label: 'FIRST\nPRINCIPLES', angle: 140, dist: 300, color: '#22C55E' },
  { label: 'THE LOOP',        angle: 220,  dist: 300, color: '#F59E0B' },
];

// Orbit center: below the robot feet (robot cy=100, robot bottom ≈ 100+760=860)
const ORBIT_CX = 540;
const ORBIT_CY = 1180; // nodes will range y=880→1480 which is below the robot

export const Scene02_Introduction: React.FC = () => {
  const frame = useCurrentFrame();
  const robotEnter = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const orbitSpin  = frame * 0.14; // gentle rotation

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.3}/>

          {/* Subtle circuit trace lines — background texture only */}
          {[0, 1, 2, 3].map(i => (
            <line key={i}
              x1={100 + i * 240} y1={0} x2={80 + i * 240} y2={1920}
              stroke={COLORS.electric_cyan} strokeWidth={0.7} opacity={0.04}/>
          ))}

          {/* Ambient glow behind robot (upper area only) */}
          <ellipse cx={540} cy={440} rx={260} ry={340}
            fill={COLORS.electric_cyan} opacity={0.035}/>

          {/* ── Orbit section (lower half, no overlap with robot) ── */}

          {/* Outer orbit ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={300}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="12 8" opacity={0.18 * robotEnter}
            transform={`rotate(${orbitSpin}, ${ORBIT_CX}, ${ORBIT_CY})`}/>
          {/* Inner decorative ring */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={260}
            fill="none" stroke={COLORS.warm_blue} strokeWidth={0.8}
            opacity={0.1 * robotEnter}/>

          {/* Orbit center dot */}
          <circle cx={ORBIT_CX} cy={ORBIT_CY} r={10}
            fill={COLORS.electric_cyan} opacity={0.4 * robotEnter}
            filter="url(#cyanGlow)"/>

          {/* Orbit nodes */}
          {ORBIT_NODES.map((n, i) => {
            const rad = ((n.angle + orbitSpin * (i % 2 === 0 ? 1 : -0.6)) * Math.PI) / 180;
            const nx = ORBIT_CX + Math.cos(rad) * n.dist;
            const ny = ORBIT_CY + Math.sin(rad) * n.dist;
            const nEnter = interpolate(frame, [12 + i * 12, 40 + i * 12], [0, 1], { extrapolateRight: 'clamp' });
            const lines = n.label.split('\n');
            return (
              <g key={i} opacity={nEnter}>
                {/* Connector line */}
                <line x1={ORBIT_CX} y1={ORBIT_CY} x2={nx} y2={ny}
                  stroke={n.color} strokeWidth={1.5} opacity={0.22}/>
                {/* Outer glow halo */}
                <circle cx={nx} cy={ny} r={56}
                  fill={n.color} opacity={0.07} filter="url(#softGlow)"/>
                {/* Node circle */}
                <circle cx={nx} cy={ny} r={50}
                  fill="#F5F0E8" stroke={n.color} strokeWidth={3}
                  filter="url(#shadow)"/>
                {/* Inner ring */}
                <circle cx={nx} cy={ny} r={44}
                  fill="none" stroke={n.color} strokeWidth={1} opacity={0.35}/>
                {/* Node label */}
                {lines.map((line, li) => (
                  <text key={li}
                    x={nx} y={ny + li * 22 - (lines.length - 1) * 11}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800}
                    fill={n.color} letterSpacing="0.01em">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Horizontal separator between robot and orbit section */}
          <line x1={80} y1={880} x2={1000} y2={880}
            stroke={COLORS.electric_cyan} strokeWidth={1.5}
            strokeDasharray="6 5" opacity={0.18 * titleEnter}/>

          {/* AIRobot — scale=0.82 keeps it entirely within y=100→860 */}
          <AIRobot cx={540} cy={100} scale={robotEnter * 0.82} opacity={robotEnter}
            coreGlow={0.85} frame={frame} variant="active"/>
        </svg>

        {/* Series label — below separator, above orbit nodes */}
        <div style={{
          position: 'absolute', top: 900, left: 80, right: 80,
          opacity: titleEnter,
          transform: `translateY(${interpolate(frame, [20, 55], [20, 0], { extrapolateRight: 'clamp' })}px)`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 48, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
          }}>
            Day 23 · Agentic AI
          </div>
          <div style={{
            fontSize: 32, fontWeight: 500, letterSpacing: '0.04em',
            color: COLORS.electric_cyan, marginTop: 8,
          }}>
            FROM FIRST PRINCIPLES
          </div>
        </div>

        <CaptionBar
          text="This is day 23 of learning agentic AI from first principles."
          opacity={titleEnter} y={1720}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
