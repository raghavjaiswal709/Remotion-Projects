/**
 * Scene05_ReturnToAgent.tsx — Day 26: Observations
 *
 * "Returned to the agent as new input for the next loop iteration."
 *
 * Agent robot icon on left, loop arrow curving from observation back to
 * agent. Data packets flowing along the arrow path. "NEW INPUT" label
 * appearing. Circuit board decorations. Animated dashed path.
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

/* ── Circuit board traces ────────────────────────────────────────────── */
const circuits = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x1: (i % 7) * 160 + 40,
  y1: Math.floor(i / 7) * 480 + 120,
  x2: (i % 7) * 160 + 40 + (i % 2 === 0 ? 100 : -70),
  y2: Math.floor(i / 7) * 480 + 120 + (i % 3 === 0 ? 120 : 50),
  delay: i * 2,
}));

/* ── Data packets ────────────────────────────────────────────────────── */
const dataPackets = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  offset: i * 0.12,
  size: 12 + (i % 3) * 4,
  color: i % 2 === 0 ? COLORS.electric_cyan : COLORS.warm_blue,
}));

/* ── Particles ───────────────────────────────────────────────────────── */
const particles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: ((i * 167.3) % 1080),
  y: ((i * 213.7) % 1920),
  r: 1 + (i % 4) * 0.5,
  phase: (i * 0.9) % (Math.PI * 2),
}));

