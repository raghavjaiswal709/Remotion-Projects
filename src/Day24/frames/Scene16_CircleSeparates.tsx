/**
 * Scene 16 — Circle Separates
 * "That circle is what separates a model from an agent."
 * Two sides: left = MODEL (straight line, blue, ProcessorUnit)
 *            right = AGENT (circle, cyan, with LoopArrow)
 * Animated divider between them, "≠" symbol in the middle.
 * Duration: 88 frames (~2.93s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  LoopArrow, ProcessorUnit,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout constants ───────────────────────────────────────────────────────
const CX_LEFT = 280;
const CX_RIGHT = 800;
const DIVIDER_X = 540;
const MAIN_Y = 620;
const NEQ_Y = 620;

// ── Background grid dots ───────────────────────────────────────────────────
const GRID_DOTS = Array.from({ length: 120 }, (_, i) => ({
  x: (i % 12) * 100 + 40,
  y: Math.floor(i / 12) * 192,
  r: 1.5,
  phase: i * 0.43,
}));

// ── Floating ambient particles ─────────────────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 173.7 + 60) % 1080,
  y: (i * 217.3 + 80) % 1920,
  r: 1 + (i % 3) * 0.6,
  speed: 0.08 + (i % 5) * 0.04,
  phase: i * 0.68,
  color: i % 2 === 0 ? COLORS.warm_blue : COLORS.electric_cyan,
}));

// ── Model side: linear flow dots ───────────────────────────────────────────
const LINEAR_DOTS = Array.from({ length: 8 }, (_, i) => ({
  x: CX_LEFT - 90 + i * 26,
  y: MAIN_Y,
  delay: i * 3 + 15,
  size: 3 + (i % 3),
}));

// ── Agent side: orbital concept dots ───────────────────────────────────────
const ORBIT_DOTS = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * Math.PI * 2,
  r: 100,
  size: 3 + (i % 3),
  delay: i * 2 + 20,
  color: [COLORS.electric_cyan, COLORS.warm_blue, COLORS.purple, COLORS.vibrant_green][i % 4],
}));

// ── Comparison attribute rows ──────────────────────────────────────────────
const ATTRIBUTES = [
  { label: 'FLOW', modelVal: 'Linear', agentVal: 'Circular', y: 920 },
  { label: 'FEEDBACK', modelVal: 'None', agentVal: 'Continuous', y: 980 },
  { label: 'ADAPTATION', modelVal: 'Static', agentVal: 'Dynamic', y: 1040 },
];

// ── Decorative bracket marks ───────────────────────────────────────────────
const BRACKET_MARKS = Array.from({ length: 6 }, (_, i) => ({
  x: DIVIDER_X + (i % 2 === 0 ? -3 : 3),
  y: 440 + i * 60,
  w: 2,
  h: 30,
}));

// ── Scan lines for dramatic effect ─────────────────────────────────────────
const SCAN_LINES = Array.from({ length: 20 }, (_, i) => ({
  y: i * 96,
  opacity: 0.015 + (i % 3) * 0.005,
}));

// ── Stat badge positions ───────────────────────────────────────────────────
const MODEL_STATS = [
  { icon: '→', label: 'ONE-WAY', x: CX_LEFT, y: MAIN_Y + 130 },
  { icon: '1×', label: 'SINGLE PASS', x: CX_LEFT, y: MAIN_Y + 195 },
];

const AGENT_STATS = [
  { icon: '↻', label: 'LOOPING', x: CX_RIGHT, y: MAIN_Y + 130 },
  { icon: 'N×', label: 'MULTI PASS', x: CX_RIGHT, y: MAIN_Y + 195 },
];

// ── Background pattern lines ───────────────────────────────────────────────
const BG_LINES_LEFT = Array.from({ length: 10 }, (_, i) => ({
  x1: 40, x2: CX_LEFT + 160,
  y: 400 + i * 50,
  op: 0.025,
}));

const BG_LINES_RIGHT = Array.from({ length: 10 }, (_, i) => ({
  x1: CX_RIGHT - 160, x2: 1040,
  y: 400 + i * 50,
  op: 0.025,
}));

// ── Small decorative symbols ───────────────────────────────────────────────
const DECO_SYMBOLS = [
  { x: 130, y: 380, text: '{ }', color: COLORS.warm_blue },
  { x: 430, y: 380, text: '→', color: COLORS.cool_silver },
  { x: 650, y: 380, text: '↻', color: COLORS.electric_cyan },
  { x: 950, y: 380, text: '∞', color: COLORS.electric_cyan },
];

// ── Pulse rings for agent side ─────────────────────────────────────────────
const PULSE_RINGS = Array.from({ length: 4 }, (_, i) => ({
  r: 110 + i * 25,
  delay: i * 8,
  width: 1.5 - i * 0.3,
}));

export const Scene16_CircleSeparates: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers ────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [3, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [3, 22], [30, 0], { extrapolateRight: 'clamp', easing: ease });
  const dividerGrow = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const leftEnter = interpolate(frame, [15, 38], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const rightEnter = interpolate(frame, [22, 45], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const neqEnter = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const neqScale = interpolate(frame, [30, 50], [0.3, 1], { extrapolateRight: 'clamp', easing: ease });
  const neqPulse = interpolate(frame, [50, 88], [0, 1], { extrapolateRight: 'clamp' });
  const attrsEnter = interpolate(frame, [42, 62], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const bottomEnter = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionEnter = interpolate(frame, [3, 15], [0, 1], { extrapolateRight: 'clamp' });
  const loopDash = interpolate(frame, [0, 88], [0, 600], { extrapolateRight: 'clamp' });
  const labelSlideL = interpolate(frame, [15, 38], [-30, 0], { extrapolateRight: 'clamp', easing: ease });
  const labelSlideR = interpolate(frame, [22, 45], [30, 0], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.18}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="neqGlowS16" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" result="blur"/>
              <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.5" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="modelBoxS16" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={COLORS.warm_blue} floodOpacity="0.15"/>
            </filter>
            <filter id="agentBoxS16" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={COLORS.electric_cyan} floodOpacity="0.2"/>
            </filter>
            <linearGradient id="dividerGradS16" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor={COLORS.cool_silver} stopOpacity="0"/>
              <stop offset="30%" stopColor={COLORS.cool_silver} stopOpacity="0.5"/>
              <stop offset="70%" stopColor={COLORS.cool_silver} stopOpacity="0.5"/>
              <stop offset="100%" stopColor={COLORS.cool_silver} stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="neqRadialS16" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.vibrant_red} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={COLORS.vibrant_red} stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="leftArrowGradS16" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={COLORS.warm_blue} stopOpacity="0.9"/>
            </linearGradient>
          </defs>

          {/* ── Scan lines ── */}
          {SCAN_LINES.map((sl, i) => (
            <line key={i} x1={0} y1={sl.y} x2={1080} y2={sl.y}
              stroke={COLORS.cool_silver} strokeWidth={1}
              opacity={enter * sl.opacity}/>
          ))}

          {/* ── Grid dots ── */}
          {GRID_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r}
              fill={COLORS.cool_silver}
              opacity={enter * (0.04 + Math.sin(frame * 0.03 + d.phase) * 0.015)}/>
          ))}

          {/* ── Floating particles ── */}
          {PARTICLES.map((p, i) => {
            const drift = Math.sin(frame * p.speed + p.phase) * 12;
            return (
              <circle key={i} cx={p.x + drift} cy={p.y} r={p.r}
                fill={p.color}
                opacity={enter * 0.06}/>
            );
          })}

          {/* ── Section label ── */}
          <g opacity={enter}>
            <rect x={60} y={50} width={420} height={52} rx={12}
              fill={COLORS.cool_silver} opacity={0.9}/>
            <text x={270} y={84} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="0.12em">CIRCLE SEPARATES</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={175} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={46} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Model vs Agent
            </text>
            <text x={540} y={230} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
              fill={COLORS.cool_silver}>
              The circle makes the difference
            </text>
          </g>

          {/* ── Divider line ── */}
          <line x1={DIVIDER_X} y1={interpolate(dividerGrow, [0, 1], [NEQ_Y, 320])}
            x2={DIVIDER_X} y2={interpolate(dividerGrow, [0, 1], [NEQ_Y, 1120])}
            stroke="url(#dividerGradS16)" strokeWidth={2}
            strokeDasharray="6 8" opacity={dividerGrow * 0.6}/>

          {/* ── Background pattern lines ── */}
          {BG_LINES_LEFT.map((bl, i) => (
            <line key={`l${i}`} x1={bl.x1} y1={bl.y} x2={bl.x2} y2={bl.y}
              stroke={COLORS.warm_blue} strokeWidth={0.5} opacity={leftEnter * bl.op}/>
          ))}
          {BG_LINES_RIGHT.map((bl, i) => (
            <line key={`r${i}`} x1={bl.x1} y1={bl.y} x2={bl.x2} y2={bl.y}
              stroke={COLORS.electric_cyan} strokeWidth={0.5} opacity={rightEnter * bl.op}/>
          ))}

          {/* ── Decorative symbols ── */}
          {DECO_SYMBOLS.map((ds, i) => (
            <text key={i} x={ds.x} y={ds.y} textAnchor="middle"
              fontFamily="'Courier New', monospace" fontSize={18} fontWeight={600}
              fill={ds.color} opacity={enter * 0.12}>
              {ds.text}
            </text>
          ))}

          {/* ─── LEFT SIDE: MODEL ─── */}
          <g opacity={leftEnter} transform={`translate(${labelSlideL}, 0)`}>
            {/* Model label badge */}
            <rect x={CX_LEFT - 90} y={430} width={180} height={48} rx={24}
              fill={COLORS.warm_blue} opacity={0.12}
              stroke={COLORS.warm_blue} strokeWidth={1.5}/>
            <text x={CX_LEFT} y={462} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill={COLORS.warm_blue} letterSpacing="0.15em">
              MODEL
            </text>

            {/* ProcessorUnit */}
            <ProcessorUnit cx={CX_LEFT} cy={MAIN_Y} size={65}
              opacity={leftEnter} scale={scaleAnim(frame, 15, 20, 0.5, 1)}
              variant="dormant" label="LLM" frame={frame}/>

            {/* Linear arrow (straight line) */}
            <line x1={CX_LEFT - 110} y1={MAIN_Y}
              x2={CX_LEFT + 110} y2={MAIN_Y}
              stroke="url(#leftArrowGradS16)" strokeWidth={3}
              strokeLinecap="round" opacity={leftEnter * 0.6}/>
            <polygon
              points={`${CX_LEFT + 108},${MAIN_Y - 7} ${CX_LEFT + 122},${MAIN_Y} ${CX_LEFT + 108},${MAIN_Y + 7}`}
              fill={COLORS.warm_blue} opacity={leftEnter * 0.7}/>

            {/* Linear data dots */}
            {LINEAR_DOTS.map((ld, i) => {
              const dotP = interpolate(frame, [ld.delay, ld.delay + 20], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <circle key={i} cx={ld.x + dotP * 180} cy={ld.y} r={ld.size}
                  fill={COLORS.warm_blue} opacity={Math.sin(dotP * Math.PI) * 0.5}/>
              );
            })}

            {/* Stat badges */}
            {MODEL_STATS.map((s, i) => {
              const sEnter = interpolate(frame, [38 + i * 6, 52 + i * 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={i} opacity={sEnter}>
                  <rect x={s.x - 80} y={s.y - 18} width={160} height={36} rx={18}
                    fill="#FFFFFF" stroke={COLORS.warm_blue} strokeWidth={1}
                    filter="url(#modelBoxS16)"/>
                  <text x={s.x - 40} y={s.y + 5} textAnchor="middle"
                    fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
                    fill={COLORS.warm_blue}>{s.icon}</text>
                  <text x={s.x + 20} y={s.y + 5} textAnchor="middle"
                    fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={700}
                    fill={COLORS.cool_silver} letterSpacing="0.06em">{s.label}</text>
                </g>
              );
            })}
          </g>

          {/* ─── RIGHT SIDE: AGENT ─── */}
          <g opacity={rightEnter} transform={`translate(${labelSlideR}, 0)`}>
            {/* Agent label badge */}
            <rect x={CX_RIGHT - 90} y={430} width={180} height={48} rx={24}
              fill={COLORS.electric_cyan} opacity={0.12}
              stroke={COLORS.electric_cyan} strokeWidth={1.5}/>
            <text x={CX_RIGHT} y={462} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill={COLORS.electric_cyan} letterSpacing="0.15em">
              AGENT
            </text>

            {/* Pulse rings */}
            {PULSE_RINGS.map((pr, i) => {
              const rEnter = interpolate(frame, [pr.delay + 22, pr.delay + 40], [0, 1], { extrapolateRight: 'clamp' });
              const pulse = Math.sin(frame * 0.06 + i) * 0.15;
              return (
                <circle key={i} cx={CX_RIGHT} cy={MAIN_Y}
                  r={pr.r * rEnter} fill="none"
                  stroke={COLORS.electric_cyan} strokeWidth={pr.width}
                  opacity={rightEnter * (0.06 + pulse)}/>
              );
            })}

            {/* LoopArrow (the circle) */}
            <LoopArrow cx={CX_RIGHT} cy={MAIN_Y} r={95}
              color={COLORS.electric_cyan} strokeWidth={3.5}
              dashOffset={loopDash} opacity={rightEnter}
              showArrow={frame > 35}/>

            {/* Orbital dots */}
            {ORBIT_DOTS.map((od, i) => {
              const oEnter = interpolate(frame, [od.delay, od.delay + 15], [0, 1], { extrapolateRight: 'clamp' });
              const a = od.angle + frame * 0.025;
              const ox = CX_RIGHT + Math.cos(a) * od.r;
              const oy = MAIN_Y + Math.sin(a) * od.r;
              return (
                <circle key={i} cx={ox} cy={oy} r={od.size * oEnter}
                  fill={od.color} opacity={oEnter * 0.65}/>
              );
            })}

            {/* Stat badges */}
            {AGENT_STATS.map((s, i) => {
              const sEnter = interpolate(frame, [42 + i * 6, 56 + i * 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
              return (
                <g key={i} opacity={sEnter}>
                  <rect x={s.x - 80} y={s.y - 18} width={160} height={36} rx={18}
                    fill="#FFFFFF" stroke={COLORS.electric_cyan} strokeWidth={1}
                    filter="url(#agentBoxS16)"/>
                  <text x={s.x - 40} y={s.y + 5} textAnchor="middle"
                    fontFamily="'Courier New', monospace" fontSize={16} fontWeight={700}
                    fill={COLORS.electric_cyan}>{s.icon}</text>
                  <text x={s.x + 20} y={s.y + 5} textAnchor="middle"
                    fontFamily="'Inter', sans-serif" fontSize={13} fontWeight={700}
                    fill={COLORS.cool_silver} letterSpacing="0.06em">{s.label}</text>
                </g>
              );
            })}
          </g>

          {/* ─── ≠ SYMBOL ─── */}
          <g opacity={neqEnter}
            transform={`translate(${DIVIDER_X}, ${NEQ_Y}) scale(${neqScale})`}>
            {/* Radial glow background */}
            <circle cx={0} cy={0} r={55} fill="url(#neqRadialS16)"/>
            {/* Circle behind ≠ */}
            <circle cx={0} cy={0} r={38}
              fill="#FFFFFF" stroke={COLORS.vibrant_red} strokeWidth={2.5}
              filter="url(#neqGlowS16)"
              opacity={0.9 + Math.sin(neqPulse * Math.PI * 4) * 0.1}/>
            {/* ≠ text */}
            <text x={0} y={14} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={900}
              fill={COLORS.vibrant_red}>
              ≠
            </text>
          </g>

          {/* ── Bracket marks along divider ── */}
          {BRACKET_MARKS.map((bm, i) => (
            <rect key={i} x={bm.x} y={bm.y} width={bm.w} height={bm.h}
              fill={COLORS.cool_silver} opacity={dividerGrow * 0.08} rx={1}/>
          ))}

          {/* ── Comparison attributes ── */}
          {ATTRIBUTES.map((attr, i) => {
            const aEnter = interpolate(frame, [44 + i * 6, 60 + i * 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={attr.label} opacity={aEnter * attrsEnter}>
                {/* Label */}
                <text x={DIVIDER_X} y={attr.y} textAnchor="middle"
                  fontFamily="'Courier New', monospace" fontSize={14} fontWeight={700}
                  fill={COLORS.cool_silver} letterSpacing="0.08em" opacity={0.5}>
                  {attr.label}
                </text>
                {/* Model value */}
                <text x={CX_LEFT} y={attr.y} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
                  fill={COLORS.warm_blue}>
                  {attr.modelVal}
                </text>
                {/* Agent value */}
                <text x={CX_RIGHT} y={attr.y} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={700}
                  fill={COLORS.electric_cyan}>
                  {attr.agentVal}
                </text>
                {/* Underlines */}
                <line x1={CX_LEFT - 50} y1={attr.y + 8} x2={CX_LEFT + 50} y2={attr.y + 8}
                  stroke={COLORS.warm_blue} strokeWidth={1} opacity={0.15}/>
                <line x1={CX_RIGHT - 50} y1={attr.y + 8} x2={CX_RIGHT + 50} y2={attr.y + 8}
                  stroke={COLORS.electric_cyan} strokeWidth={1} opacity={0.15}/>
              </g>
            );
          })}

          {/* ── Bottom insight card ── */}
          <g opacity={bottomEnter}>
            <rect x={80} y={1100} width={920} height={130} rx={16}
              fill="#FFFFFF" stroke={COLORS.vibrant_red} strokeWidth={1.5}
              opacity={0.92} filter="url(#modelBoxS16)"/>
            <rect x={80} y={1100} width={6} height={130} rx={3}
              fill={COLORS.vibrant_red}/>
            <text x={130} y={1150} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={25} fontWeight={700}
              fill={COLORS.deep_black}>
              The loop is the fundamental difference.
            </text>
            <text x={130} y={1190} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
              fill={COLORS.light_gray}>
              Without it, you have a tool. With it, you have an agent.
            </text>
          </g>

          {/* ── Footer code ── */}
          <text x={540} y={1290} textAnchor="middle"
            fontFamily="'Courier New', monospace" fontSize={14} fontWeight={600}
            fill={COLORS.cool_silver} opacity={enter * 0.2}
            letterSpacing="0.05em">
            agent = model + loop // that's the difference
          </text>
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="That circle is what separates a model from an agent."
          opacity={captionEnter}
          highlightWords={['circle', 'separates', 'model', 'agent']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
