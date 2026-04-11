/**
 * Scene 10 — Reasons Forever
 * "The agent reasons, reasons, reasons, and nothing changes anywhere."
 * Multiple "REASON" bubbles stacking up with no output,
 * infinite loop spinning without effect.
 * Duration: 124 frames (~4.1s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout constants ─────────────────────────────────────────────────────
const CX = 540;
const CY = 680;
const LOOP_R = 190;

// ── Reason bubbles — stacking up with increasing desperation ─────────────
interface ReasonBubble {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  label: string;
  rotation: number;
}

const REASON_BUBBLES: ReasonBubble[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: CX + ((i * 37 + 11) % 360) - 180,
  y: 380 + (i * 28) + ((i * 13) % 40) - 20,
  width: 130 + (i % 4) * 20,
  height: 40 + (i % 3) * 6,
  delay: 5 + i * 7,
  label: ['REASON', 'THINK', 'REASON', 'ANALYZE', 'REASON', 'PONDER', 'REASON',
          'CONSIDER', 'REASON', 'THINK...', 'REASON', 'REASON', 'REASON?', 'REASON!'][i],
  rotation: ((i * 7 + 3) % 11) - 5,
}));

// ── Infinite loop spinner segments ───────────────────────────────────────
const SPINNER_SEGMENTS = 8;
const SPINNER_R = 65;

// ── "Nothing changes" indicators around the border ───────────────────────
interface NothingIndicator {
  x: number;
  y: number;
  label: string;
  delay: number;
}

const NOTHING_INDICATORS: NothingIndicator[] = [
  { x: 160, y: 1100, label: 'NO FILE WRITTEN', delay: 40 },
  { x: 540, y: 1100, label: 'NO API CALLED', delay: 50 },
  { x: 920, y: 1100, label: 'NO MESSAGE SENT', delay: 60 },
  { x: 340, y: 1170, label: 'NO CHANGE', delay: 70 },
  { x: 740, y: 1170, label: 'NOTHING HAPPENS', delay: 80 },
];

// ── Floating dust particles (muted) ──────────────────────────────────────
const DUST = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 173.1 + 50) % 1080,
  y: (i * 229.7 + 80) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.37,
  speed: 0.02 + (i % 5) * 0.006,
}));

// ── Orbit ring dashes ────────────────────────────────────────────────────
const ORBIT_DASH_INNER = '6 10';
const ORBIT_DASH_OUTER = '12 16';

// ── Circular arrow ticks (loop going nowhere) ────────────────────────────
const ARROW_TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { angle, delay: 10 + i * 4 };
});

// ── Stack overflow glow gradient ─────────────────────────────────────────
const STACK_GLOW_LAYERS = Array.from({ length: 5 }, (_, i) => ({
  yOffset: i * 3,
  opacity: 0.08 - i * 0.012,
}));

// ── Warning flashes ─────────────────────────────────────────────────────
const WARNING_FLASHES = Array.from({ length: 6 }, (_, i) => ({
  x: CX + ((i * 67 + 20) % 400) - 200,
  y: 300 + (i * 41) % 250,
  delay: 55 + i * 10,
  size: 18 + (i % 3) * 6,
}));

// ── Dead-end arrows radiating outward ────────────────────────────────────
const DEAD_ARROWS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
  return {
    angle,
    innerR: LOOP_R + 30,
    outerR: LOOP_R + 80,
    delay: 60 + i * 6,
  };
});

// ── Counter digits for "how many times reasoned" ─────────────────────────
const COUNTER_MAX = 99;

export const Scene10_ReasonsForever: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Core animation values ──────────────────────────────────────────────
  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const spinAngle = frame * 3.6; // continuous spin
  const spinnerPulse = 0.4 + Math.sin(frame * 0.12) * 0.15;
  const loopScale = scaleAnim(frame, 2, 22, 0.5, 1);
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

  // ── Counter (reasoning count) ──────────────────────────────────────────
  const counterVal = Math.min(COUNTER_MAX,
    Math.floor(interpolate(frame, [10, 110], [0, COUNTER_MAX], { extrapolateRight: 'clamp' })));

  // ── Frustration intensity grows over time ──────────────────────────────
  const frustration = interpolate(frame, [0, 100], [0, 1], { extrapolateRight: 'clamp' });
  const shakeX = frustration > 0.5 ? Math.sin(frame * 0.8) * frustration * 3 : 0;
  const shakeY = frustration > 0.5 ? Math.cos(frame * 1.1) * frustration * 2 : 0;

  // ── Red tint overlay grows ─────────────────────────────────────────────
  const redTint = interpolate(frame, [60, 120], [0, 0.08], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="reasonGlow10">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feFlood floodColor={COLORS.vibrant_red} floodOpacity="0.25" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="stackGlow10">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="reasonBubbleGrad10" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F3F4F6" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
            <radialGradient id="centerWarn10" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.vibrant_red} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.vibrant_red} stopOpacity="0" />
            </radialGradient>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Frustration red overlay ── */}
          <rect x={0} y={0} width={1080} height={1920}
            fill={COLORS.vibrant_red} opacity={redTint} />

          {/* ── Dust particles ── */}
          {DUST.map((d, i) => {
            const pulse = Math.sin(frame * d.speed + d.phase) * 0.3 + 0.3;
            return (
              <circle key={`dust${i}`} cx={d.x} cy={d.y} r={d.r}
                fill="#9CA3AF" opacity={enter * pulse * 0.04} />
            );
          })}

          {/* ── Section label ── */}
          <SectionLabel x={540} y={180} text="STUCK IN REASONING" fontSize={26}
            color={COLORS.vibrant_red} opacity={enter * 0.8}
            underlineColor={COLORS.vibrant_red} />

          <text x={540} y={228} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={17} fontWeight={500} letterSpacing={3}
            fill="#9CA3AF" opacity={enter * 0.5}>
            Nothing changes anywhere
          </text>

          {/* ── Reasoning counter ── */}
          <g opacity={interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })}
            transform={`translate(${540}, ${290})`}>
            <rect x={-80} y={-28} width={160} height={56} rx={12}
              fill="#1F2937" stroke={COLORS.vibrant_red} strokeWidth={1.5}
              opacity={0.85} />
            <text x={0} y={8} textAnchor="middle"
              fontFamily="SF Mono, Menlo, monospace"
              fontSize={28} fontWeight={700} letterSpacing={2}
              fill={COLORS.vibrant_red} opacity={0.9}>
              ×{counterVal}
            </text>
            <text x={0} y={-14} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={10} fontWeight={600} letterSpacing={2}
              fill="#9CA3AF" opacity={0.6}>
              REASONING CYCLES
            </text>
          </g>

          {/* ── Main loop area with shake ── */}
          <g transform={`translate(${shakeX}, ${shakeY})`}>

            {/* ── Infinite loop spinner (center) ── */}
            <g transform={`translate(${CX}, ${CY}) scale(${loopScale})`}>
              {/* Warning glow behind spinner */}
              <circle cx={0} cy={0} r={SPINNER_R + 30}
                fill="url(#centerWarn10)" opacity={frustration * 0.6} />

              {/* Outer orbit ring */}
              <circle cx={0} cy={0} r={LOOP_R}
                fill="none" stroke="#6B7280" strokeWidth={1.2}
                strokeDasharray={ORBIT_DASH_OUTER} opacity={0.15} />
              <circle cx={0} cy={0} r={LOOP_R - 35}
                fill="none" stroke="#6B7280" strokeWidth={0.8}
                strokeDasharray={ORBIT_DASH_INNER} opacity={0.08} />

              {/* Spinner segments */}
              {Array.from({ length: SPINNER_SEGMENTS }, (_, i) => {
                const segAngle = (i / SPINNER_SEGMENTS) * 360 + spinAngle;
                const rad = (segAngle * Math.PI) / 180;
                const x1 = Math.cos(rad) * (SPINNER_R - 20);
                const y1 = Math.sin(rad) * (SPINNER_R - 20);
                const x2 = Math.cos(rad) * SPINNER_R;
                const y2 = Math.sin(rad) * SPINNER_R;
                const segOp = 0.2 + (i / SPINNER_SEGMENTS) * 0.6;
                return (
                  <line key={`seg${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={COLORS.vibrant_red} strokeWidth={3}
                    strokeLinecap="round" opacity={segOp * spinnerPulse}
                    filter="url(#reasonGlow10)" />
                );
              })}

              {/* Center infinity symbol */}
              <g transform={`rotate(${spinAngle * 0.3})`} opacity={0.7}>
                <path d={`M-18,0 C-18,-18 0,-18 0,0 C0,18 18,18 18,0 C18,-18 0,-18 0,0 C0,18 -18,18 -18,0`}
                  fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
                  strokeLinecap="round" />
              </g>

              {/* Circular arrow ticks */}
              {ARROW_TICKS.map((at, i) => {
                const atOp = interpolate(frame, [at.delay, at.delay + 10], [0, 0.25], { extrapolateRight: 'clamp' });
                const r = LOOP_R - 10;
                const cx = Math.cos(at.angle + (spinAngle * Math.PI) / 180 * 0.1) * r;
                const cy = Math.sin(at.angle + (spinAngle * Math.PI) / 180 * 0.1) * r;
                return (
                  <circle key={`at${i}`} cx={cx} cy={cy} r={3}
                    fill="#9CA3AF" opacity={atOp} />
                );
              })}

              {/* Loop label */}
              <text y={SPINNER_R + 30} textAnchor="middle"
                fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                fontSize={14} fontWeight={600} letterSpacing={3}
                fill={COLORS.vibrant_red} opacity={spinnerPulse * 0.6}>
                ∞ LOOP
              </text>
            </g>

            {/* ── Reason bubbles stacking ── */}
            {REASON_BUBBLES.map((rb) => {
              const rbEnter = interpolate(frame, [rb.delay, rb.delay + 12], [0, 1],
                { extrapolateRight: 'clamp', easing: ease });
              const rbY = rb.y - rbEnter * 8;
              const rbOp = interpolate(frame,
                [rb.delay, rb.delay + 8, rb.delay + 60, rb.delay + 70],
                [0, 0.75, 0.75, 0.3], { extrapolateRight: 'clamp' });
              const rbScale = 0.7 + rbEnter * 0.3;
              return (
                <g key={`rb${rb.id}`}
                  transform={`translate(${rb.x}, ${rbY}) rotate(${rb.rotation}) scale(${rbScale})`}
                  opacity={rbOp}>
                  <rect x={-rb.width / 2} y={-rb.height / 2}
                    width={rb.width} height={rb.height} rx={rb.height / 2}
                    fill="url(#reasonBubbleGrad10)" stroke="#D1D5DB"
                    strokeWidth={1} filter="url(#stackGlow10)" />
                  <text x={0} y={5} textAnchor="middle"
                    fontFamily="SF Mono, Menlo, monospace"
                    fontSize={13} fontWeight={600} letterSpacing={2}
                    fill="#6B7280">
                    {rb.label}
                  </text>
                </g>
              );
            })}

            {/* ── Stack overflow glow layers ── */}
            {STACK_GLOW_LAYERS.map((sg, i) => (
              <rect key={`sg${i}`} x={180} y={350 + sg.yOffset}
                width={720} height={REASON_BUBBLES.length * 28 + 80}
                rx={16} fill={COLORS.vibrant_red} opacity={sg.opacity * frustration} />
            ))}

            {/* ── Dead-end arrows ── */}
            {DEAD_ARROWS.map((da, i) => {
              const daOp = interpolate(frame, [da.delay, da.delay + 15], [0, 0.2], { extrapolateRight: 'clamp' });
              const x1 = CX + Math.cos(da.angle) * da.innerR;
              const y1 = CY + Math.sin(da.angle) * da.innerR;
              const x2 = CX + Math.cos(da.angle) * da.outerR;
              const y2 = CY + Math.sin(da.angle) * da.outerR;
              return (
                <g key={`da${i}`} opacity={daOp}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="5 5" />
                  <g transform={`translate(${x2}, ${y2})`}>
                    <line x1={-7} y1={-7} x2={7} y2={7}
                      stroke={COLORS.vibrant_red} strokeWidth={2.5} opacity={0.5}
                      strokeLinecap="round" />
                    <line x1={7} y1={-7} x2={-7} y2={7}
                      stroke={COLORS.vibrant_red} strokeWidth={2.5} opacity={0.5}
                      strokeLinecap="round" />
                  </g>
                </g>
              );
            })}
          </g>

          {/* ── "Nothing changes" indicators ── */}
          {NOTHING_INDICATORS.map((ni, i) => {
            const niOp = interpolate(frame, [ni.delay, ni.delay + 15], [0, 1], { extrapolateRight: 'clamp' });
            const blink = Math.sin(frame * 0.15 + i) > 0.3 ? 1 : 0.5;
            return (
              <g key={`ni${i}`} opacity={niOp * blink}>
                <rect x={ni.x - 80} y={ni.y - 16} width={160} height={32} rx={6}
                  fill="none" stroke="#6B7280" strokeWidth={1} strokeDasharray="4 4" />
                <text x={ni.x} y={ni.y + 5} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={11} fontWeight={600} letterSpacing={1.5}
                  fill="#6B7280">
                  {ni.label}
                </text>
                {/* X icon */}
                <g transform={`translate(${ni.x + 70}, ${ni.y})`}>
                  <line x1={-4} y1={-4} x2={4} y2={4}
                    stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
                  <line x1={4} y1={-4} x2={-4} y2={4}
                    stroke={COLORS.vibrant_red} strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
                </g>
              </g>
            );
          })}

          {/* ── Warning flashes ── */}
          {WARNING_FLASHES.map((wf, i) => {
            const wfOp = interpolate(frame,
              [wf.delay, wf.delay + 5, wf.delay + 10, wf.delay + 15],
              [0, 0.35, 0.35, 0], { extrapolateRight: 'clamp' });
            return (
              <g key={`wf${i}`} transform={`translate(${wf.x}, ${wf.y})`} opacity={wfOp}>
                <text textAnchor="middle" fontSize={wf.size}
                  fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
                  fontWeight={700} fill={COLORS.amber}>
                  ⚠
                </text>
              </g>
            );
          })}

          {/* ── Bottom summary ── */}
          <g opacity={interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' })}>
            <line x1={280} y1={1260} x2={800} y2={1260}
              stroke={COLORS.vibrant_red} strokeWidth={0.8} opacity={0.2} />
            <text x={540} y={1310} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={22} fontWeight={600} fill="#6B7280" opacity={0.65}>
              Reasoning without action = Zero impact
            </text>
            <text x={540} y={1350} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={16} fontWeight={400} fill="#9CA3AF" opacity={0.4}>
              The world remains unchanged
            </text>
          </g>

          {/* ── Decorative separator ── */}
          <line x1={300} y1={1400} x2={780} y2={1400}
            stroke="#9CA3AF" strokeWidth={0.5} opacity={enter * 0.08} />

          {/* ── Caption ── */}
          <CaptionBar
            text="The agent reasons, reasons, reasons, and nothing changes anywhere."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
