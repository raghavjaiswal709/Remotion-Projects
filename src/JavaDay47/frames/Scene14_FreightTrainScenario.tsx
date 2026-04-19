/**
 * Scene 14 — Freight Train Scenario
 * "if it holds a freight train,"
 * CSV: 54.260s → 56.620s
 * Duration: ~71 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–55): Freight train illustration + comparison
 *   Phase 3 (frames 45–end): Pulsing mismatch indicator
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene14_FreightTrainScenario: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const trainIllust = useSpringEntrance(frame, 14);
  const compCard1 = useSpringEntrance(frame, 24);
  const compCard2 = useSpringEntrance(frame, 36);
  const bottomCard = useSpringEntrance(frame, 48);

  // Train body draw
  const bodyLen = 800;
  const bodyDash = usePathDraw(frame, 16, bodyLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const warnPulse = 0.6 + Math.sin(frame * 0.1) * 0.4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[13];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MISMATCH · SCENARIO" y={160} opacity={0.8} />
        </g>

        {/* Hero headline */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            A Freight Train
          </text>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            not an Express
          </text>
        </g>

        {/* Large freight train illustration */}
        <g opacity={trainIllust.opacity} transform={`translate(540, ${700 + breathe})`}>
          {/* Locomotive body */}
          <rect x={-350} y={-100} width={700} height={140} rx={12}
            fill={COLORS.bg_secondary}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={bodyLen} strokeDashoffset={bodyDash} />
          {/* Cab */}
          <rect x={250} y={-140} width={100} height={80} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Smokestack */}
          <rect x={-280} y={-150} width={40} height={60} rx={6}
            fill={COLORS.vibrant_red} fillOpacity={0.2}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Cargo containers */}
          <rect x={-300} y={-80} width={120} height={100} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={-160} y={-80} width={120} height={100} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={-20} y={-80} width={120} height={100} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={120} y={-80} width={120} height={100} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          {/* Wheels */}
          {[-280, -180, -60, 60, 180, 280].map((wx, i) => (
            <circle key={i} cx={wx} cy={60} r={22}
              fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={3} />
          ))}
          {/* Rails */}
          <line x1={-380} y1={88} x2={380} y2={88}
            stroke={COLORS.text_muted} strokeWidth={4} />
          <line x1={-380} y1={98} x2={380} y2={98}
            stroke={COLORS.text_muted} strokeWidth={4} />
          {/* Cross ties */}
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={`tie${i}`} x={-370 + i * 48} y={86} width={30} height={16} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.3} />
          ))}
          {/* FREIGHT label */}
          <text x={0} y={-10} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={shimmer}>
            FREIGHT TRAIN
          </text>
          {/* Hazard symbol */}
          <g transform="translate(0, -130)">
            <polygon points="0,-20 18,14 -18,14"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} opacity={warnPulse} />
            <text x={0} y={8} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.vibrant_red}>
              !
            </text>
          </g>
        </g>

        {/* Comparison cards — Expected vs Actual */}
        <g opacity={compCard1.opacity} transform={`translate(0, ${compCard1.translateY})`}>
          <BentoCard x={60} y={920} w={460} h={200} />
          <text x={290} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em">
            EXPECTED
          </text>
          <text x={290} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={290} y={1090} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            serveLunch, reserveSeat
          </text>
        </g>

        <g opacity={compCard2.opacity} transform={`translate(0, ${compCard2.translateY})`}>
          <BentoCard x={560} y={920} w={460} h={200} accent />
          <rect x={560} y={920} width={8} height={200} rx={4} fill={COLORS.vibrant_red} />
          <text x={790} y={980} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red} letterSpacing="0.1em">
            ACTUAL
          </text>
          <text x={790} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.vibrant_red}>
            FreightTrain
          </text>
          <text x={790} y={1090} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            loadManifest, hazardous
          </text>
        </g>

        {/* Mismatch indicator between cards */}
        <g opacity={compCard2.opacity}>
          <text x={540} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={warnPulse}>
            ≠
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} />
          <text x={540} y={1265} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Type mismatch = cast failure incoming
          </text>
        </g>

        {/* Floating warning particles */}
        <circle cx={120} cy={1400 + breathe} r={4} fill={COLORS.vibrant_red} opacity={0.15 * shimmer} />
        <circle cx={960} cy={1500 - breathe} r={3} fill={COLORS.vibrant_red} opacity={0.1 * shimmer} />
        <circle cx={540} cy={1450 + breathe * 0.5} r={5} fill={COLORS.accent} opacity={0.08 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
