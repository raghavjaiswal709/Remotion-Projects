/**
 * Scene 01 — Day Intro
 * "This is day 35 of learning agent AI from first principles."
 * CSV: 0.000s → 5.200s | Duration: 156 frames (5.2s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — series badge, DAY counter spring in
 *   Phase 2 (frames 20–90):  Robot SVG illustration, headline text build
 *   Phase 3 (frames 80–end): Breathing pulse on robot, floating accent circles
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 20) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ──────────────────────────────────
  const sceneReveal   = spring({ frame, fps, config: SPRING_SOFT });
  const labelEntrance = useSpringEntrance(frame, 0);
  const badgeEntrance = useSpringEntrance(frame, 8);
  const seriesEntrance= useSpringEntrance(frame, 14);

  // ── Phase 2: Content build (frames 20–90) ────────────────────────────────
  const robotEntrance   = useSpringEntrance(frame, 20);
  const headlineEntrance= useSpringEntrance(frame, 30);
  const sublineEntrance = useSpringEntrance(frame, 42);
  const taglineEntrance = useSpringEntrance(frame, 54);

  // ── Path draw: circuit lines on robot (frames 40–65) ─────────────────────
  const circuitDash1 = usePathDraw(frame, 40, 120, 25);
  const circuitDash2 = usePathDraw(frame, 50, 80, 20);
  const circuitDash3 = usePathDraw(frame, 55, 100, 22);

  // ── Phase 3: Micro-animations (steady-state) ─────────────────────────────
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.7, 1]);
  const eyeGlow   = interpolate(Math.sin(frame * 0.10), [-1, 1], [0.6, 1.0]);
  const floatY    = Math.sin(frame * 0.05) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series + Day badge (y=60–200) ─────────────────────── */}
        <g opacity={labelEntrance.opacity} transform={`translate(0,${labelEntrance.translateY})`}>
          <SectionLabel text="AGENTIC AI · FIRST PRINCIPLES" y={120} opacity={0.8} />
        </g>

        <g opacity={badgeEntrance.opacity} transform={`translate(0,${badgeEntrance.translateY})`}>
          {/* DAY counter */}
          <rect x={60} y={140} width={200} height={60} rx={12}
            fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={160} y={181} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>DAY 35</text>
        </g>

        <g opacity={seriesEntrance.opacity} transform={`translate(0,${seriesEntrance.translateY})`}>
          {/* Topic pill */}
          <rect x={280} y={140} width={360} height={60} rx={12}
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          <text x={460} y={181} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>AGENT VS. PIPELINE</text>
        </g>

        {/* ── ZONE B — Headline (y=220–480) ───────────────────────────────── */}
        <g opacity={headlineEntrance.opacity} transform={`translate(0,${headlineEntrance.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={92} fontWeight={800} fill={COLORS.white}>
            Agent
          </text>
          <text x={60} y={410} fontFamily={FONT} fontSize={92} fontWeight={800} fill={COLORS.accent}>
            vs.
          </text>
        </g>
        <g opacity={sublineEntrance.opacity} transform={`translate(0,${sublineEntrance.translateY})`}>
          <text x={60} y={500} fontFamily={FONT} fontSize={92} fontWeight={800} fill={COLORS.white}>
            Pipeline
          </text>
        </g>

        {/* ── ZONE C — Massive Robot Illustration (y=540–1700) ────────────── */}
        <g opacity={robotEntrance.opacity}
          transform={`translate(540, ${1160 + robotEntrance.translateY + floatY})`}>

          {/* Robot body — torso */}
          <rect x={-130} y={-240} width={260} height={220} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Robot torso inner panel */}
          <rect x={-100} y={-220} width={200} height={160} rx={12}
            fill="rgba(118,171,174,0.06)" stroke={COLORS.accent_mid} strokeWidth={1} />

          {/* Circuit board lines on torso */}
          <path d="M -60,-200 L -60,-160 L 20,-160 L 20,-140"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={120} strokeDashoffset={circuitDash1} strokeLinecap="round" />
          <path d="M 60,-200 L 60,-170 L -20,-170"
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={80} strokeDashoffset={circuitDash2} strokeLinecap="round" />
          <path d="M -80,-180 L 0,-180 L 0,-100"
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5}
            strokeDasharray={100} strokeDashoffset={circuitDash3} strokeLinecap="round" />

          {/* CPU chip in center of torso */}
          <rect x={-40} y={-180} width={80} height={80} rx={6}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <rect x={-28} y={-168} width={56} height={56} rx={4}
            fill="rgba(118,171,174,0.10)" stroke={COLORS.accent_mid} strokeWidth={1} />
          <text x={0} y={-128} textAnchor="middle" fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>AI</text>

          {/* Core dot grid on chip */}
          {[-12, 0, 12].map(cx => [-12, 0, 12].map(cy => (
            <circle key={`d${cx}${cy}`} cx={cx} cy={cy - 148} r={2.5}
              fill={COLORS.accent} opacity={0.5} />
          )))}

          {/* Torso status lights */}
          <circle cx={-70} cy={-60} r={8} fill={COLORS.accent} opacity={eyeGlow * 0.9} />
          <circle cx={-45} cy={-60} r={8} fill={COLORS.accent} opacity={eyeGlow * 0.6} />
          <circle cx={-20} cy={-60} r={8} fill={COLORS.vibrant_red} opacity={0.4} />

          {/* Robot head */}
          <rect x={-90} y={-380} width={180} height={130} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />

          {/* Head inner glow */}
          <rect x={-76} y={-366} width={152} height={102} rx={10}
            fill={COLORS.accent_dim} stroke="none" />

          {/* Eyes */}
          <rect x={-60} y={-350} width={44} height={28} rx={6}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <rect x={16} y={-350} width={44} height={28} rx={6}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eye pupils */}
          <circle cx={-38} cy={-336} r={8}
            fill={COLORS.accent} opacity={eyeGlow} transform={`scale(${pulse})`}
            style={{ transformOrigin: '-38px -336px' }} />
          <circle cx={38} cy={-336} r={8}
            fill={COLORS.accent} opacity={eyeGlow} transform={`scale(${pulse})`}
            style={{ transformOrigin: '38px -336px' }} />

          {/* Antenna */}
          <line x1={0} y1={-380} x2={0} y2={-430} stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={-440} r={12}
            fill={COLORS.accent} opacity={0.8 * shimmer} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px -440px' }} />

          {/* Neck connector */}
          <rect x={-20} y={-252} width={40} height={14} rx={4}
            fill={COLORS.accent_mid} />

          {/* Left arm */}
          <rect x={-220} y={-220} width={82} height={160} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Left shoulder joint */}
          <circle cx={-172} cy={-220} r={14}
            fill={COLORS.accent} opacity={0.8} />
          {/* Left arm panel */}
          <rect x={-204} y={-200} width={50} height={80} rx={8}
            fill={COLORS.accent_dim} stroke="none" />

          {/* Right arm */}
          <rect x={138} y={-220} width={82} height={160} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={172} cy={-220} r={14}
            fill={COLORS.accent} opacity={0.8} />
          <rect x={154} y={-200} width={50} height={80} rx={8}
            fill={COLORS.accent_dim} stroke="none" />

          {/* Legs */}
          <rect x={-110} y={-22} width={90} height={140} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={20} y={-22} width={90} height={140} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />

          {/* Feet */}
          <rect x={-120} y={108} width={110} height={38} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />
          <rect x={10} y={108} width={110} height={38} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />
        </g>

        {/* Floating accent spheres (Phase 3) */}
        <circle cx={140} cy={900} r={30}
          fill={COLORS.accent} fillOpacity={0.05 * shimmer}
          stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.2}
          transform={`translate(0,${breathe * 1.5})`} />
        <circle cx={940} cy={980} r={22}
          fill={COLORS.accent} fillOpacity={0.04 * shimmer}
          stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.15}
          transform={`translate(0,${-breathe})`} />
        <circle cx={100} cy={1180} r={16}
          fill={COLORS.accent} fillOpacity={0.07}
          transform={`translate(0,${breathe * 2})`} />

        {/* ── Tagline card ─────────────────────────────────────────────────── */}
        <g opacity={taglineEntrance.opacity} transform={`translate(0,${taglineEntrance.translateY})`}>
          <rect x={60} y={1650} width={960} height={72} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent_mid} strokeWidth={1} />
          <text x={540} y={1695} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>What makes an agent different?</text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s01.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
