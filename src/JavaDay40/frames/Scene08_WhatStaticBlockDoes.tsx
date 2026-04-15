/**
 * Scene 08 — What Static Block Does
 * "That is exactly what a static block does."
 * CSV: 42.440s → 45.780s | Duration: 100 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label spring
 *   Phase 2 (12–50): Hero reveal "STATIC BLOCK" + answer card
 *   Phase 3 (40–end): Glow pulse on answer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene08_WhatStaticBlockDoes: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);

  // Hero words
  const w1f = Math.max(0, frame - 8);
  const w1sp = spring({ frame: w1f, fps: FPS, config: SPRING_SNAP });
  const w1ty = interpolate(w1sp, [0, 1], [48, 0]);
  const w1op = interpolate(w1sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const w2f = Math.max(0, frame - 16);
  const w2sp = spring({ frame: w2f, fps: FPS, config: SPRING_SNAP });
  const w2ty = interpolate(w2sp, [0, 1], [48, 0]);
  const w2op = interpolate(w2sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Answer card
  const ansE = useSpringEntrance(frame, 28);

  // Checkmark
  const checkE = useSpringEntrance(frame, 36);

  // Bottom cards
  const card1 = useSpringEntrance(frame, 44);
  const card2 = useSpringEntrance(frame, 56);

  // Ghost text
  const ghostOp = interpolate(frame, [16, 36], [0, 0.06], { extrapolateRight: 'clamp' });

  // Phase 3
  const breathe = Math.sin(frame * 0.07) * 5;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.4} />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="THE ANSWER" y={140} />
        </g>

        {/* Ghost */}
        <text x={540} y={700} textAnchor="middle" fontFamily={FONT} fontSize={180} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOp}>STATIC</text>

        {/* Hero text */}
        <g opacity={w1op} transform={`translate(0, ${w1ty})`}>
          <text x={540} y={580} textAnchor="middle" fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.white}>STATIC</text>
        </g>
        <g opacity={w2op} transform={`translate(0, ${w2ty})`}>
          <text x={540} y={740} textAnchor="middle" fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent}>BLOCK</text>
        </g>

        {/* Answer reveal card */}
        <g opacity={ansE.opacity} transform={`translate(0, ${ansE.translateY})`}>
          <BentoCard x={60} y={820} w={960} h={200} accent />
          <rect x={60} y={820} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Checkmark circle */}
          <g opacity={checkE.opacity}>
            <circle cx={140} cy={920} r={36} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 120,920 L 134,938 L 160,904" fill="none"
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          </g>
          <text x={200} y={900} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            That is exactly what
          </text>
          <text x={200} y={950} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            a static block does.
          </text>
        </g>

        {/* Supporting cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={200} />
          <text x={100} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Runs at
          </text>
          <text x={100} y={1180} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Class Load
          </text>
          <text x={100} y={1224} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Not at object creation
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={200} accent />
          <text x={600} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Executes
          </text>
          <text x={600} y={1180} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Once Only
          </text>
          <text x={600} y={1224} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Automatic, one-time setup
          </text>
        </g>

        {/* Floating glow */}
        <g transform={`translate(540, ${1420 + breathe})`} opacity={shimmer}>
          <circle r={44} fill={COLORS.accent} fillOpacity={0.06} />
          <circle r={44} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
