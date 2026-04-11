/**
 * Scene03_LastDayRecap.tsx — Day 26: Observations
 *
 * "Last day, we learned what an action is."
 *
 * Paper background. Pencil-sketch style action icon (hand pressing button).
 * Faded "ACTION" label from yesterday with an arrow pointing forward to
 * today. Crosshatch shading. Transition wipe effect.
 *
 * Canvas: 1080×1920 portrait (9:16), 30fps.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ── Crosshatch lines ────────────────────────────────────────────────── */
const crosshatchLines = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x1: (i % 2 === 0 ? 0 : 1080),
  y1: i * 64,
  x2: (i % 2 === 0 ? 1080 : 0),
  y2: i * 64 + 64,
}));

/* ── Particles (pencil dust) ─────────────────────────────────────────── */
const dustParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 163.7) % 1080),
  y: ((i * 219.3) % 1920),
  r: 0.8 + (i % 4) * 0.5,
  phase: (i * 1.1) % (Math.PI * 2),
}));

/* ── Sketch grain dots ───────────────────────────────────────────────── */
const grainDots = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: ((i * 131.5) % 1020) + 30,
  y: ((i * 187.9) % 1860) + 30,
  r: 0.5 + (i % 3) * 0.4,
}));

export const Scene03_LastDayRecap: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const actionLabelOpacity = interpolate(frame, [8, 22], [0, 0.85], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const actionBoxScale = interpolate(frame, [8, 28], [0.8, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const arrowProgress = interpolate(frame, [20, 45], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const todayOpacity = interpolate(frame, [35, 50], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const textReveal = interpolate(frame, [5, 30], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const crosshatchOpacity = interpolate(frame, [0, 12], [0, 0.06], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const wipeX = interpolate(frame, [55, 67], [1080, -200], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sketchStroke = interpolate(frame, [10, 35], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const handDraw = interpolate(frame, [12, 38], [400, 0], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const yesterdayFade = interpolate(frame, [0, 20], [0, 0.5], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const buttonPress = interpolate(
    frame,
    [25, 32, 38],
    [0, 6, 0],
    { extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_paper }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="pencilTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feComposite in="SourceGraphic" in2="noise" operator="in" />
          </filter>
          <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.cool_silver} />
            <stop offset="100%" stopColor={COLORS.warm_blue} />
          </linearGradient>
        </defs>

        {/* ── Paper grain dots ────────────────────────────────────── */}
        {grainDots.map((dot) => (
          <circle
            key={`gr-${dot.id}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={COLORS.deep_black}
            opacity={fadeIn * 0.04}
          />
        ))}

        {/* ── Crosshatch shading ──────────────────────────────────── */}
        {crosshatchLines.map((cl) => (
          <line
            key={`ch-${cl.id}`}
            x1={cl.x1}
            y1={cl.y1}
            x2={cl.x2}
            y2={cl.y2}
            stroke={COLORS.deep_black}
            strokeWidth="0.5"
            opacity={crosshatchOpacity}
          />
        ))}

        {/* ── Pencil dust particles ───────────────────────────────── */}
        {dustParticles.map((p) => {
          const px = p.x + Math.sin(frame * 0.02 + p.phase) * 8;
          const py = p.y + Math.cos(frame * 0.015 + p.phase) * 6;
          return (
            <circle
              key={`dust-${p.id}`}
              cx={px}
              cy={py}
              r={p.r}
              fill={COLORS.deep_black}
              opacity={fadeIn * 0.08}
            />
          );
        })}

        {/* ── "YESTERDAY" faded label ─────────────────────────────── */}
        <text
          x="540"
          y="360"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="50"
          fontWeight="400"
          fill={COLORS.cool_silver}
          opacity={yesterdayFade}
          letterSpacing="6"
        >
          YESTERDAY — DAY 25
        </text>

        {/* ── ACTION box (pencil sketch style) ────────────────────── */}
        <g
          opacity={actionLabelOpacity}
          transform={`translate(540, 650) scale(${actionBoxScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Box outline (sketchy double line) */}
          <rect x="-200" y="-80" width="400" height="160" rx="12" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" strokeDasharray={`${sketchStroke * 1600}`} />
          <rect x="-196" y="-76" width="392" height="152" rx="10" fill="none" stroke={COLORS.deep_black} strokeWidth="0.8" opacity="0.3" />

          {/* ACTION text */}
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="700"
            fill={COLORS.deep_black}
            opacity={0.7}
            letterSpacing="6"
          >
            ACTION
          </text>

          {/* Crosshatch fill inside box */}
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={`bch-${i}`}
              x1={-190 + i * 50}
              y1="-70"
              x2={-190 + i * 50 + 30}
              y2="70"
              stroke={COLORS.deep_black}
              strokeWidth="0.5"
              opacity={0.06}
            />
          ))}
        </g>

        {/* ── Hand pressing button (pencil sketch) ────────────────── */}
        <g opacity={actionLabelOpacity} transform={`translate(540, 900)`}>
          {/* Button base */}
          <rect
            x="-50"
            y={20 + buttonPress}
            width="100"
            height="40"
            rx="8"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth="2"
          />
          <rect
            x="-45"
            y={25 + buttonPress}
            width="90"
            height="30"
            rx="6"
            fill={COLORS.deep_black}
            opacity="0.08"
          />

          {/* Hand pointer (simplified pencil sketch) */}
          <path
            d={`M 0 ${-10 - buttonPress} L 0 -50 C 0 -65 15 -70 15 -55 L 15 -45 C 15 -60 30 -63 30 -50 L 30 -40 C 30 -55 45 -58 45 -43 L 45 -10 C 45 10 30 20 0 ${20 + buttonPress}`}
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="400"
            strokeDashoffset={handDraw}
          />
        </g>

        {/* ── Arrow from ACTION to TODAY ───────────────────────────── */}
        <g opacity={arrowProgress}>
          {/* Arrow shaft */}
          <line
            x1="540"
            y1="830"
            x2="540"
            y2={830 + 300 * arrowProgress}
            stroke="url(#arrowGrad)"
            strokeWidth="3"
            strokeDasharray="8,4"
          />

          {/* Arrow head */}
          <polygon
            points={`525,${1120 * arrowProgress + 830 * (1 - arrowProgress)} 540,${1140 * arrowProgress + 850 * (1 - arrowProgress)} 555,${1120 * arrowProgress + 830 * (1 - arrowProgress)}`}
            fill={COLORS.warm_blue}
            opacity={arrowProgress}
          />

          {/* Small dots along arrow */}
          {Array.from({ length: 5 }, (_, i) => {
            const dotY = 850 + i * 55;
            const dotOp = interpolate(
              frame,
              [25 + i * 4, 32 + i * 4],
              [0, 0.5],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <circle
                key={`ad-${i}`}
                cx={530 + (i % 2) * 20}
                cy={dotY}
                r="3"
                fill={COLORS.warm_blue}
                opacity={dotOp}
              />
            );
          })}
        </g>

        {/* ── "TODAY" label ────────────────────────────────────────── */}
        <text
          x="540"
          y="1220"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="50"
          fontWeight="400"
          fill={COLORS.warm_blue}
          opacity={todayOpacity}
          letterSpacing="6"
        >
          TODAY — DAY 26
        </text>

        {/* ── Question mark leading to today ──────────────────────── */}
        <text
          x="540"
          y="1320"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="80"
          fontWeight="700"
          fill={COLORS.warm_blue}
          opacity={todayOpacity * 0.4}
        >
          ?
        </text>

        {/* ── Main caption text ───────────────────────────────────── */}
        <text
          x="540"
          y="1530"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="50"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={textReveal}
        >
          Last day, we learned
        </text>
        <text
          x="540"
          y="1610"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="50"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={textReveal}
        >
          what an
          <tspan fill={COLORS.warm_blue} fontWeight="800"> action </tspan>
          is.
        </text>

        {/* ── Decorative underline ────────────────────────────────── */}
        <line
          x1={540 - 200 * textReveal}
          y1="1600"
          x2={540 + 200 * textReveal}
          y2="1600"
          stroke={COLORS.deep_black}
          strokeWidth="1.5"
          opacity={textReveal * 0.3}
        />

        {/* ── Pencil-style border ─────────────────────────────────── */}
        <rect
          x="50"
          y="50"
          width="980"
          height="1820"
          rx="0"
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth="1"
          opacity={fadeIn * 0.1}
        />
        <rect
          x="55"
          y="55"
          width="970"
          height="1810"
          rx="0"
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth="0.5"
          opacity={fadeIn * 0.06}
        />

        {/* ── Notebook margin line ────────────────────────────────── */}
        <line
          x1="120"
          y1="50"
          x2="120"
          y2="1870"
          stroke={COLORS.vibrant_red}
          strokeWidth="1"
          opacity={fadeIn * 0.15}
        />

        {/* ── Notebook hole punches ───────────────────────────────── */}
        {[300, 700, 1100, 1500].map((y, i) => (
          <circle
            key={`hole-${i}`}
            cx="65"
            cy={y}
            r="12"
            fill={COLORS.bg_paper}
            stroke={COLORS.deep_black}
            strokeWidth="1"
            opacity={fadeIn * 0.15}
          />
        ))}

        {/* ── Transition wipe ─────────────────────────────────────── */}
        <rect
          x={wipeX}
          y="0"
          width="200"
          height="1920"
          fill={COLORS.bg_paper}
          opacity="0.9"
        />
        <line
          x1={wipeX}
          y1="0"
          x2={wipeX}
          y2="1920"
          stroke={COLORS.warm_blue}
          strokeWidth="3"
          opacity="0.6"
        />

        {/* ── Small accent triangles ──────────────────────────────── */}
        {[
          { x: 180, y: 450, rot: 0 },
          { x: 900, y: 520, rot: 45 },
          { x: 200, y: 1400, rot: -30 },
          { x: 880, y: 1350, rot: 15 },
        ].map((tri, i) => {
          const triOp = interpolate(
            frame,
            [20 + i * 5, 35 + i * 5],
            [0, 0.15],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <polygon
              key={`tri-${i}`}
              points={`${tri.x},${tri.y - 8} ${tri.x - 7},${tri.y + 5} ${tri.x + 7},${tri.y + 5}`}
              fill="none"
              stroke={COLORS.deep_black}
              strokeWidth="1"
              opacity={triOp}
              transform={`rotate(${tri.rot}, ${tri.x}, ${tri.y})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
