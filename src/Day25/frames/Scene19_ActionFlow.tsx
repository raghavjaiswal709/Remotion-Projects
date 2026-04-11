/**
 * Scene 19 — Action Flow
 * Agent decides → Tool executes → Result returns
 * 3-step pipeline with animated flow lines and data pulses.
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
const PIPELINE_TOP = 440;
const STEP_GAP = 360;
const NODE_R = 70;

// ── Pipeline steps ───────────────────────────────────────────────────────
interface PipelineStep {
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  y: number;
  delay: number;
}

const STEPS: PipelineStep[] = [
  { label: 'DECIDE', sublabel: 'Agent selects action', icon: '🧠', color: COLORS.warm_blue, y: PIPELINE_TOP, delay: 2 },
  { label: 'EXECUTE', sublabel: 'Tool runs the action', icon: '⚡', color: COLORS.electric_cyan, y: PIPELINE_TOP + STEP_GAP, delay: 6 },
  { label: 'RETURN', sublabel: 'Result comes back', icon: '📋', color: COLORS.vibrant_green, y: PIPELINE_TOP + STEP_GAP * 2, delay: 10 },
];

// ── Flow arrows between steps ────────────────────────────────────────────
const FLOW_ARROWS = [
  { fromY: PIPELINE_TOP + NODE_R + 20, toY: PIPELINE_TOP + STEP_GAP - NODE_R - 20, delay: 5 },
  { fromY: PIPELINE_TOP + STEP_GAP + NODE_R + 20, toY: PIPELINE_TOP + STEP_GAP * 2 - NODE_R - 20, delay: 9 },
];

// ── Data pulses along the flow ───────────────────────────────────────────
const PULSES_PER_ARROW = 4;
const DATA_PULSES = FLOW_ARROWS.flatMap((arrow, ai) =>
  Array.from({ length: PULSES_PER_ARROW }, (_, pi) => ({
    arrowIdx: ai,
    fromY: arrow.fromY,
    toY: arrow.toY,
    delay: arrow.delay + pi * 1.5,
    size: 4 + (pi % 2) * 2,
    phase: pi * 0.4,
  }))
);

// ── Side annotations for each step ───────────────────────────────────────
const ANNOTATIONS = [
  { text: '"Call the search API"', x: CX + 200, y: PIPELINE_TOP + 10, delay: 4, color: COLORS.warm_blue },
  { text: 'fetch("api.example.com")', x: CX + 200, y: PIPELINE_TOP + STEP_GAP + 10, delay: 8, color: COLORS.electric_cyan },
  { text: '{ results: [...] }', x: CX + 200, y: PIPELINE_TOP + STEP_GAP * 2 + 10, delay: 12, color: COLORS.vibrant_green },
];

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 163.7 + 30) % 1080,
  y: (i * 211.3 + 50) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.35,
}));

// ── Background circuit lines ─────────────────────────────────────────────
const CIRCUIT_H_LINES = Array.from({ length: 8 }, (_, i) => ({
  y: 350 + i * 160,
  x1: 30 + (i % 3) * 20,
  x2: 180 + (i % 2) * 60,
  delay: 3 + i * 0.7,
}));

const CIRCUIT_V_LINES = Array.from({ length: 6 }, (_, i) => ({
  x: 60 + i * 190,
  y1: 400 + (i % 2) * 100,
  y2: 500 + (i % 3) * 200,
  delay: 4 + i * 0.5,
}));

// ── Ripple rings per node ────────────────────────────────────────────────
const NODE_RIPPLES = Array.from({ length: 3 }, (_, i) => ({
  r: NODE_R + 15 + i * 18,
  delay_offset: i * 2,
}));

// ── Small status indicators ──────────────────────────────────────────────
const STATUS_DOTS = [
  { x: CX - 120, y: PIPELINE_TOP - 8, color: COLORS.warm_blue, label: '01' },
  { x: CX - 120, y: PIPELINE_TOP + STEP_GAP - 8, color: COLORS.electric_cyan, label: '02' },
  { x: CX - 120, y: PIPELINE_TOP + STEP_GAP * 2 - 8, color: COLORS.vibrant_green, label: '03' },
];

// ── Arrow head helper ────────────────────────────────────────────────────
const arrowHead = (cx: number, cy: number, size: number, color: string, op: number) => (
  <g opacity={op}>
    <polygon
      points={`${cx},${cy} ${cx - size},${cy - size * 1.5} ${cx + size},${cy - size * 1.5}`}
      fill={color} />
  </g>
);

// ── Timeline bar helper ──────────────────────────────────────────────────
const TIMELINE_X = 110;
const TIMELINE_Y1 = PIPELINE_TOP - 30;
const TIMELINE_Y2 = PIPELINE_TOP + STEP_GAP * 2 + 30;

// ── Decorative brackets per node ─────────────────────────────────────────
const nodeBrackets = (r: number, color: string, op: number) => {
  const s = 12;
  return (
    <g opacity={op} stroke={color} strokeWidth={1} fill="none" strokeLinecap="round">
      <polyline points={`${-r - 8},${-r + s} ${-r - 8},${-r - 4} ${-r + s - 8},${-r - 4}`} />
      <polyline points={`${r - s + 8},${-r - 4} ${r + 8},${-r - 4} ${r + 8},${-r + s}`} />
      <polyline points={`${-r - 8},${r - s} ${-r - 8},${r + 4} ${-r + s - 8},${r + 4}`} />
      <polyline points={`${r - s + 8},${r + 4} ${r + 8},${r + 4} ${r + 8},${r - s}`} />
    </g>
  );
};

// ── Orbit dots ───────────────────────────────────────────────────────────
const orbitDots = (cx: number, cy: number, r: number, count: number, frame: number, color: string, op: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + frame * 0.05;
    return (
      <circle key={`orb${cx}_${i}`}
        cx={cx + Math.cos(angle) * r}
        cy={cy + Math.sin(angle) * r}
        r={1.8} fill={color} opacity={op * 0.4} />
    );
  });

// ── Glow effect behind nodes ─────────────────────────────────────────────
const nodeGlow = (color: string) => (
  <radialGradient id={`glow_${color.replace('#', '')}`} cx="50%" cy="50%" r="50%">
    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
    <stop offset="100%" stopColor={color} stopOpacity="0" />
  </radialGradient>
);

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene19_ActionFlow: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="nodeGlow19" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow19" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {nodeGlow(COLORS.warm_blue)}
            {nodeGlow(COLORS.electric_cyan)}
            {nodeGlow(COLORS.vibrant_green)}
            <linearGradient id="flowLine19" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.6" />
              <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="0.2" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.6" />
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

          {/* ── Circuit lines (background texture) ── */}
          {CIRCUIT_H_LINES.map((cl, i) => {
            const clOp = interpolate(frame, [cl.delay, cl.delay + 4], [0, 0.06],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`ch${i}`} x1={cl.x1} y1={cl.y} x2={cl.x2} y2={cl.y}
                stroke={COLORS.electric_cyan} strokeWidth={0.6} opacity={clOp} />
            );
          })}
          {CIRCUIT_V_LINES.map((cl, i) => {
            const clOp = interpolate(frame, [cl.delay, cl.delay + 4], [0, 0.05],
              { extrapolateRight: 'clamp' });
            return (
              <line key={`cv${i}`} x1={cl.x} y1={cl.y1} x2={cl.x} y2={cl.y2}
                stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={clOp} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={CX} y={200} text="ACTION FLOW" fontSize={28}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          <text x={CX} y={250} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={15} fontWeight={500} letterSpacing={3}
            fill={COLORS.cool_silver} opacity={enter * 0.4}>
            DECIDE → EXECUTE → RETURN
          </text>

          {/* ── Timeline bar (left side) ── */}
          <line x1={TIMELINE_X} y1={TIMELINE_Y1} x2={TIMELINE_X} y2={TIMELINE_Y2}
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={enter * 0.12}
            strokeDasharray="4 8" />

          {/* ── Status dots ── */}
          {STATUS_DOTS.map((sd, i) => {
            const sdOp = interpolate(frame, [STEPS[i].delay, STEPS[i].delay + 4], [0, 0.8],
              { extrapolateRight: 'clamp' });
            return (
              <g key={`sd${i}`} opacity={sdOp}>
                <circle cx={TIMELINE_X} cy={sd.y} r={8}
                  fill={COLORS.deep_black} stroke={sd.color} strokeWidth={1.5} />
                <text x={TIMELINE_X} y={sd.y + 4} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={8} fontWeight={700} fill={sd.color}>
                  {sd.label}
                </text>
              </g>
            );
          })}

          {/* ═══════════════ FLOW ARROWS ═══════════════ */}
          {FLOW_ARROWS.map((fa, i) => {
            const arrowOp = interpolate(frame, [fa.delay, fa.delay + 4], [0, 0.5],
              { extrapolateRight: 'clamp', easing: ease });
            const dashOffset = -frame * 3;
            return (
              <g key={`fa${i}`}>
                <line x1={CX} y1={fa.fromY} x2={CX} y2={fa.toY}
                  stroke={COLORS.electric_cyan} strokeWidth={2}
                  strokeDasharray="8 6" strokeDashoffset={dashOffset}
                  opacity={arrowOp} />
                {arrowHead(CX, fa.toY + 6, 6, COLORS.electric_cyan, arrowOp)}
              </g>
            );
          })}

          {/* ── Data pulses ── */}
          {DATA_PULSES.map((dp, i) => {
            const t = interpolate(frame, [dp.delay, dp.delay + 6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            const py = dp.fromY + (dp.toY - dp.fromY) * t;
            const dpOp = t > 0 && t < 1 ? 0.6 : 0;
            return (
              <circle key={`dp${i}`} cx={CX} cy={py} r={dp.size}
                fill={COLORS.electric_cyan} opacity={dpOp}
                filter="url(#softGlow19)" />
            );
          })}

          {/* ═══════════════ PIPELINE NODES ═══════════════ */}
          {STEPS.map((step, i) => {
            const nodeOp = interpolate(frame, [step.delay, step.delay + 6], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const nodeScale = interpolate(frame, [step.delay, step.delay + 6], [0.8, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const iconPulse = Math.sin(frame * 0.12 + i * 1.2) * 0.2 + 0.8;

            return (
              <g key={`node${i}`} opacity={nodeOp}
                transform={`translate(${CX}, ${step.y}) scale(${nodeScale})`}>

                {/* Glow aura */}
                <circle cx={0} cy={0} r={NODE_R + 40}
                  fill={`url(#glow_${step.color.replace('#', '')})`} opacity={pulse} />

                {/* Ripple rings */}
                {NODE_RIPPLES.map((nr, ri) => {
                  const nrOp = interpolate(frame,
                    [step.delay + nr.delay_offset, step.delay + nr.delay_offset + 4],
                    [0, 0.12], { extrapolateRight: 'clamp' });
                  return (
                    <circle key={`nr${i}_${ri}`} cx={0} cy={0} r={nr.r}
                      fill="none" stroke={step.color} strokeWidth={1}
                      opacity={nrOp * pulse} strokeDasharray="4 8" />
                  );
                })}

                {/* Node background */}
                <circle cx={0} cy={0} r={NODE_R} fill={COLORS.deep_black}
                  stroke={step.color} strokeWidth={2.5} />

                {/* Inner ring */}
                <circle cx={0} cy={0} r={NODE_R - 10} fill="none"
                  stroke={step.color} strokeWidth={0.8} opacity={0.25}
                  strokeDasharray="3 5" />

                {/* Brackets */}
                {nodeBrackets(NODE_R - 4, step.color, 0.3)}

                {/* Icon */}
                <text textAnchor="middle" y={-6}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={28} fill={step.color} opacity={iconPulse}>
                  {step.icon}
                </text>

                {/* Label */}
                <text textAnchor="middle" y={22}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={14} fontWeight={800} letterSpacing={3}
                  fill={step.color}>
                  {step.label}
                </text>

                {/* Orbit dots */}
                {orbitDots(0, 0, NODE_R + 8, 4, frame + i * 10, step.color, nodeOp)}
              </g>
            );
          })}

          {/* ═══════════════ ANNOTATIONS ═══════════════ */}
          {ANNOTATIONS.map((ann, i) => {
            const annOp = interpolate(frame, [ann.delay, ann.delay + 5], [0, 0.7],
              { extrapolateRight: 'clamp', easing: ease });
            const annX = interpolate(frame, [ann.delay, ann.delay + 5], [ann.x + 30, ann.x],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={`ann${i}`} opacity={annOp}>
                {/* Connection line to node */}
                <line x1={CX + NODE_R + 15} y1={ann.y} x2={annX - 10} y2={ann.y}
                  stroke={ann.color} strokeWidth={0.8}
                  strokeDasharray="3 5" opacity={0.3} />
                {/* Code box */}
                <rect x={annX - 8} y={ann.y - 14} width={230} height={28}
                  rx={6} fill={COLORS.deep_black} stroke={ann.color}
                  strokeWidth={0.8} opacity={0.7} />
                <text x={annX + 6} y={ann.y + 4}
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={11} fontWeight={500} fill={ann.color} opacity={0.8}>
                  {ann.text}
                </text>
              </g>
            );
          })}

          {/* ── Sub-label ── */}
          <text x={CX} y={PIPELINE_TOP + STEP_GAP * 2 + 130} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={15} fontWeight={500}
            fill={COLORS.cool_silver}
            opacity={interpolate(frame, [18, 24], [0, 0.5], { extrapolateRight: 'clamp' })}>
            Every action follows this pipeline
          </text>

          {/* ── Caption ── */}
          <CaptionBar
            text="Agent decides, tool executes, result returns."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
