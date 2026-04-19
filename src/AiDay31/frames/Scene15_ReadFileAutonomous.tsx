/**
 * Scene 15 — Read File Autonomous
 * "Reading a file? Autonomous. Summarizing a document? Autonomous."
 * CSV: 52.700s → 57.300s | Duration: 138 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–90): Two safe-action examples with green checks
 *   Phase 3 (80–end): Micro animations
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene15_ReadFileAutonomous: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 38);
  const card3 = useSpringEntrance(frame, 54);
  const card4 = useSpringEntrance(frame, 68);

  // Checkmark path draws
  const check1Len = 60;
  const check1Dash = usePathDraw(frame, 30, check1Len, 15);
  const check2Len = 60;
  const check2Dash = usePathDraw(frame, 48, check2Len, 15);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · SAFE ACTIONS" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800}
            fill={COLORS.accent}>
            Autonomous
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted}>
            Read-only actions are always safe
          </text>
        </g>

        {/* Card 1 — Reading a file */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={320} accent />

          {/* File icon */}
          <g transform="translate(140, 560)">
            <rect x={-40} y={-50} width={80} height={100} rx={6}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Corner fold */}
            <path d="M 20,-50 L 40,-50 L 40,-30 L 20,-30 Z"
              fill={COLORS.accent} fillOpacity={0.2} />
            <path d="M 20,-50 L 20,-30 L 40,-30"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Text lines */}
            {[0, 1, 2, 3].map(i => (
              <rect key={i} x={-24} y={-20 + i * 18} width={48 - i * 6}
                height={6} rx={2} fill={COLORS.accent} fillOpacity={0.3} />
            ))}
          </g>

          {/* Label */}
          <text x={220} y={570} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            Reading a file
          </text>
          <text x={220} y={630} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Zero data change. Zero risk.
          </text>

          {/* Green checkmark */}
          <g transform="translate(900, 580)">
            <circle cx={0} cy={0} r={35} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -15,0 L -5,12 L 18,-14" fill="none"
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={check1Len} strokeDashoffset={check1Dash} />
          </g>

          {/* AUTONOMOUS badge */}
          <rect x={720} y={680} width={260} height={48} rx={24}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent}
            strokeWidth={1.5} />
          <text x={850} y={712} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.accent}>
            AUTONOMOUS
          </text>
        </g>

        {/* Card 2 — Summarizing a document */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={320} accent />

          {/* Document + magnifying glass icon */}
          <g transform="translate(140, 910)">
            <rect x={-40} y={-50} width={70} height={90} rx={6}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
            {[0, 1, 2].map(i => (
              <rect key={i} x={-24} y={-25 + i * 22} width={38}
                height={6} rx={2} fill={COLORS.accent} fillOpacity={0.3} />
            ))}
            {/* Magnifying glass */}
            <circle cx={30} cy={20} r={18} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} />
            <line x1={43} y1={33} x2={56} y2={46}
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          </g>

          <text x={220} y={920} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            Summarizing a doc
          </text>
          <text x={220} y={980} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Output only. No side effects.
          </text>

          {/* Green checkmark */}
          <g transform="translate(900, 930)">
            <circle cx={0} cy={0} r={35} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -15,0 L -5,12 L 18,-14" fill="none"
              stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={check2Len} strokeDashoffset={check2Dash} />
          </g>

          <rect x={720} y={1030} width={260} height={48} rx={24}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent}
            strokeWidth={1.5} />
          <text x={850} y={1062} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.accent}>
            AUTONOMOUS
          </text>
        </g>

        {/* Bottom summary cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={200} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Read-only
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Cannot harm any data
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={200} accent />
          <text x={600} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            100% reversible
          </text>
          <text x={600} y={1340} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Always safe to automate
          </text>
        </g>

        {/* Micro animations */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.15} />
        </g>

        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={180 + i * 240}
            cy={1600 + Math.sin(frame * 0.04 + i * 1.3) * 4}
            r={2} fill={COLORS.accent} opacity={0.07} />
        ))}

        <g opacity={interpolate(frame, [90, 105], [0, 0.25], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1700} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Let the agent handle these freely
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
