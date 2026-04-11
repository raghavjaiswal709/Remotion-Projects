/**
 * Scene17_ObservationTypes.tsx — Day 26: Observations
 *
 * Visual recap of the three observation examples. Three columns:
 * Search (magnifying glass icon), File (document icon), Database
 * (cylinder icon). Each with a small arrow showing data return.
 * Labels beneath each. All glowing cyan. Grid alignment.
 * Synchronized reveal animation left to right.
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

/* ── Column config ────────────────────────────────────────────────────── */
const columns = [
  { label: 'SEARCH', subtitle: 'API', x: 200, delay: 8, icon: 'search' },
  { label: 'FILE', subtitle: 'Write', x: 540, delay: 18, icon: 'file' },
  { label: 'DATABASE', subtitle: 'Query', x: 880, delay: 28, icon: 'database' },
];

const COL_TOP = 520;
const ICON_SIZE = 125;

/* ── Background grid particles ────────────────────────────────────────── */
const gridParticles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 131) % 1080,
  y: (i * 193) % 1920,
  r: 0.8 + (i % 4) * 0.5,
  phase: (i * 2.2) % (Math.PI * 2),
}));

/* ── Data return particles ────────────────────────────────────────────── */
const returnParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  colIdx: i % 3,
  yOffset: (Math.floor(i / 3) % 5) * 25,
  size: 2 + (i % 3) * 1,
  speed: 1 + (i % 4) * 0.5,
  phase: (i * 1.6) % (Math.PI * 2),
}));

/* ── Circuit lines ────────────────────────────────────────────────────── */
const circuitLines = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: 30 + (i * 97) % 1020,
  y: 50 + (i * 157) % 1820,
  len: 18 + (i % 5) * 12,
  horiz: i % 2 === 0,
  delay: i * 2,
}));

/* ── Glow ring particles per column ───────────────────────────────────── */
const glowRings = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  colIdx: i % 3,
  angle: (Math.floor(i / 3) / 8) * Math.PI * 2,
  r: ICON_SIZE + 25 + (i % 4) * 8,
  size: 1.5 + (i % 3) * 0.8,
}));

/* ── Connecting horizontal lines ──────────────────────────────────────── */
const connectors = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  y: COL_TOP + 60 + i * 30,
  delay: 30 + i * 3,
}));

