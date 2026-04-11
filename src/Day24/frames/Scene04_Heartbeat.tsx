/**
 * Scene 04 — Heartbeat
 * "The agent loop is the heartbeat of every agentic AI system ever built."
 * Pulsing heart/loop animation in center, ECG-style line, heartbeat visual.
 * Premium dark paper with glowing cyan heartbeat trace.
 * Duration: 140 frames (4.67s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── ECG Heartbeat path control points ──────────────────────────────────────
// A single heartbeat "blip" pattern spanning ~200px wide
const buildECGPath = (startX: number, cy: number, scale: number = 1): string => {
  const s = scale;
  return [
    `M ${startX},${cy}`,
    `L ${startX + 30 * s},${cy}`,
    `L ${startX + 40 * s},${cy - 12 * s}`,
    `L ${startX + 50 * s},${cy}`,
    `L ${startX + 70 * s},${cy}`,
    `L ${startX + 80 * s},${cy - 80 * s}`,
    `L ${startX + 95 * s},${cy + 50 * s}`,
    `L ${startX + 110 * s},${cy - 30 * s}`,
    `L ${startX + 120 * s},${cy}`,
    `L ${startX + 150 * s},${cy}`,
    `L ${startX + 160 * s},${cy - 8 * s}`,
    `L ${startX + 170 * s},${cy + 8 * s}`,
    `L ${startX + 180 * s},${cy}`,
    `L ${startX + 220 * s},${cy}`,
  ].join(' ');
};

// ── Pulse ring positions ───────────────────────────────────────────────────
const PULSE_RINGS = [
  { r: 140, delay: 0 },
  { r: 180, delay: 8 },
  { r: 220, delay: 16 },
  { r: 260, delay: 24 },
  { r: 300, delay: 32 },
];

// ── System stat items ──────────────────────────────────────────────────────
const STATS = [
  { label: 'LOOP CYCLES', value: '∞', color: COLORS.electric_cyan },
  { label: 'LATENCY', value: '<50ms', color: COLORS.vibrant_green },
  { label: 'UPTIME', value: '99.9%', color: COLORS.amber },
];

// ── Background circuit particles ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 157.3) % 1080,
  y: (i * 213.7) % 1920,
  r: 1.5 + (i % 3),
  speed: 0.2 + (i % 4) * 0.1,
  phase: i * 0.5,
}));

export const Scene04_Heartbeat: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [5, 35], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [5, 35], [50, 0], { extrapolateRight: 'clamp', easing: ease });
  const heartEnter = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ecgEnter = interpolate(frame, [25, 60], [0, 1], { extrapolateRight: 'clamp' });
  const statsEnter = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });

  // Heartbeat rhythm — periodic pulse
  const beatPhase = (frame % 30) / 30; // 1 beat per second
  const beatScale = 1 + Math.max(0, Math.sin(beatPhase * Math.PI * 2) * 0.12);
  const beatGlow = 0.3 + Math.max(0, Math.sin(beatPhase * Math.PI * 2)) * 0.7;

  // ECG trace animation — total path length for dash drawing
  const ecgTotalLen = 2200;
  const ecgDashOffset = interpolate(frame, [25, 120], [ecgTotalLen, -ecgTotalLen], { extrapolateRight: 'clamp' });

  // Loop arrow rotation
  const loopDash = interpolate(frame, [15, 70], [300, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.22}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="heartGlowS04" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="18" result="blur"/>
              <feFlood floodColor="#EF4444" floodOpacity="0.4" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="cyanTraceS04" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feFlood floodColor="#00E5FF" floodOpacity="0.6" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="ecgFadeS04" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0"/>
              <stop offset="15%" stopColor="#00E5FF" stopOpacity="1"/>
              <stop offset="85%" stopColor="#00E5FF" stopOpacity="1"/>
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="heartCoreS04" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.9"/>
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* ── Background particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 40) % 1920;
            return (
              <circle key={i}
                cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={COLORS.electric_cyan}
                opacity={enter * (0.03 + Math.sin(frame * 0.03 + p.phase) * 0.015)}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={80} y={60} width={260} height={52} rx={12}
              fill={COLORS.vibrant_red} opacity={0.9}/>
            <text x={210} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
              fill="white" letterSpacing="0.10em">HEARTBEAT</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={210} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={62} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.03em">
              The Agent Loop
            </text>
            <text x={540} y={270} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
              fill={COLORS.vibrant_red} opacity={0.8}>
              is the heartbeat
            </text>
            <text x={540} y={320} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
              fill={COLORS.light_gray}>
              of every agentic AI system ever built
            </text>
          </g>

          {/* ── Horizontal divider ── */}
          <line x1={200} y1={370} x2={880} y2={370}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} opacity={titleEnter * 0.2}/>

          {/* ── Central heartbeat visual ── */}

          {/* Pulse rings expanding outward */}
          {PULSE_RINGS.map((ring, i) => {
            const ringPulse = ((frame + ring.delay) % 30) / 30;
            const ringScale = 1 + ringPulse * 0.3;
            const ringOp = Math.max(0, 1 - ringPulse) * 0.2 * heartEnter;
            return (
              <circle key={i}
                cx={540} cy={720}
                r={ring.r * ringScale}
                fill="none" stroke={COLORS.vibrant_red}
                strokeWidth={2 - i * 0.3}
                opacity={ringOp}/>
            );
          })}

          {/* Heart/loop center glow */}
          <circle cx={540} cy={720} r={100}
            fill="url(#heartCoreS04)" opacity={heartEnter * beatGlow * 0.5}/>

          {/* Central loop arrow — the "heartbeat" of agents */}
          <g transform={`translate(540, 720) scale(${beatScale * heartEnter})`}>
            <LoopArrow cx={0} cy={0} r={70}
              color={COLORS.vibrant_red} strokeWidth={5}
              dashOffset={loopDash} opacity={heartEnter}
              showArrow={true} label=""/>
          </g>

          {/* Inner core dot */}
          <circle cx={540} cy={720} r={12}
            fill={COLORS.vibrant_red} opacity={heartEnter * beatGlow}
            filter="url(#heartGlowS04)"/>

          {/* "LOOP" text inside */}
          <text x={540} y={726} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={900}
            fill="white" opacity={heartEnter * 0.9}
            letterSpacing="0.12em">
            LOOP
          </text>

          {/* ── ECG trace line (below heart) ── */}
          <g opacity={ecgEnter}>
            {/* Build a repeating ECG across the width */}
            {[0, 1, 2, 3, 4].map(i => (
              <path key={i}
                d={buildECGPath(-40 + i * 240, 950, 1.1)}
                fill="none" stroke="#00E5FF" strokeWidth={3}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={ecgTotalLen}
                strokeDashoffset={ecgDashOffset}
                filter="url(#cyanTraceS04)"
                opacity={0.8}/>
            ))}
            {/* Baseline */}
            <line x1={0} y1={950} x2={1080} y2={950}
              stroke="#00E5FF" strokeWidth={1} opacity={0.15}/>
          </g>

          {/* ── ECG label ── */}
          <text x={80} y={1010} textAnchor="start"
            fontFamily="'Courier New', monospace" fontSize={18} fontWeight={600}
            fill={COLORS.electric_cyan} opacity={ecgEnter * 0.5}>
            AGENT_LOOP_SIGNAL // active
          </text>

          {/* ── System stats row ── */}
          {STATS.map((stat, i) => {
            const sEnter = interpolate(frame, [62 + i * 8, 82 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
            const cx = 180 + i * 360;
            return (
              <g key={stat.label} opacity={sEnter * statsEnter}>
                {/* Stat card */}
                <rect x={cx - 140} y={1080} width={280} height={120} rx={16}
                  fill="#F9FAFB" stroke={stat.color} strokeWidth={2}
                  filter="url(#shadow)"/>
                {/* Label */}
                <text x={cx} y={1118} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={700}
                  fill={stat.color} letterSpacing="0.10em" opacity={0.7}>
                  {stat.label}
                </text>
                {/* Value */}
                <text x={cx} y={1168} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={900}
                  fill={stat.color}>
                  {stat.value}
                </text>
              </g>
            );
          })}

          {/* ── Bottom insight section ── */}
          <g opacity={bottomEnter}>
            {/* Divider */}
            <line x1={140} y1={1260} x2={940} y2={1260}
              stroke={COLORS.warm_blue} strokeWidth={1} opacity={0.12}/>

            {/* Quote box */}
            <rect x={120} y={1300} width={840} height={180} rx={18}
              fill="#F9FAFB" stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={0.9}
              filter="url(#shadow)"/>
            <rect x={120} y={1300} width={6} height={180} rx={3}
              fill={COLORS.warm_blue}/>

            {/* Quote text */}
            <text x={170} y={1365} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
              fill={COLORS.deep_black}>
              Without the loop, there is no agent.
            </text>
            <text x={170} y={1410} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700}
              fill={COLORS.warm_blue}>
              The loop is the agent.
            </text>

            {/* Decorative heartbeat mini icon */}
            <path d={buildECGPath(720, 1450, 0.5)}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
              opacity={0.4}/>
          </g>

          {/* ── Ambient corner decorations ── */}
          {[0, 1].map(i => {
            const rot = i * 180;
            return (
              <g key={i} opacity={enter * 0.1}
                transform={`rotate(${rot}, 540, 960)`}>
                <circle cx={540} cy={200} r={4}
                  fill={COLORS.electric_cyan}/>
                <line x1={540} y1={210} x2={540} y2={280}
                  stroke={COLORS.electric_cyan} strokeWidth={1}/>
              </g>
            );
          })}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="The agent loop is the heartbeat of every agentic AI system ever built."
          opacity={captionEnter}
          highlightWords={['agent loop', 'heartbeat', 'agentic AI']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
