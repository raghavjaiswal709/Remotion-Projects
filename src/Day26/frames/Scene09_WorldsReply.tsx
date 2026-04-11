/**
 * Scene09_WorldsReply.tsx — Day 26: Observations
 *
 * "The observation is the world's reply to the agent's action."
 *
 * Big world globe on one side, agent on the other. Speech bubble from
 * world labeled "REPLY". Arrow from agent to world (action) and arrow
 * back (observation). Dramatic reveal. Orbit ring around globe.
 * Stars/space particles.
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
import { COLORS } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* ── Stars ────────────────────────────────────────────────────────────── */
const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: ((i * 139.7) % 1080),
  y: ((i * 197.3) % 1920),
  r: 0.5 + (i % 5) * 0.5,
  twinklePhase: (i * 1.3) % (Math.PI * 2),
  twinkleSpeed: 0.03 + (i % 4) * 0.01,
}));

/* ── Orbit particles ─────────────────────────────────────────────────── */
const orbitParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  angle: (i / 20) * Math.PI * 2,
  radiusOffset: (i % 3) * 8,
  r: 2 + (i % 3) * 1,
}));

/* ── Globe continent shapes (simplified) ─────────────────────────────── */
const continentPaths = [
  'M -30 -60 C -10 -70, 20 -55, 30 -40 C 35 -25, 20 -10, 5 -5 C -10 0, -35 -20, -40 -40 C -42 -50, -38 -58, -30 -60 Z',
  'M 15 10 C 30 5, 45 15, 50 30 C 52 40, 40 55, 25 50 C 10 45, 5 30, 15 10 Z',
  'M -50 15 C -40 8, -25 12, -20 25 C -18 35, -30 45, -45 38 C -55 32, -55 22, -50 15 Z',
];

