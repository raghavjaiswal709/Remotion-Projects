/**
 * Scene 07 — Step 1 Search
 * "Step 1. Search."
 * CSV: 28.917s → 31.283s | Duration: 71 frames (2.37s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Large "1" badge slams in
 *   Phase 2 (frames 16–50): "SEARCH" hero text + magnifier SVG builds
 *   Phase 3 (frames 45–end): Magnifier pulse + glow ring
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
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

function useSpringSnap(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_SNAP });
  const opacity  = interpolate(f, [0, 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scale    = interpolate(progress, [0, 1], [0.6, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene07_Step1Search: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const numSnap = useSpringSnap(frame, 4);

  // Phase 2
  const searchE = useSpringEntrance(frame, 16);
  const circleReveal = usePathDraw(frame, 16, 502, 24); // ~circle circumference r=80
  const handleReveal = usePathDraw(frame, 36, 90, 12);

  // Phase 3
  const pulse      = 1 + Math.sin(frame * 0.12) * 0.02;
  const glowOpacity = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.04, 0.12]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* Step badge */}
        <g
          transform={`translate(540, 400) scale(${numSnap.scale})`}
          style={{ transformOrigin: '540px 400px' }}
          opacity={numSnap.opacity}
        >
          {/* Glow ring */}
          <circle cx={0} cy={0} r={100} fill={COLORS.accent} fillOpacity={glowOpacity} />
          {/* Outer ring */}
          <circle cx={0} cy={0} r={88} fill="none" stroke={COLORS.accent}
            strokeWidth={3.5} strokeDasharray={502} strokeDashoffset={circleReveal} />
          {/* Step number */}
          <text x={0} y={-28} textAnchor="middle" fontFamily={FONT}
            fontSize={40} fontWeight={800} fill={COLORS.text_muted}>STEP</text>
          <text x={0} y={74} textAnchor="middle" fontFamily={FONT}
            fontSize={140} fontWeight={800} fill={COLORS.accent}>1</text>
        </g>

        {/* SEARCH hero text */}
        <g opacity={searchE.opacity} transform={`translate(0,${searchE.translateY})`}>
          <text x={540} y={620} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.white}>
            SEARCH
          </text>
        </g>

        {/* Magnifier illustration */}
        <g opacity={numSnap.opacity} transform={`translate(540, 980) scale(${pulse})`}
          style={{ transformOrigin: '540px 980px' }}>
          {/* Glass circle */}
          <circle cx={0} cy={-60} r={140} fill="none" stroke={COLORS.accent}
            strokeWidth={12} strokeDasharray={880} strokeDashoffset={circleReveal * 1.75} />
          {/* Handle */}
          <line x1={90} y1={45} x2={200} y2={145}
            stroke={COLORS.accent} strokeWidth={14} strokeLinecap="round"
            strokeDasharray={90} strokeDashoffset={handleReveal} />
          {/* Highlight inside glass */}
          <circle cx={-30} cy={-100} r={35} fill="none" stroke="rgba(255,255,255,0.15)"
            strokeWidth={4} />
        </g>

        {/* Insight card */}
        <g opacity={searchE.opacity} transform={`translate(0,${searchE.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={90} accent />
          <text x={540} y={1233} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Query external knowledge — web, database, or docs
          </text>
        </g>

        {/* Glow ambient */}
        <circle cx={540} cy={980} r={180} fill={COLORS.accent} fillOpacity={glowOpacity * 2}
          opacity={numSnap.opacity} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
