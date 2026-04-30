/**
 * Scene 03 — One Iteration Out
 * "One complete iteration of the agent loop, one observation in, one action out."
 * CSV: 8.040s → 13.560s | Duration: 166 frames (5.5s)
 *
 * Theme: Dark #0D0D0D + grid + accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):  Label and headline spring in
 *   Phase 2 (frames 20–90): Full loop anatomy diagram with staggered node reveals
 *   Phase 3 (frames 85–end): Counter animation, breathing loop arc
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene03_OneIterationOut: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 8);

  // ── Phase 2: Diagram build ─────────────────────────────────────────────────
  const mainCard  = useSpringEntrance(frame, 18);
  const obsCard   = useSpringEntrance(frame, 28);
  const actCard   = useSpringEntrance(frame, 40);
  const iterCard  = useSpringEntrance(frame, 52);
  const stepCard  = useSpringEntrance(frame, 64);

  const loopArcLen = 480;
  const loopDash   = usePathDraw(frame, 22, loopArcLen, 40);

  const arrow1Len = 80;
  const arrow1Dash = usePathDraw(frame, 35, arrow1Len, 18);
  const arrow2Len = 80;
  const arrow2Dash = usePathDraw(frame, 48, arrow2Len, 18);

  // Counter: iteration number
  const iterCount = useCounter(frame, 80, 1, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.016;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const glow    = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.08, 0.18]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · MODULE 4 · AGENT LOOP" y={140} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={268}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            ONE COMPLETE
          </text>
          <text x={60} y={356}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            ITERATION
          </text>
        </g>

        {/* ── ZONE C — Loop anatomy ─────────────────────────────────────── */}

        {/* Main loop container */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          <BentoCard x={60} y={420} w={960} h={600} accent />
          <rect x={60} y={420} width={6} height={600} rx={3} fill={COLORS.accent} />

          {/* Loop arc (animated) */}
          <ellipse cx={540} cy={720} rx={280} ry={180}
            fill="none" stroke={COLORS.accent}
            strokeWidth={2.5}
            strokeDasharray={loopArcLen} strokeDashoffset={loopDash}
            opacity={0.6} />
        </g>

        {/* Observation node */}
        <g opacity={obsCard.opacity} transform={`translate(0, ${obsCard.translateY})`}>
          <circle cx={320} cy={720} r={90}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '320px 720px' }} />
          <circle cx={320} cy={720} r={90}
            fill="none" stroke={COLORS.accent}
            strokeWidth={1} opacity={glow}
            transform={`scale(${1.2 * pulse})`} style={{ transformOrigin: '320px 720px' }} />
          <text x={320} y={706} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            OBSERVATION
          </text>
          <text x={320} y={744} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            IN
          </text>
        </g>

        {/* Arrow obs → action */}
        <path
          d="M 410,720 L 488,720"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" strokeLinecap="round"
          opacity={obsCard.opacity} />

        {/* Action node */}
        <g opacity={actCard.opacity} transform={`translate(0, ${actCard.translateY})`}>
          <circle cx={760} cy={720} r={90}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '760px 720px' }} />
          <text x={760} y={706} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            ACTION
          </text>
          <text x={760} y={744} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            OUT
          </text>
        </g>

        {/* Arrow action → back */}
        <path
          d="M 670,720 L 592,720"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" strokeLinecap="round"
          opacity={actCard.opacity} />

        {/* Center: iteration counter with breathe */}
        <g transform={`translate(540, ${breathe + 720})`} opacity={iterCard.opacity}>
          <text x={0} y={-10} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            {iterCount}×
          </text>
          <text x={0} y={40} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            ITERATION
          </text>
        </g>

        {/* ── Definition bento cards ──────────────────────────────────────── */}
        <g opacity={iterCard.opacity} transform={`translate(0, ${iterCard.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={180} />
          <text x={100} y={1148} textAnchor="start"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            1 OBSERVATION
          </text>
          <text x={100} y={1198} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            input to the agent
          </text>
        </g>

        <g opacity={stepCard.opacity} transform={`translate(0, ${stepCard.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={180} accent />
          <text x={600} y={1148} textAnchor="start"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            1 ACTION
          </text>
          <text x={600} y={1198} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            output from the agent
          </text>
        </g>

        {/* Bottom equation */}
        <g opacity={stepCard.opacity} transform={`translate(0, ${stepCard.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={100} />
          <text x={540} y={1344} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            observation + action = 1 STEP
          </text>
        </g>

        {/* Additional detail label */}
        <g opacity={stepCard.opacity}>
          <text x={60} y={1440}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Each loop cycle advances the agent toward its goal
          </text>
        </g>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
