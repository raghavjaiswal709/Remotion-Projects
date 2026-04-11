/**
 * Scene 13 — Execution Sequence
 * "It is the literal execution sequence inside every production agentic system in existence."
 * Show code execution visualization, system architecture diagram.
 * Multiple processing nodes connected, data flowing through pipeline.
 * Duration: 161 frames (5.37s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Pipeline nodes — the execution architecture ────────────────────────────
const PIPELINE_NODES = [
  { id: 'input',     label: 'INPUT',       x: 540, y: 320,  color: COLORS.cool_silver, variant: 'default' as const, delay: 10 },
  { id: 'perceive',  label: 'PERCEIVE',    x: 220, y: 520,  color: COLORS.vibrant_green, variant: 'default' as const, delay: 20 },
  { id: 'think',     label: 'THINK',       x: 540, y: 520,  color: COLORS.warm_blue, variant: 'default' as const, delay: 30 },
  { id: 'act',       label: 'ACT',         x: 860, y: 520,  color: COLORS.vibrant_red, variant: 'default' as const, delay: 40 },
  { id: 'observe',   label: 'OBSERVE',     x: 540, y: 720,  color: COLORS.amber, variant: 'default' as const, delay: 50 },
  { id: 'loop',      label: 'LOOP CTRL',   x: 220, y: 720,  color: COLORS.purple, variant: 'default' as const, delay: 60 },
  { id: 'output',    label: 'OUTPUT',      x: 860, y: 720,  color: COLORS.electric_cyan, variant: 'default' as const, delay: 55 },
];

// ── Connection edges between nodes ─────────────────────────────────────────
const EDGES = [
  { from: 'input',    to: 'perceive',  delay: 25 },
  { from: 'input',    to: 'think',     delay: 30 },
  { from: 'perceive', to: 'think',     delay: 40 },
  { from: 'think',    to: 'act',       delay: 50 },
  { from: 'act',      to: 'observe',   delay: 60 },
  { from: 'act',      to: 'output',    delay: 58 },
  { from: 'observe',  to: 'loop',      delay: 70 },
  { from: 'loop',     to: 'perceive',  delay: 80 },
];

// ── Data flow particles along edges ────────────────────────────────────────
const FLOW_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  edgeIdx: i % EDGES.length,
  offset: (i / 32),
  size: 3 + (i % 3) * 1.5,
  speed: 0.02 + (i % 4) * 0.005,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.vibrant_green, COLORS.amber][i % 4],
}));

// ── Code execution lines (pseudo-code sidebar) ────────────────────────────
const CODE_LINES = [
  { text: 'while agent.running:', indent: 0, color: COLORS.purple, delay: 20 },
  { text: '  state = perceive(world)', indent: 1, color: COLORS.vibrant_green, delay: 30 },
  { text: '  plan  = think(state)', indent: 1, color: COLORS.warm_blue, delay: 40 },
  { text: '  result = act(plan)', indent: 1, color: COLORS.vibrant_red, delay: 50 },
  { text: '  feedback = observe(result)', indent: 1, color: COLORS.amber, delay: 60 },
  { text: '  world.update(feedback)', indent: 1, color: COLORS.cool_silver, delay: 70 },
  { text: '  # loop continues...', indent: 1, color: COLORS.light_gray, delay: 80 },
];

// ── Background grid lines ──────────────────────────────────────────────────
const GRID_H = Array.from({ length: 20 }, (_, i) => i * 96);
const GRID_V = Array.from({ length: 12 }, (_, i) => i * 96);

// ── Ambient background particles ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 163.7 + 30) % 1080,
  y: (i * 209.3 + 50) % 1920,
  r: 1 + (i % 3) * 0.6,
  speed: 0.12 + (i % 5) * 0.06,
  phase: i * 0.45,
}));

// ── System status indicators ───────────────────────────────────────────────
const STATUS_ITEMS = [
  { label: 'EXEC_MODE', value: 'PRODUCTION', color: COLORS.vibrant_green },
  { label: 'LOOP_STATUS', value: 'ACTIVE', color: COLORS.electric_cyan },
  { label: 'AGENT_COUNT', value: '∞', color: COLORS.amber },
];

// ── Highlight pulse ring data ──────────────────────────────────────────────
const HIGHLIGHT_PULSES = Array.from({ length: 5 }, (_, i) => ({
  r: 60 + i * 40,
  delay: 90 + i * 6,
  width: 2 - i * 0.3,
}));

// helper: find node by id
const nodeById = (id: string) => PIPELINE_NODES.find(n => n.id === id)!;

export const Scene13_ExecutionSequence: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [5, 30], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const codeEnter = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const archEnter = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const flowEnter = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const statusEnter = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Active execution pointer cycling through nodes
  const activeNodeIdx = Math.floor(((frame % 80) / 80) * PIPELINE_NODES.length);

  // Code highlight line
  const activeCodeLine = Math.min(CODE_LINES.length - 1, Math.floor(frame / 20));

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.2}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="nodeGlowS13" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.4" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="codeGlowS13" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="edgeGradS13" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={COLORS.warm_blue} stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="codeBgS13" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E"/>
              <stop offset="100%" stopColor="#0D0D1A"/>
            </linearGradient>
          </defs>

          {/* ── Background grid ── */}
          {GRID_H.map((y, i) => (
            <line key={`h${i}`} x1={0} y1={y} x2={1080} y2={y}
              stroke={COLORS.cool_silver} strokeWidth={0.5}
              opacity={enter * 0.04}/>
          ))}
          {GRID_V.map((x, i) => (
            <line key={`v${i}`} x1={x} y1={0} x2={x} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth={0.5}
              opacity={enter * 0.04}/>
          ))}

          {/* ── Background ambient particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 35) % 1920;
            return (
              <circle key={i}
                cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={COLORS.electric_cyan}
                opacity={enter * (0.04 + Math.sin(frame * 0.04 + p.phase) * 0.02)}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={400} height={52} rx={12}
              fill={COLORS.deep_black} opacity={0.9}/>
            <text x={260} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.electric_cyan} letterSpacing="0.12em">EXECUTION SEQUENCE</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={170} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              The Literal Execution
            </text>
            <text x={540} y={228} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700}
              fill={COLORS.warm_blue}>
              Inside Every Production System
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={180} y1={265} x2={900} y2={265}
            stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={titleEnter * 0.15}/>

          {/* ── Connection edges ── */}
          {EDGES.map((edge, i) => {
            const fromNode = nodeById(edge.from);
            const toNode = nodeById(edge.to);
            const edgeEnter = interpolate(frame, [edge.delay, edge.delay + 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const dashLen = 200;
            const dashOff = dashLen * (1 - edgeEnter);
            return (
              <line key={i}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke="url(#edgeGradS13)" strokeWidth={2}
                strokeDasharray={dashLen}
                strokeDashoffset={dashOff}
                opacity={archEnter * 0.6}
                markerEnd="url(#arrowhead)"/>
            );
          })}

          {/* ── Arrowhead marker ── */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7"
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7"
                fill={COLORS.electric_cyan} opacity={0.5}/>
            </marker>
          </defs>

          {/* ── Data flow particles along edges ── */}
          {FLOW_PARTICLES.map((fp, i) => {
            const edge = EDGES[fp.edgeIdx];
            const fromNode = nodeById(edge.from);
            const toNode = nodeById(edge.to);
            const t = ((frame * fp.speed + fp.offset) % 1);
            const px = fromNode.x + (toNode.x - fromNode.x) * t;
            const py = fromNode.y + (toNode.y - fromNode.y) * t;
            return (
              <circle key={i}
                cx={px} cy={py} r={fp.size}
                fill={fp.color}
                opacity={flowEnter * 0.5 * (0.3 + Math.sin(t * Math.PI) * 0.7)}/>
            );
          })}

          {/* ── Pipeline processor nodes ── */}
          {PIPELINE_NODES.map((node, i) => {
            const nEnter = interpolate(frame, [node.delay, node.delay + 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const isActive = activeNodeIdx === i;
            const pulseScale = isActive ? 1 + Math.sin(frame * 0.3) * 0.06 : 1;
            const nodeSize = 65;

            return (
              <g key={node.id} opacity={nEnter * archEnter}>
                {/* Active highlight glow */}
                {isActive && (
                  <circle cx={node.x} cy={node.y} r={nodeSize + 12}
                    fill={node.color} opacity={0.1}
                    filter="url(#nodeGlowS13)"/>
                )}
                {/* Node body */}
                <g transform={`translate(${node.x}, ${node.y}) scale(${pulseScale}) translate(${-node.x}, ${-node.y})`}>
                  <rect x={node.x - nodeSize} y={node.y - 30} width={nodeSize * 2} height={60}
                    rx={12} fill="#FFFFFF" stroke={node.color}
                    strokeWidth={isActive ? 3 : 1.5}
                    filter="url(#shadow)"/>
                  {/* Node dot */}
                  <circle cx={node.x - nodeSize + 18} cy={node.y}
                    r={6} fill={node.color} opacity={0.8}/>
                  {/* Label */}
                  <text x={node.x + 8} y={node.y + 5} textAnchor="middle"
                    fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
                    fill={node.color} letterSpacing="0.06em">
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ── Execution highlight pulse ── */}
          {frame > 90 && HIGHLIGHT_PULSES.map((hp, i) => {
            const hpEnter = interpolate(frame, [hp.delay, hp.delay + 12], [0, 1], { extrapolateRight: 'clamp' });
            const hpFade = interpolate(frame, [hp.delay + 12, hp.delay + 24], [0.3, 0], { extrapolateRight: 'clamp' });
            return (
              <circle key={i}
                cx={540} cy={580} r={hp.r * hpEnter}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={hp.width}
                opacity={hpFade}/>
            );
          })}

          {/* ── Code panel (left sidebar) ── */}
          <g opacity={codeEnter}>
            <rect x={60} y={830} width={480} height={310} rx={14}
              fill="url(#codeBgS13)" stroke={COLORS.electric_cyan}
              strokeWidth={1} opacity={0.95}
              filter="url(#shadow)"/>
            {/* Code window dots */}
            <circle cx={88} cy={858} r={6} fill="#EF4444" opacity={0.8}/>
            <circle cx={108} cy={858} r={6} fill="#F59E0B" opacity={0.8}/>
            <circle cx={128} cy={858} r={6} fill="#22C55E" opacity={0.8}/>
            <text x={200} y={862} textAnchor="start"
              fontFamily="'Courier New', monospace" fontSize={13} fontWeight={600}
              fill={COLORS.cool_silver} opacity={0.5}>agent_loop.py</text>

            {/* Code lines */}
            {CODE_LINES.map((line, i) => {
              const lineEnter = interpolate(frame, [line.delay, line.delay + 12], [0, 1], { extrapolateRight: 'clamp' });
              const isActiveLine = activeCodeLine === i;
              const lineY = 900 + i * 32;
              return (
                <g key={i} opacity={lineEnter}>
                  {/* Active line highlight */}
                  {isActiveLine && (
                    <rect x={66} y={lineY - 14} width={468} height={28}
                      rx={4} fill={COLORS.electric_cyan} opacity={0.06}/>
                  )}
                  {/* Line number */}
                  <text x={86} y={lineY} textAnchor="end"
                    fontFamily="'Courier New', monospace" fontSize={14}
                    fill={COLORS.light_gray} opacity={0.35}>
                    {i + 1}
                  </text>
                  {/* Code text */}
                  <text x={100 + line.indent * 16} y={lineY} textAnchor="start"
                    fontFamily="'Courier New', monospace" fontSize={15} fontWeight={600}
                    fill={line.color}
                    filter={isActiveLine ? 'url(#codeGlowS13)' : undefined}>
                    {line.text}
                  </text>
                  {/* Execution cursor */}
                  {isActiveLine && (
                    <rect x={72} y={lineY - 10} width={3} height={20}
                      rx={1.5} fill={COLORS.electric_cyan}
                      opacity={Math.sin(frame * 0.4) > 0 ? 0.9 : 0.3}/>
                  )}
                </g>
              );
            })}
          </g>

          {/* ── "In Existence" emphasis box ── */}
          <g opacity={bottomEnter}>
            <rect x={560} y={855} width={460} height={120} rx={14}
              fill="#FFFFFF" stroke={COLORS.vibrant_red} strokeWidth={2}
              filter="url(#shadow)"/>
            <text x={790} y={900} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={800}
              fill={COLORS.vibrant_red} letterSpacing="0.10em">
              EVERY SYSTEM
            </text>
            <text x={790} y={940} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
              fill={COLORS.deep_black}>
              In Existence
            </text>
          </g>

          {/* ── Status indicators ── */}
          {STATUS_ITEMS.map((item, i) => {
            const sEnter = interpolate(frame, [102 + i * 10, 122 + i * 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const sx = 160 + i * 360;
            return (
              <g key={item.label} opacity={sEnter * statusEnter}>
                <rect x={sx - 140} y={1040} width={280} height={90} rx={12}
                  fill="#F9FAFB" stroke={item.color} strokeWidth={1.5}
                  filter="url(#shadow)"/>
                <text x={sx} y={1072} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={13} fontWeight={700}
                  fill={item.color} letterSpacing="0.08em" opacity={0.6}>
                  {item.label}
                </text>
                <text x={sx} y={1108} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={900}
                  fill={item.color}>
                  {item.value}
                </text>
              </g>
            );
          })}

          {/* ── Bottom insight panel ── */}
          <g opacity={bottomEnter}>
            <rect x={100} y={1180} width={880} height={130} rx={16}
              fill="#FFFFFF" stroke={COLORS.warm_blue} strokeWidth={1.5}
              opacity={0.92} filter="url(#shadow)"/>
            <rect x={100} y={1180} width={6} height={130} rx={3}
              fill={COLORS.warm_blue}/>
            <text x={150} y={1230} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
              fill={COLORS.deep_black}>
              Not theory. Not abstraction.
            </text>
            <text x={150} y={1272} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
              fill={COLORS.light_gray}>
              This is the actual code running in every agentic system.
            </text>
          </g>

          {/* ── Monospace footer ── */}
          <text x={540} y={1370} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={15} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.25}
            letterSpacing="0.08em">
            execution_sequence // frame {frame} / 161
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="It is the literal execution sequence inside every production agentic system."
          opacity={captionEnter}
          highlightWords={['literal execution sequence', 'production', 'agentic system']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
