/**
 * Scene23_KeyTakeaway.tsx — Day 26: Observations
 *
 * Key takeaway card. Central text: "OBSERVATIONS CLOSE THE LOOP" in bold.
 * Below: "Action → World → Observation → Agent". Decorative border with
 * glowing emphasis. Corner ornaments. Bullet points appearing one by one:
 * "Results of actions", "Fed back as input", "Enable adaptation".
 * Premium card design with elegant styling.
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

/* ── Bullet points ───────────────────────────────────────────────────── */
const bullets = [
  { text: 'Results of actions returned', icon: '→', delay: 20, color: COLORS.vibrant_green },
  { text: 'Fed back as new input', icon: '↻', delay: 28, color: COLORS.warm_blue },
  { text: 'Enable real-time adaptation', icon: '⚡', delay: 36, color: COLORS.amber },
  { text: 'Close the perception loop', icon: '◎', delay: 44, color: COLORS.purple },
];

/* ── Decorative particles ────────────────────────────────────────────── */
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: ((i * 151.7) % 1080),
  y: ((i * 203.3) % 1920),
  r: 0.5 + (i % 5) * 0.35,
  phase: (i * 0.95) % (Math.PI * 2),
  speed: 0.02 + (i % 6) * 0.005,
}));

/* ── Border ornament dots ────────────────────────────────────────────── */
const borderDots = Array.from({ length: 50 }, (_, i) => {
  const perimeter = 2 * (780 + 1060);
  const pos = (i / 50) * perimeter;
  let x: number, y: number;
  if (pos < 780) { x = 150 + pos; y = 340; }
  else if (pos < 780 + 1060) { x = 930; y = 340 + (pos - 780); }
  else if (pos < 2 * 780 + 1060) { x = 930 - (pos - 780 - 1060); y = 1400; }
  else { x = 150; y = 1400 - (pos - 2 * 780 - 1060); }
  return { id: i, x, y, delay: i * 0.6 };
});

/* ── Corner ornament lines ───────────────────────────────────────────── */
const cornerOrnaments = [
  { x: 100, y: 340, sx: 1, sy: 1 },
  { x: 980, y: 340, sx: -1, sy: 1 },
  { x: 980, y: 1540, sx: -1, sy: -1 },
  { x: 100, y: 1540, sx: 1, sy: -1 },
];

/* ── Glow rings behind card ──────────────────────────────────────────── */
const glowRings = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  r: 300 + i * 80,
  delay: 5 + i * 4,
}));

/* ── Flow arrow segments ─────────────────────────────────────────────── */
const flowSteps = [
  { label: 'Action', color: COLORS.amber },
  { label: 'World', color: COLORS.cool_silver },
  { label: 'Observation', color: COLORS.purple },
  { label: 'Agent', color: COLORS.electric_cyan },
];

/* ── Sparkle stars ───────────────────────────────────────────────────── */
const sparkles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 160 + ((i * 137) % 760),
  y: 350 + ((i * 193) % 1040),
  size: 2 + (i % 3) * 1.5,
  phase: (i * 1.2) % (Math.PI * 2),
}));

/* ── Circuit decorations ─────────────────────────────────────────────── */
const circuits = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x1: (i * 97) % 1080,
  y1: (i * 167) % 1920,
  len: 40 + (i % 4) * 25,
  horiz: i % 2 === 0,
}));

