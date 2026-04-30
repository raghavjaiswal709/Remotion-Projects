/**
 * Scene 10 — Regardless Reading
 * "regardless of what the reading reveals,"
 * CSV: 36.717s → 39.150s | Duration: 73 frames (2.43s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Continuation badge ("...AND READING") slides in
 *   Phase 2 (frames 18–50): Reading types appear as cards (useless / irrelevant / perfect)
 *   Phase 3 (frames 45–end): Pipe arrow advances regardless, micro breathe
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

export const Scene10_RegardlessReading: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const regStamp = useSpringSnap(frame, 6);
  const headE    = useSpringEntrance(frame, 10);

  // Phase 2
  const c1 = useSpringEntrance(frame, 20);
  const c2 = useSpringEntrance(frame, 30);
  const c3 = useSpringEntrance(frame, 40);
  const cardsE = [c1, c2, c3];

  // Phase 3
  const insightE = useSpringEntrance(frame, 50);
  const breathe  = Math.sin(frame * 0.09) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  const reveals = ['useless', 'contradictory', 'perfect'];
  const revealColors = [COLORS.vibrant_red, COLORS.text_muted, COLORS.accent];

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
        <g transform={`translate(540, 300) scale(${regStamp.scale})`}
          style={{ transformOrigin: '540px 300px' }}
          opacity={regStamp.opacity}>
          <rect x={-290} y={-70} width={580} height={90} rx={8}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={0} y={-4} textAnchor="middle" fontFamily={FONT}
            fontSize={70} fontWeight={800} fontStyle="italic"
            fill={COLORS.vibrant_red}>REGARDLESS</text>
        </g>

        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={540} y={390} textAnchor="middle" fontFamily={FONT}
            fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            of what the reading reveals
          </text>
        </g>

        {/* Outcome cards */}
        {[0, 1, 2].map(i => {
          const cx = 60 + i * 340;
          const ce = cardsE[i];
          return (
            <g key={i} opacity={ce.opacity}
              transform={`translate(0, ${ce.translateY + breathe * (i === 1 ? -1 : 1)})`}>
              <BentoCard x={cx} y={440} w={300} h={200}
                accent={i === 2} />
              {/* Reading icon — lines */}
              {[0, 1, 2].map(j => (
                <line key={j}
                  x1={cx + 40} y1={480 + j * 22}
                  x2={cx + i === 2 ? 260 : cx + (220 - j * 30)} y2={480 + j * 22}
                  stroke={revealColors[i]} strokeWidth={2} strokeLinecap="round"
                  strokeOpacity={j === 2 ? 0.4 : 1}
                  strokeDasharray={180}
                  strokeDashoffset={usePathDraw(frame, 22 + i * 8 + j * 3, 180, 14)} />
              ))}
              <text x={cx + 150} y={576} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>Reading reveals</text>
              <text x={cx + 150} y={620} textAnchor="middle"
                fontFamily={FONT} fontSize={40} fontWeight={800}
                fill={revealColors[i]}>{reveals[i]}</text>
            </g>
          );
        })}

        {/* Down arrow — pipeline continues */}
        <g opacity={insightE.opacity}>
          <line x1={540} y1={660} x2={540} y2={830}
            stroke={COLORS.text_muted} strokeWidth={2.5}
            strokeDasharray={180} strokeDashoffset={usePathDraw(frame, 52, 180, 18)}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={570} y={740} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.8}>same path</text>
        </g>

        {/* Step 3 continues */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={100} />
          <text x={540} y={900} textAnchor="middle" fontFamily={FONT}
            fontSize={38} fontWeight={800} fill={COLORS.white}>
            Step 3 — Summarize — runs either way
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={110} accent />
          <rect x={60} y={980} width={6} height={110} rx={3} fill={COLORS.accent} />
          <text x={100} y={1030} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>Pipeline is blind to its own output</text>
          <text x={100} y={1072} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>no reading of intermediate results</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
