/**
 * Scene 06 — Task Decomposition Intro
 * "Task decomposition. A large goal,"
 * CSV: 20.060s → 23.100s | Duration: 91 frames (3.05s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22): Label and hero term spring in
 *   Phase 2 (frames 18–70): Definition card, goal node illustration
 *   Phase 3 (frames 65–end): Bloom pulse on goal, breathing arc
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene06_TaskDecompositionIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const heroEnter  = useSpringEntrance(frame, 6);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  const defCard    = useSpringEntrance(frame, 20);
  const goalNode   = useSpringEntrance(frame, 32);
  const arrowsEl   = useSpringEntrance(frame, 45);

  const circleArcLen = 360;
  const circleDash   = usePathDraw(frame, 34, circleArcLen, 28);

  const arrowLen = 120;
  const arr1Dash = usePathDraw(frame, 48, arrowLen, 18);
  const arr2Dash = usePathDraw(frame, 52, arrowLen, 18);
  const arr3Dash = usePathDraw(frame, 56, arrowLen, 18);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 5;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const glow    = interpolate(Math.sin(frame * 0.11), [-1, 1], [0.05, 0.18]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

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
        <g transform={`translate(0, ${heroEnter.translateY})`} opacity={heroEnter.opacity}>
          <text x={60} y={256}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}>
            INTRODUCING
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={108} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Task
          </text>
          <text x={60} y={476}
            fontFamily={FONT} fontSize={108} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Decomposition
          </text>
        </g>

        {/* ── ZONE C — Goal node with radial sub-task arrows ───────────── */}

        {/* Central goal circle */}
        <g transform={`translate(540, ${breathe + 780})`} opacity={goalNode.opacity}>
          {/* Outer glow rings */}
          <circle cx={0} cy={0} r={150}
            fill="none" stroke={COLORS.accent}
            strokeWidth={1} opacity={0.06}
            transform={`scale(${1.25 * pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={150}
            fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={0.12}
            transform={`scale(${1.1 * pulse})`} style={{ transformOrigin: '0px 0px' }} />
          {/* Main circle */}
          <circle cx={0} cy={0} r={148}
            fill={COLORS.bg_primary} stroke={COLORS.accent}
            strokeWidth={2.5}
            strokeDasharray={circleArcLen} strokeDashoffset={circleDash} />
          <text x={0} y={-14} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            LARGE GOAL
          </text>
          <text x={0} y={36} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            Decomposed
          </text>
        </g>

        {/* Radial arrows pointing outward */}
        <g opacity={arrowsEl.opacity}>
          {/* Arrow — up-left */}
          <path d="M 380,660 L 300,560"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arr1Dash}
            markerEnd="url(#arrow)" strokeLinecap="round" opacity={0.7} />

          {/* Arrow — up-right */}
          <path d="M 700,660 L 780,560"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arr2Dash}
            markerEnd="url(#arrow)" strokeLinecap="round" opacity={0.7} />

          {/* Arrow — down */}
          <path d="M 540,940 L 540,1020"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arr3Dash}
            markerEnd="url(#arrow)" strokeLinecap="round" opacity={0.7} />
        </g>

        {/* Sub-task hints */}
        <g opacity={arrowsEl.opacity} transform={`translate(0, ${arrowsEl.translateY})`}>
          <BentoCard x={60} y={480} w={220} h={72} />
          <text x={170} y={524} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>
            sub-task 1
          </text>

          <BentoCard x={800} y={480} w={220} h={72} />
          <text x={910} y={524} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>
            sub-task 2
          </text>

          <BentoCard x={380} y={1040} w={360} h={72} />
          <text x={560} y={1084} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>
            sub-task 3 ...
          </text>
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} />
          <rect x={60} y={1180} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1244} textAnchor="start"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            A large goal
          </text>
          <text x={100} y={1294} textAnchor="start"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            split into achievable sub-tasks
          </text>
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
