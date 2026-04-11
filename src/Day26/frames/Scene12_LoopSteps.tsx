/**
 * Scene12_LoopSteps.tsx — Day 26: Observations
 *
 * "The loop is perceive, think, act, observe."
 *
 * Four-step circular loop diagram. Each step lights up in sequence:
 * PERCEIVE (green), THINK (blue), ACT (amber), OBSERVE (purple).
 * Connecting arrows pulse with data flow. Center label "THE LOOP".
 * Orbital ring animation. Step-by-step highlight cascade.
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

/* ── Loop steps config ────────────────────────────────────────────────── */
const LOOP_CX = 540;
const LOOP_CY = 920;
const LOOP_RADIUS = 280;

const steps = [
  { label: 'PERCEIVE', color: COLORS.vibrant_green, angle: -Math.PI / 2, icon: 'eye', delay: 10 },
  { label: 'THINK', color: COLORS.warm_blue, angle: 0, icon: 'brain', delay: 25 },
  { label: 'ACT', color: COLORS.amber, angle: Math.PI / 2, icon: 'bolt', delay: 40 },
  { label: 'OBSERVE', color: COLORS.purple, angle: Math.PI, icon: 'lens', delay: 55 },
];

/* ── Orbital particles ────────────────────────────────────────────────── */
const orbitalParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  angleOffset: (i / 30) * Math.PI * 2,
  radius: LOOP_RADIUS + 40 + (i % 4) * 15,
  size: 1.5 + (i % 3) * 1,
  speed: 0.015 + (i % 5) * 0.004,
}));

/* ── Background stars ─────────────────────────────────────────────────── */
const bgStars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 149) % 1080,
  y: (i * 197) % 1920,
  r: 0.8 + (i % 4) * 0.5,
  phase: (i * 2.1) % (Math.PI * 2),
}));

/* ── Data flow dots on arcs ───────────────────────────────────────────── */
const flowDots = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  segment: i % 4,
  t: (Math.floor(i / 4) / 6),
  size: 2 + (i % 3) * 1,
}));

/* ── Circuit accents ──────────────────────────────────────────────────── */
const circuits = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 50 + (i * 107) % 980,
  y: 100 + (i * 173) % 1720,
  len: 20 + (i % 4) * 15,
  horiz: i % 2 === 0,
}));

