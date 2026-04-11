/**
 * Scene 19 — The Loop Is Everything
 * "The loop is everything."
 * Dramatic, dark background, massive pulsing loop in center.
 * Typography: "THE LOOP IS EVERYTHING" in huge glowing text.
 * Duration: 42 frames (~1.4s) — short, impactful
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  BlackBackground, CaptionBar, GlobalDefs,
  LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Central loop ───────────────────────────────────────────────────────────
const CX = 540;
const CY = 820;
const LOOP_R = 260;

// ── Pulse rings that emanate from the loop ─────────────────────────────────
const PULSE_RINGS = Array.from({ length: 8 }, (_, i) => ({
  delay: i * 3,
  maxR: LOOP_R + 80 + i * 50,
  width: 3 - i * 0.3,
  color: COLORS.electric_cyan,
}));

// ── Radial light rays from center ──────────────────────────────────────────
const LIGHT_RAYS = Array.from({ length: 36 }, (_, i) => ({
  angle: (i / 36) * Math.PI * 2,
  length: 150 + (i % 5) * 40,
  width: 1.5 + (i % 3) * 0.5,
  delay: i * 0.7,
}));

// ── Floating glowing particles ─────────────────────────────────────────────
const GLOW_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  angle: (i / 50) * Math.PI * 2,
  r: 200 + (i % 8) * 50,
  size: 1.5 + (i % 4) * 0.8,
  speed: 0.02 + (i % 6) * 0.006,
  phase: i * 0.37,
  color: [COLORS.electric_cyan, COLORS.warm_blue, '#80F0FF'][i % 3],
}));

// ── Background star field ──────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: (i * 131.7 + 20) % 1080,
  y: (i * 197.3 + 30) % 1920,
  r: 0.5 + (i % 4) * 0.4,
  twinkle: i * 0.83,
}));

// ── Outer orbit dots ───────────────────────────────────────────────────────
const ORBIT_DOTS_OUTER = Array.from({ length: 20 }, (_, i) => ({
  angle: (i / 20) * Math.PI * 2,
  r: LOOP_R + 40,
  size: 2 + (i % 3),
}));

// ── Inner orbit dots ───────────────────────────────────────────────────────
const ORBIT_DOTS_INNER = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2,
  r: LOOP_R - 30,
  size: 1.5 + (i % 3) * 0.5,
}));

// ── Dramatic vertical lines ────────────────────────────────────────────────
const VERTICAL_LINES = Array.from({ length: 14 }, (_, i) => ({
  x: 77 * i,
  opacity: 0.02 + (i % 3) * 0.01,
}));

// ── Decorative arc segments ────────────────────────────────────────────────
const ARC_SEGMENTS = Array.from({ length: 6 }, (_, i) => {
  const startA = (i / 6) * Math.PI * 2;
  const endA = startA + Math.PI / 4;
  const r = LOOP_R + 100 + i * 20;
  return {
    d: `M ${CX + Math.cos(startA) * r} ${CY + Math.sin(startA) * r} A ${r} ${r} 0 0 1 ${CX + Math.cos(endA) * r} ${CY + Math.sin(endA) * r}`,
    width: 1 + (i % 2),
    delay: 5 + i * 2,
    color: i % 2 === 0 ? COLORS.electric_cyan : COLORS.warm_blue,
  };
});

// ── Typography layout ──────────────────────────────────────────────────────
const TITLE_Y = 380;
const LINE1 = 'THE LOOP';
const LINE2 = 'IS';
const LINE3 = 'EVERYTHING';

// ── Grid of tiny dots background ───────────────────────────────────────────
const MICRO_GRID = Array.from({ length: 100 }, (_, i) => ({
  x: (i % 10) * 120 + 10,
  y: Math.floor(i / 10) * 200 + 20,
  opacity: 0.015,
}));

// ── Corner accent shapes ──────────────────────────────────────────────────
const CORNER_ACCENTS = [
  { x: 40, y: 40, rot: 0 },
  { x: 1040, y: 40, rot: 90 },
  { x: 1040, y: 1880, rot: 180 },
  { x: 40, y: 1880, rot: 270 },
];

// ── Emphasis dots ring ─────────────────────────────────────────────────────
const EMPHASIS_RING = Array.from({ length: 32 }, (_, i) => ({
  angle: (i / 32) * Math.PI * 2,
  r: LOOP_R + 10,
  size: 2.5,
}));

export const Scene19_LoopIsEverything: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers (fast, dramatic entry) ─────────────────────────────
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [2, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleScale = interpolate(frame, [2, 14], [0.7, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopEnter = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const loopDash = interpolate(frame, [0, 42], [0, 400], { extrapolateRight: 'clamp' });
  const raysEnter = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp' });
  const intensity = interpolate(frame, [0, 42], [0.5, 1], { extrapolateRight: 'clamp' });
  const scanY = interpolate(frame, [0, 42], [0, 1920], { extrapolateRight: 'clamp' });
  const breathe = Math.sin(frame * 0.15) * 0.06;
  const loopScale = 1 + breathe;

  return (
    <AbsoluteFill>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="epicGlowS19" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.6" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="textGlowS19" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="starGlowS19" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="coreGlowS19" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.3"/>
              <stop offset="40%" stopColor={COLORS.electric_cyan} stopOpacity="0.1"/>
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="scanGradS19" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
              <stop offset="45%" stopColor={COLORS.electric_cyan} stopOpacity="0.05"/>
              <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="0.15"/>
              <stop offset="55%" stopColor={COLORS.electric_cyan} stopOpacity="0.05"/>
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* ── Micro grid ── */}
          {MICRO_GRID.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r={1}
              fill={COLORS.electric_cyan} opacity={enter * g.opacity}/>
          ))}

          {/* ── Star field ── */}
          {STARS.map((s, i) => {
            const twinkle = Math.sin(frame * 0.1 + s.twinkle) * 0.3 + 0.5;
            return (
              <circle key={i} cx={s.x} cy={s.y} r={s.r}
                fill={COLORS.soft_white}
                opacity={enter * twinkle * 0.08}
                filter="url(#starGlowS19)"/>
            );
          })}

          {/* ── Vertical lines ── */}
          {VERTICAL_LINES.map((vl, i) => (
            <line key={i} x1={vl.x} y1={0} x2={vl.x} y2={1920}
              stroke={COLORS.electric_cyan} strokeWidth={0.5}
              opacity={enter * vl.opacity}/>
          ))}

          {/* ── Scan line ── */}
          <rect x={0} y={scanY - 60} width={1080} height={120}
            fill="url(#scanGradS19)" opacity={enter * 0.6}/>

          {/* ── Corner accents ── */}
          {CORNER_ACCENTS.map((ca, i) => (
            <g key={i} transform={`translate(${ca.x}, ${ca.y}) rotate(${ca.rot})`}
              opacity={enter * 0.15}>
              <line x1={0} y1={0} x2={30} y2={0}
                stroke={COLORS.electric_cyan} strokeWidth={1.5}/>
              <line x1={0} y1={0} x2={0} y2={30}
                stroke={COLORS.electric_cyan} strokeWidth={1.5}/>
            </g>
          ))}

          {/* ─── TITLE: THE LOOP IS EVERYTHING ─── */}
          <g opacity={titleEnter}
            transform={`translate(${CX}, ${TITLE_Y}) scale(${titleScale})`}
            filter="url(#textGlowS19)">
            <text x={0} y={-30} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={72} fontWeight={900}
              fill={COLORS.electric_cyan} letterSpacing="0.08em"
              opacity={intensity}>
              {LINE1}
            </text>
            <text x={0} y={45} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={600}
              fill={COLORS.cool_silver} letterSpacing="0.2em"
              opacity={intensity * 0.7}>
              {LINE2}
            </text>
            <text x={0} y={130} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={78} fontWeight={900}
              fill={COLORS.soft_white} letterSpacing="0.06em"
              opacity={intensity}>
              {LINE3}
            </text>
          </g>

          {/* ── Light rays ── */}
          {LIGHT_RAYS.map((lr, i) => {
            const rayOp = raysEnter * (0.04 + Math.sin(frame * 0.06 + lr.delay) * 0.02);
            return (
              <line key={i}
                x1={CX + Math.cos(lr.angle) * LOOP_R}
                y1={CY + Math.sin(lr.angle) * LOOP_R}
                x2={CX + Math.cos(lr.angle) * (LOOP_R + lr.length)}
                y2={CY + Math.sin(lr.angle) * (LOOP_R + lr.length)}
                stroke={COLORS.electric_cyan} strokeWidth={lr.width}
                strokeLinecap="round" opacity={rayOp}/>
            );
          })}

          {/* ── Core glow ── */}
          <circle cx={CX} cy={CY} r={LOOP_R + 120}
            fill="url(#coreGlowS19)" opacity={loopEnter * (0.7 + breathe)}/>

          {/* ── Arc segments ── */}
          {ARC_SEGMENTS.map((arc, i) => {
            const aEnter = interpolate(frame, [arc.delay, arc.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <path key={i} d={arc.d} fill="none"
                stroke={arc.color} strokeWidth={arc.width}
                strokeLinecap="round"
                opacity={aEnter * 0.08}/>
            );
          })}

          {/* ── Pulse rings ── */}
          {PULSE_RINGS.map((pr, i) => {
            const rP = interpolate(frame, [pr.delay, pr.delay + 25], [0, 1], { extrapolateRight: 'clamp' });
            const rSize = interpolate(rP, [0, 1], [LOOP_R, pr.maxR]);
            const rOp = (1 - rP) * 0.15;
            return (
              <circle key={i} cx={CX} cy={CY} r={rSize}
                fill="none" stroke={pr.color} strokeWidth={pr.width}
                opacity={rOp}/>
            );
          })}

          {/* ── THE LOOP (massive, glowing) ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${loopScale})`}
            filter="url(#epicGlowS19)">
            <LoopArrow cx={0} cy={0} r={LOOP_R}
              color={COLORS.electric_cyan} strokeWidth={6}
              dashOffset={loopDash}
              opacity={loopEnter * intensity}
              showArrow/>
          </g>

          {/* ── Emphasis dots on loop ── */}
          {EMPHASIS_RING.map((ed, i) => {
            const a = ed.angle + frame * 0.03;
            return (
              <circle key={i}
                cx={CX + Math.cos(a) * ed.r * loopScale}
                cy={CY + Math.sin(a) * ed.r * loopScale}
                r={ed.size}
                fill={COLORS.electric_cyan}
                opacity={loopEnter * (0.15 + Math.sin(frame * 0.12 + i) * 0.08)}/>
            );
          })}

          {/* ── Outer orbit dots ── */}
          {ORBIT_DOTS_OUTER.map((od, i) => {
            const a = od.angle + frame * 0.02;
            return (
              <circle key={i}
                cx={CX + Math.cos(a) * od.r}
                cy={CY + Math.sin(a) * od.r}
                r={od.size}
                fill={COLORS.electric_cyan}
                opacity={loopEnter * 0.1}/>
            );
          })}

          {/* ── Inner orbit dots ── */}
          {ORBIT_DOTS_INNER.map((od, i) => {
            const a = od.angle - frame * 0.015;
            return (
              <circle key={i}
                cx={CX + Math.cos(a) * od.r}
                cy={CY + Math.sin(a) * od.r}
                r={od.size}
                fill={COLORS.warm_blue}
                opacity={loopEnter * 0.08}/>
            );
          })}

          {/* ── Glow particles ── */}
          {GLOW_PARTICLES.map((gp, i) => {
            const a = gp.angle + frame * gp.speed;
            const px = CX + Math.cos(a) * gp.r;
            const py = CY + Math.sin(a) * gp.r;
            const gOp = Math.sin(frame * 0.08 + gp.phase) * 0.06 + 0.04;
            return (
              <circle key={i} cx={px} cy={py} r={gp.size}
                fill={gp.color} opacity={loopEnter * gOp}
                filter="url(#starGlowS19)"/>
            );
          })}

          {/* ── Bottom statement ── */}
          <g opacity={enter * intensity}>
            <text x={CX} y={1200} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={18} fontWeight={700}
              fill={COLORS.electric_cyan} letterSpacing="0.15em"
              opacity={0.4}>
              while(true) {'{'} perceive → think → act → observe {'}'}
            </text>
          </g>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="The loop is everything."
          opacity={captionEnter}
          highlightWords={['loop', 'everything']}/>
      </BlackBackground>
    </AbsoluteFill>
  );
};
