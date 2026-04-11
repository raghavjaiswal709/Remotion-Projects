/**
 * Scene18_AgentListens.tsx — Day 26: Observations
 *
 * Agent robot with large "ear" antenna receiving signals from the world.
 * Sound wave ripples propagate inward toward the agent. Multiple observation
 * data streams converge on the receiver. "LISTENING" label pulses.
 * Radar sweep animation rotates continuously. Signal strength bars animate.
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

/* ── Sound wave ripples ──────────────────────────────────────────────── */
const soundWaves = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  baseRadius: 120 + i * 55,
  delay: i * 5,
  angle: (i * 45) % 360,
}));

/* ── Data streams converging ─────────────────────────────────────────── */
const dataStreams = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i * 30) * (Math.PI / 180),
  startR: 650,
  endR: 60,
  delay: 5 + i * 3,
  color: i % 3 === 0 ? COLORS.electric_cyan : i % 3 === 1 ? COLORS.warm_blue : COLORS.purple,
}));

/* ── Signal strength bars ────────────────────────────────────────────── */
const signalBars = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  height: 30 + i * 18,
  delay: 10 + i * 4,
}));

/* ── Background particles ────────────────────────────────────────────── */
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: ((i * 173.7) % 1080),
  y: ((i * 211.3) % 1920),
  r: 0.6 + (i % 5) * 0.4,
  phase: (i * 0.8) % (Math.PI * 2),
  speed: 0.02 + (i % 7) * 0.008,
}));

/* ── Circuit lines ───────────────────────────────────────────────────── */
const circuitLines = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x1: (i * 83) % 1080,
  y1: (i * 149) % 1920,
  x2: ((i * 83) % 1080) + (i % 2 === 0 ? 120 : 0),
  y2: ((i * 149) % 1920) + (i % 2 === 0 ? 0 : 120),
  delay: i * 2,
}));

/* ── Radar sweep dots ────────────────────────────────────────────────── */
const radarDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  r: 40 + ((i * 37) % 260),
  angle: ((i * 67) % 360) * (Math.PI / 180),
  size: 2 + (i % 4),
}));

/* ── Antenna segments ────────────────────────────────────────────────── */
const antennaSegments = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  y: -60 - i * 40,
  width: 16 - i * 2,
}));