export const Scene09_WorldsReply: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const globeScale = interpolate(frame, [5, 30], [0.4, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const globeOpacity = interpolate(frame, [5, 22], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const agentOpacity = interpolate(frame, [12, 28], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const actionArrow = interpolate(frame, [25, 50], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationArrow = interpolate(frame, [50, 75], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const speechBubbleOpacity = interpolate(frame, [60, 78], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const speechBubbleScale = interpolate(frame, [60, 78], [0.7, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const dramaticReveal = interpolate(frame, [75, 95], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const orbitAngle = frame * 0.03;

  const captionOpacity = interpolate(frame, [10, 30], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(
    frame,
    [60, 80, 103],
    [4, 14, 8],
    { extrapolateRight: 'clamp' },
  );

  const globeRotation = frame * 0.4;

  const titleOpacity = interpolate(frame, [80, 95], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="globeGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.3" />
            <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="0.15" />
            <stop offset="100%" stopColor={COLORS.deep_black} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="globeSurface" cx="35%" cy="30%" r="55%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.5" />
            <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0.15" />
          </radialGradient>
          <linearGradient id="actionArrowGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.amber} />
            <stop offset="100%" stopColor={COLORS.vibrant_red} />
          </linearGradient>
          <linearGradient id="obsArrowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.electric_cyan} />
            <stop offset="100%" stopColor={COLORS.vibrant_green} />
          </linearGradient>
          <clipPath id="globeClip">
            <circle cx="540" cy="580" r="170" />
          </clipPath>
        </defs>

        {/* ── Stars background ────────────────────────────────────── */}
        {stars.map((s) => {
          const twinkle = 0.3 + Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.3;
          return (
            <circle
              key={`star-${s.id}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={s.id % 7 === 0 ? COLORS.electric_cyan : COLORS.soft_white}
              opacity={fadeIn * twinkle}
            />
          );
        })}

        {/* ── Background radial glow ──────────────────────────────── */}
        <circle cx="540" cy="580" r="400" fill="url(#globeGrad)" opacity={globeOpacity * 0.5} />

        {/* ── World globe ─────────────────────────────────────────── */}
        <g
          opacity={globeOpacity}
          transform={`translate(540, 580) scale(${globeScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          {/* Globe sphere */}
          <circle cx="0" cy="0" r="170" fill="url(#globeSurface)" stroke={COLORS.electric_cyan} strokeWidth="2.5" />

          {/* Globe latitude lines */}
          {[-100, -50, 0, 50, 100].map((y, i) => {
            const latR = Math.sqrt(170 * 170 - y * y);
            return (
              <ellipse
                key={`lat-${i}`}
                cx="0"
                cy={y}
                rx={latR}
                ry={latR * 0.15}
                fill="none"
                stroke={COLORS.electric_cyan}
                strokeWidth="0.6"
                opacity="0.25"
              />
            );
          })}

          {/* Globe longitude lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI + globeRotation * 0.01;
            return (
              <ellipse
                key={`lon-${i}`}
                cx="0"
                cy="0"
                rx={170 * Math.abs(Math.cos(angle))}
                ry="170"
                fill="none"
                stroke={COLORS.electric_cyan}
                strokeWidth="0.6"
                opacity="0.2"
                transform={`rotate(${(angle * 180) / Math.PI}, 0, 0)`}
              />
            );
          })}

          {/* Continents (clipped to globe) */}
          <g clipPath="url(#globeClip)" transform={`translate(540, 580)`}>
            {continentPaths.map((path, i) => {
              const shift = globeRotation * 0.5;
              return (
                <path
                  key={`cont-${i}`}
                  d={path}
                  fill={COLORS.vibrant_green}
                  opacity="0.2"
                  transform={`translate(${Math.sin(shift + i) * 20 - 540}, ${-580})`}
                />
              );
            })}
          </g>

          {/* Globe highlight */}
          <circle cx="-50" cy="-60" r="40" fill={COLORS.soft_white} opacity="0.06" />

          {/* WORLD label */}
          <text
            x="0"
            y="210"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="50"
            fontWeight="700"
            fill={COLORS.electric_cyan}
            letterSpacing="6"
          >
            WORLD
          </text>
        </g>

        {/* ── Orbit ring ──────────────────────────────────────────── */}
        <ellipse
          cx="540"
          cy="580"
          rx={210 * globeScale}
          ry={60 * globeScale}
          fill="none"
          stroke={COLORS.electric_cyan}
          strokeWidth="1.5"
          strokeDasharray="10,6"
          strokeDashoffset={-frame * 1.5}
          opacity={globeOpacity * 0.4}
        />

        {/* ── Orbit particles ─────────────────────────────────────── */}
        {orbitParticles.map((op) => {
          const oa = orbitAngle + op.angle;
          const ox = 540 + Math.cos(oa) * (210 + op.radiusOffset) * globeScale;
          const oy = 580 + Math.sin(oa) * (60 + op.radiusOffset) * globeScale;
          return (
            <circle
              key={`op-${op.id}`}
              cx={ox}
              cy={oy}
              r={op.r}
              fill={COLORS.electric_cyan}
              opacity={globeOpacity * 0.4}
            />
          );
        })}

        {/* ── Agent icon (bottom) ─────────────────────────────────── */}
        <g opacity={agentOpacity} transform="translate(540, 1250)">
          <rect x="-55" y="-70" width="110" height="85" rx="15" fill="none" stroke={COLORS.soft_white} strokeWidth="2.5" />
          <circle cx="-18" cy="-38" r="10" fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <circle cx="-18" cy="-38" r="4" fill={COLORS.electric_cyan} />
          <circle cx="18" cy="-38" r="10" fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <circle cx="18" cy="-38" r="4" fill={COLORS.electric_cyan} />
          <line x1="-12" y1="-8" x2="12" y2="-8" stroke={COLORS.soft_white} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="-45" y="22" width="90" height="55" rx="10" fill="none" stroke={COLORS.soft_white} strokeWidth="2" />
          <line x1="0" y1="-70" x2="0" y2="-95" stroke={COLORS.soft_white} strokeWidth="2" />
          <circle cx="0" cy="-100" r="5" fill={COLORS.electric_cyan} filter="url(#softGlow)" />
          <text x="0" y="105" textAnchor="middle" fontFamily="monospace" fontSize="42" fontWeight="700" fill={COLORS.soft_white} letterSpacing="3">AGENT</text>
        </g>

        {/* ── Action arrow (agent → world) left side ──────────────── */}
        <g opacity={actionArrow}>
          <path
            d="M 460 1180 C 380 1050, 350 900, 400 770"
            fill="none"
            stroke="url(#actionArrowGrad)"
            strokeWidth="3"
            strokeDasharray="8,5"
          />
          <polygon
            points="390,782 400,758 412,780"
            fill={COLORS.amber}
            opacity={actionArrow}
          />
          <text
            x="350"
            y="980"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="38"
            fontWeight="700"
            fill={COLORS.amber}
            opacity={actionArrow * 0.8}
            transform="rotate(-15, 350, 980)"
          >
            ACTION
          </text>
        </g>

        {/* ── Observation arrow (world → agent) right side ────────── */}
        <g opacity={observationArrow}>
          <path
            d="M 680 770 C 730 900, 700 1050, 620 1180"
            fill="none"
            stroke="url(#obsArrowGrad)"
            strokeWidth="3"
            strokeDasharray="8,5"
          />
          <polygon
            points="610,1170 620,1195 632,1172"
            fill={COLORS.vibrant_green}
            opacity={observationArrow}
          />
          <text
            x="730"
            y="980"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="38"
            fontWeight="700"
            fill={COLORS.vibrant_green}
            opacity={observationArrow * 0.8}
            transform="rotate(15, 730, 980)"
          >
            OBSERVATION
          </text>
        </g>

        {/* ── Speech bubble from world ────────────────────────────── */}
        <g
          opacity={speechBubbleOpacity}
          transform={`translate(780, 420) scale(${speechBubbleScale})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <rect x="-100" y="-40" width="200" height="70" rx="16" fill={COLORS.bg_black} stroke={COLORS.electric_cyan} strokeWidth="2" />
          {/* Bubble tail */}
          <polygon
            points="-30,30 -60,55 -10,30"
            fill={COLORS.bg_black}
            stroke={COLORS.electric_cyan}
            strokeWidth="2"
          />
          <rect x="-30" y="28" width="22" height="6" fill={COLORS.bg_black} />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="46"
            fontWeight="800"
            fill={COLORS.electric_cyan}
            filter="url(#cyanGlow)"
          >
            REPLY
          </text>
        </g>

        {/* ── Dramatic reveal: center title ───────────────────────── */}
        <g opacity={titleOpacity}>
          <rect
            x="80"
            y="1410"
            width="920"
            height="110"
            rx="20"
            fill={COLORS.electric_cyan}
            opacity="0.12"
          />
          <rect
            x="80"
            y="1410"
            width="920"
            height="110"
            rx="20"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="3.5"
          />
          <text
            x="540"
            y="1480"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="72"
            fontWeight="900"
            fill={COLORS.electric_cyan}
            filter="url(#cyanGlow)"
            letterSpacing="6"
          >
            THE WORLD&apos;S REPLY
          </text>
        </g>

        {/* ── Caption text ────────────────────────────────────────── */}
        <text x="540" y="1600" textAnchor="middle" fontFamily="monospace" fontSize="52" fontWeight="600" fill={COLORS.soft_white} opacity={captionOpacity}>
          The observation is the
        </text>
        <text x="540" y="1670" textAnchor="middle" fontFamily="monospace" fontSize="52" fontWeight="600" fill={COLORS.soft_white} opacity={captionOpacity}>
          <tspan fill={COLORS.electric_cyan} fontWeight="800">world&apos;s reply</tspan>
          {' '}to the
        </text>
        <text x="540" y="1740" textAnchor="middle" fontFamily="monospace" fontSize="52" fontWeight="600" fill={COLORS.soft_white} opacity={captionOpacity}>
          <tspan fill={COLORS.amber} fontWeight="800">agent&apos;s action</tspan>.
        </text>

        {/* ── Decorative star cross at corners ────────────────────── */}
        {[
          { x: 80, y: 80 },
          { x: 1000, y: 80 },
          { x: 80, y: 1840 },
          { x: 1000, y: 1840 },
        ].map((c, i) => {
          const cOp = interpolate(
            frame,
            [10 + i * 5, 25 + i * 5],
            [0, 0.4],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <g key={`sc-${i}`} opacity={cOp}>
              <line x1={c.x - 10} y1={c.y} x2={c.x + 10} y2={c.y} stroke={COLORS.electric_cyan} strokeWidth="1" />
              <line x1={c.x} y1={c.y - 10} x2={c.x} y2={c.y + 10} stroke={COLORS.electric_cyan} strokeWidth="1" />
            </g>
          );
        })}

        {/* ── Horizontal divider ──────────────────────────────────── */}
        <line
          x1="200"
          y1="1560"
          x2="880"
          y2="1560"
          stroke={COLORS.electric_cyan}
          strokeWidth="0.5"
          opacity={captionOpacity * 0.3}
        />

        {/* ── Bottom dots ─────────────────────────────────────────── */}
        {Array.from({ length: 7 }, (_, i) => (
          <circle
            key={`bdot-${i}`}
            cx={540 - 90 + i * 30}
            cy="1780"
            r="3"
            fill={COLORS.electric_cyan}
            opacity={dramaticReveal * 0.4}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
