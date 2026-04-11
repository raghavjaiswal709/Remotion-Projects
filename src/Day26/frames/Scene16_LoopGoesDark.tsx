/**
 * Scene16_LoopGoesDark.tsx — Day 26: Observations
 *
 * "Take away observations and the loop goes dark."
 *
 * Full loop diagram that was glowing cyan — the OBSERVE node gets
 * removed/fades. Then entire loop dims/goes dark. Lights-out effect
 * cascading through the loop. Red flicker. "DARK" text appearing
 * in faded red. Dying ember particles. Power-down animation.
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

/* ── Layout ───────────────────────────────────────────────────────────── */
const CX = 540;
const CY = 880;
const R = 280;

const loopSteps = [
  { label: 'PERCEIVE', color: COLORS.vibrant_green, angle: -Math.PI / 2, darkDelay: 42 },
  { label: 'THINK', color: COLORS.warm_blue, angle: 0, darkDelay: 46 },
  { label: 'ACT', color: COLORS.amber, angle: Math.PI / 2, darkDelay: 50 },
  { label: 'OBSERVE', color: COLORS.purple, angle: Math.PI, darkDelay: 30 },
];

/* ── Ember particles ──────────────────────────────────────────────────── */
const embers = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: CX + Math.cos((i / 35) * Math.PI * 2) * R + ((i * 37) % 80 - 40),
  y: CY + Math.sin((i / 35) * Math.PI * 2) * R + ((i * 51) % 80 - 40),
  size: 1.5 + (i % 4) * 1,
  fallSpeed: 0.3 + (i % 5) * 0.15,
  flickerPhase: (i * 1.7) % (Math.PI * 2),
  driftX: (i % 2 === 0 ? 1 : -1) * (0.2 + (i % 3) * 0.1),
}));

/* ── Background particles ─────────────────────────────────────────────── */
const bgParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 143) % 1080,
  y: (i * 191) % 1920,
  r: 0.7 + (i % 4) * 0.4,
  phase: (i * 2.3) % (Math.PI * 2),
}));

/* ── Circuit traces ───────────────────────────────────────────────────── */
const circuits = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 40 + (i * 101) % 1000,
  y: 60 + (i * 167) % 1800,
  len: 18 + (i % 4) * 12,
  horiz: i % 2 === 0,
}));

/* ── Power-down cascade lines ─────────────────────────────────────────── */
const cascadeLines = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i / 12) * Math.PI * 2,
  innerR: R - 50,
  outerR: R + 30,
}));

