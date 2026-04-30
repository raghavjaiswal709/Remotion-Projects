/**
 * Scene 09 — Regardless Search
 * "Regardless of what the search returns,"
 * CSV: 34.617s → 36.717s | Duration: 63 frames (2.10s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  "REGARDLESS" stamp slams in large
 *   Phase 2 (frames 16–45): search result cards scatter in — 3 cards with different outcomes
 *   Phase 3 (frames 40–end): thick X mark over each outcome, pipeline marches on
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
  const scale    = interpolate(progress, [0, 1], [0.5, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene09_RegardlessSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE    = useSpringEntrance(frame, 0);
  const regStamp  = useSpringSnap(frame, 6);

  // Phase 2 — outcome cards
  const card1E = useSpringEntrance(frame, 18);
  const card2E = useSpringEntrance(frame, 26);
  const card3E = useSpringEntrance(frame, 34);
  const cardsE = [card1E, card2E, card3E];

  // Pipeline continues arrow
  const arrCont = usePathDraw(frame, 44, 260, 18);
  const insightE = useSpringEntrance(frame, 48);

  // Phase 3
  const breathe = Math.sin(frame * 0.09) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  const outcomes = ['10 results', '0 results', '1,000 results'];
  const outcomeColors = [COLORS.white, COLORS.vibrant_red, COLORS.text_muted];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* "REGARDLESS" stamp */}
        <g transform={`translate(540, 340) scale(${regStamp.scale})`}
          style={{ transformOrigin: '540px 340px' }}
          opacity={regStamp.opacity}>
          {/* Italic stamp style rect */}
          <rect x={-330} y={-78} width={660} height={100} rx={8}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT}
            fontSize={82} fontWeight={800} fontStyle="italic"
            fill={COLORS.vibrant_red}>REGARDLESS</text>
          <text x={0} y={38} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            of what the search returns
          </text>
        </g>

        {/* Outcome cards */}
        {[0, 1, 2].map(i => {
          const cx = 60 + i * 340;
          const ce = cardsE[i];
          return (
            <g key={i}
              opacity={ce.opacity}
              transform={`translate(0, ${ce.translateY + breathe * (i === 1 ? 1 : -1 * (i === 0 ? 1 : -1))})`}>
              <BentoCard x={cx} y={450} w={300} h={180}
                accent={i === 0} />
              <text x={cx + 150} y={530} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>Search returns</text>
              <text x={cx + 150} y={584} textAnchor="middle"
                fontFamily={FONT} fontSize={46} fontWeight={800}
                fill={outcomeColors[i]}>{outcomes[i]}</text>
            </g>
          );
        })}

        {/* Pipeline continues anyway — arrow + label */}
        <g opacity={insightE.opacity}>
          <line x1={540} y1={650} x2={540} y2={900}
            stroke={COLORS.text_muted} strokeWidth={2.5}
            strokeDasharray={260} strokeDashoffset={arrCont}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={560} y={760} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.7}>pipeline</text>
          <text x={560} y={800} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.7}>continues</text>
          <text x={560} y={840} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.7}>anyway</text>
        </g>

        {/* Insight card */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={918} w={960} h={120} accent />
          <rect x={60} y={918} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={968} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>No branching, no conditionals</text>
          <text x={100} y={1012} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>the pipeline never checks the result</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
