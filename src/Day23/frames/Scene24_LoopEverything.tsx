/**
 * Scene 24 — The Loop Is Everything
 * "The loop is everything."
 * Maximum impact — LOOP · IS · EVERYTHING, explosion rings, radial rays.
 * Uses BlackBackground so the dark look is actually rendered.
 * Duration: 47 frames (1.57s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { BlackBackground, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene24_LoopEverything: React.FC = () => {
  const frame = useCurrentFrame();
  const enter   = interpolate(frame, [0, 18],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const textBoom= interpolate(frame, [6, 26],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const sub1    = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const sub2    = interpolate(frame, [28, 44], [0, 1], { extrapolateRight: 'clamp' });
  const pulse   = 1 + Math.sin(frame * 0.28) * 0.04;
  const glow    = 0.7 + Math.sin(frame * 0.22) * 0.3;

  return (
    <AbsoluteFill>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>

          {/* Expanding explosion rings */}
          {[1, 2, 3, 4, 5].map(i => {
            const r = interpolate(frame, [i * 2, 44], [0, 380 + i * 90], { extrapolateRight: 'clamp' });
            return (
              <circle key={i} cx={540} cy={960} r={r}
                fill="none"
                stroke={COLORS.electric_cyan}
                strokeWidth={Math.max(1, 5 - i + 0.5)}
                opacity={enter * (0.55 / i)}
                filter={i <= 2 ? 'url(#cyanGlow)' : undefined}/>
            );
          })}

          {/* Radial rays from center */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i * 12 * Math.PI) / 180;
            const startR = 180;
            const endR   = startR + (220 + (i % 4) * 70) * enter;
            return (
              <line key={i}
                x1={540 + Math.cos(angle) * startR}
                y1={960 + Math.sin(angle) * startR}
                x2={540 + Math.cos(angle) * endR}
                y2={960 + Math.sin(angle) * endR}
                stroke={COLORS.electric_cyan}
                strokeWidth={1.5} opacity={0.18 * enter}/>
            );
          })}

          {/* Center ambient glow */}
          <circle cx={540} cy={960} r={170}
            fill={COLORS.electric_cyan} opacity={enter * glow * 0.07}
            filter="url(#cyanGlow)"/>

          {/* LOOP */}
          <text x={540} y={860}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={180} fontWeight={900}
            fill={COLORS.electric_cyan}
            letterSpacing="-0.06em"
            opacity={textBoom * pulse}
            filter="url(#strongCyanGlow)">
            LOOP
          </text>

          {/* IS EVERYTHING */}
          <text x={540} y={1020}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={84} fontWeight={900}
            fill="#F0F4F8"
            letterSpacing="-0.04em"
            opacity={sub1 * 0.95}>
            IS EVERYTHING
          </text>

          {/* Tagline */}
          <text x={540} y={1140}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={34} fontWeight={600}
            fill={COLORS.electric_cyan}
            letterSpacing="0.08em"
            opacity={sub2 * 0.8}>
            LOOP · INTELLIGENCE · ACTION
          </text>
        </svg>
      </BlackBackground>
    </AbsoluteFill>
  );
};
