/**
 * Scene 05 — What When Goal Too Large
 * "What happens when the goal is too large to fit in a single step?"
 * CSV: 15.830s → 20.060s | Duration: 127 frames (4.25s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label and headline spring in
 *   Phase 2 (frames 20–90): Large goal block with overflow visualization
 *   Phase 3 (frames 80–end): Question mark pulse, single step constraint
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene05_WhatWhenGoalTooLarge: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 6);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const goalBlock   = useSpringEntrance(frame, 18);
  const stepBox     = useSpringEntrance(frame, 30);
  const overflowEl  = useSpringEntrance(frame, 46);
  const questionEl  = useSpringEntrance(frame, 60);

  // Goal overflow path (jagged lines representing "too big")
  const overPathLen = 320;
  const overDash    = usePathDraw(frame, 50, overPathLen, 30);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION" y={140} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.text_muted}>
            WHAT HAPPENS WHEN
          </text>
          <text x={60} y={356}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            THE GOAL IS
          </text>
          <text x={60} y={464}
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            TOO LARGE?
          </text>
        </g>

        {/* ── ZONE C — Visual contrast: large goal vs small step ───────── */}

        {/* Big goal block */}
        <g opacity={goalBlock.opacity} transform={`translate(0, ${goalBlock.translateY})`}>
          <BentoCard x={60} y={530} w={960} h={260} accent />
          <rect x={60} y={530} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={616} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            THE GOAL
          </text>
          <text x={100} y={676} textAnchor="start"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            Comprehensive market analysis
          </text>
          <text x={100} y={728} textAnchor="start"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            + synthesis + recommendations
          </text>
          {/* Size indicator */}
          <rect x={840} y={560} width={140} height={56} rx={12}
            fill={COLORS.accent} opacity={0.15} />
          <text x={910} y={594} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            LARGE
          </text>
        </g>

        {/* VS */}
        <g opacity={stepBox.opacity}>
          <text x={540} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}>
            vs.
          </text>
        </g>

        {/* Single step box */}
        <g opacity={stepBox.opacity} transform={`translate(0, ${stepBox.translateY})`}>
          <BentoCard x={200} y={880} w={680} h={156} />
          <text x={540} y={944} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            A SINGLE STEP
          </text>
          <text x={540} y={996} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            1 obs → 1 action
          </text>
        </g>

        {/* Overflow lines — goal doesn't fit into step */}
        <g opacity={overflowEl.opacity}>
          <path
            d="M 200,1040 L 880,1040 M 220,1060 L 860,1060 M 240,1080 L 840,1080"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={overPathLen} strokeDashoffset={overDash}
            opacity={0.35} strokeLinecap="round" />
          <text x={540} y={1130} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            CANNOT FIT IN ONE STEP
          </text>
        </g>

        {/* Question mark — animated bounce */}
        <g opacity={questionEl.opacity}
          transform={`translate(540, ${breathe + 1260})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.06 * shimmer}>
            ?
          </text>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.white} opacity={0.85 * shimmer}>
            ?
          </text>
        </g>

        {/* Answer hint */}
        <g opacity={questionEl.opacity} transform={`translate(0, ${questionEl.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={100} />
          <text x={540} y={1542} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            The agent must decompose it
          </text>
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
