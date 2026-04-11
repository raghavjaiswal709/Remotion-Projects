/**
 * Scene04_ObservationDefined.tsx — Day 26: Observations
 *
 * "An observation is the result of an action."
 *
 * Central definition card: "OBSERVATION" in bold cyan with definition below.
 * Arrow from ACTION box → OBSERVATION box. Glowing connection line.
 * Paper background with pencil grain. Decorative corner brackets.
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

/* ── Grain particles ─────────────────────────────────────────────────── */
const grainParticles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: ((i * 151.3) % 1020) + 30,
  y: ((i * 203.7) % 1860) + 30,
  r: 0.6 + (i % 3) * 0.3,
}));

/* ── Floating connector dots ─────────────────────────────────────────── */
const connectorDots = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: ((i * 173.9) % 900) + 90,
  y: ((i * 229.1) % 600) + 660,
  r: 1.5 + (i % 3) * 0.8,
  phase: (i * 0.8) % (Math.PI * 2),
}));

export const Scene04_ObservationDefined: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const actionBoxOpacity = interpolate(frame, [5, 18], [0, 0.7], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const arrowDraw = interpolate(frame, [15, 40], [300, 0], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationScale = interpolate(frame, [30, 50], [0.85, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationOpacity = interpolate(frame, [30, 45], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(
    frame,
    [35, 55, 75],
    [0, 12, 8],
    { extrapolateRight: 'clamp' },
  );

  const connectionGlow = interpolate(frame, [40, 55], [0, 0.8], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const definitionOpacity = interpolate(frame, [42, 58], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [10, 25], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const bracketFade = interpolate(frame, [20, 38], [0, 0.6], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const cornerExpand = scaleAnim(frame, 25, 20, 0.9, 1);

  const particleDrift = interpolate(frame, [0, 75], [0, 30], {
    easing: Easing.linear,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_paper }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="arrowGlowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.cool_silver} />
            <stop offset="50%" stopColor={COLORS.electric_cyan} />
            <stop offset="100%" stopColor={COLORS.warm_blue} />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.soft_white} stopOpacity="0.95" />
            <stop offset="100%" stopColor={COLORS.bg_paper} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* ── Paper grain ─────────────────────────────────────────── */}
        {grainParticles.map((g) => (
          <circle
            key={`grain-${g.id}`}
            cx={g.x}
            cy={g.y}
            r={g.r}
            fill={COLORS.deep_black}
            opacity={fadeIn * 0.04}
          />
        ))}

        {/* ── Pencil ruled lines ──────────────────────────────────── */}
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={`rule-${i}`}
            x1="80"
            y1={80 + i * 76}
            x2="1000"
            y2={80 + i * 76}
            stroke={COLORS.deep_black}
            strokeWidth="0.3"
            opacity={fadeIn * 0.06}
          />
        ))}

        {/* ── ACTION box (top, faded) ─────────────────────────────── */}
        <g opacity={actionBoxOpacity}>
          <rect
            x="340"
            y="340"
            width="400"
            height="120"
            rx="10"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth="2"
          />
          <rect
            x="345"
            y="345"
            width="390"
            height="110"
            rx="8"
            fill={COLORS.deep_black}
            opacity="0.04"
          />
          <text
            x="540"
            y="415"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="48"
            fontWeight="700"
            fill={COLORS.deep_black}
            opacity="0.6"
            letterSpacing="4"
          >
            ACTION
          </text>

          {/* Small icon inside action box */}
          <circle cx="380" cy="400" r="15" fill="none" stroke={COLORS.deep_black} strokeWidth="1.5" opacity="0.3" />
          <path d="M375 400 L385 395 L385 405 Z" fill={COLORS.deep_black} opacity="0.3" />
        </g>

        {/* ── Arrow from ACTION to OBSERVATION ────────────────────── */}
        <g>
          <path
            d="M 540 460 C 540 540, 540 620, 540 700"
            fill="none"
            stroke="url(#arrowGlowGrad)"
            strokeWidth="3"
            strokeDasharray="300"
            strokeDashoffset={arrowDraw}
            strokeLinecap="round"
          />
          {/* Glow line overlay */}
          <path
            d="M 540 460 C 540 540, 540 620, 540 700"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="6"
            strokeDasharray="300"
            strokeDashoffset={arrowDraw}
            opacity={connectionGlow * 0.3}
            filter="url(#softGlow)"
          />
          {/* Arrowhead */}
          <polygon
            points="525,690 540,715 555,690"
            fill={COLORS.electric_cyan}
            opacity={observationOpacity}
          />
          {/* Flowing dots along arrow */}
          {Array.from({ length: 6 }, (_, i) => {
            const dotT = ((frame * 0.03 + i * 0.15) % 1);
            const dotY = 460 + dotT * 240;
            const dotOp = interpolate(
              frame,
              [18 + i * 3, 25 + i * 3],
              [0, 0.6],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <circle
                key={`fd-${i}`}
                cx="540"
                cy={dotY}
                r="3"
                fill={COLORS.electric_cyan}
                opacity={dotOp}
              />
            );
          })}
        </g>

        {/* ── OBSERVATION definition card ─────────────────────────── */}
        <g
          opacity={observationOpacity}
          transform={`translate(540, 870) scale(${observationScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Card background */}
          <rect
            x="-380"
            y="-120"
            width="760"
            height="240"
            rx="16"
            fill="url(#cardGrad)"
            stroke={COLORS.electric_cyan}
            strokeWidth="2.5"
          />

          {/* Inner glow line */}
          <rect
            x="-370"
            y="-110"
            width="740"
            height="220"
            rx="12"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* OBSERVATION title */}
          <text
            x="0"
            y="-30"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="52"
            fontWeight="800"
            fill={COLORS.electric_cyan}
            letterSpacing="4"
            filter="url(#cyanGlow)"
          >
            OBSERVATION
          </text>

          {/* Definition text */}
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="44"
            fontWeight="400"
            fill={COLORS.deep_black}
            opacity={definitionOpacity * 0.7}
          >
            The result returned after an
          </text>
          <text
            x="0"
            y="65"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="44"
            fontWeight="400"
            fill={COLORS.deep_black}
            opacity={definitionOpacity * 0.7}
          >
            action is executed
          </text>

          {/* Decorative corner brackets on card */}
          {[
            { x: -370, y: -110, sx: 1, sy: 1 },
            { x: 370, y: -110, sx: -1, sy: 1 },
            { x: -370, y: 110, sx: 1, sy: -1 },
            { x: 370, y: 110, sx: -1, sy: -1 },
          ].map((cb, i) => (
            <g key={`cb-${i}`} transform={`translate(${cb.x}, ${cb.y}) scale(${cb.sx}, ${cb.sy})`} opacity={bracketFade}>
              <line x1="0" y1="0" x2="25" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="25" stroke={COLORS.electric_cyan} strokeWidth="2" />
            </g>
          ))}
        </g>

        {/* ── Floating connector dots ─────────────────────────────── */}
        {connectorDots.map((cd) => {
          const dx = cd.x + Math.sin(frame * 0.025 + cd.phase) * 12;
          const dy = cd.y + Math.cos(frame * 0.02 + cd.phase) * 10 + particleDrift;
          return (
            <circle
              key={`cd-${cd.id}`}
              cx={dx}
              cy={dy}
              r={cd.r}
              fill={cd.id % 3 === 0 ? COLORS.electric_cyan : COLORS.warm_blue}
              opacity={observationOpacity * 0.2}
            />
          );
        })}

        {/* ── Caption text ────────────────────────────────────────── */}
        <text
          x="540"
          y="1280"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="36"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={captionOpacity}
        >
          An observation is the
        </text>
        <text
          x="540"
          y="1330"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="36"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={captionOpacity}
        >
          <tspan fill={COLORS.electric_cyan} fontWeight="800">result</tspan>
          {' '}of an{' '}
          <tspan fill={COLORS.warm_blue} fontWeight="800">action</tspan>.
        </text>

        {/* ── Equals sign decoration ──────────────────────────────── */}
        <g opacity={definitionOpacity * 0.4}>
          <line x1="460" y1="1190" x2="620" y2="1190" stroke={COLORS.deep_black} strokeWidth="3" />
          <line x1="460" y1="1205" x2="620" y2="1205" stroke={COLORS.deep_black} strokeWidth="3" />
        </g>

        {/* ── Decorative frame corners ────────────────────────────── */}
        <g opacity={bracketFade} transform={`scale(${cornerExpand})`} style={{ transformOrigin: '540px 960px' }}>
          {[
            { x: 50, y: 50, sx: 1, sy: 1 },
            { x: 1030, y: 50, sx: -1, sy: 1 },
            { x: 50, y: 1870, sx: 1, sy: -1 },
            { x: 1030, y: 1870, sx: -1, sy: -1 },
          ].map((fc, i) => (
            <g key={`fc-${i}`} transform={`translate(${fc.x}, ${fc.y}) scale(${fc.sx}, ${fc.sy})`}>
              <line x1="0" y1="0" x2="40" y2="0" stroke={COLORS.deep_black} strokeWidth="1.5" />
              <line x1="0" y1="0" x2="0" y2="40" stroke={COLORS.deep_black} strokeWidth="1.5" />
            </g>
          ))}
        </g>

        {/* ── Margin line ─────────────────────────────────────────── */}
        <line
          x1="120"
          y1="50"
          x2="120"
          y2="1870"
          stroke={COLORS.vibrant_red}
          strokeWidth="1"
          opacity={fadeIn * 0.12}
        />

        {/* ── Crosshatch shading zones ────────────────────────────── */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={`xh-${i}`}
            x1={140 + i * 70}
            y1="1420"
            x2={160 + i * 70}
            y2="1500"
            stroke={COLORS.deep_black}
            strokeWidth="0.5"
            opacity={fadeIn * 0.05}
          />
        ))}

        {/* ── Small label: "= RESULT" ─────────────────────────────── */}
        <text
          x="540"
          y="1140"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="38"
          fontWeight="400"
          fill={COLORS.cool_silver}
          opacity={observationOpacity * 0.5}
          letterSpacing="3"
        >
          ACTION → OBSERVATION
        </text>

        {/* ── Decorative dots row ─────────────────────────────────── */}
        {Array.from({ length: 9 }, (_, i) => {
          const dOp = interpolate(
            frame,
            [50 + i * 2, 58 + i * 2],
            [0, 0.4],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <circle
              key={`ddot-${i}`}
              cx={540 - 120 + i * 30}
              cy="1400"
              r="3"
              fill={COLORS.deep_black}
              opacity={dOp}
            />
          );
        })}

        {/* ── Notebook holes ──────────────────────────────────────── */}
        {[300, 700, 1100, 1500].map((y, i) => (
          <circle
            key={`nh-${i}`}
            cx="65"
            cy={y}
            r="12"
            fill={COLORS.bg_paper}
            stroke={COLORS.deep_black}
            strokeWidth="1"
            opacity={fadeIn * 0.12}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
