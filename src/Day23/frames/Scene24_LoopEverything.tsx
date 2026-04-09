/**
 * Scene 24 — The Loop Is Everything
 * "The loop is everything."
 * Hero: Maximum impact — LOOP = EVERYTHING equation, cyan explosion, all elements glowing.
 * Duration: 47 frames (1.57s) — short punchy climax
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene24_LoopEverything: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const textBoom = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pulse = Math.sin(frame * 0.3) * 0.05 + 1;

  return (
    <AbsoluteFill>
      {/* Black background for maximum drama */}
      <div style={{ position: 'absolute', inset: 0, background: '#040406' }}/>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          {/* Explosion rings */}
          {[1,2,3,4].map(i => {
            const r = interpolate(frame, [i * 3, 40], [0, 400 + i * 80], { extrapolateRight: 'clamp' });
            return (
              <circle key={i} cx={540} cy={960} r={r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={5 - i}
                opacity={enter * (0.5 / i)}
                filter="url(#cyanGlow)"/>
            );
          })}
          {/* Radial lines */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const len = 240 + (i % 3) * 80;
            const start = 200;
            return (
              <line key={i}
                x1={540 + Math.cos(angle) * start}
                y1={960 + Math.sin(angle) * start}
                x2={540 + Math.cos(angle) * (start + len * enter)}
                y2={960 + Math.sin(angle) * (start + len * enter)}
                stroke={COLORS.electric_cyan}
                strokeWidth={2} opacity={0.2}/>
            );
          })}
          {/* "EVERYTHING" large text */}
          <text x={540} y={840}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={130} fontWeight={900}
            fill={COLORS.electric_cyan}
            letterSpacing="-0.05em"
            opacity={textBoom * pulse}
            filter="url(#cyanGlow)">
            LOOP
          </text>
          <text x={540} y={990}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={72} fontWeight={900}
            fill="#F5F0E8"
            letterSpacing="-0.03em"
            opacity={textBoom * 0.95}>
            IS EVERYTHING
          </text>
          {/* Equation: LOOP = INTELLIGENCE */}
          <text x={540} y={1120}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.electric_cyan}
            opacity={interpolate(frame, [28, 44], [0, 1], { extrapolateRight: 'clamp' }) * 0.85}
            letterSpacing="0.05em">
            LOOP · INTELLIGENCE · ACTION
          </text>
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
