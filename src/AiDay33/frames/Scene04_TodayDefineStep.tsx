/**
 * Scene 04 — Today Define Step
 * "Today, we define the step."
 * CSV: 13.190s → 15.290s
 * Duration: 79 frames (2.6s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + "TODAY" hero text springs up
 *   Phase 2 (frames 15–50):  Step definition card border-draw, arrow indicator
 *   Phase 3 (frames 40–end): Pulse on step icon, breathing accent circle
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

export const Scene04_TodayDefineStep: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const todayEnt = useSpringEntrance(frame, 4);
  const stepEnt = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 16);
  const card2 = useSpringEntrance(frame, 28);
  const card3 = useSpringEntrance(frame, 36);

  // Step icon circle border draw
  const circlePerimeter = 2 * Math.PI * 80;
  const circleDash = usePathDraw(frame, 18, circlePerimeter, 25);

  // Arrow indicator
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 5 · THE STEP" y={160} />
        </g>

        {/* ── ZONE B — "TODAY" hero ────────────────────────────────────── */}
        <g transform={`translate(0, ${todayEnt.translateY})`} opacity={todayEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.text_muted}>
            TODAY
          </text>
        </g>
        <g transform={`translate(0, ${stepEnt.translateY})`} opacity={stepEnt.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            We Define
          </text>
          <text x={60} y={520} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            The Step
          </text>
        </g>

        {/* ── ZONE C — Step icon + concept cards ──────────────────────── */}
        {/* Large step icon */}
        <g opacity={card1.opacity} transform={`translate(540, ${740 + breathe})`}>
          {/* Animated circle border */}
          <circle cx={0} cy={0} r={80}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={circlePerimeter} strokeDashoffset={circleDash}
          />
          <circle cx={0} cy={0} r={80} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />

          {/* Step number "1" inside */}
          <text x={0} y={18} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} opacity={pulse}
          >
            1
          </text>

          {/* Label below */}
          <text x={0} y={120} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}
          >
            SINGLE STEP
          </text>
        </g>

        {/* Arrow pointing down */}
        <path
          d="M 540,870 L 540,950"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Definition card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={200} accent />
          <rect x={60} y={980} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1050} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            The atomic unit of execution
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            Observation → Action → Done
          </text>
          <text x={100} y={1155} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            One complete loop iteration
          </text>
        </g>

        {/* Supporting detail card */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={160} />
          <text x={540} y={1315} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            From trajectory → zoom into one step
          </text>
        </g>

        {/* Floating micro elements */}
        <g transform={`translate(200, ${1520 + breathe * 1.3})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.05} />
          <circle cx={0} cy={0} r={32} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(850, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.04} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={shimmer} />
        </g>

        <circle cx={450} cy={1600 + breathe * 0.6} r={4} fill={COLORS.accent} opacity={0.2} />
        <circle cx={680} cy={1570 + breathe * 1.1} r={3} fill={COLORS.accent} opacity={0.15} />
        <circle cx={300} cy={1650 + breathe * 0.8} r={5} fill={COLORS.accent} opacity={0.12} />

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
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
