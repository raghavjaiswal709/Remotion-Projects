/**
 * Shared SVG components for Moon — Dark Premium Editorial style.
 * Pure black backgrounds, flat solid fills, hard silver/pink outlines.
 */

import React from 'react';
import { C } from './timing';

// ── Star field — deterministic positions, subtle depth ───────────────────────
const STARS = Array.from({ length: 70 }, (_, i) => {
  const h1 = ((i * 2654435761 + 1) >>> 0) / 4294967296;
  const h2 = ((i * 2246822519 + 3) >>> 0) / 4294967296;
  const h3 = ((i * 3266489917 + 5) >>> 0) / 4294967296;
  return {
    x: h1 * 1080,
    y: h2 * 1920,
    r: 0.6 + h3 * 1.2,
    op: 0.15 + h3 * 0.35,
  };
});

export const StarField: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <g opacity={opacity}>
    {STARS.map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.silver} opacity={s.op} />
    ))}
  </g>
);

// ── Corner brackets — cool silver precision markers ───────────────────────────
export const CornerBrackets: React.FC<{ opacity?: number; size?: number }> = ({
  opacity = 0.4,
  size = 50,
}) => (
  <g opacity={opacity} stroke={C.silver} strokeWidth={2} fill="none" strokeLinecap="round">
    {/* TL */}
    <path d={`M 50,${50 + size} L 50,50 L ${50 + size},50`} />
    {/* TR */}
    <path d={`M ${1080 - 50 - size},50 L ${1080 - 50},50 L ${1080 - 50},${50 + size}`} />
    {/* BL */}
    <path d={`M 50,${1920 - 50 - size} L 50,${1920 - 50} L ${50 + size},${1920 - 50}`} />
    {/* BR */}
    <path d={`M ${1080 - 50 - size},${1920 - 50} L ${1080 - 50},${1920 - 50} L ${1080 - 50},${1920 - 50 - size}`} />
  </g>
);

// ── Caption bar — bottom text strip, dark panel ───────────────────────────────
interface CaptionProps {
  text: string;
  opacity?: number;
  highlight?: string[];
}

export const CaptionBar: React.FC<CaptionProps> = ({
  text,
  opacity = 1,
  highlight = [],
}) => {
  const words = text.split(' ');
  // Estimate character positions for inline SVG word coloring
  return (
    <g opacity={opacity}>
      {/* Panel */}
      <rect x={0} y={1760} width={1080} height={160} fill={C.bg} opacity={0.88} />
      <line x1={0} y1={1760} x2={1080} y2={1760} stroke={C.steel_blue} strokeWidth={1.5} opacity={0.5} />
      {/* Render text as a single block — highlight done via tspan color */}
      <text
        x={540}
        y={1845}
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontSize={36}
        fontWeight={500}
        fill={C.silver}
        letterSpacing="0.02em"
      >
        {words.map((w, i) => {
          const clean = w.replace(/[,."]/g, '');
          const isHighlight = highlight.some(h => clean.toLowerCase() === h.toLowerCase());
          return (
            <tspan
              key={i}
              fill={isHighlight ? C.warm_pink : C.silver}
              fontWeight={isHighlight ? 700 : 500}
            >
              {i > 0 ? ' ' : ''}{w}
            </tspan>
          );
        })}
      </text>
    </g>
  );
};

// ── Moon circle — parametric, used across multiple scenes ────────────────────
interface MoonProps {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
}

export const MoonCircle: React.FC<MoonProps> = ({ cx, cy, r, opacity = 1 }) => {
  // Craters (deterministic positions relative to center)
  const craters = [
    { dx: -r * 0.28, dy: -r * 0.15, cr: r * 0.09 },
    { dx:  r * 0.18, dy:  r * 0.22, cr: r * 0.07 },
    { dx: -r * 0.08, dy:  r * 0.30, cr: r * 0.05 },
    { dx:  r * 0.32, dy: -r * 0.28, cr: r * 0.06 },
    { dx: -r * 0.35, dy:  r * 0.10, cr: r * 0.04 },
    { dx:  r * 0.10, dy: -r * 0.35, cr: r * 0.08 },
  ];
  return (
    <g opacity={opacity}>
      {/* Shadow zone — muted left third */}
      <clipPath id={`moonClip_${cx}_${cy}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      {/* Moon base */}
      <circle cx={cx} cy={cy} r={r} fill={C.silver} stroke={C.slate} strokeWidth={2} />
      {/* Shadow region */}
      <ellipse cx={cx - r * 0.25} cy={cy} rx={r * 0.55} ry={r}
        fill={C.muted_blue} opacity={0.45}
        clipPath={`url(#moonClip_${cx}_${cy})`} />
      {/* Craters */}
      {craters.map((c, i) => (
        <circle key={i}
          cx={cx + c.dx} cy={cy + c.dy} r={c.cr}
          fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.7} />
      ))}
      {/* Outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.silver} strokeWidth={2.5} />
    </g>
  );
};

// ── Earth circle ──────────────────────────────────────────────────────────────
interface EarthProps {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
}

export const EarthCircle: React.FC<EarthProps> = ({ cx, cy, r, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={cx} cy={cy} r={r} fill={C.teal} stroke={C.mint} strokeWidth={2} />
    {/* Continent patches */}
    <ellipse cx={cx - r * 0.2} cy={cy - r * 0.1} rx={r * 0.22} ry={r * 0.28}
      fill={C.mint} opacity={0.6} />
    <ellipse cx={cx + r * 0.15} cy={cy + r * 0.15} rx={r * 0.18} ry={r * 0.22}
      fill={C.soft_teal} opacity={0.55} />
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.mint} strokeWidth={2} />
  </g>
);

// ── Spacecraft — simplified flat design ───────────────────────────────────────
interface CraftProps {
  cx: number;
  cy: number;
  scale?: number;
  angle?: number;
  opacity?: number;
}

export const Spacecraft: React.FC<CraftProps> = ({
  cx, cy, scale = 1, angle = 0, opacity = 1,
}) => (
  <g
    opacity={opacity}
    transform={`translate(${cx},${cy}) rotate(${angle}) scale(${scale})`}
  >
    {/* Main body */}
    <rect x={-36} y={-14} width={72} height={28} rx={6}
      fill={C.peach} stroke={C.silver} strokeWidth={2} />
    {/* Solar panel left */}
    <rect x={-80} y={-8} width={40} height={16} rx={2}
      fill={C.steel_blue} stroke={C.powder_blue} strokeWidth={1.5} />
    {/* Solar panel right */}
    <rect x={40} y={-8} width={40} height={16} rx={2}
      fill={C.steel_blue} stroke={C.powder_blue} strokeWidth={1.5} />
    {/* Thruster */}
    <rect x={-50} y={-6} width={14} height={12} rx={3}
      fill={C.copper} stroke={C.silver} strokeWidth={1.5} />
    {/* Antenna */}
    <line x1={12} y1={-14} x2={22} y2={-34}
      stroke={C.silver} strokeWidth={1.5} />
    <circle cx={22} cy={-34} r={3} fill={C.warm_pink} />
  </g>
);
