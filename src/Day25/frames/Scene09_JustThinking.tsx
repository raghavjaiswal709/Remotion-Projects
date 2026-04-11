/**
 * Scene 09 — Just Thinking
 * "Without actions, the loop is just thinking."
 * Dimmed loop with thought bubbles and no output. A brain spinning alone
 * in the center while the loop nodes are grayed-out/faded.
 * The ACT node is crossed out / empty. Visual contrast to emphasize
 * that actions are what make the loop meaningful.
 * Duration: 72 frames (~2.4s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Loop layout (center, smaller) ─────────────────────────────────────────
const CX = 540;
const CY = 720;
const LOOP_R = 220;
const NODE_R = 48;

// ── Loop nodes — all dimmed except "ACT" is crossed out ──────────────────
interface DimNode {
  label: string;
  angle: number;
  color: string;
  dimColor: string;
  icon: string;
  crossedOut: boolean;
}

const DIM_NODES: DimNode[] = [
  {
    label: 'PERCEIVE', angle: -Math.PI / 2,
    color: COLORS.vibrant_green, dimColor: '#9CA3AF',
    icon: 'M-8,-5 C-8,-12 8,-12 8,-5 M-5,1 A3,3,0,1,0,-5,1.01 M5,1 A3,3,0,1,0,5,1.01',
    crossedOut: false,
  },
  {
    label: 'THINK', angle: 0,
    color: COLORS.warm_blue, dimColor: '#9CA3AF',
    icon: 'M-8,-8 C0,-16 0,2 8,-6 M-8,2 C0,-6 0,14 8,6',
    crossedOut: false,
  },
  {
    label: 'ACT', angle: Math.PI / 2,
    color: COLORS.amber, dimColor: '#6B7280',
    icon: 'M0,-12 L0,6 M-7,0 L0,8 L7,0 M-9,11 L9,11',
    crossedOut: true,
  },
  {
    label: 'OBSERVE', angle: Math.PI,
    color: COLORS.purple, dimColor: '#9CA3AF',
    icon: 'M-10,0 A10,7,0,1,1,10,0 M-10,0 A10,7,0,1,0,10,0 M0,-4 L0,4',
    crossedOut: false,
  },
];

// ── Thought bubbles floating from brain ──────────────────────────────────
const THOUGHT_BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  startX: CX + ((((i * 7 + 3) * 13) % 60) - 30),
  startY: CY - 10,
  driftX: (i % 2 === 0 ? -1 : 1) * (20 + (i % 5) * 15),
  driftY: -(80 + (i % 4) * 40),
  size: 12 + (i % 4) * 8,
  delay: 8 + i * 5,
  content: ['?', '...', '💭', '?', 'hmm', '...', '?', '💭', '...', '?'][i],
}));

// ── Brain spinner arcs ───────────────────────────────────────────────────
const BRAIN_ARCS = Array.from({ length: 6 }, (_, i) => ({
  r: 30 + i * 10,
  startAngle: i * 60,
  sweep: 90 + (i % 3) * 30,
  strokeW: 2 + (i % 2),
}));

// ── Background dim particles (muted) ─────────────────────────────────────
const DIM_PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  x: (i * 163.7 + 40) % 1080,
  y: (i * 209.3 + 60) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.43,
}));

// ── "No output" indicators ───────────────────────────────────────────────
const NO_OUTPUT_ARROWS = Array.from({ length: 4 }, (_, i) => {
  const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
  return {
    angle,
    startR: LOOP_R + 50,
    endR: LOOP_R + 100,
    delay: 20 + i * 8,
  };
});

// ── Dimmed orbit ring dash pattern ───────────────────────────────────────
const ORBIT_DASH = '8 12';

// ── Cross-out lines for ACT node ─────────────────────────────────────────
const CROSS_SIZE = NODE_R * 0.8;

export const Scene09_JustThinking: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animations ────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopScale = scaleAnim(frame, 3, 25, 0.6, 1);
  const loopOpacity = interpolate(frame, [3, 25], [0, 0.5], { extrapolateRight: 'clamp' });
  const brainSpin = frame * 2.5;
  const brainPulse = 0.5 + Math.sin(frame * 0.1) * 0.15;
  const dimFlicker = 0.3 + Math.sin(frame * 0.06) * 0.05;
  const captionOp = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const crossEnter = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const noOutputOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="dimGlow09">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="brainGlow09">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feFlood floodColor="#9CA3AF" floodOpacity="0.3" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Dim background particles ── */}
          {DIM_PARTICLES.map((d, i) => {
            const pulse = Math.sin(frame * 0.03 + d.phase) * 0.2 + 0.3;
            return (
              <circle key={`dp${i}`} cx={d.x} cy={d.y} r={d.r}
                fill="#9CA3AF" opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section title ── */}
          <SectionLabel x={540} y={200} text="WITHOUT ACTIONS" fontSize={26}
            color="#9CA3AF" opacity={enter * 0.7}
            underlineColor="#6B7280" />

          <text x={540} y={248} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={18} fontWeight={500} letterSpacing={3}
            fill="#9CA3AF" opacity={enter * 0.4}>
            The loop is just thinking...
          </text>

          {/* ── Main dimmed loop ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${loopScale})`} opacity={loopOpacity}>

            {/* Orbit circle (dimmed) */}
            <circle cx={0} cy={0} r={LOOP_R}
              fill="none" stroke="#9CA3AF" strokeWidth={1.5}
              strokeDasharray={ORBIT_DASH} opacity={dimFlicker} />

            {/* Inner ring */}
            <circle cx={0} cy={0} r={LOOP_R - 30}
              fill="none" stroke="#6B7280" strokeWidth={0.6}
              opacity={0.08} />

            {/* ── Dimmed connectors ── */}
            {DIM_NODES.map((node, i) => {
              const next = DIM_NODES[(i + 1) % 4];
              const fx = Math.cos(node.angle) * LOOP_R;
              const fy = Math.sin(node.angle) * LOOP_R;
              const tx = Math.cos(next.angle) * LOOP_R;
              const ty = Math.sin(next.angle) * LOOP_R;
              const midA = (node.angle + next.angle) / 2;
              const mx = Math.cos(midA) * (LOOP_R + 35);
              const my = Math.sin(midA) * (LOOP_R + 35);
              return (
                <path key={`dc${i}`}
                  d={`M${fx},${fy} Q${mx},${my} ${tx},${ty}`}
                  fill="none" stroke="#9CA3AF" strokeWidth={1.5}
                  opacity={dimFlicker * 0.3} strokeDasharray="6 8" />
              );
            })}

            {/* ── Dimmed nodes ── */}
            {DIM_NODES.map((node, i) => {
              const nx = Math.cos(node.angle) * LOOP_R;
              const ny = Math.sin(node.angle) * LOOP_R;
              const nEnter = interpolate(frame, [8 + i * 5, 22 + i * 5], [0, 1], { extrapolateRight: 'clamp' });

              return (
                <g key={`dn${i}`} transform={`translate(${nx}, ${ny})`} opacity={nEnter}>
                  {/* Node bg */}
                  <circle cx={0} cy={0} r={NODE_R}
                    fill={COLORS.bg_paper} stroke={node.dimColor}
                    strokeWidth={node.crossedOut ? 1 : 1.5}
                    opacity={node.crossedOut ? 0.4 : 0.6} />
                  {/* Icon */}
                  <path d={node.icon} fill="none" stroke={node.dimColor}
                    strokeWidth={1.5} strokeLinecap="round"
                    opacity={node.crossedOut ? 0.25 : 0.5} />
                  {/* Label */}
                  <text y={NODE_R + 22} textAnchor="middle"
                    fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                    fontSize={13} fontWeight={600} letterSpacing={2}
                    fill={node.dimColor} opacity={node.crossedOut ? 0.3 : 0.5}>
                    {node.label}
                  </text>
                  {/* ── Cross-out for ACT ── */}
                  {node.crossedOut && (
                    <g opacity={crossEnter}>
                      <line x1={-CROSS_SIZE} y1={-CROSS_SIZE}
                        x2={CROSS_SIZE} y2={CROSS_SIZE}
                        stroke={COLORS.vibrant_red} strokeWidth={3}
                        strokeLinecap="round" opacity={0.6} />
                      <line x1={CROSS_SIZE} y1={-CROSS_SIZE}
                        x2={-CROSS_SIZE} y2={CROSS_SIZE}
                        stroke={COLORS.vibrant_red} strokeWidth={3}
                        strokeLinecap="round" opacity={0.6} />
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── Brain spinner (center) ── */}
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
                    fill="none" stroke="#9CA3AF" strokeWidth={arc.strokeW}
                    strokeLinecap="round" opacity={0.3 + brainPulse * 0.1}
                    filter="url(#brainGlow09)" />
                );
              })}
              {/* Center dot */}
              <circle cx={0} cy={0} r={8}
                fill="#9CA3AF" opacity={0.4 + brainPulse * 0.15} />
            </g>

            {/* Brain label */}
            <text y={100} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={14} fontWeight={600} letterSpacing={3}
              fill="#9CA3AF" opacity={0.35}>
              THINKING...
            </text>
          </g>

          {/* ── Thought bubbles ── */}
          {THOUGHT_BUBBLES.map((tb, i) => {
            const tbProgress = interpolate(frame, [tb.delay, tb.delay + 40], [0, 1], { extrapolateRight: 'clamp' });
            const tbX = tb.startX + tb.driftX * tbProgress;
            const tbY = tb.startY + tb.driftY * tbProgress;
            const tbOp = interpolate(frame, [tb.delay, tb.delay + 10, tb.delay + 35, tb.delay + 40], [0, 0.4, 0.4, 0], { extrapolateRight: 'clamp' });
            const tbScale = 0.5 + tbProgress * 0.5;
            return (
              <g key={`tb${i}`} transform={`translate(${tbX}, ${tbY}) scale(${tbScale})`}
                opacity={tbOp}>
                <ellipse cx={0} cy={0} rx={tb.size} ry={tb.size * 0.75}
                  fill={COLORS.bg_paper} stroke="#B0B8BD" strokeWidth={1}
                  opacity={0.8} />
                <text x={0} y={4} textAnchor="middle"
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontSize={12} fontWeight={500} fill="#9CA3AF" opacity={0.6}>
                  {tb.content}
                </text>
              </g>
            );
          })}

          {/* ── "No output" arrows (going nowhere) ── */}
          {NO_OUTPUT_ARROWS.map((noa, i) => {
            const noaOp = interpolate(frame, [noa.delay, noa.delay + 15], [0, 0.15], { extrapolateRight: 'clamp' });
            const x1 = CX + Math.cos(noa.angle) * noa.startR;
            const y1 = CY + Math.sin(noa.angle) * noa.startR;
            const x2 = CX + Math.cos(noa.angle) * noa.endR;
            const y2 = CY + Math.sin(noa.angle) * noa.endR;
            return (
              <g key={`noa${i}`} opacity={noaOp * noOutputOp}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#9CA3AF" strokeWidth={1.5}
                  strokeDasharray="4 4" />
                {/* Dead end X */}
                <g transform={`translate(${x2}, ${y2})`}>
                  <line x1={-6} y1={-6} x2={6} y2={6} stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4} />
                  <line x1={6} y1={-6} x2={-6} y2={6} stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4} />
                </g>
              </g>
            );
          })}

          {/* ── Bottom message ── */}
          <g opacity={interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' })}>
            <text x={540} y={1100} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill="#9CA3AF" opacity={0.6}>
              No actions = No impact
            </text>
            <text x={540} y={1145} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={18} fontWeight={400} fill="#6B7280" opacity={0.4}>
              The loop spins with nothing to show
            </text>
          </g>

          {/* ── Decorative separator ── */}
          <line x1={300} y1={1200} x2={780} y2={1200}
            stroke="#9CA3AF" strokeWidth={0.5} opacity={enter * 0.1} />

          {/* ── Caption ── */}
          <CaptionBar
            text="Without actions, the loop is just thinking."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