export const Scene23_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ─────────────────────────────────────────────── */
  const masterIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const cardScale = interpolate(frame, [0, 18], [0.9, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleReveal = interpolate(frame, [8, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const borderDraw = interpolate(frame, [3, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const glowIntensity = interpolate(frame, [0, 20, 40, 60], [4, 12, 4, 12], { extrapolateRight: 'extend' });
  const flowReveal = interpolate(frame, [14, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const subtitleY = interpolate(frame, [10, 22], [30, 0], { extrapolateRight: 'clamp', easing: ease });
  const sparkleOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' });
  const ornamentScale = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pulse = interpolate(frame, [0, 25, 50], [1, 1.02, 1], { extrapolateRight: 'extend' });

  const cx = 540;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.deep_black} stopOpacity="0.95" />
            <stop offset="50%" stopColor="#111118" stopOpacity="0.98" />
            <stop offset="100%" stopColor={COLORS.deep_black} stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="bgRadial" cx="50%" cy="46%" r="50%">
            <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.06" />
            <stop offset="100%" stopColor={COLORS.bg_black} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgRadial)" />

        {/* Circuit decorations */}
        {circuits.map((c) => {
          const o = interpolate(frame, [c.id * 2, c.id * 2 + 10], [0, 0.08], { extrapolateRight: 'clamp' });
          return (
            <line key={`ci-${c.id}`} x1={c.x1} y1={c.y1}
              x2={c.horiz ? c.x1 + c.len : c.x1}
              y2={c.horiz ? c.y1 : c.y1 + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" opacity={o * masterIn} />
          );
        })}

        {/* Background particles */}
        {particles.map((p) => {
          const py = p.y + Math.sin(frame * p.speed + p.phase) * 14;
          const px = p.x + Math.cos(frame * p.speed * 0.7 + p.phase) * 10;
          const o = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.06;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.cool_silver}
              opacity={o * masterIn} />
          );
        })}

        {/* Glow rings */}
        {glowRings.map((gr) => {
          const grO = interpolate(frame, [gr.delay, gr.delay + 12], [0, 0.06], { extrapolateRight: 'clamp' });
          return (
            <circle key={`gr-${gr.id}`} cx={cx} cy={940} r={gr.r * 1.2}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth="1"
              opacity={grO * masterIn} />
          );
        })}

        {/* Card background */}
        <g transform={`translate(${cx}, 940) scale(${cardScale * pulse * masterIn})`}>
          <rect x="-440" y="-600" width="880" height="1200" rx="32"
            fill="url(#cardGrad)" stroke={COLORS.electric_cyan} strokeWidth="3"
            opacity={borderDraw} />
        </g>

        {/* Border dots */}
        {borderDots.map((bd) => {
          const bdO = interpolate(frame, [3 + bd.delay, 8 + bd.delay], [0, 0.5], { extrapolateRight: 'clamp' });
          return (
            <circle key={`bd-${bd.id}`} cx={bd.x} cy={bd.y} r="2"
              fill={COLORS.electric_cyan} opacity={bdO * borderDraw * masterIn} />
          );
        })}

        {/* Corner ornaments */}
        {cornerOrnaments.map((co, i) => (
          <g key={`co-${i}`} transform={`translate(${co.x}, ${co.y}) scale(${co.sx * ornamentScale}, ${co.sy * ornamentScale})`}
            opacity={borderDraw * masterIn}>
            <line x1="0" y1="0" x2="50" y2="0" stroke={COLORS.electric_cyan} strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2="50" stroke={COLORS.electric_cyan} strokeWidth="2.5" />
            <line x1="0" y1="0" x2="30" y2="30" stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.4" />
            <circle cx="0" cy="0" r="4" fill={COLORS.electric_cyan} filter="url(#softGlow)" />
          </g>
        ))}

        {/* Main title */}
        <g transform={`translate(${cx}, 550)`} opacity={titleReveal * masterIn}>
          {'OBSERVATIONS'.split('').map((ch, i) => {
            const charO = interpolate(frame, [10 + i * 1.5, 15 + i * 1.5], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={`t1-${i}`} x={-315 + i * 54} y="0" textAnchor="middle" fontSize="68"
                fontWeight="900" fill={COLORS.electric_cyan} fontFamily="monospace"
                opacity={charO} filter="url(#textGlow)">
                {ch}
              </text>
            );
          })}
          <text x="0" y="90" textAnchor="middle" fontSize="62" fontWeight="900"
            fill={COLORS.soft_white} fontFamily="monospace" opacity={titleReveal}>
            CLOSE THE LOOP
          </text>
          {/* Underline */}
          <rect x={-300 * titleReveal} y={115} width={600 * titleReveal} height="6" rx="3"
            fill={COLORS.electric_cyan} filter="url(#softGlow)" />
        </g>

        {/* Flow diagram: Action → World → Observation → Agent */}
        <g transform={`translate(${cx}, 840)`} opacity={flowReveal * masterIn}>
          {flowSteps.map((fs, i) => {
            const fDelay = 16 + i * 4;
            const fO = interpolate(frame, [fDelay, fDelay + 8], [0, 1], { extrapolateRight: 'clamp' });
            const xPos = -390 + i * 260;
            return (
              <g key={`fs-${i}`}>
                <text x={xPos} y={subtitleY} textAnchor="middle" fontSize="52" fontWeight="bold"
                  fill={fs.color} fontFamily="monospace" opacity={fO}>
                  {fs.label[0]}
                </text>
                <text x={xPos} y={subtitleY + 60} textAnchor="middle" fontSize="38" fontWeight="bold"
                  fill={fs.color} fontFamily="monospace" opacity={fO * 0.8}>
                  {fs.label}
                </text>
                {i < flowSteps.length - 1 && (
                  <text x={xPos + 130} y={subtitleY + 30} textAnchor="middle" fontSize="56"
                    fill={COLORS.cool_silver} fontFamily="monospace" opacity={fO * 0.6}>
                    →
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Bullet points */}
        {bullets.map((b, i) => {
          const bO = interpolate(frame, [b.delay, b.delay + 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const bX = interpolate(frame, [b.delay, b.delay + 10], [-30, 0], { extrapolateRight: 'clamp', easing: ease });
          return (
            <g key={`b-${i}`} transform={`translate(540, ${1080 + i * 115})`} opacity={bO}>
              <g transform={`translate(${bX}, 0)`}>
                <rect x="-400" y="-45" width="800" height="90" rx="16" fill={COLORS.deep_black} fillOpacity="0.4"
                  stroke={b.color} strokeWidth="1" opacity="0.3" />
                <text x="-370" y="15" fontSize="48" fill={b.color} fontWeight="bold">{b.icon}</text>
                <text x="-310" y="15" fontSize="50" fill={COLORS.soft_white} fontFamily="monospace" fontWeight="bold">
                  {b.text}
                </text>
              </g>
            </g>
          );
        })}

        {/* Sparkle stars */}
        {sparkles.map((sp) => {
          const spO = (0.3 + Math.sin(frame * 0.08 + sp.phase) * 0.3) * sparkleOpacity;
          return (
            <g key={`sp-${sp.id}`} transform={`translate(${sp.x}, ${sp.y})`} opacity={spO * masterIn}>
              <line x1={-sp.size} y1="0" x2={sp.size} y2="0" stroke={COLORS.electric_cyan} strokeWidth="1" />
              <line x1="0" y1={-sp.size} x2="0" y2={sp.size} stroke={COLORS.electric_cyan} strokeWidth="1" />
            </g>
          );
        })}

        {/* Decorative divider */}
        <g transform={`translate(${cx}, 840)`} opacity={flowReveal * masterIn}>
          <line x1="-320" y1="0" x2="-40" y2="0" stroke={COLORS.cool_silver} strokeWidth="1" opacity="0.3" />
          <circle cx="0" cy="0" r="5" fill={COLORS.electric_cyan} />
          <line x1="40" y1="0" x2="320" y2="0" stroke={COLORS.cool_silver} strokeWidth="1" opacity="0.3" />
        </g>

        {/* Summary text at bottom */}
        <g transform={`translate(${cx}, 1450)`} opacity={interpolate(frame, [45, 55], [0, 1], { extrapolateRight: 'clamp' }) * masterIn}>
          <rect x="-380" y="-45" width="760" height="90" rx="18"
            fill={COLORS.deep_black} stroke={COLORS.cool_silver} strokeWidth="1.5" opacity="0.5" />
          <text x="0" y="12" textAnchor="middle" fontSize="42" fill={COLORS.cool_silver}
            fontFamily="monospace">
            Every loop needs feedback to keep turning
          </text>
        </g>

        {/* Title header */}
        <text x={cx} y="220" textAnchor="middle" fontSize="56" fontWeight="bold"
          fill={COLORS.cool_silver} fontFamily="monospace" opacity={masterIn * 0.6}>
          KEY TAKEAWAY
        </text>

        {/* Bottom bar */}
        <rect x="0" y="1790" width="1080" height="130" fill={COLORS.deep_black} opacity="0.7" />
        <text x="540" y="1855" textAnchor="middle" fontSize="44" fill={COLORS.cool_silver}
          fontFamily="monospace" opacity={titleReveal}>
          Day 26 — Observations
        </text>

        {/* Bottom brand */}
        <g transform="translate(540, 1820)" opacity={masterIn * 0.8}>
          <text textAnchor="middle" fontSize="42" fill={COLORS.cool_silver} fontFamily="monospace" fontWeight="bold" letterSpacing="4">
            AI AGENTS: THE COMPLETE LOOP
          </text>
        </g>

        {/* Scan line */}
        {(() => {
          const scanY = interpolate(frame, [0, 90], [0, 1920], { extrapolateRight: 'extend' }) % 1920;
          return <line x1="0" y1={scanY} x2="1080" y2={scanY}
            stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.05" />;
        })()}
      </svg>
    </AbsoluteFill>
  );
};
