/**
 * Scene 14 — Together They Complete the Goal
 * "Together, they complete the original goal."
 * CSV: 52.360s → 54.920s | Duration: 77 frames (2.57s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + headline spring in
 *   Phase 2 (frames 18–60): Sub-task chips stagger + convergence arrows path-draw
 *   Phase 3 (frames 58–end): GOAL circle reveal
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 18) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const STEPS = [
  { label: 'Search', x: 120, y: 620 },
  { label: 'Read',   x: 120, y: 780 },
  { label: 'Analyze', x: 120, y: 940 },
  { label: 'Finalize', x: 120, y: 1100 },
];

export const Scene14_TogetherComplete: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const stepEnters = STEPS.map((s, i) => useSpringEntrance(frame, 18 + i * 12, fps));

  const arrow1Len = 200; const arrow1Dash = usePathDraw(frame, 32, arrow1Len, 18);
  const arrow2Len = 180; const arrow2Dash = usePathDraw(frame, 40, arrow2Len, 18);
  const arrow3Len = 200; const arrow3Dash = usePathDraw(frame, 48, arrow3Len, 18);
  const arrow4Len = 220; const arrow4Dash = usePathDraw(frame, 56, arrow4Len, 18);

  const goalCard = useSpringEntrance(frame, 56);

  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.02;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · COMPLETION" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            Together
          </text>
          <text x={60} y={368}
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            they complete the goal
          </text>
        </g>

        {/* Step chips */}
        {STEPS.map((step, i) => (
          <g key={step.label}
            opacity={stepEnters[i].opacity}
            transform={`translate(0, ${stepEnters[i].translateY})`}>
            <rect x={step.x - 60} y={step.y - 36} width={300} height={72} rx={36}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={step.x + 90} y={step.y + 12} textAnchor="middle"
              fontFamily={FONT} fontSize={38} fontWeight={800}
              fill={COLORS.white}>
              {step.label}
            </text>
          </g>
        ))}

        {/* Convergence arrows to goal */}
        <line x1={348} y1={620} x2={580} y2={870}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash} opacity={0.7} />
        <line x1={348} y1={780} x2={580} y2={890}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash} opacity={0.7} />
        <line x1={348} y1={940} x2={580} y2={930}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={arrow3Len} strokeDashoffset={arrow3Dash} opacity={0.7} />
        <line x1={348} y1={1100} x2={580} y2={970}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={arrow4Len} strokeDashoffset={arrow4Dash} opacity={0.7} />

        {/* GOAL circle */}
        <g opacity={goalCard.opacity}
          transform={`translate(720, ${910 + breathe}) scale(${pulse})`}
          style={{ transformOrigin: '720px 910px' }}>
          <circle cx={0} cy={0} r={160}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={3} />
          <text x={0} y={-18} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            GOAL
          </text>
          <text x={0} y={44} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Complete
          </text>
          <text x={0} y={82} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            EV Market Report
          </text>
        </g>

        {/* Insight card */}
        <g opacity={goalCard.opacity} transform={`translate(0, ${goalCard.translateY})`}>
          <rect x={60} y={1130} width={960} height={90} rx={20}
            fill={COLORS.bg_secondary} strokeWidth={1}
            stroke="rgba(255,255,255,0.1)" />
          <rect x={60} y={1130} width={6} height={90} rx={3} fill={COLORS.accent} />
          <text x={540} y={1183} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            No single step could accomplish this alone
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
