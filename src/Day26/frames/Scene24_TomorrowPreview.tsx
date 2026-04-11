/**
 * Scene24_TomorrowPreview.tsx — Day 26: Observations
 *
 * Preview card for next day's topic. "TOMORROW: TOOLS" text appearing.
 * Tool icons fading in (wrench, hammer, gear). "Day 27" badge.
 * Forward arrow animation. Teaser text. Dark background with cyan accents.
 * Particle trail leading forward. Anticipation/momentum animation.
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

/* ── Tool icons (SVG paths) ──────────────────────────────────────────── */
const tools = [
  {
    label: 'Wrench',
    delay: 15,
    color: COLORS.electric_cyan,
    path: 'M-16-4 L-8-12 L0-4 L8-12 L16-4 L8 4 L16 12 L8 12 L0 4 L-8 12 L-16 12 L-8 4Z',
    y: 840,
  },
  {
    label: 'Hammer',
    delay: 22,
    color: COLORS.amber,
    path: 'M-4-18 L4-18 L4-6 L14-6 L14 2 L4 2 L4 18 L-4 18 L-4 2 L-14 2 L-14-6 L-4-6Z',
    y: 1020,
  },
  {
    label: 'Gear',
    delay: 29,
    color: COLORS.warm_blue,
    path: 'M-4-18 L4-18 L6-12 L12-14 L16-8 L12-4 L14 2 L18 6 L14 12 L8 10 L4 16 L-4 16 L-8 10 L-14 12 L-18 6 L-14 2 L-12-4 L-16-8 L-12-14 L-6-12Z',
    y: 1200,
  },
];

/* ── Forward arrow particles ─────────────────────────────────────────── */
const arrowParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  startX: 100 + ((i * 37) % 880),
  y: 600 + ((i * 67) % 800),
  speed: 2 + (i % 5) * 0.8,
  size: 2 + (i % 4) * 1.5,
  delay: i * 1.5,
}));

/* ── Background particles ────────────────────────────────────────────── */
const bgParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 163.7) % 1080),
  y: ((i * 207.3) % 1920),
  r: 0.5 + (i % 4) * 0.4,
  phase: (i * 0.85) % (Math.PI * 2),
  speed: 0.02 + (i % 5) * 0.006,
}));

/* ── Circuit lines ───────────────────────────────────────────────────── */
const circuits = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x1: (i * 81) % 1080,
  y1: (i * 143) % 1920,
  len: 45 + (i % 4) * 28,
  horiz: i % 2 === 0,
  delay: i * 2,
}));

/* ── Momentum lines ──────────────────────────────────────────────────── */
const momentumLines = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  y: 500 + i * 100,
  delay: 8 + i * 2,
  width: 40 + (i % 3) * 30,
}));

/* ── Sparkle dots around badge ───────────────────────────────────────── */
const badgeSparkles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i * 30) * (Math.PI / 180),
  dist: 80 + (i % 3) * 15,
  size: 2 + (i % 3),
  phase: (i * 1.1) % (Math.PI * 2),
}));

/* ── Teaser text lines ───────────────────────────────────────────────── */
const teaserLines = [
  { text: 'APIs, databases, file systems…', delay: 32 },
  { text: 'The tools agents use to act', delay: 38 },
  { text: 'on the world around them.', delay: 44 },
];