export const Scene05_ReturnToAgent: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const agentAppear = interpolate(frame, [5, 25], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const agentScale = interpolate(frame, [5, 25], [0.7, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const loopPathDraw = interpolate(frame, [20, 55], [800, 0], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const newInputOpacity = interpolate(frame, [50, 65], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const newInputScale = interpolate(frame, [50, 65], [0.8, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const circuitOpacity = interpolate(frame, [0, 20], [0, 0.15], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const dashOffset = frame * 2;

  const glowPulse = interpolate(
    frame,
    [30, 60, 108],
    [4, 10, 7],
    { extrapolateRight: 'clamp' },
  );

  const observationBoxOpacity = interpolate(frame, [10, 25], [0, 0.8], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [15, 35], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const packetPhase = frame * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_paper }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={COLORS.electric_cyan} />
            <stop offset="50%" stopColor={COLORS.warm_blue} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
        </defs>

        {/* ── Paper grain ─────────────────────────────────────────── */}
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={`pgr-${i}`}
            cx={((i * 143.7) % 1020) + 30}
            cy={((i * 197.3) % 1860) + 30}
            r={0.5 + (i % 3) * 0.3}
            fill={COLORS.deep_black}
            opacity={fadeIn * 0.04}
          />
        ))}

        {/* ── Circuit board traces ────────────────────────────────── */}
        {circuits.map((c) => {
          const cOp = interpolate(
            frame,
            [c.delay, c.delay + 12],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <g key={`cir-${c.id}`} opacity={circuitOpacity * cOp}>
              <line
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                stroke={COLORS.electric_cyan}
                strokeWidth="0.8"
                strokeDasharray="4,3"
              />
              <circle cx={c.x1} cy={c.y1} r="2.5" fill={COLORS.electric_cyan} opacity="0.4" />
            </g>
          );
        })}

        {/* ── Agent robot icon (left) ─────────────────────────────── */}
        <g
          opacity={agentAppear}
          transform={`translate(260, 700) scale(${agentScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Robot head */}
          <rect x="-70" y="-90" width="140" height="110" rx="18" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" />
          <rect x="-60" y="-80" width="120" height="90" rx="14" fill={COLORS.deep_black} opacity="0.05" />

          {/* Eyes */}
          <circle cx="-25" cy="-45" r="14" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="-25" cy="-45" r="5" fill={COLORS.electric_cyan} />
          <circle cx="25" cy="-45" r="14" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" />
          <circle cx="25" cy="-45" r="5" fill={COLORS.electric_cyan} />

          {/* Mouth */}
          <line x1="-20" y1="-10" x2="20" y2="-10" stroke={COLORS.deep_black} strokeWidth="2" strokeLinecap="round" />

          {/* Antenna */}
          <line x1="0" y1="-90" x2="0" y2="-120" stroke={COLORS.deep_black} strokeWidth="2" />
          <circle cx="0" cy="-125" r="6" fill={COLORS.electric_cyan} filter="url(#cyanGlow)" />

          {/* Body */}
          <rect x="-55" y="25" width="110" height="80" rx="12" fill="none" stroke={COLORS.deep_black} strokeWidth="2" />
          <rect x="-45" y="35" width="90" height="60" rx="8" fill={COLORS.deep_black} opacity="0.04" />

          {/* Arms */}
          <line x1="-55" y1="50" x2="-85" y2="70" stroke={COLORS.deep_black} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="55" y1="50" x2="85" y2="70" stroke={COLORS.deep_black} strokeWidth="2.5" strokeLinecap="round" />

          {/* Agent label */}
          <text x="0" y="140" textAnchor="middle" fontFamily="monospace" fontSize="44" fontWeight="700" fill={COLORS.deep_black} letterSpacing="3">
            AGENT
          </text>
        </g>

        {/* ── Observation box (right) ─────────────────────────────── */}
        <g opacity={observationBoxOpacity}>
          <rect
            x="620"
            y="620"
            width="340"
            height="100"
            rx="12"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="2"
          />
          <text
            x="790"
            y="680"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="50"
            fontWeight="700"
            fill={COLORS.electric_cyan}
            letterSpacing="2"
          >
            OBSERVATION
          </text>
        </g>

        {/* ── Loop arrow path (observation → agent) ───────────────── */}
        <path
          d="M 790 720 C 790 950, 700 1050, 540 1050 C 380 1050, 260 950, 260 840"
          fill="none"
          stroke="url(#loopGrad)"
          strokeWidth="3"
          strokeDasharray="800"
          strokeDashoffset={loopPathDraw}
          strokeLinecap="round"
        />
        {/* Dashed animated overlay */}
        <path
          d="M 790 720 C 790 950, 700 1050, 540 1050 C 380 1050, 260 950, 260 840"
          fill="none"
          stroke={COLORS.electric_cyan}
          strokeWidth="1.5"
          strokeDasharray="12,8"
          strokeDashoffset={-dashOffset}
          opacity={observationBoxOpacity * 0.5}
        />

        {/* Arrow head at agent */}
        <polygon
          points="248,855 260,830 272,855"
          fill={COLORS.electric_cyan}
          opacity={interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />

        {/* ── Data packets flowing along path ─────────────────────── */}
        {dataPackets.map((dp) => {
          const t = ((packetPhase + dp.offset) % 1);
          /* Approximate position along cubic bezier */
          const mt = 1 - t;
          const px = mt * mt * mt * 790 + 3 * mt * mt * t * 700 + 3 * mt * t * t * 380 + t * t * t * 260;
          const py = mt * mt * mt * 720 + 3 * mt * mt * t * 1050 + 3 * mt * t * t * 1050 + t * t * t * 840;
          const pOp = interpolate(
            frame,
            [30, 40],
            [0, 0.7],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <rect
              key={`dp-${dp.id}`}
              x={px - dp.size / 2}
              y={py - dp.size / 2}
              width={dp.size}
              height={dp.size * 0.6}
              rx="3"
              fill={dp.color}
              opacity={pOp}
              transform={`rotate(${t * 360}, ${px}, ${py})`}
            />
          );
        })}

        {/* ── "NEW INPUT" label ────────────────────────────────────── */}
        <g
          opacity={newInputOpacity}
          transform={`translate(260, 880) scale(${newInputScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <rect x="-80" y="-20" width="160" height="40" rx="8" fill={COLORS.vibrant_green} opacity="0.15" />
          <rect x="-80" y="-20" width="160" height="40" rx="8" fill="none" stroke={COLORS.vibrant_green} strokeWidth="1.5" />
          <text
            x="0"
            y="8"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="38"
            fontWeight="700"
            fill={COLORS.vibrant_green}
            letterSpacing="2"
          >
            NEW INPUT
          </text>
        </g>

        {/* ── "NEXT LOOP" label ───────────────────────────────────── */}
        <text
          x="540"
          y="1100"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="42"
          fontWeight="400"
          fill={COLORS.cool_silver}
          opacity={newInputOpacity * 0.6}
          letterSpacing="4"
        >
          NEXT LOOP ITERATION
        </text>

        {/* ── Particles ───────────────────────────────────────────── */}
        {particles.map((p) => {
          const px = p.x + Math.sin(frame * 0.025 + p.phase) * 10;
          const py = p.y + Math.cos(frame * 0.02 + p.phase) * 8;
          return (
            <circle
              key={`pt-${p.id}`}
              cx={px}
              cy={py}
              r={p.r}
              fill={p.id % 3 === 0 ? COLORS.electric_cyan : COLORS.deep_black}
              opacity={fadeIn * 0.08}
            />
          );
        })}

        {/* ── Caption text ────────────────────────────────────────── */}
        <text
          x="540"
          y="1340"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="58"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={captionOpacity}
        >
          Returned to the agent
        </text>
        <text
          x="540"
          y="1420"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="58"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={captionOpacity}
        >
          as{' '}
          <tspan fill={COLORS.vibrant_green} fontWeight="800">new input</tspan>
        </text>
        <text
          x="540"
          y="1500"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="58"
          fontWeight="600"
          fill={COLORS.deep_black}
          opacity={captionOpacity}
        >
          for the next loop iteration.
        </text>

        {/* ── Decorative separator ────────────────────────────────── */}
        <line
          x1="300"
          y1="1500"
          x2="780"
          y2="1500"
          stroke={COLORS.deep_black}
          strokeWidth="1"
          opacity={captionOpacity * 0.15}
        />

        {/* ── Loop icon at bottom ─────────────────────────────────── */}
        <g opacity={newInputOpacity * 0.4}>
          <circle cx="540" cy="1600" r="35" fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" strokeDasharray="8,4" strokeDashoffset={-dashOffset * 0.5} />
          <polygon points="560,1570 575,1590 555,1590" fill={COLORS.electric_cyan} />
        </g>

        {/* ── Notebook margin ─────────────────────────────────────── */}
        <line
          x1="120"
          y1="50"
          x2="120"
          y2="1870"
          stroke={COLORS.vibrant_red}
          strokeWidth="1"
          opacity={fadeIn * 0.12}
        />

        {/* ── Notebook holes ──────────────────────────────────────── */}
        {[300, 700, 1100, 1500].map((y, i) => (
          <circle
            key={`nh-${i}`}
            cx="65"
            cy={y}
            r="12"
            fill={COLORS.bg_paper}
            stroke={COLORS.deep_black}
            strokeWidth="1"
            opacity={fadeIn * 0.12}
          />
        ))}

        {/* ── Border ──────────────────────────────────────────────── */}
        <rect
          x="50"
          y="50"
          width="980"
          height="1820"
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth="1"
          opacity={fadeIn * 0.08}
        />
      </svg>
    </AbsoluteFill>
  );
};
