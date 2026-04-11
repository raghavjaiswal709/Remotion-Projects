/**
 * Scene19_DataFlow.tsx — Day 26: Observations
 *
 * Visualization of data flowing through the full agent loop.
 * Animated data packets (small glowing rectangles) flow along a conveyor:
 * Perceive → Think → Act → World → Observe → back to Perceive.
 * Speed increases over time. Trail effects behind packets.
 * "DATA FLOW" title with animated underline.
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

/* ── Loop path nodes ─────────────────────────────────────────────────── */
const loopNodes = [
  { label: 'PERCEIVE', x: 540, y: 560, color: COLORS.vibrant_green, icon: '👁' },
  { label: 'THINK', x: 880, y: 920, color: COLORS.warm_blue, icon: '🧠' },
  { label: 'ACT', x: 540, y: 1280, color: COLORS.amber, icon: '⚡' },
  { label: 'WORLD', x: 200, y: 1280, color: COLORS.cool_silver, icon: '🌍' },
  { label: 'OBSERVE', x: 200, y: 920, color: COLORS.purple, icon: '📡' },
];

/* ── Data packets ────────────────────────────────────────────────────── */
const packets = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  offset: i / 30,
  size: 6 + (i % 4) * 2,
  color: i % 5 === 0 ? COLORS.electric_cyan : i % 5 === 1 ? COLORS.warm_blue :
    i % 5 === 2 ? COLORS.amber : i % 5 === 3 ? COLORS.purple : COLORS.vibrant_green,
  trailLen: 3 + (i % 3),
}));

/* ── Background particles ────────────────────────────────────────────── */
const particles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 163.3) % 1080),
  y: ((i * 197.7) % 1920),
  r: 0.5 + (i % 4) * 0.4,
  phase: (i * 1.1) % (Math.PI * 2),
  speed: 0.03 + (i % 5) * 0.006,
}));

/* ── Circuit lines ───────────────────────────────────────────────────── */
const circuits = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x1: (i * 71) % 1080,
  y1: (i * 127) % 1920,
  len: 60 + (i % 4) * 40,
  horiz: i % 2 === 0,
  delay: i * 2,
}));

/* ── Speed lines ─────────────────────────────────────────────────────── */
const speedLines = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  y: 300 + i * 110,
  delay: 20 + i * 2,
}));

/* ── Helper: get position along the loop path ─────────────────────── */
const getLoopPos = (t: number) => {
  const n = loopNodes.length;
  const segment = t * n;
  const idx = Math.floor(segment) % n;
  const frac = segment - Math.floor(segment);
  const next = (idx + 1) % n;
  return {
    x: loopNodes[idx].x + (loopNodes[next].x - loopNodes[idx].x) * frac,
    y: loopNodes[idx].y + (loopNodes[next].y - loopNodes[idx].y) * frac,
  };
};

