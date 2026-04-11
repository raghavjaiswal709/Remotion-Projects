/**
 * Scene20_CompareWithWithout.tsx — Day 26: Observations
 *
 * Split comparison — top half: agent WITH observations (bright, successful,
 * green checkmarks, happy robot). Bottom half: agent WITHOUT observations
 * (dark, confused, red X marks, blind robot). Animated divider line.
 * "WITH" vs "WITHOUT" labels. Dramatic visual contrast.
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

/* ── Checkmarks (top half) ───────────────────────────────────────────── */
const checkmarks = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 200 + (i % 3) * 340,
  y: 350 + Math.floor(i / 3) * 200,
  delay: 15 + i * 4,
  size: 35 + (i % 3) * 5,
}));

/* ── X marks (bottom half) ───────────────────────────────────────────── */
const xMarks = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 200 + (i % 3) * 340,
  y: 1250 + Math.floor(i / 3) * 200,
  delay: 25 + i * 4,
  size: 35 + (i % 3) * 5,
}));

/* ── Success particles (top) ─────────────────────────────────────────── */
const successParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: ((i * 157.3) % 1080),
  y: ((i * 117.7) % 800) + 120,
  r: 0.7 + (i % 4) * 0.5,
  phase: (i * 0.9) % (Math.PI * 2),
  speed: 0.03 + (i % 5) * 0.007,
}));

/* ── Failure particles (bottom) ──────────────────────────────────────── */
const failParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: ((i * 143.7) % 1080),
  y: ((i * 131.3) % 700) + 1060,
  r: 0.5 + (i % 3) * 0.4,
  phase: (i * 1.1) % (Math.PI * 2),
  speed: 0.02 + (i % 4) * 0.005,
}));

/* ── Data streams (top) ──────────────────────────────────────────────── */
const dataStreams = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: 100 + i * 100,
  delay: 10 + i * 3,
}));

/* ── Broken lines (bottom) ───────────────────────────────────────────── */
const brokenLines = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: 100 + i * 100,
  delay: 18 + i * 3,
}));

/* ── Circuit accents ─────────────────────────────────────────────────── */
const circuits = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x1: (i * 97) % 1080,
  y1: (i * 167) % 1920,
  horiz: i % 2 === 0,
  len: 50 + (i % 4) * 30,
}));

