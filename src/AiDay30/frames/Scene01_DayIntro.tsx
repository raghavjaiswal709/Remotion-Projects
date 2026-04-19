/**
 * Scene 01 — DayIntro
 * "This is Day 30 of learning agent AI from first principles."
 * CSV: 0.000s → 4.800s
 * Duration: ~161 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Series label + day badge spring in
 *   Phase 2 (frames 15–80):  Hero number "30" scales up, subtitle springs, robot illustration
 *   Phase 3 (frames 60–end): Floating particles, pulse rings, breathing accents
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

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ────────────────────────────────────
  const labelEntrance  = useSpringEntrance(frame, 0);
  const badgeEntrance  = useSpringEntrance(frame, 6);
  const seriesEntrance = useSpringEntrance(frame, 3);

  // ── Phase 2: Hero number + subtitle (frames 15–80) ────────────────────────
  const heroScale = spring({ frame: Math.max(0, frame - 15), fps, config: SPRING_SNAP });
  const heroOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleEntrance = useSpringEntrance(frame, 30);
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 52);
  const robotEntrance = useSpringEntrance(frame, 35);

  // ── Path draws ────────────────────────────────────────────────────────────
  const circuitLength = 400;
  const circuitDash = usePathDraw(frame, 40, circuitLength, 35);
  const borderPerim = 2 * (960 + 200);
  const borderDash = usePathDraw(frame, 25, borderPerim, 40);

  // ── Phase 3: Micro-animations (frames 60+) ────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer    = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const floatY1    = Math.sin(frame * 0.05) * 6;
  const floatY2    = Math.sin(frame * 0.07 + 1) * 5;
  const floatY3    = Math.sin(frame * 0.04 + 2) * 7;
  const orbitAngle = (frame * 0.02) % (Math.PI * 2);

  // ── Particles ──────────────────────────────────────────────────────────────
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 100 + (i * 83) % 880,
    y: 400 + (i * 137) % 1200,
    r: 2 + (i % 3),
    phase: i * 0.5,
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label (y=60–200) ──────────────────────────── */}
        <g transform={`translate(0, ${seriesEntrance.translateY})`} opacity={seriesEntrance.opacity}>
          <text
            x={60} y={120}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}
          >
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* Day badge */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <rect x={60} y={140} width={180} height={50} rx={25} fill={COLORS.accent_dim} stroke={COLORS.accent_mid} strokeWidth={1} />
          <text x={150} y={173} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DAY 30 / 120
          </text>
        </g>

        {/* ── ZONE B — Hero number "30" (y=220–500) ─────────────────────── */}
        {/* Ghost layer */}
        <text
          x={540} y={420}
          textAnchor="middle"
          fontFamily={FONT} fontSize={360} fontWeight={800}
          fill={COLORS.accent} opacity={heroOpacity * 0.06}
          transform={`scale(${interpolate(heroScale, [0, 1], [0.7, 1.05])})`}
          style={{ transformOrigin: '540px 420px' }}
        >
          30
        </text>
        {/* Main hero number */}
        <text
          x={540} y={420}
          textAnchor="middle"
          fontFamily={FONT} fontSize={280} fontWeight={800}
          fill={COLORS.white} opacity={heroOpacity}
          transform={`scale(${interpolate(heroScale, [0, 1], [0.6, 1])})`}
          style={{ transformOrigin: '540px 420px' }}
        >
          30
        </text>

        {/* Subtitle */}
        <g transform={`translate(0, ${subtitleEntrance.translateY})`} opacity={subtitleEntrance.opacity}>
          <text
            x={540} y={500}
            textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}
          >
            What Is a Task?
          </text>
        </g>

        {/* ── ZONE C — Bento cards + Robot illustration (y=520–1740) ─────── */}

        {/* Animated border draw on main card */}
        <rect
          x={60} y={560} width={960} height={200} rx={20}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={borderPerim} strokeDashoffset={borderDash}
        />
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={560} w={960} h={200} accent />
          <text x={100} y={640} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Learning Agent AI
          </text>
          <text x={100} y={700} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            From First Principles · Day 30
          </text>
        </g>

        {/* Second card — topic preview */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={790} w={460} h={180} />
          <text x={100} y={870} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            task
          </text>
          <text x={100} y={920} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Defined today
          </text>
          <BentoCard x={560} y={790} w={460} h={180} accent />
          <text x={600} y={870} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Goal + 3 Parts
          </text>
          <text x={600} y={920} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Start · End · Criterion
          </text>
        </g>

        {/* ── Robot / Agent illustration ──────────────────────────────────── */}
        <g opacity={robotEntrance.opacity} transform={`translate(540, ${1200 + robotEntrance.translateY + breathe})`}>
          {/* Robot head */}
          <rect x={-90} y={-120} width={180} height={160} rx={24} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-35} cy={-50} r={16} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={35} cy={-50} r={16} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={-35} cy={-50} r={8} fill={COLORS.bg_primary} />
          <circle cx={35} cy={-50} r={8} fill={COLORS.bg_primary} />
          {/* Mouth/speaker grille */}
          <line x1={-30} y1={0} x2={30} y2={0} stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          <line x1={-25} y1={10} x2={25} y2={10} stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
          <line x1={-20} y1={20} x2={20} y2={20} stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          {/* Antenna */}
          <line x1={0} y1={-120} x2={0} y2={-160} stroke={COLORS.accent} strokeWidth={3} />
          <circle cx={0} cy={-165} r={8} fill={COLORS.accent} opacity={pulse} />
          {/* Body */}
          <rect x={-70} y={50} width={140} height={180} rx={16} fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          {/* Chest emblem */}
          <circle cx={0} cy={120} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={shimmer} />
          <circle cx={0} cy={120} r={12} fill={COLORS.accent} opacity={0.3} />
          {/* Arms */}
          <rect x={-110} y={70} width={30} height={100} rx={10} fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />
          <rect x={80} y={70} width={30} height={100} rx={10} fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />
          {/* Circuitry lines on body */}
          <path
            d="M -40,80 L -40,120 L 0,120 L 0,160 L 40,160"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5}
            strokeDasharray={circuitLength} strokeDashoffset={circuitDash}
          />
          <path
            d="M 40,80 L 40,100 L 20,100 L 20,140 L -20,140"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4}
            strokeDasharray={circuitLength} strokeDashoffset={circuitDash * 0.8}
          />
          {/* Joint circles */}
          <circle cx={-95} cy={175} r={6} fill={COLORS.accent} opacity={0.4} />
          <circle cx={95} cy={175} r={6} fill={COLORS.accent} opacity={0.4} />
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        {particles.map((p, i) => {
          const pOpacity = interpolate(frame, [20 + i * 3, 35 + i * 3], [0, 0.4], { extrapolateRight: 'clamp' });
          const py = p.y + Math.sin(frame * 0.03 + p.phase) * 10;
          return (
            <circle
              key={i} cx={p.x} cy={py} r={p.r}
              fill={COLORS.accent} opacity={pOpacity * shimmer}
            />
          );
        })}

        {/* ── Orbital ring around hero number ────────────────────────────── */}
        <g opacity={interpolate(frame, [40, 60], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <circle
            cx={540 + Math.cos(orbitAngle) * 200}
            cy={380 + Math.sin(orbitAngle) * 60}
            r={5} fill={COLORS.accent}
          />
          <circle
            cx={540 + Math.cos(orbitAngle + Math.PI) * 200}
            cy={380 + Math.sin(orbitAngle + Math.PI) * 60}
            r={4} fill={COLORS.accent} opacity={0.5}
          />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [0, 30], [0, 0.5], { extrapolateRight: 'clamp' })}>
          <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 60,1740 L 60,1660 M 60,1740 L 140,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── Pulse ring behind robot ────────────────────────────────────── */}
        <circle
          cx={540} cy={1200}
          r={interpolate(frame, [50, 120], [40, 160], { extrapolateRight: 'clamp' })}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          opacity={interpolate(frame, [50, 120], [0.4, 0], { extrapolateRight: 'clamp' })}
        />
        <circle
          cx={540} cy={1200}
          r={interpolate(frame, [65, 135], [40, 160], { extrapolateRight: 'clamp' })}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={interpolate(frame, [65, 135], [0.3, 0], { extrapolateRight: 'clamp' })}
        />

        {/* ── Accent bars ────────────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [30, 50], [0, 0.6], { extrapolateRight: 'clamp' })}>
          <rect x={60} y={1560 + floatY1} width={120} height={4} rx={2} fill={COLORS.accent} opacity={0.3} />
          <rect x={900} y={1580 + floatY2} width={80} height={4} rx={2} fill={COLORS.accent} opacity={0.25} />
          <rect x={480} y={1600 + floatY3} width={100} height={4} rx={2} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── Network dots connecting to robot ───────────────────────────── */}
        <g opacity={interpolate(frame, [50, 70], [0, 0.35], { extrapolateRight: 'clamp' })}>
          <circle cx={200} cy={1050 + floatY1} r={4} fill={COLORS.accent} />
          <line x1={200} y1={1050 + floatY1} x2={450} y2={1120} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <circle cx={880} cy={1080 + floatY2} r={4} fill={COLORS.accent} />
          <line x1={880} y1={1080 + floatY2} x2={630} y2={1120} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <circle cx={300} cy={1400 + floatY3} r={3} fill={COLORS.accent} />
          <line x1={300} y1={1400 + floatY3} x2={470} y2={1320} stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
          <circle cx={780} cy={1380 + floatY1} r={3} fill={COLORS.accent} />
          <line x1={780} y1={1380 + floatY1} x2={610} y2={1320} stroke={COLORS.accent} strokeWidth={1} opacity={0.2} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
