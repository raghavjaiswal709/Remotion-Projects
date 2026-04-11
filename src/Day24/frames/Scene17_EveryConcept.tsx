/**
 * Scene 17 — Every Concept
 * "Every concept in this series, memory, planning, tools, multi-agent systems..."
 * Show floating concept cards/bubbles for: MEMORY, PLANNING, TOOLS, MULTI-AGENT SYSTEMS
 * Each card has unique icon and color, they orbit around a central loop.
 * Duration: 187 frames (~6.23s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Central loop position ──────────────────────────────────────────────────
const CX = 540;
const CY = 720;
const LOOP_R = 140;

// ── Concept definitions ────────────────────────────────────────────────────
interface ConceptDef {
  label: string;
  icon: string;
  color: string;
  orbitR: number;
  angleOffset: number;
  enterDelay: number;
  iconPaths: string[];
  description: string;
}

const CONCEPTS: ConceptDef[] = [
  {
    label: 'MEMORY',
    icon: 'M',
    color: COLORS.purple,
    orbitR: 320,
    angleOffset: -Math.PI / 2,
    enterDelay: 15,
    iconPaths: [
      'M-18,-15 L18,-15 L18,15 L-18,15 Z',
      'M-12,-8 L12,-8 M-12,-2 L12,-2 M-12,4 L8,4',
    ],
    description: 'Store & recall',
  },
  {
    label: 'PLANNING',
    icon: 'P',
    color: COLORS.vibrant_green,
    orbitR: 320,
    angleOffset: 0,
    enterDelay: 40,
    iconPaths: [
      'M-15,-18 L15,-18 L15,18 L-15,18 Z',
      'M-8,-10 L-2,-4 L8,-14',
      'M-8,-1 L-2,5 L8,-5',
      'M-8,8 L8,8',
    ],
    description: 'Sequence steps',
  },
  {
    label: 'TOOLS',
    icon: 'T',
    color: COLORS.amber,
    orbitR: 320,
    angleOffset: Math.PI / 2,
    enterDelay: 65,
    iconPaths: [
      'M-5,-18 L5,-18 L5,-5 L12,2 L5,9 L5,18 L-5,18 L-5,9 L-12,2 L-5,-5 Z',
    ],
    description: 'External actions',
  },
  {
    label: 'MULTI-AGENT',
    icon: 'MA',
    color: COLORS.vibrant_red,
    orbitR: 320,
    angleOffset: Math.PI,
    enterDelay: 90,
    iconPaths: [
      'M-10,-10 A6,6,0,1,1,-10,-10.001',
      'M10,-10 A6,6,0,1,1,10,-10.001',
      'M0,5 A6,6,0,1,1,0,5.001',
      'M-8,-4 L-2,2 M8,-4 L2,2',
    ],
    description: 'Coordination',
  },
];

// ── Background constellation dots ──────────────────────────────────────────
const CONSTELLATION = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 163.7 + 50) % 1080,
  y: (i * 223.9 + 70) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.59,
}));

// ── Background radial guide circles ────────────────────────────────────────
const GUIDE_CIRCLES = Array.from({ length: 6 }, (_, i) => ({
  r: 80 + i * 60,
  opacity: 0.02 + (i === 2 ? 0.02 : 0),
  dashArray: i % 2 === 0 ? '4 8' : '2 6',
}));

// ── Connection lines from concepts to center ──────────────────────────────
const CONNECTOR_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  conceptIdx: i % 4,
  t: (i % 6) / 6,
  delay: 10 + i * 4,
  size: 2 + (i % 3),
}));

// ── Floating micro particles ──────────────────────────────────────────────
const MICRO_PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  angle: (i / 35) * Math.PI * 2,
  r: 180 + (i % 5) * 40,
  speed: 0.01 + (i % 4) * 0.005,
  size: 1 + (i % 3) * 0.5,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.amber][i % 4],
}));

// ── Grid lines background ──────────────────────────────────────────────────
const BG_GRID_H = Array.from({ length: 12 }, (_, i) => ({
  y: 300 + i * 100,
  opacity: 0.02,
}));
const BG_GRID_V = Array.from({ length: 8 }, (_, i) => ({
  x: 135 * i,
  opacity: 0.02,
}));

// ── Orbit trail marks ──────────────────────────────────────────────────────
const ORBIT_TRAIL = Array.from({ length: 30 }, (_, i) => ({
  angle: (i / 30) * Math.PI * 2,
  size: 1.5,
}));

// ── Decorative plus signs ──────────────────────────────────────────────────
const PLUS_SIGNS = Array.from({ length: 8 }, (_, i) => ({
  x: (i * 137 + 80) % 1080,
  y: (i * 197 + 200) % 1400,
  size: 6 + (i % 3) * 2,
  opacity: 0.05 + (i % 3) * 0.02,
}));

// ── Concept card dimensions ────────────────────────────────────────────────
const CARD_W = 200;
const CARD_H = 210;

// ── Additional concept detail items ────────────────────────────────────────
const CONCEPT_DETAILS = [
  ['Recall context', 'Embed vectors', 'Long-term storage'],
  ['Goal decompose', 'Step ordering', 'Backtrack logic'],
  ['API calls', 'Code exec', 'Search queries'],
  ['Delegation', 'Consensus', 'Specialization'],
];

export const Scene17_EveryConcept: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global animation drivers ─────────────────────────────────────────────
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [3, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [3, 25], [35, 0], { extrapolateRight: 'clamp', easing: ease });
  const loopEnter = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopDash = interpolate(frame, [0, 187], [0, 800], { extrapolateRight: 'clamp' });
  const connectorsEnter = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 15], [0, 1], { extrapolateRight: 'clamp' });
  const seriesLabelEnter = interpolate(frame, [140, 160], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopPulse = Math.sin(frame * 0.05) * 0.08;
  const orbitSpeed = frame * 0.008;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.16}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="cardShadowS17" x="-15%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#0D0D0D" floodOpacity="0.12"/>
            </filter>
            <filter id="loopGlowS17" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="10" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.35" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="iconGlowS17" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {CONCEPTS.map((c, i) => (
              <radialGradient key={i} id={`conceptGrad${i}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={c.color} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={c.color} stopOpacity="0"/>
              </radialGradient>
            ))}
          </defs>

          {/* ── Background grid ── */}
          {BG_GRID_H.map((g, i) => (
            <line key={`h${i}`} x1={0} y1={g.y} x2={1080} y2={g.y}
              stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={enter * g.opacity}/>
          ))}
          {BG_GRID_V.map((g, i) => (
            <line key={`v${i}`} x1={g.x} y1={300} x2={g.x} y2={1500}
              stroke={COLORS.cool_silver} strokeWidth={0.5} opacity={enter * g.opacity}/>
          ))}

          {/* ── Constellation dots ── */}
          {CONSTELLATION.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r}
              fill={COLORS.cool_silver}
              opacity={enter * (0.03 + Math.sin(frame * 0.025 + d.phase) * 0.015)}/>
          ))}

          {/* ── Plus signs ── */}
          {PLUS_SIGNS.map((ps, i) => (
            <g key={i} opacity={enter * ps.opacity}>
              <line x1={ps.x - ps.size} y1={ps.y} x2={ps.x + ps.size} y2={ps.y}
                stroke={COLORS.cool_silver} strokeWidth={1}/>
              <line x1={ps.x} y1={ps.y - ps.size} x2={ps.x} y2={ps.y + ps.size}
                stroke={COLORS.cool_silver} strokeWidth={1}/>
            </g>
          ))}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={400} height={52} rx={12}
              fill={COLORS.cool_silver} opacity={0.9}/>
            <text x={260} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">EVERY CONCEPT</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={175} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              The Series So Far
            </text>
            <text x={540} y={230} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
              fill={COLORS.cool_silver}>
              Every concept revolves around one idea
            </text>
          </g>

          {/* ── Guide circles around center ── */}
          {GUIDE_CIRCLES.map((gc, i) => (
            <circle key={i} cx={CX} cy={CY} r={gc.r}
              fill="none" stroke={COLORS.cool_silver} strokeWidth={0.5}
              strokeDasharray={gc.dashArray} opacity={loopEnter * gc.opacity}/>
          ))}

          {/* ── Micro particles orbiting ── */}
          {MICRO_PARTICLES.map((mp, i) => {
            const a = mp.angle + frame * mp.speed;
            const px = CX + Math.cos(a) * mp.r;
            const py = CY + Math.sin(a) * mp.r;
            return (
              <circle key={i} cx={px} cy={py} r={mp.size}
                fill={mp.color} opacity={loopEnter * 0.08}/>
            );
          })}

          {/* ── Central loop ── */}
          <g filter="url(#loopGlowS17)">
            <LoopArrow cx={CX} cy={CY} r={LOOP_R}
              color={COLORS.electric_cyan} strokeWidth={4}
              dashOffset={loopDash}
              opacity={loopEnter * (0.85 + loopPulse)}
              showArrow={frame > 20}/>
          </g>

          {/* ── Loop center label ── */}
          <g opacity={loopEnter}>
            <text x={CX} y={CY - 10} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
              fill={COLORS.electric_cyan} opacity={0.6}
              letterSpacing="0.1em">THE</text>
            <text x={CX} y={CY + 20} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
              fill={COLORS.electric_cyan}>LOOP</text>
          </g>

          {/* ── Orbit trail ── */}
          {ORBIT_TRAIL.map((ot, i) => {
            const a = ot.angle + orbitSpeed;
            const ox = CX + Math.cos(a) * (LOOP_R + 170);
            const oy = CY + Math.sin(a) * (LOOP_R + 170);
            return (
              <circle key={i} cx={ox} cy={oy} r={ot.size}
                fill={COLORS.electric_cyan} opacity={loopEnter * 0.03}/>
            );
          })}

          {/* ── Concept cards (orbiting) ── */}
          {CONCEPTS.map((concept, ci) => {
            const cEnter = interpolate(frame, [concept.enterDelay, concept.enterDelay + 30], [0, 1],
              { extrapolateRight: 'clamp', easing: ease });
            const cScale = scaleAnim(frame, concept.enterDelay, 30, 0.4, 1);
            const angle = concept.angleOffset + orbitSpeed * 0.5;
            const cx = CX + Math.cos(angle) * concept.orbitR;
            const cy = CY + Math.sin(angle) * concept.orbitR;
            const details = CONCEPT_DETAILS[ci];

            return (
              <g key={concept.label} opacity={cEnter}
                transform={`translate(${cx}, ${cy}) scale(${cScale})`}>
                {/* Radial glow */}
                <circle cx={0} cy={0} r={CARD_W * 0.6}
                  fill={`url(#conceptGrad${ci})`}/>
                {/* Card background */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={CARD_H}
                  rx={16} fill="#FFFFFF" stroke={concept.color}
                  strokeWidth={2} filter="url(#cardShadowS17)"/>
                {/* Color accent bar */}
                <rect x={-CARD_W / 2} y={-CARD_H / 2} width={CARD_W} height={6}
                  rx={3} fill={concept.color} opacity={0.8}/>
                {/* Icon circle */}
                <circle cx={0} cy={-CARD_H / 2 + 55} r={28}
                  fill={concept.color} opacity={0.12}
                  stroke={concept.color} strokeWidth={1.5}/>
                {/* Icon paths */}
                <g transform={`translate(0, ${-CARD_H / 2 + 55})`}
                  filter="url(#iconGlowS17)">
                  {concept.iconPaths.map((p, pi) => (
                    <path key={pi} d={p} fill="none"
                      stroke={concept.color} strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  ))}
                </g>
                {/* Label */}
                <text x={0} y={-CARD_H / 2 + 105} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={17} fontWeight={900}
                  fill={concept.color} letterSpacing="0.1em">
                  {concept.label}
                </text>
                {/* Description */}
                <text x={0} y={-CARD_H / 2 + 130} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={500}
                  fill={COLORS.light_gray}>
                  {concept.description}
                </text>
                {/* Detail items */}
                {details.map((d, di) => (
                  <g key={di}>
                    <circle cx={-CARD_W / 2 + 24} cy={-CARD_H / 2 + 155 + di * 18} r={2.5}
                      fill={concept.color} opacity={0.5}/>
                    <text x={-CARD_W / 2 + 34} y={-CARD_H / 2 + 159 + di * 18}
                      fontFamily="'Courier New', monospace" fontSize={11} fontWeight={500}
                      fill={COLORS.cool_silver}>
                      {d}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* ── Connector particles from concepts to center ── */}
          {CONNECTOR_PARTICLES.map((cp, i) => {
            const concept = CONCEPTS[cp.conceptIdx];
            const cpEnter = interpolate(frame, [cp.delay + 100, cp.delay + 115], [0, 1], { extrapolateRight: 'clamp' });
            const progress = ((frame - cp.delay) * 0.015 + cp.t) % 1;
            const angle = concept.angleOffset + orbitSpeed * 0.5;
            const sx = CX + Math.cos(angle) * concept.orbitR;
            const sy = CY + Math.sin(angle) * concept.orbitR;
            const px = sx + (CX - sx) * progress;
            const py = sy + (CY - sy) * progress;
            return (
              <circle key={i} cx={px} cy={py} r={cp.size}
                fill={concept.color}
                opacity={connectorsEnter * cpEnter * Math.sin(progress * Math.PI) * 0.4}/>
            );
          })}

          {/* ── Dashed connection lines ── */}
          {CONCEPTS.map((concept, i) => {
            const cEnter = interpolate(frame, [concept.enterDelay + 25, concept.enterDelay + 45], [0, 1], { extrapolateRight: 'clamp' });
            const angle = concept.angleOffset + orbitSpeed * 0.5;
            const cx = CX + Math.cos(angle) * concept.orbitR;
            const cy = CY + Math.sin(angle) * concept.orbitR;
            return (
              <line key={i} x1={cx} y1={cy} x2={CX} y2={CY}
                stroke={concept.color} strokeWidth={1}
                strokeDasharray="4 8" opacity={cEnter * 0.15}/>
            );
          })}

          {/* ── "This series" label ── */}
          <g opacity={seriesLabelEnter}>
            <rect x={320} y={1100} width={440} height={60} rx={30}
              fill="#FFFFFF" stroke={COLORS.electric_cyan} strokeWidth={1.5}
              filter="url(#cardShadowS17)"/>
            <text x={540} y={1138} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
              fill={COLORS.deep_black}>
              All built around <tspan fill={COLORS.electric_cyan} fontWeight={900}>one loop</tspan>
            </text>
          </g>

          {/* ── Footer code ── */}
          <text x={540} y={1220} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.2}
            letterSpacing="0.05em">
            concepts = [memory, planning, tools, multi_agent]
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="Every concept in this series, memory, planning, tools, multi-agent systems..."
          opacity={captionEnter}
          highlightWords={['memory', 'planning', 'tools', 'multi-agent systems']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
