/**
 * Scene14_LoopNotLine.tsx — Day 26: Observations
 *
 * "This is what makes the loop a loop rather than a straight line."
 *
 * Split screen: Left shows a straight line with arrow (crossed out in red).
 * Right shows a circular loop (highlighted in cyan). Morphing animation from
 * line to loop. "NOT A LINE" → "A LOOP" text transition. Particles
 * reorganizing from linear to circular pattern.
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

/* ── Linear particles (morph to circular) ─────────────────────────────── */
const morphParticles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  // linear positions
  lx: 540,
  ly: 500 + (i / 30) * 900,
  // circular positions (around center)
  angle: (i / 30) * Math.PI * 2,
  cr: 200,
  size: 2 + (i % 4) * 1,
  phase: (i * 1.8) % (Math.PI * 2),
}));

/* ── Background grid dots ─────────────────────────────────────────────── */
const gridDots = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 127) % 1080,
  y: (i * 199) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: (i * 2.4) % (Math.PI * 2),
}));

/* ── Circuit segments ─────────────────────────────────────────────────── */
const circuits = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 40 + (i * 103) % 1000,
  y: 80 + (i * 157) % 1760,
  len: 20 + (i % 5) * 12,
  horiz: i % 2 === 0,
}));

/* ── Cross-out line fragments ─────────────────────────────────────────── */
const crossFragments = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 200 + (i % 4) * 40,
  y: 700 + Math.floor(i / 4) * 500,
  angle: (i * 45) % 360,
  len: 15 + (i % 3) * 10,
}));

