/**
 * Scene21_FullLoopDiagram.tsx — Day 26: Observations
 *
 * Complete, detailed agent loop diagram with all 4 steps prominently labeled.
 * PERCEIVE (green, top), THINK (blue, right), ACT (amber, bottom),
 * OBSERVE (purple, left). Thick connecting arrows form a cycle.
 * Center: agent core with pulsing ring. Each step has an icon.
 * Rotating highlight cycles through steps sequentially.
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

/* ── Loop steps ──────────────────────────────────────────────────────── */
const steps = [
  { label: 'PERCEIVE', color: COLORS.vibrant_green, icon: '👁', angle: -90, desc: 'Sense' },
  { label: 'THINK', color: COLORS.warm_blue, icon: '🧠', angle: 0, desc: 'Plan' },
  { label: 'ACT', color: COLORS.amber, icon: '⚡', angle: 90, desc: 'Action' },
  { label: 'OBSERVE', color: COLORS.purple, icon: '📡', angle: 180, desc: 'Feedback' },
];

/* ── Background particles ────────────────────────────────────────────── */
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: ((i * 167.3) % 1080),
  y: ((i * 203.7) % 1920),
  r: 0.5 + (i % 4) * 0.4,
  phase: (i * 0.85) % (Math.PI * 2),
  speed: 0.025 + (i % 6) * 0.006,
}));

/* ── Orbital dots ────────────────────────────────────────────────────── */
const orbitalDots = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i * 15) * (Math.PI / 180),
  radius: 320,
  size: 2 + (i % 3),
}));

/* ── Circuit lines ───────────────────────────────────────────────────── */
const circuits = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x1: (i * 73) % 1080,
  y1: (i * 131) % 1920,
  len: 50 + (i % 5) * 25,
  horiz: i % 2 === 0,
  delay: i * 2,
}));

/* ── Radial lines from center ────────────────────────────────────────── */
const radialLines = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i * 30) * (Math.PI / 180),
  len: 80 + (i % 3) * 40,
}));

const LOOP_R = 340;
const CX = 540;
const CY = 960;

