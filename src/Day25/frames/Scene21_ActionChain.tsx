/**
 * Scene 21 — Action Chain
 * Chain of actions: one leads to next, cascading effects.
 * Domino / chain-reaction visual with sequential triggers.
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
const CHAIN_TOP = 380;
const DOMINO_W = 90;
const DOMINO_H = 150;

// ── Chain links (dominoes) ───────────────────────────────────────────────
interface ChainLink {
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  delay: number;
}

const CHAIN_LINKS: ChainLink[] = [
  { label: 'SEARCH', sublabel: 'Find data', icon: '🔍', color: COLORS.electric_cyan,
    x: CX - 360, y: CHAIN_TOP, delay: 2 },
  { label: 'PARSE', sublabel: 'Extract info', icon: '📊', color: COLORS.warm_blue,
    x: CX - 180, y: CHAIN_TOP + 80, delay: 5 },
  { label: 'COMPUTE', sublabel: 'Run logic', icon: '⚙️', color: COLORS.amber,
    x: CX, y: CHAIN_TOP + 160, delay: 8 },
  { label: 'STORE', sublabel: 'Save result', icon: '💾', color: COLORS.vibrant_green,
    x: CX + 180, y: CHAIN_TOP + 80, delay: 11 },
  { label: 'NOTIFY', sublabel: 'Send alert', icon: '📡', color: COLORS.purple,
    x: CX + 360, y: CHAIN_TOP, delay: 14 },
];

// ── Connecting arrows between links ──────────────────────────────────────
const CHAIN_ARROWS = CHAIN_LINKS.slice(0, -1).map((link, i) => ({
  from: { x: link.x, y: link.y },
  to: { x: CHAIN_LINKS[i + 1].x, y: CHAIN_LINKS[i + 1].y },
  delay: link.delay + 2,
}));

// ── Cascade effect particles ─────────────────────────────────────────────
const CASCADE_PARTICLES = CHAIN_LINKS.flatMap((link) =>
  Array.from({ length: 6 }, (_, pi) => {
    const angle = (pi / 6) * Math.PI * 2;
    return {
      cx: link.x,
      cy: link.y,
      angle,
      r: 60 + (pi % 3) * 15,
      delay: link.delay + 1,
      size: 2 + (pi % 2),
      color: link.color,
    };
  })
);

// ── Background grid lines ────────────────────────────────────────────────
const BG_H_LINES = Array.from({ length: 10 }, (_, i) => ({
  y: 320 + i * 130,
  opacity: 0.04 + (i % 2) * 0.02,
}));

const BG_V_LINES = Array.from({ length: 6 }, (_, i) => ({
  x: 140 + i * 170,
  opacity: 0.03 + (i % 2) * 0.01,
}));

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 147.9 + 50) % 1080,
  y: (i * 201.3 + 40) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.29,
}));

// ── Ripple per domino on trigger ─────────────────────────────────────────
const TRIGGER_RIPPLES = CHAIN_LINKS.map((link) => ({
  x: link.x,
  y: link.y,
  delay: link.delay + 0.5,
  maxR: 70,
}));

// ── "Cascade" label position ─────────────────────────────────────────────
const CASCADE_LABEL_Y = CHAIN_TOP + 340;

// ── Result box (at end of chain) ─────────────────────────────────────────
const RESULT_Y = CHAIN_TOP + 460;

// ── Small step numbers ───────────────────────────────────────────────────
const STEP_NUMBERS = CHAIN_LINKS.map((link, i) => ({
  x: link.x,
  y: link.y - DOMINO_H / 2 - 18,
  num: `0${i + 1}`,
  delay: link.delay,
}));

// ── Connection highlight path ────────────────────────────────────────────
const pathPoints = CHAIN_LINKS.map(l => `${l.x},${l.y}`).join(' ');

// ── Domino tilt animation ────────────────────────────────────────────────
const TILT_ANGLE = 15;

// ── Bottom summary indicators ────────────────────────────────────────────
const SUMMARY_ITEMS = [
  { label: 'Actions', value: '5', x: CX - 200, delay: 20 },
  { label: 'Cascaded', value: '4→', x: CX, delay: 22 },
  { label: 'Result', value: '✓', x: CX + 200, delay: 24 },
];

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene21_ActionChain: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  // ── Active chain progress ──────────────────────────────────────────────
  const chainProgress = interpolate(frame, [2, 22], [0, 5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="chainGlow21" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow21" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="chainArrow21" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.4" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="dominoAura21" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.1" />
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

          {/* ── Grid lines ── */}
          {BG_H_LINES.map((hl, i) => (
            <line key={`bh${i}`} x1={40} y1={hl.y} x2={1040} y2={hl.y}
              stroke={COLORS.cool_silver} strokeWidth={0.4}
              opacity={enter * hl.opacity} />
          ))}
          {BG_V_LINES.map((vl, i) => (
            <line key={`bv${i}`} x1={vl.x} y1={300} x2={vl.x} y2={1200}
              stroke={COLORS.cool_silver} strokeWidth={0.3}
              opacity={enter * vl.opacity} />
          ))}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="ACTION CHAIN" fontSize={28}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          <text x={CX} y={250} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={15} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.4}>
            ONE ACTION TRIGGERS THE NEXT
          </text>

          {/* ── Connection path (background) ── */}
          <polyline points={pathPoints}
            fill="none" stroke={COLORS.cool_silver}
            strokeWidth={1} opacity={enter * 0.08}
            strokeDasharray="6 10" />

          {/* ═══════════════ CHAIN ARROWS ═══════════════ */}
          {CHAIN_ARROWS.map((ca, i) => {
            const caOp = interpolate(frame, [ca.delay, ca.delay + 4], [0, 0.5],
              { extrapolateRight: 'clamp', easing: ease });
            const dashOff = -frame * 2.5;
            return (
              <g key={`ca${i}`}>
                <line x1={ca.from.x + DOMINO_W / 2 + 5} y1={ca.from.y}
                  x2={ca.to.x - DOMINO_W / 2 - 5} y2={ca.to.y}
                  stroke={CHAIN_LINKS[i].color} strokeWidth={2}
                  strokeDasharray="6 4" strokeDashoffset={dashOff}
                  opacity={caOp} />
                {/* Arrow tip */}
                <circle cx={ca.to.x - DOMINO_W / 2 - 8} cy={ca.to.y} r={4}
                  fill={CHAIN_LINKS[i + 1].color} opacity={caOp * 0.6} />
              </g>
            );
          })}

          {/* ═══════════════ TRIGGER RIPPLES ═══════════════ */}
          {TRIGGER_RIPPLES.map((tr, i) => {
            const trScale = interpolate(frame, [tr.delay, tr.delay + 6], [0.3, 1.2],
              { extrapolateRight: 'clamp', easing: ease });
            const trOp = interpolate(frame, [tr.delay, tr.delay + 3, tr.delay + 6],
              [0, 0.25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <circle key={`tr${i}`} cx={tr.x} cy={tr.y} r={tr.maxR * trScale}
                fill="none" stroke={CHAIN_LINKS[i].color}
                strokeWidth={1.5} opacity={trOp} />
            );
          })}

          {/* ═══════════════ DOMINOS (CHAIN LINKS) ═══════════════ */}
          {CHAIN_LINKS.map((link, i) => {
            const linkOp = interpolate(frame, [link.delay, link.delay + 4], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const isActive = chainProgress > i && chainProgress <= i + 1;
            const isDone = chainProgress > i + 1;
            const tiltDeg = isDone
              ? interpolate(frame, [link.delay + 2, link.delay + 5], [0, TILT_ANGLE],
                  { extrapolateRight: 'clamp', easing: ease })
              : 0;
            const borderColor = isDone ? COLORS.vibrant_green
              : isActive ? link.color : '#4B5563';
            const activePulse = isActive ? (0.8 + pulse * 0.2) : 1;

            return (
              <g key={`link${i}`} opacity={linkOp}
                transform={`translate(${link.x}, ${link.y}) rotate(${tiltDeg})`}>

                {/* Aura */}
                <circle cx={0} cy={0} r={80}
                  fill="url(#dominoAura21)"
                  opacity={(isActive || isDone) ? 0.8 : 0.2} />

                {/* Domino body */}
                <rect x={-DOMINO_W / 2} y={-DOMINO_H / 2}
                  width={DOMINO_W} height={DOMINO_H} rx={10}
                  fill={COLORS.deep_black} stroke={borderColor}
                  strokeWidth={isDone ? 2 : 1.5}
                  opacity={0.9 * activePulse} />

                {/* Inner border */}
                <rect x={-DOMINO_W / 2 + 4} y={-DOMINO_H / 2 + 4}
                  width={DOMINO_W - 8} height={DOMINO_H - 8} rx={7}
                  fill="none" stroke={link.color}
                  strokeWidth={0.5} opacity={0.2} />

                {/* Icon */}
                <text textAnchor="middle" y={-15}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={26} fill={link.color} opacity={activePulse}>
                  {link.icon}
                </text>

                {/* Label */}
                <text textAnchor="middle" y={18}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={12} fontWeight={800} letterSpacing={2}
                  fill={link.color}>
                  {link.label}
                </text>

                {/* Sublabel */}
                <text textAnchor="middle" y={38}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={9} fontWeight={500}
                  fill={COLORS.cool_silver} opacity={0.4}>
                  {link.sublabel}
                </text>

                {/* Status dot */}
                <circle cx={DOMINO_W / 2 - 12} cy={-DOMINO_H / 2 + 12} r={4}
                  fill={isDone ? COLORS.vibrant_green
                    : isActive ? link.color : '#4B5563'}
                  opacity={0.7} />
              </g>
            );
          })}

          {/* ── Step numbers ── */}
          {STEP_NUMBERS.map((sn, i) => {
            const snOp = interpolate(frame, [sn.delay, sn.delay + 3], [0, 0.5],
              { extrapolateRight: 'clamp' });
            return (
              <text key={`sn${i}`} x={sn.x} y={sn.y} textAnchor="middle"
                fontFamily="SF Mono, Menlo, monospace"
                fontSize={10} fontWeight={700} letterSpacing={1.5}
                fill={CHAIN_LINKS[i].color} opacity={snOp}>
                {sn.num}
              </text>
            );
          })}

          {/* ── Cascade particles ── */}
          {CASCADE_PARTICLES.map((cp, i) => {
            const cpT = interpolate(frame, [cp.delay, cp.delay + 6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            const cpX = cp.cx + Math.cos(cp.angle) * cp.r * cpT;
            const cpY = cp.cy + Math.sin(cp.angle) * cp.r * cpT;
            const cpOp = cpT > 0 && cpT < 0.85 ? (1 - cpT) * 0.35 : 0;
            return (
              <circle key={`cp${i}`} cx={cpX} cy={cpY} r={cp.size}
                fill={cp.color} opacity={cpOp} />
            );
          })}

          {/* ── Cascade label ── */}
          <text x={CX} y={CASCADE_LABEL_Y} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={18} fontWeight={700} letterSpacing={4}
            fill={COLORS.electric_cyan}
            opacity={interpolate(frame, [16, 22], [0, 0.7], { extrapolateRight: 'clamp' })}>
            CASCADING ACTIONS
          </text>

          {/* ── Result box ── */}
          <g opacity={interpolate(frame, [22, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease })}>
            <rect x={CX - 180} y={RESULT_Y - 25} width={360} height={50}
              rx={25} fill={COLORS.deep_black} stroke={COLORS.vibrant_green}
              strokeWidth={1.5} />
            <text x={CX} y={RESULT_Y + 6} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={15} fontWeight={700} letterSpacing={3}
              fill={COLORS.vibrant_green}>
              CHAIN COMPLETE ✓
            </text>
          </g>

          {/* ── Summary indicators ── */}
          {SUMMARY_ITEMS.map((si, i) => {
            const siOp = interpolate(frame, [si.delay, si.delay + 4], [0, 0.6],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`si${i}`} opacity={siOp}>
                <text x={si.x} y={RESULT_Y + 70} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={20} fontWeight={700}
                  fill={COLORS.electric_cyan}>
                  {si.value}
                </text>
                <text x={si.x} y={RESULT_Y + 90} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={9} fontWeight={600} letterSpacing={1.5}
                  fill={COLORS.cool_silver} opacity={0.4}>
                  {si.label}
                </text>
              </g>
            );
          })}

          {/* ── Caption ── */}
          <CaptionBar
            text="One action triggers the next — a cascading chain of effects."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
