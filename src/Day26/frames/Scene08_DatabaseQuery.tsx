/**
 * Scene08_DatabaseQuery.tsx — Day 26: Observations
 *
 * "The agent ran a database query. The returned rows come back.
 *  That is an observation."
 *
 * Agent sends query to database cylinder icon. Table rows animate back:
 * 3-4 data rows sliding in. Database icon with spinning disk animation.
 * "QUERY → ROWS" label. Grid pattern background. Data stream particles.
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

/* ── Data rows ───────────────────────────────────────────────────────── */
const dataRows = [
  { id: 0, cols: ['Alice', '28', 'Engineer'], delay: 90 },
  { id: 1, cols: ['Bob', '34', 'Designer'], delay: 96 },
  { id: 2, cols: ['Carol', '25', 'Analyst'], delay: 102 },
  { id: 3, cols: ['Dave', '31', 'Manager'], delay: 108 },
];

/* ── Grid pattern ────────────────────────────────────────────────────── */
const gridCols = 12;
const gridRows = 22;

/* ── Background particles ────────────────────────────────────────────── */
const bgParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 157.9) % 1080),
  y: ((i * 211.3) % 1920),
  r: 0.8 + (i % 4) * 0.4,
  phase: (i * 0.85) % (Math.PI * 2),
}));

