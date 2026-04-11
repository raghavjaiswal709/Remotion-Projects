/**
 * Scene 24 — Tomorrow Preview
 * "Tomorrow: Observations" — teaser with eye/observation icons.
 * Mysterious reveal with peeking eye motif and observation symbolism.
 * Duration: 40 frames (~1.33s)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import {
  PaperBackground, CaptionBar, GlobalDefs, CornerBrackets,
  SectionLabel,
} from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── Layout ───────────────────────────────────────────────────────────────
const CX = 540;
const EYE_Y = 680;
const EYE_W = 220;
const EYE_H = 100;

// ── Observation eye (SVG) ────────────────────────────────────────────────
const EYE_OUTER_PATH = `M${CX - EYE_W / 2},${EYE_Y} Q${CX},${EYE_Y - EYE_H} ${CX + EYE_W / 2},${EYE_Y} Q${CX},${EYE_Y + EYE_H} ${CX - EYE_W / 2},${EYE_Y}`;
const IRIS_R = 40;
const PUPIL_R = 18;

// ── Scan lines radiating from eye ────────────────────────────────────────
const SCAN_LINES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    angle,
    innerR: 130,
    outerR: 220 + (i % 3) * 30,
    delay: 10 + i * 0.8,
  };
});

// ── Observation data points ──────────────────────────────────────────────
interface DataPoint {
  x: number;
  y: number;
  label: string;
  delay: number;
  size: number;
}

const DATA_POINTS: DataPoint[] = [
  { x: CX - 280, y: EYE_Y - 200, label: 'STATE', delay: 14, size: 6 },
  { x: CX + 260, y: EYE_Y - 160, label: 'DATA', delay: 16, size: 5 },
  { x: CX - 320, y: EYE_Y + 100, label: 'SIGNAL', delay: 18, size: 7 },
  { x: CX + 300, y: EYE_Y + 140, label: 'INPUT', delay: 20, size: 5 },
  { x: CX - 200, y: EYE_Y + 250, label: 'CHANGE', delay: 22, size: 6 },
  { x: CX + 180, y: EYE_Y + 280, label: 'RESULT', delay: 24, size: 5 },
];

// ── Floating particles ───────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 153.7 + 38) % 1080,
  y: (i * 205.3 + 52) % 1920,
  r: 1 + (i % 3) * 0.5,
  phase: i * 0.37,
}));

// ── Concentric circles (observation rings) ───────────────────────────────
const OBS_RINGS = Array.from({ length: 5 }, (_, i) => ({
  r: 160 + i * 50,
  delay: 6 + i * 2,
  dashArray: `${3 + i} ${8 + i * 2}`,
}));

// ── Preview text elements ────────────────────────────────────────────────
const PREVIEW_TEXTS = [
  { text: 'DAY', x: CX - 80, y: 440, size: 24, weight: 600, color: COLORS.cool_silver, delay: 4 },
  { text: '26', x: CX + 10, y: 440, size: 48, weight: 900, color: COLORS.electric_cyan, delay: 5 },
];

// ── Eyelash / detail strokes ─────────────────────────────────────────────
const EYELASH_STROKES = Array.from({ length: 7 }, (_, i) => {
  const t = (i + 1) / 8;
  const x = CX - EYE_W / 2 + t * EYE_W;
  const curveY = EYE_Y - EYE_H * Math.sin(t * Math.PI);
  return { x, y: curveY, angle: -30 + t * 60, len: 12 + (i % 2) * 6 };
});

// ── Background grid ──────────────────────────────────────────────────────
const BG_GRID = Array.from({ length: 16 }, (_, i) => ({
  x: 120 + (i % 4) * 260,
  y: 450 + Math.floor(i / 4) * 200,
  size: 40,
  phase: i * 0.4,
}));

// ── "Tomorrow" subtitle keywords ─────────────────────────────────────────
const KEYWORDS = [
  { text: 'perceive', x: CX - 180, delay: 18 },
  { text: 'sense', x: CX - 40, delay: 20 },
  { text: 'observe', x: CX + 110, delay: 22 },
  { text: 'watch', x: CX + 240, delay: 24 },
];

// ── Corner eye accents ───────────────────────────────────────────────────
const CORNER_EYES = [
  { x: 120, y: 380, scale: 0.3, delay: 12 },
  { x: 960, y: 380, scale: 0.3, delay: 14 },
  { x: 120, y: 1000, scale: 0.25, delay: 16 },
  { x: 960, y: 1000, scale: 0.25, delay: 18 },
];

// ── Signal wave lines ────────────────────────────────────────────────────
const SIGNAL_WAVES = Array.from({ length: 3 }, (_, i) => ({
  y: EYE_Y + 350 + i * 40,
  amplitude: 15 + i * 5,
  frequency: 0.02 + i * 0.005,
  delay: 20 + i * 3,
}));

// ── Mini eye SVG helper ──────────────────────────────────────────────────
const MiniEye: React.FC<{ cx: number; cy: number; scale: number; opacity: number; frame: number }> = ({
  cx: ex, cy: ey, scale: s, opacity: op, frame: f,
}) => {
  const pupilX = Math.sin(f * 0.1) * 4;
  return (
    <g transform={`translate(${ex}, ${ey}) scale(${s})`} opacity={op}>
      <ellipse cx={0} cy={0} rx={50} ry={24}
        fill="none" stroke={COLORS.electric_cyan} strokeWidth={2} />
      <circle cx={pupilX} cy={0} r={10}
        fill={COLORS.electric_cyan} opacity={0.8} />
      <circle cx={pupilX} cy={0} r={4}
        fill={COLORS.deep_black} />
    </g>
  );
};

// ════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════

export const Scene24_TomorrowPreview: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Global ─────────────────────────────────────────────────────────────
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame * 0.12) * 0.5 + 0.5;
  const pupilTrack = Math.sin(frame * 0.08) * 12;

  // ── Eye open animation ─────────────────────────────────────────────────
  const eyeOpen = interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const irisReveal = interpolate(frame, [8, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="eyeGlow24" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="b" />
              <feFlood floodColor={COLORS.electric_cyan} floodOpacity="0.45" result="c" />
              <feComposite in="c" in2="b" operator="in" result="gc" />
              <feMerge><feMergeNode in="gc" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow24" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="irisGrad24" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#80F0FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor={COLORS.electric_cyan} stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0088AA" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="eyeAura24" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COLORS.electric_cyan} stopOpacity="0" />
            </radialGradient>
            <clipPath id="eyeClip24">
              <path d={EYE_OUTER_PATH} />
            </clipPath>
          </defs>
          <GlobalDefs />
          <CornerBrackets opacity={enter * 0.25} />

          {/* ── Background particles ── */}
          {PARTICLES.map((p, i) => {
            const pOp = Math.sin(frame * 0.04 + p.phase) * 0.15 + 0.2;
            return (
              <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={COLORS.electric_cyan} opacity={enter * pOp * 0.04} />
            );
          })}

          {/* ── Background grid ── */}
          {BG_GRID.map((g, i) => {
            const gOp = Math.sin(frame * 0.03 + g.phase) * 0.03 + 0.04;
            return (
              <rect key={`bg${i}`} x={g.x - g.size / 2} y={g.y - g.size / 2}
                width={g.size} height={g.size} rx={4}
                fill="none" stroke={COLORS.cool_silver}
                strokeWidth={0.4} opacity={enter * gOp} />
            );
          })}

          {/* ── "TOMORROW" label ── */}
          <SectionLabel x={CX} y={200} text="TOMORROW" fontSize={30}
            color={COLORS.electric_cyan} opacity={enter * 0.9}
            underlineColor={COLORS.electric_cyan} />

          {/* ── Day number ── */}
          {PREVIEW_TEXTS.map((pt, i) => (
            <text key={`pt${i}`} x={pt.x} y={pt.y} textAnchor="middle"
              fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
              fontSize={pt.size} fontWeight={pt.weight} letterSpacing={2}
              fill={pt.color}
              opacity={interpolate(frame, [pt.delay, pt.delay + 6], [0, 0.9],
                { extrapolateRight: 'clamp', easing: ease })}>
              {pt.text}
            </text>
          ))}

          {/* ── Topic title ── */}
          <text x={CX} y={510} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={38} fontWeight={900} letterSpacing={6}
            fill={COLORS.electric_cyan}
            opacity={interpolate(frame, [6, 14], [0, 1], { extrapolateRight: 'clamp', easing: ease })}
            filter="url(#softGlow24)">
            OBSERVATIONS
          </text>

          {/* ── Eye aura ── */}
          <circle cx={CX} cy={EYE_Y} r={250}
            fill="url(#eyeAura24)" opacity={eyeOpen} />

          {/* ── Observation rings ── */}
          {OBS_RINGS.map((or, i) => {
            const orOp = interpolate(frame, [or.delay, or.delay + 6], [0, 0.1],
              { extrapolateRight: 'clamp' });
            return (
              <circle key={`or${i}`} cx={CX} cy={EYE_Y} r={or.r}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={1} opacity={orOp * pulse}
                strokeDasharray={or.dashArray} />
            );
          })}

          {/* ── Scan lines ── */}
          {SCAN_LINES.map((sl, i) => {
            const slOp = interpolate(frame, [sl.delay, sl.delay + 5], [0, 0.15],
              { extrapolateRight: 'clamp' });
            const ix = CX + Math.cos(sl.angle) * sl.innerR;
            const iy = EYE_Y + Math.sin(sl.angle) * sl.innerR;
            const ox = CX + Math.cos(sl.angle) * sl.outerR;
            const oy = EYE_Y + Math.sin(sl.angle) * sl.outerR;
            return (
              <line key={`sl${i}`} x1={ix} y1={iy} x2={ox} y2={oy}
                stroke={COLORS.electric_cyan} strokeWidth={0.8}
                strokeLinecap="round" opacity={slOp * pulse} />
            );
          })}

          {/* ═══════════════ THE EYE ═══════════════ */}
          <g opacity={eyeOpen}>
            {/* Eye outline */}
            <path d={EYE_OUTER_PATH} fill="none"
              stroke={COLORS.electric_cyan} strokeWidth={3}
              filter="url(#eyeGlow24)" />

            {/* Eye fill (dark interior) */}
            <path d={EYE_OUTER_PATH} fill={COLORS.deep_black} opacity={0.85} />

            {/* Iris */}
            <g clipPath="url(#eyeClip24)">
              <circle cx={CX + pupilTrack * 0.3} cy={EYE_Y} r={IRIS_R}
                fill="url(#irisGrad24)" opacity={irisReveal} />

              {/* Iris detail rings */}
              <circle cx={CX + pupilTrack * 0.3} cy={EYE_Y} r={IRIS_R - 8}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={0.8} opacity={irisReveal * 0.4}
                strokeDasharray="3 5" />

              {/* Pupil */}
              <circle cx={CX + pupilTrack * 0.5} cy={EYE_Y} r={PUPIL_R}
                fill={COLORS.deep_black} opacity={irisReveal} />

              {/* Pupil highlight */}
              <circle cx={CX + pupilTrack * 0.5 - 5} cy={EYE_Y - 5} r={5}
                fill="#FFFFFF" opacity={irisReveal * 0.6} />
            </g>

            {/* Eyelash strokes */}
            {EYELASH_STROKES.map((el, i) => (
              <line key={`el${i}`}
                x1={el.x} y1={el.y}
                x2={el.x + Math.cos((el.angle * Math.PI) / 180) * el.len}
                y2={el.y - Math.abs(Math.sin((el.angle * Math.PI) / 180)) * el.len}
                stroke={COLORS.electric_cyan} strokeWidth={1.5}
                strokeLinecap="round" opacity={0.3} />
            ))}
          </g>

          {/* ── Data points ── */}
          {DATA_POINTS.map((dp, i) => {
            const dpOp = interpolate(frame, [dp.delay, dp.delay + 5], [0, 0.7],
              { extrapolateRight: 'clamp', easing: ease });
            return (
              <g key={`dp${i}`} opacity={dpOp}>
                {/* Connection to eye */}
                <line x1={CX} y1={EYE_Y} x2={dp.x} y2={dp.y}
                  stroke={COLORS.electric_cyan} strokeWidth={0.6}
                  strokeDasharray="3 8" opacity={0.15} />
                <circle cx={dp.x} cy={dp.y} r={dp.size}
                  fill={COLORS.electric_cyan} opacity={0.3 + pulse * 0.2} />
                <text x={dp.x} y={dp.y + dp.size + 14} textAnchor="middle"
                  fontFamily="SF Mono, Menlo, monospace"
                  fontSize={8} fontWeight={700} letterSpacing={2}
                  fill={COLORS.electric_cyan} opacity={0.5}>
                  {dp.label}
                </text>
              </g>
            );
          })}

          {/* ── Corner eyes ── */}
          {CORNER_EYES.map((ce, i) => {
            const ceOp = interpolate(frame, [ce.delay, ce.delay + 5], [0, 0.4],
              { extrapolateRight: 'clamp' });
            return (
              <MiniEye key={`ce${i}`} cx={ce.x} cy={ce.y}
                scale={ce.scale} opacity={ceOp} frame={frame} />
            );
          })}

          {/* ── Keywords ── */}
          {KEYWORDS.map((kw, i) => {
            const kwOp = interpolate(frame, [kw.delay, kw.delay + 4], [0, 0.5],
              { extrapolateRight: 'clamp' });
            return (
              <text key={`kw${i}`} x={kw.x} y={EYE_Y + 370} textAnchor="middle"
                fontFamily="SF Mono, Menlo, monospace"
                fontSize={11} fontWeight={600} letterSpacing={2}
                fill={COLORS.electric_cyan} opacity={kwOp}>
                {kw.text}
              </text>
            );
          })}

          {/* ── Signal waves ── */}
          {SIGNAL_WAVES.map((sw, i) => {
            const swOp = interpolate(frame, [sw.delay, sw.delay + 6], [0, 0.1],
              { extrapolateRight: 'clamp' });
            const points = Array.from({ length: 60 }, (_, j) => {
              const px = 100 + j * 15;
              const py = sw.y + Math.sin(j * sw.frequency * 50 + frame * 0.1) * sw.amplitude;
              return `${px},${py}`;
            }).join(' ');
            return (
              <polyline key={`sw${i}`} points={points}
                fill="none" stroke={COLORS.electric_cyan}
                strokeWidth={0.8} opacity={swOp} />
            );
          })}

          {/* ── Teaser text ── */}
          <text x={CX} y={EYE_Y + 450} textAnchor="middle"
            fontFamily="SF Pro Display, Inter, system-ui, sans-serif"
            fontSize={15} fontWeight={500}
            fill={COLORS.cool_silver}
            opacity={interpolate(frame, [28, 36], [0, 0.5], { extrapolateRight: 'clamp' })}>
            How agents perceive the world around them
          </text>

          {/* ── Caption ── */}
          <CaptionBar
            text="Tomorrow: Observations — how agents perceive the world."
            opacity={captionOp}
          />
        </svg>
      </PaperBackground>
    </AbsoluteFill>
  );
};