export const Scene20_CompareWithWithout: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const dividerX = interpolate(frame, [5, 25], [-540, 540], { extrapolateRight: 'clamp', easing: ease });
  const dividerGlow = interpolate(frame, [0, 20, 40, 60], [3, 8, 3, 8], { extrapolateRight: 'extend' });
  const labelOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const topBright = interpolate(frame, [8, 22], [0.3, 1], { extrapolateRight: 'clamp', easing: ease });
  const botDim = interpolate(frame, [8, 22], [0.8, 0.35], { extrapolateRight: 'clamp', easing: ease });
  const robotSmile = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotSad = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const checkScale = interpolate(frame, [0, 10, 20], [0.8, 1.1, 1], { extrapolateRight: 'extend' });
  const xShake = interpolate(frame, [0, 5, 10, 15], [0, -3, 3, 0], { extrapolateRight: 'extend' });

  const cx = 540;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={dividerGlow} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Top gradient (bright) */}
          <linearGradient id="topBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.vibrant_green} stopOpacity="0.06" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </linearGradient>
          {/* Bottom gradient (dim red) */}
          <linearGradient id="botBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.bg_black} stopOpacity="0" />
            <stop offset="100%" stopColor={COLORS.vibrant_red} stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* ── TOP HALF: WITH OBSERVATIONS ─────────────────────────────── */}
        <g opacity={topBright * masterIn}>
          <rect x="0" y="80" width="1080" height="840" fill="url(#topBg)" />

          {/* Success particles */}
          {successParticles.map((p) => {
            const py = p.y + Math.sin(frame * p.speed + p.phase) * 15;
            const px = p.x + Math.cos(frame * p.speed * 0.7 + p.phase) * 10;
            return (
              <circle key={`sp-${p.id}`} cx={px} cy={py} r={p.r}
                fill={COLORS.vibrant_green} opacity={0.2 + Math.sin(frame * 0.04 + p.phase) * 0.1} />
            );
          })}

          {/* Data streams flowing */}
          {dataStreams.map((ds) => {
            const streamY = interpolate(frame, [ds.delay, ds.delay + 40], [180, 800], { extrapolateRight: 'extend' });
            const sy = ((streamY) % 620) + 180;
            return (
              <rect key={`ds-${ds.id}`} x={ds.x - 3} y={sy} width="6" height="16" rx="3"
                fill={COLORS.vibrant_green} opacity="0.4" filter="url(#greenGlow)" />
            );
          })}

          {/* Happy robot */}
          <g transform={`translate(${cx}, 680) scale(1.4)`}>
            <rect x="-55" y="-50" width="110" height="100" rx="20"
              fill={COLORS.deep_black} stroke={COLORS.vibrant_green} strokeWidth="3" />
            {/* Eyes - happy */}
            <circle cx="-20" cy="-12" r="10" fill={COLORS.vibrant_green} filter="url(#greenGlow)" />
            <circle cx="20" cy="-12" r="10" fill={COLORS.vibrant_green} filter="url(#greenGlow)" />
            {/* Smile */}
            <path d={`M -20 20 Q 0 ${20 + 18 * robotSmile} 20 20`}
              fill="none" stroke={COLORS.vibrant_green} strokeWidth="3" strokeLinecap="round" />
            {/* Antenna */}
            <line x1="0" y1="-50" x2="0" y2="-80" stroke={COLORS.vibrant_green} strokeWidth="3" />
            <circle cx="0" cy="-85" r="8" fill={COLORS.vibrant_green}
              filter="url(#greenGlow)" opacity={0.6 + Math.sin(frame * 0.15) * 0.4} />
            {/* Observation arrows coming in */}
            {[-1, 0, 1].map((dir) => {
              const arrowO = interpolate(frame, [15 + Math.abs(dir) * 5, 30 + Math.abs(dir) * 5], [0, 0.7], { extrapolateRight: 'clamp' });
              return (
                <g key={`oa-${dir}`} opacity={arrowO}>
                  <line x1={dir * 180} y1={-60} x2={dir * 60} y2={-10}
                    stroke={COLORS.vibrant_green} strokeWidth="2" markerEnd="" />
                  <polygon points="-5,-4 5,0 -5,4"
                    transform={`translate(${dir * 70}, ${-15}) rotate(${dir < 0 ? 20 : dir > 0 ? 160 : 90})`}
                    fill={COLORS.vibrant_green} />
                </g>
              );
            })}
          </g>

          {/* Checkmarks */}
          {checkmarks.map((ck) => {
            const ckO = interpolate(frame, [ck.delay, ck.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`ck-${ck.id}`} transform={`translate(${ck.x}, ${ck.y}) scale(${checkScale * ckO})`}>
                <circle cx="0" cy="0" r={ck.size} fill={COLORS.vibrant_green} opacity="0.15" />
                <path d={`M ${-ck.size * 0.4} 0 L ${-ck.size * 0.1} ${ck.size * 0.35} L ${ck.size * 0.4} ${-ck.size * 0.3}`}
                  fill="none" stroke={COLORS.vibrant_green} strokeWidth="3" strokeLinecap="round"
                  opacity={ckO} filter="url(#greenGlow)" />
              </g>
            );
          })}

          {/* "WITH" label */}
          <g transform={`translate(${cx}, 220)`} opacity={labelOpacity}>
            <rect x="-140" y="-55" width="280" height="110" rx="20"
              fill={COLORS.deep_black} stroke={COLORS.vibrant_green} strokeWidth="3" />
            <text x="0" y="15" textAnchor="middle" fontSize="72" fontWeight="900"
              fill={COLORS.vibrant_green} fontFamily="monospace">
              WITH
            </text>
          </g>
          <text x={cx} y={350} textAnchor="middle" fontSize="52"
            fill={COLORS.cool_silver} fontFamily="monospace" opacity={labelOpacity * 0.8} fontWeight="bold">
            Observations Enabled
          </text>
        </g>

        {/* ── DIVIDER LINE ────────────────────────────────────────────── */}
        <line x1={cx - dividerX} y1="960" x2={cx + dividerX} y2="960"
          stroke={COLORS.electric_cyan} strokeWidth="4" opacity={masterIn}
          filter="url(#cyanGlow)" />
        {/* Divider label */}
        <g transform="translate(540, 960)" opacity={labelOpacity * masterIn}>
          <rect x="-60" y="-30" width="120" height="60" rx="12" fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="2" />
          <text x="0" y="12" textAnchor="middle" fontSize="48" fontWeight="bold"
            fill={COLORS.electric_cyan} fontFamily="monospace">VS</text>
        </g>

        {/* ── BOTTOM HALF: WITHOUT OBSERVATIONS ──────────────────────── */}
        <g opacity={botDim * masterIn}>
          <rect x="0" y="1000" width="1080" height="840" fill="url(#botBg)" />

          {/* Failure particles */}
          {failParticles.map((p) => {
            const py = p.y + Math.sin(frame * p.speed + p.phase) * 12;
            const px = p.x + Math.cos(frame * p.speed * 0.5 + p.phase) * 10;
            return (
              <circle key={`fp-${p.id}`} cx={px} cy={py} r={p.r}
                fill={COLORS.vibrant_red} opacity={0.12 + Math.sin(frame * 0.03 + p.phase) * 0.06} />
            );
          })}

          {/* Broken lines */}
          {brokenLines.map((bl) => {
            const blO = interpolate(frame, [bl.delay, bl.delay + 10], [0, 0.3], { extrapolateRight: 'clamp' });
            return (
              <g key={`bl-${bl.id}`} opacity={blO}>
                <line x1={bl.x} y1={1100} x2={bl.x} y2={1180}
                  stroke={COLORS.vibrant_red} strokeWidth="2" strokeDasharray="4 6" />
                <line x1={bl.x + 3} y1={1220} x2={bl.x - 2} y2={1300}
                  stroke={COLORS.vibrant_red} strokeWidth="1.5" strokeDasharray="3 8" opacity="0.5" />
              </g>
            );
          })}

          {/* Sad robot */}
          <g transform={`translate(${cx}, 1520) scale(1.4)`}>
            <rect x="-55" y="-50" width="110" height="100" rx="20"
              fill={COLORS.deep_black} stroke={COLORS.vibrant_red} strokeWidth="2.5" opacity="0.8" />
            {/* Eyes - confused X */}
            {[-20, 20].map((ex) => (
              <g key={`eye-${ex}`} transform={`translate(${ex + xShake}, -12)`}>
                <line x1="-6" y1="-6" x2="6" y2="6" stroke={COLORS.vibrant_red} strokeWidth="2.5" />
                <line x1="6" y1="-6" x2="-6" y2="6" stroke={COLORS.vibrant_red} strokeWidth="2.5" />
              </g>
            ))}
            {/* Frown */}
            <path d={`M -18 28 Q 0 ${28 - 14 * robotSad} 18 28`}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            {/* Broken antenna */}
            <line x1="0" y1="-50" x2="-8" y2="-72" stroke={COLORS.vibrant_red} strokeWidth="2" opacity="0.5" />
            <circle cx="-8" cy="-76" r="5" fill={COLORS.vibrant_red} opacity="0.3" />
            {/* Question marks */}
            {[-60, 60].map((qx, qi) => {
              const qO = interpolate(frame, [30 + qi * 5, 42 + qi * 5], [0, 0.7], { extrapolateRight: 'clamp' });
              return (
                <text key={`q-${qi}`} x={qx} y={-30} textAnchor="middle" fontSize="56"
                  fill={COLORS.vibrant_red} opacity={qO} fontFamily="monospace">?</text>
              );
            })}
          </g>

          {/* X marks */}
          {xMarks.map((xm) => {
            const xO = interpolate(frame, [xm.delay, xm.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`xm-${xm.id}`} transform={`translate(${xm.x + xShake}, ${xm.y})`} opacity={xO}>
                <circle cx="0" cy="0" r={xm.size} fill={COLORS.vibrant_red} opacity="0.1" />
                <line x1={-xm.size * 0.35} y1={-xm.size * 0.35} x2={xm.size * 0.35} y2={xm.size * 0.35}
                  stroke={COLORS.vibrant_red} strokeWidth="3" strokeLinecap="round" filter="url(#redGlow)" />
                <line x1={xm.size * 0.35} y1={-xm.size * 0.35} x2={-xm.size * 0.35} y2={xm.size * 0.35}
                  stroke={COLORS.vibrant_red} strokeWidth="3" strokeLinecap="round" filter="url(#redGlow)" />
              </g>
            );
          })}

          {/* "WITHOUT" label */}
          <g transform={`translate(${cx}, 1080)`} opacity={labelOpacity}>
            <rect x="-180" y="-55" width="360" height="110" rx="20"
              fill={COLORS.deep_black} stroke={COLORS.vibrant_red} strokeWidth="3" />
            <text x="0" y="15" textAnchor="middle" fontSize="72" fontWeight="900"
              fill={COLORS.vibrant_red} fontFamily="monospace">
              WITHOUT
            </text>
          </g>
          <text x={cx} y={1190} textAnchor="middle" fontSize="52"
            fill={COLORS.cool_silver} fontFamily="monospace" opacity={labelOpacity * 0.8} fontWeight="bold">
            No Feedback Loops
          </text>
          <text x={cx} y={1850} textAnchor="middle" fontSize="46"
            fill={COLORS.cool_silver} fontFamily="monospace" opacity={labelOpacity * 0.6}>
            no adaptation, acts blindly
          </text>
        </g>

        {/* Circuit accents */}
        {circuits.map((c) => {
          const cO = interpolate(frame, [c.id * 2, c.id * 2 + 10], [0, 0.08], { extrapolateRight: 'clamp' });
          return (
            <line key={`ci-${c.id}`}
              x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={cO * masterIn} />
          );
        })}

        {/* Title */}
        <text x={cx} y={100} textAnchor="middle" fontSize="52" fontWeight="900"
          fill={COLORS.soft_white} fontFamily="monospace" opacity={labelOpacity} letterSpacing="4">
          OBSERVATIONS MATTER
        </text>

        {/* Corner brackets */}
        {[[30, 100], [1050, 100], [30, 1870], [1050, 1870]].map(([bx, by], i) => {
          const bO = interpolate(frame, [2 + i * 2, 10 + i * 2], [0, 0.4], { extrapolateRight: 'clamp' });
          const sx = i % 2 === 0 ? 1 : -1;
          const sy = i < 2 ? 1 : -1;
          return (
            <g key={`cb-${i}`} transform={`translate(${bx}, ${by}) scale(${sx}, ${sy})`} opacity={bO}>
              <line x1="0" y1="0" x2="30" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="30" stroke={COLORS.electric_cyan} strokeWidth="2" />
            </g>
          );
        })}

        {/* Scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 90], [80, 1880], { extrapolateRight: 'extend' }) % 1800 + 80;
          return <line x1="0" y1={scanY} x2="1080" y2={scanY}
            stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.05" />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};
