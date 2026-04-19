/**
 * Scene 23 — Record Has A Name Next
 * "That record has a name, and we define it next."
 * CSV: 86.100s → 88.620s | Duration: 77 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–55): Teaser card + question mark
 *   Phase 3 (50–end): Micro
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene23_RecordHasNameNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const card4 = useSpringEntrance(frame, 56);

  // Question mark reveal
  const qLen = 120;
  const qDash = usePathDraw(frame, 24, qLen, 20);

  // Name reveal with typewriter
  const nameText = "TRAJECTORY";
  const charsVisible = Math.floor(
    interpolate(frame, [36, 36 + nameText.length * 2], [0, nameText.length], {
      extrapolateRight: 'clamp',
    })
  );
  const displayName = nameText.slice(0, charsVisible);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Cursor blink
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · PREVIEW" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>That Record</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>Has a Name</text>
        </g>

        {/* Card 1 — Big question mark */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={340} accent />
          <g transform="translate(540, 620)">
            {/* Large ? path */}
            <path
              d="M -20,-80 Q -20,-120 20,-120 Q 60,-120 60,-80 Q 60,-50 20,-40 L 20,0"
              fill="none" stroke={COLORS.accent} strokeWidth={8}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={qLen} strokeDashoffset={qDash} />
            {/* Dot under ? */}
            <circle cx={20} cy={30} r={6} fill={COLORS.accent}
              opacity={interpolate(frame, [40, 45], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })} />
          </g>

          <text x={540} y={770} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            What do we call this record?
          </text>
        </g>

        {/* Card 2 — Typewriter name reveal */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={260} accent />
          <text x={540} y={960} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}
            letterSpacing="0.15em">
            TOMORROW WE DEFINE
          </text>

          {/* Typewriter text */}
          <text x={540} y={1060} textAnchor="middle" fontFamily={FONT}
            fontSize={80} fontWeight={800} fill={COLORS.accent}
            letterSpacing="0.1em">
            {displayName}
            {/* Cursor */}
            {cursorOn && charsVisible < nameText.length && (
              <tspan fill={COLORS.accent}>|</tspan>
            )}
          </text>
        </g>

        {/* Card 3 — Day 32 teaser */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={180} />
          <rect x={100} y={1190} width={100} height={36} rx={18}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1} />
          <text x={150} y={1214} textAnchor="middle" fontFamily={FONT}
            fontSize={18} fontWeight={800} fill={COLORS.accent}>
            DAY 32
          </text>
          <text x={100} y={1275} fontFamily={FONT} fontSize={28}
            fontWeight={800} fill={COLORS.white}>
            What Is a Trajectory?
          </text>
          <text x={100} y={1315} fontFamily={FONT} fontSize={22}
            fontWeight={800} fill={COLORS.text_muted}>
            The full path an agent walks
          </text>
        </g>

        {/* Card 4 — Arrow teaser */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={180} />
          {/* Forward arrow */}
          <g transform="translate(790, 1250)">
            <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.06}
              stroke={COLORS.accent} strokeWidth={2} />
            <path d="M -12,-10 L 10,0 L -12,10" fill="none"
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
              strokeLinejoin="round" />
          </g>
          <text x={600} y={1320} fontFamily={FONT} fontSize={24}
            fontWeight={800} fill={COLORS.text_muted}>
            Continue tomorrow
          </text>
        </g>

        {/* Summary */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={100} />
          <text x={540} y={1442} textAnchor="middle" fontFamily={FONT}
            fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Autonomy leaves a trace —{' '}
            <tspan fill={COLORS.accent}>we name it next</tspan>
          </text>
        </g>

        {/* Micro */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