export const Scene12_LoopSteps: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const ringDraw = interpolate(frame, [5, 35], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const centerScale = interpolate(frame, [15, 30], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const orbitAngle = frame * 0.02;

  const pulseGlow = interpolate(
    frame % 40, [0, 20, 40], [0.5, 1, 0.5],
    { extrapolateRight: 'clamp' }
  );

  const arrowFlow = (frame % 60) / 60;

  const subtitleOpacity = interpolate(frame, [65, 78], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, 18], [-50, 0], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  /* Active step highlight cycles */
  const activeStep = Math.floor((frame % 80) / 20);

  /* helper: point on circle */
  const ptOnCircle = (angle: number, r: number) => ({
    x: LOOP_CX + Math.cos(angle) * r,
    y: LOOP_CY + Math.sin(angle) * r,
  });

  /* ── Arc path between two angles ───────────────────────────────────── */
  const arcPath = (a1: number, a2: number, r: number) => {
    const p1 = ptOnCircle(a1, r);
    const mid = ptOnCircle((a1 + a2) / 2, r);
    const p2 = ptOnCircle(a2, r);
    return `M ${p1.x} ${p1.y} Q ${mid.x + (mid.x - LOOP_CX) * 0.3} ${mid.y + (mid.y - LOOP_CY) * 0.3} ${p2.x} ${p2.y}`;
  };

  const circumference = 2 * Math.PI * LOOP_RADIUS;

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
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {steps.map((s, i) => (
            <filter key={`glow-${i}`} id={`stepGlow${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={s.color} floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.15" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Background stars ─────────────────────────────────────── */}
        <g opacity={fadeIn * 0.6}>
          {bgStars.map((s) => {
            const twinkle = 0.3 + Math.sin(frame * 0.04 + s.phase) * 0.3;
            return (
              <circle key={s.id} cx={s.x} cy={s.y} r={s.r}
                fill={COLORS.soft_white} opacity={twinkle} />
            );
          })}
        </g>

        {/* ── Circuit accents ──────────────────────────────────────── */}
        <g opacity={fadeIn * 0.15}>
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
        <g opacity={titleOpacity} transform={`translate(0, ${titleY})`}>
          <text x={540} y={280} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="48" fontFamily="monospace"
            fontWeight="bold" letterSpacing="3" filter="url(#cyanGlow)">
            THE LOOP
          </text>
          <line x1={300} y1={310} x2={780} y2={310}
            stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.4} />
        </g>

        {/* ── Center radial ────────────────────────────────────────── */}
        <circle cx={LOOP_CX} cy={LOOP_CY} r={LOOP_RADIUS + 80}
          fill="url(#centerGrad)" opacity={fadeIn * 0.5} />

        {/* ── Main circular ring ───────────────────────────────────── */}
        <circle
          cx={LOOP_CX} cy={LOOP_CY} r={LOOP_RADIUS}
          fill="none" stroke={COLORS.cool_silver} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ringDraw)}
          opacity={0.35}
        />

        {/* ── Animated ring overlay ────────────────────────────────── */}
        <circle
          cx={LOOP_CX} cy={LOOP_CY} r={LOOP_RADIUS}
          fill="none" stroke={COLORS.electric_cyan} strokeWidth="2"
          strokeDasharray="20 30"
          strokeDashoffset={-frame * 2}
          opacity={ringDraw * 0.4}
        />

        {/* ── Connecting arcs with arrows ──────────────────────────── */}
        {steps.map((s, i) => {
          const next = steps[(i + 1) % 4];
          const a1 = s.angle + 0.3;
          const a2 = next.angle - 0.3 + (i === 3 ? Math.PI * 2 : 0);
          const arcProg = interpolate(frame, [s.delay + 5, s.delay + 20], [0, 1], {
            easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const arrowPt = ptOnCircle(a2, LOOP_RADIUS);
          return (
            <g key={`arc-${i}`} opacity={arcProg * 0.6}>
              <path
                d={arcPath(a1, a2, LOOP_RADIUS)}
                fill="none" stroke={s.color} strokeWidth="2.5"
                strokeDasharray="8,5" strokeLinecap="round"
              />
              {/* Arrow tip */}
              <circle cx={arrowPt.x} cy={arrowPt.y} r={5}
                fill={next.color} opacity={0.8} />
            </g>
          );
        })}

        {/* ── Flow dots on arcs ────────────────────────────────────── */}
        <g opacity={ringDraw * 0.7}>
          {flowDots.map((d) => {
            const seg = steps[d.segment];
            const nextSeg = steps[(d.segment + 1) % 4];
            const t = (d.t + arrowFlow) % 1;
            const angle = seg.angle + t * (
              (nextSeg.angle - seg.angle + Math.PI * 2) % (Math.PI * 2)
            );
            const pt = ptOnCircle(angle, LOOP_RADIUS);
            return (
              <circle key={d.id} cx={pt.x} cy={pt.y} r={d.size}
                fill={seg.color} opacity={0.6} />
            );
          })}
        </g>

        {/* ── Four step nodes ──────────────────────────────────────── */}
        {steps.map((s, i) => {
          const nodeScale = scaleAnim(frame, s.delay, 15, 0, 1);
          const isActive = activeStep === i && frame > 50;
          const pt = ptOnCircle(s.angle, LOOP_RADIUS);
          const glowScale = isActive ? pulseGlow : 0.7;

          return (
            <g key={i} transform={`translate(${pt.x}, ${pt.y}) scale(${nodeScale})`}>
              {/* Outer glow ring */}
              <circle cx={0} cy={0} r={85}
                fill="none" stroke={s.color} strokeWidth={isActive ? 5 : 3}
                opacity={glowScale * 0.4}
                filter={isActive ? `url(#stepGlow${i})` : undefined}
              />
              {/* Node circle */}
              <circle cx={0} cy={0} r={65}
                fill={COLORS.bg_black} stroke={s.color} strokeWidth="4" />
              {/* Inner fill pulse */}
              <circle cx={0} cy={0} r={55}
                fill={s.color} opacity={isActive ? 0.25 : 0.1} />

              {/* Icon */}
              {s.icon === 'eye' && (
                <g transform="scale(1.4)">
                  <ellipse cx={0} cy={0} rx={18} ry={12}
                    fill="none" stroke={s.color} strokeWidth="2.5" />
                  <circle cx={0} cy={0} r={6} fill={s.color} />
                </g>
              )}
              {s.icon === 'brain' && (
                <g transform="scale(1.4)">
                  <path d="M -10 -12 C -18 -12, -18 0, -10 0 C -18 0, -18 12, -10 12"
                    fill="none" stroke={s.color} strokeWidth="2.5" />
                  <path d="M 10 -12 C 18 -12, 18 0, 10 0 C 18 0, 18 12, 10 12"
                    fill="none" stroke={s.color} strokeWidth="2.5" />
                  <line x1={0} y1={-14} x2={0} y2={14}
                    stroke={s.color} strokeWidth="2" />
                </g>
              )}
              {s.icon === 'bolt' && (
                <polygon points="-4,-16 8,-2 1,-2 4,16 -8,2 -1,2"
                  fill={s.color} transform="scale(1.4)" />
              )}
              {s.icon === 'lens' && (
                <g transform="scale(1.4)">
                  <circle cx={0} cy={0} r={14} fill="none"
                    stroke={s.color} strokeWidth="2.5" />
                  <circle cx={0} cy={0} r={6} fill="none"
                    stroke={s.color} strokeWidth="1.5" />
                  <circle cx={0} cy={0} r={2} fill={s.color} />
                </g>
              )}

              {/* Label */}
              <text x={0} y={110} textAnchor="middle"
                fill={s.color} fontSize="52" fontFamily="monospace"
                fontWeight="bold" letterSpacing="3">
                {s.label}
              </text>
            </g>
          );
        })}

        {/* ── Center "THE LOOP" ────────────────────────────────────── */}
        <g transform={`translate(${LOOP_CX}, ${LOOP_CY}) scale(${centerScale})`}>
          <circle cx={0} cy={0} r={100} fill={COLORS.bg_black}
            stroke={COLORS.electric_cyan} strokeWidth="3" opacity={0.7} />
          <text x={0} y={-12} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="52" fontFamily="monospace"
            fontWeight="bold" letterSpacing="3">
            THE
          </text>
          <text x={0} y={40} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="62" fontFamily="monospace"
            fontWeight="bold" letterSpacing="4">
            LOOP
          </text>
        </g>

        {/* ── Orbital particles ────────────────────────────────────── */}
        <g opacity={ringDraw * 0.5}>
          {orbitalParticles.map((p) => {
            const a = p.angleOffset + orbitAngle * (1 + p.speed * 10);
            const px = LOOP_CX + Math.cos(a) * p.radius;
            const py = LOOP_CY + Math.sin(a) * p.radius;
            return (
              <circle key={p.id} cx={px} cy={py} r={p.size}
                fill={COLORS.electric_cyan} opacity={0.4} />
            );
          })}
        </g>

        {/* ── Bottom subtitle ──────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={80} y={1560} width={920} height={110} rx="16"
            fill={COLORS.deep_black} fillOpacity="0.8"
            stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <text x={540} y={1628} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="56" fontFamily="monospace">
            Perceive → Think → Act → Observe
          </text>
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.03}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.electric_cyan} strokeWidth="1" />
          ))}
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
