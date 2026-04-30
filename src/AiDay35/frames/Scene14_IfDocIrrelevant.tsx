/**
 * Scene 14 — If Doc Is Irrelevant
 * "If the document is irrelevant, the agent skips it and fetches another."
 * CSV: 52.550s → 55.980s | Duration: 103 frames (3.43s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–24):  IF badge + "doc is irrelevant" condition
 *   Phase 2 (frames 22–70): Skip card (X), skip arrow, fetch new card
 *   Phase 3 (frames 65–end): Doc flutter micro-anim
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
  const scale    = interpolate(progress, [0, 1], [0.7, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene14_IfDocIrrelevant: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE    = useSpringEntrance(frame, 0);
  const ifBadge   = useSpringSnap(frame, 4);
  const condText  = useSpringEntrance(frame, 10);

  // Phase 2
  const skipCard  = useSpringEntrance(frame, 22);
  const skipArrow = usePathDraw(frame, 32, 160, 18);
  const fetchCard = useSpringEntrance(frame, 44);
  const insightE  = useSpringEntrance(frame, 62);

  // Phase 3
  const docFlutter = Math.sin(frame * 0.14) * 4;
  const skipPulse  = 1 + Math.sin(frame * 0.11) * 0.018;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · ADAPTATION" y={120} opacity={0.8} />
        </g>

        {/* IF badge */}
        <g transform={`scale(${ifBadge.scale})`}
          style={{ transformOrigin: '60px 250px' }}
          opacity={ifBadge.opacity}>
          <text x={60} y={258} fontFamily={FONT} fontSize={130} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">IF</text>
        </g>

        <g opacity={condText.opacity} transform={`translate(0,${condText.translateY})`}>
          <text x={218} y={250} fontFamily={FONT} fontSize={54} fontWeight={800}
            fill={COLORS.white}>document is</text>
          <text x={218} y={322} fontFamily={FONT} fontSize={66} fontWeight={800}
            fill={COLORS.vibrant_red}>irrelevant...</text>
        </g>

        {/* Skip card */}
        <g opacity={skipCard.opacity}
          transform={`translate(0,${skipCard.translateY + docFlutter}) scale(${skipPulse})`}
          style={{ transformOrigin: '540px 540px' }}>
          <BentoCard x={60} y={410} w={960} h={150} />
          <rect x={60} y={410} width={6} height={150} rx={3} fill={COLORS.vibrant_red} />
          {/* Doc icon */}
          <rect x={82} y={432} width={72} height={90} rx={6}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
          <line x1={94} y1={460} x2={140} y2={460}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="6 3" />
          <line x1={94} y1={476} x2={140} y2={476}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="6 3" />
          <line x1={94} y1={492} x2={140} y2={492}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeDasharray="6 3" />
          {/* X over doc */}
          <line x1={82} y1={432} x2={154} y2={522}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={154} y1={432} x2={82} y2={522}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />

          <text x={186} y={476} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Document flagged irrelevant</text>
          <text x={186} y={524} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Agent skips it — does not summarise junk</text>
        </g>

        {/* Skip arrow down */}
        <g opacity={skipCard.opacity}>
          <path d="M 540,565 L 540,650"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={160} strokeDashoffset={skipArrow}
            strokeLinecap="round"
            markerEnd="url(#arrow)" />
          <text x={580} y={618} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} opacity={fetchCard.opacity}>FETCH NEW</text>
        </g>

        {/* Fetch new card */}
        <g opacity={fetchCard.opacity} transform={`translate(0,${fetchCard.translateY})`}>
          <BentoCard x={60} y={660} w={960} h={170} accent />
          <rect x={60} y={660} width={6} height={170} rx={3} fill={COLORS.accent} />
          {/* New doc icon */}
          <rect x={84} y={686} width={72} height={90} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={96} y1={710} x2={140} y2={710}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={96} y1={726} x2={140} y2={726}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={96} y1={742} x2={128} y2={742}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={186} y={722} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Fetches another document</text>
          <text x={186} y={764} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>searches again for better source</text>
          <text x={186} y={802} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>adapts to quality of retrieved content</text>
        </g>

        {/* Insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={890} w={960} h={110} />
          <rect x={60} y={890} width={6} height={110} rx={3} fill={COLORS.accent} />
          <text x={100} y={942} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>Adaptive path</text>
          <text x={100} y={982} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>poor inputs → collect better inputs, not push garbage through</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
