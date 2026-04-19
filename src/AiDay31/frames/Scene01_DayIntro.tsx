/**
 * Scene 01 — Day Intro
 * "This is Day 31 of learning agent AI from first principles."
 * CSV: 0.000s → 4.860s | Duration: 161 frames
 *
 * Theme: Dark #0D0D0D + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Hero "31" springs up, section label enters
 *   Phase 2 (frames 20–90): Robot illustration builds, bento cards stagger in
 *   Phase 3 (frames 80–end): Pulse, float, shimmer micro-animations
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
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const heroNum = useSpringEntrance(frame, 6);
  const subtitleA = useSpringEntrance(frame, 12);
  const subtitleB = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);

  // Robot illustration
  const robotBody = useSpringEntrance(frame, 30);
  const robotPathLen = 400;
  const robotDash = usePathDraw(frame, 35, robotPathLen, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const dayCounter = useCounter(frame, 10, 31, 30);

  // Eye blink
  const blinkCycle = frame % 90;
  const eyeScaleY = blinkCycle > 85 ? interpolate(blinkCycle, [85, 87, 90], [1, 0.1, 1], { extrapolateRight: 'clamp' }) : 1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="AGENTIC AI · FIRST PRINCIPLES" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero "31" number ───────────────────────────────────── */}
        {/* Ghost layer */}
        <g opacity={heroNum.opacity * 0.08}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={360} fontWeight={800}
            fill={COLORS.accent}>
            {dayCounter}
          </text>
        </g>
        {/* Main number */}
        <g transform={`translate(0, ${heroNum.translateY})`} opacity={heroNum.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.white}>
            {dayCounter}
          </text>
        </g>
        {/* Subtitle lines */}
        <g transform={`translate(0, ${subtitleA.translateY})`} opacity={subtitleA.opacity}>
          <text x={540} y={500} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent}>
            LEARNING AGENT AI
          </text>
        </g>
        <g transform={`translate(0, ${subtitleB.translateY})`} opacity={subtitleB.opacity}>
          <text x={540} y={555} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            FROM FIRST PRINCIPLES
          </text>
        </g>

        {/* ── ZONE C — Robot illustration + bento cards ───────────────────── */}
        {/* Robot head */}
        <g opacity={robotBody.opacity} transform={`translate(540, ${700 + robotBody.translateY + breathe})`}>
          {/* Head */}
          <rect x={-80} y={-80} width={160} height={140} rx={24}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Eyes */}
          <ellipse cx={-35} cy={-20} rx={16} ry={16 * eyeScaleY}
            fill={COLORS.accent} opacity={shimmer} />
          <ellipse cx={35} cy={-20} rx={16} ry={16 * eyeScaleY}
            fill={COLORS.accent} opacity={shimmer} />
          {/* Mouth */}
          <rect x={-30} y={20} width={60} height={8} rx={4}
            fill={COLORS.accent} opacity={0.6} />
          {/* Antenna */}
          <line x1={0} y1={-80} x2={0} y2={-120}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={-125} r={8} fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -125px' }} />
          {/* Body */}
          <rect x={-60} y={70} width={120} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={2} />
          {/* Circuitry lines on body */}
          <path d="M -40,90 L -40,130 L 0,130 L 0,110 L 40,110 L 40,150"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={robotPathLen} strokeDashoffset={robotDash}
            strokeLinecap="round" opacity={0.7} />
          {/* Arms */}
          <rect x={-100} y={80} width={30} height={70} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
          <rect x={70} y={80} width={30} height={70} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1.5} />
        </g>

        {/* Accent ring around robot */}
        <circle cx={540} cy={700 + breathe} r={140} fill="none"
          stroke={COLORS.accent} strokeWidth={2} opacity={0.15 * shimmer}
          transform={`scale(${pulse})`} style={{ transformOrigin: '540px 700px' }} />

        {/* Bento card 1 — "DAY 31" */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={140} accent />
          <rect x={60} y={920} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1005} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            DAY
          </text>
          <text x={210} y={1005} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            31
          </text>
          <text x={280} y={1005} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            — What Is Autonomy?
          </text>
        </g>

        {/* Bento card 2 — Series info */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={160} />
          <text x={100} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            MODULE 5
          </text>
          <text x={100} y={1185} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Autonomy Levels
          </text>
        </g>

        {/* Bento card 3 — Total days */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={160} />
          <text x={600} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            PROGRESS
          </text>
          <text x={600} y={1185} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            31 / 120
          </text>
        </g>

        {/* Progress bar */}
        <g opacity={card3.opacity}>
          <rect x={60} y={1270} width={960} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={1270}
            width={interpolate(frame, [50, 90], [0, 960 * (31/120)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            height={8} rx={4} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* Floating accent particles */}
        {[0, 1, 2, 3, 4].map(i => {
          const px = 160 + i * 200;
          const py = 1400 + Math.sin(frame * 0.05 + i * 1.5) * 20;
          const pOp = interpolate(frame, [60 + i * 8, 80 + i * 8], [0, 0.3], { extrapolateRight: 'clamp' });
          return (
            <circle key={i} cx={px} cy={py} r={4 + i * 2} fill={COLORS.accent} opacity={pOp * shimmer} />
          );
        })}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
