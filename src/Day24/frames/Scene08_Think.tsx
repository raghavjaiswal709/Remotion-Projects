/**
 * Scene 08 — Think
 * "It reasons about what to do next. That is think."
 * Purple theme (#A78BFA), brain/gear visualization, neural pathways,
 * processing animation, decision tree branches.
 * Duration: 85 frames (2.83s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  ProcessorUnit,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const PURPLE = '#A78BFA';
const PURPLE_DEEP = '#7C3AED';
const PURPLE_LIGHT = '#C4B5FD';

// ── Neural network nodes ───────────────────────────────────────────────────
const NEURAL_NODES: Array<{ x: number; y: number; layer: number; r: number }> = [];
const LAYERS = [3, 5, 6, 5, 3]; // node counts per layer
LAYERS.forEach((count, layerIdx) => {
  const layerX = 180 + layerIdx * 180;
  for (let n = 0; n < count; n++) {
    const layerH = count * 80;
    const startY = 560 - layerH / 2;
    NEURAL_NODES.push({ x: layerX, y: startY + n * 80, layer: layerIdx, r: 12 + (n % 2) * 4 });
  }
});

// ── Neural connections (between adjacent layers) ───────────────────────────
const NEURAL_CONNECTIONS: Array<{ from: number; to: number }> = [];
let nodeIdx = 0;
for (let l = 0; l < LAYERS.length - 1; l++) {
  const fromStart = nodeIdx;
  const fromCount = LAYERS[l];
  const toStart = fromStart + fromCount;
  const toCount = LAYERS[l + 1];
  for (let f = 0; f < fromCount; f++) {
    for (let t = 0; t < toCount; t++) {
      NEURAL_CONNECTIONS.push({ from: fromStart + f, to: toStart + t });
    }
  }
  nodeIdx += fromCount;
}

// ── Decision tree branches ─────────────────────────────────────────────────
const DECISION_TREE = [
  { x: 540, y: 1000, label: '?', children: [0, 1] },
  { x: 360, y: 1120, label: 'A', children: [2, 3] },
  { x: 720, y: 1120, label: 'B', children: [4, 5] },
  { x: 280, y: 1230, label: 'a1', children: [] },
  { x: 440, y: 1230, label: 'a2', children: [] },
  { x: 640, y: 1230, label: 'b1', children: [] },
  { x: 800, y: 1230, label: 'b2', children: [] },
];

// ── Gear definitions ───────────────────────────────────────────────────────
const GEARS = [
  { cx: 150, cy: 380, r: 50, teeth: 10, speed: 1.2 },
  { cx: 920, cy: 400, r: 40, teeth: 8, speed: -1.5 },
  { cx: 180, cy: 850, r: 35, teeth: 8, speed: 0.9 },
  { cx: 900, cy: 820, r: 45, teeth: 9, speed: -1.1 },
];

// ── Thought bubbles ────────────────────────────────────────────────────────
const THOUGHT_BUBBLES = [
  { x: 100, y: 200, r: 24, text: 'if?' },
  { x: 960, y: 220, r: 20, text: 'then' },
  { x: 140, y: 1400, r: 22, text: 'why' },
  { x: 940, y: 1380, r: 18, text: 'how' },
];

// ── Background particles ───────────────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: (i * 163.7 + 30) % 1080,
  y: (i * 227.1 + 60) % 1920,
  r: 1.2 + (i % 3) * 0.7,
  phase: i * 0.55,
}));

// ── Gear tooth path generator ──────────────────────────────────────────────
const buildGearPath = (cx: number, cy: number, r: number, teeth: number, rotation: number): string => {
  const innerR = r * 0.75;
  const outerR = r * 1.15;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i / (teeth * 2)) * Math.PI * 2 + rotation;
    const radius = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    pts.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
  }
  return pts.join(' ') + ' Z';
};

export const Scene08_Think: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const globalEnter = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [2, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [2, 20], [35, 0], { extrapolateRight: 'clamp', easing: ease });
  const neuralEnter = interpolate(frame, [8, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const gearEnter = interpolate(frame, [12, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const treeEnter = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const processorEnter = interpolate(frame, [18, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const processorScale = scaleAnim(frame, 18, 22, 0.4, 1);
  const bottomEnter = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 16], [0, 1], { extrapolateRight: 'clamp' });

  // Active connection animation
  const activeConn = Math.floor((frame * 0.8) % NEURAL_CONNECTIONS.length);

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Extra defs ── */}
          <defs>
            <filter id="purpleGlow08" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feFlood floodColor={PURPLE} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nodeGlow08" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={PURPLE} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="brainGrad08" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor={PURPLE_LIGHT} stopOpacity="0.6" />
              <stop offset="60%" stopColor={PURPLE} stopOpacity="0.2" />
              <stop offset="100%" stopColor={PURPLE_DEEP} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="connGrad08" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={PURPLE} stopOpacity="0.1" />
              <stop offset="50%" stopColor={PURPLE_LIGHT} stopOpacity="0.6" />
              <stop offset="100%" stopColor={PURPLE} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={PURPLE}
              opacity={globalEnter * (0.04 + Math.sin(frame * 0.035 + p.phase) * 0.02)} />
          ))}

          {/* ── Section label ── */}
          <g opacity={globalEnter}>
            <rect x={80} y={60} width={200} height={52} rx={12}
              fill={PURPLE} opacity={0.9} />
            <text x={180} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
              fill="white" letterSpacing="0.10em">THINK</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={200} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={54} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Reason & Decide
            </text>
            <text x={540} y={255} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={600}
              fill={PURPLE} opacity={0.8}>
              Step 2: Think
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={300} x2={880} y2={300}
            stroke={PURPLE} strokeWidth={1.5} opacity={titleEnter * 0.2} />

          {/* ── Rotating gears ── */}
          {GEARS.map((gear, i) => {
            const rotation = (frame * gear.speed * 0.03);
            return (
              <g key={i} opacity={gearEnter * 0.25}>
                <path d={buildGearPath(gear.cx, gear.cy, gear.r, gear.teeth, rotation)}
                  fill="none" stroke={PURPLE} strokeWidth={2} />
                <circle cx={gear.cx} cy={gear.cy} r={gear.r * 0.35}
                  fill="none" stroke={PURPLE} strokeWidth={1.5} />
                <circle cx={gear.cx} cy={gear.cy} r={4} fill={PURPLE} opacity={0.6} />
              </g>
            );
          })}

          {/* ── Neural network visualization ── */}
          {/* Connections */}
          {NEURAL_CONNECTIONS.map((conn, i) => {
            const fromNode = NEURAL_NODES[conn.from];
            const toNode = NEURAL_NODES[conn.to];
            const isActive = i === activeConn || i === (activeConn + 1) % NEURAL_CONNECTIONS.length;
            return (
              <line key={i}
                x1={fromNode.x} y1={fromNode.y}
                x2={fromNode.x + (toNode.x - fromNode.x) * neuralEnter}
                y2={fromNode.y + (toNode.y - fromNode.y) * neuralEnter}
                stroke={isActive ? PURPLE_LIGHT : PURPLE}
                strokeWidth={isActive ? 2.5 : 0.8}
                opacity={neuralEnter * (isActive ? 0.8 : 0.12)} />
            );
          })}

          {/* Nodes */}
          {NEURAL_NODES.map((node, i) => {
            const nodeDelay = node.layer * 5 + (i % LAYERS[node.layer]) * 2;
            const nodeOp = interpolate(frame, [10 + nodeDelay, 25 + nodeDelay], [0, 1], { extrapolateRight: 'clamp' });
            const pulse = 1 + Math.sin(frame * 0.1 + i * 0.7) * 0.1;
            const isHot = (Math.floor(frame * 0.3) + i) % 8 === 0;
            return (
              <g key={i} opacity={nodeOp * neuralEnter}>
                <circle cx={node.x} cy={node.y} r={node.r * pulse}
                  fill={isHot ? PURPLE_LIGHT : '#F5F0E8'}
                  stroke={PURPLE} strokeWidth={isHot ? 2.5 : 1.5}
                  filter={isHot ? 'url(#nodeGlow08)' : undefined} />
                {isHot && (
                  <circle cx={node.x} cy={node.y} r={node.r * 0.4}
                    fill={PURPLE} opacity={0.8} />
                )}
              </g>
            );
          })}

          {/* ── Brain glow overlay ── */}
          <ellipse cx={540} cy={580} rx={360} ry={240}
            fill="url(#brainGrad08)" opacity={neuralEnter * 0.3} />

          {/* ── Central processor ── */}
          <ProcessorUnit cx={540} cy={580} size={60 * processorScale}
            opacity={processorEnter} scale={1} variant="active"
            label="LLM" frame={frame} />

          {/* ── Thought bubbles ── */}
          {THOUGHT_BUBBLES.map((tb, i) => {
            const tbOp = interpolate(frame, [15 + i * 8, 30 + i * 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const bobY = Math.sin(frame * 0.06 + i * 2) * 6;
            return (
              <g key={i} opacity={tbOp * gearEnter * 0.6}>
                <circle cx={tb.x} cy={tb.y + bobY} r={tb.r}
                  fill="#F9FAFB" stroke={PURPLE} strokeWidth={1.5}
                  filter="url(#shadow)" />
                <text x={tb.x} y={tb.y + bobY + 5} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={13} fontWeight={700}
                  fill={PURPLE} opacity={0.7}>
                  {tb.text}
                </text>
                {/* Trail dots */}
                {[0, 1].map(d => (
                  <circle key={d} cx={tb.x + (d + 1) * 10 * (tb.x < 540 ? 1 : -1)}
                    cy={tb.y + bobY + (d + 1) * 12}
                    r={4 - d * 1.5} fill={PURPLE} opacity={0.2} />
                ))}
              </g>
            );
          })}

          {/* ── Decision tree ── */}
          {/* Branches */}
          {DECISION_TREE.map((node, i) =>
            node.children.map((childIdx, j) => {
              const child = DECISION_TREE[childIdx];
              const branchOp = interpolate(frame, [35 + i * 5, 50 + i * 5], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <line key={`${i}-${j}`}
                  x1={node.x} y1={node.y + 18}
                  x2={node.x + (child.x - node.x) * treeEnter}
                  y2={node.y + 18 + (child.y - node.y - 18) * treeEnter}
                  stroke={PURPLE} strokeWidth={2}
                  opacity={treeEnter * branchOp * 0.5}
                  strokeDasharray="6 3" />
              );
            })
          )}

          {/* Nodes */}
          {DECISION_TREE.map((node, i) => {
            const nodeOp = interpolate(frame, [32 + i * 4, 48 + i * 4], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const isRoot = i === 0;
            const nodeR = isRoot ? 28 : 22;
            return (
              <g key={i} opacity={nodeOp * treeEnter}>
                <circle cx={node.x} cy={node.y} r={nodeR}
                  fill={isRoot ? PURPLE : '#F9FAFB'}
                  stroke={PURPLE} strokeWidth={isRoot ? 3 : 2}
                  filter={isRoot ? 'url(#purpleGlow08)' : 'url(#shadow)'} />
                <text x={node.x} y={node.y + 6} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={isRoot ? 22 : 16}
                  fontWeight={900} fill={isRoot ? 'white' : PURPLE}>
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* ── Decision tree label ── */}
          <text x={540} y={960} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={700}
            fill={PURPLE} opacity={treeEnter * 0.5} letterSpacing="0.08em">
            DECISION BRANCHING
          </text>

          {/* ── Bottom insight box ── */}
          <g opacity={bottomEnter}>
            <rect x={120} y={1330} width={840} height={150} rx={18}
              fill="#F9FAFB" stroke={PURPLE} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.9} />
            <rect x={120} y={1330} width={6} height={150} rx={3} fill={PURPLE} />
            <text x={170} y={1378} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              It reasons about what to do next.
            </text>
            <text x={170} y={1418} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={PURPLE}>
              That is think.
            </text>
            <text x={170} y={1455} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={17} fontWeight={500}
              fill={COLORS.light_gray}>
              Planning · Reasoning · Strategy · Decision-making
            </text>
          </g>

          {/* ── "PROCESSING" status bar ── */}
          <g opacity={neuralEnter * 0.6}>
            <rect x={360} y={780} width={360} height={36} rx={18}
              fill={PURPLE} opacity={0.1} />
            <rect x={360} y={780}
              width={360 * interpolate(frame, [15, 70], [0, 1], { extrapolateRight: 'clamp' })}
              height={36} rx={18} fill={PURPLE} opacity={0.2} />
            <text x={540} y={804} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
              fill={PURPLE} letterSpacing="0.12em">
              REASONING...
            </text>
          </g>

          {/* ── Decorative lines ── */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i}
              x1={80 + i * 50} y1={1540 + i * 20}
              x2={80 + i * 50 + 100} y2={1540 + i * 20}
              stroke={PURPLE} strokeWidth={1} opacity={globalEnter * 0.08}
              strokeLinecap="round" />
          ))}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="It reasons about what to do next. That is think."
          opacity={captionEnter}
          highlightWords={['reasons', 'think']} />
      </PaperBackground>
    </AbsoluteFill>
  );
};