export const Scene19_DataFlow: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const speedMult = interpolate(frame, [0, 80], [0.3, 1.2], { extrapolateRight: 'clamp', easing: ease });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const underlineW = interpolate(frame, [10, 30], [0, 320], { extrapolateRight: 'clamp', easing: ease });
  const nodeScale = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const connectorDraw = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = interpolate(frame, [0, 20, 40, 60], [5, 10, 5, 10], { extrapolateRight: 'extend' });
  const packetOpacity = interpolate(frame, [12, 25], [0, 1], { extrapolateRight: 'clamp' });
  const bgPulse = interpolate(frame, [0, 45, 90], [0.04, 0.08, 0.04], { extrapolateRight: 'extend' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="48%" r="50%">
            <stop offset="0%" stopColor={COLORS.purple} stopOpacity={bgPulse} />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGrad)" />

        {/* Circuit lines */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.delay, c.delay + 12], [0, 0.12], { extrapolateRight: 'clamp' });
          return (
            <line key={`c-${c.id}`}
              x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o * masterIn} />
          );
        })}

        {/* Speed lines */}
        {speedLines.map((sl) => {
          const lineO = interpolate(frame, [sl.delay, sl.delay + 8], [0, 0.1], { extrapolateRight: 'clamp' });
          const lineX = interpolate(frame, [0, 90], [1080, -200], { extrapolateRight: 'extend' });
          const lx = ((lineX + sl.id * 200) % 1280) - 100;
          return (
            <line key={`sl-${sl.id}`} x1={lx} y1={sl.y} x2={lx + 80} y2={sl.y}
              stroke={COLORS.electric_cyan} strokeWidth="1" opacity={lineO * speedMult} />
          );
        })}

        {/* Background particles */}
        {particles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 18;
          const px = p.x + Math.cos(frame * p.speed * 0.6 + p.phase) * 12;
          const o = 0.12 + Math.sin(frame * 0.04 + p.phase) * 0.08;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 4 === 0 ? COLORS.electric_cyan : COLORS.cool_silver}
              opacity={o * masterIn} />
          );
        })}

        {/* Connector paths between nodes */}
        {loopNodes.map((node, i) => {
          const next = loopNodes[(i + 1) % loopNodes.length];
          const pathLen = Math.sqrt((next.x - node.x) ** 2 + (next.y - node.y) ** 2);
          const dashOffset = pathLen * (1 - connectorDraw);
          return (
            <line key={`conn-${i}`}
              x1={node.x} y1={node.y} x2={next.x} y2={next.y}
              stroke={COLORS.cool_silver} strokeWidth="2.5" opacity={0.3 * masterIn}
              strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
          );
        })}

        {/* Arrow heads on connectors */}
        {loopNodes.map((node, i) => {
          const next = loopNodes[(i + 1) % loopNodes.length];
          const mx = (node.x + next.x) / 2;
          const my = (node.y + next.y) / 2;
          const angle = Math.atan2(next.y - node.y, next.x - node.x) * (180 / Math.PI);
          return (
            <polygon key={`arr-${i}`}
              points="-8,-5 8,0 -8,5"
              transform={`translate(${mx}, ${my}) rotate(${angle})`}
              fill={COLORS.electric_cyan} opacity={connectorDraw * 0.6 * masterIn} />
          );
        })}

        {/* Loop nodes */}
        {loopNodes.map((node, i) => {
          const nDelay = 8 + i * 4;
          const nScale = scaleAnim(frame, nDelay, 12, 0, 1);
          const ringPulse = interpolate(frame, [0, 30, 60], [1, 1.1, 1], { extrapolateRight: 'extend' });
          return (
            <g key={`node-${i}`} transform={`translate(${node.x}, ${node.y}) scale(${nScale * nodeScale})`}>
              {/* Outer ring */}
              <circle cx="0" cy="0" r={70 * ringPulse} fill="none"
                stroke={node.color} strokeWidth="3" opacity="0.4" />
              {/* Filled circle */}
              <circle cx="0" cy="0" r="55" fill={COLORS.deep_black}
                stroke={node.color} strokeWidth="4" />
              {/* Icon */}
              <text x="0" y="10" textAnchor="middle" fontSize="62">{node.icon}</text>
              {/* Label */}
              <text x="0" y="95" textAnchor="middle" fontSize="52" fontWeight="bold"
                fill={node.color} fontFamily="monospace">
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Data Packets flowing */}
        {packets.map((p) => {
          const t = (p.offset + frame * 0.008 * speedMult) % 1;
          const pos = getLoopPos(t);
          const tNext = (t + 0.01) % 1;
          const posNext = getLoopPos(tNext);
          const angle = Math.atan2(posNext.y - pos.y, posNext.x - pos.x) * (180 / Math.PI);

          return (
            <g key={`packet-${p.id}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${angle})`}
              opacity={packetOpacity * masterIn}>
              {/* Trail */}
              {Array.from({ length: p.trailLen }).map((_, j) => {
                return (
                  <rect key={`trail-${j}`}
                    x={-p.size * (j + 1) * 1.5} y={-p.size / 2}
                    width={p.size} height={p.size} rx="2"
                    fill={p.color} opacity={0.4 / (j + 1)} filter="url(#trailGlow)" />
                );
              })}
              {/* Main packet */}
              <rect x={-p.size / 2} y={-p.size / 2} width={p.size} height={p.size} rx="2"
                fill={p.color} filter="url(#softGlow)" />
            </g>
          );
        })}

        {/* Center agent core */}
        <g transform="translate(540, 920)" opacity={masterIn}>
          <circle cx="0" cy="0" r="45" fill={COLORS.deep_black}
            stroke={COLORS.electric_cyan} strokeWidth="3" filter="url(#cyanGlow)" />
          <text x="0" y="8" textAnchor="middle" fontSize="46"
            fill={COLORS.electric_cyan} fontFamily="monospace" fontWeight="bold">AI</text>
        </g>

        {/* Title: DATA FLOW */}
        <g transform={`translate(540, 240)`} opacity={titleOpacity}>
          <text x="0" y={titleY} textAnchor="middle" fontSize="68" fontWeight="bold"
            fill={COLORS.soft_white} fontFamily="monospace">
            DATA FLOW
          </text>
          {/* Animated underline */}
          <rect
            x={-underlineW / 2} y={titleY + 15}
            width={underlineW} height="4"
            fill={COLORS.electric_cyan} rx="2"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
