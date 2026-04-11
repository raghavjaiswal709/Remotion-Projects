/**
 * Scene 20 — Environment Impact
 * Action hits the environment and changes it.
 * Before/after state visualization with ripple effects.
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
const IMPACT_Y = 620;
const BEFORE_X = 280;
const AFTER_X = 800;
const STATE_BOX_W = 340;
const STATE_BOX_H = 420;

// ── Impact ripples expanding from center ─────────────────────────────────
const IMPACT_RIPPLES = Array.from({ length: 7 }, (_, i) => ({
  r: 40 + i * 35,
  delay: 8 + i * 1.2,
  strokeW: 2.5 - i * 0.3,
}));

// ── "Before" state items ─────────────────────────────────────────────────
interface StateItem {
  label: string;
  icon: string;
  y: number;
  color: string;
}

const BEFORE_ITEMS: StateItem[] = [
  { label: 'No data stored', icon: '📂', y: 0, color: '#6B7280' },
  { label: 'API untouched', icon: '🌐', y: 60, color: '#6B7280' },
  { label: 'File empty', icon: '📄', y: 120, color: '#6B7280' },
  { label: 'DB unchanged', icon: '💾', y: 180, color: '#6B7280' },
  { label: 'No messages', icon: '📧', y: 240, color: '#6B7280' },
];

const AFTER_ITEMS: StateItem[] = [
  { label: 'Data saved ✓', icon: '📂', y: 0, color: COLORS.vibrant_green },
  { label: 'API called ✓', icon: '🌐', y: 60, color: COLORS.vibrant_green },
  { label: 'File written ✓', icon: '📄', y: 120, color: COLORS.vibrant_green },
  { label: 'DB updated ✓', icon: '💾', y: 180, color: COLORS.vibrant_green },
  { label: 'Msg sent ✓', icon: '📧', y: 240, color: COLORS.vibrant_green },
];

// ── Action bolt (center) ─────────────────────────────────────────────────
const BOLT_PATH = 'M0,-35 L12,-8 L4,-8 L10,30 L-6,2 L2,2 Z';

// ── Shockwave particles ──────────────────────────────────────────────────
const SHOCK_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    angle,
    startR: 30,
    endR: 180 + (i % 4) * 30,
    size: 3 + (i % 3) * 1.5,
    delay: 8 + (i % 4) * 0.5,
  };
});

// ── Environment grid (background) ────────────────────────────────────────
const ENV_GRID = Array.from({ length: 12 }, (_, i) => ({
  x: 100 + (i % 4) * 280,
  y: 400 + Math.floor(i / 4) * 200,
  size: 60 + (i % 3) * 20,
  phase: i * 0.5,
}));

// ── Delta indicators (change markers) ────────────────────────────────────
const DELTA_MARKERS = Array.from({ length: 5 }, (_, i) => ({
  x: CX + 60,
  y: IMPACT_Y - 80 + i * 60,
  delay: 14 + i * 1.5,
}));

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 157.3 + 45) % 1080,
  y: (i * 209.7 + 65) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.33,
}));

// ── State box labels ─────────────────────────────────────────────────────
const STATE_LABEL_OFFSET_Y = -35;

// ── Connecting dots between before/after items ───────────────────────────
const CONNECT_DOTS = Array.from({ length: 5 }, (_, i) => ({
  fromX: BEFORE_X + STATE_BOX_W / 2 + 10,
  toX: AFTER_X - STATE_BOX_W / 2 - 10,
  y: IMPACT_Y - 80 + i * 60,
  delay: 12 + i * 1.5,
}));

// ── Subtle energy waves ──────────────────────────────────────────────────
const ENERGY_WAVES = Array.from({ length: 4 }, (_, i) => ({
  r: 100 + i * 50,
  delay: 6 + i * 2,
  dashArray: `${4 + i * 2} ${8 + i * 3}`,
}));

// ── Small completion checks ──────────────────────────────────────────────
const CHECKS = AFTER_ITEMS.map((_, i) => ({
  x: AFTER_X + STATE_BOX_W / 2 - 30,
  y: IMPACT_Y - 80 + i * 60,
  delay: 16 + i * 1.5,
}));

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene20_EnvironmentImpact: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global animations ──────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
  const impactHit = interpolate(frame, [7, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  // ── Impact flash ───────────────────────────────────────────────────────
  const flashOp = interpolate(frame, [8, 10, 12, 14], [0, 0.3, 0.1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="impactGlow20" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="greenGlow20" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor={COLORS.vibrant_green} floodOpacity="0.4" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="impactAura20" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beforeGrad20" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0D0D1A" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="afterGrad20" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D2818" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0A1F14" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Particles ── */}
          {PARTICLES.map((p, i) => {
            const pOp = Math.sin(frame * 0.04 + p.phase) * 0.15 + 0.2;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pOp * 0.04} />
            );
          })}

          {/* ── Env grid (background texture) ── */}
          {ENV_GRID.map((eg, i) => {
            const egOp = Math.sin(frame * 0.03 + eg.phase) * 0.03 + 0.04;
            return (
              <rect key={`eg${i}`} x={eg.x - eg.size / 2} y={eg.y - eg.size / 2}
                width={eg.size} height={eg.size} rx={6}
                fill="none" stroke={COLORS.cool_silver}
                strokeWidth={0.4} opacity={enter * egOp} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="ENVIRONMENT IMPACT" fontSize={26}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          <text x={CX} y={250} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={14} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.4}>
            ACTION CHANGES THE WORLD STATE
          </text>

          {/* ── Energy waves ── */}
          {ENERGY_WAVES.map((ew, i) => {
            const ewOp = interpolate(frame, [ew.delay, ew.delay + 6], [0, 0.08],
              { extrapolateRight: 'clamp' });
            return (
              <circle key={`ew${i}`} cx={CX} cy={IMPACT_Y} r={ew.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={1} opacity={ewOp * impactHit}
                strokeDasharray={ew.dashArray} />
            );
          })}

          {/* ═══════════════ BEFORE STATE ═══════════════ */}
          <g opacity={enter}>
            {/* Box */}
            <rect x={BEFORE_X - STATE_BOX_W / 2} y={IMPACT_Y - STATE_BOX_H / 2}
              width={STATE_BOX_W} height={STATE_BOX_H} rx={12}
              fill="url(#beforeGrad20)" stroke="#4B5563" strokeWidth={1.2} />

            {/* Header */}
            <text x={BEFORE_X} y={IMPACT_Y - STATE_BOX_H / 2 + STATE_LABEL_OFFSET_Y + 60}
              textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={18} fontWeight={800} letterSpacing={3}
              fill="#9CA3AF">
              BEFORE
            </text>

            {/* Dimming overlay (after impact) */}
            <rect x={BEFORE_X - STATE_BOX_W / 2} y={IMPACT_Y - STATE_BOX_H / 2}
              width={STATE_BOX_W} height={STATE_BOX_H} rx={12}
              fill="#0D0D0D" opacity={impactHit * 0.3} />

            {/* Items */}
            {BEFORE_ITEMS.map((item, i) => {
              const itemOp = interpolate(frame, [2 + i, 4 + i], [0, 0.7],
                { extrapolateRight: 'clamp' });
              const dimOp = 1 - impactHit * 0.5;
              return (
                <g key={`bi${i}`} opacity={itemOp * dimOp}>
                  <text x={BEFORE_X - 80} y={IMPACT_Y - 80 + item.y + 5}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={16} fill={COLORS.bg_paper}>
                    {item.icon}
                  </text>
                  <text x={BEFORE_X - 55} y={IMPACT_Y - 80 + item.y + 5}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={13} fontWeight={500}
                    fill={item.color}>
                    {item.label}
                  </text>
                  {/* Strikethrough on impact */}
                  {impactHit > 0.5 && (
                    <line x1={BEFORE_X - 85} y1={IMPACT_Y - 80 + item.y + 2}
                      x2={BEFORE_X + 80} y2={IMPACT_Y - 80 + item.y + 2}
                      stroke={COLORS.vibrant_red} strokeWidth={1}
                      opacity={impactHit * 0.4} />
                  )}
                </g>
              );
            })}
          </g>

          {/* ═══════════════ IMPACT CENTER ═══════════════ */}

          {/* Impact flash */}
          <circle cx={CX} cy={IMPACT_Y} r={200}
            fill={COLORS.electric_cyan} opacity={flashOp} />

          {/* Impact aura */}
          <circle cx={CX} cy={IMPACT_Y} r={180}
            fill="url(#impactAura20)" opacity={impactHit} />

          {/* Ripples */}
          {IMPACT_RIPPLES.map((ir, i) => {
            const irScale = interpolate(frame, [ir.delay, ir.delay + 8], [0.5, 1.2],
              { extrapolateRight: 'clamp', easing: ease });
            const irOp = interpolate(frame, [ir.delay, ir.delay + 4, ir.delay + 8], [0, 0.3, 0.05],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <circle key={`ir${i}`} cx={CX} cy={IMPACT_Y} r={ir.r * irScale}
                fill="none" stroke={COLORS.electric_cyan} strokeWidth={ir.strokeW}
                opacity={irOp} />
            );
          })}

          {/* Shockwave particles */}
          {SHOCK_PARTICLES.map((sp, i) => {
            const t = interpolate(frame, [sp.delay, sp.delay + 10], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            const spR = sp.startR + (sp.endR - sp.startR) * t;
            const spX = CX + Math.cos(sp.angle) * spR;
            const spY = IMPACT_Y + Math.sin(sp.angle) * spR;
            const spOp = t > 0 && t < 0.9 ? (1 - t) * 0.5 : 0;
            return (
              <circle key={`sp${i}`} cx={spX} cy={spY} r={sp.size}
                fill={COLORS.electric_cyan} opacity={spOp} />
            );
          })}

          {/* Bolt icon */}
          <g transform={`translate(${CX}, ${IMPACT_Y})`}
            opacity={interpolate(frame, [4, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease })}>
            <circle cx={0} cy={0} r={35} fill={COLORS.deep_black}
              stroke={COLORS.electric_cyan} strokeWidth={2.5}
              filter="url(#impactGlow20)" />
            <path d={BOLT_PATH} fill={COLORS.electric_cyan} opacity={0.9}
              transform="scale(0.7)" />
          </g>

          {/* ── Connection dots (before → after) ── */}
          {CONNECT_DOTS.map((cd, i) => {
            const cdOp = interpolate(frame, [cd.delay, cd.delay + 4], [0, 0.3],
              { extrapolateRight: 'clamp' });
            const midX = (cd.fromX + cd.toX) / 2;
            return (
              <g key={`cd${i}`} opacity={cdOp}>
                <line x1={cd.fromX} y1={cd.y} x2={cd.toX} y2={cd.y}
                  stroke={COLORS.electric_cyan} strokeWidth={0.8}
                  strokeDasharray="3 6" />
                <circle cx={midX} cy={cd.y} r={2}
                  fill={COLORS.electric_cyan} opacity={pulse} />
              </g>
            );
          })}

          {/* ═══════════════ AFTER STATE ═══════════════ */}
          <g opacity={impactHit}>
            {/* Box */}
            <rect x={AFTER_X - STATE_BOX_W / 2} y={IMPACT_Y - STATE_BOX_H / 2}
              width={STATE_BOX_W} height={STATE_BOX_H} rx={12}
              fill="url(#afterGrad20)" stroke={COLORS.vibrant_green}
              strokeWidth={1.2} />

            {/* Header */}
            <text x={AFTER_X} y={IMPACT_Y - STATE_BOX_H / 2 + STATE_LABEL_OFFSET_Y + 60}
              textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={18} fontWeight={800} letterSpacing={3}
              fill={COLORS.vibrant_green}>
              AFTER
            </text>

            {/* Items */}
            {AFTER_ITEMS.map((item, i) => {
              const itemOp = interpolate(frame, [14 + i * 1.5, 17 + i * 1.5], [0, 0.9],
                { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={`ai${i}`} opacity={itemOp}>
                  <text x={AFTER_X - 80} y={IMPACT_Y - 80 + item.y + 5}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={16} fill={COLORS.bg_paper}>
                    {item.icon}
                  </text>
                  <text x={AFTER_X - 55} y={IMPACT_Y - 80 + item.y + 5}
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={13} fontWeight={600}
                    fill={item.color}>
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Check marks ── */}
          {CHECKS.map((ck, i) => {
            const ckOp = interpolate(frame, [ck.delay, ck.delay + 3], [0, 0.8],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`ck${i}`} opacity={ckOp}>
                <circle cx={ck.x} cy={ck.y} r={8}
                  fill={COLORS.vibrant_green} opacity={0.2} />
                <text x={ck.x} y={ck.y + 4} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={10} fontWeight={700} fill={COLORS.vibrant_green}>
                  ✓
                </text>
              </g>
            );
          })}

          {/* ── Delta markers ── */}
          {DELTA_MARKERS.map((dm, i) => {
            const dmOp = interpolate(frame, [dm.delay, dm.delay + 3], [0, 0.4],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`dm${i}`} opacity={dmOp}>
                <text x={dm.x} y={dm.y + 4} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={12} fontWeight={700} fill={COLORS.amber}>
                  Δ
                </text>
              </g>
            );
          })}

          {/* ── Bottom message ── */}
          <text x={CX} y={IMPACT_Y + STATE_BOX_H / 2 + 60} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={600}
            fill={COLORS.cool_silver}
            opacity={interpolate(frame, [20, 26], [0, 0.6], { extrapolateRight: 'clamp' })}>
            Actions leave a mark on the world
          </text>

          {/* ── Caption ── */}
          <CaptionBar
            text="Actions change the environment — that's what makes them real."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
