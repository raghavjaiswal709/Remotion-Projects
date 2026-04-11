/**
 * Scene 18 — Loop More Capable
 * "...exists to make this loop more capable."
 * All concept bubbles from Scene17 connect/flow into central loop.
 * Loop grows bigger/brighter as concepts attach to it.
 * Duration: 72 frames (~2.4s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Central loop position ──────────────────────────────────────────────────
const CX = 540;
const CY = 680;

// ── Concept definitions (matching Scene17) ─────────────────────────────────
const CONCEPTS = [
  { label: 'MEMORY', color: COLORS.purple, startAngle: -Math.PI / 2, startR: 350 },
  { label: 'PLANNING', color: COLORS.vibrant_green, startAngle: 0, startR: 350 },
  { label: 'TOOLS', color: COLORS.amber, startAngle: Math.PI / 2, startR: 350 },
  { label: 'MULTI-AGENT', color: COLORS.vibrant_red, startAngle: Math.PI, startR: 350 },
];

// ── Concept icon shorthand paths ───────────────────────────────────────────
const CONCEPT_ICONS: string[][] = [
  ['M-12,-10 L12,-10 L12,10 L-12,10 Z', 'M-6,-3 L6,-3 M-6,3 L6,3'],
  ['M-10,-12 L10,-12 L10,12 L-10,12 Z', 'M-5,-5 L0,0 L5,-10'],
  ['M-4,-14 L4,-14 L4,-2 L10,5 L4,12 L-4,12 L-10,5 L-4,-2 Z'],
  ['M-7,-7 A5,5,0,1,1,-7,-6.99', 'M7,-7 A5,5,0,1,1,7,-6.99', 'M0,6 A5,5,0,1,1,0,6.01'],
];

// ── Particle streams flowing from concepts into center ─────────────────────
const STREAM_PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  conceptIdx: i % 4,
  tOffset: (i % 15) / 15,
  size: 2 + (i % 4),
  speed: 0.018 + (i % 5) * 0.004,
}));

// ── Glow rings that pulse outward when concepts merge ──────────────────────
const MERGE_RINGS = Array.from({ length: 6 }, (_, i) => ({
  delay: 20 + i * 6,
  maxR: 200 + i * 35,
  width: 2.5 - i * 0.3,
  color: [COLORS.purple, COLORS.vibrant_green, COLORS.amber, COLORS.vibrant_red, COLORS.electric_cyan, COLORS.warm_blue][i],
}));

// ── Background ambient particles ───────────────────────────────────────────
const AMBIENT = Array.from({ length: 35 }, (_, i) => ({
  x: (i * 151.3 + 40) % 1080,
  y: (i * 209.7 + 60) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.61,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.amber][i % 4],
}));

// ── Radial lines converging to center ──────────────────────────────────────
const RADIAL_LINES = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  innerR: 160,
  outerR: 450,
  width: 0.5 + (i % 3) * 0.3,
}));

// ── Capability keywords that appear ────────────────────────────────────────
const CAPABILITY_WORDS = [
  { text: 'RECALL', x: 210, y: 460, color: COLORS.purple, delay: 35 },
  { text: 'SEQUENCE', x: 870, y: 500, color: COLORS.vibrant_green, delay: 40 },
  { text: 'EXECUTE', x: 180, y: 880, color: COLORS.amber, delay: 45 },
  { text: 'DELEGATE', x: 860, y: 850, color: COLORS.vibrant_red, delay: 50 },
];

// ── Grid pattern background ────────────────────────────────────────────────
const BG_GRID = Array.from({ length: 80 }, (_, i) => ({
  x: (i % 10) * 120 + 10,
  y: Math.floor(i / 10) * 240,
  size: 2,
}));

// ── Loop growth keyframes ──────────────────────────────────────────────────
const LOOP_R_START = 100;
const LOOP_R_END = 180;
const LOOP_STROKE_START = 3;
const LOOP_STROKE_END = 6;

// ── Energy burst lines (appear at merge moments) ──────────────────────────
const ENERGY_BURSTS = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  length: 30 + (i % 4) * 15,
  delay: 25 + (i % 4) * 8,
  width: 1.5,
}));

// ── Decorative hexagon vertices around the loop ────────────────────────────
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
  return { x: Math.cos(a) * 220, y: Math.sin(a) * 220 };
});

// ── Progress bar segments ──────────────────────────────────────────────────
const PROGRESS_SEGMENTS = CONCEPTS.map((c, i) => ({
  x: 190 + i * 200,
  color: c.color,
  label: c.label.slice(0, 4),
}));

export const Scene18_LoopMoreCapable: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [2, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const mergeProgress = interpolate(frame, [8, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopGrow = interpolate(frame, [10, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopR = interpolate(loopGrow, [0, 1], [LOOP_R_START, LOOP_R_END]);
  const loopStroke = interpolate(loopGrow, [0, 1], [LOOP_STROKE_START, LOOP_STROKE_END]);
  const loopBright = interpolate(frame, [10, 65], [0.6, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [2, 12], [0, 1], { extrapolateRight: 'clamp' });
  const loopDash = interpolate(frame, [0, 72], [0, 500], { extrapolateRight: 'clamp' });
  const progressEnter = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const insightEnter = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const hexEnter = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopPulse = Math.sin(frame * 0.08) * 0.12;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.16}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="megaGlowS18" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="conceptGlowS18" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="coreRadialS18" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.25"/>
              <stop offset="60%" stopColor={COLORS.electric_cyan} stopOpacity="0.05"/>
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* ── Background grid ── */}
          {BG_GRID.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r={g.size}
              fill={COLORS.cool_silver} opacity={enter * 0.03}/>
          ))}

          {/* ── Ambient particles ── */}
          {AMBIENT.map((p, i) => {
            const drift = Math.sin(frame * 0.04 + p.phase) * 8;
            return (
              <circle key={i} cx={p.x + drift} cy={p.y} r={p.r}
                fill={p.color} opacity={enter * 0.05}/>
            );
          })}

          {/* ── Radial converging lines ── */}
          {RADIAL_LINES.map((rl, i) => {
            const rlEnter = interpolate(frame, [5 + i, 20 + i], [0, 1], { extrapolateRight: 'clamp' });
            const shrink = interpolate(mergeProgress, [0, 1], [rl.outerR, rl.innerR + 20]);
            return (
              <line key={i}
                x1={CX + Math.cos(rl.angle) * rl.innerR}
                y1={CY + Math.sin(rl.angle) * rl.innerR}
                x2={CX + Math.cos(rl.angle) * shrink}
                y2={CY + Math.sin(rl.angle) * shrink}
                stroke={COLORS.cool_silver} strokeWidth={rl.width}
                opacity={rlEnter * 0.05}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={440} height={52} rx={12}
              fill={COLORS.cool_silver} opacity={0.9}/>
            <text x={280} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">LOOP MORE CAPABLE</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter}>
            <text x={540} y={175} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Powering the Loop
            </text>
            <text x={540} y={228} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
              fill={COLORS.cool_silver}>
              Every concept feeds into the core
            </text>
          </g>

          {/* ── Core radial glow (grows with loop) ── */}
          <circle cx={CX} cy={CY} r={loopR + 80}
            fill="url(#coreRadialS18)" opacity={loopBright}/>

          {/* ── Hexagonal frame ── */}
          <polygon
            points={HEX_POINTS.map(p => `${CX + p.x},${CY + p.y}`).join(' ')}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1}
            strokeDasharray="6 10" opacity={hexEnter * 0.1}/>

          {/* ── Merge rings (pulse out when concepts attach) ── */}
          {MERGE_RINGS.map((mr, i) => {
            const ringP = interpolate(frame, [mr.delay, mr.delay + 20], [0, 1], { extrapolateRight: 'clamp' });
            const ringR = interpolate(ringP, [0, 1], [loopR, mr.maxR]);
            const ringOp = (1 - ringP) * 0.2;
            return (
              <circle key={i} cx={CX} cy={CY} r={ringR}
                fill="none" stroke={mr.color} strokeWidth={mr.width}
                opacity={ringOp}/>
            );
          })}

          {/* ── Central loop (grows) ── */}
          <g filter="url(#megaGlowS18)">
            <LoopArrow cx={CX} cy={CY} r={loopR}
              color={COLORS.electric_cyan} strokeWidth={loopStroke}
              dashOffset={loopDash}
              opacity={loopBright + loopPulse}
              showArrow/>
          </g>

          {/* ── Loop center text ── */}
          <g opacity={loopBright}>
            <text x={CX} y={CY + 8} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
              fill={COLORS.electric_cyan}
              opacity={0.8 + loopPulse}>
              LOOP
            </text>
          </g>

          {/* ── Concept bubbles (merge into center) ── */}
          {CONCEPTS.map((concept, ci) => {
            const mergeT = interpolate(frame, [8 + ci * 5, 45 + ci * 5], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const currentR = interpolate(mergeT, [0, 1], [concept.startR, loopR + 15]);
            const cx = CX + Math.cos(concept.startAngle) * currentR;
            const cy = CY + Math.sin(concept.startAngle) * currentR;
            const bubbleScale = interpolate(mergeT, [0, 0.8, 1], [1, 0.8, 0.5], { extrapolateRight: 'clamp' });
            const iconPaths = CONCEPT_ICONS[ci];

            return (
              <g key={ci} opacity={1 - mergeT * 0.3}
                transform={`translate(${cx}, ${cy}) scale(${bubbleScale})`}>
                {/* Bubble */}
                <circle cx={0} cy={0} r={40}
                  fill="#FFFFFF" stroke={concept.color} strokeWidth={2.5}
                  filter="url(#conceptGlowS18)"/>
                {/* Icon */}
                <g>
                  {iconPaths.map((p, pi) => (
                    <path key={pi} d={p} fill="none"
                      stroke={concept.color} strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  ))}
                </g>
                {/* Label */}
                <text x={0} y={55} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={12} fontWeight={800}
                  fill={concept.color} letterSpacing="0.08em"
                  opacity={1 - mergeT * 0.5}>
                  {concept.label}
                </text>
              </g>
            );
          })}

          {/* ── Stream particles ── */}
          {STREAM_PARTICLES.map((sp, i) => {
            const concept = CONCEPTS[sp.conceptIdx];
            const progress = ((frame * sp.speed + sp.tOffset) % 1);
            const currentR = interpolate(progress, [0, 1], [concept.startR, loopR]);
            const px = CX + Math.cos(concept.startAngle) * currentR;
            const py = CY + Math.sin(concept.startAngle) * currentR;
            const pOp = Math.sin(progress * Math.PI) * 0.35;
            return (
              <circle key={i} cx={px} cy={py} r={sp.size}
                fill={concept.color} opacity={mergeProgress * pOp}/>
            );
          })}

          {/* ── Energy bursts ── */}
          {ENERGY_BURSTS.map((eb, i) => {
            const bEnter = interpolate(frame, [eb.delay, eb.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            const bFade = interpolate(frame, [eb.delay + 10, eb.delay + 20], [1, 0], { extrapolateRight: 'clamp' });
            return (
              <line key={i}
                x1={CX + Math.cos(eb.angle) * (loopR + 5)}
                y1={CY + Math.sin(eb.angle) * (loopR + 5)}
                x2={CX + Math.cos(eb.angle) * (loopR + 5 + eb.length * bEnter)}
                y2={CY + Math.sin(eb.angle) * (loopR + 5 + eb.length * bEnter)}
                stroke={COLORS.electric_cyan} strokeWidth={eb.width}
                strokeLinecap="round" opacity={bFade * 0.5}/>
            );
          })}

          {/* ── Capability words ── */}
          {CAPABILITY_WORDS.map((cw, i) => {
            const wEnter = interpolate(frame, [cw.delay, cw.delay + 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const wFade = interpolate(frame, [cw.delay + 12, cw.delay + 30], [1, 0.3], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={cw.x} y={cw.y} textAnchor="middle"
                fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
                fill={cw.color} opacity={wEnter * wFade * 0.35}
                letterSpacing="0.1em">
                {cw.text}
              </text>
            );
          })}

          {/* ── Progress bar ── */}
          <g opacity={progressEnter}>
            <rect x={160} y={1020} width={760} height={40} rx={20}
              fill="#FFFFFF" stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.6}/>
            {PROGRESS_SEGMENTS.map((ps, i) => {
              const segW = interpolate(mergeProgress, [i * 0.25, (i + 1) * 0.25], [0, 170], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <g key={i}>
                  <rect x={ps.x} y={1025} width={segW} height={30} rx={15}
                    fill={ps.color} opacity={0.7}/>
                  <text x={ps.x + 85} y={1046} textAnchor="middle"
                    fontFamily="'Courier New', monospace" fontSize={11} fontWeight={700}
                    fill="#FFFFFF" opacity={segW > 80 ? 1 : 0}>
                    {ps.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Bottom insight ── */}
          <g opacity={insightEnter}>
            <rect x={100} y={1100} width={880} height={110} rx={16}
              fill="#FFFFFF" stroke={COLORS.electric_cyan} strokeWidth={1.5}
              opacity={0.92} filter="url(#conceptGlowS18)"/>
            <rect x={100} y={1100} width={6} height={110} rx={3}
              fill={COLORS.electric_cyan}/>
            <text x={150} y={1148} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700}
              fill={COLORS.deep_black}>
              Each concept amplifies the loop's power.
            </text>
            <text x={150} y={1182} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
              fill={COLORS.light_gray}>
              Together, they create true agentic intelligence.
            </text>
          </g>

          {/* ── Footer ── */}
          <text x={540} y={1260} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.2}
            letterSpacing="0.05em">
            loop.enhance(memory, planning, tools, agents)
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="...exists to make this loop more capable."
          opacity={captionEnter}
          highlightWords={['loop', 'more capable']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
