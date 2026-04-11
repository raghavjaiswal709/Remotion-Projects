/**
 * Scene 01 — Day Card
 * "MOON · 45 MINUTES OF SILENCE · HIDDEN WORLD SECRETS"
 * Pure black title card. 90 frames (3s) pre-audio pre-roll.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C } from '../helpers/timing';
import { StarField, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene01_DayCard: React.FC = () => {
  const frame = useCurrentFrame();

  const enter     = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const moonScale = interpolate(frame, [4, 30], [0.6, 1], { extrapolateRight: 'clamp', easing: ease });
  const subSlide  = interpolate(frame, [12, 32], [30, 0], { extrapolateRight: 'clamp', easing: ease });
  const lineW     = interpolate(frame, [16, 36], [0, 640], { extrapolateRight: 'clamp', easing: ease });
  const tagEnter  = interpolate(frame, [24, 44], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const moonOpacity = interpolate(frame, [0, 24], [0, 0.10], { extrapolateRight: 'clamp', easing: ease });

  // Moon orbit ring pulse
  const ringScale = 1 + interpolate(frame, [0, 90], [0, 0.04], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Stars */}
        <StarField opacity={enter * 0.7} />

        {/* Decorative thin orbit rings behind text */}
        <ellipse cx={540} cy={960} rx={420 * ringScale} ry={420 * ringScale}
          fill="none" stroke={C.steel_blue} strokeWidth={0.8} opacity={enter * 0.08} />
        <ellipse cx={540} cy={960} rx={520 * ringScale} ry={520 * ringScale}
          fill="none" stroke={C.teal} strokeWidth={0.6} opacity={enter * 0.05} />

        {/* Large ghost Moon watermark */}
        <circle cx={540} cy={900} r={320}
          fill="none" stroke={C.silver} strokeWidth={1.5}
          opacity={moonOpacity}
          transform={`scale(${moonScale}) translate(${(1 - moonScale) * 540 / moonScale}, 0)`} />

        {/* Title: MOON */}
        <text
          x={540} y={780}
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontSize={210}
          fontWeight={900}
          fill={C.steel_blue}
          letterSpacing="-0.04em"
          opacity={enter}
          transform={`scale(${moonScale}) translate(${(1 - moonScale) * 540 / moonScale}, ${(1 - moonScale) * 780 / moonScale})`}
        >
          MOON
        </text>

        {/* Divider line */}
        <line
          x1={540 - lineW / 2} y1={840}
          x2={540 + lineW / 2} y2={840}
          stroke={C.warm_pink} strokeWidth={2.5} strokeLinecap="round"
          opacity={enter * 0.85}
        />

        {/* Subtitle 1 */}
        <text
          x={540} y={920 + subSlide}
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontSize={40}
          fontWeight={700}
          fill={C.warm_pink}
          letterSpacing="0.18em"
          opacity={tagEnter}
        >
          45 MINUTES OF SILENCE
        </text>

        {/* Subtitle 2 */}
        <text
          x={540} y={980 + subSlide}
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontSize={26}
          fontWeight={400}
          fill={C.slate}
          letterSpacing="0.22em"
          opacity={tagEnter * 0.8}
        >
          HIDDEN WORLD SECRETS
        </text>

        {/* Bottom series label */}
        <text
          x={540} y={1840}
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontSize={24}
          fontWeight={500}
          fill={C.slate}
          letterSpacing="0.3em"
          opacity={tagEnter * 0.5}
        >
          APOLLO 8 · 1968
        </text>

        {/* Corner brackets */}
        <CornerBrackets opacity={enter * 0.35} />

        {/* Dot decorations at bottom */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle
            key={i}
            cx={440 + i * 50} cy={1100}
            r={3}
            fill={i === 2 ? C.warm_pink : C.steel_blue}
            opacity={tagEnter * (i === 2 ? 0.9 : 0.3)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
