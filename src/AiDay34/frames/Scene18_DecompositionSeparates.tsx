/**
 * Scene 18 — Decomposition Separates
 * "Decomposition is what separates tasks an agent can complete,"
 * CSV: 65.680s → 69.180s | Duration: 105 frames (3.50s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 20–76): Two columns: CAN COMPLETE side builds out
 *   Phase 3 (frames 74–end): Divider line + CAN COMPLETE highlight
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, cfg = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: cfg });
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

const CAN_COMPLETE = [
  'Research reports',
  'Data analysis tasks',
  'Multi-step projects',
];

export const Scene18_DecompositionSeparates: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter   = useSpringEntrance(frame, 0);
  const headEnter    = useSpringEntrance(frame, 5);
  const leftTitle    = useSpringEntrance(frame, 20);
  const canCompletes = CAN_COMPLETE.map((_, i) =>
    useSpringEntrance(frame, 32 + i * 12, fps));
  const dividerLen   = 1300; const dividerDash = usePathDraw(frame, 44, dividerLen, 20);
  const rightTitle   = useSpringEntrance(frame, 72);
  const insightCard  = useSpringEntrance(frame, 84);

  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · SEPARATING" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Decomposition
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={54} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            is the separator
          </text>
        </g>

        {/* Left column — CAN COMPLETE */}
        <g opacity={leftTitle.opacity} transform={`translate(0, ${leftTitle.translateY})`}>
          <rect x={60} y={420} width={450} height={70} rx={14}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={285} y={464} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            CAN COMPLETE
          </text>
        </g>

        {CAN_COMPLETE.map((item, i) => (
          <g key={item}
            opacity={canCompletes[i].opacity}
            transform={`translate(0, ${canCompletes[i].translateY})`}>
            <rect x={60} y={518 + i * 130} width={450} height={100} rx={16}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <rect x={60} y={518 + i * 130} width={6} height={100} rx={3} fill={COLORS.accent} />
            <text x={300} y={578 + i * 130} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.white}>
              {item}
            </text>
          </g>
        ))}

        {/* Vertical divider */}
        <line x1={540} y1={410} x2={540} y2={970}
          stroke="rgba(255,255,255,0.2)" strokeWidth={2}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash} />

        {/* Right column — CAN ONLY ATTEMPT */}
        <g opacity={rightTitle.opacity} transform={`translate(0, ${rightTitle.translateY})`}>
          <rect x={580} y={420} width={450} height={70} rx={14}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          <text x={805} y={464} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.06em">
            CAN ONLY ATTEMPT
          </text>
        </g>

        <g opacity={rightTitle.opacity} transform={`translate(0, ${rightTitle.translateY})`}>
          <rect x={580} y={518} width={450} height={100} rx={16}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={805} y={548} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Tasks too large
          </text>
          <text x={805} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            for one step
          </text>
        </g>

        {/* Insight card */}
        <g opacity={insightCard.opacity}
          transform={`translate(0, ${insightCard.translateY + breathe})`}>
          <rect x={60} y={1020} width={960} height={130} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={1020} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={1076} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Decomposition unlocks solvability
          </text>
          <text x={540} y={1124} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            without it, large goals are out of reach
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
