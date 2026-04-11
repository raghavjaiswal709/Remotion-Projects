/**
 * Scene15_KnowledgeBuilds.tsx — Day 26: Observations
 *
 * "Every piece of knowledge the agent builds up during a task
 *  arrives through observations."
 *
 * Tower/stack of knowledge blocks building upward, each block labeled
 * with observation data. Agent at bottom watching tower grow. Each block
 * slides in from right with data text. "KNOWLEDGE" label at top glowing.
 * Progress bar filling. Sparkle effects on each new block.
 *
 * Canvas: 1080×1920 portrait (9:16), 30fps.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ── Knowledge blocks ─────────────────────────────────────────────────── */
const blocks = [
  { label: 'search_results', data: '{ results: 42 }', color: COLORS.electric_cyan, delay: 12 },
  { label: 'file_status', data: '{ status: "ok" }', color: COLORS.vibrant_green, delay: 22 },
  { label: 'db_rows', data: '{ rows: [1,2,3] }', color: COLORS.warm_blue, delay: 32 },
  { label: 'api_response', data: '{ code: 200 }', color: COLORS.amber, delay: 42 },
  { label: 'sensor_data', data: '{ temp: 22.5 }', color: COLORS.purple, delay: 52 },
  { label: 'user_input', data: '{ msg: "yes" }', color: COLORS.electric_cyan, delay: 62 },
  { label: 'env_state', data: '{ pos: [x,y] }', color: COLORS.vibrant_green, delay: 72 },
];

const BLOCK_W = 900;
const BLOCK_H = 110;
const STACK_X = 90;
const STACK_BASE_Y = 1320;

/* ── Sparkle particles ────────────────────────────────────────────────── */
const sparkles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  angle: (i / 40) * Math.PI * 2,
  dist: 20 + (i % 6) * 12,
  size: 1.5 + (i % 3) * 1,
  phase: (i * 1.9) % (Math.PI * 2),
  blockIdx: i % 7,
}));

/* ── Background particles ─────────────────────────────────────────────── */
const bgParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: (i * 139) % 1080,
  y: (i * 197) % 1920,
  r: 0.8 + (i % 4) * 0.4,
  phase: (i * 2.1) % (Math.PI * 2),
}));

/* ── Circuit lines ────────────────────────────────────────────────────── */
const circuitLines = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 50 + (i * 107) % 980,
  y: 100 + (i * 163) % 1720,
  len: 20 + (i % 4) * 15,
  horiz: i % 2 === 0,
}));

/* ── Data flow dots ───────────────────────────────────────────────────── */
const dataDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  startX: 1100,
  yBase: STACK_BASE_Y - (i % 7) * (BLOCK_H + 10),
  speed: 3 + (i % 4) * 1.5,
  size: 2 + (i % 3),
  delay: 10 + (i % 7) * 10,
}));

