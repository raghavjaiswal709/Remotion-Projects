/**
 * Scene 17 — Action vs Thought
 * Comparison: Left = Thought (internal, no effect)
 *             Right = Action (external, changes world)
 * Split screen visualization.
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
const HALF_W = 540;
const LEFT_CX = 270;
const RIGHT_CX = 810;
const CENTER_Y = 700;

// ── Left side: Thought ───────────────────────────────────────────────────
const THOUGHT_BUBBLES = Array.from({ length: 8 }, (_, i) => ({
  x: LEFT_CX + ((i * 31 + 5) % 200) - 100,
  y: CENTER_Y + ((i * 47 + 11) % 180) - 90,
  rx: 30 + (i % 4) * 12,
  ry: 20 + (i % 3) * 8,
  delay: 3 + i * 1.5,
  content: ['idea?', 'maybe...', 'think', 'hmm', 'plan', 'consider', 'what if', '...'][i],
  opacity: 0.2 + (i % 3) * 0.1,
}));

// ── Thought brain arcs ───────────────────────────────────────────────────
const THOUGHT_ARCS = Array.from({ length: 6 }, (_, i) => ({
  r: 25 + i * 12,
  startAngle: i * 55,
  sweep: 80 + (i % 3) * 25,
  strokeW: 2 - i * 0.2,
}));

// ── Left side properties ─────────────────────────────────────────────────
interface PropertyRow {
  label: string;
  value: string;
  color: string;
  delay: number;
}

const THOUGHT_PROPS: PropertyRow[] = [
  { label: 'LOCATION', value: 'Internal', color: '#9CA3AF', delay: 6 },
  { label: 'EFFECT', value: 'None', color: COLORS.vibrant_red, delay: 8 },
  { label: 'VISIBLE', value: 'No', color: '#9CA3AF', delay: 10 },
  { label: 'CHANGES WORLD', value: '✗', color: COLORS.vibrant_red, delay: 12 },
  { label: 'OUTPUT', value: 'Nothing', color: '#6B7280', delay: 14 },
];

// ── Right side: Action ───────────────────────────────────────────────────
const ACTION_RAYS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return {
    angle,
    innerR: 50,
    outerR: 90 + (i % 3) * 20,
    delay: 4 + i * 1.2,
    strokeW: 2 + (i % 2),
  };
});

const ACTION_PROPS: PropertyRow[] = [
  { label: 'LOCATION', value: 'External', color: COLORS.electric_cyan, delay: 6 },
  { label: 'EFFECT', value: 'Real Change', color: COLORS.vibrant_green, delay: 8 },
  { label: 'VISIBLE', value: 'Yes', color: COLORS.electric_cyan, delay: 10 },
  { label: 'CHANGES WORLD', value: '✓', color: COLORS.vibrant_green, delay: 12 },
  { label: 'OUTPUT', value: 'Result', color: COLORS.electric_cyan, delay: 14 },
];

// ── Right side impact ripples ────────────────────────────────────────────
const IMPACT_RIPPLES = Array.from({ length: 5 }, (_, i) => ({
  r: 60 + i * 25,
  delay: 8 + i * 2,
}));

// ── Action target indicators ─────────────────────────────────────────────
const ACTION_TARGETS = [
  { x: RIGHT_CX - 80, y: CENTER_Y - 100, icon: '📁', label: 'FILE', delay: 10 },
  { x: RIGHT_CX + 80, y: CENTER_Y - 80, icon: '🌐', label: 'WEB', delay: 12 },
  { x: RIGHT_CX - 70, y: CENTER_Y + 80, icon: '💾', label: 'DB', delay: 14 },
  { x: RIGHT_CX + 90, y: CENTER_Y + 70, icon: '📧', label: 'MSG', delay: 16 },
];

// ── Particles ────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 159.3 + 35) % 1080,
  y: (i * 203.7 + 55) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.37,
}));

// ── VS badge ─────────────────────────────────────────────────────────────
const VS_Y = CENTER_Y;

// ── Property list layout ─────────────────────────────────────────────────
const PROPS_TOP = CENTER_Y + 170;
const PROP_ROW_H = 44;
const PROP_W = 380;

// ── "No effect" indicators (left side — faded) ──────────────────────────
const NO_EFFECT_LINES = Array.from({ length: 3 }, (_, i) => ({
  y: CENTER_Y - 40 + i * 40,
  delay: 10 + i * 2,
}));

// ── Floating arrows on right side (outward) ──────────────────────────────
const OUTWARD_ARROWS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2;
  return {
    angle,
    r: 110,
    delay: 6 + i * 1.5,
  };
});

export const Scene17_ActionVsThought: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const splitEnter = interpolate(frame, [2, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = 0.5 + Math.sin(frame * 0.15) * 0.2;
  const thoughtSpin = frame * 1.5;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="actionGlow17">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.4" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dimFilter17">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="splitLine17" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cool_silver} stopOpacity="0" />
              <stop offset="30%" stopColor={COLORS.cool_silver} stopOpacity="0.3" />
              <stop offset="70%" stopColor={COLORS.cool_silver} stopOpacity="0.3" />
              <stop offset="100%" stopColor={COLORS.cool_silver} stopOpacity="0" />
            </linearGradient>
            <radialGradient id="actionAura17" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.12" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="thoughtAura17" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.04 + p.phase) * 0.2 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.03} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="THOUGHT vs ACTION" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Split line (center divider) ── */}
          <rect x={HALF_W - 1} y={280} width={2} height={1100}
            fill="url(#splitLine17)" opacity={splitEnter} />

          {/* ── Column headers ── */}
          <g opacity={splitEnter}>
            <text x={LEFT_CX} y={330} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={800} letterSpacing={4}
              fill="#9CA3AF" opacity={0.7}>
              💭 THOUGHT
            </text>
            <text x={LEFT_CX} y={358} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={13} fontWeight={500} letterSpacing={2}
              fill="#6B7280" opacity={0.4}>
              Internal only
            </text>

            <text x={RIGHT_CX} y={330} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={800} letterSpacing={4}
              fill={COLORS.electric_cyan} opacity={0.8}>
              ⚡ ACTION
            </text>
            <text x={RIGHT_CX} y={358} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={13} fontWeight={500} letterSpacing={2}
              fill={COLORS.electric_cyan} opacity={0.4}>
              External effect
            </text>
          </g>

          {/* ═══════════════ LEFT: THOUGHT ═══════════════ */}

          {/* Thought aura */}
          <circle cx={LEFT_CX} cy={CENTER_Y} r={130}
            fill="url(#thoughtAura17)" opacity={splitEnter} />

          {/* Brain arcs (dimmed) */}
          <g transform={`translate(${LEFT_CX}, ${CENTER_Y}) rotate(${thoughtSpin})`}
            opacity={splitEnter * 0.4}>
            {THOUGHT_ARCS.map((arc, i) => {
              const startRad = (arc.startAngle * Math.PI) / 180;
              const sweepRad = (arc.sweep * Math.PI) / 180;
              const x1 = Math.cos(startRad) * arc.r;
              const y1 = Math.sin(startRad) * arc.r;
              const x2 = Math.cos(startRad + sweepRad) * arc.r;
              const y2 = Math.sin(startRad + sweepRad) * arc.r;
              return (
                <path key={`ta${i}`}
                  d={`M${x1},${y1} A${arc.r},${arc.r} 0 0,1 ${x2},${y2}`}
                  fill="none" stroke="#9CA3AF" strokeWidth={arc.strokeW}
                  strokeLinecap="round" opacity={0.4} />
              );
            })}
            <circle cx={0} cy={0} r={10} fill="#9CA3AF" opacity={0.3} />
          </g>

          {/* Thought bubbles */}
          {THOUGHT_BUBBLES.map((tb, i) => {
            const tbOp = interpolate(frame, [tb.delay, tb.delay + 4], [0, tb.opacity],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`tb${i}`} opacity={tbOp}>
                <ellipse cx={tb.x} cy={tb.y} rx={tb.rx} ry={tb.ry}
                  fill={COLORS.bg_paper} stroke="#D1D5DB" strokeWidth={1}
                  opacity={0.6} />
                <text x={tb.x} y={tb.y + 4} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={11} fontWeight={500} fill="#9CA3AF" opacity={0.5}>
                  {tb.content}
                </text>
              </g>
            );
          })}

          {/* No effect lines */}
          {NO_EFFECT_LINES.map((ne, i) => {
            const neOp = interpolate(frame, [ne.delay, ne.delay + 4], [0, 0.15], { extrapolateRight: 'clamp' });
            return (
              <g key={`ne${i}`} opacity={neOp}>
                <line x1={LEFT_CX + 70} y1={ne.y} x2={LEFT_CX + 120} y2={ne.y}
                  stroke="#9CA3AF" strokeWidth={1} strokeDasharray="4 4" />
                <text x={LEFT_CX + 135} y={ne.y + 4}
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fill={COLORS.vibrant_red} opacity={0.4}>✗</text>
              </g>
            );
          })}

          {/* ═══════════════ RIGHT: ACTION ═══════════════ */}

          {/* Action aura */}
          <circle cx={RIGHT_CX} cy={CENTER_Y} r={140}
            fill="url(#actionAura17)" opacity={splitEnter * glowPulse * 2} />

          {/* Impact ripples */}
          {IMPACT_RIPPLES.map((ir, i) => {
            const irOp = interpolate(frame, [ir.delay, ir.delay + 6], [0, 0.2], { extrapolateRight: 'clamp' });
            return (
              <circle key={`ir${i}`} cx={RIGHT_CX} cy={CENTER_Y} r={ir.r}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
                opacity={irOp * glowPulse} strokeDasharray="4 6" />
            );
          })}

          {/* Action rays */}
          {ACTION_RAYS.map((ar, i) => {
            const arOp = interpolate(frame, [ar.delay, ar.delay + 5], [0, 0.5], { extrapolateRight: 'clamp' });
            const ix = RIGHT_CX + Math.cos(ar.angle) * ar.innerR;
            const iy = CENTER_Y + Math.sin(ar.angle) * ar.innerR;
            const ox = RIGHT_CX + Math.cos(ar.angle) * ar.outerR;
            const oy = CENTER_Y + Math.sin(ar.angle) * ar.outerR;
            return (
              <line key={`ar${i}`} x1={ix} y1={iy} x2={ox} y2={oy}
                stroke={COLORS.electric_cyan} strokeWidth={ar.strokeW}
                strokeLinecap="round" opacity={arOp * glowPulse}
                filter="url(#actionGlow17)" />
            );
          })}

          {/* Center action icon */}
          <g transform={`translate(${RIGHT_CX}, ${CENTER_Y})`} opacity={splitEnter}>
            <circle cx={0} cy={0} r={35} fill={COLORS.deep_black}
              stroke={COLORS.electric_cyan} strokeWidth={2.5}
              filter="url(#actionGlow17)" />
            <text textAnchor="middle" y={8}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={24} fontWeight={700} fill={COLORS.electric_cyan}>
              ⚡
            </text>
          </g>

          {/* Action targets */}
          {ACTION_TARGETS.map((at, i) => {
            const atOp = interpolate(frame, [at.delay, at.delay + 5], [0, 0.8], { extrapolateRight: 'clamp' });
            return (
              <g key={`at${i}`} opacity={atOp}>
                {/* Connection line */}
                <line x1={RIGHT_CX} y1={CENTER_Y} x2={at.x} y2={at.y}
                  stroke={COLORS.electric_cyan} strokeWidth={1}
                  strokeDasharray="3 5" opacity={0.25} />
                <text x={at.x} y={at.y + 5} textAnchor="middle" fontSize={18}>
                  {at.icon}
                </text>
                <text x={at.x} y={at.y + 22} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={8} fontWeight={700} letterSpacing={1.5}
                  fill={COLORS.electric_cyan} opacity={0.6}>
                  {at.label}
                </text>
              </g>
            );
          })}

          {/* Outward arrows */}
          {OUTWARD_ARROWS.map((oa, i) => {
            const oaOp = interpolate(frame, [oa.delay, oa.delay + 5], [0, 0.35], { extrapolateRight: 'clamp' });
            const ox = RIGHT_CX + Math.cos(oa.angle) * oa.r;
            const oy = CENTER_Y + Math.sin(oa.angle) * oa.r;
            return (
              <g key={`oa${i}`} opacity={oaOp}>
                <circle cx={ox} cy={oy} r={4}
                  fill={COLORS.vibrant_green} opacity={glowPulse} />
              </g>
            );
          })}

          {/* ═══════════════ PROPERTY COMPARISON ═══════════════ */}

          {/* Left properties */}
          {THOUGHT_PROPS.map((tp, i) => {
            const tpOp = interpolate(frame, [tp.delay, tp.delay + 4], [0, 0.8], { extrapolateRight: 'clamp' });
            const rowY = PROPS_TOP + i * PROP_ROW_H;
            return (
              <g key={`tp${i}`} opacity={tpOp}>
                <text x={LEFT_CX - PROP_W / 2 + 20} y={rowY}
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={11} fontWeight={600} letterSpacing={1.5}
                  fill="#6B7280" opacity={0.6}>
                  {tp.label}
                </text>
                <text x={LEFT_CX + PROP_W / 2 - 20} y={rowY}
                  textAnchor="end"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={14} fontWeight={700}
                  fill={tp.color}>
                  {tp.value}
                </text>
                {/* Separator */}
                <line x1={LEFT_CX - PROP_W / 2 + 15} y1={rowY + 12}
                  x2={LEFT_CX + PROP_W / 2 - 15} y2={rowY + 12}
                  stroke="#E5E7EB" strokeWidth={0.5} opacity={0.2} />
              </g>
            );
          })}

          {/* Right properties */}
          {ACTION_PROPS.map((ap, i) => {
            const apOp = interpolate(frame, [ap.delay, ap.delay + 4], [0, 0.8], { extrapolateRight: 'clamp' });
            const rowY = PROPS_TOP + i * PROP_ROW_H;
            return (
              <g key={`ap${i}`} opacity={apOp}>
                <text x={RIGHT_CX - PROP_W / 2 + 20} y={rowY}
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={11} fontWeight={600} letterSpacing={1.5}
                  fill={COLORS.cool_silver} opacity={0.6}>
                  {ap.label}
                </text>
                <text x={RIGHT_CX + PROP_W / 2 - 20} y={rowY}
                  textAnchor="end"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={14} fontWeight={700}
                  fill={ap.color}>
                  {ap.value}
                </text>
                {/* Separator */}
                <line x1={RIGHT_CX - PROP_W / 2 + 15} y1={rowY + 12}
                  x2={RIGHT_CX + PROP_W / 2 - 15} y2={rowY + 12}
                  stroke={COLORS.electric_cyan} strokeWidth={0.5} opacity={0.08} />
              </g>
            );
          })}

          {/* ── VS badge ── */}
          <g transform={`translate(${HALF_W}, ${VS_Y})`}
            opacity={splitEnter}>
            <circle cx={0} cy={0} r={28}
              fill={COLORS.deep_black} stroke={COLORS.cool_silver}
              strokeWidth={1.5} opacity={0.85} />
            <text textAnchor="middle" y={7}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={800} letterSpacing={2}
              fill={COLORS.cool_silver}>
              VS
            </text>
          </g>

          {/* ── Bottom message ── */}
          <g opacity={interpolate(frame, [18, 26], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1180} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={600} fill={COLORS.cool_silver} opacity={0.6}>
              Thoughts stay inside — Actions change the world
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="Thought is internal. Action is external and changes the world."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
