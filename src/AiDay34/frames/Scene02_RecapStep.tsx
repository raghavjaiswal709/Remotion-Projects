/**
 * Scene 02 — Recap Step
 * "Last day, we learned what a step is."
 * CSV: 5.400s → 8.040s | Duration: 79 frames (2.6s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Section label slides in, recap badge springs up
 *   Phase 2 (frames 12–55): Agent loop step diagram builds with path-draw
 *   Phase 3 (frames 50–end): Pulse animation on step node
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene02_RecapStep: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const badgeEnter = useSpringEntrance(frame, 6);

  // ── Phase 2: Diagram build ─────────────────────────────────────────────────
  const stepCard   = useSpringEntrance(frame, 14);
  const loopEnter  = useSpringEntrance(frame, 22);
  const obsEnter   = useSpringEntrance(frame, 30);
  const actEnter   = useSpringEntrance(frame, 38);

  const loopArcLen = 340;
  const loopDash   = usePathDraw(frame, 24, loopArcLen, 30);
  const connLen    = 120;
  const connDash   = usePathDraw(frame, 35, connLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const pulse   = 1 + Math.sin(frame * 0.1) * 0.022;
  const breathe = Math.sin(frame * 0.08) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.75, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · MODULE 4 · RECAP" y={140} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEnter.translateY})`} opacity={badgeEnter.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>
            LAST DAY
          </text>
          <text x={60} y={356}
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            we learned: a STEP
          </text>
        </g>

        {/* ── ZONE C — Step anatomy card ─────────────────────────────────── */}
        <g opacity={stepCard.opacity} transform={`translate(0, ${stepCard.translateY})`}>
          <BentoCard x={60} y={420} w={960} h={260} accent />
          {/* Left accent bar */}
          <rect x={60} y={420} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={516}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            STEP DEFINITION:
          </text>
          <text x={100} y={572}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            One complete agent loop
          </text>
          <text x={100} y={620}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            iteration
          </text>
        </g>

        {/* ── Loop diagram ──────────────────────────────────────────────── */}
        <g opacity={loopEnter.opacity} transform={`translate(0, ${loopEnter.translateY})`}>
          {/* Outer loop arc */}
          <path
            d="M 540,740 C 700,740 800,800 800,900 C 800,1000 700,1060 540,1060 C 380,1060 280,1000 280,900 C 280,800 380,740 540,740"
            fill="none" stroke={COLORS.accent}
            strokeWidth={2.5}
            strokeDasharray={loopArcLen} strokeDashoffset={loopDash}
            strokeLinecap="round" opacity={0.7} />
        </g>

        {/* Observation node */}
        <g opacity={obsEnter.opacity} transform={`translate(0, ${obsEnter.translateY})`}>
          <circle cx={400} cy={860} r={68}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={400} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            OBSERVATION
          </text>
          <text x={400} y={880} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>
            IN
          </text>
          {/* Connector lines */}
          <line x1={468} y1={860} x2={540} y2={860}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={connLen} strokeDashoffset={connDash}
            markerEnd="url(#arrow)" />
        </g>

        {/* Action node */}
        <g opacity={actEnter.opacity} transform={`translate(0, ${actEnter.translateY})`}>
          <circle cx={680} cy={860} r={68}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '680px 860px' }} />
          <text x={680} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            ACTION
          </text>
          <text x={680} y={880} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            OUT
          </text>
        </g>

        {/* Center agent label */}
        <g opacity={loopEnter.opacity} transform={`translate(540, ${breathe + 910})`}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} opacity={0.5 * shimmer}>
            AGENT
          </text>
        </g>

        {/* ── Summary card ──────────────────────────────────────────────── */}
        <g opacity={actEnter.opacity} transform={`translate(0, ${actEnter.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={140} />
          <text x={540} y={1140} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>
            1 observation + 1 action = 1 step
          </text>
          <text x={540} y={1190} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Today → what happens at larger scale?
          </text>
        </g>

        {/* ── Bottom supporting label ────────────────────────────────────── */}
        <g opacity={stepCard.opacity}>
          <text x={60} y={1300}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.55}>
            BUILDING ON: Step → Loop → Strategy
          </text>
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
