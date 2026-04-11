/**
 * Scene 01 — Day Card
 * Day 27: Tools
 * Paper background — title card before audio starts.
 * Duration: 81 frames (2.7s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene01_DayCard: React.FC = () => {
  const frame = useCurrentFrame();

  const enter    = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const numScale = interpolate(frame, [6, 26], [0.7, 1], { extrapolateRight: 'clamp', easing: ease });
  const tagSlide = interpolate(frame, [10, 32], [-60, 0], { extrapolateRight: 'clamp', easing: ease });
  const lineW    = interpolate(frame, [14, 32], [0, 760], { extrapolateRight: 'clamp', easing: ease });
  const subEnter = interpolate(frame, [20, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ctaEnter = interpolate(frame, [32, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const stepEnters = [
    interpolate(frame, [36, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
    interpolate(frame, [40, 56], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
    interpolate(frame, [44, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
    interpolate(frame, [48, 64], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
  ];

  const steps = [
    { label: 'PERCEIVE', color: '#22C55E', cx: 200 },
    { label: 'THINK',    color: '#3B82F6', cx: 400 },
    { label: 'ACT',      color: '#F59E0B', cx: 600 },
    { label: 'OBSERVE',  color: '#A78BFA', cx: 800 },
  ];

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        {/* Dot grid background */}
        {Array.from({ length: 12 * 20 }, (_, i) => (
          <circle key={i} cx={(i % 12) * 90 + 45} cy={Math.floor(i / 12) * 98 + 49}
            r={1.8} fill={COLORS.warm_blue} opacity={enter * 0.06} />
        ))}

        {/* Rule lines */}
        <line x1={0} y1={700} x2={1080} y2={700} stroke={COLORS.warm_blue} strokeWidth={1} opacity={enter * 0.12} />
        <line x1={0} y1={1140} x2={1080} y2={1140} stroke={COLORS.warm_blue} strokeWidth={1} opacity={enter * 0.12} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,160 M 60,60 L 160,60" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={enter * 0.45} />
        <path d="M 1020,60 L 1020,160 M 1020,60 L 920,60" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={enter * 0.45} />
        <path d="M 60,1860 L 60,1760 M 60,1860 L 160,1860" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={enter * 0.45} />
        <path d="M 1020,1860 L 1020,1760 M 1020,1860 L 920,1860" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={enter * 0.45} />

        {/* Series label */}
        <text x={540} y={680} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.warm_blue} letterSpacing="0.22em" opacity={enter * 0.6}>
          AGENTIC AI · FIRST PRINCIPLES
        </text>

        {/* DAY label */}
        <text x={540} y={810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
          fill={COLORS.deep_black} letterSpacing="0.35em" opacity={enter}
          transform={`translate(${tagSlide}, 0)`}>
          DAY
        </text>

        {/* Day number — large ink */}
        <text x={540} y={1080} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={380} fontWeight={900}
          fill={COLORS.warm_blue} letterSpacing="-0.05em" opacity={enter * 0.12}>
          27
        </text>
        <text x={540} y={1080} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900}
          fill={COLORS.deep_black} letterSpacing="-0.05em" opacity={enter}
          transform={`scale(${numScale}) translate(${(1 - numScale) * 540 / numScale}, 0)`}>
          27
        </text>

        {/* Divider */}
        <line x1={540 - lineW / 2} y1={1140} x2={540 + lineW / 2} y2={1140}
          stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={enter * 0.5} />

        {/* Topic title */}
        <text x={540} y={1230} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
          fill={COLORS.warm_blue} letterSpacing="0.1em" opacity={subEnter}>
          TOOLS
        </text>

        {/* Subtitle */}
        <text x={540} y={1300} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={400}
          fill={COLORS.deep_black} letterSpacing="0.08em" opacity={subEnter * 0.6}>
          The agent's hands in the real world
        </text>

        {/* Loop steps */}
        {steps.map((step, idx) => (
          <g key={step.label} opacity={stepEnters[idx]}>
            <circle cx={step.cx} cy={1540} r={22} fill="none" stroke={step.color} strokeWidth={2.5} opacity={0.6} />
            <circle cx={step.cx} cy={1540} r={8} fill={step.color} opacity={0.85} />
            <text x={step.cx} y={1586} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
              fill={step.color} opacity={0.8} letterSpacing="0.06em">
              {step.label}
            </text>
          </g>
        ))}

        {/* Wrench icon hint at bottom */}
        <g opacity={ctaEnter * 0.5} transform="translate(540, 1700)">
          <line x1={-20} y1={-20} x2={20} y2={20} stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" />
          <circle cx={24} cy={24} r={12} fill="none" stroke={COLORS.warm_blue} strokeWidth={2.5} />
          <circle cx={-24} cy={-24} r={8} fill={COLORS.warm_blue} opacity={0.3} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
