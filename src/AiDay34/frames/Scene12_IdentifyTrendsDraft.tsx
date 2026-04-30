/**
 * Scene 12 — Identify Trends, Draft, Review, Finalize
 * "identify trends, draft each section, review, and finalize."
 * CSV: 43.560s → 47.960s | Duration: 132 frames (4.40s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–24):  Label + headline spring in
 *   Phase 2 (frames 18–90): 4 pipeline-style stage cards stagger left to right
 *   Phase 3 (frames 85–end): Connecting animated arrows + shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress  = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity   = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const STAGES = [
  { num: '3', label: 'IDENTIFY', sub: 'Trends', accent: true,  delay: 22, x:  60 },
  { num: '4', label: 'DRAFT',    sub: 'Sections', accent: false, delay: 36, x: 290 },
  { num: '5', label: 'REVIEW',   sub: 'Draft', accent: false, delay: 50, x: 520 },
  { num: '6', label: 'FINALIZE', sub: 'Report', accent: false, delay: 64, x: 750 },
];

export const Scene12_IdentifyTrendsDraft: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 5);
  const stageEnters = STAGES.map(s => useSpringEntrance(frame, s.delay, fps));

  const conn1Len = 56; const conn1Dash = usePathDraw(frame, 42, conn1Len);
  const conn2Len = 56; const conn2Dash = usePathDraw(frame, 56, conn2Len);
  const conn3Len = 56; const conn3Dash = usePathDraw(frame, 70, conn3Len);

  const completeCard = useSpringEntrance(frame, 84);

  const breathe  = Math.sin(frame * 0.06) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · SUB-TASKS 3–6" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={76} fontWeight={800}
            fill={COLORS.white}>
            Remaining Steps
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            completing the report
          </text>
        </g>

        {/* Stage cards */}
        {STAGES.map((stage, i) => (
          <g key={stage.label}
            opacity={stageEnters[i].opacity}
            transform={`translate(0, ${stageEnters[i].translateY})`}>
            <BentoCard x={stage.x} y={450} w={210} h={300} accent={stage.accent} />
            {stage.accent && (
              <rect x={stage.x} y={450} width={6} height={300} rx={3} fill={COLORS.accent} />
            )}
            <text x={stage.x + 105} y={510} textAnchor="middle"
              fontFamily={FONT} fontSize={44} fontWeight={800}
              fill={stage.accent ? COLORS.accent : COLORS.text_muted}
              fontStyle="italic">
              {stage.num}
            </text>
            <text x={stage.x + 105} y={574} textAnchor="middle"
              fontFamily={FONT} fontSize={26} fontWeight={800}
              fill={stage.accent ? COLORS.white : COLORS.text_muted}
              letterSpacing="0.06em">
              {stage.label}
            </text>
            <text x={stage.x + 105} y={618} textAnchor="middle"
              fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={stage.accent ? COLORS.accent : COLORS.white}
              fontStyle={stage.accent ? 'italic' : 'normal'}>
              {stage.sub}
            </text>
          </g>
        ))}

        {/* Connectors */}
        <line x1={272} y1={600} x2={288} y2={600}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash} opacity={0.6} />
        <line x1={502} y1={600} x2={518} y2={600}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash} opacity={0.6} />
        <line x1={732} y1={600} x2={748} y2={600}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={conn3Len} strokeDashoffset={conn3Dash} opacity={0.6} />

        {/* Progress visual */}
        <g opacity={stageEnters[3].opacity} transform={`translate(0, ${stageEnters[3].translateY})`}>
          <BentoCard x={60} y={830} w={960} h={80} />
          <rect x={60} y={830} width={6} height={80} rx={3} fill={COLORS.accent} />
          <text x={540} y={878} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Each step builds on the previous output
          </text>
        </g>

        {/* Complete card */}
        <g opacity={completeCard.opacity} transform={`translate(0, ${completeCard.translateY})`}>
          <BentoCard x={60} y={990} w={960} h={380} />
          <rect x={60} y={990} width={6} height={380} rx={3} fill={COLORS.accent} />

          {/* Report ready */}
          <text x={540} y={1058} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.08em">
            SUB-TASK CHAIN COMPLETE
          </text>

          {/* Document icon mockup */}
          <rect x={340} y={1088} width={400} height={220} rx={12}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={540} y={1164} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Report
          </text>
          <text x={540} y={1224} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Electric Vehicles
          </text>
          <text x={540} y={1268} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Finalized
          </text>
        </g>

        {/* Floating shimmer orb */}
        <g transform={`translate(960, ${breathe + 1480})`}
          opacity={completeCard.opacity * shimmer}>
          <circle cx={0} cy={0} r={30}
            fill={COLORS.accent} fillOpacity={0.08} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
