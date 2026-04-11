/**
 * Scene 06 — Perceive, Think, Act, Observe
 * "Perceive, think, act, observe, then repeat."
 * Four large step cards appearing sequentially with icons, colors, labels.
 * Circular arrow connecting them at the end, "REPEAT" label.
 * Duration: 113 frames (3.77s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, LoopArrow,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Step definitions ───────────────────────────────────────────────────────
const STEPS = [
  {
    label: 'PERCEIVE',
    color: '#3B82F6',
    desc: 'Take in the world',
    icon: 'eye',
    entryStart: 5,
  },
  {
    label: 'THINK',
    color: '#A78BFA',
    desc: 'Reason & decide',
    icon: 'brain',
    entryStart: 20,
  },
  {
    label: 'ACT',
    color: '#22C55E',
    desc: 'Execute action',
    icon: 'bolt',
    entryStart: 35,
  },
  {
    label: 'OBSERVE',
    color: '#F59E0B',
    desc: 'Receive result',
    icon: 'radar',
    entryStart: 50,
  },
];

// ── Card positions on the 1080x1920 canvas ─────────────────────────────────
const CARD_POSITIONS = [
  { cx: 300, cy: 440 },   // Top-left
  { cx: 780, cy: 440 },   // Top-right
  { cx: 300, cy: 840 },   // Bottom-left
  { cx: 780, cy: 840 },   // Bottom-right
];

// ── Connecting line pairs (from → to) ──────────────────────────────────────
const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 3 },
  { from: 3, to: 2 },
  { from: 2, to: 0 },
];

// ── Ambient particles ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 173.7 + 50) % 1080,
  y: (i * 229.3 + 100) % 1920,
  r: 1.2 + (i % 4) * 0.6,
  speed: 0.15 + (i % 5) * 0.08,
  phase: i * 0.7,
  color: STEPS[i % 4].color,
}));

// ── Decorative circuit traces ──────────────────────────────────────────────
const CIRCUIT_LINES = Array.from({ length: 12 }, (_, i) => ({
  x1: (i * 97) % 1080,
  y1: 200 + (i * 143) % 900,
  length: 60 + (i % 4) * 30,
  vertical: i % 3 === 0,
  color: STEPS[i % 4].color,
}));

// ── Icon SVG builders ──────────────────────────────────────────────────────
const EyeIcon: React.FC<{ cx: number; cy: number; scale: number; color: string; opacity: number; frame: number }> = ({ cx, cy, scale, color, opacity, frame }) => {
  const pupilX = Math.sin(frame * 0.08) * 4;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      <ellipse cx={0} cy={0} rx={36} ry={22} fill="none" stroke={color} strokeWidth={3.5} />
      <circle cx={pupilX} cy={0} r={10} fill={color} />
      <circle cx={pupilX - 2} cy={-3} r={3} fill="white" opacity={0.8} />
      <path d={`M -36 0 Q -20 -18, 0 -22 Q 20 -18, 36 0`} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
      <path d={`M -36 0 Q -20 18, 0 22 Q 20 18, 36 0`} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
    </g>
  );
};

const BrainIcon: React.FC<{ cx: number; cy: number; scale: number; color: string; opacity: number; frame: number }> = ({ cx, cy, scale, color, opacity, frame }) => {
  const pulse = 1 + Math.sin(frame * 0.12) * 0.04;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale * pulse})`} opacity={opacity}>
      <path d="M -5 20 Q -25 18, -28 2 Q -32 -14, -18 -22 Q -10 -30, 0 -26 Q 10 -30, 18 -22 Q 32 -14, 28 2 Q 25 18, 5 20 Z"
        fill="none" stroke={color} strokeWidth={3} />
      <path d="M 0 -26 L 0 20" fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      <path d="M -18 -8 Q -6 -2, -4 8" fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      <path d="M 18 -8 Q 6 -2, 4 8" fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      {[0, 1, 2].map(i => (
        <circle key={i} cx={-12 + i * 12} cy={-10 + i * 6} r={2.5} fill={color} opacity={0.7} />
      ))}
    </g>
  );
};

const BoltIcon: React.FC<{ cx: number; cy: number; scale: number; color: string; opacity: number; frame: number }> = ({ cx, cy, scale, color, opacity, frame }) => {
  const flash = 0.7 + Math.sin(frame * 0.15) * 0.3;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      <polygon points="-4,-28 14,-4 2,-4 6,28 -14,2 -2,2" fill={color} opacity={flash} />
      <polygon points="-4,-28 14,-4 2,-4 6,28 -14,2 -2,2" fill="none" stroke={color} strokeWidth={2} />
      {[0, 1, 2, 3].map(i => {
        const angle = (i * 90 + frame * 3) * Math.PI / 180;
        const dist = 32 + Math.sin(frame * 0.1 + i) * 4;
        return <circle key={i} cx={Math.cos(angle) * dist} cy={Math.sin(angle) * dist}
          r={2} fill={color} opacity={0.5} />;
      })}
    </g>
  );
};

const RadarIcon: React.FC<{ cx: number; cy: number; scale: number; color: string; opacity: number; frame: number }> = ({ cx, cy, scale, color, opacity, frame }) => {
  const sweep = (frame * 4) % 360;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      {[16, 24, 32].map((r, i) => (
        <circle key={i} cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth={1.5} opacity={0.3 + i * 0.1} />
      ))}
      <line x1={0} y1={0}
        x2={Math.cos(sweep * Math.PI / 180) * 32}
        y2={Math.sin(sweep * Math.PI / 180) * 32}
        stroke={color} strokeWidth={2.5} opacity={0.9} />
      <circle cx={0} cy={0} r={4} fill={color} />
      <circle cx={0} cy={0} r={6} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
    </g>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.FC<any>> = {
  eye: EyeIcon,
  brain: BrainIcon,
  bolt: BoltIcon,
  radar: RadarIcon,
};

// ── Main component ─────────────────────────────────────────────────────────
export const Scene06_PerceiveThinkActObserve: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global animation drivers ─────────────────────────────────────────────
  const globalEnter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleEnter = interpolate(frame, [2, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const titleSlide = interpolate(frame, [2, 22], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const connectEnter = interpolate(frame, [62, 85], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const repeatEnter = interpolate(frame, [78, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const repeatScale = scaleAnim(frame, 78, 22, 0.4, 1);
  const captionEnter = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const loopDash = interpolate(frame, [68, 100], [400, 0], { extrapolateRight: 'clamp' });

  // ── Per-card animations ──────────────────────────────────────────────────
  const cardAnims = STEPS.map((step, i) => {
    const s = step.entryStart;
    const opacity = interpolate(frame, [s, s + 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
    const scale = scaleAnim(frame, s, 16, 0.5, 1);
    const slideY = interpolate(frame, [s, s + 16], [30, 0], { extrapolateRight: 'clamp', easing: ease });
    const glowPulse = 0.15 + Math.sin(frame * 0.08 + i * 1.5) * 0.08;
    return { opacity, scale, slideY, glowPulse };
  });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs />
          <CornerBrackets opacity={0.2} />

          {/* ── Extra defs ── */}
          <defs>
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <filter id={`cardGlow${i}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feFlood floodColor={step.color} floodOpacity="0.35" result="c" />
                  <feComposite in="c" in2="blur" operator="in" result="gc" />
                  <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id={`cardGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={step.color} stopOpacity="0.12" />
                  <stop offset="100%" stopColor={step.color} stopOpacity="0.03" />
                </linearGradient>
              </React.Fragment>
            ))}
            <filter id="repeatGlow06" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.5" result="c" />
              <feComposite in="c" in2="blur" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Ambient particles ── */}
          {PARTICLES.map((p, i) => {
            const yOff = (frame * p.speed + p.phase * 50) % 1920;
            return (
              <circle key={i} cx={p.x} cy={(p.y + yOff) % 1920} r={p.r}
                fill={p.color}
                opacity={globalEnter * (0.06 + Math.sin(frame * 0.04 + p.phase) * 0.03)} />
            );
          })}

          {/* ── Circuit traces ── */}
          {CIRCUIT_LINES.map((cl, i) => {
            const drawLen = interpolate(frame, [i * 3, i * 3 + 20], [0, cl.length], { extrapolateRight: 'clamp' });
            return (
              <line key={i}
                x1={cl.x1} y1={cl.y1}
                x2={cl.vertical ? cl.x1 : cl.x1 + drawLen}
                y2={cl.vertical ? cl.y1 + drawLen : cl.y1}
                stroke={cl.color} strokeWidth={1} opacity={globalEnter * 0.08}
                strokeLinecap="round" />
            );
          })}

          {/* ── Section label ── */}
          <g opacity={globalEnter}>
            <rect x={80} y={60} width={340} height={52} rx={12}
              fill={COLORS.warm_blue} opacity={0.9} />
            <text x={250} y={94} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={900}
              fill="white" letterSpacing="0.10em">THE FOUR STEPS</text>
          </g>

          {/* ── Title ── */}
          <g opacity={titleEnter} transform={`translate(0, ${titleSlide})`}>
            <text x={540} y={195} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Perceive → Think
            </text>
            <text x={540} y={260} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={900}
              fill={COLORS.deep_black} letterSpacing="-0.02em">
              Act → Observe
            </text>
          </g>

          {/* ── Divider ── */}
          <line x1={200} y1={310} x2={880} y2={310}
            stroke={COLORS.warm_blue} strokeWidth={1.5} opacity={titleEnter * 0.2} />

          {/* ── Four step cards ── */}
          {STEPS.map((step, i) => {
            const pos = CARD_POSITIONS[i];
            const anim = cardAnims[i];
            const IconComp = ICON_MAP[step.icon];
            const cardW = 360;
            const cardH = 300;
            return (
              <g key={step.label}
                opacity={anim.opacity}
                transform={`translate(${pos.cx}, ${pos.cy + anim.slideY}) scale(${anim.scale})`}>

                {/* Card glow background */}
                <rect x={-cardW / 2} y={-cardH / 2} width={cardW} height={cardH} rx={24}
                  fill={step.color} opacity={anim.glowPulse}
                  filter={`url(#cardGlow${i})`} />

                {/* Card body */}
                <rect x={-cardW / 2} y={-cardH / 2} width={cardW} height={cardH} rx={24}
                  fill="#FAFAFA" stroke={step.color} strokeWidth={3}
                  filter="url(#shadow)" />

                {/* Color accent bar */}
                <rect x={-cardW / 2} y={-cardH / 2} width={cardW} height={8} rx={4}
                  fill={step.color} />

                {/* Step number */}
                <text x={-cardW / 2 + 24} y={-cardH / 2 + 50} textAnchor="start"
                  fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={900}
                  fill={step.color} opacity={0.15}>
                  {`0${i + 1}`}
                </text>

                {/* Icon */}
                <IconComp cx={0} cy={-20} scale={1.6} color={step.color}
                  opacity={1} frame={frame} />

                {/* Label */}
                <text x={0} y={80} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
                  fill={step.color} letterSpacing="0.12em">
                  {step.label}
                </text>

                {/* Description */}
                <text x={0} y={115} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={500}
                  fill={COLORS.light_gray}>
                  {step.desc}
                </text>

                {/* Corner dots */}
                {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], j) => (
                  <circle key={j}
                    cx={dx * (cardW / 2 - 16)} cy={dy * (cardH / 2 - 16)}
                    r={3} fill={step.color} opacity={0.3} />
                ))}
              </g>
            );
          })}

          {/* ── Connecting arrows between cards ── */}
          {CONNECTIONS.map((conn, i) => {
            const from = CARD_POSITIONS[conn.from];
            const to = CARD_POSITIONS[conn.to];
            const lineOp = interpolate(frame, [65 + i * 5, 80 + i * 5], [0, 1], { extrapolateRight: 'clamp' });
            const midX = (from.cx + to.cx) / 2;
            const midY = (from.cy + to.cy) / 2;
            return (
              <g key={i} opacity={connectEnter * lineOp}>
                <line x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                  stroke={STEPS[conn.from].color} strokeWidth={2.5}
                  strokeDasharray="8 4" opacity={0.5} />
                {/* Arrow dot at midpoint */}
                <circle cx={midX} cy={midY} r={5}
                  fill={STEPS[conn.from].color} opacity={0.7} />
              </g>
            );
          })}

          {/* ── Central loop arrow (REPEAT) ── */}
          <g opacity={repeatEnter}
            transform={`translate(540, 640) scale(${repeatScale})`}>
            <LoopArrow cx={0} cy={0} r={50}
              color={COLORS.electric_cyan} strokeWidth={4}
              dashOffset={loopDash} opacity={repeatEnter}
              showArrow={true} label="" />
          </g>

          {/* ── "REPEAT" badge ── */}
          <g opacity={repeatEnter} transform={`translate(540, 640) scale(${repeatScale})`}>
            <rect x={-60} y={-18} width={120} height={36} rx={18}
              fill={COLORS.electric_cyan} opacity={0.9}
              filter="url(#repeatGlow06)" />
            <text x={0} y={6} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={900}
              fill="white" letterSpacing="0.14em">
              REPEAT
            </text>
          </g>

          {/* ── Bottom insight section ── */}
          <g opacity={repeatEnter}>
            <rect x={120} y={1100} width={840} height={140} rx={18}
              fill="#F9FAFB" stroke={COLORS.warm_blue} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.9} />
            <rect x={120} y={1100} width={6} height={140} rx={3}
              fill={COLORS.electric_cyan} />
            <text x={170} y={1152} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={700}
              fill={COLORS.deep_black}>
              Four steps. One cycle. Infinite loops.
            </text>
            <text x={170} y={1195} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500}
              fill={COLORS.light_gray}>
              This is the foundation of every agentic system.
            </text>
          </g>

          {/* ── Step color legend ── */}
          {STEPS.map((step, i) => {
            const lx = 140 + i * 210;
            const ly = 1310;
            return (
              <g key={i} opacity={repeatEnter * 0.8}>
                <circle cx={lx} cy={ly} r={8} fill={step.color} />
                <text x={lx + 16} y={ly + 5} textAnchor="start"
                  fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={700}
                  fill={step.color} letterSpacing="0.05em">
                  {step.label}
                </text>
              </g>
            );
          })}

          {/* ── Decorative dashes ── */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i}
              x1={80 + i * 180} y1={1380}
              x2={120 + i * 180} y2={1380}
              stroke={STEPS[i % 4].color} strokeWidth={2}
              opacity={globalEnter * 0.15} strokeLinecap="round" />
          ))}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="Perceive, think, act, observe, then repeat."
          opacity={captionEnter}
          highlightWords={['Perceive', 'think', 'act', 'observe', 'repeat']} />
      </PaperBackground>
    </AbsoluteFill>
  );
};
