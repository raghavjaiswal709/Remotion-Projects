/**
 * Scene 15 — Moves in a Circle
 * "The loop moves in a circle."
 * Beautiful circular loop animation, LoopArrow drawing around center.
 * Contrast with straight line (fading out) vs circle (glowing bright).
 * Duration: 45 frames (1.5s — short, visual impact)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Center of the canvas ───────────────────────────────────────────────────
const CX = 540;
const CY = 700;
const CIRCLE_R = 180;

// ── Concentric glow rings ──────────────────────────────────────────────────
const GLOW_RINGS = [
  { r: 140, width: 3, delay: 0 },
  { r: 180, width: 2.5, delay: 3 },
  { r: 220, width: 2, delay: 6 },
  { r: 260, width: 1.5, delay: 9 },
  { r: 300, width: 1, delay: 12 },
  { r: 340, width: 0.5, delay: 15 },
];

// ── Orbiting particles on the circle ───────────────────────────────────────
const ORBIT_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  baseAngle: (i / 20) * Math.PI * 2,
  r: 3 + (i % 3) * 1.5,
  speed: 0.06 + (i % 4) * 0.01,
  dist: CIRCLE_R + (Math.sin(i * 2.1) * 15),
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.vibrant_green][i % 4],
}));

// ── Straight line coordinates (fading away) ────────────────────────────────
const LINE_Y = 680;
const LINE_START_X = 180;
const LINE_END_X = 900;

// ── Straight-line reference dots (that fade) ───────────────────────────────
const LINE_DOTS = Array.from({ length: 10 }, (_, i) => ({
  x: LINE_START_X + (i / 9) * (LINE_END_X - LINE_START_X),
  y: LINE_Y,
  r: 3,
}));

// ── Radial burst lines when circle completes ───────────────────────────────
const BURST_RAYS = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  innerR: CIRCLE_R + 20,
  outerR: CIRCLE_R + 60 + (i % 3) * 20,
  width: 1.5 + (i % 2),
}));

// ── Background ambient particles ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: (i * 151.3 + 20) % 1080,
  y: (i * 197.7 + 35) % 1920,
  r: 1 + (i % 3) * 0.6,
  speed: 0.12 + (i % 5) * 0.05,
  phase: i * 0.48,
}));

// ── Circle segment colors (used by labels below) ─────────────────────────

// ── Step labels on the circle ──────────────────────────────────────────────
const CIRCLE_LABELS = [
  { text: 'P', angle: -90,  color: COLORS.vibrant_green },
  { text: 'T', angle: 0,    color: COLORS.warm_blue },
  { text: 'A', angle: 90,   color: COLORS.vibrant_red },
  { text: 'O', angle: 180,  color: COLORS.amber },
];

// ── Comparison: straight line vs circle (visual contrast shown above) ──────

// ── Decorative corner accents ──────────────────────────────────────────────
const CORNER_ACCENTS = [
  { x: 80,   y: 350, rot: 0 },
  { x: 1000, y: 350, rot: 90 },
  { x: 1000, y: 1050, rot: 180 },
  { x: 80,   y: 1050, rot: 270 },
];

export const Scene15_MovesInCircle: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [2, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [2, 14], [30, 0], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Straight line fading out
  const lineFade = interpolate(frame, [0, 20], [0.6, 0], { extrapolateRight: 'clamp' });
  const lineSlide = interpolate(frame, [0, 20], [0, 30], { extrapolateRight: 'clamp' });

  // Circle drawing in
  const circleDraw = interpolate(frame, [5, 35], [1130, 0], { extrapolateRight: 'clamp', easing: ease });
  const circleGlow = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const circleScale = interpolate(frame, [5, 25], [0.85, 1], { extrapolateRight: 'clamp', easing: ease });

  // Burst at completion
  const burstEnter = interpolate(frame, [30, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const burstFade = interpolate(frame, [35, 43], [1, 0], { extrapolateRight: 'clamp' });
  const burstOp = burstEnter * burstFade;

  // Labels on the circle
  const labelsEnter = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Spinning rotation for LoopArrow
  const spinAngle = interpolate(frame, [0, 45], [0, 360], { extrapolateRight: 'clamp' });

  // Glow pulse
  const glowPulse = 0.6 + Math.sin(frame * 0.25) * 0.4;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.2}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="circleGlowS15" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="blur"/>
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.55" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="lineGhostS15" x="-10%" y="-20%" width="120%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="centerGlowS15" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.3"/>
              <stop offset="60%" stopColor={COLORS.electric_cyan} stopOpacity="0.08"/>
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="circleGradS15" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.electric_cyan}/>
              <stop offset="33%" stopColor={COLORS.warm_blue}/>
              <stop offset="66%" stopColor={COLORS.purple}/>
              <stop offset="100%" stopColor={COLORS.electric_cyan}/>
            </linearGradient>
          </defs>

          {/* ── Background ambient particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 30) % 1920;
            return (
              <circle key={i}
                cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={COLORS.electric_cyan}
                opacity={enter * (0.035 + Math.sin(frame * 0.05 + p.phase) * 0.015)}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={300} height={52} rx={12}
              fill={COLORS.electric_cyan} opacity={0.9}/>
            <text x={210} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">THE CIRCLE</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={190} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.03em">
              Moves in a Circle
            </text>
            <text x={540} y={248} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={600}
              fill={COLORS.electric_cyan}>
              Not a straight line.
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={290} x2={880} y2={290}
            stroke={COLORS.electric_cyan} strokeWidth={1.5} opacity={titleEnter * 0.15}/>

          {/* ── STRAIGHT LINE (fading ghost) ── */}
          <g opacity={lineFade} transform={`translate(0, ${lineSlide})`}>
            {/* The line itself */}
            <line x1={LINE_START_X} y1={LINE_Y - 160}
              x2={LINE_END_X} y2={LINE_Y - 160}
              stroke={COLORS.cool_silver} strokeWidth={3}
              strokeLinecap="round" filter="url(#lineGhostS15)"/>
            {/* Arrowhead */}
            <polygon points={`${LINE_END_X},${LINE_Y - 160} ${LINE_END_X - 16},${LINE_Y - 170} ${LINE_END_X - 16},${LINE_Y - 150}`}
              fill={COLORS.cool_silver} opacity={0.6}/>
            {/* Line dots */}
            {LINE_DOTS.map((dot, i) => (
              <circle key={i} cx={dot.x} cy={LINE_Y - 160} r={dot.r}
                fill={COLORS.cool_silver} opacity={0.3}/>
            ))}
            {/* Label */}
            <text x={540} y={LINE_Y - 185} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
              fill={COLORS.cool_silver} letterSpacing="0.1em" opacity={0.5}>
              MODEL CALL — STRAIGHT LINE
            </text>
          </g>

          {/* ── Corner accents ── */}
          {CORNER_ACCENTS.map((ca, i) => (
            <g key={i} opacity={enter * 0.15}
              transform={`translate(${ca.x}, ${ca.y}) rotate(${ca.rot})`}>
              <line x1={0} y1={0} x2={30} y2={0}
                stroke={COLORS.electric_cyan} strokeWidth={2}/>
              <line x1={0} y1={0} x2={0} y2={30}
                stroke={COLORS.electric_cyan} strokeWidth={2}/>
            </g>
          ))}

          {/* ── Concentric glow rings ── */}
          {GLOW_RINGS.map((ring, i) => {
            const ringOp = interpolate(frame, [ring.delay, ring.delay + 15], [0, 0.12], { extrapolateRight: 'clamp' });
            return (
              <circle key={i}
                cx={CX} cy={CY} r={ring.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={ring.width}
                opacity={ringOp * circleGlow * glowPulse}/>
            );
          })}

          {/* ── Center glow ── */}
          <circle cx={CX} cy={CY} r={120}
            fill="url(#centerGlowS15)"
            opacity={circleGlow * 0.8}/>

          {/* ── Main circle (drawn progressively) ── */}
          <g transform={`translate(${CX}, ${CY}) scale(${circleScale}) translate(${-CX}, ${-CY})`}>
            <circle cx={CX} cy={CY} r={CIRCLE_R}
              fill="none" stroke="url(#circleGradS15)" strokeWidth={6}
              strokeDasharray={1130} strokeDashoffset={circleDraw}
              strokeLinecap="round"
              filter={circleGlow > 0.5 ? 'url(#circleGlowS15)' : undefined}
              opacity={enter}/>
          </g>

          {/* ── Inner dotted circle ── */}
          <circle cx={CX} cy={CY} r={CIRCLE_R - 20}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1}
            strokeDasharray="4 8"
            opacity={enter * 0.15}/>

          {/* ── Orbiting particles ── */}
          {ORBIT_PARTICLES.map((op) => {
            const currentAngle = op.baseAngle + frame * op.speed;
            const px = CX + Math.cos(currentAngle) * op.dist;
            const py = CY + Math.sin(currentAngle) * op.dist;
            return (
              <circle key={op.id}
                cx={px} cy={py} r={op.r}
                fill={op.color}
                opacity={circleGlow * op.r * 0.12}/>
            );
          })}

          {/* ── LoopArrow spinning ── */}
          <g transform={`translate(${CX}, ${CY}) rotate(${spinAngle}) translate(${-CX}, ${-CY})`}
            opacity={circleGlow * 0.5}>
            <LoopArrow cx={CX} cy={CY} r={CIRCLE_R - 40}
              color={COLORS.electric_cyan} strokeWidth={3}
              dashOffset={0} opacity={1}
              showArrow={true} label=""/>
          </g>

          {/* ── Step labels (P, T, A, O) ── */}
          {CIRCLE_LABELS.map((cl) => {
            const angleRad = (cl.angle * Math.PI) / 180;
            const lx = CX + Math.cos(angleRad) * (CIRCLE_R + 50);
            const ly = CY + Math.sin(angleRad) * (CIRCLE_R + 50);
            return (
              <g key={cl.text} opacity={labelsEnter}>
                <circle cx={lx} cy={ly} r={22}
                  fill="#FFFFFF" stroke={cl.color} strokeWidth={2.5}
                  filter="url(#shadow)"/>
                <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
                  fill={cl.color}>
                  {cl.text}
                </text>
              </g>
            );
          })}

          {/* ── Burst rays on completion ── */}
          {BURST_RAYS.map((ray, i) => {
            const ix = CX + Math.cos(ray.angle) * ray.innerR;
            const iy = CY + Math.sin(ray.angle) * ray.innerR;
            const ox = CX + Math.cos(ray.angle) * ray.outerR;
            const oy = CY + Math.sin(ray.angle) * ray.outerR;
            return (
              <line key={i}
                x1={ix} y1={iy} x2={ox} y2={oy}
                stroke={COLORS.electric_cyan} strokeWidth={ray.width}
                strokeLinecap="round"
                opacity={burstOp * 0.4}
                filter="url(#circleGlowS15)"/>
            );
          })}

          {/* ── Center core ── */}
          <circle cx={CX} cy={CY} r={24}
            fill={COLORS.deep_black} stroke={COLORS.electric_cyan}
            strokeWidth={3} opacity={enter * 0.9}/>
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="central"
            fontFamily="'Inter', sans-serif" fontSize={12} fontWeight={900}
            fill={COLORS.electric_cyan} letterSpacing="0.08em" opacity={enter}>
            LOOP
          </text>

          {/* ── Contrast label: "CIRCLE" ── */}
          <text x={540} y={CY + CIRCLE_R + 100} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800}
            fill={COLORS.electric_cyan}
            opacity={circleGlow * 0.7}
            letterSpacing="0.2em"
            filter="url(#circleGlowS15)">
            ● THE LOOP — A CIRCLE ●
          </text>

          {/* ── Bottom insight panel ── */}
          <g opacity={enter}>
            <rect x={100} y={1060} width={880} height={140} rx={16}
              fill="#FFFFFF" stroke={COLORS.electric_cyan} strokeWidth={1.5}
              opacity={0.92} filter="url(#shadow)"/>
            <rect x={100} y={1060} width={6} height={140} rx={3}
              fill={COLORS.electric_cyan}/>
            <text x={150} y={1115} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              The loop moves in a circle.
            </text>
            <text x={150} y={1158} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
              fill={COLORS.light_gray}>
              Continuous. Cyclical. Self-reinforcing.
            </text>
          </g>

          {/* ── Decorative footer line ── */}
          <line x1={300} y1={1240} x2={780} y2={1240}
            stroke={COLORS.electric_cyan} strokeWidth={1}
            opacity={enter * 0.12}/>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="The loop moves in a circle."
          opacity={captionEnter}
          highlightWords={['loop', 'circle']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
