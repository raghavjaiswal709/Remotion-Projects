/**
 * Scene 28 — That Is Exactly What We Cover Next
 * "That is exactly what we cover next."
 * CSV: 105.760s → 107.860s
 * Duration: ~63 frames (last scene)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–45): Forward arrow + next topic card
 *   Phase 3 (35–end): Micro breathe
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene28_CoverNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 15, arrowLen, 18);

  const cardEnt = useSpringEntrance(frame, 18);
  const todayCard = useSpringEntrance(frame, 26);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s28.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="NEXT SESSION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={340} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Cover Next
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={540} y={430} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Overloading Rules & Edge Cases
          </text>
        </g>

        {/* Today recap card */}
        <g opacity={todayCard.opacity} transform={`translate(0, ${todayCard.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={200} accent={false} />
          <text x={100} y={610}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            TODAY
          </text>
          <text x={100} y={660}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Compile-Time Polymorphism
          </text>
          <text x={100} y={710}
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            Method overloading introduced via booking scenario
          </text>

          {/* Check badge */}
          <circle cx={950} cy={640} r={24} fill={COLORS.accent} opacity={0.12} />
          <path d="M 938,640 L 946,650 L 964,628"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Arrow down */}
        <path d="M 540,740 L 540,860"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Next session card */}
        <g opacity={cardEnt.opacity} transform={`translate(0, ${cardEnt.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={240} accent />
          <rect x={60} y={880} width={6} height={240} rx={3} fill={COLORS.accent} />

          <text x={100} y={950}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            NEXT
          </text>
          <text x={100} y={1000}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Overloading Deep Dive
          </text>
          <text x={100} y={1050}
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            Parameter rules, type widening, ambiguity, varargs
          </text>

          {/* Forward arrow icon */}
          <g transform="translate(950, 980)">
            <circle cx={0} cy={0} r={24} fill={COLORS.accent} opacity={0.12} />
            <path d="M -8,-8 L 8,0 L -8,8" fill="none"
              stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Locomotive heading forward */}
        <g opacity={0.06} transform={`translate(${interpolate(frame, [0, 63], [100, 600], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })}, 1350)`}>
          <rect x={0} y={10} width={180} height={50} rx={8} fill={COLORS.accent} />
          <rect x={140} y={0} width={60} height={60} rx={5} fill={COLORS.accent} />
          <rect x={30} y={-10} width={24} height={20} rx={3} fill={COLORS.accent} />
          <circle cx={40} cy={70} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={100} cy={70} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={170} cy={70} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
        </g>

        {/* Tracks */}
        <line x1={60} y1={1440} x2={1020} y2={1440}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        <line x1={60} y1={1456} x2={1020} y2={1456}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={80 + i * 60} y={1441} width={22} height={14} rx={2}
            fill={COLORS.text_muted} opacity={0.05} />
        ))}

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s28.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
