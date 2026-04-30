/**
 * Scene 04 — Today's Distinction
 * "Today, we draw a distinction that shapes every system design decision you will ever make."
 * CSV: 14.217s → 19.950s | Duration: 172 frames (5.73s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):   Bold headline builds word by word
 *   Phase 2 (frames 24–90):  Two diverging paths animate outward
 *   Phase 3 (frames 80–end): Pulse glow, slight sway on the destination labels
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 22) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene04_TodayDistinction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const today    = useSpringEntrance(frame, 4);
  const draw     = useSpringEntrance(frame, 10);
  const shapes   = useSpringEntrance(frame, 16);
  const every    = useSpringEntrance(frame, 22);

  // Phase 2 — paths diverge
  const forkE    = useSpringEntrance(frame, 30);
  const leftPath = usePathDraw(frame, 38, 220, 22);
  const rightPath= usePathDraw(frame, 38, 220, 22);
  const leftNodeE= useSpringEntrance(frame, 62);
  const rightNodeE=useSpringEntrance(frame, 70);

  // Phase 3
  const breathe = Math.sin(frame * 0.08) * 5;
  const pulse   = 1 + Math.sin(frame * 0.11) * 0.016;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · SYSTEM DESIGN" y={120} opacity={0.8} />
        </g>

        {/* ZONE B — Word-staggered headline */}
        <g opacity={today.opacity} transform={`translate(0,${today.translateY})`}>
          <text x={60} y={270} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent}>Today,</text>
        </g>
        <g opacity={draw.opacity} transform={`translate(0,${draw.translateY})`}>
          <text x={60} y={368} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>we draw a</text>
        </g>
        <g opacity={shapes.opacity} transform={`translate(0,${shapes.translateY})`}>
          <text x={60} y={450} fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">distinction</text>
        </g>
        <g opacity={every.opacity} transform={`translate(0,${every.translateY})`}>
          <text x={60} y={530} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>that shapes every system design decision</text>
        </g>

        {/* Animated divider line */}
        <line x1={60} y1={558} x2={1020} y2={558}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={every.opacity * 0.4}
          strokeDasharray={960} strokeDashoffset={usePathDraw(frame, 24, 960, 30)} />

        {/* ZONE C — Forking path diagram */}
        {/* Fork origin */}
        <g opacity={forkE.opacity} transform={`translate(540, ${660 + forkE.translateY})`}>
          <circle cx={0} cy={0} r={54}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>GOAL</text>
        </g>

        {/* Forking paths — left curve to AGENT */}
        <path d="M 486,660 C 400,700 200,760 200,850"
          fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={220} strokeDashoffset={leftPath} />
        {/* Forking path — right curve to PIPELINE */}
        <path d="M 594,660 C 680,700 880,760 880,850"
          fill="none" stroke={COLORS.text_muted} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={220} strokeDashoffset={rightPath} />

        {/* Left node — AGENT */}
        <g opacity={leftNodeE.opacity}
           transform={`translate(200, ${900 + leftNodeE.translateY + breathe})`}>
          <rect x={-140} y={-58} width={280} height={116} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}>AGENT</text>
          <text x={0} y={32} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>adaptive</text>
        </g>

        {/* Right node — PIPELINE */}
        <g opacity={rightNodeE.opacity}
           transform={`translate(880, ${900 + rightNodeE.translateY - breathe * 0.7})`}>
          <rect x={-140} y={-58} width={280} height={116} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>PIPELINE</text>
          <text x={0} y={32} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>rigid</text>
        </g>

        {/* Dramatic label: DISTINCTION */}
        <g opacity={leftNodeE.opacity}>
          <text x={540} y={1070} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em" opacity={0.6}>DISTINCTION</text>
        </g>

        {/* Impact card */}
        <g opacity={rightNodeE.opacity} transform={`translate(0,${rightNodeE.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={140} accent />
          <rect x={60} y={1120} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1170} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Shapes every system design decision
          </text>
          <text x={100} y={1216} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>you will ever make</text>
        </g>

        {/* Bottom note tiles */}
        <g opacity={rightNodeE.opacity}>
          <BentoCard x={60} y={1300} w={460} h={110} />
          <text x={290} y={1344} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Architecture</text>
          <text x={290} y={1378} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>blueprint level</text>
        </g>
        <g opacity={rightNodeE.opacity}>
          <BentoCard x={560} y={1300} w={460} h={110} />
          <text x={790} y={1344} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Core question:</text>
          <text x={790} y={1378} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>adapt or execute?</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
