/**
 * Scene 04 — Loss of Signal
 * "This is called loss of signal, and it happens because the moon is simply in the way."
 * Duration: 178 frames (~5.9s) — audio 14.540s → 20.460s
 *
 * Visual: Earth → blocked path → Moon → blocked path → Spacecraft.
 * "LOS" acronym reveals. Moon sits in the way, rose coral X on path.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, easeSnap, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, MoonCircle, EarthCircle, Spacecraft, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene04_LossOfSignal: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const moonEnter  = interpolate(frame, [6, 26], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const earthEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const craftEnter = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const lineEnter  = interpolate(frame, [18, 42], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter     = interpolate(frame, [30, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const losEnter   = interpolate(frame, [40, 64], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Layout: Earth at lower-left, Moon at center, Spacecraft at upper-right
  // Earth: (180, 1400)  Moon: (540, 840)  Spacecraft: (900, 420)

  // Line from Earth approaching Moon
  const line1EndX = 440; // where line1 hits Moon's left edge
  const line1EndY = 870;

  // Line from Moon (right edge) toward spacecraft
  const line2StartX = 640; // Moon right edge
  const line2StartY = 810;

  // X mark on Moon
  const xPulse = 1 + interpolate(frame, [50, 80, 110], [0, 0.08, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="xGlow04" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={C.rose_coral} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="losGlow04" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <StarField opacity={enter * 0.4} />

        {/* Subtle depth background band */}
        <rect x={320} y={400} width={440} height={900} rx={20}
          fill={C.muted_blue} opacity={enter * 0.06} />

        {/* Scene label */}
        <text x={540} y={120}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          SIGNAL BLOCKAGE · LUNAR OCCULTATION
        </text>

        {/* Earth */}
        <EarthCircle cx={180} cy={1420} r={85} opacity={earthEnter} />
        <text x={180} y={1520}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600}
          fill={C.mint} letterSpacing="0.12em" opacity={earthEnter * 0.8}>
          EARTH
        </text>

        {/* Spacecraft */}
        <Spacecraft cx={900} cy={440} scale={0.9} angle={-30} opacity={craftEnter} />
        <text x={900} y={380}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
          fill={C.peach} letterSpacing="0.12em" opacity={craftEnter * 0.8}>
          SPACECRAFT
        </text>

        {/* Signal line 1: Earth → Moon edge (teal dashed, blocked) */}
        <line
          x1={180} y1={1420}
          x2={180 + (line1EndX - 180) * lineEnter}
          y2={1420 + (line1EndY - 1420) * lineEnter}
          stroke={C.teal}
          strokeWidth={2.5}
          strokeDasharray="12,8"
          opacity={enter * 0.75}
        />

        {/* Signal line 2: Moon right edge → Spacecraft (teal dashed, also blocked = no signal) */}
        <line
          x1={line2StartX}
          y1={line2StartY}
          x2={line2StartX + (900 - line2StartX) * lineEnter}
          y2={line2StartY + (440 - line2StartY) * lineEnter}
          stroke={C.rose_coral}
          strokeWidth={2.5}
          strokeDasharray="12,8"
          opacity={enter * 0.5}
        />

        {/* Moon — center */}
        <MoonCircle cx={540} cy={840} r={250} opacity={moonEnter} />

        {/* "IN THE WAY" bracket arrow */}
        <g opacity={xEnter * 0.7}>
          <path d={`M 350,580 Q 540,540 730,580`}
            fill="none" stroke={C.warm_pink} strokeWidth={2} strokeDasharray="6,6" />
          <text x={540} y={558}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
            fill={C.warm_pink} letterSpacing="0.15em">
            SIMPLY IN THE WAY
          </text>
        </g>

        {/* Large X on Moon */}
        <g opacity={xEnter} transform={`scale(${xPulse}) translate(${540 * (1 - xPulse)}, ${840 * (1 - xPulse)})`}>
          <line x1={490} y1={790} x2={590} y2={890}
            stroke={C.rose_coral} strokeWidth={5} strokeLinecap="round"
            filter="url(#xGlow04)" />
          <line x1={590} y1={790} x2={490} y2={890}
            stroke={C.rose_coral} strokeWidth={5} strokeLinecap="round"
            filter="url(#xGlow04)" />
          {/* Circle around X */}
          <circle cx={540} cy={840} r={44}
            fill="none" stroke={C.rose_coral} strokeWidth={3}
            opacity={0.7} />
        </g>

        {/* ── LOS acronym breakdown ── */}
        <g opacity={losEnter} filter="url(#losGlow04)">
          {/* Panel background */}
          <rect x={100} y={1100} width={880} height={200} rx={12}
            fill={C.muted_blue} opacity={0.18} />
          <rect x={100} y={1100} width={880} height={200} rx={12}
            fill="none" stroke={C.steel_blue} strokeWidth={1.5} opacity={0.4} />

          {/* L */}
          <text x={210} y={1190}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={76} fontWeight={900}
            fill={C.steel_blue} letterSpacing="0.02em">
            L
          </text>
          <text x={210} y={1262}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={C.silver} letterSpacing="0.06em" opacity={0.7}>
            LOSS
          </text>

          {/* O */}
          <text x={540} y={1190}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={76} fontWeight={900}
            fill={C.warm_pink} letterSpacing="0.02em">
            O
          </text>
          <text x={540} y={1262}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={C.silver} letterSpacing="0.06em" opacity={0.7}>
            OF
          </text>

          {/* S */}
          <text x={870} y={1190}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={76} fontWeight={900}
            fill={C.teal} letterSpacing="0.02em">
            S
          </text>
          <text x={870} y={1262}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
            fill={C.silver} letterSpacing="0.06em" opacity={0.7}>
            SIGNAL
          </text>

          {/* Dividers */}
          <line x1={350} y1={1120} x2={350} y2={1280}
            stroke={C.slate} strokeWidth={1} opacity={0.4} />
          <line x1={700} y1={1120} x2={700} y2={1280}
            stroke={C.slate} strokeWidth={1} opacity={0.4} />
        </g>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="This is called loss of signal, and it happens because the moon is simply in the way."
          highlight={['loss', 'signal', 'moon']}
        />
      </svg>
    </AbsoluteFill>
  );
};
