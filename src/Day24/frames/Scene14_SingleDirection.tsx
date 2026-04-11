/**
 * Scene 14 — Single Direction
 * "A single model call moves in one direction. Input to output."
 * Show a straight arrow from INPUT box to OUTPUT box, linear flow.
 * ProcessorUnit in center, single-pass visualization.
 * Duration: 128 frames (4.27s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  ProcessorUnit,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Arrow path constants ───────────────────────────────────────────────────
const ARROW_START_X = 140;
const ARROW_END_X = 940;
const ARROW_Y = 680;
const ARROW_LEN = ARROW_END_X - ARROW_START_X;

// ── Data packets flowing left to right ─────────────────────────────────────
const DATA_PACKETS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  delay: i * 5 + 15,
  speed: 3 + (i % 4) * 0.8,
  y: ARROW_Y + (Math.sin(i * 1.7) * 18),
  size: 4 + (i % 3) * 2,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.cool_silver][i % 3],
}));

// ── Horizontal guide lines ─────────────────────────────────────────────────
const GUIDE_LINES = Array.from({ length: 8 }, (_, i) => ({
  y: ARROW_Y - 60 + i * 17,
  opacity: 0.03 + (i === 4 ? 0.06 : 0),
  width: i === 4 ? 1.5 : 0.5,
}));

// ── Timeline tick marks along the arrow ────────────────────────────────────
const TIMELINE_TICKS = Array.from({ length: 17 }, (_, i) => ({
  x: ARROW_START_X + (i / 16) * ARROW_LEN,
  height: i % 4 === 0 ? 16 : 8,
  width: i % 4 === 0 ? 2 : 1,
}));

// ── Measurement brackets above and below ───────────────────────────────────
const MEASURE_MARKS = [
  { x1: 170, x2: 460, y: 600, label: 'encode', color: COLORS.cool_silver },
  { x1: 470, x2: 620, y: 600, label: 'process', color: COLORS.warm_blue },
  { x1: 630, x2: 920, y: 600, label: 'decode', color: COLORS.cool_silver },
];

// ── "Single pass" indicator dots ───────────────────────────────────────────
const PASS_DOTS = Array.from({ length: 12 }, (_, i) => ({
  x: ARROW_START_X + 50 + i * 65,
  baseY: ARROW_Y,
}));

// ── Background ambient particles ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 157.3 + 25) % 1080,
  y: (i * 211.7 + 45) % 1920,
  r: 1 + (i % 3) * 0.7,
  speed: 0.1 + (i % 4) * 0.06,
  phase: i * 0.55,
}));

// ── Comparison stats ───────────────────────────────────────────────────────
const STATS = [
  { label: 'DIRECTION', value: 'ONE-WAY', color: COLORS.cool_silver },
  { label: 'PASSES', value: 'SINGLE', color: COLORS.warm_blue },
  { label: 'FEEDBACK', value: 'NONE', color: COLORS.vibrant_red },
];

// ── Decorative hash marks on input/output boxes ────────────────────────────
const HASH_LINES = Array.from({ length: 6 }, (_, i) => ({
  offset: i * 10 + 5,
  width: 1,
}));

// ── Vertical scan lines for background ─────────────────────────────────────
const SCAN_VERTICALS = Array.from({ length: 16 }, (_, i) => ({
  x: 68 * i,
  op: 0.02 + (i % 3) * 0.01,
}));

export const Scene14_SingleDirection: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [5, 30], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const arrowDraw = interpolate(frame, [20, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const inputEnter = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const outputEnter = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const processorEnter = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const measureEnter = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const statsEnter = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [80, 105], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Arrow head position (animates along the path)
  const arrowHeadX = ARROW_START_X + arrowDraw * ARROW_LEN;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.2}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="boxGlowS14" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="arrowGlowS14" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feFlood floodColor={COLORS.cool_silver} floodOpacity="0.3" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="arrowGradS14" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.cool_silver} stopOpacity="0.3"/>
              <stop offset="50%" stopColor={COLORS.warm_blue} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={COLORS.cool_silver} stopOpacity="0.3"/>
            </linearGradient>
            <linearGradient id="inputGradS14" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0"/>
              <stop offset="100%" stopColor="#CBD5E1"/>
            </linearGradient>
            <linearGradient id="outputGradS14" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DBEAFE"/>
              <stop offset="100%" stopColor="#93C5FD"/>
            </linearGradient>
            <marker id="arrowTipS14" markerWidth="14" markerHeight="10"
              refX="13" refY="5" orient="auto">
              <polygon points="0 0, 14 5, 0 10"
                fill={COLORS.cool_silver} opacity={0.8}/>
            </marker>
          </defs>

          {/* ── Vertical scan lines ── */}
          {SCAN_VERTICALS.map((sv, i) => (
            <line key={i} x1={sv.x} y1={0} x2={sv.x} y2={1920}
              stroke={COLORS.cool_silver} strokeWidth={0.5}
              opacity={enter * sv.op}/>
          ))}

          {/* ── Background ambient particles ── */}
          {BG_PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 30) % 1920;
            return (
              <circle key={i}
                cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={COLORS.warm_blue}
                opacity={enter * (0.03 + Math.sin(frame * 0.04 + p.phase) * 0.015)}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={380} height={52} rx={12}
              fill={COLORS.cool_silver} opacity={0.9}/>
            <text x={250} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">SINGLE DIRECTION</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={190} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={50} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              One Direction
            </text>
            <text x={540} y={248} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
              fill={COLORS.cool_silver}>
              Input → Output. That's it.
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={290} x2={880} y2={290}
            stroke={COLORS.cool_silver} strokeWidth={1.5} opacity={titleEnter * 0.15}/>

          {/* ── Horizontal guide lines ── */}
          {GUIDE_LINES.map((gl, i) => (
            <line key={i} x1={100} y1={gl.y} x2={980} y2={gl.y}
              stroke={COLORS.cool_silver} strokeWidth={gl.width}
              opacity={enter * gl.opacity}/>
          ))}

          {/* ── Timeline ticks ── */}
          {TIMELINE_TICKS.map((tick, i) => (
            <line key={i}
              x1={tick.x} y1={ARROW_Y + 25}
              x2={tick.x} y2={ARROW_Y + 25 + tick.height}
              stroke={COLORS.cool_silver} strokeWidth={tick.width}
              opacity={enter * 0.15}/>
          ))}

          {/* ── Main arrow (drawn progressively) ── */}
          <line x1={ARROW_START_X} y1={ARROW_Y}
            x2={arrowHeadX} y2={ARROW_Y}
            stroke="url(#arrowGradS14)" strokeWidth={4}
            strokeLinecap="round"
            filter="url(#arrowGlowS14)"
            markerEnd={arrowDraw > 0.9 ? 'url(#arrowTipS14)' : undefined}/>

          {/* ── Arrow trail dash ── */}
          <line x1={ARROW_START_X} y1={ARROW_Y}
            x2={arrowHeadX} y2={ARROW_Y}
            stroke={COLORS.warm_blue} strokeWidth={1}
            strokeDasharray="8 12"
            opacity={enter * 0.2}/>

          {/* ── Data packets flowing ── */}
          {DATA_PACKETS.map((dp) => {
            const progress = interpolate(frame, [dp.delay, dp.delay + 40], [0, 1], { extrapolateRight: 'clamp' });
            const px = ARROW_START_X + progress * ARROW_LEN;
            const fadeOp = Math.sin(progress * Math.PI);
            return (
              <circle key={dp.id}
                cx={px} cy={dp.y} r={dp.size}
                fill={dp.color}
                opacity={fadeOp * 0.6}/>
            );
          })}

          {/* ── Pass indicator dots ── */}
          {PASS_DOTS.map((dot, i) => {
            const dotEnter = interpolate(frame, [20 + i * 3, 30 + i * 3], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <circle key={i}
                cx={dot.x} cy={ARROW_Y + 55} r={4}
                fill={COLORS.warm_blue}
                opacity={dotEnter * 0.25}/>
            );
          })}

          {/* ── INPUT box ── */}
          <g opacity={inputEnter}
            transform={`translate(${interpolate(inputEnter, [0, 1], [-40, 0])}, 0)`}>
            <rect x={80} y={ARROW_Y - 65} width={180} height={130} rx={16}
              fill="url(#inputGradS14)" stroke={COLORS.cool_silver}
              strokeWidth={2} filter="url(#shadow)"/>
            {/* Hash decorations */}
            {HASH_LINES.map((h, i) => (
              <line key={i}
                x1={88} y1={ARROW_Y - 58 + h.offset * 2}
                x2={98} y2={ARROW_Y - 58 + h.offset * 2}
                stroke={COLORS.light_gray} strokeWidth={h.width}
                opacity={0.3}/>
            ))}
            <text x={170} y={ARROW_Y - 20} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
              fill={COLORS.light_gray} letterSpacing="0.06em">
              PROMPT
            </text>
            <text x={170} y={ARROW_Y + 12} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
              fill={COLORS.deep_black}>
              INPUT
            </text>
            <text x={170} y={ARROW_Y + 44} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={13}
              fill={COLORS.light_gray} opacity={0.5}>
              tokens[ ]
            </text>
          </g>

          {/* ── Center processor ── */}
          <g opacity={processorEnter}>
            <ProcessorUnit cx={540} cy={ARROW_Y} size={70}
              opacity={processorEnter} scale={scaleAnim(frame, 30, 25, 0.6, 1)}
              variant="active" label="MODEL" frame={frame}/>
            {/* Single-pass label */}
            <text x={540} y={ARROW_Y + 60} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
              fill={COLORS.warm_blue} opacity={processorEnter * 0.6}
              letterSpacing="0.08em">
              SINGLE PASS
            </text>
          </g>

          {/* ── OUTPUT box ── */}
          <g opacity={outputEnter}
            transform={`translate(${interpolate(outputEnter, [0, 1], [40, 0])}, 0)`}>
            <rect x={820} y={ARROW_Y - 65} width={180} height={130} rx={16}
              fill="url(#outputGradS14)" stroke={COLORS.warm_blue}
              strokeWidth={2} filter="url(#shadow)"/>
            {HASH_LINES.map((h, i) => (
              <line key={i}
                x1={828} y1={ARROW_Y - 58 + h.offset * 2}
                x2={838} y2={ARROW_Y - 58 + h.offset * 2}
                stroke={COLORS.warm_blue} strokeWidth={h.width}
                opacity={0.2}/>
            ))}
            <text x={910} y={ARROW_Y - 20} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
              fill={COLORS.warm_blue} letterSpacing="0.06em" opacity={0.7}>
              RESPONSE
            </text>
            <text x={910} y={ARROW_Y + 12} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
              fill={COLORS.warm_blue}>
              OUTPUT
            </text>
            <text x={910} y={ARROW_Y + 44} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={13}
              fill={COLORS.warm_blue} opacity={0.4}>
              result[ ]
            </text>
          </g>

          {/* ── Measurement brackets ── */}
          {MEASURE_MARKS.map((m, i) => {
            const mEnter = interpolate(frame, [42 + i * 8, 58 + i * 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={measureEnter * mEnter * 0.4}>
                <line x1={m.x1} y1={m.y} x2={m.x2} y2={m.y}
                  stroke={m.color} strokeWidth={1}/>
                <line x1={m.x1} y1={m.y - 5} x2={m.x1} y2={m.y + 5}
                  stroke={m.color} strokeWidth={1}/>
                <line x1={m.x2} y1={m.y - 5} x2={m.x2} y2={m.y + 5}
                  stroke={m.color} strokeWidth={1}/>
                <text x={(m.x1 + m.x2) / 2} y={m.y - 10} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={12} fontWeight={600}
                  fill={m.color}>
                  {m.label}
                </text>
              </g>
            );
          })}

          {/* ── "NO FEEDBACK" crossed arrow ── */}
          <g opacity={bottomEnter * 0.5}>
            {/* Faded reverse arrow */}
            <line x1={800} y1={ARROW_Y + 100}
              x2={280} y2={ARROW_Y + 100}
              stroke={COLORS.vibrant_red} strokeWidth={2}
              strokeDasharray="8 6" opacity={0.25}/>
            {/* X mark over it */}
            <g transform={`translate(540, ${ARROW_Y + 100})`}>
              <line x1={-15} y1={-15} x2={15} y2={15}
                stroke={COLORS.vibrant_red} strokeWidth={3}/>
              <line x1={15} y1={-15} x2={-15} y2={15}
                stroke={COLORS.vibrant_red} strokeWidth={3}/>
            </g>
            <text x={540} y={ARROW_Y + 135} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
              fill={COLORS.vibrant_red} letterSpacing="0.12em">
              NO FEEDBACK LOOP
            </text>
          </g>

          {/* ── Stat cards ── */}
          {STATS.map((stat, i) => {
            const sEnter = interpolate(frame, [72 + i * 8, 90 + i * 8], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const sx = 180 + i * 360;
            return (
              <g key={stat.label} opacity={sEnter * statsEnter}>
                <rect x={sx - 140} y={900} width={280} height={100} rx={14}
                  fill="#FFFFFF" stroke={stat.color} strokeWidth={1.5}
                  filter="url(#shadow)"/>
                <text x={sx} y={935} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
                  fill={stat.color} letterSpacing="0.08em" opacity={0.6}>
                  {stat.label}
                </text>
                <text x={sx} y={975} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={900}
                  fill={stat.color}>
                  {stat.value}
                </text>
              </g>
            );
          })}

          {/* ── Bottom insight ── */}
          <g opacity={bottomEnter}>
            <rect x={100} y={1060} width={880} height={140} rx={16}
              fill="#FFFFFF" stroke={COLORS.cool_silver} strokeWidth={1.5}
              opacity={0.92} filter="url(#shadow)"/>
            <rect x={100} y={1060} width={6} height={140} rx={3}
              fill={COLORS.cool_silver}/>
            <text x={150} y={1112} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              A model call is a straight line.
            </text>
            <text x={150} y={1155} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
              fill={COLORS.light_gray}>
              No return path. No feedback. No adaptation.
            </text>
          </g>

          {/* ── Footer ── */}
          <text x={540} y={1260} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={15} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.25}
            letterSpacing="0.06em">
            model.predict(input) → output // one-way
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="A single model call moves in one direction. Input to output."
          opacity={captionEnter}
          highlightWords={['single model call', 'one direction', 'Input', 'output']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
