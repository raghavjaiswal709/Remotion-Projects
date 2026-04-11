/**
 * Scene 20 — Full Loop Diagram
 * Visual recap of the complete agent loop diagram.
 * 4 nodes (Perceive, Think, Act, Observe) connected in a circle.
 * AIRobot in center, arrows between nodes, data flowing.
 * Duration: 36 frames (~1.2s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow, AIRobot,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Central layout ─────────────────────────────────────────────────────────
const CX = 540;
const CY = 720;
const NODE_R = 280;
const NODE_SIZE = 60;

// ── Node definitions (clockwise from top) ──────────────────────────────────
interface NodeDef {
  label: string;
  shortLabel: string;
  angle: number;
  color: string;
  icon: string[];
  description: string;
}

const NODES: NodeDef[] = [
  {
    label: 'PERCEIVE',
    shortLabel: 'P',
    angle: -Math.PI / 2,
    color: COLORS.vibrant_green,
    icon: ['M-10,-6 C-10,-14 10,-14 10,-6', 'M-6,0 A3,3,0,1,0,-6,0.01', 'M6,0 A3,3,0,1,0,6,0.01'],
    description: 'Take in data',
  },
  {
    label: 'THINK',
    shortLabel: 'T',
    angle: 0,
    color: COLORS.warm_blue,
    icon: ['M-10,-10 C0,-18 0,2 10,-6', 'M-10,2 C0,-6 0,14 10,6', 'M-6,8 L6,8'],
    description: 'Reason & plan',
  },
  {
    label: 'ACT',
    shortLabel: 'A',
    angle: Math.PI / 2,
    color: COLORS.amber,
    icon: ['M0,-14 L0,8', 'M-8,0 L0,8 L8,0', 'M-10,12 L10,12'],
    description: 'Execute action',
  },
  {
    label: 'OBSERVE',
    shortLabel: 'O',
    angle: Math.PI,
    color: COLORS.purple,
    icon: ['M-12,0 A12,8,0,1,1,12,0', 'M-12,0 A12,8,0,1,0,12,0', 'M0,-5 L0,5'],
    description: 'Get feedback',
  },
];

// ── Arrow paths between nodes (curved arcs) ────────────────────────────────
const ARROW_PAIRS = NODES.map((_, i) => ({
  from: i,
  to: (i + 1) % 4,
}));

// ── Data flow particles along paths ────────────────────────────────────────
const FLOW_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  pathIdx: i % 4,
  tOffset: (i % 8) / 8,
  size: 2 + (i % 3),
  speed: 0.025 + (i % 4) * 0.005,
}));

// ── Background constellation dots ──────────────────────────────────────────
const CONSTELLATION = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 139.7 + 30) % 1080,
  y: (i * 201.3 + 50) % 1920,
  r: 1 + (i % 3) * 0.4,
  phase: i * 0.51,
}));

// ── Guide circle rings ────────────────────────────────────────────────────
const GUIDE_RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: 140 + i * 50,
  dashArray: '3 9',
  opacity: 0.025 + (i === 2 ? 0.015 : 0),
}));

// ── Radial tick marks ──────────────────────────────────────────────────────
const RADIAL_TICKS = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  innerR: NODE_R - 10,
  outerR: NODE_R + 10,
  width: i % 6 === 0 ? 2 : 0.8,
}));

// ── Mini data labels ───────────────────────────────────────────────────────
const DATA_LABELS = [
  { text: 'input', angle: -Math.PI / 4, r: NODE_R + 50 },
  { text: 'reasoning', angle: Math.PI / 4, r: NODE_R + 50 },
  { text: 'output', angle: 3 * Math.PI / 4, r: NODE_R + 50 },
  { text: 'result', angle: -3 * Math.PI / 4, r: NODE_R + 50 },
];

// ── Ambient glow dots around nodes ─────────────────────────────────────────
const NODE_GLOW_DOTS = Array.from({ length: 48 }, (_, i) => ({
  nodeIdx: i % 4,
  angle: ((i % 12) / 12) * Math.PI * 2,
  r: NODE_SIZE + 10 + (i % 5) * 6,
  size: 1 + (i % 3) * 0.5,
}));

// ── Center ring decorations ────────────────────────────────────────────────
const CENTER_RINGS = Array.from({ length: 3 }, (_, i) => ({
  r: 50 + i * 18,
  width: 1 - i * 0.2,
  dashArray: i === 0 ? 'none' : '2 6',
}));

// ── Background vertical guides ─────────────────────────────────────────────
const BG_VERTICALS = Array.from({ length: 10 }, (_, i) => ({
  x: 108 * i,
  opacity: 0.015,
}));

// ── Small decorative markers ───────────────────────────────────────────────
const MARKERS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2 + Math.PI / 8,
  r: NODE_R - 50,
  size: 3,
}));

// ── Step number positions ──────────────────────────────────────────────────
const STEP_LABELS = NODES.map((n, i) => ({
  label: `0${i + 1}`,
  angle: n.angle,
  r: NODE_R + 85,
}));

export const Scene20_FullLoopDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers (quick entry — 36 frames total) ────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [1, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const nodesEnter = interpolate(frame, [3, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowsEnter = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const flowEnter = interpolate(frame, [12, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelsEnter = interpolate(frame, [18, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [1, 8], [0, 1], { extrapolateRight: 'clamp' });
  const loopDash = interpolate(frame, [0, 36], [0, 300], { extrapolateRight: 'clamp' });
  const loopPulse = Math.sin(frame * 0.12) * 0.06;
  const orbitSpin = frame * 0.03;

  // Helper: get node position
  const nodePos = (angle: number) => ({
    x: CX + Math.cos(angle) * NODE_R,
    y: CY + Math.sin(angle) * NODE_R,
  });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.16}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="nodeGlowS20" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="centerGlowS20" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="12" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.3" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="arrowGlowS20" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="centerRadialS20" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.15"/>
              <stop offset="60%" stopColor={COLORS.electric_cyan} stopOpacity="0.03"/>
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
            </radialGradient>
            {NODES.map((n, i) => (
              <radialGradient key={i} id={`nodeRadS20_${i}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.12"/>
                <stop offset="100%" stopColor={n.color} stopOpacity="0"/>
              </radialGradient>
            ))}
            <marker id="flowArrowS20" markerWidth="10" markerHeight="8"
              refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8"
                fill={COLORS.electric_cyan} opacity={0.6}/>
            </marker>
          </defs>

          {/* ── Background verticals ── */}
          {BG_VERTICALS.map((v, i) => (
            <line key={i} x1={v.x} y1={0} x2={v.x} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth={0.5}
              opacity={enter * v.opacity}/>
          ))}

          {/* ── Constellation dots ── */}
          {CONSTELLATION.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r}
              fill={COLORS.cool_silver}
              opacity={enter * (0.03 + Math.sin(frame * 0.03 + d.phase) * 0.01)}/>
          ))}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={440} height={52} rx={12}
              fill={COLORS.cool_silver} opacity={0.9}/>
            <text x={280} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">FULL LOOP DIAGRAM</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter}>
            <text x={540} y={180} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              The Agent Loop
            </text>
            <text x={540} y={230} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500}
              fill={COLORS.cool_silver}>
              Perceive → Think → Act → Observe → Repeat
            </text>
          </g>

          {/* ── Guide rings ── */}
          {GUIDE_RINGS.map((gr, i) => (
            <circle key={i} cx={CX} cy={CY} r={gr.r}
              fill="none" stroke={COLORS.cool_silver} strokeWidth={0.5}
              strokeDasharray={gr.dashArray} opacity={enter * gr.opacity}/>
          ))}

          {/* ── Radial ticks ── */}
          {RADIAL_TICKS.map((rt, i) => (
            <line key={i}
              x1={CX + Math.cos(rt.angle) * rt.innerR}
              y1={CY + Math.sin(rt.angle) * rt.innerR}
              x2={CX + Math.cos(rt.angle) * rt.outerR}
              y2={CY + Math.sin(rt.angle) * rt.outerR}
              stroke={COLORS.cool_silver} strokeWidth={rt.width}
              opacity={enter * 0.06}/>
          ))}

          {/* ── Center radial glow ── */}
          <circle cx={CX} cy={CY} r={200}
            fill="url(#centerRadialS20)" opacity={robotEnter}/>

          {/* ── Center rings ── */}
          {CENTER_RINGS.map((cr, i) => (
            <circle key={i} cx={CX} cy={CY} r={cr.r}
              fill="none" stroke={COLORS.electric_cyan} strokeWidth={cr.width}
              strokeDasharray={cr.dashArray}
              opacity={robotEnter * 0.08}/>
          ))}

          {/* ── Connection loop arrow (background) ── */}
          <LoopArrow cx={CX} cy={CY} r={NODE_R}
            color={COLORS.electric_cyan} strokeWidth={2}
            dashOffset={loopDash}
            opacity={arrowsEnter * (0.15 + loopPulse)}
            showArrow={false}/>

          {/* ── Arrow paths between nodes ── */}
          {ARROW_PAIRS.map((ap, i) => {
            const fromNode = NODES[ap.from];
            const toNode = NODES[ap.to];
            const fp = nodePos(fromNode.angle);
            const tp = nodePos(toNode.angle);
            const midAngle = (fromNode.angle + toNode.angle) / 2;
            const bulge = 60;
            const mx = CX + Math.cos(midAngle) * (NODE_R + bulge);
            const my = CY + Math.sin(midAngle) * (NODE_R + bulge);
            const aEnter = interpolate(frame, [8 + i * 2, 18 + i * 2], [0, 1], { extrapolateRight: 'clamp', easing: ease });

            return (
              <g key={i} opacity={aEnter * arrowsEnter}>
                <path
                  d={`M ${fp.x} ${fp.y} Q ${mx} ${my} ${tp.x} ${tp.y}`}
                  fill="none" stroke={COLORS.electric_cyan} strokeWidth={2.5}
                  strokeLinecap="round" filter="url(#arrowGlowS20)"
                  markerEnd="url(#flowArrowS20)"
                  opacity={0.5}/>
                <path
                  d={`M ${fp.x} ${fp.y} Q ${mx} ${my} ${tp.x} ${tp.y}`}
                  fill="none" stroke={COLORS.electric_cyan} strokeWidth={1}
                  strokeDasharray="4 8" opacity={0.2}/>
              </g>
            );
          })}

          {/* ── Data flow particles ── */}
          {FLOW_PARTICLES.map((fp, i) => {
            const ap = ARROW_PAIRS[fp.pathIdx];
            const fromN = NODES[ap.from];
            const toN = NODES[ap.to];
            const fPos = nodePos(fromN.angle);
            const tPos = nodePos(toN.angle);
            const t = ((frame * fp.speed + fp.tOffset) % 1);
            const px = fPos.x + (tPos.x - fPos.x) * t;
            const py = fPos.y + (tPos.y - fPos.y) * t;
            const pOp = Math.sin(t * Math.PI) * 0.4;
            return (
              <circle key={i} cx={px} cy={py} r={fp.size}
                fill={fromN.color} opacity={flowEnter * pOp}/>
            );
          })}

          {/* ── Node glow dots ── */}
          {NODE_GLOW_DOTS.map((ngd, i) => {
            const node = NODES[ngd.nodeIdx];
            const np = nodePos(node.angle);
            const a = ngd.angle + orbitSpin;
            return (
              <circle key={i}
                cx={np.x + Math.cos(a) * ngd.r}
                cy={np.y + Math.sin(a) * ngd.r}
                r={ngd.size} fill={node.color}
                opacity={nodesEnter * 0.06}/>
            );
          })}

          {/* ── Markers between nodes ── */}
          {MARKERS.map((m, i) => (
            <circle key={i}
              cx={CX + Math.cos(m.angle) * m.r}
              cy={CY + Math.sin(m.angle) * m.r}
              r={m.size} fill={COLORS.cool_silver}
              opacity={nodesEnter * 0.08}/>
          ))}

          {/* ── Nodes ── */}
          {NODES.map((node, i) => {
            const nEnter = interpolate(frame, [3 + i * 2, 12 + i * 2], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const nScale = scaleAnim(frame, 3 + i * 2, 10, 0.4, 1);
            const pos = nodePos(node.angle);

            return (
              <g key={node.label} opacity={nEnter * nodesEnter}
                transform={`translate(${pos.x}, ${pos.y}) scale(${nScale})`}>
                {/* Radial glow */}
                <circle cx={0} cy={0} r={NODE_SIZE + 20}
                  fill={`url(#nodeRadS20_${i})`}/>
                {/* Circle */}
                <circle cx={0} cy={0} r={NODE_SIZE}
                  fill="#FFFFFF" stroke={node.color} strokeWidth={3}
                  filter="url(#nodeGlowS20)"/>
                {/* Accent ring */}
                <circle cx={0} cy={0} r={NODE_SIZE + 4}
                  fill="none" stroke={node.color} strokeWidth={1}
                  strokeDasharray="3 5" opacity={0.3}/>
                {/* Icon */}
                <g>
                  {node.icon.map((p, pi) => (
                    <path key={pi} d={p} fill="none"
                      stroke={node.color} strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  ))}
                </g>
                {/* Label */}
                <text x={0} y={NODE_SIZE + 26} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={17} fontWeight={900}
                  fill={node.color} letterSpacing="0.1em">
                  {node.label}
                </text>
                {/* Description */}
                <text x={0} y={NODE_SIZE + 48} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={500}
                  fill={COLORS.light_gray}>
                  {node.description}
                </text>
              </g>
            );
          })}

          {/* ── Step labels ── */}
          {STEP_LABELS.map((sl, i) => {
            const sEnter = interpolate(frame, [20 + i * 2, 28 + i * 2], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const sx = CX + Math.cos(sl.angle) * sl.r;
            const sy = CY + Math.sin(sl.angle) * sl.r;
            return (
              <g key={i} opacity={sEnter * labelsEnter}>
                <circle cx={sx} cy={sy} r={16}
                  fill={NODES[i].color} opacity={0.1}/>
                <text x={sx} y={sy + 5} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={14} fontWeight={800}
                  fill={NODES[i].color} opacity={0.6}>
                  {sl.label}
                </text>
              </g>
            );
          })}

          {/* ── Data labels between nodes ── */}
          {DATA_LABELS.map((dl, i) => {
            const dlx = CX + Math.cos(dl.angle) * dl.r;
            const dly = CY + Math.sin(dl.angle) * dl.r;
            return (
              <text key={i} x={dlx} y={dly} textAnchor="middle"
                fontFamily="'Courier New', monospace" fontSize={12} fontWeight={600}
                fill={COLORS.cool_silver} opacity={labelsEnter * 0.3}
                letterSpacing="0.06em">
                {dl.text}
              </text>
            );
          })}

          {/* ── AIRobot in center ── */}
          <g filter="url(#centerGlowS20)">
            <AIRobot cx={CX} cy={CY} scale={scaleAnim(frame, 5, 10, 0.3, 0.7)}
              opacity={robotEnter} coreGlow={0.6 + loopPulse}
              frame={frame} variant="active"/>
          </g>

          {/* ── Bottom insight card ── */}
          <g opacity={labelsEnter}>
            <rect x={100} y={1100} width={880} height={110} rx={16}
              fill="#FFFFFF" stroke={COLORS.electric_cyan} strokeWidth={1.5}
              opacity={0.92} filter="url(#nodeGlowS20)"/>
            <rect x={100} y={1100} width={6} height={110} rx={3}
              fill={COLORS.electric_cyan}/>
            <text x={150} y={1148} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
              fill={COLORS.deep_black}>
              The complete agent loop: 4 steps, infinite cycles.
            </text>
            <text x={150} y={1182} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
              fill={COLORS.light_gray}>
              Perceive → Think → Act → Observe → Repeat forever.
            </text>
          </g>

          {/* ── Footer code ── */}
          <text x={540} y={1270} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.2}
            letterSpacing="0.05em">
            agent.run() // perceive → think → act → observe
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="The complete agent loop."
          opacity={captionEnter}
          highlightWords={['agent loop']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
