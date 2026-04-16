/**
 * Scene 01 — DayIntro
 * "This is day 28 of learning a GenTik AI from first principles."
 * CSV: 0.000s → 4.960s
 * Duration: 163 frames (5.43s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Day number springs in, series badge enters
 *   Phase 2 (frames 20–80):  Robot illustration assembles, topic line appears
 *   Phase 3 (frames 70–end): Micro-pulse on robot eye, floating particles
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

// ─── Spring presets ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helper: spring entrance ──────────────────────────────────────────────────
function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// ─── Helper: path draw ────────────────────────────────────────────────────────
function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Day number reveal ──────────────────────────────────────────────
  const dayNumSpring = spring({ frame, fps, config: SPRING_SNAP });
  const dayNumScale = interpolate(dayNumSpring, [0, 1], [0.3, 1]);
  const dayNumOpacity = interpolate(dayNumSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const badgeEntrance = useSpringEntrance(frame, 8);
  const seriesEntrance = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ──────────────────────────────────────────────────
  const topicEntrance = useSpringEntrance(frame, 24);
  const robotHead = useSpringEntrance(frame, 30);
  const robotBody = useSpringEntrance(frame, 38);
  const robotArms = useSpringEntrance(frame, 44);
  const robotCircuit = useSpringEntrance(frame, 50);

  // Robot circuit path draw
  const circuitLen = 400;
  const circuitDash = usePathDraw(frame, 42, circuitLen, 35);

  // Antenna path draw
  const antennaLen = 120;
  const antennaDash = usePathDraw(frame, 36, antennaLen, 20);

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const eyePulse = 1 + Math.sin(frame * 0.12) * 0.15;
  const breathe = Math.sin(frame * 0.06) * 3;
  const floatY = Math.sin(frame * 0.04) * 5;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.7, 1]);
  const particlePhase = frame * 0.03;

  // Border draw for accent card
  const PERIM = 2 * (960 + 160);
  const borderDash = interpolate(frame, [20, 50], [PERIM, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series badge ─────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <text
            x={60} y={120}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}
          >
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* ── Series subtitle ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${seriesEntrance.translateY})`} opacity={seriesEntrance.opacity}>
          <text
            x={60} y={168}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}
          >
            MODULE 4 · TOOL USE
          </text>
        </g>

        {/* ── ZONE B — DAY 28 hero number ───────────────────────────────── */}
        <g
          opacity={dayNumOpacity}
          transform={`translate(540, 380) scale(${dayNumScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Ghost behind */}
          <text
            textAnchor="middle"
            fontFamily={FONT} fontSize={320} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}
            y={40}
          >
            28
          </text>
          {/* Main number */}
          <text
            textAnchor="middle"
            fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.white}
            y={30}
          >
            28
          </text>
          {/* DAY label above */}
          <text
            textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}
            y={-130}
          >
            DAY
          </text>
        </g>

        {/* ── ZONE C — Robot illustration + topic card ───────────────────── */}

        {/* Topic bento card with animated border */}
        <g opacity={topicEntrance.opacity} transform={`translate(0, ${topicEntrance.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={160} />
          <rect
            x={60} y={540} width={960} height={160} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={PERIM} strokeDashoffset={borderDash}
          />
          <text
            x={540} y={636}
            textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}
          >
            What Is Tool Calling?
          </text>
        </g>

        {/* ── Large Robot Illustration ──────────────────────────────────── */}
        <g transform={`translate(540, ${950 + floatY})`}>

          {/* Robot Head */}
          <g opacity={robotHead.opacity} transform={`translate(0, ${robotHead.translateY})`}>
            {/* Head base */}
            <rect x={-120} y={-180} width={240} height={200} rx={24}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Eye left */}
            <circle cx={-50} cy={-100} r={22 * eyePulse}
              fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={-50} cy={-100} r={8}
              fill={COLORS.accent} opacity={shimmer} />
            {/* Eye right */}
            <circle cx={50} cy={-100} r={22 * eyePulse}
              fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={50} cy={-100} r={8}
              fill={COLORS.accent} opacity={shimmer} />
            {/* Mouth grille */}
            {[-30, -10, 10, 30].map((mx, i) => (
              <line key={i} x1={mx} y1={-40} x2={mx} y2={-20}
                stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            ))}
            {/* Antenna */}
            <path
              d="M 0,-180 L 0,-240 Q 0,-260 20,-260"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={antennaLen} strokeDashoffset={antennaDash}
              strokeLinecap="round"
            />
            <circle cx={20} cy={-260} r={8}
              fill={COLORS.accent} opacity={robotHead.opacity * shimmer} />
          </g>

          {/* Robot Body */}
          <g opacity={robotBody.opacity} transform={`translate(0, ${robotBody.translateY})`}>
            {/* Torso */}
            <rect x={-140} y={40} width={280} height={260} rx={20}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Chest panel */}
            <rect x={-80} y={70} width={160} height={80} rx={12}
              fill={COLORS.accent} opacity={0.1} />
            <rect x={-80} y={70} width={160} height={80} rx={12}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
            {/* Chest indicator light */}
            <circle cx={0} cy={110} r={12}
              fill={COLORS.accent} opacity={0.3 + 0.3 * Math.sin(frame * 0.1)} />
            <circle cx={0} cy={110} r={6}
              fill={COLORS.accent} opacity={shimmer} />
            {/* Torso detail lines */}
            <line x1={-100} y1={180} x2={100} y2={180}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
            <line x1={-100} y1={220} x2={100} y2={220}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
            {/* Serial number */}
            <text x={0} y={260} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.accent} opacity={0.4}>
              AI-028
            </text>
          </g>

          {/* Robot Arms */}
          <g opacity={robotArms.opacity} transform={`translate(0, ${robotArms.translateY})`}>
            {/* Left arm */}
            <rect x={-200} y={60} width={50} height={180} rx={12}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Left hand */}
            <circle cx={-175} cy={260} r={20}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Left shoulder joint */}
            <circle cx={-150} cy={60} r={10}
              fill={COLORS.accent} opacity={0.4} />
            {/* Right arm */}
            <rect x={150} y={60} width={50} height={180} rx={12}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Right hand */}
            <circle cx={175} cy={260} r={20}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Right shoulder joint */}
            <circle cx={150} cy={60} r={10}
              fill={COLORS.accent} opacity={0.4} />
          </g>

          {/* Circuit lines around robot */}
          <g opacity={robotCircuit.opacity}>
            <path
              d="M -200,300 L -200,340 Q -200,360 -180,360 L 180,360 Q 200,360 200,340 L 200,300"
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={circuitLen} strokeDashoffset={circuitDash}
              strokeLinecap="round" opacity={0.5}
            />
            {/* Connection dots */}
            {[-180, -90, 0, 90, 180].map((cx, i) => (
              <circle key={i} cx={cx} cy={360} r={4}
                fill={COLORS.accent}
                opacity={interpolate(frame, [52 + i * 4, 56 + i * 4], [0, 0.7], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })}
              />
            ))}
          </g>
        </g>

        {/* ── Floating accent particles ────────────────────────────────── */}
        {[
          { x: 120, y: 480, r: 6, speed: 1.2 },
          { x: 900, y: 640, r: 5, speed: 0.9 },
          { x: 180, y: 1400, r: 4, speed: 1.5 },
          { x: 850, y: 1320, r: 7, speed: 0.7 },
          { x: 540, y: 1500, r: 5, speed: 1.1 },
          { x: 300, y: 760, r: 3, speed: 1.4 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y + Math.sin(particlePhase * p.speed + i * 1.2) * 12}
            r={p.r}
            fill={COLORS.accent}
            opacity={0.15 * shimmer}
          />
        ))}

        {/* ── Bottom accent line ───────────────────────────────────────── */}
        <line x1={60} y1={1720} x2={1020} y2={1720}
          stroke={COLORS.accent} strokeWidth={1} opacity={0.15} />

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
