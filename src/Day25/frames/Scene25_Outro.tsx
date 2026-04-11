/**
 * Scene 25 — Outro
 * "DAY 25" dissolving particles, social CTA, series branding.
 * Premium cinematic ending with particle dissolution.
 * Duration: 50 frames (~1.67s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  BlackBackground, CaptionBar, GlobalDefs, CornerBrackets,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;
const CY = 700;

// ── "DAY 25" text particles ─────────────────────────────────────────────
// Simulated character positions for dissolution effect
const DAY_CHARS = [
  { char: 'D', x: CX - 200, y: CY - 60 },
  { char: 'A', x: CX - 100, y: CY - 60 },
  { char: 'Y', x: CX, y: CY - 60 },
  { char: '2', x: CX + 80, y: CY - 60 },
  { char: '5', x: CX + 170, y: CY - 60 },
];

// ── Dissolving particles per character ───────────────────────────────────
const DISSOLVE_PARTICLES = DAY_CHARS.flatMap((ch, ci) =>
  Array.from({ length: 18 }, (_, pi) => {
    const angle = (pi / 18) * Math.PI * 2 + ci * 0.5;
    const speed = 40 + (pi % 5) * 20;
    return {
      startX: ch.x,
      startY: ch.y,
      angle,
      speed,
      size: 2 + (pi % 4) * 1.2,
      delay: 30 + ci * 1.5 + (pi % 3) * 0.5,
      color: pi % 3 === 0 ? COLORS.electric_cyan
        : pi % 3 === 1 ? COLORS.warm_blue : COLORS.cool_silver,
    };
  })
);

// ── Background star-like particles ───────────────────────────────────────
const STAR_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 137.7 + 30) % 1080,
  y: (i * 197.3 + 50) % 1920,
  r: 0.5 + (i % 4) * 0.5,
  phase: i * 0.31,
  twinkleSpeed: 0.04 + (i % 5) * 0.01,
}));

// ── Glowing rings (cinematic) ────────────────────────────────────────────
const GLOW_RINGS = Array.from({ length: 6 }, (_, i) => ({
  r: 180 + i * 60,
  delay: 4 + i * 2,
  strokeW: 1.5 - i * 0.2,
}));

// ── Social CTA elements ─────────────────────────────────────────────────
const CTA_Y = CY + 250;
const CTA_ITEMS = [
  { icon: '♥', label: 'LIKE', x: CX - 200, delay: 16 },
  { icon: '↗', label: 'SHARE', x: CX, delay: 18 },
  { icon: '🔔', label: 'FOLLOW', x: CX + 200, delay: 20 },
];

// ── Series branding ──────────────────────────────────────────────────────
const SERIES_Y = CY + 400;

// ── Accent lines (cinematic bars) ────────────────────────────────────────
const CINE_BARS = [
  { y: 100, delay: 2, w: 600 },
  { y: 1820, delay: 2, w: 600 },
];

// ── Corner decorative elements ───────────────────────────────────────────
const CORNER_GLOWS = [
  { x: 80, y: 160, delay: 6 },
  { x: 1000, y: 160, delay: 8 },
  { x: 80, y: 1760, delay: 10 },
  { x: 1000, y: 1760, delay: 12 },
];

// ── Orbit ring dots ──────────────────────────────────────────────────────
const ORBIT_DOTS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  r: 160,
  size: 3,
  delay: 8 + i * 1,
}));

// ── Vertical timeline marks ──────────────────────────────────────────────
const TIMELINE_MARKS = Array.from({ length: 25 }, (_, i) => ({
  y: 200 + i * 60,
  isDay25: i === 24,
  delay: 4 + i * 0.3,
}));

// ── "Actions" topic recap ────────────────────────────────────────────────
const TOPIC_Y = CY - 200;

// ── Pulse rings for DAY text ─────────────────────────────────────────────
const TEXT_PULSE_RINGS = Array.from({ length: 3 }, (_, i) => ({
  r: 250 + i * 40,
  delay: 6 + i * 3,
}));

// ── Floating motes ───────────────────────────────────────────────────────
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  startX: CX + ((i * 73 + 11) % 400) - 200,
  startY: CY + ((i * 91 + 17) % 300) - 150,
  driftX: ((i * 37 + 7) % 40) - 20,
  driftY: -30 - (i % 5) * 15,
  size: 1.5 + (i % 3) * 1,
  phase: i * 0.4,
  delay: 26 + (i % 6) * 1.5,
}));

// ── Subtitle text ────────────────────────────────────────────────────────
const SUBTITLE_Y = CY + 30;

// ── Progress bar (25/30 days) ────────────────────────────────────────────
const PROGRESS_BAR_Y = CY + 140;
const PROGRESS_W = 400;
const PROGRESS_H = 8;
const PROGRESS_FILL = 25 / 30;

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene25_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame * 0.12) * 0.5 + 0.5;

  // ── DAY 25 text visibility (solid then dissolving) ─────────────────────
  const textSolid = interpolate(frame, [4, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const dissolveStart = 30;
  const dissolveProgress = interpolate(frame, [dissolveStart, dissolveStart + 15], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const textOp = textSolid * (1 - dissolveProgress);

  return (
    <AbsoluteFill>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="dayGlow25" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="18" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow25" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="centerAura25" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.08" />
              <stop offset="60%" stopColor={COLORS.electric_cyan} stopOpacity="0.02" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="progressGrad25" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.warm_blue} />
              <stop offset="100%" stopColor={COLORS.electric_cyan} />
            </linearGradient>
            <linearGradient id="cineBar25" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
              <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="0.4" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.2} />

          {/* ── Star particles ── */}
          {STAR_PARTICLES.map((sp, i) => {
            const spOp = Math.sin(frame * sp.twinkleSpeed + sp.phase) * 0.3 + 0.3;
            return (
              <circle key={`sp${i}`} cx={sp.x} cy={sp.y} r={sp.r}
                fill={COLORS.cool_silver} opacity={enter * spOp * 0.15} />
            );
          })}

          {/* ── Cinematic bars ── */}
          {CINE_BARS.map((cb, i) => {
            const cbOp = interpolate(frame, [cb.delay, cb.delay + 6], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <rect key={`cb${i}`} x={CX - cb.w / 2} y={cb.y - 1}
                width={cb.w} height={2} rx={1}
                fill="url(#cineBar25)" opacity={cbOp * 0.5} />
            );
          })}

          {/* ── Center aura ── */}
          <circle cx={CX} cy={CY} r={400}
            fill="url(#centerAura25)" opacity={enter} />

          {/* ── Glow rings ── */}
          {GLOW_RINGS.map((gr, i) => {
            const grOp = interpolate(frame, [gr.delay, gr.delay + 6], [0, 0.08],
              { extrapolateRight: 'clamp' });
            return (
              <circle key={`gr${i}`} cx={CX} cy={CY} r={gr.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={gr.strokeW} opacity={grOp * pulse}
                strokeDasharray="4 10" />
            );
          })}

          {/* ── Text pulse rings ── */}
          {TEXT_PULSE_RINGS.map((tpr, i) => {
            const tprOp = interpolate(frame, [tpr.delay, tpr.delay + 8], [0.1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const tprScale = interpolate(frame, [tpr.delay, tpr.delay + 8], [0.8, 1.3],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <circle key={`tpr${i}`} cx={CX} cy={CY - 60} r={tpr.r * tprScale}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={1.5} opacity={tprOp} />
            );
          })}

          {/* ── Orbit dots ── */}
          {ORBIT_DOTS.map((od, i) => {
            const odOp = interpolate(frame, [od.delay, od.delay + 4], [0, 0.4],
              { extrapolateRight: 'clamp' });
            const angle = od.angle + frame * 0.03;
            const ox = CX + Math.cos(angle) * od.r;
            const oy = CY - 60 + Math.sin(angle) * od.r;
            return (
              <circle key={`od${i}`} cx={ox} cy={oy} r={od.size}
                fill={COLORS.electric_cyan} opacity={odOp * pulse} />
            );
          })}

          {/* ── Corner glows ── */}
          {CORNER_GLOWS.map((cg, i) => {
            const cgOp = interpolate(frame, [cg.delay, cg.delay + 5], [0, 0.15],
              { extrapolateRight: 'clamp' });
            return (
              <circle key={`cg${i}`} cx={cg.x} cy={cg.y} r={30}
                fill={COLORS.electric_cyan} opacity={cgOp * pulse} />
            );
          })}

          {/* ── Topic text ── */}
          <text x={CX} y={TOPIC_Y} textAnchor="middle"
            fontFamily="SF Mono, Menlo, monospace"
            fontSize={16} fontWeight={600} letterSpacing={6}
            fill={COLORS.electric_cyan}
            opacity={interpolate(frame, [4, 10], [0, 0.5], { extrapolateRight: 'clamp' })}>
            ACTIONS
          </text>

          {/* ═══════════════ DAY 25 TEXT ═══════════════ */}
          <g opacity={textOp}>
            {DAY_CHARS.map((ch, i) => {
              const charDelay = 4 + i * 1;
              const charOp = interpolate(frame, [charDelay, charDelay + 4], [0, 1],
                { extrapolateRight: 'clamp', easing: ease });
              const charScale = interpolate(frame, [charDelay, charDelay + 4], [0.7, 1],
                { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={`ch${i}`} opacity={charOp}
                  transform={`translate(${ch.x}, ${ch.y}) scale(${charScale})`}>
                  <text textAnchor="middle" y={20}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={80} fontWeight={900} letterSpacing={4}
                    fill={COLORS.electric_cyan}
                    filter="url(#dayGlow25)">
                    {ch.char}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Dissolving particles ── */}
          {DISSOLVE_PARTICLES.map((dp, i) => {
            const dpT = interpolate(frame, [dp.delay, dp.delay + 12], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            const dpX = dp.startX + Math.cos(dp.angle) * dp.speed * dpT;
            const dpY = dp.startY + Math.sin(dp.angle) * dp.speed * dpT - 20 * dpT;
            const dpOp = dpT > 0 ? (1 - dpT) * 0.7 : 0;
            return (
              <circle key={`dp${i}`} cx={dpX} cy={dpY} r={dp.size * (1 - dpT * 0.5)}
                fill={dp.color} opacity={dpOp} />
            );
          })}

          {/* ── Floating motes (after dissolve) ── */}
          {MOTES.map((m, i) => {
            const mT = interpolate(frame, [m.delay, m.delay + 15], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const mx = m.startX + m.driftX * mT;
            const my = m.startY + m.driftY * mT;
            const mOp = mT > 0 && mT < 0.9 ? Math.sin(mT * Math.PI) * 0.4 : 0;
            return (
              <circle key={`m${i}`} cx={mx} cy={my} r={m.size}
                fill={COLORS.electric_cyan} opacity={mOp} />
            );
          })}

          {/* ── Subtitle ── */}
          <text x={CX} y={SUBTITLE_Y} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={18} fontWeight={500} letterSpacing={4}
            fill={COLORS.cool_silver}
            opacity={interpolate(frame, [10, 18], [0, 0.6], { extrapolateRight: 'clamp' })}>
            AGENTIC AI FROM FIRST PRINCIPLES
          </text>

          {/* ── Progress bar ── */}
          <g opacity={interpolate(frame, [12, 20], [0, 0.8], { extrapolateRight: 'clamp', easing: ease })}>
            <rect x={CX - PROGRESS_W / 2} y={PROGRESS_BAR_Y}
              width={PROGRESS_W} height={PROGRESS_H}
              rx={4} fill="#1A1A2E" stroke={COLORS.cool_silver}
              strokeWidth={0.5} opacity={0.4} />
            <rect x={CX - PROGRESS_W / 2 + 1} y={PROGRESS_BAR_Y + 1}
              width={(PROGRESS_W - 2) * interpolate(frame, [14, 24], [0, PROGRESS_FILL],
                { extrapolateRight: 'clamp', easing: ease })}
              height={PROGRESS_H - 2}
              rx={3} fill="url(#progressGrad25)" opacity={0.8} />
            <text x={CX} y={PROGRESS_BAR_Y + 28} textAnchor="middle"
              fontFamily="SF Mono, Menlo, monospace"
              fontSize={10} fontWeight={600} letterSpacing={2}
              fill={COLORS.cool_silver} opacity={0.4}>
              25 / 30 DAYS
            </text>
          </g>

          {/* ═══════════════ SOCIAL CTA ═══════════════ */}
          {CTA_ITEMS.map((cta, i) => {
            const ctaOp = interpolate(frame, [cta.delay, cta.delay + 5], [0, 0.85],
              { extrapolateRight: 'clamp', easing: ease });
            const ctaScale = interpolate(frame, [cta.delay, cta.delay + 5], [0.8, 1],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={`cta${i}`} opacity={ctaOp}
                transform={`translate(${cta.x}, ${CTA_Y}) scale(${ctaScale})`}>
                {/* Circle bg */}
                <circle cx={0} cy={0} r={32}
                  fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
                  strokeWidth={1.5} />
                {/* Icon */}
                <text textAnchor="middle" y={8}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={22} fill={COLORS.electric_cyan}>
                  {cta.icon}
                </text>
                {/* Label */}
                <text textAnchor="middle" y={52}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={11} fontWeight={700} letterSpacing={2}
                  fill={COLORS.cool_silver} opacity={0.6}>
                  {cta.label}
                </text>
              </g>
            );
          })}

          {/* ── Series branding ── */}
          <g opacity={interpolate(frame, [22, 30], [0, 0.7], { extrapolateRight: 'clamp', easing: ease })}>
            <text x={CX} y={SERIES_Y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={14} fontWeight={600} letterSpacing={4}
              fill={COLORS.cool_silver} opacity={0.5}>
              LEARNING AGENTIC AI
            </text>
            <text x={CX} y={SERIES_Y + 30} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={11} fontWeight={500} letterSpacing={3}
              fill={COLORS.cool_silver} opacity={0.3}>
              FROM FIRST PRINCIPLES
            </text>
            {/* Underline */}
            <rect x={CX - 100} y={SERIES_Y + 44} width={200} height={1}
              fill={COLORS.electric_cyan} opacity={0.15} rx={0.5} />
          </g>

          {/* ── Timeline marks (left side) ── */}
          <g opacity={enter * 0.15}>
            {TIMELINE_MARKS.map((tm, i) => {
              const tmOp = interpolate(frame, [tm.delay, tm.delay + 2], [0, 1],
                { extrapolateRight: 'clamp' });
              return (
                <g key={`tm${i}`} opacity={tmOp}>
                  <rect x={45} y={tm.y} width={tm.isDay25 ? 16 : 8} height={2}
                    rx={1} fill={tm.isDay25 ? COLORS.electric_cyan : COLORS.cool_silver}
                    opacity={tm.isDay25 ? 0.8 : 0.3} />
                </g>
              );
            })}
          </g>

          {/* ── Final fade-out overlay ── */}
          <rect x={0} y={0} width={1080} height={1920}
            fill={COLORS.deep_black}
            opacity={interpolate(frame, [42, 50], [0, 0.6],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Day 25 — Actions. See you tomorrow!"
            opacity={captionOp * (1 - interpolate(frame, [40, 48], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
          />
        </svg>
      </BlackBackground>
    </AbsoluteFill>
  );
};
