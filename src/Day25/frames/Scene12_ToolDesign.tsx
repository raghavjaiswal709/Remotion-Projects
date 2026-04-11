/**
 * Scene 12 — Tool Design
 * "This is why tool design matters so much in agentic systems."
 * Wrench/tool icons, design blueprint visual, quality indicators.
 * Duration: 113 frames (~3.77s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;

// ── Blueprint grid ───────────────────────────────────────────────────────
const GRID_LEFT = 120;
const GRID_TOP = 420;
const GRID_W = 840;
const GRID_H = 640;
const GRID_COLS = 14;
const GRID_ROWS = 10;
const CELL_W = GRID_W / GRID_COLS;
const CELL_H = GRID_H / GRID_ROWS;

// ── Tool cards (design showcase) ─────────────────────────────────────────
interface ToolCard {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  label: string;
  quality: 'excellent' | 'good' | 'poor';
  delay: number;
}

const TOOL_CARDS: ToolCard[] = [
  { id: 0, x: 210, y: 500, width: 200, height: 140, icon: 'wrench',
    label: 'API Caller', quality: 'excellent', delay: 15 },
  { id: 1, x: 460, y: 500, width: 200, height: 140, icon: 'database',
    label: 'DB Query', quality: 'good', delay: 22 },
  { id: 2, x: 710, y: 500, width: 200, height: 140, icon: 'file',
    label: 'File Writer', quality: 'excellent', delay: 29 },
  { id: 3, x: 210, y: 700, width: 200, height: 140, icon: 'mail',
    label: 'Messenger', quality: 'good', delay: 36 },
  { id: 4, x: 460, y: 700, width: 200, height: 140, icon: 'search',
    label: 'Web Search', quality: 'excellent', delay: 43 },
  { id: 5, x: 710, y: 700, width: 200, height: 140, icon: 'code',
    label: 'Code Runner', quality: 'good', delay: 50 },
];

// ── Quality color map ────────────────────────────────────────────────────
const QUALITY_COLORS: Record<string, string> = {
  excellent: COLORS.vibrant_green,
  good: COLORS.warm_blue,
  poor: COLORS.vibrant_red,
};

const QUALITY_LABELS: Record<string, string> = {
  excellent: '★★★',
  good: '★★☆',
  poor: '★☆☆',
};

// ── Tool icon paths ──────────────────────────────────────────────────────
const TOOL_ICONS: Record<string, string> = {
  wrench: 'M-12,-12 L-4,-4 M-4,-4 L-4,4 L4,4 L4,-4 Z M4,4 L12,12 M10,12 L12,12 L12,10',
  database: 'M-10,-8 A10,4,0,1,1,10,-8 M10,-8 L10,8 A10,4,0,1,1,-10,8 L-10,-8 M-10,0 A10,4,0,1,0,10,0',
  file: 'M-8,-12 L4,-12 L10,-6 L10,12 L-8,12 Z M4,-12 L4,-6 L10,-6',
  mail: 'M-12,-8 L12,-8 L12,8 L-12,8 Z M-12,-8 L0,2 L12,-8',
  search: 'M-4,-4 A6,6,0,1,1,-4,-3.99 M3,3 L10,10',
  code: 'M-8,-6 L-14,0 L-8,6 M8,-6 L14,0 L8,6 M3,-10 L-3,10',
};

// ── Design annotations ───────────────────────────────────────────────────
interface Annotation {
  x: number;
  y: number;
  text: string;
  delay: number;
  color: string;
}

const ANNOTATIONS: Annotation[] = [
  { x: 200, y: 910, text: 'INPUT SCHEMA', delay: 55, color: COLORS.electric_cyan },
  { x: 420, y: 910, text: 'ERROR HANDLING', delay: 62, color: COLORS.amber },
  { x: 660, y: 910, text: 'OUTPUT FORMAT', delay: 69, color: COLORS.purple },
  { x: 880, y: 910, text: 'RATE LIMITS', delay: 76, color: COLORS.vibrant_green },
];

// ── Measurement lines (blueprint style) ──────────────────────────────────
interface MeasureLine {
  x1: number; y1: number; x2: number; y2: number;
  label: string; delay: number;
}

const MEASURE_LINES: MeasureLine[] = [
  { x1: 160, y1: 470, x2: 160, y2: 860, label: '↕ SCOPE', delay: 60 },
  { x1: 190, y1: 470, x2: 850, y2: 470, label: '↔ COVERAGE', delay: 65 },
];

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 163.7 + 35) % 1080,
  y: (i * 197.3 + 55) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.39,
}));

// ── Connecting wires between tools ───────────────────────────────────────
const WIRE_CONNECTIONS = [
  { from: 0, to: 1, delay: 45 },
  { from: 1, to: 2, delay: 48 },
  { from: 3, to: 4, delay: 55 },
  { from: 4, to: 5, delay: 58 },
  { from: 0, to: 3, delay: 52 },
  { from: 2, to: 5, delay: 60 },
  { from: 1, to: 4, delay: 56 },
];

// ── Dimension tick marks ─────────────────────────────────────────────────
const DIM_TICKS = Array.from({ length: 8 }, (_, i) => ({
  x: GRID_LEFT + CELL_W * (i * 2 + 1),
  delay: 30 + i * 3,
}));

// ── Central "DESIGN" badge ───────────────────────────────────────────────
const BADGE_CX = CX;
const BADGE_CY = 380;
const BADGE_W = 200;
const BADGE_H = 50;

export const Scene12_ToolDesign: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const gridOp = interpolate(frame, [5, 25], [0, 0.12], { extrapolateRight: 'clamp' });
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const pulseGlow = 0.5 + Math.sin(frame * 0.08) * 0.15;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="toolGlow12">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.3" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="cardShadow12">
              <feDropShadow dx="0" dy="4" stdDeviation="8"
                floodColor="#0D0D0D" floodOpacity="0.15" />
            </filter>
            <linearGradient id="blueprintGrad12" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="cardGrad12" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.soft_white} />
              <stop offset="100%" stopColor="#EFF1F3" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Ambient particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.03 + p.phase) * 0.25 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.warm_blue} opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="TOOL DESIGN MATTERS" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            In agentic systems
          </text>

          {/* ── Blueprint background grid ── */}
          <rect x={GRID_LEFT} y={GRID_TOP} width={GRID_W} height={GRID_H}
            fill="url(#blueprintGrad12)" rx={8} opacity={gridOp * 2} />
          {Array.from({ length: GRID_COLS + 1 }, (_, i) => (
            <line key={`gv${i}`}
              x1={GRID_LEFT + i * CELL_W} y1={GRID_TOP}
              x2={GRID_LEFT + i * CELL_W} y2={GRID_TOP + GRID_H}
              stroke={COLORS.warm_blue} strokeWidth={0.5} opacity={gridOp} />
          ))}
          {Array.from({ length: GRID_ROWS + 1 }, (_, i) => (
            <line key={`gh${i}`}
              x1={GRID_LEFT} y1={GRID_TOP + i * CELL_H}
              x2={GRID_LEFT + GRID_W} y2={GRID_TOP + i * CELL_H}
              stroke={COLORS.warm_blue} strokeWidth={0.5} opacity={gridOp} />
          ))}

          {/* ── Dimension ticks ── */}
          {DIM_TICKS.map((dt, i) => {
            const dtOp = interpolate(frame, [dt.delay, dt.delay + 10], [0, 0.3], { extrapolateRight: 'clamp' });
            return (
              <g key={`dt${i}`} opacity={dtOp}>
                <line x1={dt.x} y1={GRID_TOP - 8} x2={dt.x} y2={GRID_TOP - 2}
                  stroke={COLORS.warm_blue} strokeWidth={1} />
              </g>
            );
          })}

          {/* ── Measurement lines ── */}
          {MEASURE_LINES.map((ml, i) => {
            const mlOp = interpolate(frame, [ml.delay, ml.delay + 15], [0, 0.25], { extrapolateRight: 'clamp' });
            return (
              <g key={`ml${i}`} opacity={mlOp}>
                <line x1={ml.x1} y1={ml.y1} x2={ml.x2} y2={ml.y2}
                  stroke={COLORS.electric_cyan} strokeWidth={1}
                  strokeDasharray="6 4" />
                <text x={(ml.x1 + ml.x2) / 2} y={(ml.y1 + ml.y2) / 2 - 8}
                  textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600} letterSpacing={2}
                  fill={COLORS.electric_cyan}>
                  {ml.label}
                </text>
              </g>
            );
          })}

          {/* ── "DESIGN" badge ── */}
          <g opacity={interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp' })}>
            <rect x={BADGE_CX - BADGE_W / 2} y={BADGE_CY - BADGE_H / 2}
              width={BADGE_W} height={BADGE_H} rx={BADGE_H / 2}
              fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
              strokeWidth={1.5} opacity={0.9}
              filter="url(#toolGlow12)" />
            <text x={BADGE_CX} y={BADGE_CY + 6} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={18} fontWeight={700} letterSpacing={5}
              fill={COLORS.electric_cyan}>
              🔧 DESIGN
            </text>
          </g>

          {/* ── Wire connections between tools ── */}
          {WIRE_CONNECTIONS.map((wc, i) => {
            const wcOp = interpolate(frame, [wc.delay, wc.delay + 12], [0, 0.2], { extrapolateRight: 'clamp' });
            const fromCard = TOOL_CARDS[wc.from];
            const toCard = TOOL_CARDS[wc.to];
            return (
              <line key={`wc${i}`}
                x1={fromCard.x} y1={fromCard.y}
                x2={toCard.x} y2={toCard.y}
                stroke={COLORS.electric_cyan} strokeWidth={1}
                strokeDasharray="4 6" opacity={wcOp} />
            );
          })}

          {/* ── Tool cards ── */}
          {TOOL_CARDS.map((tc) => {
            const tcEnter = interpolate(frame, [tc.delay, tc.delay + 18], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const tcScale = scaleAnim(frame, tc.delay, 18, 0.7, 1);
            const tcY = tc.y - tcEnter * 6;
            const qColor = QUALITY_COLORS[tc.quality];
            const qLabel = QUALITY_LABELS[tc.quality];

            return (
              <g key={`tc${tc.id}`}
                transform={`translate(${tc.x}, ${tcY}) scale(${tcScale})`}
                opacity={tcEnter}>
                {/* Card background */}
                <rect x={-tc.width / 2} y={-tc.height / 2}
                  width={tc.width} height={tc.height} rx={12}
                  fill="url(#cardGrad12)" stroke={qColor}
                  strokeWidth={1.5} opacity={0.95}
                  filter="url(#cardShadow12)" />

                {/* Icon area */}
                <circle cx={0} cy={-tc.height / 2 + 40} r={22}
                  fill={COLORS.bg_paper} stroke={qColor}
                  strokeWidth={1} opacity={0.8} />
                <path d={TOOL_ICONS[tc.icon]}
                  transform={`translate(0, ${-tc.height / 2 + 40})`}
                  fill="none" stroke={qColor} strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round" />

                {/* Label */}
                <text x={0} y={tc.height / 2 - 42} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={14} fontWeight={700} letterSpacing={1}
                  fill={COLORS.deep_black} opacity={0.8}>
                  {tc.label}
                </text>

                {/* Quality rating */}
                <text x={0} y={tc.height / 2 - 20} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={16} fill={qColor}>
                  {qLabel}
                </text>

                {/* Quality badge */}
                <rect x={-35} y={tc.height / 2 - 16} width={70} height={4}
                  rx={2} fill={qColor} opacity={0.3 + pulseGlow * 0.2} />
              </g>
            );
          })}

          {/* ── Design annotations ── */}
          {ANNOTATIONS.map((an, i) => {
            const anOp = interpolate(frame, [an.delay, an.delay + 12], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`an${i}`} opacity={anOp}>
                <line x1={an.x} y1={an.y - 30} x2={an.x} y2={an.y - 10}
                  stroke={an.color} strokeWidth={1} opacity={0.4} />
                <circle cx={an.x} cy={an.y - 30} r={3}
                  fill={an.color} opacity={0.5} />
                <text x={an.x} y={an.y + 5} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={10} fontWeight={600} letterSpacing={1.5}
                  fill={an.color} opacity={0.7}>
                  {an.text}
                </text>
              </g>
            );
          })}

          {/* ── Bottom emphasis ── */}
          <g opacity={interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1040} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.cool_silver} opacity={0.65}>
              Well-designed tools = Capable agents
            </text>
            <text x={540} y={1080} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              Every detail of tool design shapes agent behavior
            </text>
          </g>

          {/* ── Separator ── */}
          <line x1={300} y1={1140} x2={780} y2={1140}
            stroke={COLORS.electric_cyan} strokeWidth={0.5} opacity={enter * 0.08} />

          {/* ── Caption ── */}
          <CaptionBar
            text="This is why tool design matters so much in agentic systems."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