export const Scene08_DatabaseQuery: React.FC = () => {
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

  const queryArrow = interpolate(frame, [18, 45], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const dbScale = interpolate(frame, [28, 45], [0.5, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const dbOpacity = interpolate(frame, [28, 42], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const diskSpin = frame * 3;

  const processingGlow = interpolate(
    frame,
    [45, 60, 75, 85],
    [0, 1, 0.5, 0],
    { extrapolateRight: 'clamp' },
  );

  const responseArrow = interpolate(frame, [75, 100], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationLabel = interpolate(frame, [120, 138], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const gridOpacity = interpolate(frame, [0, 15], [0, 0.04], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(
    frame,
    [50, 70, 166],
    [4, 10, 6],
    { extrapolateRight: 'clamp' },
  );

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
          <linearGradient id="queryGrad08" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.warm_blue} />
            <stop offset="100%" stopColor={COLORS.purple} />
          </linearGradient>
          <linearGradient id="responseGrad08" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.vibrant_green} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
        </defs>

        {/* ── Grid pattern background ─────────────────────────────── */}
        {Array.from({ length: gridCols }, (_, i) => (
          <line
            key={`vg-${i}`}
            x1={i * 90 + 45}
            y1="0"
            x2={i * 90 + 45}
            y2="1920"
            stroke={COLORS.deep_black}
            strokeWidth="0.5"
            opacity={gridOpacity}
          />
        ))}
        {Array.from({ length: gridRows }, (_, i) => (
          <line
            key={`hg-${i}`}
            x1="0"
            y1={i * 90 + 45}
            x2="1080"
            y2={i * 90 + 45}
            stroke={COLORS.deep_black}
            strokeWidth="0.5"
            opacity={gridOpacity}
          />
        ))}

        {/* ── Background particles ────────────────────────────────── */}
        {bgParticles.map((p) => {
          const px = p.x + Math.sin(frame * 0.02 + p.phase) * 8;
          const py = p.y + Math.cos(frame * 0.018 + p.phase) * 6;
          return (
            <circle
              key={`bp-${p.id}`}
              cx={px}
              cy={py}
              r={p.r}
              fill={p.id % 3 === 0 ? COLORS.purple : COLORS.deep_black}
              opacity={fadeIn * 0.06}
            />
          );
        })}

        {/* ── Agent icon (left) ───────────────────────────────────── */}
        <g opacity={agentOpacity} transform="translate(180, 800) scale(1.6)">
          <rect x="-50" y="-65" width="100" height="80" rx="14" fill={COLORS.soft_white} fillOpacity="0.1" stroke={COLORS.deep_black} strokeWidth="3" />
          <circle cx="-15" cy="-35" r="9" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="-15" cy="-35" r="3.5" fill={COLORS.electric_cyan} />
          <circle cx="15" cy="-35" r="9" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="15" cy="-35" r="3.5" fill={COLORS.electric_cyan} />
          <line x1="-10" y1="-5" x2="10" y2="-5" stroke={COLORS.deep_black} strokeWidth="2" strokeLinecap="round" />
          <rect x="-40" y="20" width="80" height="55" rx="10" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" />
          <text x="0" y="105" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="900" fill={COLORS.deep_black}>AGENT</text>
        </g>

        {/* ── Query arrow (agent → database) ──────────────────────── */}
        <g>
          <line
            x1="320"
            y1="780"
            x2={320 + 440 * queryArrow}
            y2="780"
            stroke="url(#queryGrad08)"
            strokeWidth="4"
            strokeDasharray="10,5"
          />
          <polygon
            points={`${760 * queryArrow + 320 * (1 - queryArrow) + 15},760 ${760 * queryArrow + 320 * (1 - queryArrow) - 10},780 ${760 * queryArrow + 320 * (1 - queryArrow) + 15},800`}
            fill={COLORS.purple}
            opacity={queryArrow}
          />
          <text
            x="540"
            y="720"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="68"
            fontWeight="900"
            fill={COLORS.purple}
            opacity={queryArrow}
            filter="url(#cyanGlow)"
          >
            SELECT * FROM users
          </text>
        </g>

        {/* ── Database cylinder icon ──────────────────────────────── */}
        <g
          opacity={dbOpacity}
          transform={`translate(860, 780) scale(${dbScale * 1.3})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Cylinder body */}
          <rect x="-60" y="-50" width="120" height="120" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" />
          {/* Top ellipse */}
          <ellipse cx="0" cy="-50" rx="60" ry="22" fill={COLORS.soft_white} stroke={COLORS.deep_black} strokeWidth="2.5" />
          {/* Middle ellipse */}
          <ellipse cx="0" cy="0" rx="60" ry="18" fill="none" stroke={COLORS.deep_black} strokeWidth="1" opacity="0.3" />
          {/* Bottom ellipse */}
          <ellipse cx="0" cy="70" rx="60" ry="22" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" />
          {/* Spinning disk indicator */}
          <ellipse
            cx="0"
            cy="-50"
            rx="35"
            ry="12"
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="1.5"
            strokeDasharray="8,6"
            strokeDashoffset={diskSpin}
            opacity="0.5"
          />

          {/* Processing glow */}
          <ellipse
            cx="0"
            cy="10"
            rx={60 + processingGlow * 15}
            ry={60 + processingGlow * 15}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="2"
            opacity={processingGlow * 0.4}
          />

          <text x="0" y="115" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="900" fill={COLORS.deep_black}>DATABASE</text>
        </g>

        {/* ── Response arrow (database → agent) ───────────────────── */}
        <g>
          <path
            d={`M 740 880 L ${740 - 430 * responseArrow} 880`}
            fill="none"
            stroke="url(#responseGrad08)"
            strokeWidth="4"
            strokeDasharray="12,6"
          />
          <polygon
            points={`${740 - 430 * responseArrow + 15},860 ${740 - 430 * responseArrow - 10},880 ${740 - 430 * responseArrow + 15},900`}
            fill={COLORS.vibrant_green}
            opacity={responseArrow}
          />
          <text
            x="540"
            y="950"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.vibrant_green}
            opacity={responseArrow}
            filter="url(#cyanGlow)"
          >
            4 rows
          </text>
        </g>

        {/* ── Result table ────────────────────────────────────────── */}
        <g transform="translate(140, 1050)" opacity={responseArrow}>
          <rect x="0" y="0" width="800" height="300" rx="16" fill={COLORS.deep_black} fillOpacity="0.05" stroke={COLORS.deep_black} strokeWidth="1" opacity="0.1" />
          
          {/* Header */}
          <rect x="0" y="0" width="800" height="60" rx="12" fill={COLORS.deep_black} fillOpacity="0.1" />
          <text x="100" y="40" fontSize="38" fontWeight="900" fill={COLORS.deep_black} opacity="0.6">NAME</text>
          <text x="400" y="40" fontSize="38" fontWeight="900" fill={COLORS.deep_black} opacity="0.6">AGE</text>
          <text x="650" y="40" fontSize="38" fontWeight="900" fill={COLORS.deep_black} opacity="0.6">ROLE</text>

          {dataRows.map((dr, idx) => {
            const rowOp = interpolate(frame, [dr.delay, dr.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`dr-${dr.id}`} transform={`translate(0, ${65 + idx * 55})`} opacity={rowOp}>
                <rect x="0" y="0" width="800" height="50" rx="8" fill={idx % 2 === 0 ? COLORS.soft_white : 'none'} stroke={COLORS.deep_black} strokeWidth="0.5" opacity="0.2" />
                <text x="40" y="35" fontSize="32" fontWeight="700" fill={COLORS.deep_black} opacity="0.1">{idx + 1}</text>
                <text x="100" y="35" fontSize="38" fontWeight="900" fill={COLORS.deep_black}>{dr.cols[0]}</text>
                <text x="400" y="35" fontSize="38" fontWeight="900" fill={COLORS.deep_black}>{dr.cols[1]}</text>
                <text x="650" y="35" fontSize="38" fontWeight="900" fill={COLORS.deep_black}>{dr.cols[2]}</text>
              </g>
            );
          })}
        </g>

        {/* ── "OBSERVATION" label ──────────────────────────────────── */}
        <g opacity={observationLabel}>
          <rect
            x="180"
            y="1420"
            width="720"
            height="110"
            rx="24"
            fill={COLORS.electric_cyan}
            opacity="0.2"
            filter="url(#cyanGlow)"
          />
          <rect
            x="180"
            y="1420"
            width="720"
            height="110"
            rx="24"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="4"
          />
          <text
            x="540"
            y="1495"
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
        <g transform={`translate(540, 1620)`} opacity={observationLabel}>
          <text
            y="0"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.deep_black}
          >
            The agent ran a
          </text>
          <text
            y="85"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="72"
            fontWeight="900"
            fill={COLORS.purple}
            filter="url(#cyanGlow)"
          >
            database query.
          </text>
          <text
            y="170"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.deep_black}
          >
            The returned rows come back.
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
        <line x1="100" y1="1280" x2="980" y2="1280" stroke={COLORS.deep_black} strokeWidth="0.5" opacity={fadeIn * 0.08} />

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
