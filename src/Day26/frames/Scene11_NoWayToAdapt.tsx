/**
 * Scene11_NoWayToAdapt.tsx — Day 26: Observations
 *
 * "No way to know whether its action succeeded, no way to adapt,
 *  no way to change course."
 *
 * Three panels stacking vertically: "NO FEEDBACK" with X,
 * "NO ADAPTATION" with X, "NO COURSE CHANGE" with X.
 * Each panel slides in sequentially. Red cross marks appearing.
 * Broken arrow paths. Static noise effect overlay.
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

/* ── Static noise particles ───────────────────────────────────────────── */
const noiseParticles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 139) % 1080,
  y: (i * 211) % 1920,
  size: 2 + (i % 3),
  speed: 7 + (i % 11),
}));

/* ── Circuit line segments ────────────────────────────────────────────── */
const circuitLines = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x1: 50 + (i * 97) % 980,
  y1: 100 + (i * 167) % 1720,
  len: 30 + (i % 4) * 20,
  horizontal: i % 2 === 0,
  delay: i * 3,
}));

/* ── Broken arrow fragments ───────────────────────────────────────────── */
const brokenArrows = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 150 + (i % 4) * 250,
  y: 500 + Math.floor(i / 4) * 400,
  angle: (i * 37) % 360,
  length: 25 + (i % 3) * 15,
  delay: 15 + i * 4,
}));

/* ── Panel config ─────────────────────────────────────────────────────── */
const panels = [
  { label: 'NO FEEDBACK', subtitle: 'Action succeeded?', icon: 'feedback', delay: 10, y: 440 },
  { label: 'NO ADAPTATION', subtitle: 'Cannot learn or adjust', icon: 'adapt', delay: 30, y: 780 },
  { label: 'NO COURSE CHANGE', subtitle: 'Stuck on the same path', icon: 'course', delay: 50, y: 1120 },
];

/* ── Decay particles ──────────────────────────────────────────────────── */
const decayParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  cx: 100 + (i * 83) % 880,
  cy: 300 + (i * 131) % 1400,
  r: 1.5 + (i % 4) * 0.8,
  phase: (i * 1.7) % (Math.PI * 2),
}));

