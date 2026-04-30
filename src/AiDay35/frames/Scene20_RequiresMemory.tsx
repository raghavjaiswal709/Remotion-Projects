/**
 * Scene 20 — Requires Memory — What We Build Next
 * "It requires memory. That is exactly what we build next."
 * CSV: 77.020s → 79.620s | Duration: 113 frames (3.77s)
 *
 * Theme: Dark #0D0D0D + teal accent — FINAL scene, forward-looking
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):  "MEMORY" hero + brain SVG pulses in
 *   Phase 2 (frames 24–70): "DAY 36" badge + "WHAT WE BUILD NEXT" card
 *   Phase 3 (frames 64–end): insight card + closing breathe pulse
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
  const scale    = interpolate(progress, [0, 1], [0.65, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene20_RequiresMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const memoryE  = useSpringSnap(frame, 4);
  const brainE   = useSpringEntrance(frame, 10);

  // Phase 2
  const day36E   = useSpringSnap(frame, 28);
  const nextCardE = useSpringEntrance(frame, 40);

  // Phase 3
  const insightE = useSpringEntrance(frame, 64);

  const breathe  = Math.sin(frame * 0.1) * 4;
  const pulse    = 1 + Math.sin(frame * 0.12) * 0.025;
  const shimmer  = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.55, 1.0]);

  // Brain arc lines
  const brainArc1 = usePathDraw(frame, 16, 180, 22);
  const brainArc2 = usePathDraw(frame, 22, 160, 22);
  const brainArc3 = usePathDraw(frame, 28, 200, 22);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · WHAT'S NEXT" y={120} opacity={0.8} />
        </g>

        {/* MEMORY hero text */}
        <g transform={`scale(${memoryE.scale})`}
          style={{ transformOrigin: '540px 240px' }}
          opacity={memoryE.opacity}>
          <text x={540} y={268} textAnchor="middle"
            fontFamily={FONT} fontSize={144} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">MEMORY</text>
        </g>

        {/* Brain SVG illustration — Zone B */}
        <g opacity={brainE.opacity} transform={`translate(540, ${520 + breathe})`}
          style={{ transformOrigin: '540px 520px' }}>

          {/* Outer brain ellipse */}
          <ellipse cx={0} cy={0} rx={158} ry={128}
            fill={COLORS.accent} fillOpacity={0.1 * shimmer}
            stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} />

          {/* Inner left hemisphere split line */}
          <line x1={0} y1={-120} x2={0} y2={120}
            stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.5} />

          {/* Brain fold arcs — left lobe */}
          <path
            d="M -130,10 C -110,-30 -60,-60 -20,-30"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={180} strokeDashoffset={brainArc1}
            strokeLinecap="round" />
          <path
            d="M -120,50 C -90,10 -50,-10 -15,20"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={160} strokeDashoffset={brainArc2}
            strokeLinecap="round" />

          {/* Brain fold arcs — right lobe */}
          <path
            d="M 130,10 C 110,-30 60,-60 20,-30 Q 50,10 80,40 Q 100,60 130,50"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={200} strokeDashoffset={brainArc3}
            strokeLinecap="round" />

          {/* Floating pulsing ring */}
          <circle cx={0} cy={0} r={190 * pulse}
            fill="none"
            stroke={COLORS.accent} strokeWidth={1.5}
            strokeOpacity={0.25 * shimmer} />
        </g>

        {/* It requires label */}
        <text x={540} y={710} textAnchor="middle"
          fontFamily={FONT} fontSize={40} fontWeight={800}
          fill={COLORS.text_muted}
          opacity={brainE.opacity}>
          The agent requires this to function.
        </text>

        {/* DAY 36 badge */}
        <g transform={`scale(${day36E.scale})`}
          style={{ transformOrigin: '540px 800px' }}
          opacity={day36E.opacity}>
          <rect x={360} y={756} width={360} height={88} rx={20}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={812} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent}>DAY 36</text>
        </g>

        {/* WHAT WE BUILD NEXT card */}
        <g opacity={nextCardE.opacity} transform={`translate(0,${nextCardE.translateY})`}>
          <BentoCard x={60} y={874} w={960} h={142} accent />
          <rect x={60} y={874} width={6} height={142} rx={3} fill={COLORS.accent} />
          <text x={100} y={924} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">WHAT WE BUILD NEXT</text>
          <text x={100} y={976} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>Memory for Agentic AI</text>
        </g>

        {/* Bottom insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1048} w={960} h={130} />
          <rect x={60} y={1048} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1098} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>Without memory, the agent forgets</text>
          <text x={100} y={1143} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>what it found. Memory closes the loop.</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
