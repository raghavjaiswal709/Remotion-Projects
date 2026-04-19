/**
 * Scene 12 — Sometimes Hundreds
 * "Sometimes hundreds."
 * CSV: 39.520s → 41.160s
 * Duration: 49 frames (1.6s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–15): Number springs in massive
 *   Phase 2 (frames 10–35): Particle field spawns around number
 *   Phase 3 (frames 25–end): Pulse, shimmer
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// Scatter dots
const DOT_COUNT = 60;
const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
  const angle = (i / DOT_COUNT) * Math.PI * 2 + i * 0.5;
  const radius = 180 + (i % 7) * 40;
  return {
    cx: 540 + Math.cos(angle) * radius,
    cy: 900 + Math.sin(angle) * radius,
    r: 2 + (i % 4),
    delay: 10 + i * 0.4,
  };
});

export const Scene12_SometimesHundreds: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1 — big number
  const numSpring = spring({ frame, fps, config: SPRING_SNAP });
  const numScale = interpolate(numSpring, [0, 1], [0.3, 1]);
  const numOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Counter tick-up
  const counterVal = Math.round(interpolate(frame, [0, 35], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  // Phase 2 — dots
  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.07) * 4;

  const labelEnt = useSpringEntrance(frame, 0);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SCALE · MAGNITUDE" y={160} />
        </g>

        {/* Particle field */}
        {dots.map((d, i) => {
          const dOp = interpolate(frame, [d.delay, d.delay + 8], [0, 0.4], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const driftX = Math.sin(frame * 0.03 + i) * 3;
          const driftY = Math.cos(frame * 0.04 + i * 0.7) * 3;
          return (
            <circle
              key={i}
              cx={d.cx + driftX}
              cy={d.cy + driftY + breathe * 0.3}
              r={d.r}
              fill={COLORS.accent}
              opacity={dOp}
            />
          );
        })}

        {/* Ghost behind number */}
        <text x={540} y={960} textAnchor="middle" fontFamily={FONT}
          fontSize={400} fontWeight={800} fill={COLORS.accent}
          opacity={numOp * 0.06}
          transform={`scale(${numScale * 1.15})`}
          style={{ transformOrigin: '540px 900px' }}>
          {counterVal}+
        </text>

        {/* Main number */}
        <text x={540} y={950} textAnchor="middle" fontFamily={FONT}
          fontSize={320} fontWeight={800} fill={COLORS.white}
          opacity={numOp}
          transform={`scale(${numScale * pulse})`}
          style={{ transformOrigin: '540px 880px' }}>
          {counterVal}+
        </text>

        {/* HUNDREDS label */}
        <text x={540} y={1080} textAnchor="middle" fontFamily={FONT}
          fontSize={56} fontWeight={800} fill={COLORS.accent}
          opacity={numOp} letterSpacing="0.2em">
          HUNDREDS
        </text>

        {/* Subtitle */}
        <text x={540} y={1160} textAnchor="middle" fontFamily={FONT}
          fontSize={36} fontWeight={800} fill={COLORS.text_muted}
          opacity={numOp * 0.7}>
          of individual steps
        </text>

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
