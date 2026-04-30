/**
 * Scene 10 — Search for Recent Data
 * "Search for recent industry data."
 * CSV: 38.120s → 40.320s | Duration: 66 frames (2.20s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring in
 *   Phase 2 (frames 16–55): Search step card, magnifier SVG, path draw
 *   Phase 3 (frames 50–end): Shimmer / breathe on search icon
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 };
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, config = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress  = spring({ frame: f, fps, config });
  const opacity   = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 22) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene10_SearchRecentData: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 5);
  const stepBadge   = useSpringEntrance(frame, 16, fps, SPRING_SNAP);
  const cardEnter   = useSpringEntrance(frame, 22);
  const searchIcon  = useSpringEntrance(frame, 30);

  const circleLen   = 251; // 2*PI*40
  const circDash    = usePathDraw(frame, 32, circleLen, 24);
  const handleLen   = 50;
  const handleDash  = usePathDraw(frame, 48, handleLen, 14);

  const breathe  = Math.sin(frame * 0.1) * 3;
  const shimmer  = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.88, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · SUB-TASK" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            Sub-task 1
          </text>
          <text x={60} y={368}
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Search
          </text>
        </g>

        {/* Step badge */}
        <g opacity={stepBadge.opacity} transform={`translate(0, ${stepBadge.translateY})`}>
          <BentoCard x={60} y={440} w={200} h={70} accent />
          <text x={160} y={485} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            STEP 1
          </text>
        </g>

        {/* Main card */}
        <g opacity={cardEnter.opacity} transform={`translate(0, ${cardEnter.translateY})`}>
          <BentoCard x={60} y={580} w={960} h={440} />
          <rect x={60} y={580} width={6} height={440} rx={3} fill={COLORS.accent} />

          {/* Description text */}
          <text x={560} y={660}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted} textAnchor="middle">
            OBJECTIVE:
          </text>
          <text x={560} y={724}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white} textAnchor="middle">
            Search for recent
          </text>
          <text x={560} y={786}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} textAnchor="middle" fontStyle="italic">
            industry data
          </text>

          {/* Source tags */}
          <rect x={100} y={840} width={180} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={190} y={872} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            web search
          </text>

          <rect x={300} y={840} width={180} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={390} y={872} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            databases
          </text>

          <rect x={500} y={840} width={190} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={595} y={872} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            news feeds
          </text>
        </g>

        {/* Magnifying glass icon */}
        <g opacity={searchIcon.opacity * shimmer}
          transform={`translate(540, ${1120 + breathe})`}>
          <circle cx={0} cy={-20} r={80}
            fill="none" stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={circleLen} strokeDashoffset={circDash}
            strokeLinecap="round" />
          <line x1={56} y1={36} x2={100} y2={80}
            stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={handleLen} strokeDashoffset={handleDash}
            strokeLinecap="round" />
          <circle cx={0} cy={-20} r={80}
            fill={COLORS.accent} fillOpacity={0.05} />
          <text x={0} y={-4} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} opacity={0.7}>
            ?
          </text>
        </g>

        {/* Insight card */}
        <g opacity={cardEnter.opacity} transform={`translate(0, ${cardEnter.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={110} />
          <text x={540} y={1358} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Goal → first gather raw materials
          </text>
          <text x={540} y={1398} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            every other sub-task depends on this output
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
