/**
 * Scene 18 — Action Catalog
 * Visual catalog of common agent actions: Search, Compute, Navigate, Store, Communicate
 * Icon grid layout with labels, animated reveal.
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
const GRID_TOP = 380;
const GRID_GAP_X = 220;
const GRID_GAP_Y = 280;
const CARD_W = 190;
const CARD_H = 230;
const ICON_R = 42;

// ── Action catalog data ──────────────────────────────────────────────────
interface CatalogAction {
  label: string;
  subtitle: string;
  icon: string;
  color: string;
  col: number;
  row: number;
  delay: number;
}

const ACTIONS: CatalogAction[] = [
  { label: 'SEARCH', subtitle: 'Query APIs & databases', icon: '🔍', color: COLORS.electric_cyan, col: 0, row: 0, delay: 2 },
  { label: 'COMPUTE', subtitle: 'Run calculations & code', icon: '⚙️', color: COLORS.warm_blue, col: 1, row: 0, delay: 4 },
  { label: 'NAVIGATE', subtitle: 'Browse & interact with UI', icon: '🧭', color: COLORS.vibrant_green, col: 2, row: 0, delay: 6 },
  { label: 'STORE', subtitle: 'Write files & save data', icon: '💾', color: COLORS.amber, col: 0, row: 1, delay: 8 },
  { label: 'COMMUNICATE', subtitle: 'Send messages & emails', icon: '📡', color: COLORS.purple, col: 1, row: 1, delay: 10 },
];

// ── Decorative grid dots ─────────────────────────────────────────────────
const GRID_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: 80 + (i % 10) * 105,
  y: 300 + Math.floor(i / 10) * 105,
  phase: i * 0.23,
}));

// ── Connection lines between actions ─────────────────────────────────────
const getCardCenter = (col: number, row: number) => ({
  x: CX - GRID_GAP_X + col * GRID_GAP_X,
  y: GRID_TOP + row * GRID_GAP_Y + CARD_H / 2,
});

const CONNECTIONS = [
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 }, delay: 12 },
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 }, delay: 13 },
  { from: { col: 0, row: 0 }, to: { col: 0, row: 1 }, delay: 14 },
  { from: { col: 1, row: 0 }, to: { col: 1, row: 1 }, delay: 15 },
  { from: { col: 2, row: 0 }, to: { col: 1, row: 1 }, delay: 16 },
];

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 143.7 + 40) % 1080,
  y: (i * 197.3 + 70) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.41,
}));

// ── Accent rays from center ──────────────────────────────────────────────
const CENTER_RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * Math.PI * 2,
  innerR: 280,
  outerR: 350 + (i % 3) * 30,
  delay: 14 + i * 0.5,
}));

// ── "Total actions" badge ────────────────────────────────────────────────
const BADGE_Y = GRID_TOP + GRID_GAP_Y * 2 + 40;

// ── Glow rings per card ──────────────────────────────────────────────────
const GLOW_RINGS = [0, 1, 2, 3, 4];

// ── Small stat numbers ───────────────────────────────────────────────────
const STATS = [
  { label: 'API calls', value: '∞', x: CX - 300, y: BADGE_Y + 130, delay: 18 },
  { label: 'File ops', value: '∞', x: CX, y: BADGE_Y + 130, delay: 20 },
  { label: 'Messages', value: '∞', x: CX + 300, y: BADGE_Y + 130, delay: 22 },
];

// ── Bracket decorations ──────────────────────────────────────────────────
const BRACKET_SIZE = 14;

// ── Hexagonal background pattern ─────────────────────────────────────────
const HEX_PATTERN = Array.from({ length: 8 }, (_, i) => ({
  x: 100 + (i % 4) * 280,
  y: 350 + Math.floor(i / 4) * 350,
  r: 120,
  phase: i * 0.5,
}));

// ── Corner accent lines ─────────────────────────────────────────────────
const ACCENT_LINES = [
  { x1: 40, y1: 260, x2: 160, y2: 260 },
  { x1: 920, y1: 260, x2: 1040, y2: 260 },
  { x1: 40, y1: 1100, x2: 160, y2: 1100 },
  { x1: 920, y1: 1100, x2: 1040, y2: 1100 },
];

// ── Render card icon SVG ─────────────────────────────────────────────────
const renderActionIcon = (icon: string, color: string, pulse: number) => (
  <g>
    <circle cx={0} cy={0} r={ICON_R} fill={COLORS.deep_black}
      stroke={color} strokeWidth={2.5} opacity={0.9} />
    <circle cx={0} cy={0} r={ICON_R + 6} fill="none"
      stroke={color} strokeWidth={1} opacity={0.15 + pulse * 0.1}
      strokeDasharray="4 6" />
    <circle cx={0} cy={0} r={ICON_R + 14} fill="none"
      stroke={color} strokeWidth={0.5} opacity={0.06 + pulse * 0.04}
      strokeDasharray="2 8" />
    <text textAnchor="middle" y={10}
      fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
      fontSize={30} fill={color}>
      {icon}
    </text>
  </g>
);

// ── Card bracket corners ─────────────────────────────────────────────────
const CardBrackets: React.FC<{ w: number; h: number; color: string; opacity: number }> = ({
  w, h, color, opacity: op,
}) => {
  const s = BRACKET_SIZE;
  const hw = w / 2;
  const hh = h / 2;
  return (
    <g opacity={op} stroke={color} strokeWidth={1.2} fill="none" strokeLinecap="round">
      <polyline points={`${-hw},${-hh + s} ${-hw},${-hh} ${-hw + s},${-hh}`} />
      <polyline points={`${hw - s},${-hh} ${hw},${-hh} ${hw},${-hh + s}`} />
      <polyline points={`${-hw},${hh - s} ${-hw},${hh} ${-hw + s},${hh}`} />
      <polyline points={`${hw - s},${hh} ${hw},${hh} ${hw},${hh - s}`} />
    </g>
  );
};

// ── Vertical separator marks ─────────────────────────────────────────────
const SEPARATORS = Array.from({ length: 3 }, (_, i) => ({
  x: CX - GRID_GAP_X + i * GRID_GAP_X,
  y1: GRID_TOP - 30,
  y2: GRID_TOP - 10,
}));

// ── Count indicator ──────────────────────────────────────────────────────
const COUNT_ITEMS = ACTIONS.map((a, i) => ({
  x: CX - 200 + i * 100,
  y: BADGE_Y - 10,
  color: a.color,
  delay: 16 + i,
}));

// ── Micro detail lines ───────────────────────────────────────────────────
const DETAIL_LINES = Array.from({ length: 6 }, (_, i) => ({
  x: CX - 250 + i * 100,
  y: GRID_TOP + GRID_GAP_Y * 2 - 20,
  w: 60,
  delay: 18 + i * 0.5,
}));

// ── Radial burst helper ──────────────────────────────────────────────────
const burstDots = (cx: number, cy: number, count: number, r: number, phase: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + phase;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene18_ActionCatalog: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global animations ──────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="cardGlow18" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.3" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softBlur18" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="cardBg18" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A2840" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0D1420" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="centerAura18" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.06" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
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

          {/* ── Hex background pattern ── */}
          {HEX_PATTERN.map((h, i) => {
            const hOp = Math.sin(frame * 0.03 + h.phase) * 0.03 + 0.03;
            return (
              <circle key={`hx${i}`} cx={h.x} cy={h.y} r={h.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={0.5} opacity={enter * hOp} strokeDasharray="6 12" />
            );
          })}

          {/* ── Grid dots ── */}
          {GRID_DOTS.map((d, i) => {
            const dOp = Math.sin(frame * 0.05 + d.phase) * 0.1 + 0.12;
            return (
              <circle key={`gd${i}`} cx={d.x} cy={d.y} r={1.2}
                fill={COLORS.cool_silver} opacity={enter * dOp} />
            );
          })}

          {/* ── Accent lines ── */}
          {ACCENT_LINES.map((al, i) => (
            <line key={`al${i}`} x1={al.x1} y1={al.y1} x2={al.x2} y2={al.y2}
              stroke={COLORS.electric_cyan} strokeWidth={0.6} opacity={enter * 0.12} />
          ))}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="ACTION CATALOG" fontSize={28}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Subtitle ── */}
          <text x={CX} y={250} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={16} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.45}>
            COMMON AGENT CAPABILITIES
          </text>

          {/* ── Center aura ── */}
          <circle cx={CX} cy={GRID_TOP + GRID_GAP_Y / 2 + 60} r={350}
            fill="url(#centerAura18)" opacity={enter} />

          {/* ── Connection lines between cards ── */}
          {CONNECTIONS.map((conn, i) => {
            const from = getCardCenter(conn.from.col, conn.from.row);
            const to = getCardCenter(conn.to.col, conn.to.row);
            const connOp = interpolate(frame, [conn.delay, conn.delay + 4], [0, 0.15],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`cn${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={COLORS.electric_cyan} strokeWidth={1}
                strokeDasharray="4 8" opacity={connOp} />
            );
          })}

          {/* ── Center rays ── */}
          {CENTER_RAYS.map((ray, i) => {
            const rOp = interpolate(frame, [ray.delay, ray.delay + 4], [0, 0.08],
              { extrapolateRight: 'clamp' });
            const ix = CX + Math.cos(ray.angle) * ray.innerR;
            const iy = (GRID_TOP + GRID_GAP_Y / 2 + 60) + Math.sin(ray.angle) * ray.innerR;
            const ox = CX + Math.cos(ray.angle) * ray.outerR;
            const oy = (GRID_TOP + GRID_GAP_Y / 2 + 60) + Math.sin(ray.angle) * ray.outerR;
            return (
              <line key={`cr${i}`} x1={ix} y1={iy} x2={ox} y2={oy}
                stroke={COLORS.electric_cyan} strokeWidth={0.8}
                strokeLinecap="round" opacity={rOp} />
            );
          })}

          {/* ═══════════════ ACTION CARDS ═══════════════ */}
          {ACTIONS.map((action, i) => {
            const cardX = CX - GRID_GAP_X + action.col * GRID_GAP_X;
            const cardY = GRID_TOP + action.row * GRID_GAP_Y;
            const cardOp = interpolate(frame, [action.delay, action.delay + 6], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const cardScale = interpolate(frame, [action.delay, action.delay + 6], [0.85, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const iconPulse = Math.sin(frame * 0.12 + i * 0.7) * 0.3 + 0.5;

            return (
              <g key={`card${i}`} opacity={cardOp}
                transform={`translate(${cardX}, ${cardY + CARD_H / 2}) scale(${cardScale})`}>
                {/* Card background */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H}
                  rx={12} fill="url(#cardBg18)" stroke={action.color}
                  strokeWidth={1.2} opacity={0.85} />

                {/* Inner glow */}
                <rect x={-CARD_W / 2 + 2} y={-CARD_H / 2 + 2}
                  width={CARD_W - 4} height={CARD_H - 4}
                  rx={10} fill="none" stroke={action.color}
                  strokeWidth={0.5} opacity={0.15 + iconPulse * 0.1} />

                {/* Card brackets */}
                <CardBrackets w={CARD_W - 16} h={CARD_H - 16}
                  color={action.color} opacity={0.3} />

                {/* Icon area */}
                <g transform="translate(0, -45)">
                  {renderActionIcon(action.icon, action.color, iconPulse)}
                </g>

                {/* Label */}
                <text x={0} y={30} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={18} fontWeight={800} letterSpacing={3}
                  fill={action.color}>
                  {action.label}
                </text>

                {/* Subtitle */}
                <text x={0} y={55} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={11} fontWeight={500}
                  fill={COLORS.cool_silver} opacity={0.5}>
                  {action.subtitle}
                </text>

                {/* Status dot */}
                <circle cx={CARD_W / 2 - 16} cy={-CARD_H / 2 + 16} r={4}
                  fill={action.color} opacity={0.5 + iconPulse * 0.3} />

                {/* Glow ring */}
                {GLOW_RINGS.includes(i) && (
                  <circle cx={0} cy={-45} r={ICON_R + 22}
                    fill="none" stroke={action.color} strokeWidth={0.4}
                    opacity={iconPulse * 0.12} strokeDasharray="3 9" />
                )}

                {/* Burst dots */}
                {burstDots(0, -45, 6, ICON_R + 30, frame * 0.02 + i).map((bd, bi) => (
                  <circle key={`bd${i}_${bi}`} cx={bd.x} cy={bd.y} r={1.2}
                    fill={action.color} opacity={iconPulse * 0.2} />
                ))}
              </g>
            );
          })}

          {/* ── Separator marks ── */}
          {SEPARATORS.map((s, i) => (
            <line key={`sep${i}`} x1={s.x} y1={s.y1} x2={s.x} y2={s.y2}
              stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={enter * 0.1} />
          ))}

          {/* ── Count indicators ── */}
          {COUNT_ITEMS.map((ci, i) => {
            const ciOp = interpolate(frame, [ci.delay, ci.delay + 3], [0, 0.7],
              { extrapolateRight: 'clamp' });
            return (
              <circle key={`ci${i}`} cx={ci.x} cy={ci.y} r={5}
                fill={ci.color} opacity={ciOp} />
            );
          })}

          {/* ── Detail lines ── */}
          {DETAIL_LINES.map((dl, i) => {
            const dlOp = interpolate(frame, [dl.delay, dl.delay + 3], [0, 0.1],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`dl${i}`} x1={dl.x} y1={dl.y} x2={dl.x + dl.w} y2={dl.y}
                stroke={COLORS.cool_silver} strokeWidth={0.6} opacity={dlOp} />
            );
          })}

          {/* ── Badge: total actions ── */}
          <g opacity={interpolate(frame, [18, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease })}>
            <rect x={CX - 160} y={BADGE_Y + 40} width={320} height={50}
              rx={25} fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
              strokeWidth={1.5} opacity={0.85} />
            <text x={CX} y={BADGE_Y + 72} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={3}
              fill={COLORS.electric_cyan}>
              5 CORE ACTIONS
            </text>
          </g>

          {/* ── Stats row ── */}
          {STATS.map((st, i) => {
            const stOp = interpolate(frame, [st.delay, st.delay + 4], [0, 0.7],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`st${i}`} opacity={stOp}>
                <text x={st.x} y={st.y} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={22} fontWeight={700} fill={COLORS.electric_cyan}>
                  {st.value}
                </text>
                <text x={st.x} y={st.y + 18} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600} letterSpacing={1.5}
                  fill={COLORS.cool_silver} opacity={0.4}>
                  {st.label}
                </text>
              </g>
            );
          })}

          {/* ── Caption ── */}
          <CaptionBar
            text="The action catalog: Search, Compute, Navigate, Store, Communicate."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
