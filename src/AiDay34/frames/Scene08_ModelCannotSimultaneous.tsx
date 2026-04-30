/**
 * Scene 08 — Model Cannot Simultaneously
 * "The model cannot search, read, analyze, and synthesize simultaneously in a single step."
 * CSV: 27.760s → 34.393s | Duration: 199 frames (6.65s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring in
 *   Phase 2 (frames 20–90): 4 action boxes (search/read/analyze/synthesize) stagger in with X marks
 *   Phase 3 (frames 80–end): Info card, breathe + connector pulse
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
  const translateY = interpolate(progress, [0, 1], [36, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 25) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

const ACTIONS = [
  { label: 'SEARCH',    emoji: 'srch', delay: 24, y: 600 },
  { label: 'READ',      emoji: 'read', delay: 36, y: 820 },
  { label: 'ANALYZE',   emoji: 'anls', delay: 48, y: 1040 },
  { label: 'SYNTHESIZE', emoji: 'synt', delay: 60, y: 1260 },
];

export const Scene08_ModelCannotSimultaneous: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 6);

  // ── Phase 2 — action boxes ───────────────────────────────────────────────
  const actionEnters = ACTIONS.map(a => useSpringEntrance(frame, a.delay, fps, SPRING_SNAP));
  
  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const summaryCard = useSpringEntrance(frame, 80);
  const crossLens   = ACTIONS.map((_, i) => usePathDraw(frame, ACTIONS[i].delay + 16, 68, 14));

  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.09) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · FIRST PRINCIPLES · STEP CONSTRAINT" y={140} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            One Step =
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            One Action Only
          </text>
        </g>

        {/* ── ZONE C — 4 actions left + X marks right ──────────────────── */}
        {ACTIONS.map((action, i) => (
          <g key={action.label}
            opacity={actionEnters[i].opacity}
            transform={`translate(0, ${actionEnters[i].translateY})`}>
            {/* Action card */}
            <BentoCard x={60} y={action.y} w={700} h={160} accent={i === 0} />
            <rect x={60} y={action.y} width={6} height={160} rx={3}
              fill={i === 0 ? COLORS.accent : COLORS.text_muted}
              opacity={i === 0 ? 1 : 0.5} />
            <text x={110} y={action.y + 70}
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.text_muted} letterSpacing="0.08em">
              Step {i + 1}
            </text>
            <text x={110} y={action.y + 122}
              fontFamily={FONT} fontSize={44} fontWeight={800}
              fill={i === 0 ? COLORS.accent : COLORS.white} fontStyle={i === 0 ? 'italic' : 'normal'}>
              {action.label}
            </text>

            {/* "simultaneously?" badge */}
            <BentoCard x={796} y={action.y + 30} w={224} h={100} />
            <path
              d={`M ${796 + 112},${action.y + 46} L ${796 + 56},${action.y + 112} M ${796 + 168},${action.y + 46} L ${796 + 56},${action.y + 112}`}
              fill="none" stroke={COLORS.accent}
              strokeWidth={3.5} strokeLinecap="round"
              strokeDasharray={68} strokeDashoffset={crossLens[i]}
              opacity={0.85} />
          </g>
        ))}

        {/* Vertical brace / cannot arrows */}
        {frame > 55 && (
          <g opacity={interpolate(frame, [56, 70], [0, 1], { extrapolateRight: 'clamp' })}>
            <line x1={790} y1={630} x2={790} y2={1420}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray="8 6" opacity={0.4} />
            <text x={790} y={1510} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent} opacity={0.8}>
              NOT SIMULTANEOUS
            </text>
          </g>
        )}

        {/* Summary insight card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1550} w={960} h={140} />
          <rect x={60} y={1550} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1618} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            The model processes
          </text>
          <text x={540} y={1666} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            one thing at a time — not all four at once
          </text>
        </g>

        {/* Micro-animation floating dot */}
        <g transform={`translate(1000, ${breathe + 1400})`} opacity={summaryCard.opacity}>
          <circle cx={0} cy={0} r={24}
            fill={COLORS.accent} fillOpacity={0.08}
            transform={`scale(${pulse})`} />
          <circle cx={0} cy={0} r={24}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.25} />
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
