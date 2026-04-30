/**
 * Scene 13 — If Search Returns Useless
 * "If the search returns nothing useful, the agent tries a different query."
 * CSV: 48.350s → 52.550s | Duration: 126 frames (4.20s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):  IF/THEN conditional banner builds
 *   Phase 2 (frames 24–80): Red fail card → pivot arrow → teal retry card
 *   Phase 3 (frames 75–end): Cards breathe, pulses on fail/retry
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene13_IfSearchUseless: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const ifBanner = useSpringSnap(frame, 5);
  const condText = useSpringEntrance(frame, 12);

  // Phase 2
  const failCard  = useSpringEntrance(frame, 26);
  const pivotArrow = usePathDraw(frame, 38, 180, 22);
  const retryCard = useSpringEntrance(frame, 50);

  // Insight
  const insightE = useSpringEntrance(frame, 72);

  // Phase 3
  const breathe   = Math.sin(frame * 0.08) * 4;
  const failPulse = 1 + Math.sin(frame * 0.12) * 0.020;
  const retryGlow = interpolate(Math.sin(frame * 0.09), [-1, 1], [0.7, 1.0]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · ADAPTATION" y={120} opacity={0.8} />
        </g>

        {/* IF banner */}
        <g transform={`scale(${ifBanner.scale})`}
          style={{ transformOrigin: '60px 250px' }}
          opacity={ifBanner.opacity}>
          <text x={60} y={250} fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            IF
          </text>
        </g>

        <g opacity={condText.opacity} transform={`translate(0,${condText.translateY})`}>
          <text x={220} y={248} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.white}>
            search returns
          </text>
          <text x={220} y={318} fontFamily={FONT} fontSize={68} fontWeight={800}
            fill={COLORS.vibrant_red}>
            nothing useful...
          </text>
        </g>

        {/* Fail card */}
        <g opacity={failCard.opacity}
          style={{ transformOrigin: '540px 560px' }}
          transform={`translate(0,${failCard.translateY + breathe}) scale(${failPulse})`}>
          <BentoCard x={60} y={420} w={960} h={160} />
          <rect x={60} y={420} width={6} height={160} rx={3} fill={COLORS.vibrant_red} />
          <rect x={80} y={444} width={90} height={90} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          {/* X mark */}
          <line x1={98} y1={462} x2={150} y2={514}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={150} y1={462} x2={98} y2={514}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <text x={200} y={490} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Search returned 0 useful results</text>
          <text x={200} y={540} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Pipeline would continue anyway. Agent doesn't.</text>
        </g>

        {/* Pivot arrow */}
        <g opacity={failCard.opacity}>
          <path d="M 540,590 L 540,680"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={180} strokeDashoffset={pivotArrow}
            markerEnd="url(#arrow)" />
          <text x={580} y={645} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} opacity={retryCard.opacity}>AGENT PIVOTS</text>
        </g>

        {/* Retry card */}
        <g opacity={retryCard.opacity} transform={`translate(0,${retryCard.translateY})`}>
          <BentoCard x={60} y={690} w={960} h={180} accent />
          <rect x={60} y={690} width={6} height={180} rx={3} fill={COLORS.accent} />
          {/* Refresh icon */}
          <path d="M 120,750 a 30,30 0 1 1 30,30"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <polygon points="155,775 165,760 175,780"
            fill={COLORS.accent} />
          <text x={200} y={764} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>Tries a different query</text>
          <text x={200} y={812} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>re-query → new results → re-evaluate</text>
          <text x={200} y={848} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>same goal, adapted path</text>
        </g>

        {/* Insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={130} />
          <rect x={60} y={920} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={972} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>The goal stays the same.</text>
          <text x={100} y={1020} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>The path is re-chosen at runtime.</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
