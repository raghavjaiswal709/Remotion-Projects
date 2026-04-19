/**
 * Scene 12 — Risk Warning
 * "But there is a risk."
 * CSV: 48.200s → 50.840s
 * Duration: ~79 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Warning label + hero text
 *   Phase 2 (frames 20–50):  Warning triangle + risk cards
 *   Phase 3 (frames 45–end): Pulsing warning
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

export const Scene12_RiskWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const heroEnt = useSpringEntrance(frame, 6);
  const triangleEnt = useSpringEntrance(frame, 14);
  const riskCard1 = useSpringEntrance(frame, 24);
  const riskCard2 = useSpringEntrance(frame, 36);
  const summaryCard = useSpringEntrance(frame, 48);

  // Warning triangle path draw
  const triLen = 500;
  const triDash = usePathDraw(frame, 16, triLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const warnPulse = 0.7 + Math.sin(frame * 0.12) * 0.3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[11];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="WARNING" y={160} opacity={0.8} />
        </g>

        {/* Hero: "But there is a RISK" */}
        <g transform={`translate(0, ${heroEnt.translateY})`} opacity={heroEnt.opacity}>
          <text x={540} y={340} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            But there is a
          </text>
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.vibrant_red}
            fontStyle="italic">
            RISK
          </text>
          {/* Ghost behind */}
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.04 * warnPulse}>
            RISK
          </text>
        </g>

        {/* Warning triangle */}
        <g opacity={triangleEnt.opacity} transform={`translate(540, ${660 + breathe})`}>
          <path d="M 0,-100 L 90,60 L -90,60 Z"
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={triLen} strokeDashoffset={triDash}
            strokeLinejoin="round" />
          {/* Exclamation mark */}
          <rect x={-6} y={-50} width={12} height={60} rx={6}
            fill={COLORS.vibrant_red} opacity={triangleEnt.progress} />
          <circle cx={0} cy={30} r={8} fill={COLORS.vibrant_red} opacity={triangleEnt.progress} />
          {/* Pulsing ring */}
          <circle cx={0} cy={0} r={110} fill="none"
            stroke={COLORS.vibrant_red} strokeWidth={1.5}
            opacity={0.15 * warnPulse} />
        </g>

        {/* Risk cards */}
        <g opacity={riskCard1.opacity} transform={`translate(0, ${riskCard1.translateY})`}>
          <BentoCard x={60} y={800} w={960} h={200} />
          <rect x={60} y={800} width={8} height={200} rx={4} fill={COLORS.vibrant_red} />
          <text x={110} y={870} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}>
            Downcasting can fail
          </text>
          <text x={110} y={930} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            If the actual object in memory doesn't match
          </text>
          <text x={110} y={970} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            the type you're casting to — Java crashes
          </text>
        </g>

        <g opacity={riskCard2.opacity} transform={`translate(0, ${riskCard2.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={200} />
          <rect x={60} y={1040} width={8} height={200} rx={4} fill={COLORS.accent} />
          <text x={110} y={1110} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Unlike upcasting — not guaranteed safe
          </text>
          <text x={110} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Upcasting: always valid (child IS-A parent)
          </text>
          <text x={110} y={1210} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Downcasting: only valid if object matches
          </text>
        </g>

        {/* Contrast summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1300} w={460} h={160} />
          <text x={290} y={1360} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Upcasting
          </text>
          <text x={290} y={1410} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Safe, automatic
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1300} w={460} h={160} accent />
          <rect x={560} y={1300} width={8} height={160} rx={4} fill={COLORS.vibrant_red} />
          <text x={790} y={1360} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            Downcasting
          </text>
          <text x={790} y={1410} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Risky, explicit
          </text>
        </g>

        <circle cx={200} cy={780 + breathe} r={4} fill={COLORS.vibrant_red} opacity={0.15 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
