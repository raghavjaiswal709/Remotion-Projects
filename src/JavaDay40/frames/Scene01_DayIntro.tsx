/**
 * Scene 01 — Day Intro
 * "This is day 40 of learning National Railway System in Java from first principles."
 * CSV: 0.000s → 6.360s | Duration: 191 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Day counter + module label spring in
 *   Phase 2 (20–90): Topic title + locomotive illustration build
 *   Phase 3 (80–end): Micro-animations — breathe, pulse, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = FPS;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const dayNumE = useSpringEntrance(frame, 6);
  const titleE = useSpringEntrance(frame, 14);
  const subtitleE = useSpringEntrance(frame, 22);

  // Phase 2
  const card1 = useSpringEntrance(frame, 30);
  const card2 = useSpringEntrance(frame, 42);
  const card3 = useSpringEntrance(frame, 54);

  // Locomotive illustration
  const locoE = useSpringEntrance(frame, 36);
  const trackLen = 960;
  const trackDash = usePathDraw(frame, 40, trackLen, 35);
  const wheelSpin = interpolate(frame, [0, 191], [0, 720], { extrapolateRight: 'clamp' });

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Progress bar
  const progressW = interpolate(frame, [10, 60], [0, (40 / 105) * 960], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A — Module label */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="MODULE 2 · NETWORK EXPANSION" y={120} />
        </g>

        {/* Day badge */}
        <g transform={`translate(0, ${dayNumE.translateY})`} opacity={dayNumE.opacity}>
          <text x={60} y={220} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent} letterSpacing="0.05em">
            DAY 40
          </text>
          <text x={240} y={220} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            / 105
          </text>
          {/* Progress track */}
          <rect x={60} y={240} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={240} width={progressW} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* Zone B — Title */}
        <g transform={`translate(0, ${titleE.translateY})`} opacity={titleE.opacity}>
          <text x={60} y={360} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>Static Block</text>
        </g>
        <g transform={`translate(0, ${subtitleE.translateY})`} opacity={subtitleE.opacity}>
          <text x={60} y={440} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            One-time class-level initialization
          </text>
        </g>

        {/* Zone C — Locomotive illustration */}
        <g opacity={locoE.opacity} transform={`translate(0, ${locoE.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={460} accent />
          {/* Locomotive body */}
          <rect x={160} y={620} width={400} height={180} rx={12} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={560} y={660} width={200} height={140} rx={8} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Cab window */}
          <rect x={580} y={680} width={80} height={60} rx={6} fill={COLORS.accent} fillOpacity={0.25} />
          {/* Smokestack */}
          <rect x={200} y={580} width={40} height={40} rx={4} fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Wheels with rotation */}
          {[240, 380, 500, 640].map((wx, i) => (
            <g key={i} transform={`translate(${wx}, 810)`}>
              <circle r={32} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
              <circle r={6} fill={COLORS.accent} fillOpacity={0.5} />
              <line x1={0} y1={0} x2={0} y2={-28}
                stroke={COLORS.accent} strokeWidth={2} opacity={0.6}
                transform={`rotate(${wheelSpin + i * 90})`} style={{ transformOrigin: '0px 0px' }} />
            </g>
          ))}
          {/* Tracks */}
          <line x1={60} y1={850} x2={1020} y2={850} stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          <line x1={60} y1={870} x2={1020} y2={870} stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={trackLen} strokeDashoffset={trackDash} />
          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 80} y={845} width={8} height={30} rx={2}
              fill={COLORS.text_muted} opacity={locoE.opacity * 0.4} />
          ))}
          {/* Label */}
          <text x={540} y={940} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white} opacity={0.8}>NATIONAL RAILWAY · JAVA</text>
        </g>

        {/* Info cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={160} />
          <text x={100} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>MODULE</text>
          <text x={100} y={1130} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>Network Expansion</text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1020} w={460} h={160} accent />
          <text x={600} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>TOPIC</text>
          <text x={600} y={1130} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>Static Block</text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1210} w={960} h={140} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            One-time initialization before any object exists
          </text>
        </g>

        {/* Floating accent dot */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle r={40} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
          <circle r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.5} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s01.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
