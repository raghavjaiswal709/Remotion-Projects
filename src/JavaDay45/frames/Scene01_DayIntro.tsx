/**
 * Scene 01 — Day Intro
 * "This is day 45 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.940s
 * Duration: 193 frames (6.43s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30): Day counter springs in, module label slides
 *   Phase 2 (frames 20–90): Locomotive illustration builds, progress bar fills
 *   Phase 3 (frames 80–end): Wheel rotation, steam puff, track shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const dayCounter      = useSpringEntrance(frame, 4);
  const headlineA       = useSpringEntrance(frame, 8);
  const headlineB       = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const locoEntrance    = useSpringEntrance(frame, 20);
  const progressCard    = useSpringEntrance(frame, 28);
  const moduleCard      = useSpringEntrance(frame, 36);
  const trackDraw       = usePathDraw(frame, 25, 960, 35);

  // ── Progress bar animation ─────────────────────────────────────────────────
  const progressWidth = interpolate(frame, [30, 70], [0, (45 / 105) * 880], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const dayNum = useCounter(frame, 5, 45, 35);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const wheelRotation = frame * 3;
  const steamY = Math.sin(frame * 0.08) * 6;
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const trackPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.4, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <text
            x={60} y={160}
            fontFamily={FONT}
            fontSize={28} fontWeight={800}
            fill={COLORS.accent}
            letterSpacing="0.15em"
            opacity={0.8}
          >
            NATIONAL RAILWAY · JAVA
          </text>
        </g>

        {/* ── ZONE B — Day counter + headline ──────────────────────────── */}
        <g transform={`translate(0, ${dayCounter.translateY})`} opacity={dayCounter.opacity}>
          <text
            x={60} y={280}
            fontFamily={FONT}
            fontSize={120} fontWeight={800}
            fill={COLORS.accent}
          >
            DAY {dayNum}
          </text>
          <text
            x={60 + 120 * (String(dayNum).length * 0.65 + 3.6)} y={280}
            fontFamily={FONT}
            fontSize={52} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 105
          </text>
        </g>

        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={380}
            fontFamily={FONT}
            fontSize={72} fontWeight={800}
            fill={COLORS.white}
          >
            Runtime
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={460}
            fontFamily={FONT}
            fontSize={72} fontWeight={800}
            fill={COLORS.accent}
            fontStyle="italic"
          >
            Polymorphism
          </text>
        </g>

        {/* ── ZONE C — Progress card ───────────────────────────────────── */}
        <g opacity={progressCard.opacity} transform={`translate(0, ${progressCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={140} accent />
          <text x={100} y={570} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            MODULE 3 · TICKETING ENGINE
          </text>
          {/* Progress bar track */}
          <rect x={100} y={596} width={880} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          {/* Progress bar fill */}
          <rect x={100} y={596} width={progressWidth} height={8} rx={4} fill={COLORS.accent} opacity={0.9} />
          <text x={100 + progressWidth + 12} y={608} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            {Math.round((45 / 105) * 100)}%
          </text>
        </g>

        {/* ── Locomotive illustration ──────────────────────────────────── */}
        <g opacity={locoEntrance.opacity} transform={`translate(0, ${locoEntrance.translateY})`}>
          <BentoCard x={60} y={700} w={960} h={640} />

          {/* Track rails */}
          <line x1={100} y1={1200} x2={980} y2={1200}
            stroke={COLORS.accent} strokeWidth={4} opacity={trackPulse}
            strokeDasharray={960} strokeDashoffset={trackDraw} />
          <line x1={100} y1={1220} x2={980} y2={1220}
            stroke={COLORS.accent} strokeWidth={4} opacity={trackPulse}
            strokeDasharray={960} strokeDashoffset={trackDraw} />

          {/* Track ties */}
          {Array.from({ length: 14 }, (_, i) => {
            const tieX = 120 + i * 62;
            const tieOpacity = interpolate(frame, [30 + i * 2, 38 + i * 2], [0, 0.5], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <rect key={i} x={tieX} y={1195} width={40} height={30} rx={3}
                fill={COLORS.text_muted} opacity={tieOpacity} />
            );
          })}

          {/* Locomotive body */}
          <g transform={`translate(280, 860)`}>
            {/* Main body */}
            <rect x={0} y={120} width={420} height={180} rx={12}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Cab */}
            <rect x={320} y={60} width={100} height={240} rx={10}
              fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Cab window */}
            <rect x={340} y={80} width={60} height={50} rx={6}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Smokestack */}
            <rect x={60} y={80} width={40} height={50} rx={5}
              fill={COLORS.accent} fillOpacity={0.3}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Steam puffs */}
            <circle cx={80} cy={60 + steamY} r={18} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
            <circle cx={100} cy={40 + steamY * 1.3} r={24} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
            <circle cx={60} cy={30 + steamY * 0.7} r={14} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
            {/* Boiler */}
            <ellipse cx={180} cy={200} rx={160} ry={60}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />
            {/* Wheels */}
            <g transform={`rotate(${wheelRotation}, 100, 320)`}>
              <circle cx={100} cy={320} r={36} fill="none" stroke={COLORS.accent} strokeWidth={3} />
              <circle cx={100} cy={320} r={6} fill={COLORS.accent} />
              <line x1={100} y1={284} x2={100} y2={320} stroke={COLORS.accent} strokeWidth={2} />
              <line x1={64} y1={320} x2={100} y2={320} stroke={COLORS.accent} strokeWidth={2} />
            </g>
            <g transform={`rotate(${wheelRotation}, 260, 320)`}>
              <circle cx={260} cy={320} r={36} fill="none" stroke={COLORS.accent} strokeWidth={3} />
              <circle cx={260} cy={320} r={6} fill={COLORS.accent} />
              <line x1={260} y1={284} x2={260} y2={320} stroke={COLORS.accent} strokeWidth={2} />
              <line x1={224} y1={320} x2={260} y2={320} stroke={COLORS.accent} strokeWidth={2} />
            </g>
            <g transform={`rotate(${wheelRotation}, 380, 320)`}>
              <circle cx={380} cy={320} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
              <circle cx={380} cy={320} r={5} fill={COLORS.accent} />
            </g>
            {/* Coupling rod */}
            <line x1={100} y1={320} x2={260} y2={320}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            {/* Label */}
            <text x={210} y={230} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white} opacity={0.9}>
              JR-045
            </text>
          </g>
        </g>

        {/* ── Module info card ─────────────────────────────────────────── */}
        <g opacity={moduleCard.opacity} transform={`translate(0, ${moduleCard.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={320} accent />
          <rect x={60} y={1380} width={6} height={320} rx={3} fill={COLORS.accent} />
          <text x={100} y={1440} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            TODAY&apos;S TOPIC
          </text>
          <text x={100} y={1500} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            Runtime Polymorphism
          </text>
          <text x={100} y={1560} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            FareCalculator reference holds
          </text>
          <text x={100} y={1610} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            ExpressFareCalculator at runtime
          </text>
          {/* Floating accent dot */}
          <circle cx={960} cy={1540 + breathe} r={24}
            fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
          <circle cx={960} cy={1540 + breathe} r={24}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '960px 1540px' }} />
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s01.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
