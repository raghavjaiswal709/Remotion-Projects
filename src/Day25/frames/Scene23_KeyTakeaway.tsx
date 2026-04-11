/**
 * Scene 23 — Key Takeaway
 * 4 bullet cards: action = verb, loop needs action, quality matters, reach = actions
 * Staggered reveal with premium card design.
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
const CARDS_TOP = 400;
const CARD_GAP = 210;
const CARD_W = 840;
const CARD_H = 160;

// ── Takeaway cards ───────────────────────────────────────────────────────
interface TakeawayCard {
  number: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  delay: number;
}

const CARDS: TakeawayCard[] = [
  {
    number: '01',
    title: 'Action = Verb',
    description: 'An action is a verb the agent executes against the environment.',
    icon: '⚡',
    color: COLORS.electric_cyan,
    delay: 2,
  },
  {
    number: '02',
    title: 'Loop Needs Action',
    description: 'Without actions, the agent loop is just thinking with no effect.',
    icon: '🔄',
    color: COLORS.warm_blue,
    delay: 6,
  },
  {
    number: '03',
    title: 'Quality Matters',
    description: 'Smarter reasoning with weak actions still produces weak outcomes.',
    icon: '💎',
    color: COLORS.amber,
    delay: 10,
  },
  {
    number: '04',
    title: 'Reach = Actions',
    description: 'The action set defines the agent\'s reach and capabilities.',
    icon: '🌐',
    color: COLORS.vibrant_green,
    delay: 14,
  },
];

// ── Accent line per card ─────────────────────────────────────────────────
const ACCENT_LINE_W = 4;
const ACCENT_LINE_H_FRACTION = 0.7;

// ── Background grid ──────────────────────────────────────────────────────
const BG_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: 60 + (i % 10) * 108,
  y: 350 + Math.floor(i / 10) * 220,
  phase: i * 0.27,
}));

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 149.7 + 42) % 1080,
  y: (i * 203.1 + 58) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.31,
}));

// ── Icon orbit dots per card ─────────────────────────────────────────────
const ORBIT_DOTS_PER_CARD = 5;
const ORBIT_R = 28;

// ── Connector lines between cards ────────────────────────────────────────
const CONNECTORS = Array.from({ length: CARDS.length - 1 }, (_, i) => ({
  y1: CARDS_TOP + i * CARD_GAP + CARD_H / 2 + 10,
  y2: CARDS_TOP + (i + 1) * CARD_GAP - CARD_H / 2 - 10,
  delay: CARDS[i].delay + 3,
}));

// ── Card bracket corners ─────────────────────────────────────────────────
const BRACKET_S = 14;

const CardBrackets: React.FC<{ w: number; h: number; color: string; opacity: number }> = ({
  w, h, color, opacity: op,
}) => {
  const hw = w / 2;
  const hh = h / 2;
  const s = BRACKET_S;
  return (
    <g opacity={op} stroke={color} strokeWidth={1.2} fill="none" strokeLinecap="round">
      <polyline points={`${-hw},${-hh + s} ${-hw},${-hh} ${-hw + s},${-hh}`} />
      <polyline points={`${hw - s},${-hh} ${hw},${-hh} ${hw},${-hh + s}`} />
      <polyline points={`${-hw},${hh - s} ${-hw},${hh} ${-hw + s},${hh}`} />
      <polyline points={`${hw - s},${hh} ${hw},${hh} ${hw},${hh - s}`} />
    </g>
  );
};

// ── Check mark helper ────────────────────────────────────────────────────
const CheckMark: React.FC<{ x: number; y: number; color: string; opacity: number }> = ({
  x, y, color, opacity: op,
}) => (
  <g transform={`translate(${x}, ${y})`} opacity={op}>
    <circle cx={0} cy={0} r={12} fill={color} opacity={0.15} />
    <path d="M-5,0 L-1,4 L6,-4" fill="none" stroke={color} strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// ── Summary line at bottom ───────────────────────────────────────────────
const SUMMARY_Y = CARDS_TOP + CARDS.length * CARD_GAP + 20;

// ── Decorative side marks ────────────────────────────────────────────────
const SIDE_MARKS = Array.from({ length: 4 }, (_, i) => ({
  y: CARDS_TOP + i * CARD_GAP,
  delay: CARDS[i].delay + 1,
}));

// ── Numbering circle for each card ───────────────────────────────────────
const NUM_CIRCLE_R = 24;

// ── Background shimmer ───────────────────────────────────────────────────
const SHIMMER_LINES = Array.from({ length: 5 }, (_, i) => ({
  y: 380 + i * 220,
  delay: 1 + i * 2,
  w: 300 + (i % 2) * 200,
}));

// ── Gradient defs per card color ─────────────────────────────────────────
const cardGradients = CARDS.map((c, i) => ({
  id: `cardGrad${i}`,
  color: c.color,
}));

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene23_KeyTakeaway: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="cardGlow23" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.25" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {cardGradients.map((cg) => (
              <linearGradient key={cg.id} id={cg.id} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={cg.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={cg.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
            <linearGradient id="cardBaseBg23" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#151520" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0D0D14" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Background particles ── */}
          {PARTICLES.map((p, i) => {
            const pOp = Math.sin(frame * 0.04 + p.phase) * 0.15 + 0.2;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pOp * 0.04} />
            );
          })}

          {/* ── Background dots ── */}
          {BG_DOTS.map((d, i) => {
            const dOp = Math.sin(frame * 0.05 + d.phase) * 0.08 + 0.1;
            return (
              <circle key={`bd${i}`} cx={d.x} cy={d.y} r={1}
                fill={COLORS.cool_silver} opacity={enter * dOp} />
            );
          })}

          {/* ── Shimmer lines ── */}
          {SHIMMER_LINES.map((sl, i) => {
            const slOp = interpolate(frame, [sl.delay, sl.delay + 6], [0, 0.04],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`sl${i}`} x1={CX - sl.w / 2} y1={sl.y}
                x2={CX + sl.w / 2} y2={sl.y}
                stroke={COLORS.electric_cyan} strokeWidth={0.5}
                opacity={slOp} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="KEY TAKEAWAYS" fontSize={28}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          <text x={CX} y={250} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={15} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.4}>
            DAY 25 — ACTIONS
          </text>

          {/* ── Connectors between cards ── */}
          {CONNECTORS.map((conn, i) => {
            const connOp = interpolate(frame, [conn.delay, conn.delay + 3], [0, 0.15],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`conn${i}`} x1={CX} y1={conn.y1} x2={CX} y2={conn.y2}
                stroke={COLORS.electric_cyan} strokeWidth={1}
                strokeDasharray="4 6" opacity={connOp} />
            );
          })}

          {/* ── Side marks ── */}
          {SIDE_MARKS.map((sm, i) => {
            const smOp = interpolate(frame, [sm.delay, sm.delay + 3], [0, 0.2],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`sm${i}`} opacity={smOp}>
                <line x1={60} y1={sm.y} x2={90} y2={sm.y}
                  stroke={CARDS[i].color} strokeWidth={1.5} strokeLinecap="round" />
              </g>
            );
          })}

          {/* ═══════════════ TAKEAWAY CARDS ═══════════════ */}
          {CARDS.map((card, i) => {
            const cardOp = interpolate(frame, [card.delay, card.delay + 5], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const cardX = interpolate(frame, [card.delay, card.delay + 5], [40, 0],
              { extrapolateRight: 'clamp', easing: ease });
            const cardY = CARDS_TOP + i * CARD_GAP;
            const iconPulse = Math.sin(frame * 0.12 + i * 0.8) * 0.2 + 0.8;

            return (
              <g key={`card${i}`} opacity={cardOp}
                transform={`translate(${CX + cardX}, ${cardY})`}>

                {/* Card background */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H}
                  rx={12} fill="url(#cardBaseBg23)" />

                {/* Color overlay */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H}
                  rx={12} fill={`url(#cardGrad${i})`} />

                {/* Border */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H}
                  rx={12} fill="none" stroke={card.color}
                  strokeWidth={1.2} opacity={0.6} />

                {/* Accent line (left) */}
                <rect x={-CARD_W / 2} y={-CARD_H * ACCENT_LINE_H_FRACTION / 2}
                  width={ACCENT_LINE_W} height={CARD_H * ACCENT_LINE_H_FRACTION}
                  rx={2} fill={card.color} opacity={0.8} />

                {/* Brackets */}
                <CardBrackets w={CARD_W - 20} h={CARD_H - 20}
                  color={card.color} opacity={0.2} />

                {/* Number circle */}
                <g transform={`translate(${-CARD_W / 2 + 50}, 0)`}>
                  <circle cx={0} cy={0} r={NUM_CIRCLE_R}
                    fill={COLORS.deep_black} stroke={card.color}
                    strokeWidth={1.5} />
                  <text textAnchor="middle" y={5}
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={14} fontWeight={800} fill={card.color}>
                    {card.number}
                  </text>
                </g>

                {/* Icon */}
                <text x={-CARD_W / 2 + 110} y={-18} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={28} opacity={iconPulse}>
                  {card.icon}
                </text>

                {/* Title */}
                <text x={-CARD_W / 2 + 150} y={-18}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={20} fontWeight={800} letterSpacing={1}
                  fill={card.color}>
                  {card.title}
                </text>

                {/* Description */}
                <text x={-CARD_W / 2 + 150} y={14}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={13} fontWeight={500}
                  fill={COLORS.cool_silver} opacity={0.6}>
                  {card.description}
                </text>

                {/* Check mark */}
                <CheckMark x={CARD_W / 2 - 35} y={0}
                  color={card.color}
                  opacity={interpolate(frame, [card.delay + 3, card.delay + 5], [0, 0.8],
                    { extrapolateRight: 'clamp' })} />

                {/* Orbit dots around icon */}
                {Array.from({ length: ORBIT_DOTS_PER_CARD }, (_, di) => {
                  const angle = (di / ORBIT_DOTS_PER_CARD) * Math.PI * 2 + frame * 0.04;
                  const ox = -CARD_W / 2 + 110 + Math.cos(angle) * ORBIT_R;
                  const oy = -18 + Math.sin(angle) * ORBIT_R;
                  return (
                    <circle key={`od${i}_${di}`} cx={ox} cy={oy} r={1.5}
                      fill={card.color} opacity={iconPulse * 0.3} />
                  );
                })}
              </g>
            );
          })}

          {/* ── Summary line ── */}
          <g opacity={interpolate(frame, [22, 28], [0, 0.7], { extrapolateRight: 'clamp', easing: ease })}>
            <text x={CX} y={SUMMARY_Y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={600}
              fill={COLORS.cool_silver} opacity={0.6}>
              Actions are what turn intelligence into impact.
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="Key takeaways: action = verb, loop needs action, quality matters."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