export const Scene21_FullLoopDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ringPulse = interpolate(frame, [0, 25, 50, 75], [1, 1.06, 1, 1.06], { extrapolateRight: 'extend' });
  const coreGlow = interpolate(frame, [0, 20, 40, 60], [5, 14, 5, 14], { extrapolateRight: 'extend' });
  
  const bgPulse = interpolate(frame, [0, 45, 90], [0.35, 0.5, 0.35], { extrapolateRight: 'extend' });
  
  const orbitRotation = frame * 0.4;
  const highlightIdx = Math.floor(frame / 30) % 4;

  const nodeReveal = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleY = interpolate(frame, [0, 15], [30, 0], { extrapolateRight: 'clamp', easing: ease });

  const cx = 540;
  const cy = 960;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={coreGlow} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgRadial" cx="50%" cy="48%" r="45%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity={bgPulse} />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
          {/* Arrow marker per step */}
          {steps.map((s, i) => (
            <marker key={`m-${i}`} id={`arrow-${i}`} markerWidth="12" markerHeight="8"
              refX="10" refY="4" orient="auto">
              <polygon points="0 0, 12 4, 0 8" fill={s.color} />
            </marker>
          ))}
        </defs>

        {/* Background glow */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgRadial)" />

        {/* Circuit lines */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.delay, c.delay + 12], [0, 0.1], { extrapolateRight: 'clamp' });
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
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 16;
          const px = p.x + Math.cos(frame * p.speed * 0.7 + p.phase) * 12;
          const o = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.07;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.cool_silver}
              opacity={o * masterIn} />
          );
        })}

        {/* Orbital ring */}
        <circle cx={CX} cy={CY} r={LOOP_R} fill="none"
          stroke={COLORS.cool_silver} strokeWidth="1" opacity={0.15 * masterIn} />
        <circle cx={CX} cy={CY} r={LOOP_R} fill="none"
          stroke={COLORS.cool_silver} strokeWidth="3" opacity={0.08 * masterIn}
          strokeDasharray="8 12" />

        {/* Orbital dots */}
        {orbitalDots.map((od) => {
          const a = od.angle + (orbitRotation * Math.PI / 180);
          const ox = CX + Math.cos(a) * od.radius;
          const oy = CY + Math.sin(a) * od.radius;
          return (
            <circle key={`od-${od.id}`} cx={ox} cy={oy} r={od.size}
              fill={COLORS.electric_cyan} opacity={0.2 * masterIn} />
          );
        })}

        {/* Radial lines from center */}
        {radialLines.map((rl) => {
          const rlO = interpolate(frame, [10, 25], [0, 0.1], { extrapolateRight: 'clamp' });
          return (
            <line key={`rl-${rl.id}`}
              x1={CX + Math.cos(rl.angle) * 50} y1={CY + Math.sin(rl.angle) * 50}
              x2={CX + Math.cos(rl.angle) * (50 + rl.len)} y2={CY + Math.sin(rl.angle) * (50 + rl.len)}
              stroke={COLORS.cool_silver} strokeWidth="0.5" opacity={rlO * masterIn} />
          );
        })}

        {/* Connection arrows */}
        {steps.map((step, i) => {
          const next = steps[(i + 1) % steps.length];
          const a1 = (step.angle * Math.PI) / 180;
          const a2 = (next.angle * Math.PI) / 180;
          const x1 = cx + Math.cos(a1) * LOOP_R;
          const y1 = cy + Math.sin(a1) * LOOP_R;
          const x2 = cx + Math.cos(a2) * LOOP_R;
          const y2 = cy + Math.sin(a2) * LOOP_R;
          
          return (
            <path
              key={`conn-${i}`}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              fill="none"
              stroke={step.color}
              strokeWidth="6"
              strokeDasharray="16,8"
              opacity={masterIn * 0.4}
              markerEnd={`url(#arrow-${i})`}
            />
          );
        })}

        {/* Highlight ring for active step */}
        <circle cx={cx} cy={cy} r={LOOP_R + 80} fill="none"
          stroke={COLORS.electric_cyan} strokeWidth="2.5" opacity={ringPulse * 0.3} filter="url(#cyanGlow)" />
        <circle cx={cx} cy={cy} r={LOOP_R + 105} fill="none"
          stroke={COLORS.electric_cyan} strokeWidth="1" opacity={ringPulse * 0.15} />

        {/* Step nodes */}
        {steps.map((step, i) => {
          const a = (step.angle * Math.PI) / 180;
          const nx = cx + Math.cos(a) * (LOOP_R + 20);
          const ny = cy + Math.sin(a) * (LOOP_R + 20);
          const nDelay = 6 + i * 4;
          const nScale = scaleAnim(frame, nDelay, 14, 0, 1);
          const isHighlighted = i === highlightIdx;
          const hScale = isHighlighted ? 1.35 : 1;
          const hOpacity = isHighlighted ? 1 : 0.6;

          return (
            <g key={`step-${i}`} transform={`translate(${nx}, ${ny}) scale(${nScale * nodeReveal * hScale})`}>
              {/* Highlight ring */}
              {isHighlighted && (
                <circle cx="0" cy="0" r="115"
                  fill="none" stroke={step.color} strokeWidth="6"
                  opacity="0.7" filter="url(#nodeGlow)" />
              )}
              {/* Outer ring */}
              <circle cx="0" cy="0" r="100" fill="none"
                stroke={step.color} strokeWidth="3" opacity={0.4 * hOpacity} />
              {/* Filled node */}
              <circle cx="0" cy="0" r="82"
                fill={COLORS.deep_black} stroke={step.color} strokeWidth="5"
                opacity={hOpacity} />
              {/* Icon */}
              <text x="0" y="15" textAnchor="middle" fontSize="95">{step.icon}</text>
              {/* Label */}
              <text x="0" y="145" textAnchor="middle" fontSize="68" fontWeight="900"
                fill={step.color} fontFamily="monospace" opacity={hOpacity} filter="url(#nodeGlow)">
                {step.label}
              </text>
              {/* Small indicator dot on active */}
              {isHighlighted && <circle cy="-135" r="8" fill={step.color} filter="url(#cyanGlow)" />}
            </g>
          );
        })}

        {/* Center agent core */}
        <g transform={`translate(${cx}, ${cy}) scale(${ringPulse * masterIn * 1.5})`}>
          <circle cx="0" cy="0" r="65" fill={COLORS.deep_black}
            stroke={COLORS.electric_cyan} strokeWidth="4" filter="url(#cyanGlow)" />
          <circle cx="0" cy="0" r="75" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" opacity="0.4" />
          <text x="0" y="8" textAnchor="middle" fontSize="42" fontWeight="900"
            fill={COLORS.electric_cyan} fontFamily="monospace">AGENT</text>
        </g>

        {/* Title */}
        <g transform={`translate(${cx}, 240)`} opacity={titleOpacity}>
          <text x="0" y={titleY} textAnchor="middle" fontSize="76" fontWeight="900"
            fill={COLORS.soft_white} fontFamily="monospace" letterSpacing="4">
            THE AGENT LOOP
          </text>
          <text x="0" y={titleY + 100} textAnchor="middle" fontSize="48"
            fill={COLORS.cool_silver} fontFamily="monospace" fontWeight="bold">
            perceive → think → act → observe
          </text>
        </g>

        {/* Subtitle brand */}
        <g transform="translate(540, 1780)" opacity={titleOpacity}>
          <rect x="-480" y="-70" width="960" height="140" rx="24" fill={COLORS.deep_black} fillOpacity="0.8" stroke={COLORS.electric_cyan} strokeWidth="3" filter="url(#cyanGlow)" />
          <text x="0" y="15" textAnchor="middle" fontSize="56" fontWeight="900" fill={COLORS.electric_cyan} fontFamily="monospace" filter="url(#cyanGlow)">
            AI AGENTS: MODULES & TOOLS
          </text>
        </g>

        {/* Corner brackets */}
        {[[30, 30], [1050, 30], [30, 1890], [1050, 1890]].map(([bx, by], i) => {
          const bO = interpolate(frame, [2 + i * 2, 10 + i * 2], [0, 0.45], { extrapolateRight: 'clamp' });
          const sx = i % 2 === 0 ? 1 : -1;
          const sy = i < 2 ? 1 : -1;
          return (
            <g key={`cb-${i}`} transform={`translate(${bx}, ${by}) scale(${sx}, ${sy})`} opacity={bO}>
              <line x1="0" y1="0" x2="35" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="35" stroke={COLORS.electric_cyan} strokeWidth="2" />
            </g>
          );
        })}

        {/* Bottom caption bar */}
        <g opacity={titleOpacity}>
          <rect x={60} y={1740} width={960} height={120} rx="20" fill={COLORS.deep_black} fillOpacity="0.85" stroke={COLORS.cool_silver} strokeWidth="2" />
          <text x="540" y="1815" textAnchor="middle" fontSize="52" fill={COLORS.soft_white}
            fontFamily="monospace" fontWeight="bold">
            Day 26: Complete Loop
          </text>
        </g>

        {/* Scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 90], [0, 1920], { extrapolateRight: 'extend' }) % 1920;
          return <line x1="0" y1={scanY} x2="1080" y2={scanY}
            stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.06" />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};