export const Scene16_LoopGoesDark: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const loopGlow = interpolate(frame, [5, 20], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  /* OBSERVE node fades out */
  const observeFade = interpolate(frame, [25, 38], [1, 0], {
    easing: ease, extrapolateRight: 'clamp',
  });

  /* Entire loop dims after observe is gone */
  const loopDim = interpolate(frame, [38, 55], [1, 0.08], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const redFlicker = interpolate(
    frame % 10, [0, 3, 6, 10], [0, 0.4, 0.1, 0],
    { extrapolateRight: 'clamp' }
  );

  const darkTextScale = interpolate(frame, [50, 65], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const darkTextPulse = interpolate(
    frame % 30, [0, 15, 30], [0.7, 1, 0.7],
    { extrapolateRight: 'clamp' }
  );

  const emberOpacity = interpolate(frame, [35, 50], [0, 0.8], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const circuitFade = interpolate(frame, [38, 55], [0.15, 0.02], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [55, 68], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  /* power-down cascade */
  const cascadeProg = interpolate(frame, [35, 55], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const circumference = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dimFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feColorMatrix type="saturate" values="0" in="blur" />
          </filter>
          <radialGradient id="darkVignette" cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor={COLORS.bg_black} stopOpacity="0" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0.8" />
          </radialGradient>
          <linearGradient id="darkRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.vibrant_red} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#661111" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Background particles ─────────────────────────────────── */}
        <g opacity={fadeIn * loopDim * 0.4}>
          {bgParticles.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.r}
              fill={COLORS.cool_silver}
              opacity={0.2 + Math.sin(frame * 0.04 + p.phase) * 0.15} />
          ))}
        </g>

        {/* ── Circuit traces (dimming) ─────────────────────────────── */}
        <g opacity={circuitFade}>
          {circuits.map((c) => (
            <line key={c.id}
              x1={c.x} y1={c.y}
              x2={c.horiz ? c.x + c.len : c.x}
              y2={c.horiz ? c.y : c.y + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── Title ────────────────────────────────────────────────── */}
        <g opacity={titleOpacity * loopDim}>
          <text x={540} y={300} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="44" fontFamily="monospace"
            fontWeight="bold" letterSpacing="2" filter="url(#cyanGlow)">
            THE LOOP
          </text>
          <line x1={300} y1={330} x2={780} y2={330}
            stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.35} />
        </g>

        {/* ── Main loop ring ───────────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={COLORS.electric_cyan}
          strokeWidth="3" opacity={loopGlow * loopDim * 0.5}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - loopGlow)}
        />
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={COLORS.electric_cyan}
          strokeWidth="2" strokeDasharray="15 25"
          strokeDashoffset={-frame * 2 * loopDim}
          opacity={loopGlow * loopDim * 0.3}
        />

        {/* ── Loop nodes ───────────────────────────────────────────── */}
        {loopSteps.map((s, i) => {
          const pt = {
            x: CX + Math.cos(s.angle) * R,
            y: CY + Math.sin(s.angle) * R,
          };
          const isObserve = s.label === 'OBSERVE';
          const nodeOpacity = isObserve ? observeFade : loopDim;

          /* Node-specific dimming with cascade delay */
          const nodeDim = isObserve ? observeFade :
            interpolate(frame, [s.darkDelay, s.darkDelay + 10], [1, 0.08], {
              easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

          const nScale = scaleAnim(frame, 8 + i * 4, 12, 0, 1);

          return (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(${nScale})`}
              opacity={nodeOpacity}>
              {/* Outer ring */}
              <circle cx={0} cy={0} r={85}
                fill="none" stroke={s.color} strokeWidth="3"
                opacity={nodeDim * 0.4} />
              {/* Node circle */}
              <circle cx={0} cy={0} r={75}
                fill={COLORS.bg_black} stroke={s.color} strokeWidth="4"
                opacity={nodeDim} />
              <circle cx={0} cy={0} r={60} fill={s.color}
                opacity={nodeDim * 0.15} />
              {/* Label */}
              <text x={0} y={15} textAnchor="middle"
                fill={s.color} fontSize="62" fontFamily="monospace"
                fontWeight="bold" opacity={nodeDim}>
                {s.label[0]}
              </text>
              <text x={0} y={115} textAnchor="middle"
                fill={s.color} fontSize="52" fontFamily="monospace"
                fontWeight="bold" opacity={nodeDim * 0.8}>
                {s.label}
              </text>

              {/* Red X on OBSERVE as it fades */}
              {isObserve && observeFade < 0.7 && (
                <g opacity={1 - observeFade}>
                  <line x1={-30} y1={-30} x2={30} y2={30}
                    stroke={COLORS.vibrant_red} strokeWidth="8" strokeLinecap="round" />
                  <line x1={30} y1={-30} x2={-30} y2={30}
                    stroke={COLORS.vibrant_red} strokeWidth="8" strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── Power-down cascade lines ─────────────────────────────── */}
        <g opacity={cascadeProg * (1 - loopDim) * 0.5}>
          {cascadeLines.map((l) => {
            const prog = interpolate(
              frame, [38 + l.id * 1.5, 48 + l.id * 1.5], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <line key={l.id}
                x1={CX + Math.cos(l.angle) * l.innerR}
                y1={CY + Math.sin(l.angle) * l.innerR}
                x2={CX + Math.cos(l.angle) * (l.innerR + (l.outerR - l.innerR) * prog)}
                y2={CY + Math.sin(l.angle) * (l.innerR + (l.outerR - l.innerR) * prog)}
                stroke={COLORS.vibrant_red} strokeWidth="2" opacity={0.4}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ── Red flicker overlay ──────────────────────────────────── */}
        {frame > 35 && (
          <rect width="1080" height="1920"
            fill={COLORS.vibrant_red} opacity={redFlicker * 0.05} />
        )}

        {/* ── Dark vignette increasing ─────────────────────────────── */}
        <rect width="1080" height="1920"
          fill="url(#darkVignette)" opacity={1 - loopDim} />

        {/* ── Dying ember particles ────────────────────────────────── */}
        <g opacity={emberOpacity}>
          {embers.map((e) => {
            const elapsed = Math.max(0, frame - 35);
            const ex = e.x + elapsed * e.driftX;
            const ey = e.y + elapsed * e.fallSpeed;
            const flicker = 0.3 + Math.sin(frame * 0.1 + e.flickerPhase) * 0.3;
            const fadeAway = interpolate(elapsed, [0, 40], [1, 0], {
              extrapolateRight: 'clamp',
            });
            return (
              <circle key={e.id} cx={ex} cy={ey} r={e.size * fadeAway}
                fill={e.id % 3 === 0 ? COLORS.vibrant_red : COLORS.amber}
                opacity={flicker * fadeAway} />
            );
          })}
        </g>

        {/* ── "DARK" text appearing ────────────────────────────────── */}
        <g transform={`translate(${CX}, ${CY}) scale(${darkTextScale * darkTextPulse})`}
          opacity={darkTextScale}>
          <text x={0} y={15} textAnchor="middle"
            fill="url(#darkRedGrad)" fontSize="200" fontFamily="monospace"
            fontWeight="900" letterSpacing="15" filter="url(#softGlow)">
            DARK
          </text>
        </g>

        {/* ── Broken connection lines ──────────────────────────────── */}
        {frame > 30 && (
          <g opacity={(1 - observeFade) * 0.4}>
            {/* Broken lines from where observe was */}
            {[0, 1, 2].map((i) => {
              const angle = Math.PI + (i - 1) * 0.3;
              const pt = {
                x: CX + Math.cos(angle) * R,
                y: CY + Math.sin(angle) * R,
              };
              return (
                <g key={`broken-${i}`}>
                  <line x1={pt.x} y1={pt.y}
                    x2={pt.x + Math.cos(angle) * 25}
                    y2={pt.y + Math.sin(angle) * 25}
                    stroke={COLORS.vibrant_red} strokeWidth="2"
                    strokeDasharray="4,3" opacity={0.5} />
                </g>
              );
            })}
          </g>
        )}

        {/* ── Bottom subtitle ──────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={60} y={1540} width={960} height={180} rx="24"
            fill={COLORS.deep_black} fillOpacity="0.85"
            stroke={COLORS.vibrant_red} strokeWidth="3" />
          <text x={540} y={1610} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="58" fontWeight="bold">
            Remove observations
          </text>
          <text x={540} y={1690} textAnchor="middle"
            fill={COLORS.vibrant_red} fontSize="62" fontWeight="900">
            and the loop goes dark.
          </text>
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.2}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none" stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none" stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none" stroke={COLORS.vibrant_red} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none" stroke={COLORS.vibrant_red} strokeWidth="2" />
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.03}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.vibrant_red} strokeWidth="1" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