export const Scene17_ObservationTypes: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, 15], [-40, 0], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const gridOpacity = interpolate(frame, [3, 12], [0, 0.08], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const circuitOpacity = interpolate(frame, [5, 15], [0, 0.15], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const connectorProg = interpolate(frame, [35, 55], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const glowPulse = interpolate(
    frame % 40, [0, 20, 40], [0.5, 1, 0.5],
    { extrapolateRight: 'clamp' }
  );

  const subtitleOpacity = interpolate(frame, [40, 52], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const arrowFlow = (frame % 30) / 30;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="iconShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="colRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.08" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Background grid ──────────────────────────────────────── */}
        <g opacity={gridOpacity}>
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`hg-${i}`} x1={0} y1={i * 90} x2={1080} y2={i * 90}
              stroke={COLORS.cool_silver} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`vg-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth="0.5" />
          ))}
        </g>

        {/* ── Grid particles ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          {gridParticles.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.r}
              fill={COLORS.cool_silver}
              opacity={0.2 + Math.sin(frame * 0.04 + p.phase) * 0.1} />
          ))}
        </g>

        {/* ── Circuit lines ────────────────────────────────────────── */}
        <g opacity={circuitOpacity}>
          {circuitLines.map((c) => {
            const prog = interpolate(frame, [c.delay, c.delay + 10], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={c.id}>
                <line
                  x1={c.x} y1={c.y}
                  x2={c.horiz ? c.x + c.len * prog : c.x}
                  y2={c.horiz ? c.y : c.y + c.len * prog}
                  stroke={COLORS.cool_silver} strokeWidth="1" strokeLinecap="round"
                />
                <circle cx={c.x} cy={c.y} r={1.5} fill={COLORS.cool_silver} opacity={0.3} />
              </g>
            );
          })}
        </g>

        {/* ── Title ────────────────────────────────────────────────── */}
        <g opacity={titleOpacity} transform={`translate(0, ${titleY})`}>
          <text x={540} y={240} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="48" fontFamily="monospace"
            fontWeight="bold" letterSpacing="2" filter="url(#cyanGlow)">
            OBSERVATION TYPES
          </text>
          <line x1={200} y1={270} x2={880} y2={270}
            stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.35} />
          <text x={540} y={340} textAnchor="middle"
            fill={COLORS.cool_silver} fontSize="44" fontFamily="monospace">
            Three examples of observations
          </text>
        </g>

        {/* ── Column divider lines ─────────────────────────────────── */}
        <g opacity={fadeIn * 0.1}>
          <line x1={360} y1={450} x2={360} y2={1400}
            stroke={COLORS.cool_silver} strokeWidth="1" strokeDasharray="6,4" />
          <line x1={720} y1={450} x2={720} y2={1400}
            stroke={COLORS.cool_silver} strokeWidth="1" strokeDasharray="6,4" />
        </g>

        {/* ── Three columns ────────────────────────────────────────── */}
        {columns.map((col, idx) => {
          const colScale = scaleAnim(frame, col.delay, 15, 0, 1);
          const colOpacity = interpolate(frame, [col.delay, col.delay + 12], [0, 1], {
            easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const iconY = COL_TOP;

          return (
            <g key={idx} opacity={colOpacity}>
              {/* Radial glow behind column */}
              <circle cx={col.x} cy={iconY + 50} r={150}
                fill="url(#colRadial)" />

              {/* Icon container */}
              <g transform={`translate(${col.x}, ${iconY}) scale(${colScale})`}>
                {/* Outer ring */}
                <circle cx={0} cy={0} r={ICON_SIZE}
                  fill="none" stroke={COLORS.electric_cyan} strokeWidth="2.5"
                  opacity={glowPulse * 0.5} filter="url(#softGlow)" />

                {/* Inner circle */}
                <circle cx={0} cy={0} r={ICON_SIZE - 15}
                  fill="#0A1628" stroke={COLORS.electric_cyan}
                  strokeWidth="2" filter="url(#iconShadow)" />

                {/* ── SEARCH icon ────────────────────────────────── */}
                {col.icon === 'search' && (
                  <g>
                    <circle cx={-8} cy={-8} r={28}
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="3.5" />
                    <line x1={12} y1={12} x2={32} y2={32}
                      stroke={COLORS.electric_cyan} strokeWidth="4" strokeLinecap="round" />
                    {/* Lens shine */}
                    <path d="M -18 -18 A 18 18 0 0 1 -2 -26"
                      fill="none" stroke={COLORS.soft_white} strokeWidth="2" opacity={0.3} />
                  </g>
                )}

                {/* ── FILE icon ──────────────────────────────────── */}
                {col.icon === 'file' && (
                  <g>
                    <path d="M -22 -35 L 14 -35 L 25 -22 L 25 35 L -22 35 Z"
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="3"
                      strokeLinejoin="round" />
                    {/* Fold corner */}
                    <path d="M 14 -35 L 14 -22 L 25 -22"
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
                    {/* Text lines */}
                    <line x1={-12} y1={-8} x2={15} y2={-8}
                      stroke={COLORS.electric_cyan} strokeWidth="2" opacity={0.5} />
                    <line x1={-12} y1={4} x2={10} y2={4}
                      stroke={COLORS.electric_cyan} strokeWidth="2" opacity={0.5} />
                    <line x1={-12} y1={16} x2={12} y2={16}
                      stroke={COLORS.electric_cyan} strokeWidth="2" opacity={0.5} />
                    {/* Checkmark */}
                    <path d="M 6 22 L 12 28 L 22 14"
                      fill="none" stroke={COLORS.vibrant_green} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}

                {/* ── DATABASE icon ──────────────────────────────── */}
                {col.icon === 'database' && (
                  <g>
                    {/* Top ellipse */}
                    <ellipse cx={0} cy={-25} rx={30} ry={12}
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="3" />
                    {/* Body */}
                    <line x1={-30} y1={-25} x2={-30} y2={25}
                      stroke={COLORS.electric_cyan} strokeWidth="3" />
                    <line x1={30} y1={-25} x2={30} y2={25}
                      stroke={COLORS.electric_cyan} strokeWidth="3" />
                    {/* Bottom ellipse */}
                    <ellipse cx={0} cy={25} rx={30} ry={12}
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="3" />
                    {/* Middle rings */}
                    <path d="M -30 0 A 30 12 0 0 0 30 0"
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.4} />
                    <path d="M -30 -12 A 30 12 0 0 0 30 -12"
                      fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.4} />
                    {/* Data dots */}
                    <circle cx={-10} cy={-8} r={3} fill={COLORS.electric_cyan} opacity={0.5} />
                    <circle cx={10} cy={-8} r={3} fill={COLORS.electric_cyan} opacity={0.5} />
                    <circle cx={0} cy={8} r={3} fill={COLORS.electric_cyan} opacity={0.5} />
                  </g>
                )}
              </g>

              {/* ── Data return arrow ──────────────────────────────── */}
              <g opacity={colOpacity}>
                {/* Upward arrow */}
                <line x1={col.x} y1={iconY + ICON_SIZE + 30}
                  x2={col.x} y2={iconY + ICON_SIZE + 100}
                  stroke={COLORS.electric_cyan} strokeWidth="2.5"
                  strokeDasharray="8,5" opacity={0.6} />
                <polygon
                  points={`${col.x},${iconY + ICON_SIZE + 25} ${col.x - 8},${iconY + ICON_SIZE + 40} ${col.x + 8},${iconY + ICON_SIZE + 40}`}
                  fill={COLORS.electric_cyan} opacity={0.7}
                />
                {/* "DATA" label */}
                <rect x={col.x - 55} y={iconY + ICON_SIZE + 50} width={110} height={36} rx="8"
                  fill={COLORS.bg_black} fillOpacity="0.8"
                  stroke={COLORS.electric_cyan} strokeWidth="1.5" />
                <text x={col.x} y={iconY + ICON_SIZE + 75} textAnchor="middle"
                  fill={COLORS.electric_cyan} fontSize="34" fontFamily="monospace"
                  fontWeight="bold">
                  DATA ↑
                </text>
              </g>

              {/* ── Column label ───────────────────────────────────── */}
              <text x={col.x} y={iconY + ICON_SIZE + 160} textAnchor="middle"
                fill={COLORS.electric_cyan} fontSize="58" fontFamily="monospace"
                fontWeight="bold" letterSpacing="2" filter="url(#cyanGlow)"
                opacity={colOpacity}>
                {col.label}
              </text>
              <text x={col.x} y={iconY + ICON_SIZE + 210} textAnchor="middle"
                fill={COLORS.cool_silver} fontSize="52" fontFamily="monospace"
                opacity={colOpacity * 0.8}>
                {col.subtitle}
              </text>

              {/* ── Result box ─────────────────────────────────────── */}
              <g opacity={colOpacity}>
                <rect x={col.x - 140} y={iconY + ICON_SIZE + 240}
                  width={280} height={70} rx="14"
                  fill="#0A1628" stroke={COLORS.electric_cyan}
                  strokeWidth="2" opacity={0.8} />
                <text x={col.x} y={iconY + ICON_SIZE + 288} textAnchor="middle"
                  fill={COLORS.electric_cyan} fontSize="42" fontFamily="monospace"
                  opacity={0.9}>
                  {idx === 0 ? '{ res: [...] }' :
                    idx === 1 ? '{ status: "ok" }' :
                      '{ rows: 3 }'}
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Glow ring particles ──────────────────────────────────── */}
        <g opacity={fadeIn * 0.4}>
          {glowRings.map((g_) => {
            const col = columns[g_.colIdx];
            const colOp = interpolate(frame, [col.delay, col.delay + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const a = g_.angle + frame * 0.02;
            const px = col.x + Math.cos(a) * g_.r;
            const py = COL_TOP + Math.sin(a) * g_.r;
            return (
              <circle key={g_.id} cx={px} cy={py} r={g_.size}
                fill={COLORS.electric_cyan} opacity={colOp * 0.3} />
            );
          })}
        </g>

        {/* ── Data return particles ────────────────────────────────── */}
        <g opacity={0.5}>
          {returnParticles.map((rp) => {
            const col = columns[rp.colIdx];
            const colOp = interpolate(frame, [col.delay + 5, col.delay + 15], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const yBase = COL_TOP + ICON_SIZE + 30 + rp.yOffset;
            const flowY = yBase - (arrowFlow + rp.phase / (Math.PI * 2)) % 1 * 80;
            return (
              <circle key={rp.id}
                cx={col.x + (rp.id % 2 === 0 ? 5 : -5)}
                cy={flowY} r={rp.size}
                fill={COLORS.electric_cyan} opacity={colOp * 0.4} />
            );
          })}
        </g>

        {/* ── Connecting horizontal lines ──────────────────────────── */}
        <g opacity={connectorProg * 0.15}>
          {connectors.map((c) => (
            <line key={c.id}
              x1={180} y1={c.y} x2={900} y2={c.y}
              stroke={COLORS.electric_cyan} strokeWidth="0.5"
              strokeDasharray="4,8"
            />
          ))}
        </g>

        {/* ── Bottom label ─────────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={80} y={1480} width={920} height={80} rx="14"
            fill={COLORS.bg_black} fillOpacity="0.85"
            stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <text x={540} y={1530} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="46" fontFamily="monospace"
            fontWeight="bold" letterSpacing="2">
            OBSERVATIONS = THE WORLD'S REPLY
          </text>
        </g>

        {/* ── Bottom subtitle ──────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={60} y={1540} width={960} height={180} rx="24"
            fill={COLORS.deep_black} fillOpacity="0.85"
            stroke={COLORS.electric_cyan} strokeWidth="3" />
          <text x={540} y={1610} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="58" fontWeight="bold">
            Search, file, or database
          </text>
          <text x={540} y={1690} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="62" fontWeight="900">
            All return observations.
          </text>
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.03}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.electric_cyan} strokeWidth="1" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
