/**
 * Scene 09 — Decomposition Breaks Goal
 * "Decomposition breaks that goal into smaller sub tasks."
 * CSV: 34.393s → 38.120s | Duration: 112 frames (3.73s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring in
 *   Phase 2 (frames 18–80): Large goal node splits into 3 sub-task nodes via animated paths
 *   Phase 3 (frames 75–end): Micro-animations — breathe, shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30, config = SPRING_CONFIG) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 28) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene09_DecompositionBreaks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 6);

  // Goal node
  const goalEnter  = useSpringEntrance(frame, 18);
  // Arrow from goal ↓ splits
  const arrowLen1  = 200;
  const arrow1Dash = usePathDraw(frame, 28, arrowLen1, 22);

  // Sub-task nodes (stagger)
  const sub1 = useSpringEntrance(frame, 48, fps, SPRING_SNAP);
  const sub2 = useSpringEntrance(frame, 58, fps, SPRING_SNAP);
  const sub3 = useSpringEntrance(frame, 68, fps, SPRING_SNAP);

  // Connectors to sub tasks
  const conn1Len = 180; const conn1Dash = usePathDraw(frame, 50, conn1Len, 20);
  const conn2Len = 140; const conn2Dash = usePathDraw(frame, 56, conn2Len, 20);
  const conn3Len = 180; const conn3Dash = usePathDraw(frame, 62, conn3Len, 20);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.07) * 5;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.014;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION" y={140} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={266}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Decomposition
          </text>
          <text x={60} y={362}
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent}>
            breaks the goal down
          </text>
        </g>

        {/* ── ZONE C — Goal → sub-task breakdown diagram ───────────────── */}

        {/* Large GOAL node at top */}
        <g opacity={goalEnter.opacity} transform={`translate(0, ${goalEnter.translateY})`}>
          <rect x={290} y={530} width={500} height={110} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={594} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.08em">
            LARGE GOAL
          </text>
          <text x={540} y={630} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Market Research Report
          </text>
        </g>

        {/* Arrow from GOAL down */}
        <line x1={540} y1={640} x2={540} y2={840}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen1} strokeDashoffset={arrow1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Branching text */}
        <text x={560} y={800}
          fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={goalEnter.opacity}>
          BREAKDOWN
        </text>

        {/* Horizontal branch line */}
        {frame > 44 && (
          <g opacity={interpolate(frame, [44, 58], [0, 1], { extrapolateRight: 'clamp' })}>
            <line x1={200} y1={870} x2={880} y2={870}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
          </g>
        )}

        {/* Sub-task 1 — left */}
        <g opacity={sub1.opacity} transform={`translate(0, ${sub1.translateY})`}>
          {/* connector */}
          <line x1={200} y1={870} x2={200} y2={988}
            stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
            strokeLinecap="round" />
          <BentoCard x={60} y={990} w={280} h={130} />
          <text x={200} y={1042} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Sub-task 1
          </text>
          <text x={200} y={1084} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Search
          </text>
        </g>

        {/* Sub-task 2 — center */}
        <g opacity={sub2.opacity} transform={`translate(0, ${sub2.translateY})`}>
          <line x1={540} y1={870} x2={540} y2={988}
            stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
            strokeLinecap="round" />
          <BentoCard x={400} y={990} w={280} h={130} accent />
          <text x={540} y={1042} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Sub-task 2
          </text>
          <text x={540} y={1084} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Analyze
          </text>
        </g>

        {/* Sub-task 3 — right */}
        <g opacity={sub3.opacity} transform={`translate(0, ${sub3.translateY})`}>
          <line x1={880} y1={870} x2={880} y2={988}
            stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray={conn3Len} strokeDashoffset={conn3Dash}
            strokeLinecap="round" />
          <BentoCard x={740} y={990} w={280} h={130} />
          <text x={880} y={1042} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Sub-task 3
          </text>
          <text x={880} y={1084} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            Finalize
          </text>
        </g>

        {/* Converge label */}
        <g opacity={sub3.opacity} transform={`translate(0, ${sub3.translateY})`}>
          <BentoCard x={180} y={1200} w={720} h={120} />
          <rect x={180} y={1200} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={540} y={1266} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Each sub-task
          </text>
          <text x={540} y={1308} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            achievable in one step
          </text>
        </g>

        {/* Breathing accent circle */}
        <g transform={`translate(540, ${1500 + breathe})`}
          opacity={sub3.opacity * shimmer}>
          <circle cx={0} cy={0} r={40}
            fill={COLORS.accent} fillOpacity={0.06}
            transform={`scale(${pulse})`} />
          <circle cx={0} cy={0} r={40}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.2} />
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
