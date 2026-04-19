/**
 * Scene 06 — Observation In, Action Out
 * "One observation in, one action out."
 * CSV: 19.600s → 22.260s
 * Duration: 85 frames (2.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring entrance
 *   Phase 2 (frames 18–65): Two-column bento — observation left, action right, arrow between
 *   Phase 3 (frames 55–end): Pulse on arrow, shimmer on cards
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

export const Scene06_ObsInActionOut: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const leftCard = useSpringEntrance(frame, 18);
  const rightCard = useSpringEntrance(frame, 30);
  const centerArrow = usePathDraw(frame, 35, 200, 25);

  // Observation icon: eye
  const eyeEnt = useSpringEntrance(frame, 22);
  // Action icon: bolt
  const boltEnt = useSpringEntrance(frame, 34);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const arrowPulse = frame > 55 ? interpolate(Math.sin((frame - 55) * 0.12), [-1, 1], [0.5, 1]) : 0;

  // Border draw for cards
  const leftPerimeter = 2 * (420 + 600);
  const leftBorderDash = interpolate(frame, [20, 48], [leftPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rightPerimeter = 2 * (420 + 600);
  const rightBorderDash = interpolate(frame, [32, 60], [rightPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="THE STEP · INPUT & OUTPUT" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            In & Out
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            The step's two halves
          </text>
        </g>

        {/* ── ZONE C — Two-column layout ──────────────────────────────── */}

        {/* LEFT: Observation card */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={480} w={420} h={600} />
          {/* Animated border */}
          <rect x={60} y={480} width={420} height={600} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftPerimeter} strokeDashoffset={leftBorderDash}
          />
          {/* "IN" label */}
          <text x={270} y={540} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            IN
          </text>

          {/* Eye icon — observation */}
          <g opacity={eyeEnt.opacity} transform={`translate(270, ${700 + eyeEnt.translateY})`}>
            {/* Outer eye shape */}
            <ellipse cx={0} cy={0} rx={80} ry={50} fill="none" stroke={COLORS.accent} strokeWidth={3} />
            {/* Iris */}
            <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={2} />
            {/* Pupil */}
            <circle cx={0} cy={0} r={12} fill={COLORS.accent} />
            {/* Shine */}
            <circle cx={8} cy={-6} r={4} fill={COLORS.white} opacity={0.6} />
          </g>

          <text x={270} y={820} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            Observation
          </text>
          <text x={270} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Data arrives
          </text>

          {/* Signal lines */}
          {[0, 1, 2].map(i => (
            <line key={i}
              x1={120 + i * 100} y1={930} x2={120 + i * 100} y2={960}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.3 * shimmer}
              strokeLinecap="round"
            />
          ))}

          {/* Incoming arrow */}
          <g opacity={leftCard.opacity * 0.7}>
            <line x1={270} y1={990} x2={270} y2={1040}
              stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" opacity={0.5} />
          </g>
        </g>

        {/* CENTER: Arrow connecting the two */}
        <g opacity={arrowPulse > 0 ? arrowPulse : leftCard.opacity * 0.8}>
          <path
            d="M 500,780 L 580,780"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={200} strokeDashoffset={centerArrow}
            strokeLinecap="round" markerEnd="url(#arrow)"
          />
          <text x={540} y={758} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}>
            STEP
          </text>
        </g>

        {/* RIGHT: Action card */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={600} y={480} w={420} h={600} accent />
          {/* Animated border */}
          <rect x={600} y={480} width={420} height={600} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={rightPerimeter} strokeDashoffset={rightBorderDash}
          />
          {/* "OUT" label */}
          <text x={810} y={540} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            OUT
          </text>

          {/* Lightning bolt icon — action */}
          <g opacity={boltEnt.opacity} transform={`translate(810, ${700 + boltEnt.translateY}) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <polygon
              points="0,-55 -30,5 -5,5 -15,55 30,-5 5,-5 15,-55"
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3}
              strokeLinejoin="round"
            />
          </g>

          <text x={810} y={820} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            Action
          </text>
          <text x={810} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Agent responds
          </text>

          {/* Output signal lines */}
          {[0, 1, 2].map(i => (
            <line key={i}
              x1={660 + i * 100} y1={930} x2={660 + i * 100} y2={960}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.3 * shimmer}
              strokeLinecap="round"
            />
          ))}

          {/* Outgoing arrow */}
          <g opacity={rightCard.opacity * 0.7}>
            <line x1={810} y1={990} x2={810} y2={1040}
              stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" opacity={0.5} />
          </g>
        </g>

        {/* Bottom summary bar */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY * 0.5})`}>
          <BentoCard x={60} y={1140} w={960} h={120} />
          <rect x={60} y={1140} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1210} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            One observation in, one action out
          </text>
        </g>

        {/* Floating particles */}
        <circle cx={200} cy={1400 + breathe} r={4} fill={COLORS.accent} opacity={0.2} />
        <circle cx={880} cy={1450 + breathe * 1.3} r={3} fill={COLORS.accent} opacity={0.15} />
        <circle cx={540} cy={1500 + breathe * 0.8} r={5} fill={COLORS.accent} opacity={0.1} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
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
