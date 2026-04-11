/**
 * Scene 05 — Four Steps
 * "It has four steps."
 * Large "4" number reveal, four colored circles previewing the steps.
 * Short punchy scene with premium animation.
 * Duration: 33 frames (1.1s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── The four steps ─────────────────────────────────────────────────────────
const FOUR_STEPS = [
  { label: 'PERCEIVE', color: '#22C55E', icon: '👁',  desc: 'Take in information' },
  { label: 'THINK',    color: '#3B82F6', icon: '🧠', desc: 'Reason about action' },
  { label: 'ACT',      color: '#F59E0B', icon: '⚡', desc: 'Execute & produce' },
  { label: 'OBSERVE',  color: '#A78BFA', icon: '🔍', desc: 'Receive the result' },
];

// ── Background grid nodes ──────────────────────────────────────────────────
const GRID_NODES = Array.from({ length: 48 }, (_, i) => ({
  x: 60 + (i % 8) * 132,
  y: 60 + Math.floor(i / 8) * 320,
  size: 2 + (i % 3),
}));

// ── Radial burst lines from center ─────────────────────────────────────────
const BURST_LINES = Array.from({ length: 24 }, (_, i) => ({
  angle: (i * 360) / 24,
  len: 200 + (i % 3) * 60,
}));

export const Scene05_FourSteps: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Animation drivers (everything fast for 33-frame scene) ───────────────
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const numberScale = scaleAnim(frame, 0, 14, 0.3, 1);
  const numberOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const burstEnter = interpolate(frame, [3, 16], [0, 1], { extrapolateRight: 'clamp' });
  const burstFade = interpolate(frame, [14, 28], [1, 0], { extrapolateRight: 'clamp' });
  const captionEnter = interpolate(frame, [2, 12], [0, 1], { extrapolateRight: 'clamp' });
  const labelEnter = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const pulse = 0.9 + Math.sin(frame * 0.2) * 0.1;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.2}/>

          {/* ── Additional defs ── */}
          <defs>
            <filter id="numberGlowS05" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="20" result="blur"/>
              <feFlood floodColor="#3B82F6" floodOpacity="0.35" result="c"/>
              <feComposite in="c" in2="blur" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="stepGlowS05" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="numberAuraS05" cx="50%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* ── Background grid dots ── */}
          {GRID_NODES.map((n, i) => (
            <circle key={`gn${i}`}
              cx={n.x} cy={n.y} r={n.size}
              fill={COLORS.electric_cyan}
              opacity={enter * 0.025}/>
          ))}

          {/* ── Radial burst from center ── */}
          {BURST_LINES.map((b, i) => {
            const rad = (b.angle * Math.PI) / 180;
            const x2 = 540 + Math.cos(rad) * b.len * burstEnter;
            const y2 = 680 + Math.sin(rad) * b.len * burstEnter;
            return (
              <line key={`bl${i}`}
                x1={540} y1={680}
                x2={x2} y2={y2}
                stroke={COLORS.warm_blue} strokeWidth={1.5}
                opacity={burstEnter * burstFade * 0.12}
                strokeLinecap="round"/>
            );
          })}

          {/* ── Large ambient glow behind number ── */}
          <circle cx={540} cy={680} r={280}
            fill="url(#numberAuraS05)" opacity={numberOpacity}/>

          {/* ── Large "4" number ── */}
          <g transform={`translate(540, 680) scale(${numberScale})`}>
            {/* Shadow "4" */}
            <text x={4} y={8} textAnchor="middle" dominantBaseline="central"
              fontFamily="'Inter', sans-serif" fontSize={420} fontWeight={900}
              fill={COLORS.deep_black} opacity={0.06}>
              4
            </text>
            {/* Main "4" */}
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
              fontFamily="'Inter', sans-serif" fontSize={420} fontWeight={900}
              fill={COLORS.warm_blue} opacity={numberOpacity}
              filter="url(#numberGlowS05)">
              4
            </text>
          </g>

          {/* ── "STEPS" label below number ── */}
          <text x={540} y={940} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={52} fontWeight={800}
            fill={COLORS.deep_black} opacity={labelEnter}
            letterSpacing="0.20em">
            STEPS
          </text>

          {/* ── Horizontal accent line ── */}
          <line x1={320} y1={990} x2={760} y2={990}
            stroke={COLORS.warm_blue} strokeWidth={2} opacity={labelEnter * 0.25}/>

          {/* ── Four colored step circles ── */}
          {FOUR_STEPS.map((step, i) => {
            const circEnter = interpolate(frame, [6 + i * 3, 18 + i * 3], [0, 1], { extrapolateRight: 'clamp', easing: ease });
            const circScale = scaleAnim(frame, 6 + i * 3, 18 + i * 3, 0.4, 1);
            const cx = 160 + i * 260;
            const cy = 1140;
            return (
              <g key={step.label} opacity={circEnter}
                transform={`translate(${cx}, ${cy}) scale(${circScale})`}>
                {/* Outer glow ring */}
                <circle cx={0} cy={0} r={82 * pulse}
                  fill="none" stroke={step.color} strokeWidth={2.5}
                  opacity={0.2} filter="url(#stepGlowS05)"/>
                {/* Filled circle */}
                <circle cx={0} cy={0} r={64}
                  fill="white" stroke={step.color} strokeWidth={4}
                  filter="url(#shadow)"/>
                {/* Inner ring */}
                <circle cx={0} cy={0} r={56}
                  fill="none" stroke={step.color} strokeWidth={1} opacity={0.25}/>
                {/* Step number */}
                <text x={0} y={-10} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={900}
                  fill={step.color}>
                  {i + 1}
                </text>
                {/* Step label below circle */}
                <text x={0} y={100} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={800}
                  fill={step.color} letterSpacing="0.06em">
                  {step.label}
                </text>
                {/* Description below label */}
                <text x={0} y={130} textAnchor="middle"
                  fontFamily="'Inter', sans-serif" fontSize={14} fontWeight={500}
                  fill={COLORS.light_gray}>
                  {step.desc}
                </text>
              </g>
            );
          })}

          {/* ── Connecting line through step circles ── */}
          {[0, 1, 2].map(i => {
            const x1 = 160 + i * 260 + 68;
            const x2 = 160 + (i + 1) * 260 - 68;
            const lineEnter = interpolate(frame, [10 + i * 3, 22 + i * 3], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`conn${i}`} opacity={lineEnter}>
                <line x1={x1} y1={1140} x2={x2} y2={1140}
                  stroke={COLORS.light_gray} strokeWidth={2}
                  strokeDasharray="6 4" opacity={0.35}/>
                {/* Arrow */}
                <polygon
                  points={`${x2},${1140} ${x2 - 10},${1134} ${x2 - 10},${1146}`}
                  fill={COLORS.light_gray} opacity={0.4}/>
              </g>
            );
          })}

          {/* ── Curved return arrow from OBSERVE back to PERCEIVE ── */}
          <path d={`M ${160 + 3 * 260},${1200} Q 540,1380 160,1200`}
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={2}
            strokeDasharray="8 6" opacity={labelEnter * 0.3}/>
          <polygon points="160,1200 170,1190 175,1206"
            fill={COLORS.electric_cyan} opacity={labelEnter * 0.4}/>

          {/* ── "REPEAT" label on return arrow ── */}
          <text x={540} y={1340} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={700}
            fill={COLORS.electric_cyan} opacity={labelEnter * 0.4}
            letterSpacing="0.14em">
            REPEAT ↻
          </text>

          {/* ── Bottom tagline pill ── */}
          <g opacity={labelEnter}>
            <rect x={280} y={1420} width={520} height={60} rx={30}
              fill={COLORS.deep_black} stroke={COLORS.electric_cyan} strokeWidth={1.5}/>
            <text x={540} y={1458} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
              fill={COLORS.electric_cyan} letterSpacing="0.10em">
              PERCEIVE · THINK · ACT · OBSERVE
            </text>
          </g>

          {/* ── Bottom detail card ── */}
          <g opacity={labelEnter}>
            <rect x={100} y={1510} width={880} height={160} rx={18}
              fill="#F9FAFB" stroke={COLORS.warm_blue} strokeWidth={1.5}
              filter="url(#shadow)" opacity={0.85}/>
            <rect x={100} y={1510} width={6} height={160} rx={3}
              fill={COLORS.warm_blue}/>
            <text x={160} y={1558} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={800}
              fill={COLORS.warm_blue} letterSpacing="0.10em">
              THE CYCLE
            </text>
            <text x={160} y={1595} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
              fill={COLORS.deep_black}>
              Each step feeds into the next.
            </text>
            <text x={160} y={1635} textAnchor="start"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
              fill={COLORS.light_gray}>
              The loop never stops.
            </text>
          </g>

          {/* ── Decorative top section label ── */}
          <g opacity={enter}>
            <text x={540} y={360} textAnchor="middle"
              fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
              fill={COLORS.light_gray} letterSpacing="0.12em">
              THE AGENT LOOP HAS
            </text>
          </g>

          {/* ── Ambient decorative hexagons ── */}
          {Array.from({ length: 5 }, (_, i) => {
            const hx = 140 + i * 220;
            const hy = 430;
            const hexSize = 18;
            const hexPoints = Array.from({ length: 6 }, (__, j) => {
              const angle = (Math.PI / 3) * j - Math.PI / 6;
              return `${hx + hexSize * Math.cos(angle)},${hy + hexSize * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon key={`hex${i}`}
                points={hexPoints}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={0.8} opacity={enter * 0.05}/>
            );
          })}

          {/* ── Data flow arrows (decorative, top section) ── */}
          {Array.from({ length: 3 }, (_, i) => {
            const ax = 300 + i * 200;
            const aEnter = interpolate(frame, [4 + i * 3, 14 + i * 3], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={`da${i}`} opacity={aEnter * 0.1}>
                <line x1={ax} y1={400} x2={ax} y2={460}
                  stroke={COLORS.warm_blue} strokeWidth={2} strokeLinecap="round"/>
                <polygon points={`${ax},460 ${ax - 5},450 ${ax + 5},450`}
                  fill={COLORS.warm_blue}/>
              </g>
            );
          })}

          {/* ── Floating circuit traces ── */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`ct${i}`}
              x1={80 + i * 190} y1={0} x2={80 + i * 190} y2={1920}
              stroke={COLORS.electric_cyan} strokeWidth={0.5}
              opacity={enter * 0.025}/>
          ))}

          {/* ── Faint horizontal grid ── */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <line key={`hg${i}`}
              x1={0} y1={400 + i * 200} x2={1080} y2={400 + i * 200}
              stroke={COLORS.electric_cyan} strokeWidth={0.5}
              opacity={enter * 0.02}/>
          ))}
        </svg>

        {/* ── Caption bar ── */}
        <CaptionBar
          text="It has four steps."
          opacity={captionEnter}
          highlightWords={['four steps']}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