export const Scene24_TomorrowPreview: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleReveal = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleX = interpolate(frame, [5, 20], [-60, 0], { extrapolateRight: 'clamp', easing: ease });
  const badgeScale = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const badgePulse = interpolate(frame, [0, 25, 50], [1, 1.06, 1], { extrapolateRight: 'extend' });
  const forwardArrow = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowPulse = interpolate(frame, [0, 20, 40, 60], [5, 12, 5, 12], { extrapolateRight: 'extend' });
  const trailProgress = interpolate(frame, [5, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const toolsReveal = interpolate(frame, [12, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const teaserOpacity = interpolate(frame, [30, 42], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const cx = 540;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="badgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.06" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGrad)" />

        {/* Circuit lines */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.delay, c.delay + 12], [0, 0.1], { extrapolateRight: 'clamp' });
          return (
            <line key={`ci-${c.id}`} x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o * masterIn} />
          );
        })}

        {/* Background particles */}
        {bgParticles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 15;
          const px = p.x + Math.cos(frame * p.speed * 0.7 + p.phase) * 10;
          const o = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.07;
          return (
            <circle key={`bp-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.cool_silver}
              opacity={o * masterIn} />
          );
        })}

        {/* Momentum lines (moving right) */}
        {momentumLines.map((ml) => {
          const mlO = interpolate(frame, [ml.delay, ml.delay + 10], [0, 0.2], { extrapolateRight: 'clamp' });
          const mlX = interpolate(frame, [0, 90], [-200, 1280], { extrapolateRight: 'extend' });
          const lx = ((mlX + ml.id * 150) % 1480) - 200;
          return (
            <line key={`ml-${ml.id}`} x1={lx} y1={ml.y} x2={lx + ml.width} y2={ml.y}
              stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={mlO * masterIn} />
          );
        })}

        {/* Forward arrow particles */}
        {arrowParticles.map((ap) => {
          const apProgress = interpolate(frame, [ap.delay, ap.delay + 50], [0, 1], { extrapolateRight: 'extend' });
          const cycle = apProgress % 1;
          const apX = ap.startX + cycle * 200;
          const apO = (1 - cycle) * 0.4 * trailProgress;
          return (
            <circle key={`ap-${ap.id}`} cx={apX} cy={ap.y} r={ap.size}
              fill={COLORS.electric_cyan} opacity={apO * masterIn} filter="url(#softGlow)" />
          );
        })}

        {/* "TOMORROW" label */}
        <g transform={`translate(${cx}, 360)`} opacity={titleReveal * masterIn}>
          <text x={titleX} y="0" textAnchor="middle" fontSize="64"
            fill={COLORS.cool_silver} fontFamily="monospace" letterSpacing="14" fontWeight="900">
            TOMORROW
          </text>
        </g>

        {/* "TOOLS" main title */}
        <g transform={`translate(${cx}, 520)`} opacity={titleReveal * masterIn}>
          {'TOOLS'.split('').map((ch, i) => {
            const charO = interpolate(frame, [8 + i * 3, 14 + i * 3], [0, 1], { extrapolateRight: 'clamp' });
            const charY = interpolate(frame, [8 + i * 3, 14 + i * 3], [30, 0], { extrapolateRight: 'clamp', easing: ease });
            return (
              <text key={`ch-${i}`} x={-200 + i * 100} y={charY} textAnchor="middle"
                fontSize="110" fontWeight="900" fill={COLORS.electric_cyan}
                fontFamily="monospace" opacity={charO} filter="url(#cyanGlow)">
                {ch}
              </text>
            );
          })}
        </g>

        {/* Day 27 badge */}
        <g transform={`translate(${cx}, 700) scale(${badgeScale * badgePulse})`}>
          <circle cx="0" cy="0" r="90" fill={COLORS.deep_black}
            stroke={COLORS.electric_cyan} strokeWidth="4" filter="url(#badgeGlow)" />
          <circle cx="0" cy="0" r="105" fill="none"
            stroke={COLORS.electric_cyan} strokeWidth="2" opacity="0.3" />
          <text x="0" y="-15" textAnchor="middle" fontSize="46" fontWeight="bold"
            fill={COLORS.cool_silver} fontFamily="monospace">DAY</text>
          <text x="0" y="45" textAnchor="middle" fontSize="76" fontWeight="900"
            fill={COLORS.electric_cyan} fontFamily="monospace">27</text>
          {/* Badge sparkles */}
          {badgeSparkles.map((bs) => {
            const bsO = 0.3 + Math.sin(frame * 0.07 + bs.phase) * 0.3;
            const bsx = Math.cos(bs.angle + frame * 0.01) * bs.dist;
            const bsy = Math.sin(bs.angle + frame * 0.01) * bs.dist;
            return (
              <circle key={`bs-${bs.id}`} cx={bsx} cy={bsy} r={bs.size}
                fill={COLORS.electric_cyan} opacity={bsO * badgeScale * masterIn} />
            );
          })}
        </g>

        {/* Tool icons */}
        {tools.map((tool, i) => {
          const tO = interpolate(frame, [tool.delay, tool.delay + 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const tScale = scaleAnim(frame, tool.delay, 12, 0, 1.3);
          const rotate = interpolate(frame, [0, 90], [0, i % 2 === 0 ? 15 : -15], { extrapolateRight: 'extend' });
          return (
            <g key={`tool-${i}`} transform={`translate(${cx}, ${tool.y + 45}) scale(${tScale * toolsReveal})`} opacity={tO * masterIn}>
              {/* Icon background */}
              <circle cx="0" cy="0" r="70" fill={COLORS.deep_black}
                stroke={tool.color} strokeWidth="4" />
              <circle cx="0" cy="0" r="84" fill="none"
                stroke={tool.color} strokeWidth="1" opacity="0.3" />
              {/* Tool shape */}
              <g transform={`rotate(${rotate})`}>
                <path d={tool.path} fill={tool.color} opacity="0.8" />
              </g>
              {/* Label */}
              <text x="100" y="12" fontSize="46" fill={tool.color} fontWeight="bold"
                fontFamily="monospace" opacity={tO}>{tool.label}</text>
            </g>
          );
        })}

        {/* Teaser text */}
        <g transform={`translate(${cx}, 1450)`} opacity={teaserOpacity * masterIn}>
          {teaserLines.map((line, i) => (
            <text key={`tl-${i}`} x="0" y={i * 85} textAnchor="middle" fontSize="56"
              fill={i === 0 ? COLORS.soft_white : COLORS.cool_silver} fontFamily="monospace" fontWeight="bold" opacity={0.9}>
              {line.text}
            </text>
          ))}
        </g>

        {/* Brand footer */}
        <g transform="translate(540, 1820)" opacity={masterIn * 0.7}>
          <text textAnchor="middle" fontSize="42" fill={COLORS.cool_silver} fontFamily="monospace" fontWeight="bold" letterSpacing="4">
            AI AGENTS: MODULES & TOOLS
          </text>
        </g>

        {/* Forward arrow */}
        <g transform={`translate(${cx}, 1550)`} opacity={forwardArrow * masterIn}>
          <polygon points="-40,-30 40,0 -40,30" fill={COLORS.electric_cyan}
            opacity="0.6" filter="url(#cyanGlow)" />
          <polygon points="0,-30 80,0 0,30" fill={COLORS.electric_cyan}
            opacity="0.3" filter="url(#softGlow)" />
          <text x="0" y="75" textAnchor="middle" fontSize="62" fill={COLORS.cool_silver}
            fontFamily="monospace" fontWeight="bold">NEXT →</text>
        </g>

        {/* Connecting trail from current to next */}
        <g opacity={trailProgress * masterIn}>
          <line x1={cx - 300} y1="1680" x2={cx + 300} y2="1680"
            stroke="url(#arrowGrad)" strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((di) => {
            const dx = cx - 300 + (di * 150) * trailProgress;
            return (
              <circle key={`td-${di}`} cx={dx} cy={1680} r="5"
                fill={COLORS.electric_cyan} opacity={0.4 * trailProgress} filter="url(#softGlow)" />
            );
          })}
        </g>

        {/* "Day 26 complete" small text */}
        <g transform={`translate(${cx}, 220)`} opacity={masterIn * 0.5}>
          <text x="0" y="0" textAnchor="middle" fontSize="42" fill={COLORS.cool_silver}
            fontFamily="monospace">Day 26: Observations ✓</text>
          <line x1="-150" y1="18" x2="150" y2="18"
            stroke={COLORS.cool_silver} strokeWidth="1" opacity="0.3" />
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

        {/* Bottom bar */}
        <rect x="0" y="1790" width="1080" height="130" fill={COLORS.deep_black} opacity="0.7" />
        <text x="540" y="1855" textAnchor="middle" fontSize="44" fill={COLORS.cool_silver}
          fontFamily="monospace" opacity={titleReveal}>
          Coming up next…
        </text>

        {/* Scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 80], [0, 1920], { extrapolateRight: 'extend' }) % 1920;
          return <line x1="0" y1={scanY} x2="1080" y2={scanY}
            stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.06" />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};
