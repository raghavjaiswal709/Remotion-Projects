/**
 * Scene 03 — Agent Loop Recap
 * "Last day, we learned what the agent loop is."
 * Paper background, small loop diagram with 4 nodes (Perceive, Think, Act, Observe).
 * The "ACT" node is highlighted to foreshadow today's topic.
 * Duration: 88 frames (~2.93s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  AIRobot, SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Loop layout ───────────────────────────────────────────────────────────
const CX = 540;
const CY = 700;
const LOOP_R = 240;
const NODE_SIZE = 52;

// ── Node definitions (clockwise from top) ─────────────────────────────────
interface LoopNode {
  label: string;
  short: string;
  angle: number;
  color: string;
  icon: string;
  highlighted: boolean;
}

const LOOP_NODES: LoopNode[] = [
  { label: 'PERCEIVE', short: 'P', angle: -Math.PI / 2, color: COLORS.vibrant_green,
    icon: 'M-8,-6 C-8,-12 8,-12 8,-6 M-5,0 A3,3,0,1,0,-5,0.01 M5,0 A3,3,0,1,0,5,0.01',
    highlighted: false },
  { label: 'THINK', short: 'T', angle: 0, color: COLORS.warm_blue,
    icon: 'M-8,-8 C0,-16 0,2 8,-4 M-8,2 C0,-6 0,14 8,6',
    highlighted: false },
  { label: 'ACT', short: 'A', angle: Math.PI / 2, color: COLORS.amber,
    icon: 'M0,-12 L0,6 M-7,0 L0,8 L7,0 M-9,11 L9,11',
    highlighted: true },
  { label: 'OBSERVE', short: 'O', angle: Math.PI, color: COLORS.purple,
    icon: 'M-10,0 A10,7,0,1,1,10,0 M-10,0 A10,7,0,1,0,10,0 M0,-4 L0,4',
    highlighted: false },
];

// ── Connecting arrows between nodes ──────────────────────────────────────
const ARROW_PAIRS = LOOP_NODES.map((_, i) => ({
  from: i,
  to: (i + 1) % 4,
}));

// ── Data flow particles ──────────────────────────────────────────────────
const FLOW_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  pathIdx: i % 4,
  tOffset: (i % 5) / 5,
  size: 2 + (i % 3),
  speed: 0.018 + (i % 4) * 0.004,
}));

// ── Background constellation ─────────────────────────────────────────────
const STARS = Array.from({ length: 35 }, (_, i) => ({
  x: (i * 157.3 + 30) % 1080,
  y: (i * 219.7 + 40) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.47,
}));

// ── Guide circle rings ──────────────────────────────────────────────────
const RINGS = Array.from({ length: 4 }, (_, i) => ({
  r: 160 + i * 40,
  dash: '3 10',
  opacity: 0.03 + (i === 1 ? 0.01 : 0),
}));

// ── Yesterday label hint ─────────────────────────────────────────────────
const YESTERDAY_HINTS = [
  { text: 'DAY 24', x: 540, y: 340, delay: 10 },
  { text: 'THE LOOP', x: 540, y: 380, delay: 18 },
];

// ── Radial tick marks around loop ────────────────────────────────────────
const TICKS = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  len: 8 + (i % 3) * 4,
}));

export const Scene03_AgentLoopRecap: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopScale = scaleAnim(frame, 5, 35, 0.5, 1);
  const loopOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const actGlow = 0.5 + Math.sin(frame * 0.1) * 0.3;
  const rotateAngle = frame * 0.15;
  const hintOpacity = interpolate(frame, [8, 30], [0, 0.7], { extrapolateRight: 'clamp' });
  const captionOp = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

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
                fill={COLORS.electric_cyan} opacity={enter * pulse * 0.06} />
            );
          })}

          {/* ── Guide rings ── */}
          {RINGS.map((ring, i) => (
            <circle key={`ring${i}`} cx={CX} cy={CY} r={ring.r}
              fill="none" stroke={COLORS.cool_silver} strokeWidth={0.8}
              strokeDasharray={ring.dash} opacity={loopOpacity * ring.opacity} />
          ))}

          {/* ── Radial ticks ── */}
          {TICKS.map((t, i) => {
            const innerR = LOOP_R + 10;
            const outerR = LOOP_R + 10 + t.len;
            return (
              <line key={`tick${i}`}
                x1={CX + Math.cos(t.angle) * innerR}
                y1={CY + Math.sin(t.angle) * innerR}
                x2={CX + Math.cos(t.angle) * outerR}
                y2={CY + Math.sin(t.angle) * outerR}
                stroke={COLORS.cool_silver} strokeWidth={0.6}
                opacity={loopOpacity * 0.08} />
            );
          })}

          {/* ── Yesterday hint labels ── */}
          {YESTERDAY_HINTS.map((h, i) => {
            const hOp = interpolate(frame, [h.delay, h.delay + 20], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={`hint${i}`} x={h.x} y={h.y} textAnchor="middle"
                fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                fontSize={i === 0 ? 28 : 20} fontWeight={i === 0 ? 700 : 500}
                letterSpacing={i === 0 ? 6 : 4}
                fill={i === 0 ? COLORS.warm_blue : COLORS.cool_silver}
                opacity={hOp * hintOpacity}>
                {h.text}
              </text>
            );
          })}

          {/* ── Main loop group ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${loopScale})`} opacity={loopOpacity}>
            {/* Central orbit circle */}
            <circle cx={0} cy={0} r={LOOP_R}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={2}
              strokeDasharray="10 6" opacity={0.25}
              transform={`rotate(${rotateAngle})`} />

            {/* Inner decorative circle */}
            <circle cx={0} cy={0} r={LOOP_R - 30}
              fill="none" stroke={COLORS.warm_blue} strokeWidth={0.7}
              opacity={0.1} />

            {/* ── Arrow connectors between nodes ── */}
            {ARROW_PAIRS.map((pair, i) => {
              const fromNode = LOOP_NODES[pair.from];
              const toNode = LOOP_NODES[pair.to];
              const fx = Math.cos(fromNode.angle) * LOOP_R;
              const fy = Math.sin(fromNode.angle) * LOOP_R;
              const tx = Math.cos(toNode.angle) * LOOP_R;
              const ty = Math.sin(toNode.angle) * LOOP_R;
              const midAngle = (fromNode.angle + toNode.angle) / 2;
              const bulge = 40;
              const mx = Math.cos(midAngle) * (LOOP_R + bulge);
              const my = Math.sin(midAngle) * (LOOP_R + bulge);
              const aOp = interpolate(frame, [15 + i * 6, 35 + i * 6], [0, 0.35], { extrapolateRight: 'clamp' });
              return (
                <path key={`arrow${i}`}
                  d={`M${fx},${fy} Q${mx},${my} ${tx},${ty}`}
                  fill="none" stroke={fromNode.color} strokeWidth={2}
                  opacity={aOp} strokeDasharray="8 4"
                  markerEnd="none" />
              );
            })}

            {/* ── Flow particles ── */}
            {FLOW_PARTICLES.map((fp, i) => {
              const node = LOOP_NODES[fp.pathIdx];
              const nextNode = LOOP_NODES[(fp.pathIdx + 1) % 4];
              const t = ((frame * fp.speed + fp.tOffset) % 1);
              const px = Math.cos(node.angle) * LOOP_R * (1 - t) + Math.cos(nextNode.angle) * LOOP_R * t;
              const py = Math.sin(node.angle) * LOOP_R * (1 - t) + Math.sin(nextNode.angle) * LOOP_R * t;
              return (
                <circle key={`fp${i}`} cx={px} cy={py} r={fp.size}
                  fill={node.color} opacity={loopOpacity * 0.25} />
              );
            })}

            {/* ── Loop nodes ── */}
            {LOOP_NODES.map((node, i) => {
              const nx = Math.cos(node.angle) * LOOP_R;
              const ny = Math.sin(node.angle) * LOOP_R;
              const nEnter = interpolate(frame, [10 + i * 8, 30 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
              const isAct = node.highlighted;
              const glowR = isAct ? NODE_SIZE + 16 + actGlow * 10 : NODE_SIZE + 6;

              return (
                <g key={`node${i}`} transform={`translate(${nx}, ${ny})`} opacity={nEnter}>
                  {/* Outer glow */}
                  <circle cx={0} cy={0} r={glowR}
                    fill={node.color} opacity={isAct ? 0.12 + actGlow * 0.08 : 0.04}
                    filter={isAct ? 'url(#cyanGlow)' : 'url(#softGlow)'} />
                  {/* Node bg */}
                  <circle cx={0} cy={0} r={NODE_SIZE}
                    fill={COLORS.bg_paper} stroke={node.color}
                    strokeWidth={isAct ? 3 : 2} opacity={0.95} />
                  {/* Icon */}
                  <path d={node.icon} fill="none" stroke={node.color}
                    strokeWidth={2} strokeLinecap="round" />
                  {/* Label */}
                  <text y={NODE_SIZE + 24} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={isAct ? 18 : 14} fontWeight={isAct ? 800 : 600}
                    letterSpacing={3} fill={node.color}
                    opacity={isAct ? 1 : 0.7}>
                    {node.label}
                  </text>
                  {/* ACT highlight ring */}
                  {isAct && (
                    <circle cx={0} cy={0} r={NODE_SIZE + 8}
                      fill="none" stroke={COLORS.amber} strokeWidth={2}
                      strokeDasharray="6 4" opacity={0.5 + actGlow * 0.3}
                      transform={`rotate(${frame * 2})`} />
                  )}
                </g>
              );
            })}

            {/* Center label */}
            <text y={4} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={700} letterSpacing={4}
              fill={COLORS.electric_cyan} opacity={0.4}>
              LOOP
            </text>
          </g>

          {/* ── Section label ── */}
          <SectionLabel x={540} y={1060} text="THE AGENT LOOP" fontSize={20}
            color={COLORS.warm_blue} opacity={loopOpacity * 0.6}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Small robot in corner ── */}
          <AIRobot cx={160} cy={1400} scale={0.35} opacity={enter * 0.6}
            coreGlow={0.5} frame={frame} variant="active" />

          {/* ── Decorative bottom rule ── */}
          <line x1={200} y1={1600} x2={880} y2={1600}
            stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={enter * 0.15} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Last day, we learned what the agent loop is."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
