/**
 * Scene 06 — Pipeline Is Fixed
 * "A pipeline is a fixed sequence of steps designed by a human before execution begins."
 * CSV: 23.117s → 28.717s | Duration: 168 frames (5.60s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):   "PIPELINE" headline locks in with snap spring
 *   Phase 2 (frames 20–90):  Chain of locked steps builds left-to-right
 *   Phase 3 (frames 80–end): Lock icons pulse, subtle breathing
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
  const opacity  = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  return { progress, opacity };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene06_PipelineIsFixed: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const headE    = useSpringEntrance(frame, 6);
  const subE     = useSpringEntrance(frame, 12);

  // Phase 2 — pipeline chain
  const humanDesignE = useSpringEntrance(frame, 20);
  const step1E = useSpringEntrance(frame, 30);
  const step2E = useSpringEntrance(frame, 42);
  const step3E = useSpringEntrance(frame, 54);

  const arr1 = usePathDraw(frame, 36, 80, 14);
  const arr2 = usePathDraw(frame, 48, 80, 14);

  const snapshotE = useSpringSnap(frame, 22);
  const insightE  = useSpringEntrance(frame, 72);

  // Phase 3
  const pulse   = 1 + Math.sin(frame * 0.10) * 0.018;
  const breathe = Math.sin(frame * 0.07) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  const STEP_X = [90, 390, 690];
  const STEP_W = 265;
  const STEP_H = 170;
  const STEP_Y = 800;

  const stepEnters = [step1E, step2E, step3E];
  const arrows = [arr1, arr2];
  const stepLabels = ['Step 1', 'Step 2', 'Step 3'];
  const stepColors = [COLORS.text_muted, COLORS.white, COLORS.text_muted];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g opacity={headE.opacity} transform={`translate(0,${headE.translateY})`}>
          <text x={60} y={290} fontFamily={FONT} fontSize={104} fontWeight={800}
            fill={COLORS.white}>A Pipeline</text>
          <text x={60} y={388} fontFamily={FONT} fontSize={104} fontWeight={800}
            fill={COLORS.accent}>is Fixed</text>
        </g>
        <g opacity={subE.opacity} transform={`translate(0,${subE.translateY})`}>
          <text x={60} y={458} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>designed by a human before execution begins</text>
        </g>

        {/* Divider */}
        <line x1={60} y1={490} x2={1020} y2={490}
          stroke={COLORS.accent_mid} strokeWidth={1.5} opacity={subE.opacity * 0.5}
          strokeDasharray={960} strokeDashoffset={usePathDraw(frame, 14, 960, 30)} />

        {/* "Human designs it" banner */}
        <g opacity={humanDesignE.opacity} transform={`translate(0,${humanDesignE.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={90} />
          <text x={540} y={575} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Human designs sequence →
            <tspan fill={COLORS.accent}> before runtime</tspan>
          </text>
        </g>

        {/* Pipeline step chain */}
        {/* Pre-execution lock stamp */}
        <g opacity={snapshotE.opacity}>
          <rect x={880} y={632} width={170} height={60} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.15}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={965} y={669} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red}>LOCKED</text>
        </g>

        {stepLabels.map((label, i) => {
          const se = stepEnters[i];
          const sx = STEP_X[i];
          return (
            <g key={i}>
              <g opacity={se.opacity}
                 transform={`translate(0, ${se.translateY + breathe * (i % 2 === 0 ? 1 : -1)})`}>
                <rect x={sx} y={STEP_Y} width={STEP_W} height={STEP_H} rx={18}
                  fill={COLORS.bg_secondary}
                  stroke={i === 1 ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                  strokeWidth={i === 1 ? 2 : 1.5} />
                {/* Lock icon top-right */}
                <rect x={sx + STEP_W - 54} y={STEP_Y + 14} width={30} height={24} rx={5}
                  fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
                <rect x={sx + STEP_W - 54} y={STEP_Y + 24} width={30} height={20} rx={3}
                  fill={COLORS.text_muted} fillOpacity={0.3} />
                <path d={`M ${sx + STEP_W - 50},${STEP_Y + 24} Q ${sx + STEP_W - 39},${STEP_Y + 8} ${sx + STEP_W - 28},${STEP_Y + 24}`}
                  fill="none" stroke={COLORS.text_muted} strokeWidth={2} />

                <text x={sx + STEP_W / 2} y={STEP_Y + 70} textAnchor="middle"
                  fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                  {label}
                </text>
                <text x={sx + STEP_W / 2} y={STEP_Y + 110} textAnchor="middle"
                  fontFamily={FONT} fontSize={34} fontWeight={800} fill={stepColors[i]}>
                  {i === 0 ? 'Search' : i === 1 ? 'Read' : 'Summarize'}
                </text>
              </g>

              {/* Arrow */}
              {i < 2 && (
                <g opacity={stepEnters[i].opacity}>
                  <line
                    x1={sx + STEP_W} y1={STEP_Y + STEP_H / 2}
                    x2={STEP_X[i + 1]} y2={STEP_Y + STEP_H / 2}
                    stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round"
                    strokeDasharray={80} strokeDashoffset={arrows[i]}
                    markerEnd="url(#arrow)"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* "Regardless" note */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={150} accent />
          <rect x={60} y={1020} width={6} height={150} rx={3} fill={COLORS.accent} />
          <text x={100} y={1070} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Executes the same steps
          </text>
          <text x={100} y={1114} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>in the same order — always</text>
          <text x={100} y={1150} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red} fillOpacity={0.85}>regardless of what it finds</text>
        </g>

        {/* Bottom stat tiles */}
        <g opacity={insightE.opacity}>
          <BentoCard x={60} y={1210} w={460} h={100} />
          <text x={290} y={1250} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Decision Time</text>
          <text x={290} y={1284} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>Before execution</text>
        </g>
        <g opacity={insightE.opacity}>
          <BentoCard x={560} y={1210} w={460} h={100} />
          <text x={790} y={1250} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Sequence</text>
          <text x={790} y={1284} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>Human designed</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
