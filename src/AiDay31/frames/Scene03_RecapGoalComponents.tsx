/**
 * Scene 03 — Recap Goal Components
 * "a goal with a start state, an end state,"
 * CSV: 8.160s → 10.600s | Duration: 80 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Headline springs in
 *   Phase 2 (20–65): Three-column bento cards (start/end/goal) stagger
 *   Phase 3 (55–end): Connectors draw, micro pulse
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

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

export const Scene03_RecapGoalComponents: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 — Three bento cards ────────────────────────────────────────────
  const cardStart = useSpringEntrance(frame, 20);
  const cardEnd   = useSpringEntrance(frame, 32);
  const cardGoal  = useSpringEntrance(frame, 44);

  // Arrow connectors
  const arrowLen = 100;
  const arrow1Dash = usePathDraw(frame, 35, arrowLen, 20);
  const arrow2Dash = usePathDraw(frame, 47, arrowLen, 20);

  // Flow diagram
  const flowLen = 800;
  const flowDash = usePathDraw(frame, 28, flowLen, 35);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="TASK ANATOMY · RECAP" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Goal Components
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Start State → End State
          </text>
        </g>

        {/* ── ZONE C — Large flow diagram ─────────────────────────────────── */}

        {/* Start State card */}
        <g opacity={cardStart.opacity} transform={`translate(0, ${cardStart.translateY})`}>
          <BentoCard x={60} y={500} w={280} h={360} accent />
          {/* Icon: circle with "A" */}
          <circle cx={200} cy={600} r={50} fill={COLORS.accent} opacity={0.15} />
          <text x={200} y={618} textAnchor="middle" fontFamily={FONT}
            fontSize={48} fontWeight={800} fill={COLORS.accent}>A</text>
          <text x={200} y={700} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.white}>START</text>
          <text x={200} y={745} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>STATE</text>
          {/* Description lines */}
          <rect x={110} y={780} width={180} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
          <rect x={120} y={800} width={160} height={8} rx={4} fill="rgba(255,255,255,0.07)" />
        </g>

        {/* Arrow 1 */}
        <path d="M 350,680 L 420,680"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Goal card (center large) */}
        <g opacity={cardGoal.opacity} transform={`translate(0, ${cardGoal.translateY})`}>
          <BentoCard x={400} y={500} w={280} h={360} />
          {/* Target icon */}
          <circle cx={540} cy={590} r={50} fill="none" stroke={COLORS.accent} strokeWidth={2.5} opacity={shimmer} />
          <circle cx={540} cy={590} r={30} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          <circle cx={540} cy={590} r={10} fill={COLORS.accent} opacity={0.8}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 590px' }} />
          <text x={540} y={690} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>GOAL</text>
          <text x={540} y={735} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>Measurable</text>
          {/* Lines */}
          <rect x={450} y={770} width={180} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
          <rect x={460} y={790} width={160} height={8} rx={4} fill="rgba(255,255,255,0.07)" />
        </g>

        {/* Arrow 2 */}
        <path d="M 690,680 L 760,680"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* End State card */}
        <g opacity={cardEnd.opacity} transform={`translate(0, ${cardEnd.translateY})`}>
          <BentoCard x={740} y={500} w={280} h={360} accent />
          {/* Icon: circle with "B" */}
          <circle cx={880} cy={600} r={50} fill={COLORS.accent} opacity={0.15} />
          <text x={880} y={618} textAnchor="middle" fontFamily={FONT}
            fontSize={48} fontWeight={800} fill={COLORS.accent}>B</text>
          <text x={880} y={700} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.white}>END</text>
          <text x={880} y={745} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>STATE</text>
          <rect x={790} y={780} width={180} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
          <rect x={800} y={800} width={160} height={8} rx={4} fill="rgba(255,255,255,0.07)" />
        </g>

        {/* Flow path underneath */}
        <path d={`M 200,870 C 200,950 540,950 540,870 C 540,950 880,950 880,870`}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={flowLen} strokeDashoffset={flowDash}
          opacity={0.3} strokeLinecap="round" />

        {/* Bottom summary bento */}
        <g opacity={cardGoal.opacity} transform={`translate(0, ${cardGoal.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={180} />
          <rect x={60} y={1020} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1090} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            A task is a
          </text>
          <text x={385} y={1090} fontFamily={FONT} fontSize={40} fontWeight={800}
            fontStyle="italic" fill={COLORS.accent}>
            goal
          </text>
          <text x={460} y={1090} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            with structure
          </text>
          <text x={100} y={1145} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Start state + end state + success criterion
          </text>
        </g>

        {/* Dotted decoration */}
        {Array.from({ length: 8 }, (_, i) => {
          const dx = 120 + i * 120;
          const dy = 1300 + Math.sin(frame * 0.05 + i * 0.8) * 10;
          return (
            <circle key={i} cx={dx} cy={dy} r={3} fill={COLORS.accent}
              opacity={interpolate(frame, [40 + i * 4, 55 + i * 4], [0, 0.25], { extrapolateRight: 'clamp' }) * shimmer} />
          );
        })}

        {/* Additional visual: three circles for the three components */}
        {['Start', 'Goal', 'End'].map((lbl, i) => {
          const cx = 200 + i * 280;
          const cy = 1450 + breathe;
          const entOp = interpolate(frame, [50 + i * 8, 65 + i * 8], [0, 0.6], { extrapolateRight: 'clamp' });
          return (
            <g key={lbl} opacity={entOp}>
              <circle cx={cx} cy={cy} r={35} fill={COLORS.accent} opacity={0.1} />
              <circle cx={cx} cy={cy} r={35} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3 * shimmer} />
              <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={FONT}
                fontSize={24} fontWeight={800} fill={COLORS.accent}>{lbl}</text>
            </g>
          );
        })}

        {/* Bottom accent line */}
        <line x1={60} y1={1570} x2={1020} y2={1570}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1}
          opacity={interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp' })} />

        {/* Emphasis text */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.5], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1640} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Three precise parts define every task
          </text>
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
