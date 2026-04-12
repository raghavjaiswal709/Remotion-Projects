/**
 * Scene17 — Key Takeaway
 * "The Abort Button — Engineered Certainty"
 * Duration: 120 frames (4.0s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Reveal — main concept
 *   Phase 2 (20–80): Content — key points from today
 *   Phase 3 (70–end): Micro — shimmer, pulse
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CornerAccents } from '../helpers/components';

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

export const Scene17_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 8);
  const sublineEntrance = useSpringEntrance(frame, 16);
  const dividerDraw = usePathDraw(frame, 20, 960, 25);
  const point1 = useSpringEntrance(frame, 28);
  const point2 = useSpringEntrance(frame, 40);
  const point3 = useSpringEntrance(frame, 52);
  const summaryCard = useSpringEntrance(frame, 65);

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const POINTS = [
    { text: 'Launch abort: LAS tower, 700 km/h, 3 seconds', color: COLORS.orange },
    { text: 'Deep space abort: service module, trajectory change', color: COLORS.sky_blue },
    { text: 'Every scenario pre-engineered, zero improvisation', color: COLORS.green },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents opacity={0.35} />

        {/* Label */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <text x={540} y={350} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500} fill={COLORS.cool_silver}
            letterSpacing="0.2em">
            KEY TAKEAWAY
          </text>
        </g>

        {/* Headline */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text x={540} y={500} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900} fill={COLORS.sky_blue}>
            The Abort Button
          </text>
        </g>

        <g transform={`translate(0, ${sublineEntrance.translateY})`} opacity={sublineEntrance.opacity}>
          <text x={540} y={580} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={600} fill={COLORS.deep_black}>
            Engineered Certainty
          </text>
        </g>

        {/* Divider */}
        <line x1={60} y1={630} x2={1020} y2={630}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
          strokeDasharray={960} strokeDashoffset={dividerDraw} />

        {/* Key points */}
        {POINTS.map((pt, i) => {
          const ent = [point1, point2, point3][i];
          return (
            <g key={i} opacity={ent.opacity}
              transform={`translate(60, ${700 + i * 130 + ent.translateY})`}>
              <rect x={0} y={0} width={960} height={100} rx={12}
                fill={pt.color} fillOpacity={0.05}
                stroke={pt.color} strokeWidth={1.5} />
              <rect x={0} y={0} width={6} height={100} rx={3} fill={pt.color} />
              <circle cx={40} cy={50} r={16}
                fill={pt.color} fillOpacity={0.1}
                stroke={pt.color} strokeWidth={1.5}
                style={{ transform: `scale(${pulse})`, transformOrigin: '40px 50px' }} />
              <text x={40} y={57} textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={22} fontWeight={800} fill={pt.color}>
                {i + 1}
              </text>
              <text x={75} y={58} fontFamily="'Inter', system-ui, sans-serif"
                fontSize={30} fontWeight={600} fill={COLORS.deep_black}>
                {pt.text}
              </text>
            </g>
          );
        })}

        {/* Summary card */}
        <g opacity={summaryCard.opacity}
          transform={`translate(60, ${1120 + summaryCard.translateY + breathe})`}>
          <rect x={0} y={0} width={960} height={120} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          {/* Abort button icon */}
          <circle cx={80} cy={60} r={30}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={2}
            style={{ transform: `scale(${pulse})`, transformOrigin: '80px 60px' }} />
          <circle cx={80} cy={60} r={15} fill={COLORS.vibrant_red} fillOpacity={0.15} />
          <text x={130} y={50} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500} fill={COLORS.cool_silver}>
            CORE PRINCIPLE
          </text>
          <text x={130} y={85} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={700} fill={COLORS.deep_black}>
            Zero Second Chances, Zero Guesswork
          </text>
        </g>

        {/* Decorative star dots */}
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i}
            cx={100 + (i * 67) % 880}
            cy={1320 + (i * 31) % 100}
            r={1.5}
            fill={COLORS.cool_silver}
            opacity={shimmer * 0.2} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