export const Scene15_KnowledgeBuilds: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const agentScale = interpolate(frame, [5, 20], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const progressFill = interpolate(frame, [12, 82], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const knowledgeGlow = interpolate(
    frame % 40, [0, 20, 40], [0.6, 1, 0.6],
    { extrapolateRight: 'clamp' }
  );

  const subtitleOpacity = interpolate(frame, [75, 88], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const circuitOpacity = interpolate(frame, [3, 15], [0, 0.15], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const towerLabelScale = interpolate(frame, [80, 92], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const knowledgeLabelY = interpolate(frame, [80, 92], [30, 0], {
    easing: ease, extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="blockShadow" x="-5%" y="-5%" width="110%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.electric_cyan} />
            <stop offset="50%" stopColor={COLORS.vibrant_green} />
            <stop offset="100%" stopColor={COLORS.warm_blue} />
          </linearGradient>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Background particles ─────────────────────────────────── */}
        <g opacity={fadeIn * 0.4}>
          {bgParticles.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.r}
              fill={COLORS.cool_silver}
              opacity={0.2 + Math.sin(frame * 0.04 + p.phase) * 0.15} />
          ))}
        </g>

        {/* ── Circuit lines ────────────────────────────────────────── */}
        <g opacity={circuitOpacity}>
          {circuitLines.map((c) => (
            <line key={c.id}
              x1={c.x} y1={c.y}
              x2={c.horiz ? c.x + c.len : c.x}
              y2={c.horiz ? c.y : c.y + c.len}
              stroke={COLORS.cool_silver} strokeWidth="1" strokeLinecap="round"
            />
          ))}
        </g>

        {/* ── Title ────────────────────────────────────────────────── */}
        <g opacity={titleOpacity}>
          <text x={540} y={150} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="62" fontFamily="monospace"
            fontWeight="900" letterSpacing="4" filter="url(#cyanGlow)">
            KNOWLEDGE TOWER
          </text>
          <line x1={200} y1={180} x2={880} y2={180}
            stroke={COLORS.electric_cyan} strokeWidth="3" opacity={0.4} />
        </g>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        <g opacity={fadeIn}>
          <rect x={160} y={230} width={680} height={24} rx="12"
            fill="#1A1A2E" stroke={COLORS.cool_silver} strokeWidth="1.5" />
          <rect x={162} y={232} width={676 * progressFill} height={20} rx="10"
            fill="url(#progressGrad)" filter="url(#cyanGlow)" />
          <text x={870} y={252} textAnchor="start"
            fill={COLORS.soft_white} fontSize="56" fontFamily="monospace" fontWeight="900">
            {Math.round(progressFill * 100)}%
          </text>
        </g>

        {/* ── Knowledge blocks stacking upward ─────────────────────── */}
        {blocks.map((b, i) => {
          const slideX = interpolate(frame, [b.delay, b.delay + 15], [500, 0], {
            easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const blockScale = scaleAnim(frame, b.delay, 15, 0.9, 1);
          const blockOpacity = interpolate(frame, [b.delay, b.delay + 10], [0, 1], {
            easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const blockY = STACK_BASE_Y - i * (BLOCK_H + 20);

          return (
            <g key={i} opacity={blockOpacity}
              transform={`translate(${slideX}, 0) scale(${blockScale})`}>
              {/* Block rect */}
              <rect
                x={STACK_X} y={blockY} width={BLOCK_W} height={BLOCK_H}
                rx="20" fill="#111827" stroke={b.color} strokeWidth="3.5"
                filter="url(#blockShadow)"
              />
              {/* Color accent bar */}
              <rect x={STACK_X} y={blockY} width={12} height={BLOCK_H}
                rx="6" fill={b.color} />
              {/* Block number */}
              <circle cx={STACK_X + 50} cy={blockY + BLOCK_H / 2} r="25"
                fill="none" stroke={b.color} strokeWidth="2" />
              <text x={STACK_X + 50} y={blockY + BLOCK_H / 2 + 15}
                textAnchor="middle" fill={b.color} fontSize="42" fontWeight="bold" fontFamily="monospace">
                {i + 1}
              </text>
              {/* Label */}
              <text x={STACK_X + 110} y={blockY + 50} textAnchor="start"
                fill={COLORS.soft_white} fontSize="68" fontFamily="monospace"
                fontWeight="900">
                {b.label}
              </text>
              {/* Data */}
              <text x={STACK_X + 110} y={blockY + 92} textAnchor="start"
                fill={b.color} fontSize="52" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                {b.data}
              </text>
              {/* Arrow icon on right */}
              <polygon
                points={`${STACK_X + BLOCK_W - 40},${blockY + BLOCK_H / 2 - 12} ${STACK_X + BLOCK_W - 15},${blockY + BLOCK_H / 2} ${STACK_X + BLOCK_W - 40},${blockY + BLOCK_H / 2 + 12}`}
                fill={b.color} opacity={0.6}
              />
            </g>
          );
        })}

        {/* ── Sparkle effects on new blocks ─────────────────────────── */}
        <g>
          {sparkles.map((s) => {
            const b = blocks[s.blockIdx];
            const sparkleOpacity = interpolate(
              frame, [b.delay + 8, b.delay + 15, b.delay + 25], [0, 0.8, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const blockY = STACK_BASE_Y - s.blockIdx * (BLOCK_H + 12) + BLOCK_H / 2;
            const sx = STACK_X + BLOCK_W / 2 + Math.cos(s.angle) * s.dist;
            const sy = blockY + Math.sin(s.angle) * s.dist;
            return (
              <circle key={s.id} cx={sx} cy={sy} r={s.size}
                fill={b.color} opacity={sparkleOpacity} />
            );
          })}
        </g>

        {/* ── Data flow dots coming from right ─────────────────────── */}
        <g opacity={0.5}>
          {dataDots.map((d) => {
            const prog = interpolate(frame, [d.delay, d.delay + 20], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const dotX = d.startX - (d.startX - (STACK_X + BLOCK_W)) * prog;
            const dotOp = interpolate(prog, [0, 0.3, 0.8, 1], [0, 0.8, 0.8, 0], {
              extrapolateRight: 'clamp',
            });
            return (
              <circle key={d.id} cx={dotX} cy={d.yBase + BLOCK_H / 2}
                r={d.size} fill={COLORS.electric_cyan} opacity={dotOp} />
            );
          })}
        </g>

        {/* ── Agent at bottom ────────────────────────────────────────── */}
        <g transform={`translate(540, 1460) scale(${agentScale * 1.5})`} opacity={fadeIn}>
          {/* Robot head */}
          <rect x="-35" y="-50" width="70" height="60" rx="12" fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="2" filter="url(#softGlow)" />
          {/* Eyes */}
          <circle cx="-15" cy="-25" r="4.5" fill={COLORS.electric_cyan} filter="url(#cyanGlow)" />
          <circle cx="15" cy="-25" r="4.5" fill={COLORS.electric_cyan} filter="url(#cyanGlow)" />
          {/* Antenna */}
          <line x1="0" y1="-50" x2="0" y2="-65" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="0" cy="-65" r="3" fill={COLORS.electric_cyan} />
          {/* Neck */}
          <rect x="-10" y="10" width="20" height="15" fill={COLORS.cool_silver} opacity="0.4" />
          {/* Body */}
          <rect x="-50" y="25" width="100" height="85" rx="14" fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="2.5" />
        </g>

        {/* ── Subtitle labels ────────────────────────────────────────── */}
        <g transform="translate(540, 1680)" opacity={subtitleOpacity}>
          <rect x="-460" y="-70" width="920" height="180" rx="24" fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth="3" opacity="0.9" filter="url(#cyanGlow)" />
          <text y="5" textAnchor="middle" fill={COLORS.soft_white} fontSize="52" fontWeight="bold" fontFamily="monospace">
            All knowledge arrives
          </text>
          <text y="75" textAnchor="middle" fill={COLORS.electric_cyan} fontSize="64" fontWeight="900" fontFamily="monospace" filter="url(#cyanGlow)">
            through observations.
          </text>
        </g>

        {/* ── "KNOWLEDGE" floating label ──────────────────────────────── */}
        <g transform={`translate(540, ${380 + knowledgeLabelY}) scale(${towerLabelScale})`} opacity={towerLabelScale}>
          <rect x="-180" y="-45" width="360" height="85" rx="16" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2.5" opacity={knowledgeGlow} filter="url(#softGlow)" />
          <text y="15" textAnchor="middle" fill={COLORS.electric_cyan} fontSize="52" fontWeight="900" fontFamily="monospace" letterSpacing="4" filter="url(#cyanGlow)">
            KNOWLEDGE
          </text>
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.03}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.electric_cyan} strokeWidth="1" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