export const Scene18_AgentListens: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const radarAngle = interpolate(frame, [0, 90], [0, 360], { extrapolateRight: 'extend' });
  const pulseScale = interpolate(frame, [0, 30, 60, 90], [1, 1.08, 1, 1.08], { extrapolateRight: 'extend' });
  const signalPulse = interpolate(frame, [0, 15, 30], [0.6, 1, 0.6], { extrapolateRight: 'extend' });
  const labelOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowIntensity = interpolate(frame, [0, 20, 40, 60], [4, 12, 4, 12], { extrapolateRight: 'extend' });
  const antennaGrow = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleY = interpolate(frame, [0, 18], [60, 0], { extrapolateRight: 'clamp', easing: ease });
  const sweepOpacity = interpolate(frame, [0, 10], [0, 0.6], { extrapolateRight: 'clamp' });
  const dataConverge = interpolate(frame, [8, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const cx = 540;
  const cy = 880;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          {/* Glow filters */}
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Radar sweep gradient */}
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.5" />
          </linearGradient>
          {/* Background radial */}
          <radialGradient id="bgRadial" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.08" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgRadial)" />

        {/* Circuit lines */}
        {circuitLines.map((cl) => {
          const o = interpolate(frame, [cl.delay, cl.delay + 15], [0, 0.15], { extrapolateRight: 'clamp' });
          return (
            <line key={`cl-${cl.id}`} x1={cl.x1} y1={cl.y1} x2={cl.x2} y2={cl.y2}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o} />
          );
        })}

        {/* Floating particles */}
        {particles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 20;
          const px = p.x + Math.cos(frame * p.speed * 0.7 + p.phase) * 15;
          const o = 0.15 + Math.sin(frame * 0.05 + p.phase) * 0.1;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.cool_silver} opacity={o * masterIn} />
          );
        })}

        {/* Radar sweep */}
        <g transform={`translate(${cx}, ${cy})`} opacity={sweepOpacity * masterIn}>
          <g transform={`rotate(${radarAngle})`}>
            <path d={`M 0 0 L 300 -30 A 300 300 0 0 1 300 30 Z`}
              fill="url(#sweepGrad)" opacity="0.4" />
            <line x1="0" y1="0" x2="300" y2="0"
              stroke={COLORS.electric_cyan} strokeWidth="2" opacity="0.7" filter="url(#radarGlow)" />
          </g>
          {/* Radar rings */}
          {[100, 200, 300].map((r) => (
            <circle key={`rr-${r}`} cx="0" cy="0" r={r}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth="0.5" opacity="0.15" />
          ))}
          {/* Radar dots */}
          {radarDots.map((d) => {
            const dotAngle = d.angle + (radarAngle * Math.PI) / 180;
            const dx = Math.cos(dotAngle) * d.r;
            const dy = Math.sin(dotAngle) * d.r;
            const diff = ((radarAngle * Math.PI / 180) - d.angle + Math.PI * 4) % (Math.PI * 2);
            const dotO = diff < 1 ? 0.8 : Math.max(0, 0.8 - diff * 0.15);
            return (
              <circle key={`rd-${d.id}`} cx={dx} cy={dy} r={d.size}
                fill={COLORS.electric_cyan} opacity={dotO * masterIn} filter="url(#radarGlow)" />
            );
          })}
        </g>

        {/* Sound wave ripples */}
        {soundWaves.map((sw) => {
          const waveT = interpolate(frame, [sw.delay, sw.delay + 45], [0, 1], { extrapolateRight: 'extend' });
          const cycle = waveT % 1;
          const waveR = sw.baseRadius * (0.3 + cycle * 0.7);
          const waveO = (1 - cycle) * 0.4 * masterIn;
          return (
            <circle key={`sw-${sw.id}`} cx={cx} cy={cy} r={waveR}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5"
              opacity={waveO} filter="url(#softGlow)" />
          );
        })}

        {/* Data streams converging */}
        {dataStreams.map((ds) => {
          const progress = interpolate(frame, [ds.delay, ds.delay + 30], [0, 1], { extrapolateRight: 'extend' });
          const cycle = progress % 1;
          const curR = ds.startR - (ds.startR - ds.endR) * cycle;
          const dx = cx + Math.cos(ds.angle) * curR;
          const dy = cy + Math.sin(ds.angle) * curR;
          const o = (1 - cycle * 0.5) * dataConverge;
          return (
            <g key={`ds-${ds.id}`}>
              {/* Trail */}
              <line x1={cx + Math.cos(ds.angle) * ds.startR} y1={cy + Math.sin(ds.angle) * ds.startR}
                x2={dx} y2={dy}
                stroke={ds.color} strokeWidth="1" opacity={o * 0.3} />
              {/* Packet */}
              <rect x={dx - 4} y={dy - 3} width="8" height="6" rx="1"
                fill={ds.color} opacity={o} filter="url(#radarGlow)" />
            </g>
          );
        })}

        {/* Agent body */}
        <g transform={`translate(${cx}, ${cy}) scale(${pulseScale * masterIn})`}>
          {/* Outer ring */}
          <circle cx="0" cy="0" r="80" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" opacity="0.4" />
          {/* Body */}
          <rect x="-50" y="-45" width="100" height="90" rx="18"
            fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="-18" cy="-10" r="8" fill={COLORS.electric_cyan} opacity={signalPulse} filter="url(#cyanGlow)" />
          <circle cx="18" cy="-10" r="8" fill={COLORS.electric_cyan} opacity={signalPulse} filter="url(#cyanGlow)" />
          {/* Mouth/speaker grille */}
          {[-12, 0, 12].map((mx) => (
            <rect key={`m-${mx}`} x={mx - 3} y="15" width="6" height="3" rx="1"
              fill={COLORS.cool_silver} opacity="0.6" />
          ))}
          {/* Ear antenna — left */}
          <g transform={`translate(-50, -30) scale(${antennaGrow})`}>
            {antennaSegments.map((seg) => (
              <rect key={`al-${seg.id}`} x={-seg.width / 2} y={seg.y} width={seg.width} height="30" rx="4"
                fill={COLORS.warm_blue} opacity="0.8" />
            ))}
            <circle cx="0" cy={-60 - 5 * 40} r="12"
              fill={COLORS.electric_cyan} opacity={signalPulse} filter="url(#cyanGlow)" />
          </g>
          {/* Ear antenna — right */}
          <g transform={`translate(50, -30) scale(${antennaGrow})`}>
            {antennaSegments.map((seg) => (
              <rect key={`ar-${seg.id}`} x={-seg.width / 2} y={seg.y} width={seg.width} height="30" rx="4"
                fill={COLORS.warm_blue} opacity="0.8" />
            ))}
            <circle cx="0" cy={-60 - 5 * 40} r="12"
              fill={COLORS.electric_cyan} opacity={signalPulse} filter="url(#cyanGlow)" />
          </g>
        </g>

        {/* Signal strength bars */}
        <g transform="translate(650, 1380)">
          {signalBars.map((sb) => {
            const barH = scaleAnim(frame, sb.delay, 15, 0, sb.height * 1.5);
            const barO = interpolate(frame, [sb.delay, sb.delay + 10], [0, 0.9], { extrapolateRight: 'clamp' });
            return (
              <rect key={`sb-${sb.id}`}
                x={sb.id * 50} y={-barH} width="35" height={barH} rx="6"
                fill={sb.id < 2 ? COLORS.vibrant_red : sb.id < 4 ? COLORS.amber : COLORS.vibrant_green}
                opacity={barO * masterIn} />
            );
          })}
          <text x="140" y="55" textAnchor="middle" fontSize="58" fill={COLORS.cool_silver} opacity={labelOpacity} fontWeight="bold">
            SIGNAL
          </text>
        </g>

        {/* "LISTENING" label */}
        <g transform={`translate(${cx}, 1560)`} opacity={labelOpacity * masterIn}>
          <rect x="-180" y="-45" width="360" height="90" rx="20"
            fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="3" />
          <text x={0} y={15} textAnchor="middle" fontSize="68" fontWeight="bold"
            fill={COLORS.electric_cyan} fontFamily="monospace" filter="url(#cyanGlow)">
            {'LISTENING'.split('').map((ch, i) => {
              const charO = interpolate(frame, [20 + i * 2, 25 + i * 2], [0, 1], { extrapolateRight: 'clamp' });
              return <tspan key={i} opacity={charO}>{ch}</tspan>;
            })}
          </text>
          {/* Pulsing dot */}
          <circle cx="130" cy="0" r={4 * signalPulse}
            fill={COLORS.vibrant_green} filter="url(#softGlow)" />
        </g>

        {/* Title */}
        <text x={cx} y={260} textAnchor="middle" fontSize="62" fontWeight="900"
          fill={COLORS.soft_white} fontFamily="monospace"
          opacity={masterIn} transform={`translate(0, ${titleY})`}>
          AGENT LISTENS
        </text>
        <text x={cx} y={345} textAnchor="middle" fontSize="46"
          fill={COLORS.cool_silver} fontFamily="monospace" opacity={labelOpacity}>
          receiving observations
        </text>
        <text x={cx} y={405} textAnchor="middle" fontSize="46"
          fill={COLORS.electric_cyan} fontFamily="monospace" opacity={labelOpacity} fontWeight="bold">
          from the world
        </text>

        {/* Corner brackets */}
        {[[30, 30], [1050, 30], [30, 1890], [1050, 1890]].map(([bx, by], i) => {
          const bO = interpolate(frame, [5 + i * 3, 15 + i * 3], [0, 0.5], { extrapolateRight: 'clamp' });
          const sx = i % 2 === 0 ? 1 : -1;
          const sy = i < 2 ? 1 : -1;
          return (
            <g key={`cb-${i}`} transform={`translate(${bx}, ${by}) scale(${sx}, ${sy})`} opacity={bO}>
              <line x1="0" y1="0" x2="40" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="40" stroke={COLORS.electric_cyan} strokeWidth="2" />
            </g>
          );
        })}

        {/* Bottom caption bar */}
        <g opacity={labelOpacity}>
          <rect x={60} y={1740} width={960} height={120} rx="20" fill={COLORS.deep_black} fillOpacity="0.8" stroke={COLORS.cool_silver} strokeWidth="1.5" />
          <text x={cx} y="1815" textAnchor="middle" fontSize="52" fill={COLORS.soft_white}
            fontFamily="monospace" fontWeight="bold">
            Day 26: Observations
          </text>
        </g>

        {/* Decorative horizontal scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 90], [0, 1920], { extrapolateRight: 'extend' }) % 1920;
          return (
            <line x1="0" y1={scanY} x2="1080" y2={scanY}
              stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.08" />
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};
