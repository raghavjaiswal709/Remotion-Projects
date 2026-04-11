/**
 * Scene 14 — Weak Outcomes
 * "Smarter reasoning with weak actions produces weak outcomes."
 * Big brain + small/broken tools = small result.
 * Contrast visualization: powerful thinking vs feeble actions.
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
const TOP_Y = 440;

// ── Big brain visualization (left side) ──────────────────────────────────
const BRAIN_CX = 290;
const BRAIN_CY = 560;
const BRAIN_R = 110;

// ── Brain neural arcs ────────────────────────────────────────────────────
const BRAIN_ARCS = Array.from({ length: 10 }, (_, i) => ({
  r: 30 + i * 10,
  startAngle: i * 36,
  sweep: 70 + (i % 4) * 25,
  strokeW: 2.5 - (i % 3) * 0.4,
  color: [COLORS.warm_blue, COLORS.electric_cyan, COLORS.purple][i % 3],
}));

// ── Brain sparkle particles ──────────────────────────────────────────────
const BRAIN_SPARKLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const r = 50 + (i % 4) * 20;
  return {
    angle,
    r,
    size: 2 + (i % 3) * 1.5,
    phase: i * 0.4,
  };
});

// ── Small/weak tools (right side) ────────────────────────────────────────
const TOOLS_CX = 790;
const TOOLS_CY = 560;

interface WeakTool {
  id: number;
  x: number;
  y: number;
  label: string;
  icon: string;
  broken: boolean;
  delay: number;
  size: number;
}

const WEAK_TOOLS: WeakTool[] = [
  { id: 0, x: -45, y: -50, label: 'api', icon: 'M-6,-6 L6,-6 L6,6 L-6,6 Z', broken: true, delay: 25, size: 28 },
  { id: 1, x: 30, y: -30, label: 'db', icon: 'M-5,-4 A5,3,0,1,1,5,-4 L5,4 A5,3,0,1,1,-5,4 Z', broken: false, delay: 30, size: 24 },
  { id: 2, x: -20, y: 20, label: 'file', icon: 'M-5,-7 L2,-7 L6,-3 L6,7 L-5,7 Z', broken: true, delay: 35, size: 26 },
  { id: 3, x: 40, y: 30, label: 'msg', icon: 'M-6,-5 L6,-5 L6,3 L1,3 L-2,6 L-2,3 L-6,3 Z', broken: false, delay: 40, size: 22 },
];

// ── Plus sign & Equals sign & Result ─────────────────────────────────────
const PLUS_X = 540;
const PLUS_Y = 560;
const RESULT_CX = 540;
const RESULT_CY = 850;

// ── Result: tiny, weak output ────────────────────────────────────────────
const RESULT_R = 30;

// ── Background particles ─────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 161.3 + 40) % 1080,
  y: (i * 207.7 + 60) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.37,
}));

// ── Crack lines on broken tools ──────────────────────────────────────────
const CRACK_PATHS = [
  'M-3,-8 L0,-2 L3,-6 L1,2 L4,8',
  'M-4,-7 L-1,-1 L-4,3 L0,7',
];

// ── Dim glow ring layers behind brain ────────────────────────────────────
const BRAIN_GLOW_RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: BRAIN_R + 10 + i * 12,
  opacity: 0.08 - i * 0.012,
}));

// ── Lightning bolts from brain (power indicators) ────────────────────────
const LIGHTNING_BOLTS = Array.from({ length: 4 }, (_, i) => {
  const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
  return {
    angle,
    startR: BRAIN_R + 5,
    endR: BRAIN_R + 35,
    delay: 15 + i * 6,
  };
});

// ── Comparison labels ────────────────────────────────────────────────────
const COMPARISON = [
  { x: BRAIN_CX, y: TOP_Y - 20, text: '🧠 SMART REASONING', color: COLORS.warm_blue },
  { x: TOOLS_CX, y: TOP_Y - 20, text: '🔧 WEAK ACTIONS', color: COLORS.vibrant_red },
];

export const Scene14_WeakOutcomes: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ─────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const brainScale = scaleAnim(frame, 3, 22, 0.3, 1);
  const toolsEnter = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const equationEnter = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const resultEnter = interpolate(frame, [60, 85], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const brainSpin = frame * 1.5;
  const brainPulse = 0.6 + Math.sin(frame * 0.1) * 0.15;
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const toolShake = toolsEnter > 0.8 ? Math.sin(frame * 0.5) * 2 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="brainGlow14">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feFlood floodColor={COLORS.warm_blue} floodOpacity="0.4" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="weakGlow14">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="brainAura14" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.2" />
              <stop offset="70%" stopColor={COLORS.electric_cyan} stopOpacity="0.05" />
              <stop offset="100%" stopColor={COLORS.warm_blue} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="resultAura14" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.vibrant_red} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.vibrant_red} stopOpacity="0" />
            </radialGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Particles ── */}
          {PARTICLES.map((p, i) => {
            const pulse = Math.sin(frame * 0.03 + p.phase) * 0.2 + 0.3;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill="#9CA3AF" opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="SMART ≠ CAPABLE" fontSize={26}
            color={COLORS.vibrant_red} opacity={enter * 0.85}
            underlineColor={COLORS.vibrant_red} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            Reasoning alone is not enough
          </text>

          {/* ── Comparison labels ── */}
          {COMPARISON.map((cl, i) => (
            <text key={`cl${i}`} x={cl.x} y={cl.y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={15} fontWeight={700} letterSpacing={2}
              fill={cl.color} opacity={enter * 0.75}>
              {cl.text}
            </text>
          ))}

          {/* ── BIG BRAIN (left) ── */}
          <g transform={`translate(${BRAIN_CX}, ${BRAIN_CY}) scale(${brainScale})`}
            opacity={interpolate(frame, [3, 20], [0, 1], { extrapolateRight: 'clamp' })}>

            {/* Aura */}
            <circle cx={0} cy={0} r={BRAIN_R + 50}
              fill="url(#brainAura14)" opacity={brainPulse} />

            {/* Glow rings */}
            {BRAIN_GLOW_RINGS.map((gr, i) => (
              <circle key={`bgr${i}`} cx={0} cy={0} r={gr.r}
                fill="none" stroke={COLORS.warm_blue} strokeWidth={1}
                strokeDasharray="4 8" opacity={gr.opacity * brainPulse} />
            ))}

            {/* Neural arcs */}
            <g transform={`rotate(${brainSpin})`}>
              {BRAIN_ARCS.map((arc, i) => {
                const startRad = (arc.startAngle * Math.PI) / 180;
                const sweepRad = (arc.sweep * Math.PI) / 180;
                const x1 = Math.cos(startRad) * arc.r;
                const y1 = Math.sin(startRad) * arc.r;
                const x2 = Math.cos(startRad + sweepRad) * arc.r;
                const y2 = Math.sin(startRad + sweepRad) * arc.r;
                const largeArc = arc.sweep > 180 ? 1 : 0;
                return (
                  <path key={`ba${i}`}
                    d={`M${x1},${y1} A${arc.r},${arc.r} 0 ${largeArc},1 ${x2},${y2}`}
                    fill="none" stroke={arc.color} strokeWidth={arc.strokeW}
                    strokeLinecap="round" opacity={0.6 + brainPulse * 0.15}
                    filter="url(#brainGlow14)" />
                );
              })}
            </g>

            {/* Brain sparkles */}
            {BRAIN_SPARKLES.map((bs, i) => {
              const pulse = Math.sin(frame * 0.15 + bs.phase) * 0.4 + 0.6;
              const bsx = Math.cos(bs.angle + frame * 0.02) * bs.r;
              const bsy = Math.sin(bs.angle + frame * 0.02) * bs.r;
              return (
                <circle key={`bs${i}`} cx={bsx} cy={bsy} r={bs.size}
                  fill={COLORS.electric_cyan} opacity={pulse * 0.35} />
              );
            })}

            {/* Center */}
            <circle cx={0} cy={0} r={15} fill={COLORS.warm_blue} opacity={0.6}
              filter="url(#brainGlow14)" />
            <text y={5} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={10} fontWeight={800} fill={COLORS.soft_white}>
              AI
            </text>

            {/* Lightning bolts */}
            {LIGHTNING_BOLTS.map((lb, i) => {
              const lbOp = interpolate(frame, [lb.delay, lb.delay + 8], [0, 0.5], { extrapolateRight: 'clamp' });
              const lx1 = Math.cos(lb.angle) * lb.startR;
              const ly1 = Math.sin(lb.angle) * lb.startR;
              const lx2 = Math.cos(lb.angle) * lb.endR;
              const ly2 = Math.sin(lb.angle) * lb.endR;
              return (
                <line key={`lb${i}`} x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                  stroke={COLORS.electric_cyan} strokeWidth={2}
                  strokeLinecap="round" opacity={lbOp * brainPulse} />
              );
            })}

            {/* BIG label */}
            <text y={BRAIN_R + 35} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={4}
              fill={COLORS.warm_blue} opacity={0.7}>
              POWERFUL
            </text>
          </g>

          {/* ── PLUS SIGN ── */}
          <g transform={`translate(${PLUS_X}, ${PLUS_Y})`} opacity={equationEnter}>
            <circle cx={0} cy={0} r={25} fill="none"
              stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={0.4} />
            <text textAnchor="middle" y={8}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={32} fontWeight={300} fill={COLORS.cool_silver}>
              +
            </text>
          </g>

          {/* ── WEAK TOOLS (right) ── */}
          <g transform={`translate(${TOOLS_CX + toolShake}, ${TOOLS_CY})`}
            opacity={toolsEnter}>

            {/* Faded bg circle */}
            <circle cx={0} cy={0} r={85}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
              strokeDasharray="6 8" opacity={0.2} />

            {WEAK_TOOLS.map((wt) => {
              const wtEnter = interpolate(frame, [wt.delay, wt.delay + 12], [0, 1],
                { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={`wt${wt.id}`}
                  transform={`translate(${wt.x}, ${wt.y})`}
                  opacity={wtEnter}>
                  <circle cx={0} cy={0} r={wt.size}
                    fill={COLORS.bg_paper} stroke={COLORS.vibrant_red}
                    strokeWidth={1} opacity={0.6} />
                  <path d={wt.icon} fill="none" stroke="#9CA3AF"
                    strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
                  {/* Cracks on broken tools */}
                  {wt.broken && (
                    <path d={CRACK_PATHS[wt.id % 2]}
                      fill="none" stroke={COLORS.vibrant_red}
                      strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
                  )}
                  <text y={wt.size + 14} textAnchor="middle"
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={9} fontWeight={600} fill="#9CA3AF" opacity={0.5}>
                    {wt.label}
                  </text>
                </g>
              );
            })}

            {/* WEAK label */}
            <text y={100} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={4}
              fill={COLORS.vibrant_red} opacity={0.6}>
              WEAK
            </text>
          </g>

          {/* ── EQUALS & ARROW DOWN ── */}
          <g opacity={equationEnter}>
            <text x={CX} y={720} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={30} fontWeight={300} fill={COLORS.cool_silver} opacity={0.6}>
              ↓
            </text>
            <text x={CX} y={760} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={700} letterSpacing={4}
              fill="#9CA3AF" opacity={0.5}>
              PRODUCES
            </text>
          </g>

          {/* ── WEAK RESULT ── */}
          <g transform={`translate(${RESULT_CX}, ${RESULT_CY})`}
            opacity={resultEnter}>
            {/* Sad aura */}
            <circle cx={0} cy={0} r={RESULT_R + 30}
              fill="url(#resultAura14)" opacity={0.5} />
            {/* Tiny result circle */}
            <circle cx={0} cy={0} r={RESULT_R}
              fill={COLORS.bg_paper} stroke={COLORS.vibrant_red}
              strokeWidth={2} opacity={0.7} />
            <text textAnchor="middle" y={6}
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={20} fontWeight={700} fill={COLORS.vibrant_red} opacity={0.7}>
              WEAK
            </text>
            <text y={RESULT_R + 30} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={14} fontWeight={600} letterSpacing={3}
              fill={COLORS.vibrant_red} opacity={0.5}>
              OUTCOME
            </text>
          </g>

          {/* ── Bottom message ── */}
          <g opacity={interpolate(frame, [75, 95], [0, 1], { extrapolateRight: 'clamp' })}>
            <line x1={280} y1={1010} x2={800} y2={1010}
              stroke={COLORS.vibrant_red} strokeWidth={0.5} opacity={0.15} />
            <text x={540} y={1060} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill={COLORS.cool_silver} opacity={0.65}>
              Intelligence is bottlenecked by actions
            </text>
            <text x={540} y={1098} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              No matter how smart the reasoning
            </text>
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="Smarter reasoning with weak actions produces weak outcomes."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
