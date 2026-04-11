/**
 * Scene07_FileWrite.tsx — Day 26: Observations
 *
 * "The agent wrote a file. The success confirmation comes back.
 *  That is an observation."
 *
 * Agent icon sends write command to a file/document icon. Green checkmark
 * success animation. "✓ FILE WRITTEN" confirmation text. Paper background.
 * Document with lines appearing. Success pulse ring.
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
import { COLORS } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ── Document line data ──────────────────────────────────────────────── */
const docLines = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  y: i * 28,
  width: 120 + (i % 3) * 40,
  delay: 55 + i * 4,
}));

/* ── Success pulse rings ─────────────────────────────────────────────── */
const pulseRings = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  delay: 85 + i * 6,
}));

export const Scene07_FileWrite: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const agentOpacity = interpolate(frame, [5, 20], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const writeArrowProgress = interpolate(frame, [18, 45], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const fileIconScale = interpolate(frame, [30, 48], [0.6, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const fileIconOpacity = interpolate(frame, [30, 45], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const checkmarkDraw = interpolate(frame, [82, 100], [100, 0], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const checkmarkOpacity = interpolate(frame, [82, 90], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const successTextOpacity = interpolate(frame, [95, 110], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const successTextScale = interpolate(frame, [95, 110], [0.8, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationLabel = interpolate(frame, [115, 130], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const responseArrow = interpolate(frame, [100, 125], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const glowPulse = interpolate(
    frame,
    [85, 100, 148],
    [4, 12, 6],
    { extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_paper }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="writeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.warm_blue} />
            <stop offset="100%" stopColor={COLORS.amber} />
          </linearGradient>
          <linearGradient id="successGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.vibrant_green} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
        </defs>

        {/* ── Paper grain ─────────────────────────────────────────── */}
        {Array.from({ length: 25 }, (_, i) => (
          <circle
            key={`gr-${i}`}
            cx={((i * 151.7) % 1020) + 30}
            cy={((i * 199.3) % 1860) + 30}
            r={0.5 + (i % 3) * 0.3}
            fill={COLORS.deep_black}
            opacity={fadeIn * 0.04}
          />
        ))}

        {/* ── Agent icon (left) ───────────────────────────────────── */}
        <g opacity={agentOpacity} transform="translate(180, 800) scale(1.6)">
          <rect x="-50" y="-65" width="100" height="80" rx="14" fill={COLORS.soft_white} fillOpacity="0.1" stroke={COLORS.deep_black} strokeWidth="3" />
          <circle cx="-15" cy="-35" r="9" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="-15" cy="-35" r="3.5" fill={COLORS.electric_cyan} />
          <circle cx="15" cy="-35" r="9" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="15" cy="-35" r="3.5" fill={COLORS.electric_cyan} />
          <line x1="-10" y1="-5" x2="10" y2="-5" stroke={COLORS.deep_black} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="-40" y="20" width="80" height="55" rx="10" fill="none" stroke={COLORS.deep_black} strokeWidth="2" />
          <text x="0" y="100" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="700" fill={COLORS.deep_black}>AGENT</text>
        </g>

        {/* ── Write arrow (agent → file) ──────────────────────────── */}
        <g>
          <line
            x1="320"
            y1="780"
            x2={320 + 420 * writeArrowProgress}
            y2="780"
            stroke="url(#writeGrad)"
            strokeWidth="4"
            strokeDasharray="10,5"
          />
          <polygon
            points={`${740 * writeArrowProgress + 320 * (1 - writeArrowProgress) + 15},760 ${740 * writeArrowProgress + 320 * (1 - writeArrowProgress) - 10},780 ${740 * writeArrowProgress + 320 * (1 - writeArrowProgress) + 15},800`}
            fill={COLORS.amber}
            opacity={writeArrowProgress}
          />
          <text
            x="540"
            y="730"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="68"
            fontWeight="900"
            fill={COLORS.amber}
            opacity={writeArrowProgress}
            filter="url(#cyanGlow)"
          >
            write(&quot;data.txt&quot;)
          </text>
        </g>

        {/* ── File/Document icon ──────────────────────────────────── */}
        <g
          opacity={fileIconOpacity}
          transform={`translate(860, 780) scale(${fileIconScale * 1.3})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Document shape */}
          <path
            d="M -60 -90 L 40 -90 L 60 -70 L 60 90 L -60 90 Z"
            fill={COLORS.soft_white}
            stroke={COLORS.deep_black}
            strokeWidth="2.5"
          />
          {/* Folded corner */}
          <path
            d="M 40 -90 L 40 -70 L 60 -70"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth="2"
          />
          <path
            d="M 40 -90 L 40 -70 L 60 -70 Z"
            fill={COLORS.bg_paper}
            stroke={COLORS.deep_black}
            strokeWidth="1"
          />

          {/* Document lines (writing animation) */}
          {docLines.map((dl) => {
            const lineOp = interpolate(
              frame,
              [dl.delay, dl.delay + 8],
              [0, 0.6],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            const lineW = interpolate(
              frame,
              [dl.delay, dl.delay + 8],
              [0, dl.width],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <line
                key={`dl-${dl.id}`}
                x1="-40"
                y1={-55 + dl.y}
                x2={-40 + lineW}
                y2={-55 + dl.y}
                stroke={COLORS.deep_black}
                strokeWidth="2"
                opacity={lineOp}
                strokeLinecap="round"
              />
            );
          })}

          <text x="0" y="120" textAnchor="middle" fontFamily="monospace" fontSize="58" fontWeight="700" fill={COLORS.deep_black}>FILE</text>
        </g>

        {/* ── Response arrow (file → agent) ───────────────────────── */}
        <line
          x1="720"
          y1="700"
          x2={720 - 420 * responseArrow}
          y2="700"
          stroke="url(#successGrad)"
          strokeWidth="3"
          strokeDasharray="8,4"
        />
        <polygon
          points={`${720 - 420 * responseArrow + 8},688 ${720 - 420 * responseArrow - 6},700 ${720 - 420 * responseArrow + 8},712`}
          fill={COLORS.vibrant_green}
          opacity={responseArrow}
        />

        {/* ── Green checkmark ─────────────────────────────────────── */}
        <g opacity={checkmarkOpacity} transform="translate(540, 870)">
          <circle
            cx="0"
            cy="0"
            r="55"
            fill={COLORS.vibrant_green}
            opacity="0.12"
          />
          <circle
            cx="0"
            cy="0"
            r="55"
            fill="none"
            stroke={COLORS.vibrant_green}
            strokeWidth="3"
          />
          <path
            d="M -25 0 L -8 18 L 28 -15"
            fill="none"
            stroke={COLORS.vibrant_green}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset={checkmarkDraw}
          />

          {/* Success pulse rings */}
          {pulseRings.map((pr) => {
            const prProgress = interpolate(
              frame,
              [pr.delay, pr.delay + 18],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            return (
              <circle
                key={`pr-${pr.id}`}
                cx="0"
                cy="0"
                r={55 + prProgress * 50}
                fill="none"
                stroke={COLORS.vibrant_green}
                strokeWidth="2"
                opacity={(1 - prProgress) * 0.4}
              />
            );
          })}
        </g>

        {/* ── Success confirmation arrow (file → agent) ──────────── */}
        <path
          d={`M 740 880 L ${740 - 420 * responseArrow} 880`}
          fill="none"
          stroke="url(#successGrad)"
          strokeWidth="4"
          strokeDasharray="12,6"
        />
        <polygon
          points={`${740 - 420 * responseArrow + 15},860 ${740 - 420 * responseArrow - 10},880 ${740 - 420 * responseArrow + 15},900`}
          fill={COLORS.vibrant_green}
          opacity={responseArrow}
        />
        <text
          x="540"
          y="950"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="62"
          fontWeight="900"
          fill={COLORS.vibrant_green}
          opacity={responseArrow}
          filter="url(#cyanGlow)"
        >
          success: true
        </text>

        {/* ── Success badge area ─────────────────────────────────── */}
        <g
          transform={`translate(540, 1150) scale(${successTextScale})`}
          opacity={successTextOpacity}
        >
          <rect
            x="-350"
            y="-65"
            width="700"
            height="130"
            rx="24"
            fill={COLORS.deep_black}
            stroke={COLORS.vibrant_green}
            strokeWidth="4"
            filter="url(#cyanGlow)"
          />
          <text
            x="0"
            y="20"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="68"
            fontWeight="900"
            fill={COLORS.vibrant_green}
          >
            ✓ FILE WRITTEN
          </text>
        </g>

        {/* ── "OBSERVATION" label ──────────────────────────────────── */}
        <g opacity={observationLabel}>
          <rect
            x="140"
            y="1320"
            width="800"
            height="110"
            rx="24"
            fill={COLORS.electric_cyan}
            opacity="0.2"
            filter="url(#cyanGlow)"
          />
          <rect
            x="140"
            y="1320"
            width="800"
            height="110"
            rx="24"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="4"
          />
          <text
            x="540"
            y="1395"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="68"
            fontWeight="900"
            fill={COLORS.electric_cyan}
            filter="url(#cyanGlow)"
          >
            ✓ OBSERVATION
          </text>
        </g>

        {/* ── Main caption group ─────────────────────────────────── */}
        <g transform={`translate(540, 1540)`} opacity={observationLabel}>
          <text
            y="0"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.deep_black}
          >
            The agent wrote a
          </text>
          <text
            y="85"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="72"
            fontWeight="900"
            fill={COLORS.vibrant_green}
            filter="url(#cyanGlow)"
          >
            local file.
          </text>
          <text
            y="170"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.deep_black}
          >
            The confirmation comes back.
          </text>
          <text
            y="255"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.deep_black}
          >
            That is an <tspan fill={COLORS.electric_cyan} fontWeight="900">observation.</tspan>
          </text>
        </g>

        {/* ── Decorative lines ────────────────────────────────────── */}
        <line x1="120" y1="50" x2="120" y2="1870" stroke={COLORS.vibrant_red} strokeWidth="1" opacity={fadeIn * 0.12} />
        <line x1="100" y1="1250" x2="980" y2="1250" stroke={COLORS.deep_black} strokeWidth="0.5" opacity={fadeIn * 0.08} />

        {/* ── Notebook holes ──────────────────────────────────────── */}
        {[300, 700, 1100, 1500].map((y, i) => (
          <circle key={`nh-${i}`} cx="65" cy={y} r="12" fill={COLORS.bg_paper} stroke={COLORS.deep_black} strokeWidth="1" opacity={fadeIn * 0.12} />
        ))}

        {/* ── Page border ─────────────────────────────────────────── */}
        <rect x="50" y="50" width="980" height="1820" fill="none" stroke={COLORS.deep_black} strokeWidth="1" opacity={fadeIn * 0.08} />
      </svg>
    </AbsoluteFill>
  );
};
