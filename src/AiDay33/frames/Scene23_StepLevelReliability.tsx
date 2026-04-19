/**
 * Scene 23 — Step Level Reliability
 * "Reliability is engineered at the step level. Not the task level."
 * CSV: 72.840s → 77.340s
 * Duration: 135 frames (4.5s)
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene23_StepLevelReliability: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const headEnt2 = useSpringEntrance(frame, 14);
  const stepCard = useSpringEntrance(frame, 24);
  const taskCard = useSpringEntrance(frame, 40);
  const summaryCard = useSpringEntrance(frame, 60);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RELIABILITY · SCOPE" y={160} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Reliability
          </text>
        </g>
        <g transform={`translate(0, ${headEnt2.translateY})`} opacity={headEnt2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            Engineered at the
          </text>
          <text x={60} y={470} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            step level
          </text>
        </g>

        {/* Two-column comparison */}
        {/* Step Level — accent ✓ */}
        <g opacity={stepCard.opacity} transform={`translate(0, ${stepCard.translateY})`}>
          <BentoCard x={60} y={540} w={460} h={400} accent />
          <text x={290} y={600} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            STEP LEVEL
          </text>
          {/* Checkmark */}
          <circle cx={290} cy={720} r={60} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '290px 720px' }} />
          <path d="M 266,720 L 282,740 L 318,700" fill="none" stroke={COLORS.accent}
            strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <text x={290} y={830} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Auditable
          </text>
          <text x={290} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Measurable
          </text>
          <text x={290} y={910} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Retriable
          </text>
        </g>

        {/* Task Level — X */}
        <g opacity={taskCard.opacity} transform={`translate(0, ${taskCard.translateY})`}>
          <BentoCard x={560} y={540} w={460} h={400} />
          <text x={790} y={600} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            TASK LEVEL
          </text>
          <circle cx={790} cy={720} r={60} fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={3} />
          <line x1={766} y1={696} x2={814} y2={744} stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round" />
          <line x1={814} y1={696} x2={766} y2={744} stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round" />
          <text x={790} y={830} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Too coarse
          </text>
          <text x={790} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Black box
          </text>
          <text x={790} y={910} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            All-or-nothing
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY + breathe})`}>
          <BentoCard x={60} y={1000} w={960} h={140} accent />
          <rect x={60} y={1000} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1085} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Steps are the <tspan fill={COLORS.accent} fontStyle="italic">unit of reliability</tspan>
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
