/**
 * Scene 04 — Today One Level Up
 * "Today, we go one level up."
 * CSV: 13.560s → 15.830s | Duration: 68 frames (2.25s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label and headline spring in with snappy pop
 *   Phase 2 (frames 18–70): Staircase diagram — levels ascending
 *   Phase 3 (frames 56–end): Arrow pointing up, glow pulse on top level
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

export const Scene04_TodayOneLevelUp: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 6);

  // ── Phase 2: Levels build ──────────────────────────────────────────────────
  const level1 = useSpringEntrance(frame, 18);
  const level2 = useSpringEntrance(frame, 28);
  const level3 = useSpringEntrance(frame, 38);
  const arrowUp = useSpringEntrance(frame, 48);

  const arrowPathLen = 200;
  const arrowDash    = usePathDraw(frame, 50, arrowPathLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.08) * 5;
  const pulse    = 1 + Math.sin(frame * 0.1) * 0.018;
  const shimmer  = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.75, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION" y={140} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={276}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.text_muted}>
            TODAY,
          </text>
          <text x={60} y={380}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            WE GO
          </text>
          <text x={60} y={480}
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            ONE LEVEL UP
          </text>
        </g>

        {/* ── ZONE C — Staircase levels diagram ─────────────────────────── */}

        {/* Level 1 — Step (base) */}
        <g opacity={level1.opacity} transform={`translate(0, ${level1.translateY})`}>
          <BentoCard x={200} y={600} w={680} h={120} />
          <rect x={200} y={600} width={6} height={120} rx={3}
            fill={COLORS.text_muted} opacity={0.5} />
          <text x={330} y={668} textAnchor="start"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            LEVEL 1
          </text>
          <text x={490} y={668} textAnchor="start"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white} opacity={0.6}>
            — Step
          </text>
          <text x={330} y={700} textAnchor="start"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            obs → action → obs ...
          </text>
        </g>

        {/* Connector between levels */}
        <g opacity={level2.opacity}>
          <line x1={540} y1={720} x2={540} y2={780}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray="6 4" opacity={0.4} />
        </g>

        {/* Level 2 — Task Decomposition (today) */}
        <g opacity={level2.opacity} transform={`translate(0, ${level2.translateY})`}>
          <BentoCard x={120} y={780} w={840} h={140} accent />
          <rect x={120} y={780} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={260} y={848} textAnchor="start"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            LEVEL 2
          </text>
          <text x={420} y={848} textAnchor="start"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            — Task Decomposition
          </text>
          <text x={260} y={888} textAnchor="start"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            breaking goals into ordered sub-tasks
          </text>
          {/* "TODAY" badge */}
          <rect x={820} y={800} width={120} height={44} rx={12}
            fill={COLORS.accent} opacity={0.2} />
          <text x={880} y={828} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            TODAY
          </text>
        </g>

        {/* Goal / context card */}
        <g opacity={level3.opacity} transform={`translate(0, ${level3.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={160} />
          <text x={540} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            When the goal is
          </text>
          <text x={540} y={1096} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>
            too large for a single step
          </text>
        </g>

        {/* Animated upward arrow (from step → decomposition) */}
        <g opacity={arrowUp.opacity} transform={`translate(0, ${-breathe})`}>
          <path
            d="M 540,1200 L 540,1300 L 540,1380"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowPathLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round"
            opacity={0.7} />
        </g>

        {/* Bottom insight card */}
        <g opacity={arrowUp.opacity} transform={`translate(0, ${arrowUp.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={160} />
          <rect x={60} y={1400} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1468} textAnchor="start"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            A sequence of steps
          </text>
          <text x={100} y={1524} textAnchor="start"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            becomes the solution
          </text>
        </g>

        {/* Floating accent pulse */}
        <g transform={`translate(960, ${breathe + 1580})`} opacity={arrowUp.opacity * shimmer}>
          <circle cx={0} cy={0} r={36}
            fill={COLORS.accent} fillOpacity={0.08}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={36}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.3} />
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
