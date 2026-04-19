/**
 * Scene 28 — Solve It Next
 * "And we solve it next."
 * CSV: 88.300s → 89.160s
 * Duration: 27 frames (0.9s)
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

export const Scene28_SolveItNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const pop = spring({ frame, fps, config: SPRING_SNAP });
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const op = interpolate(pop, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s28.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Center text — Task Decomposition teaser */}
        <g opacity={op} transform={`translate(540, 750) scale(${scale * pulse})`}
          style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT}
            fontSize={56} fontWeight={800} fill={COLORS.text_muted}>
            TOMORROW
          </text>
          <text x={0} y={100} textAnchor="middle" fontFamily={FONT}
            fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Task Decomposition
          </text>
          {/* Arrow */}
          <path d="M -30,140 L 0,170 L 30,140" fill="none"
            stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s28.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
