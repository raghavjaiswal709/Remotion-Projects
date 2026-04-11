/**
 * Scene 22 — Powerful Actions
 * "Powerful actions = Powerful agents" equation visual.
 * Scaling comparison: bright (powerful) vs dim (weak).
 * Duration: 30 frames (~1s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;
const COMPARE_Y = 600;
const WEAK_X = 280;
const STRONG_X = 800;
const BOX_W = 360;
const BOX_H = 520;

// ── Weak side actions ────────────────────────────────────────────────────
interface ActionItem {
  label: string;
  icon: string;
  y: number;
}

const WEAK_ACTIONS: ActionItem[] = [
  { label: 'Basic text output', icon: '📝', y: 0 },
  { label: 'Simple lookup', icon: '🔎', y: 55 },
  { label: 'Static response', icon: '💬', y: 110 },
];

const STRONG_ACTIONS: ActionItem[] = [
  { label: 'API integration', icon: '🌐', y: 0 },
  { label: 'Code execution', icon: '⚡', y: 55 },
  { label: 'Database queries', icon: '💾', y: 110 },
  { label: 'File operations', icon: '📂', y: 165 },
  { label: 'Web navigation', icon: '🧭', y: 220 },
  { label: 'Message sending', icon: '📡', y: 275 },
];

// ── Power meter bars ─────────────────────────────────────────────────────
const WEAK_POWER = 0.25;
const STRONG_POWER = 0.95;
const METER_W = 200;
const METER_H = 12;
const METER_Y_OFFSET = 180;

// ── Equation elements ────────────────────────────────────────────────────
const EQ_Y = 320;

// ── Radiance rays (strong side) ──────────────────────────────────────────
const RADIANCE_RAYS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  innerR: 60,
  outerR: 120 + (i % 3) * 25,
  delay: 6 + i * 0.4,
}));

// ── Dim particles (weak side) ────────────────────────────────────────────
const DIM_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  x: WEAK_X + ((i * 43 + 7) % 200) - 100,
  y: COMPARE_Y + ((i * 59 + 13) % 200) - 100,
  r: 2 + (i % 2),
  phase: i * 0.5,
}));

// ── Glow particles (strong side) ─────────────────────────────────────────
const GLOW_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: STRONG_X + ((i * 47 + 11) % 240) - 120,
  y: COMPARE_Y + ((i * 61 + 17) % 240) - 120,
  r: 2 + (i % 3),
  phase: i * 0.4,
}));

// ── Floating background particles ────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 151.7 + 35) % 1080,
  y: (i * 207.3 + 55) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.37,
}));

// ── Scale indicator (visual weight) ──────────────────────────────────────
const SCALE_Y = COMPARE_Y + BOX_H / 2 + 40;

// ── Status dots per action ───────────────────────────────────────────────
const weakDotColor = '#4B5563';
const strongDotColor = COLORS.vibrant_green;

// ── Decorative circuit traces ────────────────────────────────────────────
const CIRCUIT_TRACES = Array.from({ length: 6 }, (_, i) => ({
  x1: STRONG_X - 140 + (i % 3) * 90,
  y1: COMPARE_Y - 180 + i * 50,
  x2: STRONG_X - 100 + (i % 3) * 90,
  y2: COMPARE_Y - 150 + i * 50,
  delay: 10 + i * 0.6,
}));

// ── Power comparison labels ──────────────────────────────────────────────
const POWER_LABELS = [
  { x: WEAK_X, y: COMPARE_Y - BOX_H / 2 - 40, text: 'WEAK ACTIONS', color: '#6B7280' },
  { x: STRONG_X, y: COMPARE_Y - BOX_H / 2 - 40, text: 'POWERFUL ACTIONS', color: COLORS.electric_cyan },
];

// ── Agent result labels ──────────────────────────────────────────────────
const RESULT_LABELS = [
  { x: WEAK_X, text: 'WEAK AGENT', color: '#6B7280', icon: '😐' },
  { x: STRONG_X, text: 'POWERFUL AGENT', color: COLORS.electric_cyan, icon: '🤖' },
];

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene22_PowerfulActions: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;
  const strongGlow = 0.6 + pulse * 0.4;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="strongGlow22" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.4" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dimFilter22" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="weakBg22" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="strongBg22" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D1F3C" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0A1628" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="strongAura22" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.12" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="meterGrad22" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.electric_cyan} />
              <stop offset="100%" stopColor={COLORS.vibrant_green} />
            </linearGradient>
            <linearGradient id="meterWeakGrad22" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const pOp = Math.sin(frame * 0.04 + p.phase) * 0.15 + 0.2;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pOp * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="POWERFUL ACTIONS" fontSize={28}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          {/* ═══════════════ EQUATION ═══════════════ */}
          <g opacity={interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease })}>
            {/* Equation text */}
            <text x={CX} y={EQ_Y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={28} fontWeight={800} letterSpacing={2}
              fill={COLORS.electric_cyan}>
              POWERFUL ACTIONS
            </text>
            <text x={CX} y={EQ_Y + 40} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={24} fontWeight={700} letterSpacing={2}
              fill={COLORS.cool_silver} opacity={0.7}>
              = POWERFUL AGENTS
            </text>

            {/* Equals sign decoration */}
            <rect x={CX - 60} y={EQ_Y + 15} width={120} height={2}
              fill={COLORS.electric_cyan} opacity={0.3} rx={1} />
          </g>

          {/* ── Power labels ── */}
          {POWER_LABELS.map((pl, i) => (
            <text key={`pl${i}`} x={pl.x} y={pl.y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={800} letterSpacing={3}
              fill={pl.color} opacity={enter * 0.7}>
              {pl.text}
            </text>
          ))}

          {/* ═══════════════ WEAK SIDE (LEFT) ═══════════════ */}
          <g opacity={enter} filter="url(#dimFilter22)">
            {/* Box */}
            <rect x={WEAK_X - BOX_W / 2} y={COMPARE_Y - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={14}
              fill="url(#weakBg22)" stroke="#4B5563" strokeWidth={1} />

            {/* Dim overlay */}
            <rect x={WEAK_X - BOX_W / 2} y={COMPARE_Y - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={14}
              fill="#0D0D0D" opacity={0.25} />

            {/* Dim particles */}
            {DIM_PARTICLES.map((dp, i) => {
              const dpOp = Math.sin(frame * 0.03 + dp.phase) * 0.08 + 0.1;
              return (
                <circle key={`dp${i}`} cx={dp.x} cy={dp.y} r={dp.r}
                  fill="#6B7280" opacity={dpOp} />
              );
            })}

            {/* Weak icon */}
            <text x={WEAK_X} y={COMPARE_Y - BOX_H / 2 + 60} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={40} opacity={0.4}>
              😐
            </text>

            {/* Weak actions list */}
            {WEAK_ACTIONS.map((wa, i) => {
              const waOp = interpolate(frame, [4 + i * 2, 7 + i * 2], [0, 0.5],
                { extrapolateRight: 'clamp' });
              return (
                <g key={`wa${i}`} opacity={waOp}>
                  <text x={WEAK_X - 80} y={COMPARE_Y - 60 + wa.y}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={14} fill="#9CA3AF">
                    {wa.icon}
                  </text>
                  <text x={WEAK_X - 55} y={COMPARE_Y - 60 + wa.y}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={12} fontWeight={500} fill="#6B7280">
                    {wa.label}
                  </text>
                  <circle cx={WEAK_X + BOX_W / 2 - 30}
                    cy={COMPARE_Y - 64 + wa.y} r={4}
                    fill={weakDotColor} opacity={0.5} />
                </g>
              );
            })}

            {/* Power meter (weak) */}
            <g transform={`translate(${WEAK_X - METER_W / 2}, ${COMPARE_Y + METER_Y_OFFSET})`}>
              <rect x={0} y={0} width={METER_W} height={METER_H}
                rx={6} fill="#1A1A1A" stroke="#4B5563" strokeWidth={0.8} />
              <rect x={1} y={1} width={(METER_W - 2) * WEAK_POWER} height={METER_H - 2}
                rx={5} fill="url(#meterWeakGrad22)" opacity={0.6} />
              <text x={METER_W + 15} y={METER_H - 1}
                fontFamily="SF Mono, Menlo, monospace"
                fontSize={10} fontWeight={700} fill="#6B7280">
                25%
              </text>
            </g>
          </g>

          {/* ═══════════════ STRONG SIDE (RIGHT) ═══════════════ */}
          <g opacity={enter}>
            {/* Strong aura */}
            <circle cx={STRONG_X} cy={COMPARE_Y} r={300}
              fill="url(#strongAura22)" opacity={strongGlow} />

            {/* Box */}
            <rect x={STRONG_X - BOX_W / 2} y={COMPARE_Y - BOX_H / 2}
              width={BOX_W} height={BOX_H} rx={14}
              fill="url(#strongBg22)" stroke={COLORS.electric_cyan}
              strokeWidth={1.5} />

            {/* Radiance rays */}
            {RADIANCE_RAYS.map((ray, i) => {
              const rayOp = interpolate(frame, [ray.delay, ray.delay + 4], [0, 0.2],
                { extrapolateRight: 'clamp' });
              const ix = STRONG_X + Math.cos(ray.angle) * ray.innerR;
              const iy = (COMPARE_Y - BOX_H / 2 + 50) + Math.sin(ray.angle) * ray.innerR;
              const ox = STRONG_X + Math.cos(ray.angle) * ray.outerR;
              const oy = (COMPARE_Y - BOX_H / 2 + 50) + Math.sin(ray.angle) * ray.outerR;
              return (
                <line key={`ray${i}`} x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke={COLORS.electric_cyan} strokeWidth={1}
                  strokeLinecap="round" opacity={rayOp * pulse} />
              );
            })}

            {/* Glow particles */}
            {GLOW_PARTICLES.map((gp, i) => {
              const gpOp = Math.sin(frame * 0.06 + gp.phase) * 0.2 + 0.25;
              return (
                <circle key={`gp${i}`} cx={gp.x} cy={gp.y} r={gp.r}
                  fill={COLORS.electric_cyan} opacity={gpOp * enter} />
              );
            })}

            {/* Strong icon */}
            <text x={STRONG_X} y={COMPARE_Y - BOX_H / 2 + 60} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={40} opacity={strongGlow}
              filter="url(#strongGlow22)">
              🤖
            </text>

            {/* Strong actions list */}
            {STRONG_ACTIONS.map((sa, i) => {
              const saOp = interpolate(frame, [4 + i * 1.5, 7 + i * 1.5], [0, 0.9],
                { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={`sa${i}`} opacity={saOp}>
                  <text x={STRONG_X - 90} y={COMPARE_Y - 60 + sa.y}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={14} fill={COLORS.bg_paper}>
                    {sa.icon}
                  </text>
                  <text x={STRONG_X - 65} y={COMPARE_Y - 60 + sa.y}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={12} fontWeight={600} fill={COLORS.electric_cyan}>
                    {sa.label}
                  </text>
                  <circle cx={STRONG_X + BOX_W / 2 - 30}
                    cy={COMPARE_Y - 64 + sa.y} r={4}
                    fill={strongDotColor} opacity={0.7 + pulse * 0.2} />
                </g>
              );
            })}

            {/* Circuit traces */}
            {CIRCUIT_TRACES.map((ct, i) => {
              const ctOp = interpolate(frame, [ct.delay, ct.delay + 3], [0, 0.15],
                { extrapolateRight: 'clamp' });
              return (
                <line key={`ct${i}`} x1={ct.x1} y1={ct.y1} x2={ct.x2} y2={ct.y2}
                  stroke={COLORS.electric_cyan} strokeWidth={0.8} opacity={ctOp} />
              );
            })}

            {/* Power meter (strong) */}
            <g transform={`translate(${STRONG_X - METER_W / 2}, ${COMPARE_Y + METER_Y_OFFSET})`}>
              <rect x={0} y={0} width={METER_W} height={METER_H}
                rx={6} fill="#0D1A2E" stroke={COLORS.electric_cyan} strokeWidth={0.8} />
              <rect x={1} y={1}
                width={(METER_W - 2) * interpolate(frame, [8, 18], [0, STRONG_POWER],
                  { extrapolateRight: 'clamp', easing: ease })}
                height={METER_H - 2}
                rx={5} fill="url(#meterGrad22)" opacity={0.85} />
              <text x={METER_W + 15} y={METER_H - 1}
                fontFamily="SF Mono, Menlo, monospace"
                fontSize={10} fontWeight={700} fill={COLORS.electric_cyan}>
                95%
              </text>
            </g>
          </g>

          {/* ── VS divider ── */}
          <g opacity={enter}>
            <line x1={CX} y1={COMPARE_Y - BOX_H / 2 + 20}
              x2={CX} y2={COMPARE_Y + BOX_H / 2 - 20}
              stroke={COLORS.cool_silver} strokeWidth={1}
              strokeDasharray="4 8" opacity={0.15} />
            <circle cx={CX} cy={COMPARE_Y} r={22}
              fill={COLORS.deep_black} stroke={COLORS.cool_silver}
              strokeWidth={1.2} opacity={0.8} />
            <text x={CX} y={COMPARE_Y + 6} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={13} fontWeight={800} letterSpacing={2}
              fill={COLORS.cool_silver}>
              VS
            </text>
          </g>

          {/* ── Result labels ── */}
          {RESULT_LABELS.map((rl, i) => {
            const rlOp = interpolate(frame, [20 + i * 3, 25 + i * 3], [0, 0.8],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={`rl${i}`} opacity={rlOp}>
                <text x={rl.x} y={SCALE_Y + 20} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={14} fontWeight={700} letterSpacing={2}
                  fill={rl.color}>
                  = {rl.text}
                </text>
              </g>
            );
          })}

          {/* ── Caption ── */}
          <CaptionBar
            text="Powerful actions make powerful agents."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
