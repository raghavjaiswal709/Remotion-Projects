/**
 * Scene06_SearchAPI.tsx — Day 26: Observations
 *
 * "The agent called a search API. The results come back.
 *  That is an observation."
 *
 * Left: Agent icon sending a query arrow to a search magnifying glass
 * icon (right). Response arrow comes back with result data cards.
 * "SEARCH API" label. Data ripple effects. Three-step animation:
 * call → process → return.
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

/* ── Ripple rings ────────────────────────────────────────────────────── */
const ripples = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  delay: 45 + i * 8,
}));

/* ── Result cards ────────────────────────────────────────────────────── */
const resultCards = [
  { id: 0, label: 'Result 1', y: 0 },
  { id: 1, label: 'Result 2', y: 95 },
  { id: 2, label: 'Result 3', y: 190 },
];

/* ── Circuit decoration dots ─────────────────────────────────────────── */
const circuitDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: ((i * 131.7) % 980) + 50,
  y: ((i * 189.3) % 400) + 1400,
  r: 1.5 + (i % 3) * 0.5,
}));

export const Scene06_SearchAPI: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Animation drivers ────────────────────────────────────────────── */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const queryArrowProgress = interpolate(frame, [18, 42], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const searchIconScale = interpolate(frame, [25, 40], [0.5, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const searchIconOpacity = interpolate(frame, [25, 38], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const processingPulse = interpolate(
    frame,
    [42, 55, 65, 75],
    [0, 1, 0.6, 0],
    { extrapolateRight: 'clamp' },
  );

  const responseArrowProgress = interpolate(frame, [65, 95], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const observationLabel = interpolate(frame, [105, 120], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(
    frame,
    [40, 60, 145],
    [4, 10, 6],
    { extrapolateRight: 'clamp' },
  );

  const stepIndicator = interpolate(frame, [0, 42, 65, 95], [0, 1, 2, 3], {
    extrapolateRight: 'clamp',
  });

  const activeStep = Math.max(1, Math.min(3, Math.floor(stepIndicator)));

  const masterIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_paper }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="queryGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.warm_blue} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
          <linearGradient id="responseGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.vibrant_green} />
            <stop offset="100%" stopColor={COLORS.electric_cyan} />
          </linearGradient>
        </defs>

        {/* ── Paper grain ─────────────────────────────────────────── */}
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={`gr-${i}`}
            cx={((i * 149.3) % 1020) + 30}
            cy={((i * 193.7) % 1860) + 30}
            r={0.5 + (i % 3) * 0.3}
            fill={COLORS.deep_black}
            opacity={fadeIn * 0.04}
          />
        ))}

        {/* ── Steps indicator at top ─────────────────────────────── */}
        <g transform="translate(540, 220)" opacity={masterIn}>
          <text x="-240" y="80" textAnchor="middle" fontSize="46" fill={COLORS.cool_silver} fontWeight="bold">1</text>
          <text x="-240" y="140" textAnchor="middle" fontSize="42" fill={COLORS.cool_silver} fontWeight="bold">CALL</text>
          
          <text x="0" y="80" textAnchor="middle" fontSize="46" fill={COLORS.cool_silver} fontWeight="bold">2</text>
          <text x="0" y="140" textAnchor="middle" fontSize="42" fill={COLORS.cool_silver} fontWeight="bold">PROCESS</text>
          
          <text x="240" y="80" textAnchor="middle" fontSize="46" fill={COLORS.cool_silver} fontWeight="bold">3</text>
          <text x="240" y="140" textAnchor="middle" fontSize="42" fill={COLORS.cool_silver} fontWeight="bold">RETURN</text>

          {/* Active step highlight */}
          <g transform={`translate(${(activeStep - 2) * 240}, 0)`}>
            <circle cx="0" cy="80" r="50" fill="none" stroke={COLORS.electric_cyan} strokeWidth="4" filter="url(#cyanGlow)" />
            <circle cx="0" cy="80" r="42" fill={COLORS.electric_cyan} opacity="0.8" />
            <text x="0" y="98" textAnchor="middle" fontSize="56" fill={COLORS.deep_black} fontWeight="900">{activeStep}</text>
          </g>
        </g>

        {/* ── Agent ─────────────────────────────────────────────── */}
        <g transform="translate(180, 750) scale(1.6)" opacity={masterIn}>
          {/* External highlight when observation arrives */}
          <circle cx="0" cy="0" r="70" fill="none" stroke={COLORS.electric_cyan} strokeWidth="4" 
            opacity={responseArrowProgress} filter="url(#cyanGlow)" />
          {/* Agent body */}
          <rect x="-55" y="-70" width="110" height="90" rx="14" fill="none" stroke={COLORS.deep_black} strokeWidth="2.5" />
          <circle cx="-18" cy="-35" r="10" fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <circle cx="-18" cy="-35" r="4" fill={COLORS.electric_cyan} />
          <circle cx="18" cy="-35" r="10" fill="none" stroke={COLORS.electric_cyan} strokeWidth="1.5" />
          <circle cx="18" cy="-35" r="4" fill={COLORS.electric_cyan} />
          <line x1="-12" y1="-5" x2="12" y2="-5" stroke={COLORS.deep_black} strokeWidth="1.5" strokeLinecap="round" />
          {/* Body */}
          <rect x="-45" y="25" width="90" height="60" rx="10" fill="none" stroke={COLORS.deep_black} strokeWidth="2" />
          <text x="0" y="110" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="700" fill={COLORS.deep_black}>AGENT</text>
        </g>

        {/* ── Query arrow (agent → search) ────────────────────────── */}
        <line
          x1="310"
          y1="640"
          x2={310 + 380 * queryArrowProgress}
          y2="640"
          stroke="url(#queryGrad)"
          strokeWidth="3"
          strokeDasharray="8,4"
        />
        <polygon
          points={`${680 * queryArrowProgress + 310 * (1 - queryArrowProgress) - 10},625 ${680 * queryArrowProgress + 310 * (1 - queryArrowProgress) + 5},640 ${680 * queryArrowProgress + 310 * (1 - queryArrowProgress) - 10},655`}
          fill={COLORS.warm_blue}
          opacity={queryArrowProgress}
        />
        {/* Query label */}
        <text
          x={330 + 380 * queryArrowProgress}
          y={650 + Math.sin(frame * 0.1) * 10}
          textAnchor="start"
          fontFamily="monospace"
          fontSize="68"
          fontWeight="900"
          fill={COLORS.warm_blue}
          opacity={queryArrowProgress}
          filter="url(#cyanGlow)"
        >
          search(&quot;query&quot;)
        </text>

        {/* ── Search magnifying glass icon ────────────────────────── */}
        <g
          opacity={searchIconOpacity}
          transform={`translate(840, 780) scale(${searchIconScale * 1.2})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <circle cx="0" cy="-20" r="50" fill="none" stroke={COLORS.deep_black} strokeWidth="3" />
          <line x1="35" y1="15" x2="65" y2="45" stroke={COLORS.deep_black} strokeWidth="4" strokeLinecap="round" />
          {/* Inner detail */}
          <circle cx="-10" cy="-30" r="8" fill="none" stroke={COLORS.electric_cyan} strokeWidth="1" opacity="0.5" />
          {/* Processing pulse */}
          <circle cx="0" cy="-20" r={50 + processingPulse * 20} fill="none" stroke={COLORS.electric_cyan} strokeWidth="2" opacity={processingPulse * 0.5} />
          <text x="0" y="95" textAnchor="middle" fontFamily="monospace" fontSize="48" fontWeight="900" fill={COLORS.deep_black}>SEARCH API</text>
        </g>

        {/* ── Ripple effects from search ──────────────────────────── */}
        {ripples.map((rp) => {
          const rpProgress = interpolate(
            frame,
            [rp.delay, rp.delay + 20],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <circle
              key={`rp-${rp.id}`}
              cx="840"
              cy="760"
              r={70 + rpProgress * 80}
              fill="none"
              stroke={COLORS.electric_cyan}
              strokeWidth="2"
              opacity={(1 - rpProgress) * 0.4}
            />
          );
        })}

        {/* ── Response arrow (search → agent) ─────────────────────── */}
        <line
          x1="740"
          y1="880"
          x2={740 - 430 * responseArrowProgress}
          y2="880"
          stroke="url(#responseGrad)"
          strokeWidth="4"
          strokeDasharray="10,5"
        />
        <polygon
          points={`${740 - 430 * responseArrowProgress + 15},860 ${740 - 430 * responseArrowProgress - 10},880 ${740 - 430 * responseArrowProgress + 15},900`}
          fill={COLORS.vibrant_green}
          opacity={responseArrowProgress}
        />
        <text
          x="480"
          y="930"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="64"
          fontWeight="900"
          fill={COLORS.vibrant_green}
          opacity={responseArrowProgress}
          filter="url(#cyanGlow)"
        >
          results[]
        </text>

        {/* ── Result data cards ───────────────────────────────────── */}
        {resultCards.map((rc) => {
          const rcOp = interpolate(
            frame,
            [90 + rc.id * 6, 102 + rc.id * 6],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          const rcX = interpolate(
            frame,
            [90 + rc.id * 6, 102 + rc.id * 6],
            [60, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <g key={`rc-${rc.id}`} opacity={rcOp} transform={`translate(${rcX}, 0)`}>
              <rect
                x="120"
                y={1020 + rc.y * 1.2}
                width="840"
                height="100"
                rx="16"
                fill={COLORS.soft_white}
                stroke={COLORS.electric_cyan}
                strokeWidth="3"
                filter="url(#softGlow)"
              />
              <text
                x="180"
                y={1085 + rc.y * 1.2}
                fontFamily="monospace"
                fontSize="56"
                fontWeight="900"
                fill={COLORS.deep_black}
              >
                {rc.label}
              </text>
              <rect
                x="800"
                y={1040 + rc.y * 1.2}
                width="130"
                height="60"
                rx="12"
                fill={COLORS.electric_cyan}
                opacity="0.3"
              />
              <text
                x="865"
                y={1082 + rc.y * 1.2}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="42"
                fontWeight="900"
                fill={COLORS.electric_cyan}
              >
                DATA
              </text>
            </g>
          );
        })}

        {/* ── "OBSERVATION" label ──────────────────────────────────── */}
        <g opacity={observationLabel}>
          <rect
            x="140"
            y="1460"
            width="800"
            height="120"
            rx="24"
            fill={COLORS.electric_cyan}
            opacity="0.2"
            filter="url(#cyanGlow)"
          />
          <rect
            x="140"
            y="1460"
            width="800"
            height="120"
            rx="24"
            fill="none"
            stroke={COLORS.electric_cyan}
            strokeWidth="4"
          />
          <text
            x="540"
            y="1538"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="68"
            fontWeight="900"
            fill={COLORS.electric_cyan}
            filter="url(#cyanGlow)"
          >
            ✓ OBSERVATION
          </text>
        </g>

        {/* ── Main caption group ─────────────────────────────────── */}
        <g transform={`translate(540, 1680)`} opacity={observationLabel}>
          <text
            y="0"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.soft_white}
          >
            The agent called a
          </text>
          <text
            y="85"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="72"
            fontWeight="900"
            fill={COLORS.electric_cyan}
            filter="url(#cyanGlow)"
          >
            search API.
          </text>
          <text
            y="170"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.soft_white}
          >
            The results come back.
          </text>
          <text
            y="255"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="64"
            fontWeight="900"
            fill={COLORS.soft_white}
          >
            That is an <tspan fill={COLORS.electric_cyan} fontWeight="900">observation.</tspan>
          </text>
        </g>

        {/* ── Circuit dots ────────────────────────────────────────── */}
        {circuitDots.map((cd) => (
          <circle
            key={`cd-${cd.id}`}
            cx={cd.x}
            cy={cd.y}
            r={cd.r}
            fill={COLORS.electric_cyan}
            opacity={fadeIn * 0.1}
          />
        ))}

        {/* ── Decorative lines ────────────────────────────────────── */}
        <line x1="100" y1="1300" x2="980" y2="1300" stroke={COLORS.deep_black} strokeWidth="0.5" opacity={fadeIn * 0.08} />
        <line x1="120" y1="50" x2="120" y2="1870" stroke={COLORS.vibrant_red} strokeWidth="1" opacity={fadeIn * 0.12} />

        {/* ── Notebook holes ──────────────────────────────────────── */}
        {[300, 700, 1100, 1500].map((y, i) => (
          <circle key={`nh-${i}`} cx="65" cy={y} r="12" fill={COLORS.bg_paper} stroke={COLORS.deep_black} strokeWidth="1" opacity={fadeIn * 0.12} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