export const Scene14_LoopNotLine: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const linePhase = interpolate(frame, [5, 30], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const crossOutProg = interpolate(frame, [28, 42], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const morphProg = interpolate(frame, [40, 65], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const loopGlow = interpolate(frame, [55, 70], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const labelSwap = interpolate(frame, [42, 55], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const loopPulse = interpolate(
    frame % 40, [0, 20, 40], [0.8, 1, 0.8],
    { extrapolateRight: 'clamp' }
  );

  const subtitleOpacity = interpolate(frame, [65, 78], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    easing: ease, extrapolateRight: 'clamp',
  });

  const circuitOpacity = interpolate(frame, [3, 15], [0, 0.15], {
    easing: ease, extrapolateRight: 'clamp',
  });

  /* ── Positioning ────────────────────────────────────────────────────── */
  const leftCX = 270;  // left half center
  const rightCX = 810; // right half center
  const midY = 960;

  /* Line arrow: vertical line in left half */
  const lineTop = midY - 300;
  const lineBot = midY + 300;

  /* Loop in right half */
  const loopR = 180;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.4" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="loopGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.cool_silver} />
            <stop offset="100%" stopColor={COLORS.light_gray} />
          </linearGradient>
        </defs>

        {/* ── Background ───────────────────────────────────────────── */}
        <rect width="1080" height="1920" fill={COLORS.bg_black} />

        {/* ── Grid dots ────────────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          {gridDots.map((d) => (
            <circle key={d.id} cx={d.x} cy={d.y} r={d.r}
              fill={COLORS.cool_silver}
              opacity={0.2 + Math.sin(frame * 0.03 + d.phase) * 0.1} />
          ))}
        </g>

        {/* ── Circuit segments ─────────────────────────────────────── */}
        <g opacity={circuitOpacity}>
          {circuits.map((c) => (
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
          <text x={540} y={280} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="44" fontFamily="monospace"
            fontWeight="bold" letterSpacing="2" filter="url(#cyanGlow)">
            LOOP vs LINE
          </text>
          <line x1={280} y1={310} x2={800} y2={310}
            stroke={COLORS.electric_cyan} strokeWidth="1.5" opacity={0.35} />
        </g>

        {/* ── Divider line ─────────────────────────────────────────── */}
        <line x1={540} y1={400} x2={540} y2={1500}
          stroke={COLORS.cool_silver} strokeWidth="1"
          strokeDasharray="8,6" opacity={fadeIn * 0.25} />

        {/* ── LEFT SIDE: Straight line ─────────────────────────────── */}
        <g opacity={linePhase}>
          {/* Label */}
          <text x={leftCX} y={500} textAnchor="middle"
            fill={COLORS.cool_silver} fontSize="50" fontFamily="monospace"
            fontWeight="bold" letterSpacing="3" opacity={1 - labelSwap}>
            A LINE
          </text>

          {/* The straight arrow */}
          <line
            x1={leftCX} y1={lineTop + 120}
            x2={leftCX} y2={lineTop + 120 + (lineBot - lineTop - 120) * linePhase}
            stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round"
          />
          {/* Arrow head */}
          <polygon
            points={`${leftCX},${lineBot} ${leftCX - 12},${lineBot - 20} ${leftCX + 12},${lineBot - 20}`}
            fill={COLORS.cool_silver} opacity={linePhase}
          />

          {/* Step labels on line */}
          {['START', 'STEP 1', 'STEP 2', 'END'].map((lbl, i) => {
            const yPos = lineTop + 120 + i * 140;
            return (
              <g key={`lbl-${i}`} opacity={linePhase}>
                <circle cx={leftCX} cy={yPos} r={8}
                  fill={COLORS.cool_silver} opacity={0.5} />
                <text x={leftCX + 25} y={yPos + 5} textAnchor="start"
                  fill={COLORS.light_gray} fontSize="42" fontFamily="monospace">
                  {lbl}
                </text>
              </g>
            );
          })}

          {/* Cross out in red */}
          <g opacity={crossOutProg}>
            <line
              x1={leftCX - 120} y1={lineTop + 50}
              x2={leftCX + 120} y2={lineBot + 50}
              stroke={COLORS.vibrant_red} strokeWidth="12" strokeLinecap="round"
              filter="url(#softGlow)"
            />
            <line
              x1={leftCX + 120} y1={lineTop + 50}
              x2={leftCX - 120} y2={lineBot + 50}
              stroke={COLORS.vibrant_red} strokeWidth="12" strokeLinecap="round"
              filter="url(#softGlow)"
            />
          </g>

          {/* "NOT A LINE" label */}
          <g opacity={crossOutProg}>
            <text x={leftCX} y={lineBot + 120} textAnchor="middle"
              fill={COLORS.vibrant_red} fontSize="56" fontFamily="monospace"
              fontWeight="bold" letterSpacing="3">
              NOT A LINE
            </text>
          </g>
        </g>

        {/* ── RIGHT SIDE: Circular loop ────────────────────────────── */}
        <g opacity={morphProg}>
          {/* Label */}
          <text x={rightCX} y={500} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="50" fontFamily="monospace"
            fontWeight="bold" letterSpacing="3">
            A LOOP
          </text>

          {/* The circular ring */}
          <circle
            cx={rightCX} cy={midY} r={loopR}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth="4"
            strokeDasharray={2 * Math.PI * loopR}
            strokeDashoffset={2 * Math.PI * loopR * (1 - morphProg)}
            filter={loopGlow > 0.5 ? 'url(#loopGlowFilter)' : undefined}
            opacity={0.8 * loopPulse}
          />

          {/* Animated rotating dash */}
          <circle
            cx={rightCX} cy={midY} r={loopR}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth="2"
            strokeDasharray="15 25"
            strokeDashoffset={-frame * 2}
            opacity={morphProg * 0.4}
          />

          {/* Step nodes on loop */}
          {[
            { label: 'PERCEIVE', color: COLORS.vibrant_green, a: -Math.PI / 2 },
            { label: 'THINK', color: COLORS.warm_blue, a: 0 },
            { label: 'ACT', color: COLORS.amber, a: Math.PI / 2 },
            { label: 'OBSERVE', color: COLORS.purple, a: Math.PI },
          ].map((n, i) => {
            const nx = rightCX + Math.cos(n.a) * loopR;
            const ny = midY + Math.sin(n.a) * loopR;
            const nScale = scaleAnim(frame, 45 + i * 5, 10, 0, 1);
            return (
              <g key={`node-${i}`} transform={`translate(${nx}, ${ny}) scale(${nScale})`}>
                <circle cx={0} cy={0} r={55}
                  fill={COLORS.bg_black} stroke={n.color} strokeWidth="3.5" />
                <circle cx={0} cy={0} r={45} fill={n.color} opacity={0.15} />
                <text x={0} y={10} textAnchor="middle"
                  fill={n.color} fontSize="32" fontFamily="monospace" fontWeight="bold">
                  {n.label.slice(0, 3)}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <g opacity={loopGlow}>
            <text x={rightCX} y={midY + 12} textAnchor="middle"
              fill={COLORS.electric_cyan} fontSize="52" fontFamily="monospace"
              fontWeight="bold" letterSpacing="2">
              LOOP
            </text>
          </g>

          {/* "A LOOP" big label */}
          <text x={rightCX} y={midY + loopR + 80} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="56" fontFamily="monospace"
            fontWeight="bold" letterSpacing="3" filter="url(#cyanGlow)">
            A LOOP
          </text>
        </g>

        {/* ── Morphing particles ───────────────────────────────────── */}
        <g opacity={fadeIn * 0.6}>
          {morphParticles.map((p) => {
            const circX = rightCX + Math.cos(p.angle + frame * 0.02) * p.cr;
            const circY = midY + Math.sin(p.angle + frame * 0.02) * p.cr;
            const px = p.lx + (circX - p.lx) * morphProg;
            const py = p.ly + (circY - p.ly) * morphProg;
            const col = morphProg > 0.5 ? COLORS.electric_cyan : COLORS.cool_silver;
            return (
              <circle key={p.id} cx={px} cy={py} r={p.size}
                fill={col}
                opacity={0.4 + Math.sin(frame * 0.04 + p.phase) * 0.2} />
            );
          })}
        </g>

        {/* ── Cross-out fragments scatter ──────────────────────────── */}
        <g opacity={crossOutProg * 0.3}>
          {crossFragments.map((f) => {
            const rad = (f.angle * Math.PI) / 180;
            return (
              <line key={f.id}
                x1={f.x} y1={f.y}
                x2={f.x + Math.cos(rad) * f.len}
                y2={f.y + Math.sin(rad) * f.len}
                stroke={COLORS.vibrant_red} strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ── Bottom subtitle ──────────────────────────────────────── */}
        <g opacity={subtitleOpacity}>
          <rect x={60} y={1540} width={960} height={180} rx="24"
            fill={COLORS.deep_black} fillOpacity="0.85"
            stroke={COLORS.electric_cyan} strokeWidth="3" />
          <text x={540} y={1610} textAnchor="middle"
            fill={COLORS.soft_white} fontSize="58" fontWeight="bold">
            Loop rather than
          </text>
          <text x={540} y={1690} textAnchor="middle"
            fill={COLORS.electric_cyan} fontSize="62" fontWeight="900">
            a straight line.
          </text>
        </g>

        {/* ── Scan lines ───────────────────────────────────────────── */}
        <g opacity={0.03}>
          {Array.from({ length: 48 }, (_, i) => (
            <line key={`sl-${i}`} x1={0} y1={i * 40} x2={1080} y2={i * 40}
              stroke={COLORS.electric_cyan} strokeWidth="1" />
          ))}
        </g>

        {/* ── Corner accents ───────────────────────────────────────── */}
        <g opacity={fadeIn * 0.3}>
          <path d="M 0 180 L 0 0 L 180 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 180 L 1080 0 L 900 0" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 0 1740 L 0 1920 L 180 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <path d="M 1080 1740 L 1080 1920 L 900 1920" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
