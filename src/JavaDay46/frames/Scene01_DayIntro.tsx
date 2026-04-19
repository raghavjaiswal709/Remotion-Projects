/**
 * Scene 01 — Day Intro
 * "This is day 46 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 5.500s
 * Duration: ~182 frames
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — label + headline spring in
 *   Phase 2 (frames 20–90):  Content build — day badge, module card, locomotive
 *   Phase 3 (frames 80–end): Steady-state — float, pulse, shimmer
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const locoEntrance = useSpringEntrance(frame, 56);

  // Day counter
  const dayCount = useCounter(frame, 20, 46, 40);

  // Progress bar
  const progressWidth = interpolate(frame, [25, 65], [0, (46 / 105) * 860], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Track lines
  const trackLen = 960;
  const trackDash = usePathDraw(frame, 50, trackLen, 35);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const wheelRot = frame * 3;

  // Border draw for accent card
  const perim1 = 2 * (960 + 200);
  const borderDash1 = interpolate(frame, [20, 50], [perim1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Day headline ────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            DAY
          </text>
          <text x={160} y={280} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            {dayCount}
          </text>
          <text x={240} y={280} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            / 105
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Upcasting
          </text>
          <text x={60} y={460} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Parent References, Child Objects
          </text>
        </g>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <rect x={60} y={500} width={960} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={500} width={progressWidth} height={8} rx={4} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* ── ZONE C — Module card with border draw ────────────────────── */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <rect x={60} y={560} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perim1} strokeDashoffset={borderDash1} />
          <rect x={60} y={560} width={960} height={200} rx={20}
            fill={COLORS.bg_secondary} opacity={0.95} />
          <rect x={60} y={560} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={640} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} letterSpacing="0.12em">
            MODULE 3
          </text>
          <text x={100} y={700} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Ticketing Engine
          </text>
          <text x={100} y={740} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Parts 43–63 · Polymorphism & Casting
          </text>
        </g>

        {/* ── Locomotive illustration ───────────────────────────────────── */}
        <g opacity={locoEntrance.opacity} transform={`translate(${60 + locoEntrance.translateY * 2}, ${840 + breathe})`}>
          {/* Tracks */}
          <line x1={0} y1={340} x2={960} y2={340} stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          <line x1={0} y1={350} x2={960} y2={350} stroke={COLORS.text_muted} strokeWidth={4}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          {/* Cross ties */}
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={30 + i * 60} y={335} width={40} height={20} rx={3}
              fill={COLORS.text_muted} opacity={0.3} />
          ))}

          {/* Locomotive body */}
          <rect x={120} y={140} width={500} height={180} rx={16} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Cab */}
          <rect x={520} y={80} width={180} height={240} rx={12} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Window */}
          <rect x={550} y={110} width={120} height={80} rx={8}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Smokestack */}
          <rect x={160} y={80} width={50} height={60} rx={6} fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={185} cy={65} r={20} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
          {/* Headlight */}
          <circle cx={140} cy={230} r={18} fill={COLORS.accent} fillOpacity={0.3 * pulse}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Wheels */}
          <g transform={`rotate(${wheelRot}, 220, 330)`}>
            <circle cx={220} cy={330} r={35} fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <line x1={220} y1={295} x2={220} y2={365} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            <line x1={185} y1={330} x2={255} y2={330} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          </g>
          <g transform={`rotate(${wheelRot}, 400, 330)`}>
            <circle cx={400} cy={330} r={35} fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <line x1={400} y1={295} x2={400} y2={365} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
            <line x1={365} y1={330} x2={435} y2={330} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          </g>
          <g transform={`rotate(${wheelRot}, 580, 330)`}>
            <circle cx={580} cy={330} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <line x1={580} y1={302} x2={580} y2={358} stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          </g>
          {/* Coupling */}
          <rect x={90} y={240} width={30} height={12} rx={3} fill={COLORS.accent} opacity={0.6} />
          {/* Label on locomotive */}
          <text x={370} y={250} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            DAY 46
          </text>
        </g>

        {/* ── Topic summary cards ──────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1300} w={460} h={180} />
          <text x={100} y={1380} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Yesterday
          </text>
          <text x={100} y={1430} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Runtime Polymorphism
          </text>

          <BentoCard x={560} y={1300} w={460} h={180} accent />
          <text x={600} y={1380} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Today
          </text>
          <text x={600} y={1430} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Upcasting
          </text>
        </g>

        {/* ── Floating accents ─────────────────────────────────────────── */}
        <g transform={`translate(900, ${1550 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(160, ${1600 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

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
