/**
 * Scene 24 — Where We Go Next
 * "And that is exactly where we go next."
 * CSV: 105.260s → 108.460s
 * Duration: 80 frames (2.67s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–12): Label + headline
 *   Phase 2 (frames 10–45): Today recap, tomorrow preview, arrow draw
 *   Phase 3 (frames 40–end): Micro-animations
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
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 24) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene24_WhereWeGoNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 3);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Today recap
  const todayEnt = useSpringEntrance(frame, 8);
  const todayItems = [
    'Object class — root of every hierarchy',
    'toString / equals / hashCode inherited',
    'Override to customize behavior',
    'Compile-time polymorphism (overloading)',
  ];
  const todayEnts = todayItems.map((_, i) => useSpringEntrance(frame, 12 + i * 5));

  // Arrow
  const arrowLen = 140;
  const arrowDash = usePathDraw(frame, 32, arrowLen, 16);

  // Tomorrow card
  const tmrEnt = useSpringEntrance(frame, 38);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            What's Next
          </text>
          <text x={60} y={370} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Day 43 Preview
          </text>
        </g>

        {/* ── TODAY RECAP ──────────────────────────────────────────────── */}
        <g opacity={todayEnt.opacity} transform={`translate(0, ${todayEnt.translateY})`}>
          <text x={60} y={470} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em">
            TODAY — DAY 42
          </text>
        </g>

        {todayItems.map((item, i) => {
          const cardY = 500 + i * 100;
          return (
            <g key={i} opacity={todayEnts[i].opacity}
              transform={`translate(0, ${todayEnts[i].translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={80} />
              <circle cx={100} cy={cardY + 40} r={8} fill={COLORS.accent} fillOpacity={0.2} />
              <circle cx={100} cy={cardY + 40} r={4} fill={COLORS.accent} />
              <text x={130} y={cardY + 50} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.white}>{item}</text>
            </g>
          );
        })}

        {/* ── Arrow ────────────────────────────────────────────────────── */}
        <line x1={540} y1={910} x2={540} y2={1050}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* ── TOMORROW CARD ────────────────────────────────────────────── */}
        <g opacity={tmrEnt.opacity} transform={`translate(0, ${tmrEnt.translateY})`}>
          <BentoCard x={60} y={1070} w={960} h={260} accent />
          <rect x={60} y={1070} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.15em">TOMORROW — DAY 43</text>
          <text x={100} y={1180} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">Runtime Polymorphism</text>
          <text x={100} y={1240} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Method Overriding + Dynamic Dispatch</text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>The JVM decides which method to call at runtime</text>
        </g>

        {/* ── Train illustration ───────────────────────────────────────── */}
        <g transform={`translate(270, ${1440 + breathe})`} opacity={tmrEnt.opacity * shimmer}>
          {/* Track */}
          <line x1={0} y1={120} x2={540} y2={120}
            stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={0} y1={130} x2={540} y2={130}
            stroke={COLORS.text_muted} strokeWidth={3} />
          {/* Cross-ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={20 + i * 45} y={115} width={24} height={20} rx={2}
              fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1} />
          ))}
          {/* Locomotive body */}
          <rect x={320} y={40} width={200} height={80} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab */}
          <rect x={440} y={10} width={80} height={110} rx={6}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Window */}
          <rect x={455} y={24} width={50} height={36} rx={4}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={1} />
          {/* Smokestack */}
          <rect x={340} y={18} width={20} height={22} rx={4}
            fill={COLORS.accent} fillOpacity={0.3} />
          {/* Wheels */}
          <circle cx={360} cy={120} r={18} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={440} cy={120} r={18} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={500} cy={120} r={18} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          {/* Wheel spokes */}
          {[360, 440, 500].map(cx => (
            <g key={cx} transform={`rotate(${frame * 3}, ${cx}, 120)`}>
              <line x1={cx} y1={104} x2={cx} y2={136}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <line x1={cx - 16} y1={120} x2={cx + 16} y2={120}
                stroke={COLORS.accent} strokeWidth={1.5} />
            </g>
          ))}
          {/* Arrow pointing right (→ next day) */}
          <g transform={`translate(${540 + Math.sin(frame * 0.1) * 6}, 75)`}>
            <polygon points="0,-12 20,0 0,12" fill={COLORS.accent}
              transform={`scale(${pulse})`} style={{ transformOrigin: '10px 0px' }} />
          </g>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={120} cy={1700 - breathe} r={3} fill={COLORS.accent} fillOpacity={0.1} />
        <circle cx={960} cy={1680 + breathe} r={2} fill={COLORS.accent} fillOpacity={0.08} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
