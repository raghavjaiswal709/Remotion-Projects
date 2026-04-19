/**
 * Scene 27 — Problem Has Name
 * "That problem has a name."
 * CSV: 86.660s → 88.300s
 * Duration: 49 frames (1.63s)
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene27_ProblemHasName: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const textPop = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SNAP });
  const textScale = interpolate(textPop, [0, 1], [0.7, 1]);
  const textOp = interpolate(textPop, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  const pulse = 1 + Math.sin(frame * 0.12) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s27.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="NEXT · PREVIEW" y={160} />
        </g>

        {/* Dramatic center text */}
        <g opacity={textOp} transform={`translate(540, 800) scale(${textScale * pulse})`}
          style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={-60} textAnchor="middle" fontFamily={FONT}
            fontSize={72} fontWeight={800} fill={COLORS.white}>
            That problem
          </text>
          <text x={0} y={40} textAnchor="middle" fontFamily={FONT}
            fontSize={72} fontWeight={800} fill={COLORS.white}>
            has a
          </text>
          <text x={0} y={150} textAnchor="middle" fontFamily={FONT}
            fontSize={96} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            name
          </text>
        </g>

        {/* Accent glow ring */}
        <circle cx={540} cy={800} r={280} fill="none"
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={textOp * 0.15}
          transform={`scale(${pulse})`} style={{ transformOrigin: '540px 800px' }} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s27.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
