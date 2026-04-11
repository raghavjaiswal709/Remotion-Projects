/**
 * Scene22_ObserveHighlight.tsx — Day 26: Observations
 *
 * Same loop diagram but the OBSERVE step is dramatically highlighted —
 * enlarged, glowing brighter, pulsing. Other steps are dimmed.
 * Zoom effect onto OBSERVE. "THE KEY STEP" label with spotlight beam.
 * Radial lines emanating from the observe node. Star burst effect.
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

/* ── Loop steps (OBSERVE at index 3 gets special treatment) ──────── */
const steps = [
  { label: 'PERCEIVE', color: COLORS.vibrant_green, icon: '👁', angle: -90 },
  { label: 'THINK', color: COLORS.warm_blue, icon: '🧠', angle: 0 },
  { label: 'ACT', color: COLORS.amber, icon: '⚡', angle: 90 },
  { label: 'OBSERVE', color: COLORS.purple, icon: '📡', angle: 180 },
];

/* ── Radial burst lines from OBSERVE ─────────────────────────────────── */
const burstLines = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i * 15) * (Math.PI / 180),
  len: 60 + (i % 4) * 30,
  delay: 12 + i * 1,
}));

/* ── Star burst points ───────────────────────────────────────────────── */
const starBurst = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  angle: (i * 22.5) * (Math.PI / 180),
  inner: 70,
  outer: i % 2 === 0 ? 130 : 90,
}));

/* ── Particles ───────────────────────────────────────────────────────── */
const particles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 159.7) % 1080),
  y: ((i * 199.3) % 1920),
  r: 0.6 + (i % 4) * 0.4,
  phase: (i * 0.9) % (Math.PI * 2),
  speed: 0.025 + (i % 5) * 0.007,
}));

/* ── Spotlight rays ──────────────────────────────────────────────────── */
const spotlightRays = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i * 45 - 20 + ((i * 17.3) % 40)) * (Math.PI / 180),
  width: 15 + i * 3,
}));

/* ── Circuit accents ─────────────────────────────────────────────────── */
const circuits = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x1: (i * 83) % 1080,
  y1: (i * 143) % 1920,
  len: 40 + (i % 4) * 30,
  horiz: i % 2 === 0,
}));

/* ── Pulse rings from OBSERVE ────────────────────────────────────────── */
const pulseRings = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  delay: 15 + i * 6,
}));

/* ── Glow orbs floating near OBSERVE ─────────────────────────────────── */
const glowOrbs = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  angle: (i * 36) * (Math.PI / 180),
  dist: 100 + (i % 3) * 30,
  size: 3 + (i % 4) * 1.5,
  phase: (i * 1.3) % (Math.PI * 2),
}));

const LOOP_R = 320;
const CX = 540;
const CY = 960;
const OBS_ANGLE = 180;
const OBS_X = CX + Math.cos((OBS_ANGLE * Math.PI) / 180) * LOOP_R;
const OBS_Y = CY + Math.sin((OBS_ANGLE * Math.PI) / 180) * LOOP_R;

