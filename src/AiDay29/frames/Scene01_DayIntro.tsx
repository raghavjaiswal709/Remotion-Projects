/**
 * Scene 01 — DayIntro
 * "This is day 29 of learning Agentic AI from first principles."
 * CSV: 0.000s → 5.200s
 * Duration: 156 frames (5.2s)
 *
 * Animation phases:
 *   Phase 1 (0–30):  Day badge + series label spring in
 *   Phase 2 (20–90): Hero number 29 scales up, subtitle appears
 *   Phase 3 (80–end): Floating particles, pulse ring
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const seriesEnt = useSpringEntrance(frame, 8);
  const badgeEnt = useSpringEntrance(frame, 4);

  // ── Phase 2: Hero 29 number ────────────────────────────────────────────────
  const heroScale = spring({ frame: Math.max(0, frame - 16), fps, config: SPRING_SNAP });
  const heroOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleEnt = useSpringEntrance(frame, 30);

  // ── Phase 2b: Bento cards ──────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 52);
  const card3 = useSpringEntrance(frame, 64);

  // ── Phase 2c: Path draw ring around 29 ─────────────────────────────────────
  const ringCircumference = 2 * Math.PI * 160;
  const ringDash = usePathDraw(frame, 20, ringCircumference, 40);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + frame * 0.01;
    const radius = 280 + Math.sin(frame * 0.03 + i) * 30;
    const px = 540 + Math.cos(angle) * radius;
    const py = 850 + Math.sin(angle) * radius;
    const pOp = interpolate(frame, [30 + i * 3, 42 + i * 3], [0, 0.4], { extrapolateRight: 'clamp' });
    return { px, py, pOp, r: 3 + (i % 3) };
  });

  // ── Phase 2d: Border draw on cards ─────────────────────────────────────────
  const card1Perim = 2 * (960 + 160);
  const card1Dash = usePathDraw(frame, 40, card1Perim, 30);
  const card2Perim = 2 * (460 + 200);
  const card2Dash = usePathDraw(frame, 52, card2Perim, 30);
  const card3Perim = 2 * (460 + 200);
  const card3Dash = usePathDraw(frame, 64, card3Perim, 30);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <text x={60} y={140} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* ── ZONE A — Day badge ────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEnt.translateY})`} opacity={badgeEnt.opacity}>
          <text x={60} y={200} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            MODULE 3 · TOOL USE
          </text>
        </g>

        {/* ── ZONE B — Hero "29" ────────────────────────────────────────── */}
        <g opacity={heroOpacity}>
          {/* Ghost layer */}
          <text x={540} y={680} textAnchor="middle"
            fontFamily={FONT} fontSize={360} fontWeight={800}
            fill={COLORS.accent} opacity={0.06 * shimmer}
            transform={`scale(${1.05})`} style={{ transformOrigin: '540px 680px' }}>
            29
          </text>
          {/* Main number */}
          <text x={540} y={680} textAnchor="middle"
            fontFamily={FONT} fontSize={320} fontWeight={800}
            fill={COLORS.white}
            transform={`scale(${interpolate(heroScale, [0, 1], [0.7, 1])})`}
            style={{ transformOrigin: '540px 680px' }}>
            29
          </text>
          {/* Ring around number */}
          <circle cx={540} cy={620} r={160} fill="none"
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringDash}
            opacity={0.6} />
          {/* Pulse ring */}
          <circle cx={540} cy={620} r={160} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.2 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 620px' }} />
        </g>

        {/* ── ZONE B — Subtitle ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${subtitleEnt.translateY})`} opacity={subtitleEnt.opacity}>
          <text x={540} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            What Is an Agent Runtime?
          </text>
        </g>

        {/* ── Series label centered ─────────────────────────────────────── */}
        <g opacity={seriesEnt.opacity} transform={`translate(0, ${seriesEnt.translateY})`}>
          <text x={540} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            DAY 29 / 120
          </text>
        </g>

        {/* ── Floating particles ────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.px} cy={p.py} r={p.r}
            fill={COLORS.accent} opacity={p.pOp} />
        ))}

        {/* ── ZONE C — Bento cards ──────────────────────────────────────── */}
        {/* Full-width overview card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={160} accent />
          <rect x={60} y={940} width={960} height={160} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={card1Perim} strokeDashoffset={card1Dash} />
          <rect x={60} y={940} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={120} y={1032} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>
            The code infrastructure around the model
          </text>
        </g>

        {/* Two-column cards */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1130} w={460} h={200} />
          <rect x={60} y={1130} width={460} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={card2Perim} strokeDashoffset={card2Dash} opacity={0.5} />
          <text x={100} y={1210} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>RUNTIME</text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Loop executor</text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1130} w={460} h={200} />
          <rect x={560} y={1130} width={460} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={card3Perim} strokeDashoffset={card3Dash} opacity={0.5} />
          <text x={600} y={1210} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>MODEL</text>
          <text x={600} y={1260} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Decision maker</text>
        </g>

        {/* ── Robot head illustration ─────────────────────────────────── */}
        <g opacity={card1.opacity * shimmer} transform={`translate(540, ${1520 + breathe})`}>
          {/* Head */}
          <rect x={-80} y={-70} width={160} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-30} cy={-20} r={14} fill={COLORS.accent} opacity={0.9} />
          <circle cx={30} cy={-20} r={14} fill={COLORS.accent} opacity={0.9} />
          {/* Mouth */}
          <rect x={-40} y={20} width={80} height={8} rx={4} fill={COLORS.accent} opacity={0.5} />
          {/* Antenna */}
          <line x1={0} y1={-70} x2={0} y2={-100} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-105} r={6} fill={COLORS.accent} opacity={pulse} />
          {/* Circuitry lines on head */}
          <line x1={-60} y1={-50} x2={-60} y2={30} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <line x1={60} y1={-50} x2={60} y2={30} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <line x1={-60} y1={0} x2={-30} y2={0} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          <line x1={30} y1={0} x2={60} y2={0} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
        </g>

        {/* ── Corner accents ────────────────────────────────────────────── */}
        <g opacity={labelEnt.opacity * 0.5}>
          <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 60,1740 L 60,1660 M 60,1740 L 140,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ───────────────────────────────────────────────────── */}
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
