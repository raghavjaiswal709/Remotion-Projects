/**
 * Scene 01 — Day Card
 * Day 25: Actions
 * Paper background — strictly no dark colours.
 * Duration: 81 frames (2.7s) — pre-audio title card
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
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

  const stepEnter0 = interpolate(frame, [36, 52], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const stepEnter1 = interpolate(frame, [40, 56], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const stepEnter2 = interpolate(frame, [44, 60], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const stepEnter3 = interpolate(frame, [48, 64], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const stepEnter = [stepEnter0, stepEnter1, stepEnter2, stepEnter3];

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />

      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        {/* ── Faint dot grid ── */}
        {Array.from({ length: 12 * 20 }, (_, i) => (
          <circle key={i} cx={(i % 12) * 90 + 45} cy={Math.floor(i / 12) * 98 + 49}
            r={1.8} fill={COLORS.vibrant_red} opacity={enter * 0.06} />
        ))}

        {/* ── Thin rule lines ── */}
        <line x1={0} y1={700} x2={1080} y2={700}
          stroke={COLORS.vibrant_red} strokeWidth={1} opacity={enter * 0.12} />
        <line x1={0} y1={1140} x2={1080} y2={1140}
          stroke={COLORS.vibrant_red} strokeWidth={1} opacity={enter * 0.12} />

        {/* ── Corner accents ── */}
        <path d="M 60,60 L 60,160 M 60,60 L 160,60"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          opacity={enter * 0.45} />
        <path d="M 1020,60 L 1020,160 M 1020,60 L 920,60"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          opacity={enter * 0.45} />
        <path d="M 60,1860 L 60,1760 M 60,1860 L 160,1860"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          opacity={enter * 0.45} />
        <path d="M 1020,1860 L 1020,1760 M 1020,1860 L 920,1860"
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          opacity={enter * 0.45} />

        {/* ── Series label ── */}
        <text x={540} y={680} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.vibrant_red} letterSpacing="0.22em"
          opacity={enter * 0.6}>
          AGENTIC AI · FIRST PRINCIPLES
        </text>

        {/* ── "DAY" label ── */}
        <text x={540} y={810} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={80} fontWeight={900}
          fill={COLORS.deep_black} letterSpacing="0.35em"
          opacity={enter}
          transform={`translate(${tagSlide}, 0)`}>
          DAY
        </text>

        {/* ── Day number — large ink ── */}
        <text x={540} y={1080} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={380} fontWeight={900}
          fill={COLORS.vibrant_red} letterSpacing="-0.05em"
          opacity={enter * 0.12}>
          25
        </text>
        <text x={540} y={1080} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900}
          fill={COLORS.deep_black} letterSpacing="-0.05em"
          opacity={enter}
          transform={`scale(${numScale}) translate(${(1 - numScale) * 540 / numScale}, 0)`}>
          25
        </text>

        {/* ── Divider under number ── */}
        <line x1={540 - lineW / 2} y1={1140} x2={540 + lineW / 2} y2={1140}
          stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round"
          opacity={enter * 0.5} />

        {/* ── Topic title ── */}
        <text x={540} y={1230} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
          fill={COLORS.vibrant_red} letterSpacing="0.1em"
          opacity={subEnter}>
          ACTIONS
        </text>

        {/* ── Subtitle ── */}
        <text x={540} y={1300} textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={400}
          fill={COLORS.deep_black} letterSpacing="0.08em"
          opacity={subEnter * 0.6}>
          How the agent changes the world
        </text>

        {/* ── Loop steps ── */}
          <g key="PERCEIVE" opacity={stepEnter[0]}>
            <circle cx={290} cy={1540} r={22}
              fill="none" stroke="#22C55E" strokeWidth={2.5} opacity={0.6} />
            <circle cx={290} cy={1540} r={8} fill="#22C55E" opacity={0.85} />
            <text x={290} y={1586} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
              fill="#22C55E" opacity={0.8} letterSpacing="0.06em">
              PERCEIVE
            </text>
          </g>
          <g key="THINK" opacity={stepEnter[1]}>
            <circle cx={456} cy={1540} r={22}
              fill="none" stroke="#3B82F6" strokeWidth={2.5} opacity={0.6} />
            <circle cx={456} cy={1540} r={8} fill="#3B82F6" opacity={0.85} />
            <text x={456} y={1586} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
              fill="#3B82F6" opacity={0.8} letterSpacing="0.06em">
              THINK
            </text>
          </g>
          <g key="ACT" opacity={stepEnter[2]}>
            <circle cx={622} cy={1540} r={22}
              fill="none" stroke="#F59E0B" strokeWidth={2.5} opacity={0.6} />
            <circle cx={622} cy={1540} r={8} fill="#F59E0B" opacity={0.85} />
            <text x={622} y={1586} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
              fill="#F59E0B" opacity={0.8} letterSpacing="0.06em">
              ACT
            </text>
          </g>
          <g key="OBSERVE" opacity={stepEnter[3]}>
            <circle cx={788} cy={1540} r={22}
              fill="none" stroke="#A78BFA" strokeWidth={2.5} opacity={0.6} />
            <circle cx={788} cy={1540} r={8} fill="#A78BFA" opacity={0.85} />
            <text x={788} y={1586} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
              fill="#A78BFA" opacity={0.8} letterSpacing="0.06em">
              OBSERVE
            </text>
          </g>
      </svg>
    </AbsoluteFill>
  );
};