export const Scene11_NoWayToAdapt: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, 15], [-40, 0], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const staticFlicker = interpolate(
    frame % 8,
    [0, 2, 4, 6, 8],
    [0.05, 0.12, 0.04, 0.1, 0.05],
    { extrapolateRight: 'clamp' }
  );

  const crossPulse = interpolate(
    frame % 24,
    [0, 12, 24],
    [0.7, 1, 0.7],
    { extrapolateRight: 'clamp' }
  );

  const circuitOpacity = interpolate(frame, [5, 20], [0, 0.25], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const brokenArrowProg = interpolate(frame, [15, 60], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const bottomTextOpacity = interpolate(frame, [60, 72], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.4" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="panelShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="redFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.vibrant_red} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.vibrant_red} stopOpacity="0.2" />
          </linearGradient>
          <clipPath id="panelClip">
            <rect x="100" y="0" width="880" height="260" rx="20" />
          </clipPath>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Background grid ──────────────────────────────────────── */}
        <g opacity={0.06}>
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`hg-${i}`} x1={0} y1={i * 90} x2={1080} y2={i * 90}
              stroke={COLORS.cool_silver} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`vg-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth="0.5" />
          ))}
        </g>

        {/* ── Circuit lines ────────────────────────────────────────── */}
        <g opacity={circuitOpacity}>
          {circuitLines.map((c) => {
            const prog = interpolate(frame, [c.delay, c.delay + 15], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <line
                key={c.id}
                x1={c.x1} y1={c.y1}
                x2={c.horizontal ? c.x1 + c.len * prog : c.x1}
                y2={c.horizontal ? c.y1 : c.y1 + c.len * prog}
                stroke={COLORS.cool_silver} strokeWidth="1"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ── Title ────────────────────────────────────────────────── */}
        <g opacity={titleOpacity} transform={`translate(0, ${titleY})`}>
          <text x={540} y={250} textAnchor="middle"
            fill={COLORS.cool_silver} fontSize="38" fontFamily="monospace"
            fontWeight="bold" letterSpacing="4">
            THE AGENT HAS:
          </text>
          <line x1={200} y1={280} x2={880} y2={280}
            stroke={COLORS.vibrant_red} strokeWidth="2" opacity={0.5} />
        </g>

        {/* ── Three panels ─────────────────────────────────────────── */}
        {panels.map((p, idx) => {
          const slideX = interpolate(
            frame,
            [p.delay, p.delay + 18],
            [idx % 2 === 0 ? -600 : 600, 0],
            { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const panelOpacity = interpolate(
            frame, [p.delay, p.delay + 15], [0, 1],
            { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const crossScale = scaleAnim(frame, p.delay + 12, 10, 0, 1);

          return (
            <g key={idx} opacity={panelOpacity}
              transform={`translate(${slideX}, 0)`}>
              {/* Panel background */}
              <rect
                x={100} y={p.y} width={880} height={240} rx="20"
                fill="#111827" stroke={COLORS.vibrant_red}
                strokeWidth="2" filter="url(#panelShadow)"
              />

              {/* Red accent bar */}
              <rect x={100} y={p.y} width={10} height={240} rx="5"
                fill={COLORS.vibrant_red} />

              {/* Panel number */}
              <circle cx={190} cy={p.y + 60} r={25}
                fill="none" stroke={COLORS.vibrant_red} strokeWidth="2" />
              <text x={190} y={p.y + 67} textAnchor="middle"
                fill={COLORS.vibrant_red} fontSize="44" fontFamily="monospace"
                fontWeight="bold">
                {idx + 1}
              </text>

              {/* Label */}
              <text x={290} y={p.y + 80} textAnchor="start"
                fill={COLORS.soft_white} fontSize="54" fontFamily="monospace"
                fontWeight="bold">
                {p.label}
              </text>

              {/* Subtitle */}
              <text x={290} y={p.y + 145} textAnchor="start"
                fill={COLORS.light_gray} fontSize="42" fontFamily="monospace">
                {p.subtitle}
              </text>

              {/* Icon area with X */}
              <g transform={`translate(${890}, ${p.y + 50})`}>
                {p.icon === 'feedback' && (
                  <g>
                    <path d="M -20 -15 L 20 -15 L 20 15 L 0 25 L -20 15 Z"
                      fill="none" stroke={COLORS.cool_silver} strokeWidth="2" />
                    <line x1={-8} y1={0} x2={8} y2={0} stroke={COLORS.cool_silver} strokeWidth="2" />
                  </g>
                )}
                {p.icon === 'adapt' && (
                  <g>
                    <circle cx={0} cy={0} r={20} fill="none"
                      stroke={COLORS.cool_silver} strokeWidth="2" />
                    <path d="M -8 -5 L 0 -12 L 8 -5" fill="none"
                      stroke={COLORS.cool_silver} strokeWidth="2" />
                    <path d="M 8 5 L 0 12 L -8 5" fill="none"
                      stroke={COLORS.cool_silver} strokeWidth="2" />
                  </g>
                )}
                {p.icon === 'course' && (
                  <g>
                    <path d="M -20 10 C -10 -15, 10 -15, 20 10"
                      fill="none" stroke={COLORS.cool_silver} strokeWidth="2" />
                    <polygon points="18,5 25,12 18,14"
                      fill={COLORS.cool_silver} />
                  </g>
                )}
              </g>

              {/* Red X cross overlay */}
              <g transform={`translate(540, ${p.y + 120}) scale(${crossScale})`}
                opacity={crossPulse}>
                <line x1={-420} y1={-110} x2={420} y2={110}
                  stroke={COLORS.vibrant_red} strokeWidth="10"
                  strokeLinecap="round" opacity={0.6} filter="url(#softGlow)" />
                <line x1={420} y1={-110} x2={-420} y2={110}
                  stroke={COLORS.vibrant_red} strokeWidth="10"
                  strokeLinecap="round" opacity={0.6} filter="url(#softGlow)" />
              </g>

              {/* Horizontal divider line below each panel */}
              <line
                x1={150} y1={p.y + 200}
                x2={150 + 780 * panelOpacity} y2={p.y + 200}
                stroke={COLORS.vibrant_red} strokeWidth="1" opacity={0.2}
                strokeDasharray="6,3"
              />
            </g>
          );
        })}

        {/* ── Broken arrow fragments ───────────────────────────────── */}
        <g opacity={brokenArrowProg * 0.5}>
          {brokenArrows.map((a) => {
            const prog = interpolate(frame, [a.delay, a.delay + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const rad = (a.angle * Math.PI) / 180;
            return (
              <g key={a.id} opacity={prog}>
                <line
                  x1={a.x} y1={a.y}
                  x2={a.x + Math.cos(rad) * a.length}
                  y2={a.y + Math.sin(rad) * a.length}
                  stroke={COLORS.vibrant_red} strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx={a.x + Math.cos(rad) * a.length}
                  cy={a.y + Math.sin(rad) * a.length}
                  r={3} fill={COLORS.vibrant_red} opacity={0.6}
                />
              </g>
            );
          })}
        </g>

        {/* ── Decay particles ──────────────────────────────────────── */}
        <g opacity={fadeIn * 0.4}>
          {decayParticles.map((d) => {
            const floatY = Math.sin(frame * 0.04 + d.phase) * 6;
            return (
              <circle
                key={d.id}
                cx={d.cx} cy={d.cy + floatY}
                r={d.r}
                fill={d.id % 3 === 0 ? COLORS.vibrant_red : COLORS.cool_silver}
                opacity={0.3 + Math.sin(frame * 0.05 + d.phase) * 0.15}
              />
            );
          })}
        </g>

        {/* ── Static noise overlay ─────────────────────────────────── */}
        <g opacity={staticFlicker}>
          {noiseParticles.map((n) => (
            <rect
              key={n.id}
              x={(n.x + frame * n.speed) % 1080}
              y={(n.y + frame * (n.speed * 0.7)) % 1920}
              width={n.size} height={n.size}
              fill={COLORS.soft_white}
            />
          ))}
        </g>

        {/* ── Bottom summary text ──────────────────────────────────── */}
        <g opacity={bottomTextOpacity}>
          <rect x={60} y={1540} width={960} height={180} rx="24"
            fill={COLORS.deep_black} fillOpacity="0.85"
            stroke={COLORS.vibrant_red} strokeWidth="3" />
          <text x={540} y={1610} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="54" fontWeight="bold">
            No way to know, no way to adapt,
          </text>
          <text x={540} y={1690} textAnchor="middle"
            fill={COLORS.vibrant_red} fontSize="62" fontWeight="900">
            no way to change course.
          </text>
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none"
            stroke={COLORS.vibrant_red} strokeWidth="2" />
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.04}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.vibrant_red} strokeWidth="1" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
