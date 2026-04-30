/**
 * Scene 20 — Question Underneath
 * "But here is the question underneath all of this."
 * CSV: 71.680s → 74.480s | Duration: 84 frames (2.80s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 20–60): Large "?" icon + question card builds
 *   Phase 3 (frames 58–end): Floating question mark breathe + pulse ring
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 };
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, cfg = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: cfg });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene20_QuestionUnderneath: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const qmarkEnter = useSpringEntrance(frame, 20, fps, SPRING_SOFT);
  const qCard      = useSpringEntrance(frame, 32);
  const hint1      = useSpringEntrance(frame, 44);
  const hint2      = useSpringEntrance(frame, 56);

  const breathe  = Math.sin(frame * 0.05) * 8;
  const pulse    = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · BIG QUESTION" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            But here is the
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            question underneath
          </text>
        </g>

        {/* Giant question mark illustration */}
        <g transform={`translate(540, ${640 + breathe})`}
          opacity={qmarkEnter.opacity * shimmer}>
          {/* Outer glow ring */}
          <circle cx={0} cy={0} r={200}
            fill={COLORS.accent} fillOpacity={0.05 * qmarkEnter.progress}
            transform={`scale(${pulse})`} />
          {/* Accent ring */}
          <circle cx={0} cy={0} r={160}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeOpacity={0.3} />
          <circle cx={0} cy={0} r={160}
            fill={COLORS.bg_secondary} />
          {/* Question mark */}
          <text x={0} y={56} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={qmarkEnter.progress}>
            ?
          </text>
        </g>

        {/* Question teaser cards */}
        <g opacity={hint1.opacity} transform={`translate(0, ${hint1.translateY})`}>
          <rect x={60} y={900} width={960} height={100} rx={18}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={540} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            We can decompose goals into steps...
          </text>
        </g>

        <g opacity={hint2.opacity} transform={`translate(0, ${hint2.translateY})`}>
          <rect x={60} y={1020} width={960} height={100} rx={18}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={1020} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={540} y={1080} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            But is that enough to call it an agent?
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