export const Scene22_ObserveHighlight: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const observeScale = interpolate(frame, [5, 22], [0.6, 1.35], { extrapolateRight: 'clamp', easing: ease });
  const observeGlow = interpolate(frame, [0, 15, 30, 45], [6, 16, 6, 16], { extrapolateRight: 'extend' });
  const observePulse = interpolate(frame, [0, 20, 40, 60], [1, 1.1, 1, 1.1], { extrapolateRight: 'extend' });
  const dimOthers = interpolate(frame, [8, 22], [0.7, 0.2], { extrapolateRight: 'clamp', easing: ease });
  const burstGrow = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelReveal = interpolate(frame, [18, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const spotlightOpacity = interpolate(frame, [12, 26], [0, 0.15], { extrapolateRight: 'clamp', easing: ease });
  const starRotation = interpolate(frame, [0, 120], [0, 360], { extrapolateRight: 'extend' });
  const titleOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="observeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={observeGlow} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="spotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.3" />
            <stop offset="100%" stopColor={COLORS.purple} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgGrad" cx="24%" cy="48%" r="50%">
            <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.08" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGrad)" />

        {/* Circuit accents */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.id * 2, c.id * 2 + 10], [0, 0.08], { extrapolateRight: 'clamp' });
          return (
            <line key={`ci-${c.id}`}
              x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o * masterIn} />
          );
        })}

        {/* Particles */}
        {particles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 15;
          const px = p.x + Math.cos(frame * p.speed * 0.6 + p.phase) * 10;
          const o = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.06;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 4 === 0 ? COLORS.purple : COLORS.cool_silver}
              opacity={o * masterIn} />
          );
        })}

        {/* Orbital ring (dimmed) */}
        <circle cx={CX} cy={CY} r={LOOP_R} fill="none"
          stroke={COLORS.cool_silver} strokeWidth="2" opacity={0.1 * masterIn} />

        {/* Connecting arrows (dimmed) */}
        {steps.map((step, i) => {
          const next = steps[(i + 1) % steps.length];
          const a1 = (step.angle * Math.PI) / 180;
          const a2 = (next.angle * Math.PI) / 180;
          const x1 = CX + Math.cos(a1) * LOOP_R;
          const y1 = CY + Math.sin(a1) * LOOP_R;
          const x2 = CX + Math.cos(a2) * LOOP_R;
          const y2 = CY + Math.sin(a2) * LOOP_R;
          return (
            <line key={`conn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={COLORS.cool_silver} strokeWidth="2" opacity={dimOthers * 0.3 * masterIn} />
          );
        })}

                {/* Dimmed steps (not OBSERVE) */}
        {steps.slice(0, 3).map((step, i) => {
          const a = (step.angle * Math.PI) / 180;
          const nx = CX + Math.cos(a) * LOOP_R;
          const ny = CY + Math.sin(a) * LOOP_R;
          const nScale = scaleAnim(frame, 5 + i * 3, 10, 0, 1);
          return (
            <g key={`dim-${i}`} transform={`translate(${nx}, ${ny}) scale(${nScale})`} opacity={dimOthers * masterIn}>
              <circle cx="0" cy="0" r="70" fill={COLORS.deep_black}
                stroke={step.color} strokeWidth="3" opacity="0.4" />
              <text x="0" y="10" textAnchor="middle" fontSize="66">{step.icon}</text>
              <text x="0" y="115" textAnchor="middle" fontSize="56" fill={step.color}
                fontFamily="monospace" opacity="0.6" fontWeight="bold">{step.label}</text>
            </g>
          );
        })}

        {/* ... existing spotlight and burst ... */}

        {/* OBSERVE node — highlighted */}
        <g transform={`translate(${OBS_X}, ${OBS_Y}) scale(${observeScale * observePulse * masterIn})`}>
          {/* Big glow */}
          <circle cx="0" cy="0" r="110" fill={COLORS.purple} opacity="0.15" filter="url(#bigGlow)" />
          {/* Outer ring */}
          <circle cx="0" cy="0" r="105" fill="none"
            stroke={COLORS.purple} strokeWidth="4" opacity="0.6" />
          {/* Filled node */}
          <circle cx="0" cy="0" r="90" fill={COLORS.deep_black}
            stroke={COLORS.purple} strokeWidth="5" filter="url(#observeGlow)" />
          {/* Icon */}
          <text x="0" y="15" textAnchor="middle" fontSize="95">📡</text>
          {/* Label */}
          <text x="0" y="150" textAnchor="middle" fontSize="72" fontWeight="bold"
            fill={COLORS.purple} fontFamily="monospace" filter="url(#observeGlow)">
            OBSERVE
          </text>
        </g>

        {/* Center core (dimmed) */}
        <g transform={`translate(${CX}, ${CY}) scale(1.3)`} opacity={dimOthers * 0.4 * masterIn}>
          <circle cx="0" cy="0" r="60" fill={COLORS.deep_black}
            stroke={COLORS.electric_cyan} strokeWidth="3" />
          <text x="0" y="10" textAnchor="middle" fontSize="42" fontWeight="bold"
            fill={COLORS.electric_cyan} fontFamily="monospace">AGENT</text>
        </g>

        {/* "THE KEY STEP" label */}
        <g transform={`translate(${CX}, 420)`} opacity={labelReveal * masterIn}>
          <rect x="-240" y="-55" width="480" height="110" rx="20"
            fill={COLORS.deep_black} stroke={COLORS.purple} strokeWidth="4" />
          <text x="0" y="20" textAnchor="middle" fontSize="64" fontWeight="bold"
            fill={COLORS.purple} fontFamily="monospace" filter="url(#observeGlow)">
            THE KEY STEP
          </text>
        </g>

        {/* Title */}
        <g transform={`translate(${CX}, 280)`} opacity={titleOpacity * (1 - labelReveal)}>
          <text x="0" y="0" textAnchor="middle" fontSize="72" fontWeight="900"
            fill={COLORS.soft_white} fontFamily="monospace" letterSpacing="2">
            CRITICAL FEEDBACK
          </text>
        </g>

        {/* Spotlight cone on OBSERVE */}
        <g opacity={spotlightOpacity * masterIn}>
          {spotlightRays.map((sr) => {
            const endX = OBS_X + Math.cos(sr.angle) * 600;
            const endY = OBS_Y + Math.sin(sr.angle) * 600;
            return (
              <line key={`sr-${sr.id}`} x1={OBS_X} y1={OBS_Y} x2={endX} y2={endY}
                stroke={COLORS.purple} strokeWidth={sr.width} opacity="0.08" />
            );
          })}
          <circle cx={OBS_X} cy={OBS_Y} r="200" fill="url(#spotGrad)" />
        </g>

        {/* Radial burst lines */}
        {burstLines.map((bl) => {
          const blO = interpolate(frame, [bl.delay, bl.delay + 10], [0, 0.5], { extrapolateRight: 'clamp' });
          const blLen = bl.len * burstGrow;
          return (
            <line key={`bl-${bl.id}`}
              x1={OBS_X + Math.cos(bl.angle) * 65}
              y1={OBS_Y + Math.sin(bl.angle) * 65}
              x2={OBS_X + Math.cos(bl.angle) * (65 + blLen)}
              y2={OBS_Y + Math.sin(bl.angle) * (65 + blLen)}
              stroke={COLORS.purple} strokeWidth="2" opacity={blO * masterIn}
              filter="url(#softGlow)" />
          );
        })}

        {/* Star burst */}
        <g transform={`translate(${OBS_X}, ${OBS_Y}) rotate(${starRotation})`} opacity={burstGrow * 0.6 * masterIn}>
          <polygon
            points={starBurst.map((sb) => {
              const r = sb.id % 2 === 0 ? sb.outer : sb.inner;
              return `${Math.cos(sb.angle) * r},${Math.sin(sb.angle) * r}`;
            }).join(' ')}
            fill="none" stroke={COLORS.purple} strokeWidth="1.5" opacity="0.4"
            filter="url(#observeGlow)" />
        </g>

        {/* Pulse rings from OBSERVE */}
        {pulseRings.map((pr) => {
          const pT = interpolate(frame, [pr.delay, pr.delay + 30], [0, 1], { extrapolateRight: 'extend' });
          const cycle = pT % 1;
          const pR = 60 + cycle * 200;
          const pO = (1 - cycle) * 0.4;
          return (
            <circle key={`pr-${pr.id}`} cx={OBS_X} cy={OBS_Y} r={pR}
              fill="none" stroke={COLORS.purple} strokeWidth="2"
              opacity={pO * masterIn} filter="url(#softGlow)" />
          );
        })}

        {/* Glow orbs near OBSERVE */}
        {glowOrbs.map((go) => {
          const ga = go.angle + frame * 0.02;
          const gx = OBS_X + Math.cos(ga) * go.dist;
          const gy = OBS_Y + Math.sin(ga) * go.dist;
          const gO = 0.3 + Math.sin(frame * 0.06 + go.phase) * 0.2;
          return (
            <circle key={`go-${go.id}`} cx={gx} cy={gy} r={go.size}
              fill={COLORS.purple} opacity={gO * burstGrow * masterIn} filter="url(#observeGlow)" />
          );
        })}

        {/* OBSERVE node — highlighted */}
        <g transform={`translate(${OBS_X}, ${OBS_Y}) scale(${observeScale * observePulse * masterIn})`}>
          {/* Big glow */}
          <circle cx="0" cy="0" r="60" fill={COLORS.purple} opacity="0.1" filter="url(#bigGlow)" />
          {/* Outer ring */}
          <circle cx="0" cy="0" r="58" fill="none"
            stroke={COLORS.purple} strokeWidth="3" opacity="0.6" />
          {/* Filled node */}
          <circle cx="0" cy="0" r="48" fill={COLORS.deep_black}
            stroke={COLORS.purple} strokeWidth="4" filter="url(#observeGlow)" />
          {/* Icon */}
          <text x="0" y="8" textAnchor="middle" fontSize="56">📡</text>
          {/* Label */}
          <text x="0" y="78" textAnchor="middle" fontSize="44" fontWeight="bold"
            fill={COLORS.purple} fontFamily="monospace" filter="url(#observeGlow)">
            OBSERVE
          </text>
        </g>

        {/* Center core (dimmed) */}
        <g transform={`translate(${CX}, ${CY})`} opacity={dimOthers * 0.5 * masterIn}>
          <circle cx="0" cy="0" r="35" fill={COLORS.deep_black}
            stroke={COLORS.electric_cyan} strokeWidth="2" />
          <text x="0" y="6" textAnchor="middle" fontSize="52"
            fill={COLORS.electric_cyan} fontFamily="monospace">AGENT</text>
        </g>

        {/* "THE KEY STEP" label */}
        <g transform={`translate(${CX}, 380)`} opacity={labelReveal * masterIn}>
          <rect x="-150" y="-32" width="300" height="64" rx="14"
            fill={COLORS.deep_black} stroke={COLORS.purple} strokeWidth="2.5" />
          <text x="0" y="10" textAnchor="middle" fontSize="52" fontWeight="bold"
            fill={COLORS.purple} fontFamily="monospace" filter="url(#observeGlow)">
            THE KEY STEP
          </text>
        </g>

        {/* Title */}
        <g transform={`translate(${CX}, 240)`} opacity={titleOpacity}>
          <text x="0" y="0" textAnchor="middle" fontSize="42" fontWeight="bold"
            fill={COLORS.soft_white} fontFamily="monospace">
            OBSERVE
          </text>
          <text x="0" y="36" textAnchor="middle" fontSize="38"
            fill={COLORS.cool_silver} fontFamily="monospace">
            the world's reply becomes new input
          </text>
        </g>

        {/* Subtitle at bottom */}
        <text x={CX} y="1520" textAnchor="middle" fontSize="38"
          fill={COLORS.cool_silver} fontFamily="monospace" opacity={labelReveal * masterIn}>
          Without observation, there is no loop
        </text>

        {/* Corner brackets */}
        {[[30, 30], [1050, 30], [30, 1890], [1050, 1890]].map(([bx, by], i) => {
          const bO = interpolate(frame, [2 + i * 2, 10 + i * 2], [0, 0.45], { extrapolateRight: 'clamp' });
          const sx = i % 2 === 0 ? 1 : -1;
          const sy = i < 2 ? 1 : -1;
          return (
            <g key={`cb-${i}`} transform={`translate(${bx}, ${by}) scale(${sx}, ${sy})`} opacity={bO}>
              <line x1="0" y1="0" x2="35" y2="0" stroke={COLORS.purple} strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="35" stroke={COLORS.purple} strokeWidth="2" />
            </g>
          );
        })}

        {/* Bottom bar */}
        <rect x="0" y="1790" width="1080" height="130" fill={COLORS.deep_black} opacity="0.7" />
        <text x="540" y="1860" textAnchor="middle" fontSize="44" fill={COLORS.cool_silver}
          fontFamily="monospace" opacity={titleOpacity}>
          Day 26 — Observe Highlighted
        </text>

        {/* Scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 80], [0, 1920], { extrapolateRight: 'extend' }) % 1920;
          return <line x1="0" y1={scanY} x2="1080" y2={scanY}
            stroke={COLORS.purple} strokeWidth="1" opacity="0.06" />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};
