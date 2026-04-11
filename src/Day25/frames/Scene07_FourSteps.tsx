/**
 * Scene 07 — Four Steps
 * "The agent loop has four steps, perceive, think, act, observe."
 * Full loop diagram with 4 nodes. The ACT step glows brightest & is highlighted.
 * Animated connecting arrows, data flow, decorative concentric rings.
 * Duration: 160 frames (~5.33s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Loop layout ───────────────────────────────────────────────────────────
const CX = 540;
const CY = 740;
const LOOP_R = 260;
const NODE_R = 56;

// ── Node definitions (clockwise from top) ─────────────────────────────────
interface StepNode {
  label: string;
  number: string;
  angle: number;
  color: string;
  icon: string;
  desc: string;
  isACT: boolean;
}

const STEPS: StepNode[] = [
  {
    label: 'PERCEIVE', number: '1', angle: -Math.PI / 2,
    color: COLORS.vibrant_green,
    icon: 'M-10,-7 C-10,-15 10,-15 10,-7 M-6,1 A3,3,0,1,0,-6,1.01 M6,1 A3,3,0,1,0,6,1.01',
    desc: 'Take in data', isACT: false,
  },
  {
    label: 'THINK', number: '2', angle: 0,
    color: COLORS.warm_blue,
    icon: 'M-8,-10 C0,-18 0,2 8,-6 M-8,2 C0,-6 0,14 8,6 M-6,10 L6,10',
    desc: 'Reason & plan', isACT: false,
  },
  {
    label: 'ACT', number: '3', angle: Math.PI / 2,
    color: COLORS.amber,
    icon: 'M0,-14 L0,8 M-8,0 L0,8 L8,0 M-10,12 L10,12',
    desc: 'Execute action', isACT: true,
  },
  {
    label: 'OBSERVE', number: '4', angle: Math.PI,
    color: COLORS.purple,
    icon: 'M-12,0 A12,8,0,1,1,12,0 M-12,0 A12,8,0,1,0,12,0 M0,-5 L0,5',
    desc: 'Get feedback', isACT: false,
  },
];

// ── Connecting arrow pairs ───────────────────────────────────────────────
const ARROW_PAIRS = STEPS.map((_, i) => ({ from: i, to: (i + 1) % 4 }));

// ── Data flow particles ──────────────────────────────────────────────────
const FLOW_DOTS = Array.from({ length: 28 }, (_, i) => ({
  pathIdx: i % 4,
  tOff: (i % 7) / 7,
  size: 2 + (i % 3),
  speed: 0.02 + (i % 4) * 0.004,
}));

// ── Guide rings ──────────────────────────────────────────────────────────
const GUIDE_RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: 150 + i * 45,
  dash: '4 10',
  opacity: 0.025 + (i === 2 ? 0.015 : 0),
}));

// ── Radial ticks ─────────────────────────────────────────────────────────
const RADIAL_TICKS = Array.from({ length: 32 }, (_, i) => ({
  angle: (i / 32) * Math.PI * 2,
  inner: LOOP_R + 15,
  len: 6 + (i % 4) * 3,
}));

// ── Background constellation ─────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 149.3 + 25) % 1080,
  y: (i * 207.1 + 35) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.51,
}));

// ── ACT highlight burst particles ────────────────────────────────────────
const ACT_BURST = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  dist: NODE_R + 20 + (i % 4) * 12,
  size: 2 + (i % 3),
}));

// ── Step sequence indicator dots ─────────────────────────────────────────
const SEQ_DOTS = Array.from({ length: 4 }, (_, i) => ({
  x: 420 + i * 80,
  y: 1140,
  label: STEPS[i].label,
  color: STEPS[i].color,
}));

export const Scene07_FourSteps: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopScale = scaleAnim(frame, 5, 40, 0.4, 1);
  const loopOpacity = interpolate(frame, [5, 35], [0, 1], { extrapolateRight: 'clamp' });
  const actGlow = 0.5 + Math.sin(frame * 0.12) * 0.35;
  const rotAngle = frame * 0.12;
  const captionOp = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

  // Step-by-step highlight (each step lights up sequentially)
  const stepHighlights = STEPS.map((_, i) => {
    const start = 30 + i * 22;
    return interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.25} />

          {/* ── Background stars ── */}
          {STARS.map((s, i) => {
            const pulse = Math.sin(frame * 0.04 + s.phase) * 0.3 + 0.5;
            return (
              <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r}
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.05} />
            );
          })}

          {/* ── Section title ── */}
          <SectionLabel x={540} y={200} text="THE FOUR STEPS" fontSize={28}
            color={COLORS.warm_blue} opacity={enter * 0.85}
            underlineColor={COLORS.electric_cyan} />

          <text x={540} y={248} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={4}
            fill={COLORS.cool_silver} opacity={enter * 0.5}>
            PERCEIVE → THINK → ACT → OBSERVE
          </text>

          {/* ── Main loop group ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${loopScale})`} opacity={loopOpacity}>

            {/* Guide rings */}
            {GUIDE_RINGS.map((gr, i) => (
              <circle key={`gr${i}`} cx={0} cy={0} r={gr.r}
                fill="none" stroke={COLORS.cool_silver} strokeWidth={0.7}
                strokeDasharray={gr.dash} opacity={gr.opacity * 4} />
            ))}

            {/* Radial ticks */}
            {RADIAL_TICKS.map((t, i) => (
              <line key={`rt${i}`}
                x1={Math.cos(t.angle) * t.inner}
                y1={Math.sin(t.angle) * t.inner}
                x2={Math.cos(t.angle) * (t.inner + t.len)}
                y2={Math.sin(t.angle) * (t.inner + t.len)}
                stroke={COLORS.cool_silver} strokeWidth={0.5}
                opacity={0.06} />
            ))}

            {/* Main orbit circle */}
            <circle cx={0} cy={0} r={LOOP_R}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={2}
              strokeDasharray="12 6" opacity={0.2}
              transform={`rotate(${rotAngle})`} />

            {/* Inner decorative orbit */}
            <circle cx={0} cy={0} r={LOOP_R - 35}
              fill="none" stroke={COLORS.warm_blue} strokeWidth={0.7}
              opacity={0.08} />

            {/* ── Arrow arcs between nodes ── */}
            {ARROW_PAIRS.map((pair, i) => {
              const fromN = STEPS[pair.from];
              const toN = STEPS[pair.to];
              const fx = Math.cos(fromN.angle) * LOOP_R;
              const fy = Math.sin(fromN.angle) * LOOP_R;
              const tx = Math.cos(toN.angle) * LOOP_R;
              const ty = Math.sin(toN.angle) * LOOP_R;
              const midA = (fromN.angle + toN.angle) / 2;
              const bulge = 45;
              const mx = Math.cos(midA) * (LOOP_R + bulge);
              const my = Math.sin(midA) * (LOOP_R + bulge);
              const aOp = interpolate(frame, [18 + i * 8, 42 + i * 8], [0, 0.35], { extrapolateRight: 'clamp' });
              return (
                <path key={`arr${i}`}
                  d={`M${fx},${fy} Q${mx},${my} ${tx},${ty}`}
                  fill="none" stroke={fromN.color} strokeWidth={2.5}
                  opacity={aOp} strokeDasharray="8 5"
                  strokeLinecap="round" />
              );
            })}

            {/* ── Flow particles ── */}
            {FLOW_DOTS.map((fd, i) => {
              const n = STEPS[fd.pathIdx];
              const next = STEPS[(fd.pathIdx + 1) % 4];
              const t = ((frame * fd.speed + fd.tOff) % 1);
              const px = Math.cos(n.angle) * LOOP_R * (1 - t) + Math.cos(next.angle) * LOOP_R * t;
              const py = Math.sin(n.angle) * LOOP_R * (1 - t) + Math.sin(next.angle) * LOOP_R * t;
              return (
                <circle key={`fd${i}`} cx={px} cy={py} r={fd.size}
                  fill={n.color} opacity={0.2} />
              );
            })}

            {/* ── Step Nodes ── */}
            {STEPS.map((step, i) => {
              const nx = Math.cos(step.angle) * LOOP_R;
              const ny = Math.sin(step.angle) * LOOP_R;
              const nEnter = interpolate(frame, [12 + i * 10, 36 + i * 10], [0, 1], { extrapolateRight: 'clamp' });
              const highlight = stepHighlights[i];
              const isAct = step.isACT;
              const glowR = isAct ? NODE_R + 20 + actGlow * 14 : NODE_R + 8;
              const nodeScale = isAct ? 1 + actGlow * 0.05 : 1;

              return (
                <g key={`step${i}`} transform={`translate(${nx}, ${ny}) scale(${nodeScale})`} opacity={nEnter}>
                  {/* Outer glow */}
                  <circle cx={0} cy={0} r={glowR}
                    fill={step.color}
                    opacity={isAct ? 0.15 + actGlow * 0.1 : 0.03 + highlight * 0.04}
                    filter={isAct ? 'url(#cyanGlow)' : 'url(#softGlow)'} />
                  {/* Node background */}
                  <circle cx={0} cy={0} r={NODE_R}
                    fill={COLORS.bg_paper} stroke={step.color}
                    strokeWidth={isAct ? 4 : 2.5} opacity={0.95} />
                  {/* Icon */}
                  <path d={step.icon} fill="none" stroke={step.color}
                    strokeWidth={2.5} strokeLinecap="round" />
                  {/* Step number */}
                  <text x={NODE_R - 12} y={-NODE_R + 16}
                    textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={14} fontWeight={800} fill={step.color} opacity={0.4}>
                    {step.number}
                  </text>
                  {/* Label */}
                  <text y={NODE_R + 26} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={isAct ? 20 : 15} fontWeight={isAct ? 900 : 700}
                    letterSpacing={isAct ? 5 : 3}
                    fill={step.color} opacity={isAct ? 1 : 0.75}>
                    {step.label}
                  </text>
                  {/* Description */}
                  <text y={NODE_R + 46} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={11} fontWeight={400} letterSpacing={1}
                    fill={COLORS.cool_silver} opacity={0.5}>
                    {step.desc}
                  </text>
                  {/* ACT highlight ring */}
                  {isAct && (
                    <circle cx={0} cy={0} r={NODE_R + 10}
                      fill="none" stroke={COLORS.amber} strokeWidth={2.5}
                      strokeDasharray="8 4" opacity={0.45 + actGlow * 0.3}
                      transform={`rotate(${frame * 2.5})`} />
                  )}
                </g>
              );
            })}

            {/* ── ACT burst particles ── */}
            {ACT_BURST.map((ab, i) => {
              const actNx = Math.cos(STEPS[2].angle) * LOOP_R;
              const actNy = Math.sin(STEPS[2].angle) * LOOP_R;
              const bx = actNx + Math.cos(ab.angle + frame * 0.015) * ab.dist;
              const by = actNy + Math.sin(ab.angle + frame * 0.015) * ab.dist;
              return (
                <circle key={`ab${i}`} cx={bx} cy={by} r={ab.size}
                  fill={COLORS.amber} opacity={loopOpacity * 0.2 * actGlow} />
              );
            })}

            {/* Center label */}
            <text y={5} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={18} fontWeight={700} letterSpacing={5}
              fill={COLORS.electric_cyan} opacity={0.35}>
              LOOP
            </text>
          </g>

          {/* ── Step sequence indicator ── */}
          <g opacity={interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' })}>
            {SEQ_DOTS.map((sd, i) => {
              const sdActive = stepHighlights[i];
              return (
                <g key={`sd${i}`}>
                  <circle cx={sd.x} cy={sd.y} r={10 + sdActive * 4}
                    fill={sd.color} opacity={0.15 + sdActive * 0.2} />
                  <text x={sd.x} y={sd.y + 30} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={10} fontWeight={600} letterSpacing={2}
                    fill={sd.color} opacity={0.5 + sdActive * 0.3}>
                    {sd.label}
                  </text>
                  {i < 3 && (
                    <line x1={sd.x + 18} y1={sd.y} x2={sd.x + 62} y2={sd.y}
                      stroke={COLORS.cool_silver} strokeWidth={1}
                      strokeDasharray="3 3" opacity={0.2} />
                  )}
                </g>
              );
            })}
          </g>

          {/* ── Caption ── */}
          <CaptionBar
            text="The agent loop has four steps, perceive, think, act, observe."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
