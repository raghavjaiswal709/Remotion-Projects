/**
 * Scene 22 — Build Next
 * "And that is exactly what we build next."
 * Duration: 61 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–15): Label + headline
 *   Phase 2 (frames 10–40): Day 46 teaser card + arrow
 *   Phase 3 (frames 35–end): Pulse, shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene22_BuildNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 8);
  const dayCard = useSpringEntrance(frame, 14);
  const arrowEnt = useSpringEntrance(frame, 20);
  const summaryA = useSpringEntrance(frame, 26);
  const summaryB = useSpringEntrance(frame, 32);
  const summaryC = useSpringEntrance(frame, 38);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Arrow path
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 18);

  // Tomorrow card border
  const borderLen = 2 * (960 + 240);
  const borderDash = usePathDraw(frame, 14, borderLen, 28);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · NEXT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>What We Build</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent}>Next</text>
        </g>

        {/* ── Tomorrow card ────────────────────────────────────────────── */}
        <g opacity={dayCard.opacity} transform={`translate(0, ${dayCard.translateY})`}>
          <rect x={60} y={500} width={960} height={240} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={60} y={500} width={960} height={240} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={borderLen} strokeDashoffset={borderDash} />
          <text x={100} y={570} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>TOMORROW — DAY 46</text>
          <text x={100} y={640} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">Upcasting</text>
          <text x={100} y={700} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Casting child references to parent types</text>
        </g>

        {/* ── Arrow ─────────────────────────────────────────────────────── */}
        <g opacity={arrowEnt.opacity} transform={`translate(540, ${780 + breathe})`}>
          <path d="M 0,0 L 0,80 M -20,60 L 0,80 L 20,60"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />
        </g>

        {/* ── Today summary tiles ──────────────────────────────────────── */}
        <g opacity={summaryA.opacity} transform={`translate(0, ${summaryA.translateY})`}>
          <BentoCard x={60} y={900} w={960} h={130} />
          <rect x={60} y={900} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={978} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Runtime polymorphism = dynamic dispatch</text>
        </g>

        <g opacity={summaryB.opacity} transform={`translate(0, ${summaryB.translateY})`}>
          <BentoCard x={60} y={1050} w={960} h={130} />
          <rect x={60} y={1050} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1128} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Parent reference holds child object</text>
        </g>

        <g opacity={summaryC.opacity} transform={`translate(0, ${summaryC.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={130} accent />
          <rect x={60} y={1200} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1278} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>This connection = upcasting</text>
        </g>

        {/* ── Locomotive illustration ───────────────────────────────────── */}
        <g opacity={summaryC.opacity * shimmer} transform={`translate(300, ${1500 + breathe})`}>
          {/* Body */}
          <rect x={0} y={0} width={480} height={120} rx={16} fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={380} y={-30} width={100} height={150} rx={10} fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Smokestack */}
          <rect x={60} y={-40} width={30} height={40} rx={6} fill={COLORS.accent} fillOpacity={0.12} />
          {/* Wheels */}
          <circle cx={80} cy={130} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={200} cy={130} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={340} cy={130} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={440} cy={130} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Axle dots */}
          <circle cx={80} cy={130} r={6} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={200} cy={130} r={6} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={340} cy={130} r={6} fill={COLORS.accent} fillOpacity={0.3} />
          {/* Rails */}
          <line x1={-40} y1={158} x2={520} y2={158} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={-40} y1={165} x2={520} y2={165} stroke={COLORS.text_muted} strokeWidth={2} />
          {/* Cross ties */}
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={-20 + i * 56} y={155} width={16} height={5} rx={1}
              fill={COLORS.text_muted} opacity={0.4} />
          ))}
          {/* Window */}
          <rect x={400} y={-10} width={50} height={60} rx={6}
            fill={COLORS.accent} fillOpacity={0.15} />
          {/* Steam puffs */}
          <circle cx={75} cy={-55 + breathe * 0.5} r={12}
            fill={COLORS.accent} fillOpacity={0.06 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '75px -55px' }} />
          <circle cx={55} cy={-70 + breathe * 0.7} r={9}
            fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
