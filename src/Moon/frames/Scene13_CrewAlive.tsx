/**
 * Scene 13 — Crew Alive
 * "Crew alive."
 * Duration: 58 frames (~1.9s) — audio 77.060s → 79.000s
 *
 * Visual: Three astronaut helmets in a row. Giant "✓ ALIVE" in soft mint.
 * Confirmation lights. Brief but impactful.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene13_CrewAlive: React.FC = () => {
  const frame = useCurrentFrame();

  const enter       = fadeIn(frame, 0, 12);
  const captionOp   = fadeIn(frame, 6, 14);
  const helmetScale = interpolate(frame, [0, 18], [0.4, 1], { extrapolateRight: 'clamp', easing: ease });
  const aliveEnter  = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const checkEnter  = interpolate(frame, [16, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const lightsEnter = interpolate(frame, [6, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Pulse for ALIVE text
  const pulse = 1 + interpolate(frame % 30, [0, 15, 30], [0, 0.04, 0], { extrapolateRight: 'clamp' });

  // Helmet positions — 3 astronauts
  const HELMETS = [
    { cx: 200, cy: 750 },
    { cx: 540, cy: 700 },
    { cx: 880, cy: 750 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="mintGlow13" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgRadial13" cx="50%" cy="40%" r="55%">
            <stop offset="0%"  stopColor={C.mint} stopOpacity="0.05" />
            <stop offset="100%" stopColor={C.bg}  stopOpacity="0" />
          </radialGradient>
        </defs>

        <StarField opacity={enter * 0.4} />

        {/* Background glow */}
        <rect x={0} y={0} width={1080} height={1920}
          fill="url(#bgRadial13)" opacity={aliveEnter} />

        {/* ── Astronaut helmets ── */}
        <g opacity={enter}
          transform={`translate(540,760) scale(${helmetScale}) translate(-540,-760)`}>
          {HELMETS.map((h, i) => {
            const delay = i * 4;
            const hOp = interpolate(frame, [delay, delay + 16], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={i} opacity={hOp}>
                {/* Outer suit ring */}
                <circle cx={h.cx} cy={h.cy} r={85}
                  fill={C.muted_blue} stroke={C.silver} strokeWidth={2} />
                {/* Helmet dome */}
                <ellipse cx={h.cx} cy={h.cy - 10} rx={68} ry={72}
                  fill={C.peach} stroke={C.silver} strokeWidth={2.5} />
                {/* Visor */}
                <ellipse cx={h.cx} cy={h.cy - 6} rx={48} ry={36}
                  fill={C.steel_blue} stroke={C.powder_blue} strokeWidth={2} opacity={0.85} />
                {/* Visor reflection */}
                <ellipse cx={h.cx - 12} cy={h.cy - 18} rx={14} ry={10}
                  fill={C.powder_blue} opacity={0.3} />
                {/* Neck ring */}
                <rect x={h.cx - 32} y={h.cy + 58} width={64} height={16} rx={8}
                  fill={C.silver} opacity={0.7} />
                {/* Oxygen hose */}
                <path d={`M ${h.cx + 28},${h.cy + 60} Q ${h.cx + 50},${h.cy + 80} ${h.cx + 40},${h.cy + 100}`}
                  fill="none" stroke={C.copper} strokeWidth={4} strokeLinecap="round" />
              </g>
            );
          })}
        </g>

        {/* Connecting line between helmets */}
        <line x1={200} y1={840} x2={880} y2={840}
          stroke={C.slate} strokeWidth={1} opacity={enter * 0.25} />

        {/* ── CREW ALIVE ── */}
        <g opacity={aliveEnter}
          transform={`scale(${pulse}) translate(${540 * (1 - pulse)}, ${1060 * (1 - pulse)})`}
          filter="url(#mintGlow13)">
          <text x={540} y={1040}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={700}
            fill={C.silver} letterSpacing="0.22em" opacity={0.7}>
            CREW
          </text>
          <text x={540} y={1140}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={130} fontWeight={900}
            fill={C.mint} letterSpacing="0.04em">
            ALIVE
          </text>
        </g>

        {/* Checkmarks — three, one per astronaut */}
        <g opacity={checkEnter} stroke={C.mint} strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M 160,1260 L 185,1290 L 240,1228" />
          <path d="M 500,1260 L 525,1290 L 580,1228" />
          <path d="M 840,1260 L 865,1290 L 920,1228" />
        </g>

        {/* Confirmation status lights */}
        <g opacity={lightsEnter}>
          {[200, 540, 880].map((x, i) => {
            const lightPulse = 1 + interpolate((frame + i * 10) % 30, [0, 15, 30], [0, 0.15, 0],
              { extrapolateRight: 'clamp' });
            return (
              <g key={i}>
                <circle cx={x} cy={1340} r={14 * lightPulse}
                  fill={C.mint} opacity={0.2} />
                <circle cx={x} cy={1340} r={8}
                  fill={C.mint} opacity={0.9}
                  filter="url(#mintGlow13)" />
              </g>
            );
          })}
        </g>

        {/* Mission year */}
        <text x={540} y={1430}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
          fill={C.slate} letterSpacing="0.28em" opacity={enter * 0.4}>
          APOLLO 8 · DECEMBER 25, 1968
        </text>

        <CornerBrackets opacity={enter * 0.35} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="Crew alive."
          highlight={['Crew', 'alive']}
        />
      </svg>
    </AbsoluteFill>
  );
};
